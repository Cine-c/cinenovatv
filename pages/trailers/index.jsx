import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SEOHead from '../../components/seo/SEOHead';
import { ItemListJsonLd } from '../../components/seo/JsonLd';
import MovieGrid from '../../components/trailers/MovieGrid';
import TrailerModal from '../../components/trailers/TrailerModal';
import AdSlot from '../../components/AdSlot';
import { MovieGridSkeleton } from '../../components/SkeletonCard';

const CATEGORIES = [
  { id: 'trending', label: 'Trending', icon: '🔥', endpoint: '/api/trending/day' },
  { id: 'now-playing', label: 'Now Playing', icon: '🎬', endpoint: '/api/movies/now-playing' },
  { id: 'upcoming', label: 'Coming Soon', icon: '📅', endpoint: '/api/movies/upcoming' },
  { id: 'popular', label: 'Popular', icon: '⭐', endpoint: '/api/movies/popular' },
  { id: 'top-rated', label: 'Top Rated', icon: '🏆', endpoint: '/api/movies/top-rated' },
];

export default function TrailersPage({ initialMovies, genres, totalResults, initialTotalPages }) {
  const router = useRouter();
  const [movies, setMovies] = useState(initialMovies || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('trending');
  const [activeGenre, setActiveGenre] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [page, setPage] = useState(3);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
  const [totalCount, setTotalCount] = useState(totalResults || 0);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Handle search query from URL
  useEffect(() => {
    if (router.query.q) {
      setSearchQuery(router.query.q);
      handleSearch(router.query.q);
    }
  }, [router.query.q]);

  // Handle play query parameter from homepage links
  useEffect(() => {
    const playId = router.query.play;
    if (playId) {
      // First check if movie is in current list
      let movieToPlay = movies.find(m => m.id.toString() === playId.toString());

      if (movieToPlay) {
        setSelectedMovie(movieToPlay);
        // Clean up URL without reload
        const { play, ...restQuery } = router.query;
        router.replace(
          { pathname: router.pathname, query: restQuery },
          undefined,
          { shallow: true }
        );
      } else if (movies.length > 0) {
        // Fetch movie details if not in current list
        fetch(`/api/movie/${playId}/details`)
          .then(res => res.json())
          .then(data => {
            if (data && data.id) {
              setSelectedMovie(data);
              // Clean up URL without reload
              const { play, ...restQuery } = router.query;
              router.replace(
                { pathname: router.pathname, query: restQuery },
                undefined,
                { shallow: true }
              );
            }
          })
          .catch(err => console.error('Error fetching movie:', err));
      }
    }
  }, [router.query.play, movies]);

  // Handle category query parameter from homepage "View All" links
  useEffect(() => {
    const categoryParam = router.query.category;
    if (categoryParam && CATEGORIES.find(c => c.id === categoryParam)) {
      setActiveCategory(categoryParam);
      const category = CATEGORIES.find(c => c.id === categoryParam);
      if (category) {
        fetchMovies(category.endpoint);
      }
      // Clean up URL
      const { category: _, ...restQuery } = router.query;
      router.replace(
        { pathname: router.pathname, query: restQuery },
        undefined,
        { shallow: true }
      );
    }
  }, [router.query.category]);

  const fetchMovies = async (endpoint, pageNum = 1, append = false) => {
    setIsLoading(true);
    try {
      const separator = endpoint.includes('?') ? '&' : '?';
      const res = await fetch(`${endpoint}${separator}page=${pageNum}`);
      const data = await res.json();
      const withYear = (data.results || []).map(m => ({
        ...m,
        releaseYear: m.release_date ? m.release_date.split('-')[0] : '',
      }));

      if (append) {
        setMovies((prev) => [...prev, ...withYear]);
      } else {
        setMovies(withYear);
      }
      setTotalPages(data.total_pages || 1);
      setTotalCount(data.total_results || 0);
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setIsSearchMode(false);
    setSearchQuery('');
    setActiveGenre('');
    const category = CATEGORIES.find((c) => c.id === categoryId);
    if (category) {
      fetchMovies(category.endpoint);
    }
  };

  const handleGenreChange = (genreId) => {
    setActiveGenre(genreId);
    setIsSearchMode(false);
    setSearchQuery('');
    if (genreId) {
      fetchMovies(`/api/movies/discover?genre=${genreId}`);
    } else {
      handleCategoryChange(activeCategory);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setIsSearchMode(false);
      handleCategoryChange(activeCategory);
      return;
    }

    setIsSearchMode(true);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setMovies((data.results || []).map(m => ({
        ...m,
        releaseYear: m.release_date ? m.release_date.split('-')[0] : '',
      })));
      setTotalPages(data.total_pages || 1);
      setTotalCount(data.total_results || 0);
      setPage(1);
    } catch (err) {
      console.error('Error searching:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      if (isSearchMode) {
        setIsLoading(true);
        fetch(`/api/search?query=${encodeURIComponent(searchQuery)}&page=${page + 1}`)
          .then((res) => res.json())
          .then((data) => {
            const withYear = (data.results || []).map(m => ({
              ...m,
              releaseYear: m.release_date ? m.release_date.split('-')[0] : '',
            }));
            setMovies((prev) => [...prev, ...withYear]);
            setPage(page + 1);
          })
          .finally(() => setIsLoading(false));
      } else if (activeGenre) {
        fetchMovies(`/api/movies/discover?genre=${activeGenre}`, page + 1, true);
      } else {
        const category = CATEGORIES.find((c) => c.id === activeCategory);
        if (category) {
          fetchMovies(category.endpoint, page + 1, true);
        }
      }
    }
  };

  const handleWatchTrailer = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const currentCategory = CATEGORIES.find((c) => c.id === activeCategory);
  const currentGenre = genres?.find((g) => g.id.toString() === activeGenre);

  return (
    <>
      <SEOHead
        title="Movie Trailers - Watch Latest & Upcoming"
        description="Watch the latest movie trailers. Browse trending, now playing, upcoming, and top rated movies."
        url="/trailers"
      />
      <ItemListJsonLd items={movies.slice(0, 10)} type="Movie" />

      <div className="trailers-page">
        {/* Hero Header */}
        <section className="trailers-hero">
          <div className="trailers-hero-content">
            <span className="trailers-hero-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Trailer Library
            </span>
            <h1>Movie <span className="gradient-text">Trailers</span></h1>
            <p>
              Explore thousands of trailers from blockbusters to indie gems.
              Watch, discover, and stay ahead of every release.
            </p>
          </div>

          {/* Search Bar */}
          <form className="trailers-search" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" width="22" height="22">
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </svg>
              <input
                type="search"
                className="search-input"
                placeholder="Search movies by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => {
                    setSearchQuery('');
                    if (isSearchMode) {
                      setIsSearchMode(false);
                      handleCategoryChange(activeCategory);
                    }
                  }}
                  aria-label="Clear search"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              Search
            </button>
          </form>
        </section>

        {/* Filters Section */}
        <section className="trailers-filters">
          <div className="category-tabs-wrapper">
            <div className="category-tabs">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  className={`category-tab ${
                    activeCategory === category.id && !isSearchMode && !activeGenre
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-label">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {genres && genres.length > 0 && (
            <div className="genre-filter-wrapper">
              <select
                className="genre-select"
                value={activeGenre}
                onChange={(e) => handleGenreChange(e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>

        <AdSlot />

        {/* Results Header */}
        <section className="results-header">
          <div className="results-info">
            {isSearchMode ? (
              <>
                <h2>
                  Results for "<span className="highlight">{searchQuery}</span>"
                </h2>
                <span className="results-count">{totalCount.toLocaleString()} movies found</span>
              </>
            ) : activeGenre ? (
              <>
                <h2>{currentGenre?.name || 'Genre'} Movies</h2>
                <span className="results-count">{totalCount.toLocaleString()} movies</span>
              </>
            ) : (
              <>
                <h2>
                  <span className="results-icon">{currentCategory?.icon}</span>
                  {currentCategory?.label || 'Movies'}
                </h2>
                <span className="results-count">{movies.length} of {totalCount.toLocaleString()} movies</span>
              </>
            )}
          </div>

          {(isSearchMode || activeGenre) && (
            <button
              className="clear-filters-btn"
              onClick={() => {
                setSearchQuery('');
                setActiveGenre('');
                setIsSearchMode(false);
                handleCategoryChange('trending');
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
              Clear Filters
            </button>
          )}
        </section>

        {/* Movies Grid */}
        {isLoading && movies.length === 0 ? (
          <MovieGridSkeleton count={20} />
        ) : movies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <h3>No movies found</h3>
            <p>Try a different search term or browse by category</p>
            <button
              className="btn btn-secondary"
              onClick={() => handleCategoryChange('trending')}
            >
              Browse Trending
            </button>
          </div>
        ) : (
          <>
            <MovieGrid movies={movies} onWatchTrailer={handleWatchTrailer} />

            {page < totalPages && (
              <div className="load-more-section">
                <div className="load-more-progress">
                  <div
                    className="load-more-bar"
                    style={{ width: `${(movies.length / totalCount) * 100}%` }}
                  ></div>
                </div>
                <span className="load-more-text">
                  Showing {movies.length} of {totalCount.toLocaleString()} movies
                </span>
                <button
                  className="btn btn-primary btn-large"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="btn-spinner"></span>
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {selectedMovie && (
          <TrailerModal movie={selectedMovie} onClose={handleCloseModal} />
        )}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  let initialMovies = [];
  let genres = [];
  let totalResults = 0;
  let initialTotalPages = 1;

  const apiKey = process.env.TMDB_API_KEY;

  if (apiKey) {
    try {
      const [page1Res, page2Res, page3Res, genresRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=1`),
        fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=2`),
        fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=3`),
        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`),
      ]);

      const [page1Data, page2Data, page3Data, genresData] = await Promise.all([
        page1Res.json(),
        page2Res.json(),
        page3Res.json(),
        genresRes.json(),
      ]);

      initialMovies = [
        ...(page1Data.results || []),
        ...(page2Data.results || []),
        ...(page3Data.results || []),
      ].map(m => ({
        ...m,
        releaseYear: m.release_date ? m.release_date.split('-')[0] : '',
      }));
      totalResults = page1Data.total_results || 0;
      initialTotalPages = page1Data.total_pages || 1;
      genres = genresData.genres || [];
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  }

  return {
    props: {
      initialMovies,
      genres,
      totalResults,
      initialTotalPages,
    },
  };
}
