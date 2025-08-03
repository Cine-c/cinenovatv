import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

// Your Firebase config (replace with your actual keys)
const firebaseConfig = {
  apiKey: "AIzaSyD9p5xhp8WDeKfJlzqcZAztsXRkMalwWdo",
  authDomain: "cinenova88.firebaseapp.com",
  projectId: "cinenova88",
  storageBucket: "cinenova88.appspot.com",
  messagingSenderId: "253784034080",
  appId: "1:253784034080:web:22891b0b4e6e2f6ffd6545",
};

// Initialize Firebase app and Firestore instance
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
