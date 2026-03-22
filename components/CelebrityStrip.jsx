import Link from 'next/link';
import { useState, useEffect } from 'react';

const CATEGORY_LABELS = {
  actor: 'Actor',
  actress: 'Actress',
  director: 'Director',
  music_artist_in_film: 'Artist',
};

function CelebChip({ celeb }) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!celeb.wikipedia_slug) return;
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(celeb.wikipedia_slug)}`)
      .then((r) => r.json())
      .then((d) => setImage(d.thumbnail?.source || null))
      .catch(() => {});
  }, [celeb.wikipedia_slug]);

  return (
    <Link href={`/celebrity/${celeb.slug}`} className="celeb-strip-card">
      <div className="celeb-strip-img">
        {image ? (
          <img src={image} alt={celeb.name} loading="lazy" />
        ) : (
          <div className="celeb-strip-placeholder">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" opacity="0.2">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
      <span className="celeb-strip-name">{celeb.name}</span>
      <span className="celeb-strip-role">{CATEGORY_LABELS[celeb.category] || celeb.category}</span>
    </Link>
  );
}

export default function CelebrityStrip({ celebrities }) {
  if (!celebrities || celebrities.length === 0) return null;

  return (
    <div className="celeb-strip">
      {celebrities.map((c) => (
        <CelebChip key={c.slug} celeb={c} />
      ))}
    </div>
  );
}
