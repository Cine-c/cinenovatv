import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import SEOHead from '../components/seo/SEOHead';
import { WebSiteJsonLd } from '../components/seo/JsonLd';
import Link from 'next/link';
import NewsletterSignup from '../components/NewsletterSignup';
import AdSlot from '../components/AdSlot';
import MovieCard from '../components/trailers/MovieCard';
import TrailerModal from '../components/trailers/TrailerModal';
import ReelsView from '../components/trailers/ReelsView';
import MatchCard from '../components/sports/MatchCard';
import useIsMobile from '../components/hooks/useIsMobile';
import { useLanguage } from '../components/LanguageContext';

const PreRollOverlay = dynamic(() => import('../components/PreRollOverlay'), { ssr: false });

const HOME_SPORTS = [
  { name: 'Football', icon: '\u26BD', description: 'Live scores, standings & fixtures.', href: '/sports/football', color: '#10b981' },
  { name: 'Formula 1', icon: '\uD83C\uDFCE\uFE0F', description: 'Race results & driver standings.', href: '/sports/f1', color: '#ef4444', comingSoon: true },
  { name: 'NBA', icon: '\uD83C\uDFC0', description: 'Basketball scores & stats.', href: '/sports/nba', color: '#f97316', comingSoon: true },
  { name: 'NFL', icon: '\uD83C\uDFC8', description: 'Football scores & rankings.', href: '/sports/nfl', color: '#3b82f6', comingSoon: true },
];

function SportsSection() {
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    fetch('/api/sports/football/fixtures?league=39')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setFixtures(data.slice(0, 6)); })
      .catch(() => {});
  }, []);

  return (
    <section className="home-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <span className="section-icon">{'\uD83C\uDFC6'}</span>
            Sports Center
          </h2>
          <p className="section-subtitle">Live scores, standings & fixtures</p>
        </div>
        <Link href="/sports" className="view-all-link">
          View All
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
      {fixtures.length > 0 && (
        <div className="match-grid" style={{ marginBottom: '1.5rem' }}>
          {fixtures.map((f) => (
            <MatchCard key={f.fixture.id} fixture={f} />
          ))}
        </div>
      )}
      <div className="sport-card-grid sport-card-grid--compact">
        {HOME_SPORTS.map((sport) => {
          const card = (
            <div key={sport.name} className="sport-card" style={{ '--sport-accent': sport.color }}>
              <div className="sport-card-icon">{sport.icon}</div>
              <h3 className="sport-card-name">{sport.name}</h3>
              <p className="sport-card-desc">{sport.description}</p>
              {sport.comingSoon && <span className="sport-card-badge">Coming Soon</span>}
            </div>
          );
          return sport.comingSoon ? card : (
            <Link key={sport.name} href={sport.href} className="sport-card-link">{card}</Link>
          );
        })}
      </div>
    </section>
  );
}

