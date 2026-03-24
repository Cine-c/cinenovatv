import { useEffect, useRef, useState } from 'react';
import { ADSENSE_CLIENT, getConsentStatus } from './CookieConsent';
import { useAdFree } from './useAdFree';

const SKIP_DELAY = 3; // seconds to hold ad after it fills (enough for impression)

export default function PreRollOverlay({ onSkip }) {
  const [countdown, setCountdown] = useState(null);
  const [canSkip, setCanSkip] = useState(false);
  const [adFilled, setAdFilled] = useState(false);
  const [consented, setConsented] = useState(() => {
    const s = getConsentStatus();
    return s === 'accepted' || s === 'npa';
  });
  const pushed = useRef(false);
  const adRef = useRef(null);
  const onSkipRef = useRef(onSkip);
  onSkipRef.current = onSkip;

  const { adFree } = useAdFree();

  // Consent check — listen for changes
  useEffect(() => {
    const current = getConsentStatus();
    if (current === 'accepted' || current === 'npa') setConsented(true);

    const handleConsent = (e) => setConsented(e.detail === 'accepted' || e.detail === 'npa');
    const handleStorage = (e) => {
      if (e.key === 'cookieConsent') setConsented(e.newValue === 'accepted');
    };

    window.addEventListener('consentChange', handleConsent);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('consentChange', handleConsent);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Skip immediately for ad-free users or rejected consent
  useEffect(() => {
    if (adFree) {
      onSkipRef.current();
      return;
    }

    const consent = getConsentStatus();
    if (consent === 'rejected') {
      onSkipRef.current();
    }
  }, [adFree]);

  // Push ad once consented — same pattern as AdSlot
  useEffect(() => {
    if (!consented || pushed.current) return;

    const pushAd = () => {
      if (pushed.current) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        onSkipRef.current();
      }
    };

    if (window.adsbygoogle) {
      pushAd();
      return;
    }

    const handleReady = () => pushAd();
    window.addEventListener('adsenseReady', handleReady);
    return () => window.removeEventListener('adsenseReady', handleReady);
  }, [consented]);

  // Poll for ad fill — start countdown once ad is visible
  useEffect(() => {
    if (!consented) return;

    const interval = setInterval(() => {
      const ins = adRef.current?.querySelector('ins.adsbygoogle');
      if (!ins) return;
      const status = ins.getAttribute('data-ad-status');
      if (status === 'filled' && ins.offsetHeight > 10) {
        setAdFilled(true);
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [consented]);

  // Start countdown only after ad fills
  useEffect(() => {
    if (!adFilled) return;
    setCountdown(SKIP_DELAY);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [adFilled]);

  // If ad never fills within 8s, dismiss
  useEffect(() => {
    if (adFree) return;

    const timeout = setTimeout(() => {
      if (!adFilled) onSkipRef.current();
    }, 8000);

    return () => clearTimeout(timeout);
  }, [adFree, adFilled]);

  if (adFree) return null;

  return (
    <div className="pre-roll-overlay">
      <button className="pre-roll-close-btn" onClick={onSkip} aria-label="Close ad">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
        <span>Close</span>
      </button>

      <div className="pre-roll-countdown">
        {countdown !== null ? `Ad \u00b7 0:0${countdown}` : 'Loading ad\u2026'}
      </div>

      <div className="pre-roll-ad-container" ref={adRef}>
        {consented && (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center' }}
            data-ad-client={ADSENSE_CLIENT}
            data-ad-slot="9919808615"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
      </div>

      {canSkip && (
        <button className="pre-roll-skip-btn" onClick={onSkip}>
          Skip Ad
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="currentColor" d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
          </svg>
        </button>
      )}
    </div>
  );
}
