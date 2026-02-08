import MovieCard from './MovieCard';

export default function MovieGrid({ movies, onWatchTrailer, title }) {
  if (!movies || movies.length === 0) {
    return (
      <section className="movie-grid-section">
        {title && <h2 className="section-title">{title}</h2>}
        <p className="no-movies">No movies found.</p>
      </section>
    );
  }

  return (
    <section className="movie-grid-section">
      {title && <h2 className="section-title">{title}</h2>}
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onWatchTrailer={onWatchTrailer}
          />
        ))}
      </div>
    </section>
  );
}
