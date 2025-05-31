import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const blogList = document.getElementById("blogList");

async function loadBlogs() {
  blogList.innerHTML = `
    <div class="spinner"></div>
    <p class="loading-text">Loading blogs...</p>
  `;

  try {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      blogList.innerHTML = "<p>No blog posts yet.</p>";
      return;
    }

    blogList.innerHTML = ""; // Clear loading text and spinner

    querySnapshot.forEach(doc => {
      const blog = doc.data();
      const blogItem = document.createElement("article");
      blogItem.className = "blog-post";

      blogItem.innerHTML = `
        <h2>${blog.title}</h2>
        <p>${blog.content}</p>
        <small>${blog.createdAt?.toDate().toLocaleString() || "Date unknown"}</small>
      `;

      blogList.appendChild(blogItem);
    });
  } catch (error) {
    blogList.innerHTML = `<p>Error loading blogs: ${error.message}</p>`;
  }
}

loadBlogs();
