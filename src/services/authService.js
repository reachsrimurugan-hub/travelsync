import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, isConfigured } from '../firebase/firebase';
import { getAuthErrorMessage } from '../utils/authErrors';

const USERS_COL = 'users';

const assertAuth = () => {
  if (!isConfigured() || !auth) {
    const err = new Error('Firebase is not configured. Add credentials to your .env file.');
    err.code = 'auth/not-configured';
    throw err;
  }
};

/** Create or update Firestore user profile */
export const createUserDocument = async (firebaseUser, extra = {}) => {
  if (!db || !firebaseUser?.uid) return null;

  const userRef = doc(db, USERS_COL, firebaseUser.uid);
  const existing = await getDoc(userRef);
  const isNew = !existing.exists();

  const payload = {
    uid: firebaseUser.uid,
    name: extra.name || firebaseUser.displayName || '',
    email: firebaseUser.email || extra.email || '',
    photoURL: firebaseUser.photoURL || extra.photoURL || '',
    lastLogin: serverTimestamp(),
    ...(isNew ? { createdAt: serverTimestamp() } : {}),
    ...extra,
  };

  await setDoc(userRef, payload, { merge: true });
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : payload;
};

export const getUserDocument = async (uid) => {
  if (!db || !uid) return null;
  const snap = await getDoc(doc(db, USERS_COL, uid));
  return snap.exists() ? snap.data() : null;
};

export const initPersistence = async () => {
  assertAuth();
  await setPersistence(auth, browserLocalPersistence);
};

export const observeAuthState = (callback) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export const signupUser = async ({ email, password, name }) => {
  assertAuth();
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(credential.user, { displayName: name });
    }
    const profile = await createUserDocument(credential.user, { name, email });
    return { user: credential.user, profile };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
};

export const loginUser = async ({ email, password }) => {
  assertAuth();
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await createUserDocument(credential.user);
    return { user: credential.user, profile };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
};

export const googleLogin = async () => {
  assertAuth();
  if (!googleProvider) throw new Error('Google sign-in is not available.');
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    const profile = await createUserDocument(credential.user, {
      name: credential.user.displayName,
      email: credential.user.email,
      photoURL: credential.user.photoURL,
    });
    return { user: credential.user, profile };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
};

export const logoutUser = async () => {
  assertAuth();
  await signOut(auth);
};

export const resetPassword = async (email) => {
  assertAuth();
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: 'Password reset email sent. Check your inbox.' };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
};
