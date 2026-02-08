import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WatchLaterContext = createContext({ items: [], toggle: () => {}, has: () => false });

export function WatchLaterProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('watchLater');
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = useCallback((next) => {
    setItems(next);
    try { localStorage.setItem('watchLater', JSON.stringify(next)); } catch {}
  }, []);

  const toggle = useCallback((movie) => {
    setItems((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      const next = exists ? prev.filter((m) => m.id !== movie.id) : [...prev, {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        releaseYear: movie.releaseYear || (movie.release_date ? movie.release_date.split('-')[0] : ''),
      }];
      try { localStorage.setItem('watchLater', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const has = useCallback((movieId) => items.some((m) => m.id === movieId), [items]);

  return (
    <WatchLaterContext.Provider value={{ items, toggle, has }}>
      {children}
    </WatchLaterContext.Provider>
  );
}

export function useWatchLater() {
  return useContext(WatchLaterContext);
}
