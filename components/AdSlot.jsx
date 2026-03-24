import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getConsentStatus, ADSENSE_CLIENT } from './CookieConsent';
import { useAdFree } from './useAdFree';

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
  const [consented, setConsented] = useState(() => {
    if (typeof window === 'undefined') return false;
    const s = getConsentStatus();
    return s === 'accepted' || s === 'npa';
  });
  const [inView, setInView] = useState(false);

  // Listen for consent changes
  useEffect(() => {
    // Re-check on mount (covers SSR hydration)
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

  // Track viewport visibility — runs immediately, doesn't wait for consent
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
  }, []);

  // Push ad when both consent and visibility are ready
  useEffect(() => {
    if (!consented || !inView || pushed.current) return;

    const pushAd = () => {
      if (pushed.current) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        // AdSense push failed — ad slot stays empty
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

  if (!ADSENSE_CLIENT) return null;

  // Always render the container div so IntersectionObserver can track it.
  // Only render the <ins> tag when consent is granted.
  let adStyle = { display: 'block' };
  let extraProps = {};

  if (native) {
    adStyle = { display: 'block', textAlign: 'center' };
    extraProps['data-ad-format'] = native.format;
    extraProps['data-ad-layout-key'] = native.layoutKey;
  } else {
    extraProps['data-ad-format'] = format || 'auto';
    extraProps['data-full-width-responsive'] = 'true';
  }

  return (
    <div className="ad-container" ref={adRef}>
      {consented && (
        <>
          <span className="ad-label">Ad</span>
          <ins
            className="adsbygoogle"
            style={adStyle}
            data-ad-client={ADSENSE_CLIENT}
            {...(slot ? { 'data-ad-slot': slot } : {})}
            {...extraProps}
          />
        </>
      )}
    </div>
  );
}
