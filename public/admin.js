import { auth, db } from '@/lib/firebase';
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

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      loginForm.reset();
    } catch (err) {
      alert('Login failed.');
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
  });
}

if (imageInput && imagePreview) {
  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
      imagePreview.src = URL.createObjectURL(file);
      imagePreview.style.display = 'block';
    }
  });
}

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
        await updateDoc(doc(db, 'posts', postId), {
          title,
          content,
          imageUrl,
          updatedAt: serverTimestamp()
        });
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
      imagePreview.style.display = 'none';
      postIdInput.value = '';
      fetchPosts(true);
    } catch (err) {
      console.error(err);
      alert('Post submission failed.');
    }
  });
}

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

    lastVisible = snapshot.docs[snapshot.docs.length - 1];
    loadMoreBtn.style.display = snapshot.size < 5 ? 'none' : 'block';
  } catch (err) {
    console.error(err);
  }
}

function renderPost(post) {
  const li = document.createElement('li');
  li.innerHTML = `
    <strong>${post.title}</strong>
    <button onclick="editPost('${post.id}')">Edit</button>
    <button onclick="deletePost('${post.id}')">Delete</button>
  `;
  postsList.appendChild(li);
}

window.editPost = async function (id) {
  try {
    const ref = doc(db, 'posts', id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      titleInput.value = data.title;
      contentInput.value = data.content;
      imagePreview.src = data.imageUrl || '';
      imagePreview.style.display = data.imageUrl ? 'block' : 'none';
      postIdInput.value = id;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } catch (err) {
    console.error(err);
  }
};

window.deletePost = async function (id) {
  if (confirm('Delete this post?')) {
    try {
      await deleteDoc(doc(db, 'posts', id));
      alert('Post deleted');
      fetchPosts(true);
    } catch (err) {
      console.error(err);
    }
  }
};

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => fetchPosts());
}

if (filterInput) {
  filterInput.addEventListener('input', () => {
    const keyword = filterInput.value.toLowerCase();
    postsList.innerHTML = '';
    allPosts
      .filter(p => p.title.toLowerCase().includes(keyword))
      .forEach(renderPost);
  });
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}

onAuthStateChanged(auth, (user) => {
  const isLoggedIn = !!user;
  document.getElementById('login-form').style.display = isLoggedIn ? 'none' : 'block';
  dashboard.style.display = isLoggedIn ? 'block' : 'none';
  if (isLoggedIn) fetchPosts(true);
});
