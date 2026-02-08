import Image from 'next/image';
import Link from 'next/link';
import { useWatchLater } from '../WatchLaterContext';

export default function MovieCard({ movie, onWatchTrailer }) {
  const { toggle, has } = useWatchLater();
  const saved = has(movie.id);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : '/placeholder-poster.jpg';

  return (
    <article className="movie-card">
      <div className="movie-card-poster">
        <Image
          src={posterUrl}
          alt={movie.title}
          width={200}
          height={300}
          style={{ objectFit: 'cover' }}
        />
        <div className="movie-card-overlay">
          <button
            className="watch-trailer-btn"
            onClick={() => onWatchTrailer(movie)}
            aria-label={`Watch trailer for ${movie.title}`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
        <button
          className={`watchlater-btn${saved ? ' saved' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggle(movie); }}
          aria-label={saved ? 'Remove from Watch Later' : 'Add to Watch Later'}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
      <div className="movie-card-info">
        <Link href={`/movies/${movie.id}`} className="movie-card-title-link">
          <h3 className="movie-card-title">{movie.title}</h3>
        </Link>
        {movie.releaseYear && <span className="movie-card-year">{movie.releaseYear}</span>}
        {movie.vote_average > 0 && (
          <span className="movie-card-rating">
            {movie.vote_average.toFixed(1)}
          </span>
        )}
      </div>
    </article>
  );
}
