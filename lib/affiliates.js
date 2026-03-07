// Central affiliate & revenue configuration
// Replace each TODO placeholder after creating accounts on each platform

// Amazon Associates — replace with your tag from https://affiliate-program.amazon.com/
export const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || 'cinenovatv-20';

// Donation platforms — replace with your profile URLs
export const DONATION_URLS = {
  kofi: process.env.NEXT_PUBLIC_KOFI_URL || 'https://ko-fi.com/cinenovatv',
  buymeacoffee: process.env.NEXT_PUBLIC_BMAC_URL || 'https://www.buymeacoffee.com/cinenovatv',
};

// Newsletter — set endpoint after setting up Mailchimp/ConvertKit/Buttondown
export const NEWSLETTER_ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT || '';

// Premium subscription pricing (UI only until payment processor is wired up)
export const PREMIUM_PRICING = {
  monthly: { price: 0.99, label: '$0.99/mo' },
};

export function getAmazonSearchUrl(title, year) {
  if (!AMAZON_TAG) return '';
  const query = encodeURIComponent(`${title} ${year || ''} movie`.trim());
  return `https://www.amazon.com/s?k=${query}&tag=${AMAZON_TAG}`;
}

// TMDB provider_id → search URL builder
// Amazon variants use affiliate tag; others are plain search links.
// Returns null for unmapped providers (card stays non-clickable).
const PROVIDER_URL_BUILDERS = {
  8:    (q) => `https://www.netflix.com/search?q=${q}`,
  9:    (q) => `https://www.amazon.com/s?k=${q}&i=instant-video&tag=${AMAZON_TAG}`,
  10:   (q) => `https://www.amazon.com/s?k=${q}&i=instant-video&tag=${AMAZON_TAG}`,
  337:  (q) => `https://www.disneyplus.com/search/${q}`,
  15:   (q) => `https://www.hulu.com/search?q=${q}`,
  1899: (q) => `https://play.max.com/search?q=${q}`,
  384:  (q) => `https://play.max.com/search?q=${q}`,
  350:  (q) => `https://tv.apple.com/search?term=${q}`,
  2:    (q) => `https://tv.apple.com/search?term=${q}`,
  531:  (q) => `https://www.paramountplus.com/search/?q=${q}`,
  386:  (q) => `https://www.peacocktv.com/search?q=${q}`,
  3:    (q) => `https://play.google.com/store/search?q=${q}&c=movies`,
  192:  (q) => `https://www.youtube.com/results?search_query=${q}+movie`,
};

const AMAZON_PROVIDER_IDS = new Set([9, 10]);

export function getProviderDeepLink(providerId, movieTitle, movieYear) {
  const builder = PROVIDER_URL_BUILDERS[providerId];
  if (!builder) return null;
  const query = encodeURIComponent(`${movieTitle} ${movieYear || ''}`.trim());
  return builder(query);
}

export function isAmazonProvider(providerId) {
  return AMAZON_PROVIDER_IDS.has(providerId);
}
