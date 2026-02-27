import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdFreeContext = createContext({ adFree: false, setAdFree: () => {} });

const STORAGE_KEY = 'adFreeMode';

export function AdFreeProvider({ children }) {
  const [adFree, setAdFreeState] = useState(false);

  useEffect(() => {
    try {
      setAdFreeState(localStorage.getItem(STORAGE_KEY) === 'true');
    } catch {}
  }, []);

  const setAdFree = useCallback((value) => {
    setAdFreeState(value);
    try { localStorage.setItem(STORAGE_KEY, String(value)); } catch {}
  }, []);

  return (
    <AdFreeContext.Provider value={{ adFree, setAdFree }}>
      {children}
    </AdFreeContext.Provider>
  );
}

export function useAdFree() {
  return useContext(AdFreeContext);
}
