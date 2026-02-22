import { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWatchLater } from '../WatchLaterContext';

export default function TrailerModal({ movie, onClose }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousActiveElement = useRef(null);
  const [details, setDetails] = useState(null);
  const [ratings, setRatings] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const { toggle, has } = useWatchLater();
  const isSaved = has(movie?.id);

  useEffect(() => {
    if (movie?.id) {
      setIsLoading(true);

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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`https://www.cinenovatv.com/movies/${movie.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
    }
  };

  const handleWatchLater = () => {
    toggle(movie);
  };

  if (!movie) return null;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  const runtime = details?.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : null;

  const director = details?.credits?.crew?.find((c) => c.job === 'Director');
  const cast = details?.credits?.cast?.slice(0, 6) || [];

  // All available trailers/teasers
  const allVideos = details?.videos?.results?.filter(
    (v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
  ) || [];

  // Ratings
  const imdbRating = ratings?.imdbRating;
  const imdbVotes = ratings?.imdbVotes;
  const rottenTomatoes = ratings?.Ratings?.find((r) => r.Source === 'Rotten Tomatoes')?.Value;
  const metacritic = ratings?.Ratings?.find((r) => r.Source === 'Metacritic')?.Value;
  const tmdbRating = details?.vote_average;
  const tmdbVoteCount = details?.vote_count;

  const formatVoteCount = (count) => {
    if (!count) return '';
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return String(count);
  };

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

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
              {/* Video */}
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

              {/* Action Bar */}
              <div className="trailer-action-bar">
                <h3 id="trailer-modal-title">
                  {movie.title}
                  {releaseYear && <span className="trailer-action-year"> ({releaseYear})</span>}
                </h3>
                <div className="trailer-action-buttons">
                  <button
                    className={`trailer-action-btn${isSaved ? ' saved' : ''}`}
                    onClick={handleWatchLater}
                    aria-label={isSaved ? 'Remove from Watch Later' : 'Add to Watch Later'}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                      {isSaved ? (
                        <path fill="currentColor" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                      ) : (
                        <path fill="currentColor" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />
                      )}
                    </svg>
                    <span className="trailer-action-label">{isSaved ? 'Saved' : 'Watch Later'}</span>
                  </button>

                  <button
                    className="trailer-action-btn"
                    onClick={handleShare}
                    aria-label="Share movie link"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                      <path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                    </svg>
                    <span className="trailer-action-label">{copied ? 'Copied!' : 'Share'}</span>
                    {copied && <span className="trailer-copied-tooltip">Copied!</span>}
                  </button>

                  <Link href={`/movies/${movie.id}`} className="trailer-action-btn" onClick={onClose}>
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                      <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                    </svg>
                    <span className="trailer-action-label">View Details</span>
                  </Link>
                </div>
              </div>

              {/* Trailer Selector (if multiple) */}
              {allVideos.length > 1 && (
                <div className="trailer-thumbs">
                  {allVideos.map((video) => (
                    <button
                      key={video.key}
                      className={`trailer-thumb-mini${video.key === trailerKey ? ' active' : ''}`}
                      onClick={() => setTrailerKey(video.key)}
                      aria-label={`Play ${video.name}`}
                    >
                      <Image
                        src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                        alt={video.name}
                        width={160}
                        height={90}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                      <div className="trailer-thumb-overlay">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path fill="white" d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <span className="trailer-thumb-label">{video.type}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Details */}
              <div className="trailer-details">
                <div className="trailer-details-header">
                  <div className="trailer-meta">
                    {releaseYear && (
                      <span className="trailer-year">{releaseYear}</span>
                    )}
                    {runtime && <span className="trailer-runtime">{runtime}</span>}
                    {ratings?.Rated && ratings.Rated !== 'N/A' && (
                      <span className="trailer-rated">{ratings.Rated}</span>
                    )}
                  </div>
                </div>

                {/* All Ratings */}
                {(tmdbRating || imdbRating || rottenTomatoes || metacritic) && (
                  <div className="ratings-section">
                    {tmdbRating > 0 && (
                      <div className="rating-badge tmdb">
                        <svg viewBox="0 0 40 40" width="32" height="32">
                          <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                          <circle
                            cx="20" cy="20" r="18" fill="none"
                            stroke={tmdbRating >= 7 ? '#21d07a' : tmdbRating >= 5 ? '#d2d531' : '#db2360'}
                            strokeWidth="3"
                            strokeDasharray={`${(tmdbRating / 10) * 113} 113`}
                            strokeLinecap="round"
                            transform="rotate(-90 20 20)"
                          />
                          <text x="20" y="24" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                            {tmdbRating.toFixed(1)}
                          </text>
                        </svg>
                        <div className="rating-info">
                          <span className="rating-source">TMDB</span>
                          {tmdbVoteCount > 0 && (
                            <span className="rating-votes">{formatVoteCount(tmdbVoteCount)} votes</span>
                          )}
                        </div>
                      </div>
                    )}
                    {imdbRating && imdbRating !== 'N/A' && (
                      <div className="rating-badge imdb">
                        <svg viewBox="0 0 64 32" width="40" height="20">
                          <rect fill="#F5C518" width="64" height="32" rx="4" />
                          <text x="32" y="22" textAnchor="middle" fill="#000" fontSize="14" fontWeight="bold">
                            IMDb
                          </text>
                        </svg>
                        <div className="rating-info">
                          <span>{imdbRating}</span>
                          {imdbVotes && imdbVotes !== 'N/A' && (
                            <span className="rating-votes">{imdbVotes} votes</span>
                          )}
                        </div>
                      </div>
                    )}
                    {rottenTomatoes && (
                      <div className="rating-badge rotten">
                        <span className={`rt-icon ${parseInt(rottenTomatoes) >= 60 ? 'fresh' : 'rotten'}`}>
                          {parseInt(rottenTomatoes) >= 60 ? '🍅' : '🤢'}
                        </span>
                        <div className="rating-info">
                          <span>{rottenTomatoes}</span>
                          <span className="rating-votes">{parseInt(rottenTomatoes) >= 60 ? 'Fresh' : 'Rotten'}</span>
                        </div>
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

                {/* Cast with photos */}
                {cast.length > 0 && (
                  <div className="trailer-cast-grid">
                    {cast.map((person) => (
                      <div key={person.id} className="trailer-cast-card">
                        {person.profile_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                            alt={person.name}
                            width={48}
                            height={48}
                            className="trailer-cast-photo"
                          />
                        ) : (
                          <div className="trailer-cast-placeholder">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                              <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          </div>
                        )}
                        <div className="trailer-cast-info">
                          <span className="trailer-cast-name">{person.name}</span>
                          {person.character && (
                            <span className="trailer-cast-character">{person.character}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Director */}
                {director && (
                  <div className="trailer-credits">
                    <div className="credit-row">
                      <span className="credit-label">Director</span>
                      <span className="credit-value">{director.name}</span>
                    </div>
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
