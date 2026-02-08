import { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';

export default function TrailerModal({ movie, onClose }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousActiveElement = useRef(null);
  const [details, setDetails] = useState(null);
  const [ratings, setRatings] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (movie?.id) {
      setIsLoading(true);

      // Fetch TMDB details and OMDb ratings in parallel
      Promise.all([
        fetch(`/api/movie/${movie.id}/details`).then((res) => res.json()),
        fetch(`/api/movie/${movie.id}/ratings`).then((res) => res.json()).catch(() => null),
      ])
        .then(([tmdbData, omdbData]) => {
          setDetails(tmdbData);
          setRatings(omdbData);
          const trailer = tmdbData.videos?.results?.find(
            (v) => v.type === 'Trailer' && v.site === 'YouTube'
          );
          setTrailerKey(trailer?.key || null);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [movie?.id]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    previousActiveElement.current = document.activeElement;
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [handleKeyDown]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!movie) return null;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  const runtime = details?.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : null;

  const director = details?.credits?.crew?.find((c) => c.job === 'Director');
  const cast = details?.credits?.cast?.slice(0, 5) || [];

  // Get ratings from OMDb
  const imdbRating = ratings?.imdbRating;
  const rottenTomatoes = ratings?.Ratings?.find((r) => r.Source === 'Rotten Tomatoes')?.Value;
  const metacritic = ratings?.Ratings?.find((r) => r.Source === 'Metacritic')?.Value;

  return (
    <div
      className="trailer-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trailer-modal-title"
      ref={modalRef}
    >
      <div className="trailer-modal trailer-modal-enhanced">
        <button
          ref={closeButtonRef}
          className="trailer-modal-close-float"
          onClick={onClose}
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>

        <div className="trailer-modal-content">
          {isLoading ? (
            <div className="trailer-loading">
              <div className="trailer-loading-spinner"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {trailerKey ? (
                <div className="video-container">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                    title={`${movie.title} trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : backdropUrl ? (
                <div className="trailer-backdrop">
                  <Image
                    src={backdropUrl}
                    alt={movie.title}
                    width={1280}
                    height={720}
                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  />
                  <div className="no-trailer-overlay">
                    <p>No trailer available</p>
                  </div>
                </div>
              ) : (
                <div className="no-trailer">
                  <p>No trailer available for this movie.</p>
                </div>
              )}

              <div className="trailer-details">
                <div className="trailer-details-header">
                  <h2 id="trailer-modal-title">{movie.title}</h2>
                  <div className="trailer-meta">
                    {movie.release_date && (
                      <span className="trailer-year">
                        {new Date(movie.release_date).getFullYear()}
                      </span>
                    )}
                    {runtime && <span className="trailer-runtime">{runtime}</span>}
                    {ratings?.Rated && ratings.Rated !== 'N/A' && (
                      <span className="trailer-rated">{ratings.Rated}</span>
                    )}
                  </div>
                </div>

                {/* Ratings Section */}
                {(imdbRating || rottenTomatoes || metacritic) && (
                  <div className="ratings-section">
                    {imdbRating && imdbRating !== 'N/A' && (
                      <div className="rating-badge imdb">
                        <svg viewBox="0 0 64 32" width="40" height="20">
                          <rect fill="#F5C518" width="64" height="32" rx="4" />
                          <text x="32" y="22" textAnchor="middle" fill="#000" fontSize="14" fontWeight="bold">
                            IMDb
                          </text>
                        </svg>
                        <span>{imdbRating}</span>
                      </div>
                    )}
                    {rottenTomatoes && (
                      <div className="rating-badge rotten">
                        <span className={`rt-icon ${parseInt(rottenTomatoes) >= 60 ? 'fresh' : 'rotten'}`}>
                          {parseInt(rottenTomatoes) >= 60 ? '🍅' : '🤢'}
                        </span>
                        <span>{rottenTomatoes}</span>
                      </div>
                    )}
                    {metacritic && (
                      <div className={`rating-badge metacritic ${
                        parseInt(metacritic) >= 60 ? 'good' : parseInt(metacritic) >= 40 ? 'mixed' : 'bad'
                      }`}>
                        <span className="mc-score">{metacritic.replace('/100', '')}</span>
                        <span className="mc-label">Metascore</span>
                      </div>
                    )}
                  </div>
                )}

                {details?.genres && details.genres.length > 0 && (
                  <div className="trailer-genres">
                    {details.genres.map((genre) => (
                      <span key={genre.id} className="genre-tag">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {movie.overview && (
                  <p className="trailer-overview">{movie.overview}</p>
                )}

                {/* Box Office & Awards from OMDb */}
                {ratings && (ratings.BoxOffice || ratings.Awards) && (
                  <div className="movie-extra-info">
                    {ratings.BoxOffice && ratings.BoxOffice !== 'N/A' && (
                      <div className="extra-item">
                        <span className="extra-icon">💰</span>
                        <span className="extra-label">Box Office</span>
                        <span className="extra-value">{ratings.BoxOffice}</span>
                      </div>
                    )}
                    {ratings.Awards && ratings.Awards !== 'N/A' && (
                      <div className="extra-item">
                        <span className="extra-icon">🏆</span>
                        <span className="extra-label">Awards</span>
                        <span className="extra-value">{ratings.Awards}</span>
                      </div>
                    )}
                  </div>
                )}

                {(director || cast.length > 0) && (
                  <div className="trailer-credits">
                    {director && (
                      <div className="credit-row">
                        <span className="credit-label">Director</span>
                        <span className="credit-value">{director.name}</span>
                      </div>
                    )}
                    {cast.length > 0 && (
                      <div className="credit-row">
                        <span className="credit-label">Cast</span>
                        <span className="credit-value">
                          {cast.map((c) => c.name).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
