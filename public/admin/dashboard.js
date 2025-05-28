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
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// DOM Elements (some may not exist depending on page)
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
const loadMoreBtn = document.getElementById("loadMoreBtn");
const logoutBtn = document.getElementById("logoutBtn");

const toggleThemeBtn = document.getElementById('toggleTheme');

let lastVisible = null;
const PAGE_SIZE = 5;
let editingPostId = null;

// --- Login Form Handling ---
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (errorMsg) errorMsg.style.display = "none";
      // Redirect on login success handled by onAuthStateChanged below
    } catch (error) {
      if (errorMsg) {
        errorMsg.textContent = error.message;
        errorMsg.style.display = "block";
      }
    }
  });
}

// --- Auth State Check ---
onAuthStateChanged(auth, (user) => {
  if (loginForm) {
    // On login page: if logged in, redirect to dashboard
    if (user) window.location.href = "/admin/dashboard.html";
  } else {
    // On dashboard/admin page: if NOT logged in, redirect to login
    if (!user) window.location.href = "/admin.html";
  }
});

// --- Logout ---
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "/admin.html";
  });
}

// --- Blog Form & CRUD Handling ---
function resetForm() {
  if (!blogForm) return;
  blogForm.reset();
  if (imagePreview) {
    imagePreview.src = "#";
    imagePreview.classList.add("hidden");
  }
  if (submitBtn) submitBtn.textContent = "Post";
  if (cancelEditBtn) cancelEditBtn.classList.add("hidden");
  editingPostId = null;
  if (statusMsg) statusMsg.textContent = "";
}

if (imageUpload) {
  imageUpload.addEventListener("change", () => {
    const file = imageUpload.files[0];
    if (file && imagePreview) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    } else if (imagePreview) {
      imagePreview.src = "#";
      imagePreview.classList.add("hidden");
    }
  });
}

async function loadPosts(reset = false) {
  if (!blogList) return;

  if (reset) {
    lastVisible = null;
    blogList.innerHTML = "Loading posts...";
  }

  let q = query(
    collection(db, "blogs"),
    orderBy("createdAt", "desc"),
    limit(PAGE_SIZE)
  );

  if (lastVisible && !reset) {
    q = query(
      collection(db, "blogs"),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(PAGE_SIZE)
    );
  }

  const searchText = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const categoryFilter = filterCategory ? filterCategory.value : "";

  const snapshot = await getDocs(q);

  let posts = [];
  snapshot.forEach(doc => {
    posts.push({ id: doc.id, ...doc.data() });
  });

  if (categoryFilter) {
    posts = posts.filter(post => post.category === categoryFilter);
  }

  if (searchText) {
    posts = posts.filter(post => post.title.toLowerCase().includes(searchText));
  }

  if (reset) blogList.innerHTML = "";

  if (posts.length === 0 && reset) {
    blogList.innerHTML = "<p>No posts found.</p>";
    if (loadMoreBtn) loadMoreBtn.classList.add("hidden");
    return;
  }

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
  if (loadMoreBtn)
    loadMoreBtn.classList.toggle("hidden", snapshot.docs.length < PAGE_SIZE);
}

async function deletePost(id) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    await deleteDoc(doc(db, "blogs", id));
    if (statusMsg) statusMsg.textContent = "Post deleted.";
    loadPosts(true);
  } catch (e) {
    if (statusMsg) statusMsg.textContent = "Error deleting post: " + e.message;
  }
}

async function editPost(id) {
  const docRef = doc(db, "blogs", id);
  const docSnap = await getDocs(query(collection(db, "blogs"), where("__name__", "==", id)));

  if (!docSnap.empty) {
    const postData = docSnap.docs[0].data();
    editingPostId = id;
    if (titleInput) titleInput.value = postData.title || "";
    if (categoryInput) categoryInput.value = postData.category || "";
    if (contentInput) contentInput.value = postData.content || "";
    if (imagePreview) {
      if (postData.imageURL) {
        imagePreview.src = postData.imageURL;
        imagePreview.classList.remove("hidden");
      } else {
        imagePreview.src = "#";
        imagePreview.classList.add("hidden");
      }
    }
    if (submitBtn) submitBtn.textContent = "Update";
    if (cancelEditBtn) cancelEditBtn.classList.remove("hidden");
    if (statusMsg) statusMsg.textContent = "";
  }
}

if (cancelEditBtn) {
  cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    resetForm();
  });
}

if (blogForm) {
  blogForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (submitBtn) submitBtn.disabled = true;
    if (statusMsg) statusMsg.textContent = "Saving post...";

    try {
      let imageURL = null;
      const file = imageUpload ? imageUpload.files[0] : null;
      if (file) {
        const imageRef = ref(storage, `blog-images/${Date.now()}_${file.name}`);
        await uploadBytes(imageRef, file);
        imageURL = await getDownloadURL(imageRef);
      }

      const postData = {
        title: titleInput.value,
        category: categoryInput.value,
        content: contentInput.value,
        createdAt: new Date(),
        imageURL,
      };

      if (editingPostId) {
        const postRef = doc(db, "blogs", editingPostId);
        await updateDoc(postRef, postData);
        if (statusMsg) statusMsg.textContent = "Post updated.";
      } else {
        await addDoc(collection(db, "blogs"), postData);
        if (statusMsg) statusMsg.textContent = "Post added.";
      }

      resetForm();
      loadPosts(true);
    } catch (e) {
      if (statusMsg) statusMsg.textContent = "Error saving post: " + e.message;
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// Event delegation for edit/delete buttons
if (blogList) {
  blogList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      deletePost(e.target.dataset.id);
    }
    if (e.target.classList.contains("edit-btn")) {
      editPost(e.target.dataset.id);
    }
  });
}

// Search/filter inputs listeners
if (searchInput) searchInput.addEventListener("input", () => loadPosts(true));
if (filterCategory) filterCategory.addEventListener("change", () => loadPosts(true));
if (loadMoreBtn) loadMoreBtn.addEventListener("click", () => loadPosts(false));

// Initial load if on dashboard/admin page (blogForm or blogList exists)
if (blogForm || blogList) loadPosts(true);

// --- Theme toggle ---
if (toggleThemeBtn) {
  // Load saved preference
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    toggleThemeBtn.textContent = '🌙';
  } else {
    toggleThemeBtn.textContent = '☀️';
  }

  toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    toggleThemeBtn.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}
