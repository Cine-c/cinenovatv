import { useEffect, useRef, useState } from 'react';
import { ADSENSE_CLIENT } from './CookieConsent';

export default function PreRollOverlay({ onSkip }) {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [adSize, setAdSize] = useState(null);
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
    // Use 90% of overlay width, cap height to leave room for countdown/skip
    const w = Math.floor(rect.width * 0.9);
    const h = Math.floor(rect.height * 0.75);
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

    // Small delay to ensure the ins element is in the DOM with correct dimensions
    const timer = setTimeout(() => {
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
        // Store cleanup ref
        timer._cleanup = () => window.removeEventListener('adsenseReady', handleReady);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (timer._cleanup) timer._cleanup();
    };
  }, [adSize]);

  // Auto-dismiss if ad doesn't fill within 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      const ins = adRef.current?.querySelector('ins.adsbygoogle');
      if (!ins) { onSkipRef.current(); return; }
      const status = ins.getAttribute('data-ad-status');
      if (status === 'unfilled' || (!status && ins.innerHTML.trim() === '')) {
        onSkipRef.current();
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  // Hard fallback: always dismiss after 15 seconds no matter what
  useEffect(() => {
    const timeout = setTimeout(() => onSkipRef.current(), 15000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="pre-roll-overlay" ref={overlayRef}>
      {/* Always-visible close button */}
      <button className="pre-roll-close-btn" onClick={onSkip} aria-label="Close ad">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
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
