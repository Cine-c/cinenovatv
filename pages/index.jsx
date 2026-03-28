import { useState, useEffect, useRef } from 'react';
import SEOHead from '../components/seo/SEOHead';
import { WebSiteJsonLd } from '../components/seo/JsonLd';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../components/LanguageContext';
import { useRouter } from 'next/router';
import AdSlot from '../components/AdSlot';
import NewsletterSignup from '../components/NewsletterSignup';
import MovieCard from '../components/trailers/MovieCard';
import CelebrityStrip from '../components/CelebrityStrip';

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

export default function Home({ featuredMovie, nowPlaying, popular, genres, celebrities }) {
  const { language } = useLanguage();
  const router = useRouter();
  const revealRef = useScrollReveal();
  const spotlightRef = useRef(null);
  const heroRef = useRef(null);
  const [heroTrailerKey, setHeroTrailerKey] = useState(featuredMovie?.trailerKey || null);

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

  // Top 8 popular movies for trending grid
  const trendingMovies = (popular || []).slice(0, 8);

  // Featured article movie — pick the second trending movie
  const articleMovie = (popular || [])[1] || featuredMovie;

  // First 6 genres for the genre grid
  const displayGenres = (genres || []).slice(0, 6);

  return (
    <div ref={revealRef} className="homepage-full">
      <SEOHead
        title="CineNovaTV — Discover Movies, Trailers & Where to Stream"
        description="Your free movie guide. Browse 50 000+ titles, watch trailers, compare 40+ streaming platforms, and find exactly what to watch tonight — updated daily."
        url="/"
      />
      <WebSiteJsonLd />

      {/* ── HERO BACKDROP ── */}
      <section className="hero-backdrop" ref={heroRef}>
        {featuredMovie?.backdrop_path && (
          <Image
            className="hero-backdrop-image"
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
            alt={featuredMovie.title || ''}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        )}
        <div className="hero-backdrop-gradient" />
        <div className="spotlight" ref={spotlightRef} />

        <div className="hero-content">
          <div className="hero-eyebrow">Now Trending</div>
          <h1 className="hero-title">
            <em>{featuredMovie?.title || 'Discover Cinema'}</em>
          </h1>
          <div className="hero-meta">
            {featuredMovie?.release_date && (
              <span className="hero-meta-year">{featuredMovie.release_date.split('-')[0]}</span>
            )}
            {featuredMovie?.vote_average > 0 && (
              <span className="hero-meta-rating">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--gold)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                {featuredMovie.vote_average.toFixed(1)}
              </span>
            )}
          </div>
          {featuredMovie?.overview && (
            <p className="hero-overview">{featuredMovie.overview}</p>
          )}
          <div className="hero-actions">
            {featuredMovie && heroTrailerKey && (
              <Link
                href={`/trailers?play=${featuredMovie.id}`}
                className="btn-primary"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span>Watch Trailer</span>
              </Link>
            )}
            <Link href="/discover" className="btn-ghost">
              <span>Explore Films</span>
              <span>&rarr;</span>
            </Link>
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

      {/* ── OSCARS 2026 BANNER ── */}
      <Link href="/oscars-2026" className="oscars-banner">
        <div className="oscars-banner-trophy">
          <svg viewBox="0 0 120 280" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="60" cy="32" rx="22" ry="28" fill="#c9a84c"/>
            <rect x="50" y="58" width="20" height="120" rx="2" fill="#c9a84c"/>
            <ellipse cx="60" cy="185" rx="32" ry="12" fill="#c9a84c"/>
            <rect x="35" y="195" width="50" height="18" rx="2" fill="#c9a84c"/>
            <ellipse cx="60" cy="220" rx="38" ry="10" fill="#c9a84c"/>
            <rect x="30" y="228" width="60" height="42" rx="3" fill="#c9a84c"/>
          </svg>
        </div>
        <div className="oscars-banner-content">
          <div className="oscars-banner-eyebrow">98th Academy Awards</div>
          <div className="oscars-banner-title">The Night <em>One Battle</em> Won the War</div>
          <div className="oscars-banner-sub">All 23 winners, historic firsts, and five defining moments from Oscar night 2026.</div>
        </div>
        <div className="oscars-banner-stamp">98</div>
        <div className="oscars-banner-arrow">
          <span>Read Full Coverage &rarr;</span>
        </div>
      </Link>

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

      {/* ── CELEBRITIES ── */}
      <section className="home-section">
        <div className="section-header reveal">
          <div>
            <div className="section-tag">Stars</div>
            <h2 className="section-title">Popular <em>Celebrities</em></h2>
          </div>
          <Link href="/celebrity" className="see-all">View All &rarr;</Link>
        </div>
        <div className="reveal">
          <CelebrityStrip celebrities={celebrities} />
        </div>
      </section>

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
          genre_ids: m.genre_ids || [],
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

  // Load a random selection of celebrities
  let celebrities = [];
  try {
    const celebData = require('../data/celebrities.json');
    const all = celebData.celebrities || [];
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    celebrities = shuffled.slice(0, 12).map((c) => ({
      slug: c.slug,
      name: c.name,
      category: c.category,
      wikipedia_slug: c.wikipedia_slug,
    }));
  } catch {
    // celebrities.json not available
  }

  return {
    props: {
      featuredMovie,
      nowPlaying,
      popular,
      genres,
      celebrities,
    },
    revalidate: 3600,
  };
}
