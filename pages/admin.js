import { useState, useEffect, useRef } from "react";
import { auth } from "../lib/firebase"; // your firebase client init file
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Ref for image input to reset after upload
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

  return (
    <>
      <style jsx>{`
        /* Include your full CSS here exactly as in your HTML <style> */
        * {
          box-sizing: border-box;
        }
        body,
        html {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: url("/images/bg.jpg") no-repeat center center/cover;
          color: #f0f0f0;
          transition: background-color 0.3s ease, color 0.3s ease;
          overflow: hidden;
        }
        body.dark-mode {
          background-color: #121212;
          color: #ddd;
          background-image: none;
        }
        .container {
          height: 100vh;
          width: 100vw;
          backdrop-filter: blur(8px);
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 2rem;
          overflow-y: auto;
        }
        h1 {
          margin-bottom: 1.5rem;
          font-weight: 700;
          font-size: 2.5rem;
          text-align: center;
          color: #00ff99;
          text-shadow: 0 0 8px #00ff99aa;
        }
        form,
        #dashboard {
          width: 100%;
          max-width: 700px;
          background-color: #222;
          border-radius: 10px;
          padding: 2rem;
          box-shadow: 0 0 10px #00ff99aa, 0 0 20px #ffa500aa,
            0 0 30px #007bffaa;
        }
        #login-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        input,
        textarea {
          padding: 0.8rem 1rem;
          font-size: 1.1rem;
          border-radius: 6px;
          border: 2px solid transparent;
          background-color: #333;
          color: #eee;
          transition: border-color 0.3s ease, background-color 0.3s ease;
        }
        input:focus,
        textarea:focus {
          outline: none;
          border-color: #00ff99;
          background-color: #222;
        }
        textarea {
          resize: vertical;
          min-height: 100px;
        }
        button {
          font-weight: 700;
          font-size: 1rem;
          border: none;
          border-radius: 6px;
          padding: 0.5rem 0.8rem;
          cursor: pointer;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 0 10px transparent;
          color: white;
          margin-top: 0.5rem;
        }
        button:hover {
          box-shadow: 0 0 15px currentColor;
        }
        button[type="submit"] {
          background-color: #ffa500;
        }
        button[type="submit"]:hover {
          background-color: #cc8400;
        }
        #logout-btn {
          background-color: #00b300;
          margin-bottom: 1rem;
          width: 100%;
          font-size: 1rem;
          padding: 0.5rem;
        }
        #logout-btn:hover {
          background-color: #007a00;
        }
        #load-more-btn {
          background-color: #007bff;
          margin-top: 1rem;
          width: 100%;
          font-size: 1rem;
          padding: 0.5rem;
        }
        #load-more-btn:hover {
          background-color: #0056b3;
        }
        #theme-toggle {
          background-color: #6c757d;
          width: 100%;
          margin-top: 0.5rem;
          font-size: 1rem;
          padding: 0.5rem;
        }
        #theme-toggle:hover {
          background-color: #495057;
        }
        #image-preview {
          max-width: 100px;
          margin-top: 0.5rem;
          border-radius: 8px;
          box-shadow: 0 0 12px #00ff99aa;
          display: ${imagePreview ? "block" : "none"};
        }
        @media (max-width: 720px) {
          form,
          #dashboard {
            max-width: 100%;
            padding: 1.5rem;
          }
          button,
          #logout-btn,
          #load-more-btn,
          #theme-toggle {
            font-size: 0.9rem;
            padding: 0.4rem 0.6rem;
          }
          #image-preview {
            max-width: 80px;
          }
        }
      `}</style>

      <div className="container">
        <h1>Admin Dashboard</h1>

        {!user && (
          <form id="login-form" onSubmit={handleLogin}>
            <input
              id="email"
              type="email"
              placeholder="Email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              style={{
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <input
                type="checkbox"
                id="show-password"
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

            <form id="create-post-form">
              <input id="title" type="text" placeholder="Title" required />
              <textarea id="content" placeholder="Content" required></textarea>
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
              />
              <input type="hidden" id="post-id" />
              <button type="submit">Create Post</button>
            </form>

            <input
              id="filter-input"
              type="text"
              placeholder="Search posts..."
              // You can add onChange handler here
            />
            <ul id="posts-list">{/* Populate posts here */}</ul>

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
