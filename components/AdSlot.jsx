import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getConsentStatus, ADSENSE_CLIENT } from './CookieConsent';
import { useAdFree } from './AdFreeContext';

// Native AdSense formats (fluid, blend with content)
const NATIVE_FORMATS = {
  'in-article': { format: 'fluid', layoutKey: '-gw-3+1f-3d+2z' },
  'in-feed':    { format: 'fluid', layoutKey: '-fb+5w+4e-db+86' },
};

export default function AdSlot({ slot, format = 'auto', responsive = true }) {
  const router = useRouter();
  const { adFree } = useAdFree();

  if (adFree) return null;

  const native = NATIVE_FORMATS[format];

  return (
    <AdSlotInner
      key={router.asPath}
      slot={slot}
      format={native ? undefined : format}
      responsive={native ? false : responsive}
      native={native}
    />
  );
}

function AdSlotInner({ slot, format, responsive, native }) {
  const adRef = useRef(null);
  const pushed = useRef(false);
  const retried = useRef(false);
  const [consented, setConsented] = useState(false);
  const [inView, setInView] = useState(false);
  const [adFailed, setAdFailed] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

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

  useEffect(() => {
    if (!consented || !inView || pushed.current) return;

    const pushAd = () => {
      if (pushed.current) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;

        setTimeout(() => {
          const ins = adRef.current?.querySelector?.('ins.adsbygoogle') || adRef.current;
          const status = ins?.dataset?.adStatus;
          if (status === 'unfilled' && !retried.current) {
            retried.current = true;
            pushed.current = false;
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              pushed.current = true;
            } catch {
              setAdFailed(true);
            }
          }
          if (status === 'filled') setAdLoaded(true);
        }, 3000);
      } catch (e) {
        if (!retried.current) {
          retried.current = true;
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

  // Show nothing until consent is given — no placeholder, no gap
  if (!ADSENSE_CLIENT || !consented) return null;

  // Collapse completely if the ad failed
  if (adFailed) return null;

  let adStyle = { display: 'block' };
  let extraProps = {};

  if (native) {
    adStyle = { display: 'block', textAlign: 'center' };
    extraProps['data-ad-format'] = native.format;
    extraProps['data-ad-layout-key'] = native.layoutKey;
  } else {
    if (format) extraProps['data-ad-format'] = format;
    extraProps['data-full-width-responsive'] = false;
  }

  return (
    <div className={`ad-container${adLoaded ? ' ad-visible' : ''}`} ref={adRef}>
      <span className="ad-label">Ad</span>
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
