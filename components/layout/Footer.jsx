import Link from 'next/link';
import Subscribe from '../Subscribe';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <Subscribe variant="inline" />
      </div>

      <div className="footer-container">
        <div className="footer-section">
          <h3>CineNovaTV</h3>
          <p>Your source for movie trailers, reviews, and the latest film news.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <nav className="footer-nav">
            <Link href="/">Home</Link>
            <Link href="/trailers">Trailers</Link>
            <Link href="/scenes">Scenes</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </nav>
        </div>

        <div className="footer-section">
          <h4>Attribution</h4>
          <p className="tmdb-attribution">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="tmdb-link"
          >
            <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="TMDB Logo"
              width="120"
              height="12"
            />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} CineNovaTV. All rights reserved.</p>
      </div>
    </footer>
  );
}
