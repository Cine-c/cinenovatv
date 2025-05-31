import { auth, db } from "./firebase-config.js"; // removed storage import since unused now
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Elements
const loginForm = document.getElementById('login-form');
const dashboard = document.getElementById('dashboard');
const logoutBtn = document.getElementById('logout-btn');
const postForm = document.getElementById('create-post-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('image-preview');
const postsList = document.getElementById('posts-list');
const filterInput = document.getElementById('filter-input');
const loadMoreBtn = document.getElementById('load-more-btn');
const themeToggle = document.getElementById('theme-toggle');
const showPasswordCheckbox = document.getElementById('show-password');
const passwordInput = document.getElementById('password');
const statusMsg = document.getElementById('status'); // For showing status messages

// State
let lastVisible = null;
let postLimit = 5;
let posts = [];
let editingPostId = null;

// ImgBB upload helper
async function uploadImageToImgBB(file) {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  if (!apiKey) throw new Error("ImgBB API key not found in environment variables.");

  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  if (!data.success) throw new Error(data.error.message || 'Image upload failed');
  return data.data.url;
}

// Auth
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = passwordInput.value;

  try {
    loginForm.querySelector('button[type="submit"]').disabled = true;
    await signInWithEmailAndPassword(auth, email, password);
    loginForm.style.display = 'none';
    dashboard.style.display = 'block';
  } catch (err) {
    showStatus("Login failed: " + err.message, true);
  } finally {
    loginForm.querySelector('button[type="submit"]').disabled = false;
  }
});

logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  loginForm.reset();
  loginForm.style.display = 'flex';
  dashboard.style.display = 'none';
  postsList.innerHTML = '';
  posts = [];
  lastVisible = null;
  editingPostId = null;
  clearStatus();
});

// Show/hide password
showPasswordCheckbox.addEventListener('change', () => {
  passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
});

// Image Preview & Drag-and-Drop Support
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (file) {
    imagePreview.src = URL.createObjectURL(file);
  } else {
    imagePreview.src = '';
  }
});

// Optional: Drag-and-drop support on image preview area
imagePreview.addEventListener('dragover', (e) => {
  e.preventDefault();
  imagePreview.style.border = "2px dashed #00f";
});
imagePreview.addEventListener('dragleave', (e) => {
  e.preventDefault();
  imagePreview.style.border = "";
});
imagePreview.addEventListener('drop', (e) => {
  e.preventDefault();
  imagePreview.style.border = "";
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    imageInput.files = e.dataTransfer.files;
    imagePreview.src = URL.createObjectURL(file);
  }
});

// Create or Update Post
postForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const file = imageInput.files[0];
  const submitBtn = postForm.querySelector('button[type="submit"]');

  if (!title || !content) {
    showStatus("Title and Content are required.", true);
    return;
  }

  submitBtn.disabled = true;
  showStatus(editingPostId ? "Updating post..." : "Creating post...");

  try {
    let imageUrl = '';

    if (file) {
      // Upload new image to ImgBB
      imageUrl = await uploadImageToImgBB(file);
    } else if (editingPostId) {
      // Keep existing image if editing but no new image uploaded
      const existingDoc = await getDoc(doc(db, 'posts', editingPostId));
      imageUrl = existingDoc.exists() ? existingDoc.data().imageUrl : '';
    }

    const user = auth.currentUser;

    if (editingPostId) {
      await updateDoc(doc(db, 'posts', editingPostId), {
        title,
        content,
        imageUrl,
        updatedAt: serverTimestamp()
      });
      editingPostId = null;
      showStatus("Post updated successfully.");
    } else {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        imageUrl,
        author: user?.email || 'unknown',
        createdAt: serverTimestamp()
      });
      showStatus("Post created successfully.");
    }

    postForm.reset();
    imagePreview.src = '';
    loadPosts(true);
  } catch (err) {
    showStatus("Failed to submit post: " + err.message, true);
  } finally {
    submitBtn.disabled = false;
  }
});

// Load Posts
async function loadPosts(reset = false) {
  try {
    if (reset) {
      postsList.innerHTML = '';
      posts = [];
      lastVisible = null;
    }

    let q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(postLimit));
    if (lastVisible && !reset) {
      q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(postLimit));
    }

    const snap = await getDocs(q);
    if (snap.docs.length > 0) {
      lastVisible = snap.docs[snap.docs.length - 1];
      posts.push(...snap.docs);
      displayPosts(posts);
    } else if (reset) {
      postsList.innerHTML = '<li>No posts found.</li>';
    }
  } catch (err) {
    showStatus("Error loading posts: " + err.message, true);
  }
}

// Display Posts
function displayPosts(docs) {
  postsList.innerHTML = '';
  docs.forEach(doc => {
    const data = doc.data();
    const createdAt = data.createdAt ? data.createdAt.toDate().toLocaleString() : 'Unknown date';
    const updatedAt = data.updatedAt ? data.updatedAt.toDate().toLocaleString() : null;

    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${data.title}</strong>
      <p style="margin: 0.5rem 0; max-width: 400px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        ${data.content}
      </p>
      ${data.imageUrl ? `<img src="${data.imageUrl}" style="max-width: 150px; margin-bottom: 0.5rem; border-radius: 4px;" />` : ''}
      <p style="font-size: 0.8rem; color: gray; margin-bottom: 0.3rem;">
        Posted by: ${data.author || 'Unknown'}<br>
        Created: ${createdAt}${updatedAt ? `<br>Updated: ${updatedAt}` : ''}
      </p>
      <div style="margin-top: 0.5rem;">
        <button class="edit-post" data-id="${doc.id}">Edit</button>
        <button class="delete-post" data-id="${doc.id}">Delete</button>
      </div>
    `;
    postsList.appendChild(li);
  });
}

// Filter Posts
filterInput.addEventListener('input', () => {
  const query = filterInput.value.toLowerCase();
  const filtered = posts.filter(p =>
    p.data().title.toLowerCase().includes(query) ||
    p.data().content.toLowerCase().includes(query)
  );
  displayPosts(filtered);
});

// Load More
loadMoreBtn.addEventListener('click', () => loadPosts(false));

// Dark Mode
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Edit/Delete Handlers
postsList.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains('delete-post')) {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', id));
        showStatus("Post deleted.");
        loadPosts(true);
      } catch (err) {
        showStatus("Failed to delete post: " + err.message, true);
      }
    }
  }

  if (e.target.classList.contains('edit-post')) {
    try {
      const docSnap = await getDoc(doc(db, 'posts', id));
      if (docSnap.exists()) {
        const post = docSnap.data();
        titleInput.value = post.title;
        contentInput.value = post.content;
        imagePreview.src = (post.imageUrl || '').replace(/^http:/, 'https:');
        editingPostId = id;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      showStatus("Failed to load post for editing: " + err.message, true);
    }
  }
});

// Keep UI synced with auth
onAuthStateChanged(auth, user => {
  if (user) {
    loginForm.style.display = 'none';
    dashboard.style.display = 'block';
    loadPosts(true);
  } else {
    loginForm.style.display = 'flex';
    dashboard.style.display = 'none';
    clearStatus();
  }
});

// Helper: Show status messages (error if isError=true)
function showStatus(msg, isError = false) {
  if (!statusMsg) return;
  statusMsg.textContent = msg;
  statusMsg.style.color = isError ? 'red' : 'green';
  setTimeout(() => {
    if (statusMsg.textContent === msg) {
      statusMsg.textContent = '';
    }
  }, 4000);
}
function clearStatus() {
  if (!statusMsg) return;
  statusMsg.textContent = '';
}
