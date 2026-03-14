import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import SEOHead from '../components/seo/SEOHead';
import { WebSiteJsonLd } from '../components/seo/JsonLd';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../components/LanguageContext';
import { useRouter } from 'next/router';
import AdSlot from '../components/AdSlot';
import NewsletterSignup from '../components/NewsletterSignup';
import MovieCard from '../components/trailers/MovieCard';

const PreRollOverlay = dynamic(() => import('../components/PreRollOverlay'), { ssr: false });


function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    el.querySelectorAll('.reveal').forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Home({ featuredMovie, nowPlaying, popular, genres }) {
  const { language } = useLanguage();
  const router = useRouter();
  const revealRef = useScrollReveal();
  const spotlightRef = useRef(null);
  const heroRef = useRef(null);
  const [heroTrailerKey, setHeroTrailerKey] = useState(featuredMovie?.trailerKey || null);
  const [showHeroPreRoll, setShowHeroPreRoll] = useState(!!featuredMovie?.trailerKey);

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
  }, [featuredMovie?.id, featuredMovie?.trailerKey, language]);

  // Spotlight mouse follow
  useEffect(() => {
    const hero = heroRef.current;
    const spot = spotlightRef.current;
    if (!hero || !spot) return;
    const handleMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spot.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
    };
    hero.addEventListener('mousemove', handleMove);
    return () => hero.removeEventListener('mousemove', handleMove);
  }, []);

  // Now playing items for the marquee ticker
  const tickerItems = (nowPlaying || []).slice(0, 9);

  // Top 4 popular movies for trending grid
  const trendingMovies = (popular || []).slice(0, 4);

  // Featured article movie — pick the second trending movie
  const articleMovie = (popular || [])[1] || featuredMovie;

  // First 6 genres for the genre grid
  const displayGenres = (genres || []).slice(0, 6);

  return (
    <div ref={revealRef} className="homepage-full">
      <SEOHead
        title="CineNovaTV - Discover Your Next Obsession"
        description="Watch the latest movie trailers, read reviews, and stay updated with film news. Discover trending, upcoming, and popular movies all in one place."
        url="/"
      />
      <WebSiteJsonLd />

      {/* ── HERO SPLIT ── */}
      <section className="hero-split" ref={heroRef}>
        <div className="hero-bg" />
        <div className="spotlight" ref={spotlightRef} />

        <div className="hero-content">
          <div className="hero-eyebrow">Now Streaming</div>
          <h1 className="hero-title">
            Where Every<br />Film Finds
            <em>Its Audience.</em>
          </h1>
          <p className="hero-sub">
            Discover what&apos;s worth watching tonight — across every platform, every genre. Curated for people who take cinema seriously.
          </p>
          <div className="hero-actions">
            <Link href="/discover" className="btn-primary">
              <span>Explore Films</span>
              <span>&rarr;</span>
            </Link>
            {featuredMovie && heroTrailerKey && (
              <Link
                href={`/trailers?play=${featuredMovie.id}`}
                className="btn-ghost"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Watch Trailer
              </Link>
            )}
          </div>
        </div>

        <div className="hero-visual">
          <div className="card-stack">
            {(nowPlaying || []).slice(0, 3).map((movie, i) => (
              <div className="card" key={movie.id}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  loading={i < 2 ? 'eager' : 'lazy'}
                />
                <div className="card-gradient" />
                {i === 2 && (
                  <>
                    <div className="card-info">
                      <div className="card-title">{movie.title}</div>
                      <div className="card-meta">
                        {movie.release_date?.split('-')[0]} &middot; {movie.vote_average?.toFixed(1)}
                      </div>
                    </div>
                    <div className="badge">New</div>
                  </>
                )}
              </div>
            ))}
            <div className="hero-stat">
              <div className="hero-stat-num">{featuredMovie?.vote_average?.toFixed(1) || '8.5'}</div>
              <div className="hero-stat-label">Top Rated</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">4K</div>
              <div className="hero-stat-label">Available Now</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE TICKER ── */}
      {tickerItems.length > 0 && (
        <div className="ticker">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((movie, i) => (
              <div className="ticker-item" key={`${movie.id}-${i}`}>
                <span className="dot" />
                {movie.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TRENDING GRID ── */}
      {trendingMovies.length > 0 && (
        <section className="home-section">
          <div className="section-header reveal">
            <div>
              <div className="section-tag">Right Now</div>
              <h2 className="section-title">Trending <em>This Week</em></h2>
            </div>
            <Link href="/discover" className="see-all">View All Films &rarr;</Link>
          </div>
          <div className="trending-grid reveal">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onWatchTrailer={() => router.push(`/trailers?play=${movie.id}`)} />
            ))}
          </div>
        </section>
      )}

      {/* ── AD SLOT 1 ── */}
      <div className="ad-container" key={router.asPath + '-ad1'}>
        <AdSlot slot="3307940521" />
      </div>

      {/* ── STATS BAR ── */}
      <div className="stats-bar reveal">
        <div className="stat-item">
          <div className="stat-num">50K+</div>
          <div className="stat-label">Films &amp; Series</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">40+</div>
          <div className="stat-label">Streaming Platforms</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">Daily</div>
          <div className="stat-label">Updated Picks</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">Free</div>
          <div className="stat-label">Always &amp; Forever</div>
        </div>
      </div>

      {/* ── FEATURED ARTICLE STRIP ── */}
      {articleMovie && (
        <div className="feature-strip reveal">
          <div className="feature-inner">
            <div className="feature-image">
              <img
                src={`https://image.tmdb.org/t/p/w780${articleMovie.backdrop_path || articleMovie.poster_path}`}
                alt={articleMovie.title}
              />
            </div>
            <div className="feature-text">
              <div className="feature-tag">&mdash; Editor&apos;s Spotlight</div>
              <h2 className="feature-title">
                Why <em>{articleMovie.title}</em> Is Worth Your Time
              </h2>
              <p className="feature-excerpt">
                {articleMovie.overview?.slice(0, 260)}...
              </p>
              <Link href={`/trailers?play=${articleMovie.id}`} className="btn-primary">
                <span>Watch Trailer</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── GENRE GRID ── */}
      {displayGenres.length > 0 && (
        <section className="home-section">
          <div className="section-header reveal">
            <div>
              <div className="section-tag">Explore</div>
              <h2 className="section-title">Browse by <em>Genre</em></h2>
            </div>
          </div>
          <div className="genre-grid reveal">
            {displayGenres.map((genre) => (
              <Link
                href={`/discover?genre=${genre.id}`}
                className="genre-card"
                key={genre.id}
              >
                <img
                  src={genre.image || `https://image.tmdb.org/t/p/w780/gPbM0MK8CP8A174rmUwGsADNYKD.jpg`}
                  alt={genre.name}
                  loading="lazy"
                />
                <div className="genre-name">{genre.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── AD SLOT 2 ── */}
      <div className="ad-container" key={router.asPath + '-ad2'}>
        <AdSlot slot="3307940521" />
      </div>

      {/* ── DECORATIVE LINE ── */}
      <div className="deco-line" />

      {/* ── NEWSLETTER ── */}
      <div className="newsletter-section reveal">
        <h2>Never Miss a <em>New Release.</em></h2>
        <p>Weekly picks, streaming drops, and critical coverage — straight to your inbox.</p>
        <NewsletterSignup variant="inline" />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const apiKey = process.env.TMDB_API_KEY;

  let featuredMovie = null;
  let nowPlaying = [];
  let popular = [];
  let genres = [];

  if (apiKey) {
    try {
      const [trendingRes, nowPlayingRes, popularRes, genresRes] = await Promise.allSettled([
        fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`),
        fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=1`),
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=1`),
        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`),
      ]);

      // Parse trending
      if (trendingRes.status === 'fulfilled') {
        const trendingData = await trendingRes.value.json();
        const trending = (trendingData.results || []).map((m) => ({
          id: m.id,
          title: m.title,
          poster_path: m.poster_path,
          backdrop_path: m.backdrop_path,
          release_date: m.release_date || '',
          vote_average: m.vote_average || 0,
          overview: m.overview || '',
        }));
        const trendingWithBackdrop = trending.filter((m) => m.backdrop_path && m.overview);
        featuredMovie = trendingWithBackdrop.length > 0
          ? trendingWithBackdrop[Math.floor(Math.random() * trendingWithBackdrop.length)]
          : trending[0] || null;
      }

      // Parse now_playing
      if (nowPlayingRes.status === 'fulfilled') {
        const npData = await nowPlayingRes.value.json();
        nowPlaying = (npData.results || []).slice(0, 12).map((m) => ({
          id: m.id,
          title: m.title,
          poster_path: m.poster_path,
          backdrop_path: m.backdrop_path,
          release_date: m.release_date || '',
          vote_average: m.vote_average || 0,
          overview: m.overview || '',
        }));
      }

      // Parse popular
      if (popularRes.status === 'fulfilled') {
        const popData = await popularRes.value.json();
        popular = (popData.results || []).slice(0, 8).map((m) => ({
          id: m.id,
          title: m.title,
          poster_path: m.poster_path,
          backdrop_path: m.backdrop_path,
          release_date: m.release_date || '',
          vote_average: m.vote_average || 0,
          overview: m.overview || '',
        }));
      }

      // Parse genres and fetch a backdrop image for each
      if (genresRes.status === 'fulfilled') {
        const genData = await genresRes.value.json();
        const rawGenres = (genData.genres || []).slice(0, 12);
        const genreImageResults = await Promise.allSettled(
          rawGenres.map((g) =>
            fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${g.id}&sort_by=popularity.desc&page=1`)
              .then((r) => r.json())
          )
        );
        const usedBackdrops = new Set();
        genres = rawGenres.map((g, i) => {
          let image = null;
          if (genreImageResults[i].status === 'fulfilled') {
            const movies = (genreImageResults[i].value.results || []).filter((m) => m.backdrop_path);
            const unique = movies.find((m) => !usedBackdrops.has(m.backdrop_path));
            const pick = unique || movies[0];
            if (pick) {
              usedBackdrops.add(pick.backdrop_path);
              image = `https://image.tmdb.org/t/p/w780${pick.backdrop_path}`;
            }
          }
          return { id: g.id, name: g.name, image };
        });
      }

      // Fetch trailer for featured movie
      if (featuredMovie?.id) {
        try {
          const videosRes = await fetch(
            `https://api.themoviedb.org/3/movie/${featuredMovie.id}/videos?api_key=${apiKey}`
          );
          const videosData = await videosRes.json();
          const trailer = (videosData.results || []).find(
            (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
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
      nowPlaying,
      popular,
      genres,
    },
    revalidate: 3600,
  };
}
