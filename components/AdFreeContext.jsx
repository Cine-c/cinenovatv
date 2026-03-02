import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const AdFreeContext = createContext({ adFree: false, setAdFree: () => {} });

const STORAGE_KEY = 'adFreeMode';

export function AdFreeProvider({ children }) {
  const { user } = useAuth();
  const [adFree, setAdFreeState] = useState(false);

  // Check Firestore subscription when user is authenticated
  useEffect(() => {
    if (!user) {
      // Fall back to localStorage for unauthenticated users
      try {
        setAdFreeState(localStorage.getItem(STORAGE_KEY) === 'true');
      } catch {}
      return;
    }

    let cancelled = false;
    async function checkSubscription() {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (cancelled) return;

        if (snap.exists()) {
          const data = snap.data();
          const isActive = data.subscriptionStatus === 'active'
            && data.currentPeriodEnd > Math.floor(Date.now() / 1000);
          setAdFreeState(isActive);
          try { localStorage.setItem(STORAGE_KEY, String(isActive)); } catch {}
        } else {
          setAdFreeState(false);
          try { localStorage.setItem(STORAGE_KEY, 'false'); } catch {}
        }
      } catch {
        // On error, fall back to localStorage
        try {
          setAdFreeState(localStorage.getItem(STORAGE_KEY) === 'true');
        } catch {}
      }
    }

    checkSubscription();
    return () => { cancelled = true; };
  }, [user]);

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
