import SEOHead from '../components/seo/SEOHead';
import { WebSiteJsonLd } from '../components/seo/JsonLd';
import Link from 'next/link';
import Image from 'next/image';
import Subscribe from '../components/Subscribe';
import AdSlot from '../components/AdSlot';

export default function Home({ featuredMovie, posts, blockbusterFilms }) {
  return (
    <>
      <SEOHead
        title="CineNovaTV - Movie Trailers, Reviews & Film News"
        description="Watch the latest movie trailers, read reviews, and stay updated with film news. Discover trending, upcoming, and popular movies all in one place."
        url="/"
      />
      <WebSiteJsonLd />

      {/* Featured Movie Hero */}
      {featuredMovie && (
        <section className="featured-hero">
          <div
            className="featured-hero-backdrop"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w1280${featuredMovie.backdrop_path})`
            }}
          >
            {featuredMovie.trailerKey && (
              <div className="featured-hero-video">
                <iframe
                  src={`https://www.youtube.com/embed/${featuredMovie.trailerKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${featuredMovie.trailerKey}&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3`}
                  title={`${featuredMovie.title} trailer`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  frameBorder="0"
                />
              </div>
            )}
            <div className="featured-hero-overlay"></div>
            <div className="featured-hero-content">
              <span className="featured-badge">
                <span className="badge-icon">🔥</span>
                Featured Today
              </span>
              <h1>{featuredMovie.title}</h1>
              <p className="featured-overview">
                {featuredMovie.overview?.slice(0, 200)}...
              </p>
              <div className="featured-meta">
                <span className="featured-rating">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {featuredMovie.vote_average?.toFixed(1)}
                </span>
                <span className="featured-year">
                  {featuredMovie.release_date?.split('-')[0]}
                </span>
              </div>
              <Link href={`/trailers?play=${featuredMovie.id}`} className="btn btn-primary btn-glow btn-large">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Trailer
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Ad Placeholder 1 */}
      <AdSlot slot="homepage" />

      {/* Blockbuster Film Reviews */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <span className="section-icon">🎬</span>
              Blockbuster Film Reviews
            </h2>
            <p className="section-subtitle">In-depth editorial coverage of the biggest releases</p>
          </div>
          <Link href="/blockbuster" className="view-all-link">
            View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        <div className="bb-home-grid">
          {blockbusterFilms.map((film) => (
            <a key={film.slug} href={`/blockbuster/${film.slug}.html`} className="bb-home-card">
              <div className="bb-home-card-img">
                <img src={film.tmdb} alt={film.title} loading="lazy" />
                <div className="bb-home-card-overlay" />
              </div>
              <div className="bb-home-card-info">
                <span className="bb-badge-sm" style={{ color: film.accent, background: `${film.accent}20` }}>{film.genre}</span>
                <h3 className="bb-home-card-title">{film.title}</h3>
                <p className="bb-home-card-tagline">{film.tagline}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Ad Placeholder 2 */}
      <AdSlot slot="homepage" />

      {/* Latest News & Reviews */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <span className="section-icon">📰</span>
              Latest News & Reviews
            </h2>
            <p className="section-subtitle">Stay updated with the film world</p>
          </div>
          <Link href="/blog" className="view-all-link">
            View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        {posts && posts.length > 0 ? (
          <div className="blog-grid-compact">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="blog-compact-link">
                <article className="blog-compact-card">
                  <div className="blog-compact-img">
                    {post.imageUrl && (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                    <div className="blog-compact-overlay" />
                  </div>
                  <div className="blog-compact-info">
                    {post.category && <span className="bb-badge-sm">{post.category}</span>}
                    <h3 className="blog-compact-title">{post.title}</h3>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-blog-state">
            <p>No posts yet. Check back soon for movie news and reviews!</p>
          </div>
        )}
      </section>

      {/* Movie Insights Section */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <span className="section-icon">💡</span>
              Movie Insights
            </h2>
            <p className="section-subtitle">Behind the scenes and trivia</p>
          </div>
        </div>
        <div className="insights-grid">
          <Link href="/academy/acting-masterclass" className="insight-card-link">
            <article className="insight-card">
              <div className="insight-icon">🎭</div>
              <h3>Acting Masterclass</h3>
              <p>Discover the techniques that made legendary performances unforgettable. From method acting to improvisation.</p>
            </article>
          </Link>
          <Link href="/academy/cinematography" className="insight-card-link">
            <article className="insight-card">
              <div className="insight-icon">🎥</div>
              <h3>Cinematography</h3>
              <p>Explore how directors of photography create visual magic through lighting, framing, and camera movement.</p>
            </article>
          </Link>
          <Link href="/academy/film-scores" className="insight-card-link">
            <article className="insight-card">
              <div className="insight-icon">🎵</div>
              <h3>Film Scores</h3>
              <p>The music that moves us. Learn how composers craft the emotional backbone of your favorite films.</p>
            </article>
          </Link>
          <Link href="/academy/editing-magic" className="insight-card-link">
            <article className="insight-card">
              <div className="insight-icon">✂️</div>
              <h3>Editing Magic</h3>
              <p>The invisible art that shapes storytelling. See how editors create tension, emotion, and flow.</p>
            </article>
          </Link>
        </div>
      </section>

      {/* Subscribe Section */}
      <Subscribe />

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Explore All Trailers</h2>
          <p>Browse thousands of movie trailers from blockbusters to indie films</p>
          <Link href="/trailers" className="btn btn-primary btn-large">
            Browse Trailers
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}

export async function getStaticProps() {
  const apiKey = process.env.TMDB_API_KEY;

  let featuredMovie = null;
  let posts = [];

  const allBlockbusterFilms = [
    { slug: 'sinners-2025', title: 'Sinners', genre: 'Horror', accent: '#b5362a', tagline: 'Some sins can never be washed clean.', tmdb: 'https://image.tmdb.org/t/p/w500/qTvFWCGeGXgBRaINLY1zqgTPSpn.jpg' },
    { slug: 'superman-2025', title: 'Superman', genre: 'Superhero', accent: '#3a7ae8', tagline: 'Truth. Justice. A better tomorrow.', tmdb: 'https://image.tmdb.org/t/p/w500/oe5TVF6GQDESLsGiFrN6GyJEekh.jpg' },
    { slug: 'thunderbolts-2025', title: 'Thunderbolts*', genre: 'Superhero', accent: '#e8c240', tagline: 'Every hero has a dark side. These are the dark sides.', tmdb: 'https://image.tmdb.org/t/p/w500/hqcexYHbiTBfDIdDWxrxPtVndBX.jpg' },
    { slug: 'mission-impossible-final-reckoning-2025', title: 'Mission: Impossible – The Final Reckoning', genre: 'Action', accent: '#d44020', tagline: 'Every mission has a price. This is the final one.', tmdb: 'https://image.tmdb.org/t/p/w500/z53D72EAOxGRqdr7KXXWp9dJiDe.jpg' },
    { slug: '28-years-later-2025', title: '28 Years Later', genre: 'Horror', accent: '#c83a00', tagline: 'The infection survived. So did they.', tmdb: 'https://image.tmdb.org/t/p/w500/n5FygjEppOvac6yEaowi26nTyw3.jpg' },
    { slug: 'avatar-fire-and-ash-2025', title: 'Avatar: Fire and Ash', genre: 'Sci-Fi', accent: '#ff8040', tagline: 'Pandora burns. The Na\'vi rise.', tmdb: 'https://image.tmdb.org/t/p/w500/bRBeSHfGHwkEpImlhxPmOcUsaeg.jpg' },
    { slug: 'f1-2025', title: 'F1', genre: 'Action', accent: '#e83020', tagline: 'Speed is everything. Survival is everything else.', tmdb: 'https://image.tmdb.org/t/p/w500/vqBmyAj0Xm9LnS1xe1MSlMAJyHq.jpg' },
    { slug: 'the-housemaid-2025', title: 'The Housemaid', genre: 'Thriller', accent: '#e84060', tagline: 'She was hired to serve. She was meant to survive.', tmdb: 'https://image.tmdb.org/t/p/w500/mJGFduBPAzTKzOeCeTjBBOxnalB.jpg' },
    { slug: 'scream-7', title: 'Scream VII', genre: 'Horror', accent: '#cc1a1a', tagline: 'Sidney Prescott returns. Ghostface is still calling.', tmdb: 'https://image.tmdb.org/t/p/w500/jjyuk0edLiW8vOSnlfwWCCLpbh5.jpg' },
    { slug: 'wicked-for-good-2025', title: 'Wicked: For Good', genre: 'Musical', accent: '#c840c8', tagline: 'Because I knew you... I have been changed for good.', tmdb: 'https://image.tmdb.org/t/p/w500/si9tolnefLSUKaqQEGz1bWArOaL.jpg' },
    { slug: 'lilo-stitch-2025', title: 'Lilo & Stitch', genre: 'Family', accent: '#4a9eff', tagline: 'Ohana means family. Nobody gets left behind.', tmdb: 'https://image.tmdb.org/t/p/w500/ckQzKpQJO4ZQDCN5evdpKcfm7Ys.jpg' },
    { slug: 'jurassic-world-rebirth-2025', title: 'Jurassic World: Rebirth', genre: 'Sci-Fi', accent: '#b0d038', tagline: 'Life always finds a way. So does danger.', tmdb: 'https://image.tmdb.org/t/p/w500/1RICxzeoNCAO5NpcRMIgg1XT6fm.jpg' },
  ];
  // Shuffle and pick 6 for homepage
  const shuffled = allBlockbusterFilms.sort(() => Math.random() - 0.5);
  const blockbusterFilms = shuffled.slice(0, 6);

  if (apiKey) {
    try {
      const trendingRes = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`
      );
      const trendingData = await trendingRes.json();

      // Featured movie from trending (with backdrop) - randomly shuffled
      const trending = (trendingData.results || []).filter(m => m.backdrop_path && m.overview);
      featuredMovie = trending.length > 0
        ? trending[Math.floor(Math.random() * trending.length)]
        : (trendingData.results || [])[0];

      // Fetch trailer for featured movie
      if (featuredMovie?.id) {
        try {
          const videosRes = await fetch(
            `https://api.themoviedb.org/3/movie/${featuredMovie.id}/videos?api_key=${apiKey}`
          );
          const videosData = await videosRes.json();
          const trailer = (videosData.results || []).find(
            v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
          );
          if (trailer) {
            featuredMovie.trailerKey = trailer.key;
          }
        } catch (e) {
          console.error('Error fetching trailer:', e);
        }
      }

    } catch (err) {
      console.error('Error fetching featured movie:', err);
    }
  }

  // Fetch blog posts
  try {
    const { getPublishedPosts } = await import('../lib/firestore');
    posts = await getPublishedPosts(4);
  } catch (err) {
    console.error('Error fetching posts:', err);
  }

  return {
    props: {
      featuredMovie,
      posts,
      blockbusterFilms,
    },
  };
}
