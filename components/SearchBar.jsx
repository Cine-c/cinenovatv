import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const search = useCallback(async (q) => {
    if (!q || q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(q)}`);
      const data = await res.json();
      const items = (data.results || [])
        .filter((m) => m.poster_path)
        .slice(0, 6);
      setResults(items);
      setOpen(items.length > 0);
      setHighlighted(-1);
    } catch {
      setResults([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const navigateTo = (id) => {
    setOpen(false);
    setQuery('');
    setMobileOpen(false);
    router.push(`/movies/${id}`);
  };

  const viewAll = () => {
    if (!query.trim()) return;
    setOpen(false);
    setMobileOpen(false);
    router.push(`/trailers?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
  };

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'Enter' && query.trim()) {
        viewAll();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlighted((h) => (h < results.length ? h + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlighted((h) => (h > 0 ? h - 1 : results.length));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlighted >= 0 && highlighted < results.length) {
          navigateTo(results[highlighted].id);
        } else {
          viewAll();
        }
        break;
      case 'Escape':
        setOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus input when mobile search opens
  useEffect(() => {
    if (mobileOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mobileOpen]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  return (
    <div className="header-search" ref={containerRef}>
      {/* Mobile toggle */}
      <button
        className="search-toggle-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle search"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>

      <div className={`search-bar${mobileOpen ? ' mobile-open' : ''}`}>
        <div className="search-bar-input-wrapper">
          <svg className="search-bar-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="search-bar-input"
            placeholder="Search movies..."
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (results.length > 0) setOpen(true); }}
            autoComplete="off"
          />
          {loading && <span className="search-bar-spinner" />}
        </div>

        {open && (
          <div className="search-dropdown">
            {results.map((m, i) => (
              <button
                key={m.id}
                className={`search-result-item${i === highlighted ? ' highlighted' : ''}`}
                onClick={() => navigateTo(m.id)}
                onMouseEnter={() => setHighlighted(i)}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                  alt={m.title}
                  width={40}
                  height={60}
                  style={{ objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                />
                <div className="search-result-info">
                  <span className="search-result-title">{m.title}</span>
                  <span className="search-result-meta">
                    {m.release_date ? m.release_date.split('-')[0] : ''}
                    {m.vote_average > 0 && (
                      <span className="search-result-rating">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        {m.vote_average.toFixed(1)}
                      </span>
                    )}
                  </span>
                </div>
              </button>
            ))}
            <button
              className={`search-result-viewall${highlighted === results.length ? ' highlighted' : ''}`}
              onClick={viewAll}
              onMouseEnter={() => setHighlighted(results.length)}
            >
              View all results for &ldquo;{query}&rdquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
