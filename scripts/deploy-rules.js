/**
 * Deploy Firestore security rules via REST API (no Firebase CLI needed).
 * Usage: node scripts/deploy-rules.js
 */

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const PROJECT_ID = 'cinenovatv-1e11a';

async function getAccessToken() {
  const email = process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyPem = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  if (!email || !privateKeyPem) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_EMAIL or FIREBASE_PRIVATE_KEY in .env');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/firebase',
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
  if (!data.access_token) throw new Error(`Token failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function main() {
  console.log('1. Getting access token...');
  const token = await getAccessToken();
  console.log('   OK\n');

  const rulesPath = path.resolve(__dirname, '..', 'firestore.rules');
  const rules = fs.readFileSync(rulesPath, 'utf8');
  console.log(`2. Read firestore.rules (${rules.length} chars)\n`);

  console.log('3. Creating ruleset...');
  const createRes = await fetch(
    `https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/rulesets`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: {
          files: [{ name: 'firestore.rules', content: rules }],
        },
      }),
    }
  );

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Failed to create ruleset: ${createRes.status} ${err}`);
  }

  const ruleset = await createRes.json();
  console.log(`   Created: ${ruleset.name}\n`);

  console.log('4. Releasing ruleset...');
  const releaseRes = await fetch(
    `https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/releases/cloud.firestore`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `projects/${PROJECT_ID}/releases/cloud.firestore`,
        rulesetName: ruleset.name,
      }),
    }
  );

  if (!releaseRes.ok) {
    // Try creating instead of patching
    const createReleaseRes = await fetch(
      `https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/releases`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `projects/${PROJECT_ID}/releases/cloud.firestore`,
          rulesetName: ruleset.name,
        }),
      }
    );

    if (!createReleaseRes.ok) {
      const err = await createReleaseRes.text();
      throw new Error(`Failed to release: ${createReleaseRes.status} ${err}`);
    }
  }

  console.log('   Released!\n');
  console.log('Done! Firestore rules deployed successfully.');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
