import { useEffect, useRef, useState } from 'react';
import { ADSENSE_CLIENT } from './CookieConsent';

export default function PreRollOverlay({ onSkip }) {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const pushed = useRef(false);
  const adRef = useRef(null);

  // Countdown timer
  useEffect(() => {
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
  }, []);

  // Push AdSense ad
  useEffect(() => {
    if (pushed.current) return;

    const pushAd = () => {
      if (pushed.current) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        // AdSense push failed
      }
    };

    if (window.adsbygoogle) {
      pushAd();
    } else {
      const handleReady = () => pushAd();
      window.addEventListener('adsenseReady', handleReady);
      return () => window.removeEventListener('adsenseReady', handleReady);
    }
  }, []);

  // Auto-dismiss if ad doesn't fill within 2 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      const ins = adRef.current?.querySelector('ins.adsbygoogle');
      if (ins && ins.getAttribute('data-ad-status') === 'unfilled') {
        onSkip();
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [onSkip]);

  return (
    <div className="pre-roll-overlay">
      <div className="pre-roll-countdown">
        Ad &middot; 0:0{countdown}
      </div>

      <div className="pre-roll-ad-container" ref={adRef}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot="9919808615"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
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
