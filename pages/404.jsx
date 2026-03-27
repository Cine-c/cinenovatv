import Link from 'next/link';
import SEOHead from '../components/seo/SEOHead';

export default function Custom404() {
  return (
    <>
      <SEOHead
        title="Page Not Found — CineNovaTV"
        description="The page you're looking for doesn't exist. Browse trending movies, trailers, and streaming info on CineNovaTV."
        noindex
      />

      <div className="error-page">
        <div className="error-content">
          <div className="error-code">404</div>
          <h1 className="error-title">Scene Not Found</h1>
          <p className="error-description">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back to the movies.
          </p>
          <div className="error-actions">
            <Link href="/" className="btn btn-primary btn-large">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Back to Home
            </Link>
            <Link href="/discover" className="btn btn-secondary btn-large">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Discover Movies
            </Link>
          </div>
          <div className="error-links">
            <span className="error-links-label">Or try these:</span>
            <Link href="/trailers">Latest Trailers</Link>
            <Link href="/celebrity">Celebrities</Link>
            <Link href="/blog">Movie News</Link>
            <Link href="/scenes">Iconic Scenes</Link>
          </div>
        </div>
      </div>
    </>
  );
}
