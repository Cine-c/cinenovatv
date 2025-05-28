// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuAbMU5SYXJ3i9hw86rqUft2SeZJQOlfY",
  authDomain: "cinenovatv-66478.firebaseapp.com",
  projectId: "cinenovatv-66478",
  storageBucket: "cinenovatv-66478.firebasestorage.app",
  messagingSenderId: "209338168342",
  appId: "1:209338168342:web:6c38766dc658ecfd817137",
  measurementId: "G-NXB2GVL4X8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);