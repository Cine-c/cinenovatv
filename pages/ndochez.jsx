import { useState, useEffect, useRef, useCallback } from "react";
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

function wordCount(html) {
  if (!html) return 0;
  return html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
}

function readingTime(html) {
  const words = wordCount(html);
  const minutes = Math.ceil(words / 200);
  return minutes < 1 ? "< 1 min" : `${minutes} min read`;
}

function formatDate(timestamp) {
  if (!timestamp) return "—";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Rich Text Toolbar ──────────────────────────────────────────────
function RichToolbar({ textareaRef, value, onChange }) {
  const wrapSelection = useCallback(
    (before, after) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = value.substring(start, end);
      const replacement = before + selected + after;
      const newValue = value.substring(0, start) + replacement + value.substring(end);
      onChange(newValue);
      // Restore cursor position after React re-render
      requestAnimationFrame(() => {
        ta.focus();
        ta.selectionStart = start + before.length;
        ta.selectionEnd = start + before.length + selected.length;
      });
    },
    [textareaRef, value, onChange]
  );

  const insertBlock = useCallback(
    (text) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const newValue = value.substring(0, start) + text + value.substring(start);
      onChange(newValue);
      requestAnimationFrame(() => {
        ta.focus();
        ta.selectionStart = ta.selectionEnd = start + text.length;
      });
    },
    [textareaRef, value, onChange]
  );

  const handleLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (!url) return;
    const ta = textareaRef.current;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end) || "link text";
    const replacement = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selected}</a>`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);
  }, [textareaRef, value, onChange]);

  const handleImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (!url) return;
    const alt = prompt("Enter alt text:", "Image") || "Image";
    insertBlock(`<img src="${url}" alt="${alt}" />\n`);
  }, [insertBlock]);

  const buttons = [
    { label: "B", title: "Bold", action: () => wrapSelection("<strong>", "</strong>"), style: { fontWeight: 700 } },
    { label: "I", title: "Italic", action: () => wrapSelection("<em>", "</em>"), style: { fontStyle: "italic" } },
    { label: "U", title: "Underline", action: () => wrapSelection("<u>", "</u>"), style: { textDecoration: "underline" } },
    { type: "divider" },
    { label: "H2", title: "Heading 2", action: () => wrapSelection("<h2>", "</h2>") },
    { label: "H3", title: "Heading 3", action: () => wrapSelection("<h3>", "</h3>") },
    { type: "divider" },
    { label: "UL", title: "Bullet List", action: () => insertBlock("<ul>\n  <li></li>\n  <li></li>\n</ul>\n") },
    { label: "OL", title: "Numbered List", action: () => insertBlock("<ol>\n  <li></li>\n  <li></li>\n</ol>\n") },
    { type: "divider" },
    { label: "\"", title: "Blockquote", action: () => wrapSelection("<blockquote>", "</blockquote>") },
    { label: "<>", title: "Code Block", action: () => wrapSelection("<pre><code>", "</code></pre>") },
    { type: "divider" },
    { label: "Link", title: "Insert Link", action: handleLink },
    { label: "Img", title: "Insert Image", action: handleImage },
    { label: "P", title: "Paragraph", action: () => wrapSelection("<p>", "</p>") },
    { label: "HR", title: "Horizontal Rule", action: () => insertBlock("\n<hr />\n") },
  ];

  return (
    <div className="rich-toolbar">
      {buttons.map((btn, i) =>
        btn.type === "divider" ? (
          <span key={i} className="rich-toolbar-divider" />
        ) : (
          <button
            key={i}
            type="button"
            title={btn.title}
            className="rich-toolbar-btn"
            style={btn.style}
            onClick={btn.action}
          >
            {btn.label}
          </button>
        )
      )}
    </div>
  );
}

// ── Main Admin Component ───────────────────────────────────────────
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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingPost, setEditingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreview, setShowPreview] = useState(false);

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

  const contentRef = useRef(null);

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
    if (user) fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const postsArray = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
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
    setActiveTab("dashboard");
    setEditingPost(null);
  };

  const generateSlug = (title) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({ ...formData, title, slug: generateSlug(title) });
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
    reader.onload = (event) => setImagePreview(event.target.result);
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
      if (imageFile) imageUrl = await uploadImage(imageFile);

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
        await updateDoc(doc(db, "posts", editingPost.id), postData);
        alert("Post updated successfully!");
      } else {
        postData.createdAt = serverTimestamp();
        postData.publishedAt = formData.status === "published" ? serverTimestamp() : null;
        await addDoc(collection(db, "posts"), postData);
        alert("Post created successfully!");
      }

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
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const toggleStatus = async (post) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    try {
      const data = { status: newStatus, updatedAt: serverTimestamp() };
      if (newStatus === "published" && !post.publishedAt) {
        data.publishedAt = serverTimestamp();
      }
      await updateDoc(doc(db, "posts", post.id), data);
      fetchPosts();
    } catch (error) {
      console.error("Error toggling status:", error);
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
    setShowPreview(false);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalPosts = posts.length;
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;
  const categoryMap = {};
  posts.forEach((p) => {
    const cat = p.category || "Uncategorized";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

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
                className={`admin-tab ${activeTab === "dashboard" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("dashboard");
                  resetForm();
                }}
              >
                Overview
              </button>
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

            {/* ── Dashboard Overview ────────────────────── */}
            {activeTab === "dashboard" && (
              <div className="admin-overview">
                <div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-number">{totalPosts}</span>
                    <span className="stat-label">Total Posts</span>
                  </div>
                  <div className="stat-card stat-published">
                    <span className="stat-number">{publishedCount}</span>
                    <span className="stat-label">Published</span>
                  </div>
                  <div className="stat-card stat-draft">
                    <span className="stat-number">{draftCount}</span>
                    <span className="stat-label">Drafts</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">{Object.keys(categoryMap).length}</span>
                    <span className="stat-label">Categories</span>
                  </div>
                </div>

                <div className="overview-grid">
                  {/* Categories breakdown */}
                  <div className="overview-card">
                    <h3>Categories</h3>
                    <div className="category-list">
                      {Object.entries(categoryMap)
                        .sort((a, b) => b[1] - a[1])
                        .map(([cat, count]) => (
                          <div key={cat} className="category-row">
                            <span>{cat}</span>
                            <span className="category-count">{count}</span>
                          </div>
                        ))}
                      {Object.keys(categoryMap).length === 0 && (
                        <p className="text-muted">No posts yet</p>
                      )}
                    </div>
                  </div>

                  {/* Recent posts */}
                  <div className="overview-card">
                    <h3>Recent Posts</h3>
                    <div className="recent-posts-list">
                      {posts.slice(0, 5).map((post) => (
                        <div
                          key={post.id}
                          className="recent-post-row"
                          onClick={() => handleEdit(post)}
                        >
                          <div>
                            <span className="recent-post-title">{post.title}</span>
                            <span className="recent-post-date">
                              {formatDate(post.createdAt)}
                            </span>
                          </div>
                          <span className={`status-badge ${post.status}`}>
                            {post.status}
                          </span>
                        </div>
                      ))}
                      {posts.length === 0 && (
                        <p className="text-muted">No posts yet</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="overview-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      resetForm();
                      setActiveTab("create");
                    }}
                  >
                    + Create New Post
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setActiveTab("posts")}
                  >
                    View All Posts
                  </button>
                </div>
              </div>
            )}

            {/* ── Posts List ────────────────────────────── */}
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
                            <button
                              className={`status-badge ${post.status}`}
                              onClick={() => toggleStatus(post)}
                              title={`Click to ${post.status === "published" ? "unpublish" : "publish"}`}
                            >
                              {post.status}
                            </button>
                            <span className="category-badge">{post.category}</span>
                            <span className="post-date">{formatDate(post.createdAt)}</span>
                          </div>
                          <h3>{post.title}</h3>
                          <p>{post.excerpt?.slice(0, 120)}...</p>
                          <div className="admin-post-info">
                            <span className="post-word-count">
                              {wordCount(post.content)} words
                            </span>
                            <span className="post-reading-time">
                              {readingTime(post.content)}
                            </span>
                          </div>
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

            {/* ── Create / Edit Form ───────────────────── */}
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
                      <div className="content-label-row">
                        <label htmlFor="content">Content *</label>
                        <div className="editor-toggle">
                          <button
                            type="button"
                            className={`toggle-btn ${!showPreview ? "active" : ""}`}
                            onClick={() => setShowPreview(false)}
                          >
                            Write
                          </button>
                          <button
                            type="button"
                            className={`toggle-btn ${showPreview ? "active" : ""}`}
                            onClick={() => setShowPreview(true)}
                          >
                            Preview
                          </button>
                        </div>
                      </div>

                      {!showPreview ? (
                        <>
                          <RichToolbar
                            textareaRef={contentRef}
                            value={formData.content}
                            onChange={(val) =>
                              setFormData({ ...formData, content: val })
                            }
                          />
                          <textarea
                            id="content"
                            ref={contentRef}
                            value={formData.content}
                            onChange={(e) =>
                              setFormData({ ...formData, content: e.target.value })
                            }
                            placeholder="Write your post content here..."
                            rows={20}
                            required
                            className="content-textarea"
                          />
                        </>
                      ) : (
                        <div className="content-preview">
                          {formData.content ? (
                            <div
                              className="preview-body blog-content"
                              dangerouslySetInnerHTML={{ __html: formData.content }}
                            />
                          ) : (
                            <p className="text-muted">Nothing to preview yet...</p>
                          )}
                        </div>
                      )}

                      <div className="content-footer">
                        <span>{wordCount(formData.content)} words</span>
                        <span>{readingTime(formData.content)}</span>
                      </div>
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
