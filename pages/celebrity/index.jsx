import Link from 'next/link';
import { useState, useEffect } from 'react';
import SEOHead from '../../components/seo/SEOHead';

const CATEGORY_LABELS = {
  all: 'All',
  actor: 'Actors',
  actress: 'Actresses',
  director: 'Directors',
  music_artist_in_film: 'Music Artists',
};

function CelebCard({ celebrity }) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!celebrity.wikipedia_slug) return;
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(celebrity.wikipedia_slug)}`)
      .then((r) => r.json())
      .then((d) => setImage(d.thumbnail?.source || null))
      .catch(() => {});
  }, [celebrity.wikipedia_slug]);

  return (
    <Link href={`/celebrity/${celebrity.slug}`} className="celeb-index-card">
      <div className="celeb-index-card-img">
        {image ? (
          <img src={image} alt={celebrity.name} loading="lazy" />
        ) : (
          <div className="celeb-index-placeholder">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" opacity="0.2">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
      <div className="celeb-index-card-body">
        <span className="celeb-index-category">
          {CATEGORY_LABELS[celebrity.category] || celebrity.category}
        </span>
        <h2>{celebrity.name}</h2>
        <span className="celeb-index-nationality">{celebrity.nationality}</span>
      </div>
    </Link>
  );
}

export default function CelebritiesIndex({ celebrities }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = celebrities.filter((c) => {
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <SEOHead
        title="Hollywood Celebrities — Actors, Directors & Stars"
        description="Explore biographies, filmographies, and latest news for 100 top Hollywood celebrities including actors, actresses, directors, and music artists in film."
        url="/celebrity"
      />

      <div className="celeb-index-page">
        <section className="celeb-index-hero">
          <h1>Celebrities</h1>
          <p>Explore biographies, filmographies, and latest news for Hollywood&apos;s biggest stars.</p>
        </section>

        <section className="celeb-index-controls">
          <div className="celeb-index-filters">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={`celeb-filter-btn${activeCategory === key ? ' active' : ''}`}
                onClick={() => setActiveCategory(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="celeb-index-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        <section className="celeb-index-grid">
          {filtered.length > 0 ? (
            filtered.map((c) => <CelebCard key={c.slug} celebrity={c} />)
          ) : (
            <div className="celeb-index-empty">
              <p>No celebrities found matching your criteria.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const data = require('../../data/celebrities.json');

  return {
    props: { celebrities: data.celebrities },
    revalidate: 86400,
  };
}
