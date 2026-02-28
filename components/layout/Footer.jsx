import Link from 'next/link';
import AdSlot from '../AdSlot';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <AdSlot />
      <div className="footer-container">
        <div className="footer-section">
          <h3>CineNovaTV</h3>
          <p>Your source for movie trailers, reviews, and the latest film news.</p>
          <div className="footer-social">
            <a
              href="https://x.com/CineNovaTV"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Follow CineNovaTV on X"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>@CineNovaTV</span>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <nav className="footer-nav">
            <Link href="/">Home</Link>
            <Link href="/trailers">Trailers</Link>
            <Link href="/scenes">Scenes</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/blockbuster">Blockbuster</Link>
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <button
              className="footer-cookie-btn"
              onClick={() => window.dispatchEvent(new Event('openCookieSettings'))}
            >
              Cookie Settings
            </button>
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
