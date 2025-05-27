import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const blogList = document.getElementById("blogList");

async function loadBlogs() {
  blogList.innerHTML = "Loading blogs...";

  try {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      blogList.innerHTML = "<p>No blog posts yet.</p>";
      return;
    }

    blogList.innerHTML = ""; // Clear loading text

    querySnapshot.forEach(doc => {
      const blog = doc.data();
      const blogItem = document.createElement("article");
      blogItem.className = "blog-post";

      blogItem.innerHTML = `
        <h2>${blog.title}</h2>
        <p>${blog.content}</p>
        <small>${blog.createdAt?.toDate().toLocaleString() || "Date unknown"}</small>
        <hr />
      `;
      blogList.appendChild(blogItem);
    });
  } catch (error) {
    blogList.innerHTML = `<p>Error loading blogs: ${error.message}</p>`;
  }
}

loadBlogs();
/* --- Blog Page Styling --- */

nav {
  background: var(--card-bg);
  padding: 1rem;
  text-align: center;
}

nav a {
  color: var(--emerald);
  margin: 0 1rem;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

nav a:hover {
  color: var(--orange);
}

header {
  text-align: center;
  padding: 2rem;
}

main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 60vh;
  color: var(--white);
}

.footer {
  text-align: center;
  padding: 1rem;
  background: var(--card-bg);
  font-size: 0.9rem;
  color: var(--muted);
}

/* Spinner Animation */
@keyframes spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spinner {
  margin: 2rem auto;
  width: 48px;
  height: 48px;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--emerald);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  text-align: center;
  margin-top: 1rem;
  color: var(--muted);
}

