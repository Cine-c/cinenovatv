// Verify Firebase ID tokens using Google's public keys (no Admin SDK).
// Works on Cloudflare Workers / edge runtimes with Web Crypto API.

const GOOGLE_CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
const PROJECT_ID = 'cinenovatv-1e11a';

let cachedKeys = null;
let cacheExpiry = 0;

async function getPublicKeys() {
  if (cachedKeys && Date.now() < cacheExpiry) return cachedKeys;

  const res = await fetch(GOOGLE_CERTS_URL);
  const certs = await res.json();

  // Parse cache-control max-age
  const cacheControl = res.headers.get('cache-control') || '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) * 1000 : 3600000;
  cacheExpiry = Date.now() + maxAge;

  cachedKeys = certs;
  return certs;
}

function base64UrlDecode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
  const binary = atob(padded);
  return new Uint8Array([...binary].map((c) => c.charCodeAt(0)));
}

function pemToArrayBuffer(pem) {
  const lines = pem.split('\n').filter((l) => !l.startsWith('-----'));
  const binary = atob(lines.join(''));
  return new Uint8Array([...binary].map((c) => c.charCodeAt(0))).buffer;
}

export async function verifyFirebaseToken(idToken) {
  if (!idToken) throw new Error('No token provided');

  const parts = idToken.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');

  const headerRaw = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[0])));
  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[1])));

  // Check claims before verifying signature
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) throw new Error('Token expired');
  if (payload.iat > now + 300) throw new Error('Token issued in the future');
  if (payload.aud !== PROJECT_ID) throw new Error('Invalid audience');
  if (payload.iss !== `https://securetoken.google.com/${PROJECT_ID}`) throw new Error('Invalid issuer');
  if (!payload.sub) throw new Error('Missing subject');

  // Verify signature
  const certs = await getPublicKeys();
  const cert = certs[headerRaw.kid];
  if (!cert) throw new Error('Unknown signing key');

  const key = await crypto.subtle.importKey(
    'spki',
    pemToArrayBuffer(cert),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const data = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const signature = base64UrlDecode(parts[2]);

  const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, data);
  if (!valid) throw new Error('Invalid signature');

  return { uid: payload.sub, email: payload.email || null };
}
