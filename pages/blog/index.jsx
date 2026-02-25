import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SEOHead from '../../components/seo/SEOHead';
import { ItemListJsonLd } from '../../components/seo/JsonLd';
import BlogList from '../../components/blog/BlogList';
import AdSlot from '../../components/AdSlot';

const POSTS_PER_PAGE = 9;

export default function BlogIndex({ posts, categories }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.author?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [posts, activeCategory, searchQuery]);

  const featuredPost = !searchQuery && !activeCategory ? posts[0] || null : null;
  const remainingPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  const totalPages = Math.ceil(remainingPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = remainingPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';

  return (
    <>
      <SEOHead
        title="Blog"
        description="Read the latest movie news, reviews, and entertainment articles on CineNovaTV."
        url="/blog"
      />
      <ItemListJsonLd items={posts.slice(0, 10)} type="BlogPosting" />

      <div className="blog-header">
        <h1 className="blog-header-title">Blog</h1>
        <p className="blog-header-subtitle">
          Movie news, reviews, and entertainment articles from the CineNovaTV team.
        </p>
      </div>

      {/* Filters */}
      <div className="blog-filters">
        <div className="blog-search-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="search"
            className="blog-search-input"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>
        {categories && categories.length > 0 && (
          <div className="blog-category-filters">
            <button
              className={`blog-filter-btn${!activeCategory ? ' active' : ''}`}
              onClick={() => { setActiveCategory(''); setCurrentPage(1); }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`blog-filter-btn${activeCategory === cat ? ' active' : ''}`}
                onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {featuredPost && (
        <article className="blog-featured">
          {featuredPost.imageUrl && (
            <Link href={`/blog/${featuredPost.slug}`} className="blog-featured-image">
              <Image
                src={featuredPost.imageUrl}
                alt={featuredPost.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                priority
              />
              {featuredPost.category && (
                <span className="blog-category-badge">{featuredPost.category}</span>
              )}
            </Link>
          )}
          <div className="blog-featured-content">
            <Link href={`/blog/${featuredPost.slug}`}>
              <h2 className="blog-featured-title">{featuredPost.title}</h2>
            </Link>
            {featuredPost.excerpt && (
              <p className="blog-featured-excerpt">{featuredPost.excerpt}</p>
            )}
            <div className="blog-card-meta">
              {formatDate(featuredPost.publishedAt) && (
                <time dateTime={featuredPost.publishedAt}>
                  {formatDate(featuredPost.publishedAt)}
                </time>
              )}
              {featuredPost.author && (
                <span className="blog-card-author">by {featuredPost.author}</span>
              )}
              {featuredPost.readingTime && (
                <span>{featuredPost.readingTime} min read</span>
              )}
            </div>
            <Link href={`/blog/${featuredPost.slug}`} className="blog-card-link">
              Read More
            </Link>
          </div>
        </article>
      )}

      <AdSlot />

      <BlogList posts={paginatedPosts} />

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <section className="blog-topics">
        <h2 className="blog-topics-title">Explore Topics</h2>
        <div className="blog-topics-grid">
          <div className="blog-topic-card">
            <span className="blog-topic-icon">{'\uD83C\uDFAD'}</span>
            <h3 className="blog-topic-name">Acting Masterclass</h3>
            <p className="blog-topic-desc">
              Discover the techniques that made legendary performances unforgettable. From method acting to improvisation.
            </p>
          </div>
          <div className="blog-topic-card">
            <span className="blog-topic-icon">{'\uD83C\uDFA5'}</span>
            <h3 className="blog-topic-name">Cinematography</h3>
            <p className="blog-topic-desc">
              Explore how directors of photography create visual magic through lighting, framing, and camera movement.
            </p>
          </div>
          <div className="blog-topic-card">
            <span className="blog-topic-icon">{'\uD83C\uDFB5'}</span>
            <h3 className="blog-topic-name">Film Scores</h3>
            <p className="blog-topic-desc">
              The music that moves us. Learn how composers craft the emotional backbone of your favorite films.
            </p>
          </div>
          <div className="blog-topic-card">
            <span className="blog-topic-icon">{'\u2702\uFE0F'}</span>
            <h3 className="blog-topic-name">Editing Magic</h3>
            <p className="blog-topic-desc">
              The invisible art that shapes storytelling. See how editors create tension, emotion, and flow.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export async function getStaticProps() {
  let posts = [];

  try {
    const { getAllPublishedPosts } = await import('../../lib/firestore');
    posts = await getAllPublishedPosts();
  } catch (err) {
    console.error('Error fetching posts:', err);
  }

  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))];

  return {
    props: {
      posts,
      categories,
    },
  };
}
