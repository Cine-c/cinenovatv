import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import SEOHead from '../components/seo/SEOHead';
import { ItemListJsonLd } from '../components/seo/JsonLd';
import MovieCard from '../components/trailers/MovieCard';
import MovieGrid from '../components/trailers/MovieGrid';
import { MovieGridSkeleton } from '../components/SkeletonCard';
import TrailerModal from '../components/trailers/TrailerModal';
import ReelsView from '../components/trailers/ReelsView';
import AdSlot from '../components/AdSlot';
import useIsMobile from '../components/hooks/useIsMobile';
import { useLanguage } from '../components/LanguageContext';

// --- Constants ---

const WATCH_PROVIDERS = [
  { id: 8, name: 'Netflix', logo: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' },
  { id: 9, name: 'Amazon Prime', logo: '/pvske1MyAoymrs5bguRfVqYiM9a.jpg' },
  { id: 337, name: 'Disney+', logo: '/97yvRBw1GzX7fXprcF80er19ot.jpg' },
  { id: 15, name: 'Hulu', logo: '/bxBlRPEPpMVDc4jMhSrTf2339DW.jpg' },
  { id: 350, name: 'Apple TV+', logo: '/mcbz1LgtErU9p4UdbZ0rG6RTWHX.jpg' },
  { id: 386, name: 'Peacock', logo: '/2aGrp1xw3qhwCYvNGAJZPdjfeeX.jpg' },
];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Newest First' },
  { value: 'primary_release_date.asc', label: 'Oldest First' },
  { value: 'original_title.asc', label: 'Title A-Z' },
];

const YEAR_OPTIONS = [
  { value: '', label: 'All Years' },
  ...Array.from({ length: 2026 - 1970 + 1 }, (_, i) => {
    const y = 2026 - i;
    return { value: y.toString(), label: y.toString() };
  }),
];

const PROVIDER_ROW_CONFIG = [
  { id: 8, title: 'New on Netflix', sort: 'primary_release_date.desc' },
  { id: 337, title: 'Popular on Disney+', sort: 'popularity.desc' },
  { id: 350, title: 'Trending on Apple TV+', sort: 'popularity.desc' },
  { id: 9, title: 'Top on Amazon Prime', sort: 'vote_average.desc' },
];

const DEFAULT_FILTERS = { genre: '', provider: '', sort: 'popularity.desc', year: '', search: '' };

function hasActiveFilters(filters) {
  return filters.genre || filters.provider || filters.year || filters.search || filters.sort !== 'popularity.desc';
}

