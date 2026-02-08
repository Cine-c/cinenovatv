import { useState, useEffect } from "react";
import { auth, db, storage } from "../lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import SEOHead from "../components/seo/SEOHead";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Blog state
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // posts, create, edit
  const [editingPost, setEditingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "News",
    status: "draft",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categories = ["News", "Review", "Interview", "Behind the Scenes", "Opinion", "Lists"];

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Fetch posts when logged in
  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const postsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsArray);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setActiveTab("posts");
    setEditingPost(null);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file) => {
    const filename = `blog/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = formData.imageUrl;

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        status: formData.status,
        imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingPost) {
        // Update existing post
        await updateDoc(doc(db, "posts", editingPost.id), postData);
        alert("Post updated successfully!");
      } else {
        // Create new post
        postData.createdAt = serverTimestamp();
        postData.publishedAt = formData.status === "published" ? serverTimestamp() : null;
        await addDoc(collection(db, "posts"), postData);
        alert("Post created successfully!");
      }

      // Reset form
      resetForm();
      fetchPosts();
      setActiveTab("posts");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      category: post.category || "News",
      status: post.status || "draft",
      imageUrl: post.imageUrl || "",
    });
    setImagePreview(post.imageUrl || "");
    setImageFile(null);
    setActiveTab("edit");
  };

  const handleDelete = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await deleteDoc(doc(db, "posts", postId));
      alert("Post deleted successfully!");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "News",
      status: "draft",
      imageUrl: "",
    });
    setImageFile(null);
    setImagePreview("");
    setEditingPost(null);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <SEOHead title="Admin Dashboard - CineNovaTV" url="/admin" />

      <div className="admin-page">
        {!user ? (
          <div className="admin-login">
            <div className="admin-login-card">
              <div className="admin-login-header">
                <h1>Admin Login</h1>
                <p>Sign in to manage your blog</p>
              </div>

              <form onSubmit={handleLogin} className="admin-login-form">
                {loginError && <div className="admin-error">{loginError}</div>}

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@cinenovatv.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-large">
                  Sign In
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="admin-dashboard">
            {/* Header */}
            <header className="admin-header">
              <div className="admin-header-left">
                <h1>Dashboard</h1>
                <span className="admin-user">{user.email}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </header>

            {/* Tabs */}
            <nav className="admin-tabs">
              <button
                className={`admin-tab ${activeTab === "posts" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("posts");
                  resetForm();
                }}
              >
                All Posts ({posts.length})
              </button>
              <button
                className={`admin-tab ${activeTab === "create" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("create");
                  resetForm();
                }}
              >
                + New Post
              </button>
              {activeTab === "edit" && (
                <button className="admin-tab active">Edit Post</button>
              )}
            </nav>

            {/* Posts List */}
            {activeTab === "posts" && (
              <div className="admin-posts">
                <div className="admin-posts-header">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="admin-search"
                  />
                  <button onClick={fetchPosts} className="btn btn-secondary">
                    Refresh
                  </button>
                </div>

                {postsLoading ? (
                  <div className="admin-loading-inline">
                    <div className="loading-spinner"></div>
                    <p>Loading posts...</p>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="admin-empty">
                    <p>No posts found. Create your first post!</p>
                    <button
                      onClick={() => setActiveTab("create")}
                      className="btn btn-primary"
                    >
                      Create Post
                    </button>
                  </div>
                ) : (
                  <div className="admin-posts-list">
                    {filteredPosts.map((post) => (
                      <article key={post.id} className="admin-post-item">
                        {post.imageUrl && (
                          <div className="admin-post-image">
                            <img src={post.imageUrl} alt={post.title} />
                          </div>
                        )}
                        <div className="admin-post-content">
                          <div className="admin-post-meta">
                            <span className={`status-badge ${post.status}`}>
                              {post.status}
                            </span>
                            <span className="category-badge">{post.category}</span>
                          </div>
                          <h3>{post.title}</h3>
                          <p>{post.excerpt?.slice(0, 100)}...</p>
                          <div className="admin-post-actions">
                            <button
                              onClick={() => handleEdit(post)}
                              className="btn btn-small"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="btn btn-small btn-danger"
                            >
                              Delete
                            </button>
                            {post.status === "published" && (
                              <a
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-small btn-secondary"
                              >
                                View
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Create/Edit Form */}
            {(activeTab === "create" || activeTab === "edit") && (
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="admin-form-grid">
                  <div className="admin-form-main">
                    <div className="form-group">
                      <label htmlFor="title">Title *</label>
                      <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={handleTitleChange}
                        placeholder="Enter post title"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="slug">Slug</label>
                      <input
                        id="slug"
                        type="text"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        placeholder="post-url-slug"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="excerpt">Excerpt</label>
                      <textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) =>
                          setFormData({ ...formData, excerpt: e.target.value })
                        }
                        placeholder="Brief description of the post"
                        rows={3}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="content">Content *</label>
                      <textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        placeholder="Write your post content here... (HTML supported)"
                        rows={15}
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-form-sidebar">
                    <div className="form-card">
                      <h4>Publish</h4>
                      <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                          id="status"
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                          id="category"
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                          }
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                        style={{ width: "100%" }}
                      >
                        {submitting
                          ? "Saving..."
                          : editingPost
                          ? "Update Post"
                          : "Create Post"}
                      </button>

                      {editingPost && (
                        <button
                          type="button"
                          onClick={() => {
                            resetForm();
                            setActiveTab("posts");
                          }}
                          className="btn btn-secondary"
                          style={{ width: "100%", marginTop: "0.5rem" }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    <div className="form-card">
                      <h4>Featured Image</h4>
                      <div className="form-group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="file-input"
                        />
                      </div>
                      {(imagePreview || formData.imageUrl) && (
                        <div className="image-preview">
                          <img
                            src={imagePreview || formData.imageUrl}
                            alt="Preview"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview("");
                              setFormData({ ...formData, imageUrl: "" });
                            }}
                            className="remove-image"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </>
  );
}
