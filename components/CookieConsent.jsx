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

function killAutoAds() {
  // Remove any auto-injected ad elements not inside our .ad-container
  document.querySelectorAll('ins.adsbygoogle:not(.ad-container ins)').forEach((el) => el.remove());
  // Remove fixed-position overlays (vignettes, anchors) injected by auto ads
  document.querySelectorAll('body > div[style*="position: fixed"], body > div[style*="position:fixed"]').forEach((el) => {
    if (!el.classList.contains('cookie-banner') && !el.closest('.ad-container')) el.remove();
  });

  // Watch for future auto ad injections and kill them
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        // Auto-injected ins outside our container
        if (node.tagName === 'INS' && node.classList.contains('adsbygoogle') && !node.closest('.ad-container')) {
          node.remove();
          continue;
        }
        // Fixed overlays (vignettes/anchors)
        const style = node.getAttribute?.('style') || '';
        if (node.parentElement === document.body && /position:\s*fixed/i.test(style) && !node.classList.contains('cookie-banner')) {
          node.remove();
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function loadAdSense() {
  if (!document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
    const s = document.createElement('script');
    // Load WITHOUT ?client= param to prevent Auto Ads (vignettes, anchors, overlays).
    // Manual ad units get the client ID from data-ad-client on each <ins> tag.
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.onload = () => {
      killAutoAds();
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
