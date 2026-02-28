import Image from 'next/image';
import Link from 'next/link';
import SEOHead from '../../components/seo/SEOHead';
import TrailerModal from '../../components/trailers/TrailerModal';
import { useWatchLater } from '../../components/WatchLaterContext';
import { useState } from 'react';

export default function MovieDetailPage({ movie, credits, videos, ratings }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const { toggle, has } = useWatchLater();
  const saved = has(movie?.id);

  if (!movie) {
    return (
      <div className="movie-detail-page">
        <div className="empty-state">
          <h1>Movie Not Found</h1>
          <Link href="/trailers" className="btn btn-primary">Browse Trailers</Link>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '';
  const director = credits?.crew?.find((c) => c.job === 'Director');
  const cast = credits?.cast?.slice(0, 12) || [];
  const trailers = (videos?.results || []).filter(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  const imdbRating = ratings?.imdbRating;
  const rottenTomatoes = ratings?.Ratings?.find((r) => r.Source === 'Rotten Tomatoes')?.Value;
  const metacritic = ratings?.Ratings?.find((r) => r.Source === 'Metacritic')?.Value;

  return (
    <>
      <SEOHead
        title={`${movie.title} (${releaseYear}) - CineNovaTV`}
        description={movie.overview || `Watch trailers and details for ${movie.title}`}
        image={backdropUrl}
        url={`/movies/${movie.id}`}
        type="video.movie"
      />

      <div className="movie-detail-page">
        {/* Hero */}
        <section
          className="movie-detail-hero"
          style={backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : {}}
        >
          <div className="movie-detail-hero-overlay" />
          <div className="movie-detail-hero-content">
            {posterUrl && (
              <div className="movie-detail-poster">
                <Image
                  src={posterUrl}
                  alt={movie.title}
                  width={300}
                  height={450}
                  priority
                  style={{ objectFit: 'cover', borderRadius: '12px' }}
                />
              </div>
            )}
            <div className="movie-detail-hero-info">
              <h1>{movie.title}</h1>
              <div className="movie-detail-meta">
                {releaseYear && <span>{releaseYear}</span>}
                {runtime && <span>{runtime}</span>}
                {movie.genres?.map((g) => (
                  <span key={g.id} className="genre-tag">{g.name}</span>
                ))}
              </div>

              {/* Ratings */}
              {(movie.vote_average > 0 || imdbRating || rottenTomatoes) && (
                <div className="ratings-section">
                  {movie.vote_average > 0 && (
                    <div className="rating-badge tmdb">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                  {imdbRating && imdbRating !== 'N/A' && (
                    <div className="rating-badge imdb">
                      <span className="rating-label">IMDb</span>
                      <span>{imdbRating}</span>
                    </div>
                  )}
                  {rottenTomatoes && (
                    <div className="rating-badge rotten">
                      <span>{parseInt(rottenTomatoes) >= 60 ? '🍅' : '🤢'}</span>
                      <span>{rottenTomatoes}</span>
                    </div>
                  )}
                  {metacritic && (
                    <div className={`rating-badge metacritic ${parseInt(metacritic) >= 60 ? 'good' : 'mixed'}`}>
                      <span>{metacritic.replace('/100', '')}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="movie-detail-actions">
                {trailers.length > 0 && (
                  <button className="btn btn-primary btn-glow btn-large" onClick={() => setShowTrailer(true)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Watch Trailer
                  </button>
                )}
                <button
                  className={`btn btn-secondary btn-large${saved ? ' saved' : ''}`}
                  onClick={() => toggle({ ...movie, releaseYear })}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  {saved ? 'Saved' : 'Watch Later'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="movie-detail-body">
          <div className="movie-detail-main">
            {movie.overview && (
              <div className="movie-detail-section">
                <h2>Overview</h2>
                <p className="movie-overview-text">{movie.overview}</p>
              </div>
            )}

            {/* Box Office & Awards */}
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

            {/* Cast */}
            {cast.length > 0 && (
              <div className="movie-detail-section">
                <h2>Cast</h2>
                <div className="cast-grid">
                  {cast.map((person) => (
                    <div key={person.id} className="cast-card">
                      {person.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                          alt={person.name}
                          width={80}
                          height={80}
                          style={{ objectFit: 'cover', borderRadius: '50%' }}
                        />
                      ) : (
                        <div className="cast-placeholder">
                          <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" opacity="0.3">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                      )}
                      <span className="cast-name">{person.name}</span>
                      <span className="cast-character">{person.character}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Director & Crew */}
            {director && (
              <div className="movie-detail-section">
                <h2>Crew</h2>
                <div className="trailer-credits">
                  <div className="credit-row">
                    <span className="credit-label">Director</span>
                    <span className="credit-value">{director.name}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Trailers */}
            {trailers.length > 1 && (
              <div className="movie-detail-section">
                <h2>Trailers & Videos</h2>
                <div className="trailers-list">
                  {trailers.map((v) => (
                    <button
                      key={v.key}
                      className="trailer-thumb"
                      onClick={() => setShowTrailer(true)}
                    >
                      <Image
                        src={`https://img.youtube.com/vi/${v.key}/mqdefault.jpg`}
                        alt={v.name}
                        width={320}
                        height={180}
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="trailer-thumb-overlay">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <span className="trailer-thumb-title">{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Movie Info Sidebar */}
            <div className="movie-detail-section">
              <h2>Details</h2>
              <div className="movie-info-grid">
                {movie.original_title && movie.original_title !== movie.title && (
                  <div className="info-item">
                    <span className="info-label">Original Title</span>
                    <span className="info-value">{movie.original_title}</span>
                  </div>
                )}
                {movie.release_date && (
                  <div className="info-item">
                    <span className="info-label">Release Date</span>
                    <span className="info-value">
                      {new Date(movie.release_date + 'T00:00:00').toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                {movie.budget > 0 && (
                  <div className="info-item">
                    <span className="info-label">Budget</span>
                    <span className="info-value">${movie.budget.toLocaleString()}</span>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div className="info-item">
                    <span className="info-label">Revenue</span>
                    <span className="info-value">${movie.revenue.toLocaleString()}</span>
                  </div>
                )}
                {movie.spoken_languages?.length > 0 && (
                  <div className="info-item">
                    <span className="info-label">Languages</span>
                    <span className="info-value">{movie.spoken_languages.map(l => l.english_name).join(', ')}</span>
                  </div>
                )}
                {movie.production_companies?.length > 0 && (
                  <div className="info-item">
                    <span className="info-label">Studios</span>
                    <span className="info-value">{movie.production_companies.map(c => c.name).join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Back link */}
        <section className="movie-detail-nav">
          <Link href="/trailers" className="back-to-blog">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Trailers
          </Link>
        </section>

        {showTrailer && (
          <TrailerModal movie={movie} onClose={() => setShowTrailer(false)} />
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return { notFound: true };
  }

  try {
    const detailsRes = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos,credits`
    );

    if (!detailsRes.ok) {
      return { notFound: true };
    }

    const data = await detailsRes.json();

    // Fetch OMDb ratings
    let ratings = null;
    const omdbKey = process.env.OMDB_API_KEY;
    if (omdbKey && data.imdb_id) {
      try {
        const omdbRes = await fetch(`https://www.omdbapi.com/?i=${data.imdb_id}&apikey=${omdbKey}`);
        ratings = await omdbRes.json();
      } catch {}
    }

    return {
      props: {
        movie: {
          id: data.id,
          title: data.title,
          original_title: data.original_title,
          overview: data.overview,
          backdrop_path: data.backdrop_path,
          poster_path: data.poster_path,
          release_date: data.release_date || '',
          runtime: data.runtime || 0,
          vote_average: data.vote_average || 0,
          genres: data.genres || [],
          budget: data.budget || 0,
          revenue: data.revenue || 0,
          spoken_languages: data.spoken_languages || [],
          production_companies: (data.production_companies || []).map(c => ({ name: c.name })),
          imdb_id: data.imdb_id || null,
        },
        credits: {
          cast: (data.credits?.cast || []).slice(0, 12).map(c => ({
            id: c.id,
            name: c.name,
            character: c.character,
            profile_path: c.profile_path,
          })),
          crew: (data.credits?.crew || []).filter(c => c.job === 'Director').map(c => ({
            id: c.id,
            name: c.name,
            job: c.job,
          })),
        },
        videos: {
          results: (data.videos?.results || [])
            .filter(v => v.site === 'YouTube')
            .slice(0, 6)
            .map(v => ({
              key: v.key,
              name: v.name,
              type: v.type,
              site: v.site,
            })),
        },
        ratings,
      },
    };
  } catch {
    return { notFound: true };
  }
}
