import Link from 'next/link';
import { useState, useEffect } from 'react';
import SEOHead from '../../components/seo/SEOHead';
import AdSlot from '../../components/AdSlot';

const CATEGORY_LABELS = {
  actor: 'Actor',
  actress: 'Actress',
  director: 'Director',
  music_artist_in_film: 'Music Artist in Film',
};

function NewsSection({ query }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) { setLoading(false); return; }
    fetch(`/api/celebrity-news?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((data) => { setArticles(data.articles || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [query]);

  const googleNewsUrl = `https://news.google.com/search?q=${encodeURIComponent(query)}`;

  return (
    <div className="celeb-news-section">
      <h2>Latest News</h2>
      {loading ? (
        <div className="celeb-news-loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="celeb-news-skeleton" />
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="celeb-news-grid">
          {articles.map((a, i) => (
            <a
              key={i}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="celeb-news-card"
            >
              {a.image && (
                <div className="celeb-news-img">
                  <img src={a.image} alt="" loading="lazy" />
                </div>
              )}
              <div className="celeb-news-body">
                <span className="celeb-news-source">{a.source}</span>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="celeb-news-empty">
          No recent articles found.{' '}
          <a href={googleNewsUrl} target="_blank" rel="noopener noreferrer">
            Search Google News &rarr;
          </a>
        </p>
      )}
      {articles.length > 0 && (
        <a
          href={googleNewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="celeb-news-more"
        >
          More news on Google &rarr;
        </a>
      )}
    </div>
  );
}

function useWikiImage(slug) {
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (!slug) return;
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => setImage(d.thumbnail?.source || d.originalimage?.source || null))
      .catch(() => {});
  }, [slug]);
  return image;
}

export default function CelebrityPage({ celebrity }) {
  const wikiImage = useWikiImage(celebrity?.wikipedia_slug);

  if (!celebrity) {
    return (
      <div className="celeb-page">
        <div className="empty-state">
          <h1>Celebrity Not Found</h1>
          <Link href="/celebrity" className="btn btn-primary">Browse Celebrities</Link>
        </div>
      </div>
    );
  }

  const categoryLabel = CATEGORY_LABELS[celebrity.category] || celebrity.category;
  const seoTitle = `${celebrity.name} — Top Movies, Bio & Latest News (2026)`;
  const seoDescription = celebrity.bio.slice(0, 155) + '...';

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        image={wikiImage || '/og-image.jpg'}
        url={`/celebrity/${celebrity.slug}`}
        type="profile"
      />

      <div className="celeb-page">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <Link href="/">Home</Link>
          <span className="separator">/</span>
          <Link href="/celebrity">Celebrities</Link>
          <span className="separator">/</span>
          <span className="current">{celebrity.name}</span>
        </nav>

        {/* Hero Section */}
        <section className="celeb-hero">
          <div className="celeb-hero-bg" />
          <div className="celeb-hero-content">
            <div className="celeb-hero-portrait">
              {wikiImage ? (
                <img
                  src={wikiImage}
                  alt={celebrity.name}
                />
              ) : (
                <div className="celeb-portrait-placeholder">
                  <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor" opacity="0.3">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="celeb-hero-info">
              <span className="celeb-category-badge">{categoryLabel}</span>
              <h1>{celebrity.name}</h1>
              <div className="celeb-meta">
                <span className="celeb-meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  {celebrity.birthplace}
                </span>
                <span className="celeb-meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Born {celebrity.born}
                </span>
                <span className="celeb-meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                  {celebrity.nationality}
                </span>
              </div>
              <div className="celeb-tags">
                {celebrity.tags.map((tag) => (
                  <span key={tag} className="celeb-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="celeb-body">
          {/* Biography */}
          <div className="celeb-section">
            <h2>Biography</h2>
            <p className="celeb-bio-text">{celebrity.bio}</p>
          </div>

          {/* Top Movies / Filmography */}
          <div className="celeb-section">
            <h2>Top {celebrity.category === 'director' ? 'Films' : 'Movies'}</h2>
            <div className="celeb-filmography">
              {celebrity.top_movies.map((movie, i) => (
                <div key={i} className="celeb-film-item">
                  <span className="celeb-film-rank">{i + 1}</span>
                  <span className="celeb-film-title">{movie}</span>
                </div>
              ))}
            </div>
          </div>

          <AdSlot slot="1594520752" format="in-article" />

          {/* YouTube Interview / Video */}
          {celebrity.youtube_embed_id && (
            <div className="celeb-section">
              <h2>{celebrity.youtube_title || 'Featured Video'}</h2>
              <div className="celeb-video-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${celebrity.youtube_embed_id}`}
                  title={celebrity.youtube_title || `${celebrity.name} Video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Latest News */}
          <div className="celeb-section">
            <NewsSection query={celebrity.news_search_query} />
          </div>

          <AdSlot slot="1594520752" format="in-article" />
        </section>

        {/* Back link */}
        <section className="celeb-nav">
          <Link href="/celebrity" className="back-to-blog">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All Celebrities
          </Link>
        </section>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const data = require('../../data/celebrities.json');
  const paths = data.celebrities.map((c) => ({ params: { slug: c.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const data = require('../../data/celebrities.json');
  const celebrity = data.celebrities.find((c) => c.slug === params.slug);

  if (!celebrity) {
    return { notFound: true };
  }

  return {
    props: { celebrity },
    revalidate: 86400,
  };
}
