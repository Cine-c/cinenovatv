import { useEffect } from 'react';

export const ADSENSE_CLIENT = 'ca-pub-8747979755893623';

const STORAGE_KEY = 'cookieConsent';
const CONSENT_EVENT = 'consentChange';

/**
 * Check consent status via TCF API (Google CMP) with localStorage fallback.
 * Returns 'accepted', 'rejected', or null (unknown / not yet decided).
 */
export function getConsentStatus() {
  if (typeof window === 'undefined') return null;

  // Try TCF API first (set by Google Funding Choices CMP)
  if (typeof window.__tcfapi === 'function') {
    // Synchronous check via cached tcData if available
    if (window.__tcfapiConsentCache !== undefined) {
      return window.__tcfapiConsentCache;
    }
  }

  // Fallback: localStorage (for non-EU users or before TCF loads)
  return localStorage.getItem(STORAGE_KEY);
}

function grantConsent() {
  window.gtag?.('consent', 'update', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
  });
}

export function loadAdSense() {
  if (!document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
    const s = document.createElement('script');
    const isAdFree = localStorage.getItem('adFreeMode') === 'true';
    s.src = isAdFree
      ? 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      : `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.onload = () => {
      window.dispatchEvent(new Event('adsenseReady'));
    };
    document.head.appendChild(s);
  }
}

function onConsentGranted() {
  window.__tcfapiConsentCache = 'accepted';
  localStorage.setItem(STORAGE_KEY, 'accepted');
  grantConsent();
  loadAdSense();
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: 'accepted' }));
}

function onConsentDenied() {
  window.__tcfapiConsentCache = 'rejected';
  localStorage.setItem(STORAGE_KEY, 'rejected');
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: 'rejected' }));
}

/**
 * No visible UI — Google Funding Choices renders its own consent dialog.
 * This component listens for TCF consent signals and triggers ad loading.
 */
export default function CookieConsent() {
  useEffect(() => {
    // Fast path: returning user already consented in a previous session
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'accepted') {
      grantConsent();
      loadAdSense();
      return;
    }

    // Clear stale rejections so the CMP can re-evaluate
    if (stored === 'rejected') {
      localStorage.removeItem(STORAGE_KEY);
    }

    let resolved = false;

    // Register TCF event listener once __tcfapi is available
    function registerTcfListener() {
      if (resolved) return;
      if (typeof window.__tcfapi !== 'function') return;

      window.__tcfapi('addEventListener', 2, (tcData, success) => {
        if (!success || resolved) return;

        // Non-EU: GDPR doesn't apply — grant immediately
        if (tcData.gdprApplies === false) {
          resolved = true;
          onConsentGranted();
          return;
        }

        if (
          tcData.eventStatus === 'useractioncomplete' ||
          tcData.eventStatus === 'tcloaded'
        ) {
          resolved = true;
          // Purpose 1 = Store and/or access information on a device
          const purpose1 = tcData.purpose?.consents?.[1];
          if (purpose1) {
            onConsentGranted();
          } else {
            onConsentDenied();
          }
        }
      });
    }

    // Hook into Google Funding Choices callback queue
    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    window.googlefc.callbackQueue.push({
      CONSENT_API_READY: () => registerTcfListener(),
    });

    // Poll for __tcfapi in case CONSENT_API_READY already fired
    const poll = setInterval(() => {
      if (typeof window.__tcfapi === 'function') {
        registerTcfListener();
        clearInterval(poll);
      }
    }, 250);

    // Final fallback after 5s — only if CMP completely failed to load
    const fallback = setTimeout(() => {
      clearInterval(poll);
      if (resolved || localStorage.getItem(STORAGE_KEY)) return;

      if (typeof window.__tcfapi !== 'function') {
        // CMP never loaded (blocked / network error) — grant as fallback
        onConsentGranted();
      }
      // If __tcfapi exists but not resolved, the CMP dialog is visible
      // — do NOT force-grant; let the user interact with it
    }, 5000);

    return () => {
      clearInterval(poll);
      clearTimeout(fallback);
    };
  }, []);

  return null;
}
