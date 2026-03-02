import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModule, setAuthModule] = useState(null);

  // Dynamically import firebase/auth + firebase/app client-side only
  useEffect(() => {
    Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
    ]).then(([appMod, authMod]) => {
      const app = !appMod.getApps().length
        ? appMod.initializeApp({
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
          })
        : appMod.getApps()[0];
      const auth = authMod.getAuth(app);
      setAuthModule({ auth, mod: authMod });
      const unsubscribe = authMod.onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return () => unsubscribe();
    });
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (!authModule) return;
    return authModule.mod.signInWithEmailAndPassword(authModule.auth, email, password);
  }, [authModule]);

  const signUp = useCallback(async (email, password) => {
    if (!authModule) return;
    return authModule.mod.createUserWithEmailAndPassword(authModule.auth, email, password);
  }, [authModule]);

  const signInWithGoogle = useCallback(async () => {
    if (!authModule) return;
    const provider = new authModule.mod.GoogleAuthProvider();
    return authModule.mod.signInWithPopup(authModule.auth, provider);
  }, [authModule]);

  const signOut = useCallback(async () => {
    if (!authModule) return;
    return authModule.mod.signOut(authModule.auth);
  }, [authModule]);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
