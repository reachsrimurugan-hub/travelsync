import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isConfigured } from '../firebase/firebase';
import { toFirestoreTrip, fromFirestoreTrip } from '../utils/tripMapper';

const COL = {
  users: 'users',
  trips: 'trips',
  itineraries: 'itineraries',
  budgets: 'budgets',
  savedPlaces: 'savedPlaces',
};

const LOCAL_TRIPS_KEY = 'travelsync_trips';
const LOCAL_SAVED_KEY = 'travelsync_saved_places';
const LOCAL_USER_KEY = 'travelsync_user_profile';

const localGet = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (key === LOCAL_USER_KEY) return raw ? JSON.parse(raw) : null;
    return JSON.parse(raw || '[]');
  } catch {
    return key === LOCAL_USER_KEY ? null : [];
  }
};

const localSet = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const requireUser = (user) => {
  if (!user?.uid) {
    const err = new Error('Please login to save your trip');
    err.code = 'auth/required';
    throw err;
  }
  return user.uid;
};

const subDocId = (uid, tripId) => `${uid}_${tripId}`;

const sortTripsByDate = (trips) =>
  [...trips].sort((a, b) => {
    const ta = a.createdAt?.seconds ?? new Date(a.createdAt || 0).getTime();
    const tb = b.createdAt?.seconds ?? new Date(b.createdAt || 0).getTime();
    return tb - ta;
  });

