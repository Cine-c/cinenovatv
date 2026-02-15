import Link from 'next/link';
import { useState } from 'react';
import { useWatchLater } from '../WatchLaterContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { items } = useWatchLater();

  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="logo">
          CineNovaTV
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`hamburger ${menuOpen ? 'active' : ''}`}></span>
        </button>

        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/trailers" onClick={() => setMenuOpen(false)}>
            Trailers
          </Link>
          <Link href="/scenes" onClick={() => setMenuOpen(false)}>
            Scenes
          </Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)}>
            Blog
          </Link>
          <Link href="/watchlater" className="nav-watchlater" onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            {items.length > 0 && <span className="watchlater-count">{items.length}</span>}
          </Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
