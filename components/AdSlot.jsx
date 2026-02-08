import { useEffect, useRef } from 'react';

export default function AdSlot({ slot, format = 'auto', responsive = true }) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({});
        pushed.current = true;
      }
    } catch (e) {
      // AdSense not loaded yet - show placeholder
    }
  }, []);

  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  if (!adClient) {
    return (
      <div className="ad-container">
        <div className="ad-placeholder">Advertisement</div>
      </div>
    );
  }

  return (
    <div className="ad-container">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
