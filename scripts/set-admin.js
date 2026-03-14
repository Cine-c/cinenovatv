/**
 * One-time script to set the "admin" custom claim on a Firebase Auth user.
 * This is required for the Firestore security rules that gate blog post writes.
 *
 * Usage:  node scripts/set-admin.js your-email@example.com
 *
 * Requires FIREBASE_SERVICE_ACCOUNT_EMAIL and FIREBASE_PRIVATE_KEY in .env
 */

const path = require('path');

// Load .env from project root
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const PROJECT_ID = 'cinenovatv-1e11a';

async function getAccessToken() {
  const email = process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyPem = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  if (!email || !privateKeyPem) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_EMAIL or FIREBASE_PRIVATE_KEY in .env');
  }

  const crypto = require('crypto');

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/identitytoolkit https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const enc = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsigned = `${enc(header)}.${enc(claim)}`;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsigned);
  const signature = sign.sign(privateKeyPem, 'base64url');

  const jwt = `${unsigned}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await res.json();
  if (!data.access_token) throw new Error(`Token exchange failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function lookupUserByEmail(token, userEmail) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:lookup`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: [userEmail] }),
    }
  );

  const data = await res.json();
  if (!data.users || data.users.length === 0) {
    throw new Error(`No Firebase Auth user found with email: ${userEmail}`);
  }
  return data.users[0];
}

async function setCustomClaims(token, uid, claims) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:update`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        localId: uid,
        customAttributes: JSON.stringify(claims),
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to set custom claims: ${res.status} ${err}`);
  }
  return res.json();
}

async function main() {
  const userEmail = process.argv[2];
  if (!userEmail) {
    console.error('Usage: node scripts/set-admin.js <email>');
    console.error('Example: node scripts/set-admin.js admin@cinenovatv.com');
    process.exit(1);
  }

  console.log(`Setting admin claim for: ${userEmail}\n`);

  console.log('1. Getting access token...');
  const token = await getAccessToken();
  console.log('   OK\n');

  console.log('2. Looking up user...');
  const user = await lookupUserByEmail(token, userEmail);
  console.log(`   Found: uid=${user.localId}\n`);

  console.log('3. Setting admin custom claim...');
  await setCustomClaims(token, user.localId, { admin: true });
  console.log('   OK\n');

  console.log('Done! User is now an admin.');
  console.log('Important: Log out and log back in on /ndochez for the claim to take effect.');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
