import { useState, useEffect } from 'react';

const GA_ID = 'G-81S7GHHRSB';
export const ADSENSE_CLIENT = 'ca-pub-8747979755893623';
export const TABOOLA_PUBLISHER = 'your-taboola-publisher-id';
const STORAGE_KEY = 'cookieConsent';
const CONSENT_EVENT = 'consentChange';

export function getConsentStatus() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

function initConsentMode() {
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  });
}

function grantConsent() {
  window.gtag('consent', 'update', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
  });
}

function loadScripts() {
  // Load Google Analytics (skip if already loaded)
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"]`)) {
    const gaScript = document.createElement('script');
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    gaScript.async = true;
    document.head.appendChild(gaScript);
  }

  window.gtag('js', new Date());
  window.gtag('config', GA_ID);

  // Load Google AdSense (skip if already loaded)
  if (!document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
    const adsScript = document.createElement('script');
    adsScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    adsScript.async = true;
    adsScript.crossOrigin = 'anonymous';
    document.head.appendChild(adsScript);
  }

  // Load Taboola (skip if already loaded)
  window._taboola = window._taboola || [];
  if (!document.querySelector('script[src*="cdn.taboola.com"]')) {
    const taboolaScript = document.createElement('script');
    taboolaScript.src = `https://cdn.taboola.com/libtrc/${TABOOLA_PUBLISHER}/loader.js`;
    taboolaScript.async = true;
    document.head.appendChild(taboolaScript);
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    initConsentMode();

    const consent = getConsentStatus();
    if (consent === 'accepted') {
      grantConsent();
      loadScripts();
    } else if (!consent) {
      setVisible(true);
    }

    const handleOpenSettings = () => setVisible(true);
    window.addEventListener('openCookieSettings', handleOpenSettings);
    return () => window.removeEventListener('openCookieSettings', handleOpenSettings);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    grantConsent();
    loadScripts();
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: 'accepted' }));
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(STORAGE_KEY, 'rejected');
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: 'rejected' }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="cookie-banner-content">
        <p className="cookie-banner-text">
          We use cookies for analytics and advertising. You can accept or reject non-essential cookies.
        </p>
        <div className="cookie-banner-actions">
          <button className="btn btn-primary cookie-btn" onClick={handleAccept}>
            Accept
          </button>
          <button className="cookie-btn cookie-btn-reject" onClick={handleReject}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
