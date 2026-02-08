import BlogCard from './BlogCard';

export default function BlogList({ posts, title }) {
  if (!posts || posts.length === 0) {
    return (
      <section className="blog-list-section">
        {title && <h2 className="section-title">{title}</h2>}
        <p className="no-posts">No posts available yet. Check back soon!</p>
      </section>
    );
  }

  return (
    <section className="blog-list-section">
      {title && <h2 className="section-title">{title}</h2>}
      <div className="blog-grid">
        {posts.map((post) => (
          <BlogCard key={post.id || post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
