import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  initPersistence,
  observeAuthState,
  signupUser,
  loginUser,
  googleLogin,
  logoutUser,
  resetPassword,
  getUserDocument,
  createUserDocument,
} from '../services/authService';
import { updateProfile } from 'firebase/auth';
import { auth, isConfigured } from '../firebase/firebase';

const AuthContext = createContext(null);

const REMEMBER_KEY = 'travelsync_remember_email';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured()) {
      setLoading(false);
      return;
    }

    let unsub = () => {};

    const boot = async () => {
      try {
        await initPersistence();
      } catch {
        /* persistence optional */
      }

      unsub = observeAuthState(async (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          const doc = await getUserDocument(firebaseUser.uid);
          setProfile(
            doc || {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
            }
          );
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
    };

    boot();
    return () => unsub();
  }, []);

  const signup = useCallback(async (email, password, displayName) => {
    const { user: u, profile: p } = await signupUser({ email, password, name: displayName });
    setUser(u);
    setProfile(p);
    return u;
  }, []);

  const login = useCallback(async (email, password, remember = false) => {
    const { user: u, profile: p } = await loginUser({ email, password });
    if (remember) localStorage.setItem(REMEMBER_KEY, email);
    else localStorage.removeItem(REMEMBER_KEY);
    setUser(u);
    setProfile(p);
    return u;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const { user: u, profile: p } = await googleLogin();
    setUser(u);
    setProfile(p);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
  }, []);

  const sendPasswordReset = useCallback((email) => resetPassword(email), []);

  const updateUserProfile = useCallback(
    async (data) => {
      if (!user?.uid) return;
      if (auth?.currentUser && data.name) {
        await updateProfile(auth.currentUser, { displayName: data.name });
      }
      const updated = await createUserDocument(user, {
        name: data.name || data.displayName || profile?.name,
        bio: data.bio,
        ...data,
      });
      setProfile(updated);
      return updated;
    },
    [user, profile]
  );

  const getRememberedEmail = () => localStorage.getItem(REMEMBER_KEY) || '';

  const value = {
    user,
    profile,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword: sendPasswordReset,
    updateUserProfile,
    getRememberedEmail,
    isAuthenticated: Boolean(user),
    isConfigured: isConfigured(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