function HomeMovieRow({ title, movies, viewAllHref, onWatchTrailer }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="discover-row">
      <div className="discover-row-header">
        <h2>{title}</h2>
        <Link href={viewAllHref} className="discover-view-all">
          View All
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="discover-row-container">
        <button className="discover-scroll-btn discover-scroll-left" onClick={() => scroll('left')} aria-label="Scroll left">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="discover-row-scroll" ref={scrollRef}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onWatchTrailer={onWatchTrailer} />
          ))}
        </div>
        <button className="discover-scroll-btn discover-scroll-right" onClick={() => scroll('right')} aria-label="Scroll right">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default function Home({ featuredMovie, trending, nowPlaying, upcoming, popular }) {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [heroTrailerKey, setHeroTrailerKey] = useState(featuredMovie?.trailerKey || null);
  const [showHeroPreRoll, setShowHeroPreRoll] = useState(!!featuredMovie?.trailerKey);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const allRowMovies = [...(trending || []), ...(nowPlaying || []), ...(upcoming || []), ...(popular || [])];

  const handleWatchTrailer = (movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);
  const handleNextMovie = () => {
    const idx = allRowMovies.findIndex((m) => m.id === selectedMovie?.id);
    if (idx >= 0 && idx < allRowMovies.length - 1) setSelectedMovie(allRowMovies[idx + 1]);
  };
  const handlePrevMovie = () => {
    const idx = allRowMovies.findIndex((m) => m.id === selectedMovie?.id);
    if (idx > 0) setSelectedMovie(allRowMovies[idx - 1]);
  };

  // Client-side fallback: fetch trailer if not available at build time
  useEffect(() => {
    if (featuredMovie?.id && !featuredMovie?.trailerKey) {
      fetch(`/api/movie/${featuredMovie.id}/trailer?language=${language}`)
        .then((res) => res.json())
        .then((data) => {
          const trailer = (data.results || []).find(
            (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
          );
          if (trailer?.key) {
            setHeroTrailerKey(trailer.key);
            setShowHeroPreRoll(true);
          }
        })
        .catch(() => {});
    }
  }, [featuredMovie?.id, featuredMovie?.trailerKey]);

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
            {heroTrailerKey && !showHeroPreRoll && (
              <div className="featured-hero-video">
                <iframe
                  src={`https://www.youtube.com/embed/${heroTrailerKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${heroTrailerKey}&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3`}
                  title={`${featuredMovie.title} trailer`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  frameBorder="0"
                />
              </div>
            )}
            {showHeroPreRoll && heroTrailerKey && (
              <PreRollOverlay onSkip={() => setShowHeroPreRoll(false)} />
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

      {/* Dynamic Movie Rows */}
      <HomeMovieRow title="Trending Now" movies={trending} viewAllHref="/discover" onWatchTrailer={handleWatchTrailer} />
      <HomeMovieRow title="Now in Theaters" movies={nowPlaying} viewAllHref="/trailers?category=now-playing" onWatchTrailer={handleWatchTrailer} />

      <AdSlot slot="9497514084" />

      {/* Sports Section */}
      <SportsSection />

      <HomeMovieRow title="Coming Soon" movies={upcoming} viewAllHref="/trailers?category=upcoming" onWatchTrailer={handleWatchTrailer} />
      <HomeMovieRow title="Popular on Streaming" movies={popular} viewAllHref="/discover" onWatchTrailer={handleWatchTrailer} />

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

      {/* Newsletter */}
      <section className="home-section">
        <NewsletterSignup variant="inline" />
      </section>

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

      {/* Trailer Playback */}
      {selectedMovie && (
        isMobile ? (
          <ReelsView
            movie={selectedMovie}
            movies={allRowMovies}
            onNextMovie={handleNextMovie}
            onPrevMovie={handlePrevMovie}
            onClose={handleCloseModal}
          />
        ) : (
          <TrailerModal
            movie={selectedMovie}
            movies={allRowMovies}
            onNextMovie={handleNextMovie}
            onClose={handleCloseModal}
          />
        )
      )}
    </>
  );
}

function serializeMovies(results) {
  return (results || []).map((m) => ({
    id: m.id,
    title: m.title,
    poster_path: m.poster_path,
    backdrop_path: m.backdrop_path,
    release_date: m.release_date || '',
    vote_average: m.vote_average || 0,
    overview: m.overview || '',
    releaseYear: m.release_date ? m.release_date.split('-')[0] : '',
  }));
}

export async function getStaticProps() {
  const apiKey = process.env.TMDB_API_KEY;

  let featuredMovie = null;
  let trending = [];
  let nowPlaying = [];
  let upcoming = [];
  let popular = [];

  if (apiKey) {
    try {
      const [trendingRes, nowPlayingRes, upcomingRes, popularRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`),
        fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`),
        fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`),
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`),
      ]);

      const [trendingData, nowPlayingData, upcomingData, popularData] = await Promise.all([
        trendingRes.json(),
        nowPlayingRes.json(),
        upcomingRes.json(),
        popularRes.json(),
      ]);

      trending = serializeMovies(trendingData.results);
      nowPlaying = serializeMovies(nowPlayingData.results);
      upcoming = serializeMovies(upcomingData.results);
      popular = serializeMovies(popularData.results);

      // Featured movie from trending (with backdrop) - randomly shuffled
      const trendingWithBackdrop = trending.filter(m => m.backdrop_path && m.overview);
      featuredMovie = trendingWithBackdrop.length > 0
        ? trendingWithBackdrop[Math.floor(Math.random() * trendingWithBackdrop.length)]
        : trending[0] || null;

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
      console.error('Error fetching homepage data:', err);
    }
  }

  return {
    props: {
      featuredMovie,
      trending,
      nowPlaying,
      upcoming,
      popular,
    },
  };
}
