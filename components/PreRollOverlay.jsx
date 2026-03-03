import { useEffect, useRef, useState } from 'react';
import { ADSENSE_CLIENT } from './CookieConsent';

export default function PreRollOverlay({ onSkip }) {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [adSize, setAdSize] = useState(null);
  const pushed = useRef(false);
  const adFilledRef = useRef(false);
  const [adPushed, setAdPushed] = useState(false);
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
          setAdPushed(true);
        } catch {
          // AdSense push failed — dismiss overlay
          onSkipRef.current();
        }
      };

      if (window.adsbygoogle) {
        pushAd();
      } else {
        const handleReady = () => pushAd();
        window.addEventListener('adsenseReady', handleReady);
        cleanupListener = () => window.removeEventListener('adsenseReady', handleReady);

        // If AdSense never loads (adblocker), dismiss after 5s
        setTimeout(() => {
          if (!pushed.current) onSkipRef.current();
        }, 5000);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (cleanupListener) cleanupListener();
    };
  }, [adSize]);

  // Check if ad filled — poll and track via ref
  useEffect(() => {
    if (!adSize) return;

    const interval = setInterval(() => {
      const ins = adRef.current?.querySelector('ins.adsbygoogle');
      if (!ins) return;
      const status = ins.getAttribute('data-ad-status');
      if (status === 'filled' && ins.offsetHeight > 10) {
        adFilledRef.current = true;
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [adSize]);

  // Auto-dismiss 6s after ad was pushed if it never filled (localhost / no inventory)
  useEffect(() => {
    if (!adPushed) return;
    const timeout = setTimeout(() => {
      if (!adFilledRef.current) {
        onSkipRef.current();
      }
    }, 6000);

    return () => clearTimeout(timeout);
  }, [adPushed]);

  // Hard fallback: always dismiss after 15 seconds no matter what
  useEffect(() => {
    const timeout = setTimeout(() => onSkipRef.current(), 15000);
    return () => clearTimeout(timeout);
  }, []);

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
        Ad &middot; 0:0{countdown}
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
