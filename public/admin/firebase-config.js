// public/admin/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyB1OJrnV1feRYUcUvzOLCiGaN_1w3dEut8",
  authDomain: "cinenovatv.firebaseapp.com",
  projectId: "cinenovatv",
  storageBucket: "cinenovatv.firebasestorage.app",
  messagingSenderId: "151330277063",
  appId: "1:151330277063:web:f3766dc9c2ac5f68fc20e2",
  measurementId: "G-9GTVV8JYFQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
