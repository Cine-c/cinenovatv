// admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Elements
const loginFormHTML = `
  <form id="loginForm" style="display:flex; flex-direction: column; gap: 1rem; max-width: 300px; margin:auto;">
    <input type="email" id="loginEmail" placeholder="Email" required />
    <input type="password" id="loginPassword" placeholder="Password" required />
    <button type="submit">Login</button>
  </form>
`;

const adminContainer = document.querySelector(".admin-container");
const dashboardBox = document.querySelector(".dashboard-box");

// Show login form if not logged in
function showLogin() {
  dashboardBox.innerHTML = `<h2>Admin Login</h2>` + loginFormHTML;
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.loginEmail.value;
    const password = loginForm.loginPassword.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });
}

// Show dashboard UI when logged in
function showDashboard(user) {
  dashboardBox.innerHTML = `
    <h2>Admin Dashboard</h2>
    <button id="logoutBtn" style="margin-bottom: 1rem;">Logout</button>
    <form id="blogForm">
      <input type="text" id="title" placeholder="Enter blog title" required />
      <textarea id="description" rows="4" placeholder="Enter blog description" required></textarea>
      <input type="text" id="videoUrl" placeholder="Enter TMDB trailer URL" />
      <input type="file" id="imageUpload" accept="image/*" />
      <img id="imagePreview" src="#" alt="" style="display: none; max-height: 120px; margin-top: 10px; border-radius: 8px;" />
      <div class="status" id="uploadStatus"></div>
      <select id="category" required>
        <option value="" disabled selected>Select page/category</option>
        <option value="home">Home</option>
        <option value="trailers">Trailers</option>
        <option value="about">About</option>
        <option value="blog">Blog</option>
      </select>
      <button type="submit">Post Blog</button>
    </form>
    <div class="admin-preview">
      <h3>Preview of Uploaded Blogs</h3>
      <div id="blogList"></div>
    </div>
  `;

  document.getElementById("logoutBtn").onclick = () => {
    signOut(auth);
  };

  const blogForm = document.getElementById("blogForm");
  const imageUpload = document.getElementById("imageUpload");
  const imagePreview = document.getElementById("imagePreview");
  const uploadStatus = document.getElementById("uploadStatus");
  const blogList = document.getElementById("blogList");

  let selectedImageFile = null;

  imageUpload.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
        uploadStatus.textContent = "Image ready for upload";
      };
      reader.readAsDataURL(file);
    }
  });

  // Load blogs from Firestore
  async function loadBlogs() {
    blogList.innerHTML = "Loading...";
    const blogsCol = collection(db, "blogs");
    const snapshot = await getDocs(blogsCol);
    blogList.innerHTML = "";

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const blogId = docSnap.id;

      const card = document.createElement("div");
      card.classList.add("blog-card");
      card.innerHTML = `
        <h4>${data.title}</h4>
        <p>${data.description}</p>
        ${data.imageUrl ? `<img src="${data.imageUrl}" alt="Blog image" style="max-height:100px; border-radius:6px;">` : ""}
        <small>Category: ${data.category}</small>
        <div>
          <button class="delete-btn">Delete</button>
        </div>
      `;

      // Delete button handler
      card.querySelector(".delete-btn").onclick = async () => {
        if (confirm("Delete this blog post?")) {
          await deleteDoc(doc(db, "blogs", blogId));
          card.remove();
        }
      };

      blogList.appendChild(card);
    });

    if (blogList.innerHTML.trim() === "") {
      blogList.innerHTML = "<p>No blogs posted yet.</p>";
    }
  }

  loadBlogs();

  blogForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = blogForm.title.value.trim();
    const description = blogForm.description.value.trim();
    const videoUrl = blogForm.videoUrl.value.trim();
    const category = blogForm.category.value;

    if (!title || !description || !category) {
      alert("Please fill all required fields.");
      return;
    }

    uploadStatus.textContent = "Posting blog...";

    try {
      let imageUrl = null;

      if (selectedImageFile) {
        // Upload image to Firebase Storage
        const imageRef = ref(storage, `blogImages/${Date.now()}_${selectedImageFile.name}`);
        await uploadBytes(imageRef, selectedImageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "blogs"), {
        title,
        description,
        videoUrl,
        category,
        imageUrl, // Store the image URL in Firestore
        createdAt: new Date().toISOString(),
      });

      uploadStatus.textContent = "Blog posted successfully!";
      blogForm.reset();
      imagePreview.style.display = "none";
      selectedImageFile = null;
      loadBlogs();

    } catch (error) {
      uploadStatus.textContent = "Error posting blog: " + error.message;
    }
  });
}

// Watch auth state and switch UI accordingly
onAuthStateChanged(auth, (user) => {
  if (user) {
    showDashboard(user);
  } else {
    showLogin();
  }
});
