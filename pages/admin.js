import { useState, useEffect, useRef } from "react";
import { auth, db } from "../lib/firebase"; // Ensure this file properly initializes Firebase
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, getDocs } from "firebase/firestore"; // Firebase Firestore functions

export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [posts, setPosts] = useState([]); // New state for storing posts
  
  const imageInputRef = useRef();

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  // Toggle dark mode on body class
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImagePreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const content = e.target.content.value;
    try {
      // Save the post to Firebase Firestore
      await addDoc(collection(db, "posts"), {
        title,
        content,
        image: imagePreview,
        timestamp: new Date(),
      });
      alert("Post created!");
      e.target.reset();
      setImagePreview(null);
    } catch (error) {
      console.error("Error creating post: ", error);
      alert("Failed to create post");
    }
  };

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const postsArray = querySnapshot.docs.map((doc) => doc.data());
        setPosts(postsArray);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <div className="container">
        <h1>Admin Dashboard</h1>

        {!user && (
          <form id="login-form" onSubmit={handleLogin}>
            <input
              id="email"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              Show Password
            </label>
            <button type="submit">Login</button>
          </form>
        )}

        {user && (
          <div id="dashboard">
            <button id="logout-btn" onClick={handleLogout}>
              Logout
            </button>

            <form id="create-post-form" onSubmit={handlePostSubmit}>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Title"
                required
              />
              <textarea
                id="content"
                name="content"
                placeholder="Content"
                required
              ></textarea>
              <input
                id="image"
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={handleImageChange}
              />
              <img
                id="image-preview"
                alt="Image preview"
                src={imagePreview || ""}
                style={{ display: imagePreview ? "block" : "none" }}
              />
              <button type="submit">Create Post</button>
            </form>

            <input
              id="filter-input"
              type="text"
              placeholder="Search posts..."
              // You can add onChange handler here
            />
            <ul id="posts-list">
              {posts.map((post, index) => (
                <li key={index}>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  {post.image && <img src={post.image} alt="Post Image" />}
                </li>
              ))}
            </ul>

            <button id="load-more-btn">Load More</button>
            <button
              id="theme-toggle"
              onClick={() => setDarkMode((prev) => !prev)}
              type="button"
            >
              Toggle Dark Mode
            </button>
          </div>
        )}
      </div>
    </>
  );
}
