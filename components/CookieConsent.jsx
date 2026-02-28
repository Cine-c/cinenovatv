import { useState, useEffect } from 'react';

export const ADSENSE_CLIENT = 'ca-pub-8747979755893623';

const STORAGE_KEY = 'cookieConsent';
const CONSENT_EVENT = 'consentChange';

export function getConsentStatus() {
  if (typeof window === 'undefined') return null;
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

function loadAdSense() {
  if (!document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
    // Disable Auto Ads (vignettes, anchors, overlays) — only use manual placements
    (window.adsbygoogle = window.adsbygoogle || []).push({
      google_ad_client: ADSENSE_CLIENT,
      enable_page_level_ads: false,
    });

    const s = document.createElement('script');
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.onload = () => {
      window.dispatchEvent(new Event('adsenseReady'));
    };
    document.head.appendChild(s);
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getConsentStatus();
    if (consent === 'accepted') {
      grantConsent();
      loadAdSense();
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
    loadAdSense();
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
