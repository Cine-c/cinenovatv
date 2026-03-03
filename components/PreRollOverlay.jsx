import { useEffect, useRef, useState } from 'react';
import { ADSENSE_CLIENT } from './CookieConsent';

const SKIP_DELAY = 3; // seconds to hold ad after it fills (enough for impression)

export default function PreRollOverlay({ onSkip }) {
  const [countdown, setCountdown] = useState(null); // null = waiting for ad
  const [canSkip, setCanSkip] = useState(false);
  const [adSize, setAdSize] = useState(null);
  const [adFilled, setAdFilled] = useState(false);
  const pushed = useRef(false);
  const overlayRef = useRef(null);
  const adRef = useRef(null);
  const onSkipRef = useRef(onSkip);
  onSkipRef.current = onSkip;

  // Measure overlay to give the ins element explicit pixel dimensions
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const w = Math.floor(rect.width * 0.9);
    const h = Math.floor(rect.height * 0.7);
    setAdSize({ width: w, height: h });
  }, []);

  // Push AdSense ad once we have dimensions
  useEffect(() => {
    if (!adSize || pushed.current) return;

    let cleanupListener = null;

    const timer = setTimeout(() => {
      if (pushed.current) return;

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
      } else {
        const handleReady = () => pushAd();
        window.addEventListener('adsenseReady', handleReady);
        cleanupListener = () => window.removeEventListener('adsenseReady', handleReady);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (cleanupListener) cleanupListener();
    };
  }, [adSize]);

  // Poll for ad fill — only start countdown once the ad is actually visible
  useEffect(() => {
    if (!adSize) return;

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
  }, [adSize]);

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

  // If ad never fills within 10s (adblocker, no inventory), dismiss
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!adFilled) onSkipRef.current();
    }, 10000);

    return () => clearTimeout(timeout);
  }, [adFilled]);

  return (
    <div className="pre-roll-overlay" ref={overlayRef}>
      {/* Always-visible close button — top right */}
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
        {adSize && (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: adSize.width, height: adSize.height }}
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
