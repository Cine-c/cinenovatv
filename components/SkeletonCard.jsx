export function MovieCardSkeleton() {
  return (
    <article className="movie-card skeleton">
      <div className="skeleton-poster skeleton-pulse" />
      <div className="movie-card-info">
        <div className="skeleton-text skeleton-pulse" style={{ width: '80%', height: '1rem' }} />
        <div className="skeleton-text skeleton-pulse" style={{ width: '40%', height: '0.8rem', marginTop: '0.5rem' }} />
      </div>
    </article>
  );
}

export function MovieGridSkeleton({ count = 20 }) {
  return (
    <section className="movie-grid-section">
      <div className="movie-grid">
        {Array.from({ length: count }, (_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function BlogCardSkeleton() {
  return (
    <article className="blog-card skeleton">
      <div className="skeleton-image skeleton-pulse" />
      <div className="blog-card-content">
        <div className="skeleton-text skeleton-pulse" style={{ width: '90%', height: '1.1rem' }} />
        <div className="skeleton-text skeleton-pulse" style={{ width: '100%', height: '0.9rem', marginTop: '0.75rem' }} />
        <div className="skeleton-text skeleton-pulse" style={{ width: '70%', height: '0.9rem', marginTop: '0.25rem' }} />
        <div className="skeleton-text skeleton-pulse" style={{ width: '50%', height: '0.8rem', marginTop: '1rem' }} />
      </div>
    </article>
  );
}

export function BlogGridSkeleton({ count = 9 }) {
  return (
    <section className="blog-list-section">
      <div className="blog-grid">
        {Array.from({ length: count }, (_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
