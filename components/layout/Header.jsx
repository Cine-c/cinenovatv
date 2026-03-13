import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useWatchLater } from '../WatchLaterContext';
import { useAuth } from '../useAuth';
import { useLanguage, SUPPORTED_LANGUAGES } from '../LanguageContext';
import { AMAZON_TAG } from '../../lib/affiliates';
import SearchBar from '../SearchBar';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef(null);
  const { items } = useWatchLater();
  const { user, loading: authLoading } = useAuth();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? ' header-scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo-group">
          <Link href="/" className="logo">
            Cine<span className="logo-nova">Nova</span>TV
          </Link>
          <a
            href={`https://www.amazon.com/?tag=${AMAZON_TAG}`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="header-amazon"
            aria-label="Shop on Amazon"
          >
            <svg width="56" height="17" viewBox="0 0 602.28 181.499" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M373.642 141.938c-34.999 25.797-85.729 39.561-129.406 39.561-61.243 0-116.377-22.651-158.088-60.325-3.277-2.963-.341-7.005 3.592-4.7 45.014 26.191 100.673 41.947 158.166 41.947 38.775 0 81.429-8.022 120.656-24.674 5.925-2.517 10.88 3.88 5.08 8.191z" fill="#FF9900"/>
              <path d="M386.463 127.026c-4.466-5.72-29.572-2.702-40.846-1.363-3.434.416-3.96-2.57-.865-4.724 20.003-14.078 52.827-10.015 56.655-5.296 3.828 4.745-.996 37.647-19.794 53.351-2.884 2.413-5.636 1.127-4.357-2.075 4.228-10.564 13.674-34.186 9.207-39.893z" fill="#FF9900"/>
              <path d="M346.201 20.469V6.328c0-2.148 1.624-3.591 3.566-3.591h63.096c2.023 0 3.647 1.469 3.647 3.565v12.1c-.026 2.023-1.728 4.671-4.751 8.81l-32.672 46.663c12.125-.312 24.935 1.52 35.918 7.733 2.49 1.39 3.148 3.434 3.332 5.456v15.062c0 2.049-2.256 4.437-4.62 3.2-19.296-10.12-44.943-11.223-66.28.13-2.178 1.181-4.462-1.179-4.462-3.228V88.14c0-2.282.026-6.166 2.334-9.626l37.842-54.28h-32.934c-2.022 0-3.646-1.442-3.646-3.538zM124.1 105.375h-19.19c-1.832-.156-3.304-1.52-3.434-3.278V6.51c0-1.988 1.65-3.565 3.697-3.565h17.87c1.858.078 3.356 1.494 3.486 3.278v13.65h.364c4.646-13.026 13.39-19.088 25.168-19.088 11.959 0 19.425 6.062 24.805 19.088 4.62-13.026 15.114-19.088 26.45-19.088 8.022 0 16.798 3.304 22.157 10.72 6.062 8.24 4.828 20.225 4.828 30.737l-.026 59.654c0 1.988-1.65 3.59-3.696 3.59h-19.165c-1.91-.155-3.434-1.676-3.434-3.59V51.06c0-4.124.364-14.416-.546-18.358-1.442-6.608-5.742-8.466-11.309-8.466-4.646 0-9.506 3.096-11.491 8.058-1.988 4.96-1.806 13.26-1.806 18.766v50.836c0 1.988-1.65 3.59-3.696 3.59h-19.166c-1.936-.155-3.434-1.676-3.434-3.59l-.026-50.836c0-10.902 1.806-26.928-11.855-26.928-13.832 0-13.286 15.634-13.286 26.928v50.836c0 1.988-1.65 3.59-3.696 3.59zM481.474.786c28.495 0 43.921 24.467 43.921 55.568 0 30.035-17.036 53.898-43.921 53.898-27.95 0-43.14-24.467-43.14-54.956 0-30.658 15.374-54.51 43.14-54.51zm.182 20.122c-14.14 0-15.036 19.268-15.036 31.284 0 12.038-.182 37.752 14.854 37.752 14.854 0 15.556-20.744 15.556-33.384 0-8.31-.364-18.252-2.932-26.174-2.204-6.894-6.59-9.478-12.442-9.478zM560.542 105.375h-19.112c-1.91-.156-3.434-1.676-3.434-3.59l-.026-95.66c.182-1.806 1.78-3.2 3.696-3.2h17.792c1.676.078 3.07 1.207 3.434 2.75v14.624h.364c5.378-13.156 12.908-19.41 26.194-19.41 8.596 0 16.98 3.096 22.365 11.544 4.984 7.826 4.984 20.98 4.984 30.398v60.278c-.234 1.728-1.806 3.096-3.696 3.096h-19.268c-1.754-.156-3.2-1.416-3.382-3.096V50.02c0-10.668 1.234-26.304-12.038-26.304-4.672 0-8.96 3.122-11.103 7.878-2.724 6.036-3.07 12.038-3.07 18.426v51.876c-.026 1.988-1.702 3.59-3.748 3.59zM303.678 59.65c0 7.41.182 13.598-3.566 20.2-3.044 5.378-7.878 8.7-13.234 8.7-7.332 0-11.648-5.586-11.648-13.832 0-16.278 14.594-19.244 28.45-19.244v4.176zm19.296 46.663c-1.263 1.127-3.096 1.205-4.516.442-6.348-5.274-7.488-7.722-10.954-12.752-10.486 10.694-17.896 13.884-31.466 13.884-16.07 0-28.548-9.92-28.548-29.78 0-15.504 8.414-26.068 20.38-31.232 10.382-4.568 24.883-5.378 35.988-6.634v-2.464c0-4.542.338-9.92-2.334-13.858-2.308-3.538-6.764-4.984-10.694-4.984-7.254 0-13.728 3.722-15.296 11.44-.338 1.702-1.598 3.382-3.356 3.46l-18.59-1.988c-1.572-.364-3.33-1.65-2.878-4.098C255.004 5.414 276.87.786 296.502.786c10.122 0 23.356 2.698 31.336 10.382 10.122 9.478 9.166 22.13 9.166 35.91v32.542c0 9.79 4.072 14.078 7.878 19.374 1.338 1.884 1.624 4.15-.078 5.56-4.254 3.564-11.828 10.174-15.99 13.884l-.052-.026z" fill="currentColor"/>
            </svg>
          </a>
        </div>

        <SearchBar />

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
          <Link href="/discover" onClick={() => setMenuOpen(false)}>
            Discover
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
          <Link href="/blockbuster" onClick={() => setMenuOpen(false)}>
            Blockbuster
          </Link>
          <div className="lang-switcher" ref={langRef}>
            <button
              className="lang-toggle"
              onClick={() => setLangOpen(!langOpen)}
              aria-label="Change content language"
              aria-expanded={langOpen}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
              </svg>
            </button>
            {langOpen && (
              <div className="lang-dropdown">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    className={`lang-option${language === lang.code ? ' active' : ''}`}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangOpen(false);
                    }}
                  >
                    {lang.label}
                    {language === lang.code && (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link href="/watchlater" className="nav-watchlater" onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            {items.length > 0 && <span className="watchlater-count">{items.length}</span>}
          </Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link href="/premium" className="nav-premium" onClick={() => setMenuOpen(false)}>
            Premium
          </Link>
          {!authLoading && (
            user ? (
              <Link href="/account" className="nav-user" onClick={() => setMenuOpen(false)}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="nav-avatar" referrerPolicy="no-referrer" />
                ) : (
                  <span className="nav-avatar-fallback">
                    {(user.email || '?')[0].toUpperCase()}
                  </span>
                )}
              </Link>
            ) : (
              <Link href="/login" className="nav-signin" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
