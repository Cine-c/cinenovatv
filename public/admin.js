import { auth, db } from '../lib/firebase.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
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
} from 'firebase/firestore';

const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
if (!imgbbApiKey) throw new Error("Missing imgbb API key");

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const createPostForm = document.getElementById('create-post-form');
  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');
  const imageInput = document.getElementById('image');
  const imagePreview = document.getElementById('image-preview');
  const postIdInput = document.getElementById('post-id');
  const postsList = document.getElementById('posts-list');
  const filterInput = document.getElementById('filter-input');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const dashboard = document.getElementById('dashboard');

  let lastVisible = null;
  let allPosts = [];

  // Login form
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm['email'].value;
      const password = loginForm['password'].value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        loginForm.reset();
      } catch {
        alert('Login failed.');
      }
    });
  }

  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await signOut(auth);
    });
  }

  // Image preview on file select
  if (imageInput && imagePreview) {
    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      if (file) {
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.style.display = 'block';
      } else {
        imagePreview.style.display = 'none';
      }
    });
  }

  // Create or update post form submit
  if (createPostForm) {
    createPostForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = titleInput.value.trim();
      const content = contentInput.value.trim();
      const image = imageInput.files[0];
      const postId = postIdInput.value;

      try {
        let imageUrl = '';
        if (image) {
          const formData = new FormData();
          formData.append('image', image);
          const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          imageUrl = data.data.url;
        }

        if (postId) {
          const updateData = {
            title,
            content,
            updatedAt: serverTimestamp()
          };
          if (imageUrl) {
            updateData.imageUrl = imageUrl;
          }
          await updateDoc(doc(db, 'posts', postId), updateData);
          alert('Post updated!');
        } else {
          await addDoc(collection(db, 'posts'), {
            title,
            content,
            imageUrl,
            createdAt: serverTimestamp()
          });
          alert('Post added!');
        }

        createPostForm.reset();
        if (imagePreview) imagePreview.style.display = 'none';
        postIdInput.value = '';
        fetchPosts(true);
      } catch (err) {
        console.error(err);
        alert('Post submission failed.');
      }
    });
  }

  // Fetch posts with pagination
  async function fetchPosts(reset = false) {
    try {
      let q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(5));
      if (!reset && lastVisible) {
        q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(5));
      }

      const snapshot = await getDocs(q);
      if (reset) {
        postsList.innerHTML = '';
        allPosts = [];
      }

      snapshot.forEach((docSnap) => {
        const post = { id: docSnap.id, ...docSnap.data() };
        allPosts.push(post);
        renderPost(post);
      });

      if (snapshot.docs.length > 0) {
        lastVisible = snapshot.docs[snapshot.docs.length - 1];
      } else {
        lastVisible = null;
      }

      if (loadMoreBtn) {
        loadMoreBtn.style.display = snapshot.size < 5 ? 'none' : 'block';
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Render a single post with buttons
  function renderPost(post) {
    if (!postsList) return;

    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${post.title}</strong>
    `;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editPost(post.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deletePost(post.id));

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    postsList.appendChild(li);
  }

  // Edit post: populate form with post data
  async function editPost(id) {
    try {
      const ref = doc(db, 'posts', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        titleInput.value = data.title || '';
        contentInput.value = data.content || '';
        if (imagePreview) {
          imagePreview.src = data.imageUrl || '';
          imagePreview.style.display = data.imageUrl ? 'block' : 'none';
        }
        postIdInput.value = id;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Delete post with confirmation
  async function deletePost(id) {
    if (confirm('Delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', id));
        alert('Post deleted');
        fetchPosts(true);
      } catch (err) {
        console.error(err);
      }
    }
  }

  // Attach to window so accessible in event listeners
  window.editPost = editPost;
  window.deletePost = deletePost;

  // Load more button
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => fetchPosts());
  }

  // Filter posts by title keyword
  if (filterInput) {
    filterInput.addEventListener('input', () => {
      const keyword = filterInput.value.toLowerCase();
      if (!postsList) return;
      postsList.innerHTML = '';
      allPosts
        .filter(p => p.title.toLowerCase().includes(keyword))
        .forEach(renderPost);
    });
  }

  // Theme toggle dark mode
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  }

  // Auth state change handler
  onAuthStateChanged(auth, (user) => {
    const isLoggedIn = !!user;
    if (loginForm) loginForm.style.display = isLoggedIn ? 'none' : 'block';
    if (dashboard) dashboard.style.display = isLoggedIn ? 'block' : 'none';
    if (isLoggedIn) fetchPosts(true);
  });
});
