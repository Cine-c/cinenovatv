import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

import { firebaseConfig } from "./firebase-config.js";

// Firebase Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// DOM Elements
const loginForm = document.getElementById("login-form");
const errorMsg = document.getElementById("error-msg");

const blogList = document.getElementById("blogList");
const blogForm = document.getElementById("blogForm");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const contentInput = document.getElementById("content");
const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("imagePreview");
const statusMsg = document.getElementById("statusMsg");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const logoutBtn = document.getElementById("logoutBtn");

let lastVisible = null;
const PAGE_SIZE = 10;
let editingPostId = null;
let editingImageURL = null;
let isLoading = false;

// Login Form
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      errorMsg.style.display = "none";
    } catch (error) {
      errorMsg.textContent = error.message;
      errorMsg.style.display = "block";
    }
  });
}

// Auth Check
onAuthStateChanged(auth, (user) => {
  if (loginForm && user) window.location.href = "/admin/dashboard.html";
  if (!loginForm && !user) window.location.href = "/admin.html";
});

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "/admin.html";
  });
}

// Reset Form
function resetForm() {
  if (!blogForm) return;
  blogForm.reset();
  imagePreview.src = "#";
  imagePreview.classList.add("hidden");
  submitBtn.textContent = "Post";
  cancelEditBtn.classList.add("hidden");
  editingPostId = null;
  editingImageURL = null;
  statusMsg.textContent = "";
}

// Preview Image
if (imageUpload) {
  imageUpload.addEventListener("change", () => {
    const file = imageUpload.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.src = "#";
      imagePreview.classList.add("hidden");
    }
  });
}

// Load Posts
async function loadPosts(reset = false) {
  if (isLoading || !blogList) return;
  isLoading = true;

  if (reset) {
    lastVisible = null;
    blogList.innerHTML = "Loading posts...";
  }

  let q = query(collection(db, "blogs"), orderBy("createdAt", "desc"), limit(PAGE_SIZE));
  if (lastVisible && !reset) {
    q = query(collection(db, "blogs"), orderBy("createdAt", "desc"), startAfter(lastVisible), limit(PAGE_SIZE));
  }

  const snapshot = await getDocs(q);
  let posts = [];
  snapshot.forEach(doc => posts.push({ id: doc.id, ...doc.data() }));

  const searchText = searchInput?.value.trim().toLowerCase() || "";
  const categoryFilter = filterCategory?.value || "";

  if (categoryFilter) posts = posts.filter(post => post.category === categoryFilter);
  if (searchText) posts = posts.filter(post => post.title.toLowerCase().includes(searchText));

  if (reset) blogList.innerHTML = "";
  if (posts.length === 0 && reset) blogList.innerHTML = "<p>No posts found.</p>";

  posts.forEach(post => {
    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.innerHTML = `
      <h3>${post.title}</h3>
      <p><strong>Category:</strong> ${post.category}</p>
      <p>${post.content}</p>
      ${post.imageURL ? `<img src="${post.imageURL}" alt="Post Image" />` : ""}
      <button class="btn-primary edit-btn" data-id="${post.id}">Edit</button>
      <button class="btn-danger delete-btn" data-id="${post.id}">Delete</button>
    `;
    blogList.appendChild(postDiv);
  });

  lastVisible = snapshot.docs[snapshot.docs.length - 1];
  isLoading = false;
}

// Delete Post
async function deletePost(id) {
  if (!confirm("Are you sure you want to delete this post?")) return;
  try {
    await deleteDoc(doc(db, "blogs", id));
    statusMsg.textContent = "Post deleted.";
    loadPosts(true);
  } catch (e) {
    statusMsg.textContent = "Error deleting post: " + e.message;
  }
}

// Edit Post
async function editPost(id) {
  const snapshot = await getDocs(query(collection(db, "blogs"), where("__name__", "==", id)));
  if (!snapshot.empty) {
    const data = snapshot.docs[0].data();
    editingPostId = id;
    editingImageURL = data.imageURL || null;
    titleInput.value = data.title || "";
    categoryInput.value = data.category || "";
    contentInput.value = data.content || "";
    if (editingImageURL) {
      imagePreview.src = editingImageURL;
      imagePreview.classList.remove("hidden");
    } else {
      imagePreview.src = "#";
      imagePreview.classList.add("hidden");
    }
    submitBtn.textContent = "Update";
    cancelEditBtn.classList.remove("hidden");
    statusMsg.textContent = "";
  }
}

// Cancel Edit
cancelEditBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  resetForm();
});

// Submit Post
if (blogForm) {
  blogForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    statusMsg.textContent = "Saving post...";

    const title = titleInput.value.trim();
    const category = categoryInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !category || !content) {
      statusMsg.textContent = "Please fill in all fields.";
      submitBtn.disabled = false;
      return;
    }

    try {
      let imageURL = editingImageURL || null;
      const file = imageUpload?.files[0];

      if (file) {
        const imageRef = ref(storage, `blog-images/${Date.now()}_${file.name}`);
        await uploadBytes(imageRef, file);
        imageURL = await getDownloadURL(imageRef);
      }

      const postData = {
        title,
        category,
        content,
        createdAt: serverTimestamp(),
        imageURL,
      };

      if (editingPostId) {
        const postRef = doc(db, "blogs", editingPostId);
        await updateDoc(postRef, postData);
        statusMsg.textContent = "Post updated.";
      } else {
        await addDoc(collection(db, "blogs"), postData);
        statusMsg.textContent = "Post created.";
      }

      resetForm();
      loadPosts(true);
    } catch (error) {
      statusMsg.textContent = "Error saving post: " + error.message;
    }

    submitBtn.disabled = false;
  });
}

// Search & Filter
searchInput?.addEventListener("input", () => loadPosts(true));
filterCategory?.addEventListener("change", () => loadPosts(true));

// Infinite Scroll
window.addEventListener("scroll", () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
    loadPosts(false);
  }
});

// Event Delegation for Edit/Delete
blogList?.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    editPost(e.target.dataset.id);
  } else if (e.target.classList.contains("delete-btn")) {
    deletePost(e.target.dataset.id);
  }
});

// Initial Load
loadPosts(true);
