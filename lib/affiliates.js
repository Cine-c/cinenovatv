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
