import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getConsentStatus, ADSENSE_CLIENT } from './CookieConsent';
import { useAdFree } from './AdFreeContext';

// Manual ad size presets (high-performing formats)
const AD_SIZES = {
  leaderboard:       { width: 728, height: 90 },
  rectangle:         { width: 300, height: 250 },
  'large-rectangle': { width: 336, height: 280 },
  'mobile-banner':   { width: 320, height: 100 },
};

// Native AdSense formats
const NATIVE_FORMATS = {
  'in-article': { format: 'fluid', layoutKey: '-gw-3+1f-3d+2z' },
  'in-feed':    { format: 'fluid', layoutKey: '-fb+5w+4e-db+86' },
};

/**
 * @param {string} [slot] - AdSense ad slot ID
 * @param {string} [format='auto'] - 'auto', a size preset, or a native format ('in-article'/'in-feed')
 * @param {boolean} [responsive=true] - Enable responsive sizing
 */
export default function AdSlot({ slot, format = 'auto', responsive = true }) {
  const router = useRouter();
  const { adFree } = useAdFree();

  if (adFree) return null;

  const preset = AD_SIZES[format];
  const native = NATIVE_FORMATS[format];

  return (
    <AdSlotInner
      key={router.asPath}
      slot={slot}
      format={preset || native ? undefined : format}
      responsive={preset || native ? false : responsive}
      preset={preset}
      native={native}
    />
  );
}

function AdSlotInner({ slot, format, responsive, preset, native }) {
  const adRef = useRef(null);
  const pushed = useRef(false);
  const retried = useRef(false);
  const [consented, setConsented] = useState(false);
  const [inView, setInView] = useState(false);
  const [adFailed, setAdFailed] = useState(false);

  // Track consent status
  useEffect(() => {
    setConsented(getConsentStatus() === 'accepted');

    const handleConsent = (e) => setConsented(e.detail === 'accepted');
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

  // Lazy load: only mark in-view when the ad container enters the viewport
  useEffect(() => {
    const el = adRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [consented]);

  // Push the ad only when: consented + in viewport + adsbygoogle is ready
  useEffect(() => {
    if (!consented || !inView || pushed.current) return;

    const pushAd = () => {
      if (pushed.current) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;

        // Check if the ad filled after a delay, retry once if empty
        setTimeout(() => {
          const ins = adRef.current?.querySelector?.('ins.adsbygoogle') || adRef.current;
          if (ins && ins.dataset.adStatus === 'unfilled' && !retried.current) {
            retried.current = true;
            pushed.current = false;
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              pushed.current = true;
            } catch {
              setAdFailed(true);
            }
          }
        }, 3000);
      } catch (e) {
        if (!retried.current) {
          retried.current = true;
          // Retry once after 2s if first push fails
          setTimeout(() => {
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              pushed.current = true;
            } catch {
              setAdFailed(true);
            }
          }, 2000);
        } else {
          setAdFailed(true);
        }
      }
    };

    if (window.adsbygoogle) {
      pushAd();
      return;
    }

    const handleReady = () => pushAd();
    window.addEventListener('adsenseReady', handleReady);
    return () => window.removeEventListener('adsenseReady', handleReady);
  }, [consented, inView]);

  if (!ADSENSE_CLIENT || !consented) {
    return (
      <div className="ad-container">
        <div className="ad-placeholder">Advertisement</div>
      </div>
    );
  }

  // If ad failed after retry, collapse the container gracefully
  if (adFailed) {
    return <div className="ad-container ad-collapsed" />;
  }

  // Build styles and data attributes based on format type
  let adStyle;
  let extraProps = {};

  if (native) {
    adStyle = { display: 'block', textAlign: 'center' };
    extraProps['data-ad-format'] = native.format;
    extraProps['data-ad-layout-key'] = native.layoutKey;
  } else if (preset) {
    adStyle = { display: 'inline-block', width: preset.width, height: preset.height };
  } else {
    adStyle = { display: 'block' };
    if (format) extraProps['data-ad-format'] = format;
    if (responsive) extraProps['data-full-width-responsive'] = true;
  }

  return (
    <div className="ad-container" ref={adRef}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        {...extraProps}
      />
    </div>
  );
}
