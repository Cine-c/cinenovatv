const fs = require('fs');
const path = require('path');

const configContent = `
window.__FIREBASE_CONFIG__ = {
  apiKey: "${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}",
  authDomain: "${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}",
  projectId: "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}",
  storageBucket: "${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}",
  measurementId: "${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}"
};

window.__IMGBB_API_KEY__ = "${process.env.NEXT_PUBLIC_IMGBB_API_KEY}";
`;

fs.writeFileSync(path.resolve(__dirname, '../public/config.js'), configContent);

console.log('config.js generated successfully!');