function serialize(results) {
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

// --- CategoryRow ---

function CategoryRow({ title, movies, categoryId, onWatchTrailer }) {
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

  // Provider rows link to /discover?provider=ID
  const isProviderRow = categoryId.startsWith('provider-');
  const viewAllHref = isProviderRow
    ? `/discover?provider=${categoryId.replace('provider-', '')}`
    : `/trailers?category=${categoryId}`;

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

// --- Main Page ---

export default function DiscoverPage({
  hero,
  trending,
  popular,
  nowPlaying,
  topRated,
  upcoming,
  genres,
  initialFiltered,
  initialTotalPages,
  initialTotalCount,
}) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { language } = useLanguage();

  // Unified filter state
  const [filters, setFilters] = useState(() => {
    const q = router.query;
    return {
      genre: q.genre || '',
      provider: q.provider || '',
      sort: q.sort || 'popularity.desc',
      year: q.year || '',
      search: q.search || '',
    };
  });
  const [searchInput, setSearchInput] = useState(filters.search);

  // Filtered results state
  const [filteredMovies, setFilteredMovies] = useState(initialFiltered || []);
  const [filteredPage, setFilteredPage] = useState(1);
  const [filteredTotalPages, setFilteredTotalPages] = useState(initialTotalPages || 1);
  const [filteredTotalCount, setFilteredTotalCount] = useState(initialTotalCount || 0);
  const [isLoading, setIsLoading] = useState(false);

  // Provider browse rows
  const [providerRows, setProviderRows] = useState({});

  // Trailer state
  const [selectedMovie, setSelectedMovie] = useState(null);

  const isFilterMode = hasActiveFilters(filters);

  // --- URL sync: push filters to URL ---
  const updateFilters = useCallback(
    (partial) => {
      const next = { ...filters, ...partial };

      // If search is set, clear other filters. If other filters set, clear search.
      if (partial.search) {
        next.genre = '';
        next.provider = '';
        next.sort = 'popularity.desc';
        next.year = '';
      } else if (partial.genre !== undefined || partial.provider !== undefined || partial.sort !== undefined || partial.year !== undefined) {
        next.search = '';
      }

      setFilters(next);
      setSearchInput(next.search);

      // Build clean query (omit defaults/empty)
      const query = {};
      if (next.genre) query.genre = next.genre;
      if (next.provider) query.provider = next.provider;
      if (next.sort && next.sort !== 'popularity.desc') query.sort = next.sort;
      if (next.year) query.year = next.year;
      if (next.search) query.search = next.search;

      router.push({ pathname: '/discover', query }, undefined, { shallow: true });
    },
    [filters, router]
  );

  // --- URL sync: back/forward restores filters ---
  useEffect(() => {
    const q = router.query;
    const fromUrl = {
      genre: q.genre || '',
      provider: q.provider || '',
      sort: q.sort || 'popularity.desc',
      year: q.year || '',
      search: q.search || '',
    };

    const changed =
      fromUrl.genre !== filters.genre ||
      fromUrl.provider !== filters.provider ||
      fromUrl.sort !== filters.sort ||
      fromUrl.year !== filters.year ||
      fromUrl.search !== filters.search;

    if (changed) {
      setFilters(fromUrl);
      setSearchInput(fromUrl.search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  // --- Data fetching: filtered results ---
  const fetchMovies = useCallback(async (f, page = 1, append = false) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('language', language);
      if (f.search) {
        params.set('search', f.search);
      } else {
        if (f.genre) params.set('genre', f.genre);
        if (f.provider) params.set('provider', f.provider);
        if (f.sort) params.set('sort', f.sort);
        if (f.year) params.set('year', f.year);
      }

      const res = await fetch(`/api/movies/discover?${params}`);
      const data = await res.json();
      const movies = serialize(data.results);

      if (append) {
        setFilteredMovies((prev) => [...prev, ...movies]);
      } else {
        setFilteredMovies(movies);
      }
      setFilteredPage(page);
      setFilteredTotalPages(data.total_pages || 1);
      setFilteredTotalCount(data.total_results || 0);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Trigger fetch when filters change (skip if SSR already provided data on first render)
  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      // If SSR provided filtered data, don't re-fetch
      if (initialFiltered && initialFiltered.length > 0) return;
      // If no filters active, no need to fetch
      if (!hasActiveFilters(filters)) return;
    }
    if (hasActiveFilters(filters)) {
      fetchMovies(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.genre, filters.provider, filters.sort, filters.year, filters.search]);

  // --- Data fetching: provider browse rows ---
  useEffect(() => {
    if (isFilterMode) return;

    const fetchProviderRows = async () => {
      try {
        const results = await Promise.all(
          PROVIDER_ROW_CONFIG.map(async (cfg) => {
            const params = new URLSearchParams({
              provider: cfg.id.toString(),
              sort: cfg.sort,
              page: '1',
              language,
            });
            const res = await fetch(`/api/movies/discover?${params}`);
            const data = await res.json();
            return { id: cfg.id, movies: serialize(data.results) };
          })
        );
        const rows = {};
        results.forEach((r) => {
          rows[r.id] = r.movies;
        });
        setProviderRows(rows);
      } catch (err) {
        console.error('Error fetching provider rows:', err);
      }
    };

    fetchProviderRows();
  }, [isFilterMode, language]);

  // --- Handlers ---
  const handleLoadMore = () => {
    if (filteredPage < filteredTotalPages) {
      fetchMovies(filters, filteredPage + 1, true);
    }
  };

  const handleClearAll = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setSearchInput('');
    router.push('/discover', undefined, { shallow: true });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      updateFilters({ search: searchInput.trim() });
    }
  };

  const handleSearchClear = () => {
    setSearchInput('');
    if (filters.search) {
      updateFilters({ search: '' });
    }
  };

  const handleWatchTrailer = (movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  const allMovies = isFilterMode
    ? filteredMovies
    : [...(trending || []), ...(popular || []), ...(nowPlaying || []), ...(topRated || []), ...(upcoming || [])];

  const handleNextMovie = () => {
    const idx = allMovies.findIndex((m) => m.id === selectedMovie?.id);
    if (idx >= 0 && idx < allMovies.length - 1) setSelectedMovie(allMovies[idx + 1]);
  };

  const handlePrevMovie = () => {
    const idx = allMovies.findIndex((m) => m.id === selectedMovie?.id);
    if (idx > 0) setSelectedMovie(allMovies[idx - 1]);
  };

  // --- Build filter summary ---
  const filterSummary = (() => {
    const parts = [];
    if (filters.search) return `Search: "${filters.search}"`;
    const genre = genres?.find((g) => g.id.toString() === filters.genre);
    if (genre) parts.push(genre.name);
    const prov = WATCH_PROVIDERS.find((p) => p.id.toString() === filters.provider);
    if (prov) parts.push(`on ${prov.name}`);
    if (filters.year) parts.push(filters.year);
    const sortLabel = SORT_OPTIONS.find((s) => s.value === filters.sort);
    if (filters.sort !== 'popularity.desc' && sortLabel) parts.push(`— ${sortLabel.label}`);
    return parts.length > 0 ? `${parts.join(' ')} Movies` : 'Filtered Movies';
  })();

  return (
    <>
      <SEOHead
        title={isFilterMode ? `${filterSummary} - Discover` : 'Browse Movies by Genre, Year & Rating | CineNovaTV'}
        description="Filter thousands of movies by genre, release year, rating, and streaming service. Find your next favourite film in seconds on CineNovaTV."
        url="/discover"
      />
      <ItemListJsonLd items={(isFilterMode ? filteredMovies : trending || []).slice(0, 10)} type="Movie" />

      <div className="discover-page">
        {/* Hero Banner — only in browse mode */}
        {!isFilterMode && hero && (
          <section className="discover-hero">
            <div className="discover-hero-backdrop">
              <Image
                src={`https://image.tmdb.org/t/p/w1280${hero.backdrop_path}`}
                alt={hero.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              <div className="discover-hero-gradient" />
            </div>
            <div className="discover-hero-content">
              <span className="discover-hero-badge">Trending #1</span>
              <h1>{hero.title}</h1>
              <div className="discover-hero-meta">
                {hero.vote_average > 0 && (
                  <span className="discover-hero-rating">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {hero.vote_average.toFixed(1)}
                  </span>
                )}
                {hero.release_date && (
                  <span className="discover-hero-year">{hero.release_date.split('-')[0]}</span>
                )}
              </div>
              <p className="discover-hero-overview">{hero.overview}</p>
              <div className="discover-hero-actions">
                <Link href={`/movies/${hero.id}`} className="btn btn-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  Details
                </Link>
                <button className="btn btn-secondary" onClick={() => handleWatchTrailer(hero)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Trailer
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Filter Bar */}
        <section className="discover-filter-bar">
          {/* Search */}
          <form className="discover-search" onSubmit={handleSearchSubmit}>
            <div className="discover-search-wrapper">
              <svg className="discover-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="discover-search-input"
                placeholder="Search movies..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button type="button" className="discover-search-clear" onClick={handleSearchClear} aria-label="Clear search">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* Genre Pills */}
          <div className="discover-genres-scroll">
            <button
              className={`discover-genre-pill ${!filters.genre ? 'active' : ''}`}
              onClick={() => updateFilters({ genre: '' })}
            >
              All
            </button>
            {(genres || []).map((genre) => (
              <button
                key={genre.id}
                className={`discover-genre-pill ${filters.genre === genre.id.toString() ? 'active' : ''}`}
                onClick={() => updateFilters({ genre: filters.genre === genre.id.toString() ? '' : genre.id.toString() })}
              >
                {genre.name}
              </button>
            ))}
          </div>

          {/* Provider Pills */}
          <div className="discover-providers-scroll">
            {WATCH_PROVIDERS.map((prov) => (
              <button
                key={prov.id}
                className={`discover-provider-pill ${filters.provider === prov.id.toString() ? 'active' : ''}`}
                onClick={() => updateFilters({ provider: filters.provider === prov.id.toString() ? '' : prov.id.toString() })}
              >
                <img
                  src={`https://image.tmdb.org/t/p/original${prov.logo}`}
                  alt={prov.name}
                  width={20}
                  height={20}
                />
                {prov.name}
              </button>
            ))}
          </div>

          {/* Sort + Year + Clear */}
          <div className="discover-dropdowns">
            <select
              className="discover-select"
              value={filters.sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              className="discover-select"
              value={filters.year}
              onChange={(e) => updateFilters({ year: e.target.value })}
            >
              {YEAR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {isFilterMode && (
              <button className="discover-clear-btn" onClick={handleClearAll}>
                Clear All
              </button>
            )}
          </div>
        </section>

        {/* Browse Mode — horizontal rows */}
        {!isFilterMode && (
          <>
            <CategoryRow title="Trending Now" movies={trending} categoryId="trending" onWatchTrailer={handleWatchTrailer} />
            <CategoryRow title="Popular" movies={popular} categoryId="popular" onWatchTrailer={handleWatchTrailer} />

            <AdSlot slot="3307940521" />

            {PROVIDER_ROW_CONFIG.map((cfg) => (
              <CategoryRow
                key={cfg.id}
                title={cfg.title}
                movies={providerRows[cfg.id]}
                categoryId={`provider-${cfg.id}`}
                onWatchTrailer={handleWatchTrailer}
              />
            ))}

            <CategoryRow title="Now Playing" movies={nowPlaying} categoryId="now-playing" onWatchTrailer={handleWatchTrailer} />
            <CategoryRow title="Top Rated" movies={topRated} categoryId="top-rated" onWatchTrailer={handleWatchTrailer} />
            <CategoryRow title="Coming Soon" movies={upcoming} categoryId="upcoming" onWatchTrailer={handleWatchTrailer} />
          </>
        )}

        {/* Filtered Mode — grid with load more */}
        {isFilterMode && (
          <>
            <section className="discover-genre-header">
              <h2>{filterSummary}</h2>
              <span className="discover-genre-count">
                {filteredTotalCount.toLocaleString()} movies
              </span>
            </section>

            {isLoading && filteredMovies.length === 0 ? (
              <MovieGridSkeleton count={20} />
            ) : filteredMovies.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎬</div>
                <h3>No movies found</h3>
                <p>Try different filters or search terms</p>
              </div>
            ) : (
              <>
                <MovieGrid movies={filteredMovies} onWatchTrailer={handleWatchTrailer} />

                <AdSlot slot="3307940521" />

                {filteredPage < filteredTotalPages && (
                  <div className="load-more-section">
                    <div className="load-more-progress">
                      <div
                        className="load-more-bar"
                        style={{ width: `${(filteredMovies.length / filteredTotalCount) * 100}%` }}
                      />
                    </div>
                    <span className="load-more-text">
                      Showing {filteredMovies.length} of {filteredTotalCount.toLocaleString()} movies
                    </span>
                    <button
                      className="btn btn-primary btn-large"
                      onClick={handleLoadMore}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="btn-spinner" />
                          Loading...
                        </>
                      ) : (
                        'Load More'
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Trailer Playback */}
        {selectedMovie && (
          isMobile ? (
            <ReelsView
              movie={selectedMovie}
              movies={allMovies}
              onNextMovie={handleNextMovie}
              onPrevMovie={handlePrevMovie}
              onClose={handleCloseModal}
            />
          ) : (
            <TrailerModal
              movie={selectedMovie}
              movies={allMovies}
              onNextMovie={handleNextMovie}
              onClose={handleCloseModal}
            />
          )
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ query, req }) {
  const getLanguageFromCookies = (await import('../lib/getLanguageFromCookies')).default;
  const language = getLanguageFromCookies(req);
  const apiKey = process.env.TMDB_API_KEY;
  let hero = null;
  let trending = [];
  let popular = [];
  let nowPlaying = [];
  let topRated = [];
  let upcoming = [];
  let genres = [];
  let initialFiltered = null;
  let initialTotalPages = 1;
  let initialTotalCount = 0;

  if (!apiKey) {
    return { props: { hero, trending, popular, nowPlaying, topRated, upcoming, genres, initialFiltered, initialTotalPages, initialTotalCount } };
  }

  const hasFilters = query.genre || query.provider || query.year || query.search || (query.sort && query.sort !== 'popularity.desc');

  try {
    // Always fetch genres
    const genresRes = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=${language}`);
    const genresData = await genresRes.json();
    genres = genresData.genres || [];

    if (hasFilters) {
      // SSR filtered results
      let url;
      if (query.search) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&page=1&query=${encodeURIComponent(query.search)}&language=${language}`;
      } else {
        const sort = query.sort || 'popularity.desc';
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=1&sort_by=${sort}&language=${language}`;
        if (query.genre) url += `&with_genres=${query.genre}`;
        if (query.year) url += `&primary_release_year=${query.year}`;
        if (query.provider) {
          const providerIds = query.provider.replace(/,/g, '|');
          url += `&with_watch_providers=${providerIds}&watch_region=US`;
        }
      }

      const filteredRes = await fetch(url);
      const filteredData = await filteredRes.json();
      initialFiltered = serialize(filteredData.results);
      initialTotalPages = filteredData.total_pages || 1;
      initialTotalCount = filteredData.total_results || 0;

      // In filter mode, still need a hero for when user clears filters — pick from filtered or skip
      hero = initialFiltered.find((m) => m.backdrop_path) || null;
    } else {
      // Browse mode — fetch all category rows
      const [trendingRes, popularRes, nowPlayingRes, topRatedRes, upcomingRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=1&language=${language}`),
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=1&language=${language}`),
        fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=1&language=${language}`),
        fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=1&language=${language}`),
        fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&page=1&language=${language}`),
      ]);

      const [trendingData, popularData, nowPlayingData, topRatedData, upcomingData] = await Promise.all([
        trendingRes.json(),
        popularRes.json(),
        nowPlayingRes.json(),
        topRatedRes.json(),
        upcomingRes.json(),
      ]);

      trending = serialize(trendingData.results);
      popular = serialize(popularData.results);
      nowPlaying = serialize(nowPlayingData.results);
      topRated = serialize(topRatedData.results);
      upcoming = serialize(upcomingData.results);

      hero = trending.find((m) => m.backdrop_path) || trending[0] || null;
    }
  } catch (err) {
    console.error('Error fetching discover data:', err);
  }

  return {
    props: { hero, trending, popular, nowPlaying, topRated, upcoming, genres, initialFiltered, initialTotalPages, initialTotalCount },
  };
}
