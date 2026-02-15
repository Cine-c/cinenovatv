import { useEffect, useRef, useState } from 'react';
import { getConsentStatus, TABOOLA_PUBLISHER } from './CookieConsent';

export default function TaboolaWidget({
  mode = 'thumbnails-a',
  placement = 'Below Article Thumbnails',
  containerId = 'taboola-below-article-thumbnails',
}) {
  const [consented, setConsented] = useState(false);
  const pushed = useRef(false);

  useEffect(() => {
    setConsented(getConsentStatus() === 'accepted');

    const handleConsent = (e) => {
      setConsented(e.detail === 'accepted');
    };
    const handleStorage = (e) => {
      if (e.key === 'cookieConsent') {
        setConsented(e.newValue === 'accepted');
      }
    };
    window.addEventListener('consentChange', handleConsent);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('consentChange', handleConsent);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!consented || pushed.current) return;

    const interval = setInterval(() => {
      if (window._taboola) {
        window._taboola.push({
          mode,
          container: containerId,
          placement,
          target_type: 'mix',
        });
        pushed.current = true;
        clearInterval(interval);
      }
    }, 500);

    const timeout = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [consented, mode, containerId, placement]);

  if (!consented) {
    return (
      <div className="taboola-container">
        <div className="taboola-placeholder">Recommended Content</div>
      </div>
    );
  }

  return (
    <div className="taboola-container">
      <div id={containerId} />
    </div>
  );
}
