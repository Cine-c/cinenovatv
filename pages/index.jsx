import SEOHead from '../components/seo/SEOHead';
import { WebSiteJsonLd } from '../components/seo/JsonLd';
import Link from 'next/link';
import Image from 'next/image';
import Subscribe from '../components/Subscribe';
import AdSlot from '../components/AdSlot';

export default function Home({ featuredMovie, posts, iconicScenes }) {
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
          <div className="blog-grid-large">
            {posts.map((post) => (
              <Link key={post.id} href="/blog" className="blog-card-link">
                <article className="blog-card-large">
                  {post.imageUrl && (
                    <div className="blog-card-image-large">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        style={{ objectFit: 'cover' }}
                      />
                      {post.category && (
                        <span className="blog-category-badge">{post.category}</span>
                      )}
                    </div>
                  )}
                  <div className="blog-card-content-large">
                    <h3 className="blog-card-title-large">{post.title}</h3>
                    <p className="blog-card-excerpt-large">
                      {post.excerpt?.slice(0, 180)}...
                    </p>
                    <div className="blog-card-footer">
                      <span className="blog-card-date">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'Recent'}
                      </span>
                      <span className="blog-card-read-more">
                        Read Article →
                      </span>
                    </div>
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

      {/* Ad Placeholder 2 */}
      <AdSlot slot="homepage" />

      {/* Iconic Movie Scenes */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <span className="section-icon">🎬</span>
              Iconic Movie Scenes
            </h2>
            <p className="section-subtitle">Unforgettable moments in cinema history</p>
          </div>
          <Link href="/scenes" className="view-all-link">
            View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        <div className="scenes-grid">
          {iconicScenes.slice(0, 6).map((scene, index) => (
            <Link key={index} href={`/scenes/${scene.slug}`} className="scene-card-link-home">
              <article className="scene-card">
                <div className="scene-card-image">
                  <Image
                    src={scene.image}
                    alt={scene.title}
                    width={500}
                    height={280}
                    loading="lazy"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="scene-card-overlay">
                    <span className="scene-movie-title">{scene.movie}</span>
                  </div>
                </div>
                <div className="scene-card-content">
                  <h3 className="scene-card-title">{scene.title}</h3>
                  <p className="scene-card-description">{scene.description}</p>
                  <div className="scene-card-meta">
                    <span className="scene-year">{scene.year}</span>
                    <span className="scene-director">Dir: {scene.director}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Ad Placeholder 3 */}
      <AdSlot slot="homepage" />

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
          <article className="insight-card">
            <div className="insight-icon">🎭</div>
            <h3>Acting Masterclass</h3>
            <p>Discover the techniques that made legendary performances unforgettable. From method acting to improvisation.</p>
          </article>
          <article className="insight-card">
            <div className="insight-icon">🎥</div>
            <h3>Cinematography</h3>
            <p>Explore how directors of photography create visual magic through lighting, framing, and camera movement.</p>
          </article>
          <article className="insight-card">
            <div className="insight-icon">🎵</div>
            <h3>Film Scores</h3>
            <p>The music that moves us. Learn how composers craft the emotional backbone of your favorite films.</p>
          </article>
          <article className="insight-card">
            <div className="insight-icon">✂️</div>
            <h3>Editing Magic</h3>
            <p>The invisible art that shapes storytelling. See how editors create tension, emotion, and flow.</p>
          </article>
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

  // Iconic movie scenes data
  const iconicScenes = [
    {
      slug: "ill-be-back-terminator",
      title: "I'll Be Back",
      movie: "The Terminator",
      year: "1984",
      director: "James Cameron",
      description: "Arnold Schwarzenegger's robotic promise became one of cinema's most quoted lines, defining an era of action movies.",
      image: "https://image.tmdb.org/t/p/w500/qvktm0BHcnmDpul4Hz01GIazWPr.jpg"
    },
    {
      slug: "heres-looking-at-you-casablanca",
      title: "Here's Looking at You, Kid",
      movie: "Casablanca",
      year: "1942",
      director: "Michael Curtiz",
      description: "Humphrey Bogart's tender farewell to Ingrid Bergman remains the gold standard for romantic cinema moments.",
      image: "https://image.tmdb.org/t/p/w500/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg"
    },
    {
      slug: "bullet-time-matrix",
      title: "The Bullet Time",
      movie: "The Matrix",
      year: "1999",
      director: "The Wachowskis",
      description: "Neo's rooftop dodge revolutionized visual effects and inspired countless imitations in action filmmaking.",
      image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"
    },
    {
      slug: "i-am-your-father-empire-strikes-back",
      title: "I Am Your Father",
      movie: "The Empire Strikes Back",
      year: "1980",
      director: "Irvin Kershner",
      description: "The greatest plot twist in cinema history that shocked audiences and redefined the Star Wars saga forever.",
      image: "https://image.tmdb.org/t/p/w500/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg"
    },
    {
      slug: "shower-scene-psycho",
      title: "The Shower Scene",
      movie: "Psycho",
      year: "1960",
      director: "Alfred Hitchcock",
      description: "78 camera setups, 52 cuts, and pure terror. Hitchcock's masterpiece changed horror forever.",
      image: "https://image.tmdb.org/t/p/w500/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg"
    },
    {
      slug: "you-talking-to-me-taxi-driver",
      title: "You Talking to Me?",
      movie: "Taxi Driver",
      year: "1976",
      director: "Martin Scorsese",
      description: "Robert De Niro's improvised mirror monologue became an iconic symbol of urban isolation and madness.",
      image: "https://image.tmdb.org/t/p/w500/ekstpH614fwDX8DUln1a2Opz0N8.jpg"
    }
  ];

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
    const { getPublishedPosts } = await import('../lib/firebase');
    posts = await getPublishedPosts(4);
  } catch (err) {
    console.error('Error fetching posts:', err);
  }

  return {
    props: {
      featuredMovie,
      posts,
      iconicScenes,
    },
    revalidate: 300,
  };
}
