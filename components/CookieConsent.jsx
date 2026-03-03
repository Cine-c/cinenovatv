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
    // 1. Listen for Google Funding Choices consent via googlefc callback
    if (typeof window.googlefc !== 'undefined') {
      window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
      window.googlefc.callbackQueue.push({
        CONSENT_API_READY: () => {
          // Google CMP is ready — now listen via TCF API
          listenTcf();
        },
      });
    }

    // 2. Also try TCF API directly (may already be available)
    listenTcf();

    // 3. Fallback: if no TCF API after 3s (non-EU traffic), check localStorage
    const fallbackTimer = setTimeout(() => {
      if (typeof window.__tcfapi !== 'function') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'accepted') {
          grantConsent();
          loadAdSense();
        } else if (!stored) {
          // Non-EU user with no prior consent: grant by default
          // (Google CMP only shows dialog in regulated regions)
          onConsentGranted();
        }
      }
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  return null;
}

function listenTcf() {
  if (typeof window.__tcfapi !== 'function') return;

  window.__tcfapi('addEventListener', 2, (tcData, success) => {
    if (!success) return;

    if (
      tcData.eventStatus === 'useractioncomplete' ||
      tcData.eventStatus === 'tcloaded'
    ) {
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
