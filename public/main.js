import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: window._env_.FIREBASE_API_KEY,
  authDomain: window._env_.FIREBASE_AUTH_DOMAIN,
  projectId: window._env_.FIREBASE_PROJECT_ID,
  storageBucket: window._env_.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: window._env_.FIREBASE_MESSAGING_SENDER_ID,
  appId: window._env_.FIREBASE_APP_ID,
  measurementId: window._env_.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
