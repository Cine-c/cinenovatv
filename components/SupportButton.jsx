import { DONATION_URLS } from '../lib/affiliates';

function trackClick(platform) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'donation_click', {
      event_category: 'Support',
      event_label: platform,
    });
  }
}

export default function SupportButton({ variant = 'default' }) {
  if (!DONATION_URLS.kofi && !DONATION_URLS.buymeacoffee) return null;

  return (
    <div className={`support-buttons support-${variant}`}>
      {DONATION_URLS.kofi && (
        <a
          href={DONATION_URLS.kofi}
          target="_blank"
          rel="noopener noreferrer"
          className="support-btn support-kofi"
          onClick={() => trackClick('kofi')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z"/>
          </svg>
          Ko-fi
        </a>
      )}
      {DONATION_URLS.buymeacoffee && (
        <a
          href={DONATION_URLS.buymeacoffee}
          target="_blank"
          rel="noopener noreferrer"
          className="support-btn support-bmac"
          onClick={() => trackClick('buymeacoffee')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4h14v2H4V4zm0 4h14v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8zm16 1h-2v4h2a2 2 0 000-4z"/>
          </svg>
          Buy Me a Coffee
        </a>
      )}
    </div>
  );
}
