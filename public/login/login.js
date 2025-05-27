import { app } from './firebase-config.js';
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth(app);

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      window.location.href = 'admin.html'; // Redirect to admin dashboard
    })
    .catch(error => {
      alert("Login failed: " + error.message);
    });
});