const syncSubcollections = async (uid, tripId, firestorePayload) => {
  if (!db) return;
  const itinRef = doc(db, COL.itineraries, subDocId(uid, tripId));
  const budgetRef = doc(db, COL.budgets, subDocId(uid, tripId));

  await Promise.all([
    setDoc(
      itinRef,
      {
        userId: uid,
        tripId,
        days: firestorePayload.days,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    ),
    setDoc(
      budgetRef,
      {
        userId: uid,
        tripId,
        budgetBreakdown: firestorePayload.budgetBreakdown,
        budget: firestorePayload.budget,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    ),
  ]);
};

const deleteSubcollections = async (uid, tripId) => {
  if (!db) return;
  await Promise.all([
    deleteDoc(doc(db, COL.itineraries, subDocId(uid, tripId))).catch(() => {}),
    deleteDoc(doc(db, COL.budgets, subDocId(uid, tripId))).catch(() => {}),
  ]);
};

// ——— Trips ———

/**
 * Create a new trip in Firestore
 * @returns {Promise<{ id: string, ...trip }>}
 */
export const saveTrip = async (tripData, user) => {
  const uid = requireUser(user);
  const payload = toFirestoreTrip(tripData, uid);

  if (!isConfigured() || !db) {
    const id = tripData.id || `local-${Date.now()}`;
    const trip = {
      id,
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const trips = localGet(LOCAL_TRIPS_KEY).filter((t) => t.id !== id);
    trips.unshift(trip);
    localSet(LOCAL_TRIPS_KEY, trips);
    return trip;
  }

  const docRef = await addDoc(collection(db, COL.trips), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await syncSubcollections(uid, docRef.id, payload);

  const snap = await getDoc(docRef);
  return fromFirestoreTrip(snap);
};

/**
 * Update existing trip — preserves createdAt
 */
export const updateTrip = async (tripId, tripData, user) => {
  const uid = requireUser(user);
  if (!tripId) throw new Error('Trip ID is required');

  const payload = toFirestoreTrip({ ...tripData, id: tripId }, uid);

  if (!isConfigured() || !db) {
    const trips = localGet(LOCAL_TRIPS_KEY);
    const idx = trips.findIndex((t) => t.id === tripId);
    const existing = idx >= 0 ? trips[idx] : {};
    const merged = {
      ...existing,
      ...payload,
      id: tripId,
      userId: uid,
      createdAt: existing.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (idx >= 0) trips[idx] = merged;
    else trips.unshift(merged);
    localSet(LOCAL_TRIPS_KEY, trips);
    return merged;
  }

  const tripRef = doc(db, COL.trips, tripId);
  const existingSnap = await getDoc(tripRef);

  if (!existingSnap.exists()) {
    throw new Error('Trip not found');
  }
  if (existingSnap.data().userId !== uid) {
    throw new Error('Unauthorized');
  }

  await updateDoc(tripRef, {
    ...payload,
    updatedAt: serverTimestamp(),
  });

  await syncSubcollections(uid, tripId, payload);

  const updated = await getTripById(tripId, user);
  return updated;
};

export const deleteTrip = async (tripId, user) => {
  const uid = requireUser(user);
  if (!tripId) return;

  if (!isConfigured() || !db) {
    localSet(
      LOCAL_TRIPS_KEY,
      localGet(LOCAL_TRIPS_KEY).filter((t) => t.id !== tripId)
    );
    return;
  }

  const tripRef = doc(db, COL.trips, tripId);
  const snap = await getDoc(tripRef);
  if (snap.exists() && snap.data().userId !== uid) {
    throw new Error('Unauthorized');
  }

  await deleteSubcollections(uid, tripId);
  await deleteDoc(tripRef);
};

export const getUserTrips = async (user) => {
  const uid = requireUser(user);

  if (!isConfigured() || !db) {
    return localGet(LOCAL_TRIPS_KEY)
      .filter((t) => t.userId === uid)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((t) => fromFirestoreTrip({ id: t.id, data: () => t }));
  }

  const q = query(collection(db, COL.trips), where('userId', '==', uid));
  const snap = await getDocs(q);
  return sortTripsByDate(snap.docs.map((d) => fromFirestoreTrip(d)));
};

export const getTripById = async (tripId, user) => {
  const uid = requireUser(user);

  if (!isConfigured() || !db) {
    const trip = localGet(LOCAL_TRIPS_KEY).find((t) => t.id === tripId && t.userId === uid);
    return trip ? fromFirestoreTrip({ id: trip.id, data: () => trip }) : null;
  }

  const snap = await getDoc(doc(db, COL.trips, tripId));
  if (!snap.exists() || snap.data().userId !== uid) return null;
  return fromFirestoreTrip(snap);
};

/**
 * Real-time listener for user's trips
 * @returns {import('firebase/firestore').Unsubscribe}
 */
export const subscribeToUserTrips = (user, onData, onError) => {
  const uid = user?.uid;
  if (!uid) {
    onData([]);
    return () => {};
  }

  if (!isConfigured() || !db) {
    const trips = localGet(LOCAL_TRIPS_KEY)
      .filter((t) => t.userId === uid)
      .map((t) => fromFirestoreTrip({ id: t.id, data: () => t }));
    onData(trips);
    return () => {};
  }

  const q = query(collection(db, COL.trips), where('userId', '==', uid));

  return onSnapshot(
    q,
    (snapshot) => {
      onData(sortTripsByDate(snapshot.docs.map((d) => fromFirestoreTrip(d))));
    },
    (err) => onError?.(err)
  );
};

// ——— Saved places ———

export const savePlace = async (user, place) => {
  const uid = requireUser(user);
  const placeId = place.id || `place-${Date.now()}`;
  const payload = { ...place, id: placeId, userId: uid, updatedAt: new Date().toISOString() };

  if (!isConfigured() || !db) {
    const saved = localGet(LOCAL_SAVED_KEY).filter((p) => !(p.id === placeId && p.userId === uid));
    saved.push(payload);
    localSet(LOCAL_SAVED_KEY, saved);
    return payload;
  }

  await setDoc(doc(db, COL.savedPlaces, `${uid}_${placeId}`), {
    ...payload,
    updatedAt: serverTimestamp(),
  }, { merge: true });

  return payload;
};

export const getSavedPlaces = async (user) => {
  const uid = requireUser(user);

  if (!isConfigured() || !db) {
    return localGet(LOCAL_SAVED_KEY).filter((p) => p.userId === uid);
  }

  const q = query(collection(db, COL.savedPlaces), where('userId', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const removeSavedPlace = async (user, placeId) => {
  const uid = requireUser(user);

  if (!isConfigured() || !db) {
    localSet(
      LOCAL_SAVED_KEY,
      localGet(LOCAL_SAVED_KEY).filter((p) => !(p.id === placeId && p.userId === uid))
    );
    return;
  }

  await deleteDoc(doc(db, COL.savedPlaces, `${uid}_${placeId}`));
};

export const subscribeToSavedPlaces = (user, onData, onError) => {
  const uid = user?.uid;
  if (!uid) {
    onData([]);
    return () => {};
  }

  if (!isConfigured() || !db) {
    onData(localGet(LOCAL_SAVED_KEY).filter((p) => p.userId === uid));
    return () => {};
  }

  const q = query(collection(db, COL.savedPlaces), where('userId', '==', uid));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ docId: d.id, ...d.data() }))),
    (err) => onError?.(err)
  );
};

// ——— User profile ———

export const saveUserProfile = async (uid, profile) => {
  const data = { ...profile, updatedAt: new Date().toISOString() };
  if (!isConfigured() || !db) {
    localSet(LOCAL_USER_KEY, { uid, ...data });
    return data;
  }
  await setDoc(doc(db, COL.users, uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
  return data;
};

export const getUserProfile = async (uid) => {
  if (!isConfigured() || !db) {
    const stored = localGet(LOCAL_USER_KEY);
    return stored?.uid === uid ? stored : null;
  }
  const snap = await getDoc(doc(db, COL.users, uid));
  return snap.exists() ? snap.data() : null;
};

export const uploadTripImage = async (user, file) => {
  const uid = requireUser(user);
  if (!isConfigured() || !storage) return URL.createObjectURL(file);
  const path = `trips/${uid}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

/** @deprecated Use updateTrip */
export const updateTripPartial = updateTrip;
