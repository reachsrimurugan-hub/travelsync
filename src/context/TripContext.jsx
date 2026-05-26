import { createContext, useContext, useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
  saveTrip,
  updateTrip,
  deleteTrip,
  subscribeToUserTrips,
  subscribeToSavedPlaces,
  savePlace,
  removeSavedPlace,
} from '../services/firebaseService';
import { createEmptyTrip, itineraryToDays, calcBudgetTotal, tripPayloadHash } from '../utils/tripMapper';
import { exportTripToPDF } from '../utils/pdfExport';
import { useTripAutosave } from '../hooks/useTripAutosave';
import toast from 'react-hot-toast';

const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle | pending | saving | saved | error
  const [syncError, setSyncError] = useState(null);

  const activeTripRef = useRef(activeTrip);
  const syncStatusRef = useRef(syncStatus);
  activeTripRef.current = activeTrip;
  syncStatusRef.current = syncStatus;

  const requireAuth = useCallback(() => {
    if (!isAuthenticated || !user?.uid) {
      toast.error('Please login to save your trip');
      navigate('/login', { state: { from: { pathname: '/planner' } } });
      return false;
    }
    return true;
  }, [isAuthenticated, user, navigate]);

  const handleSyncStatus = useCallback((status, err) => {
    setSyncStatus(status);
    if (status === 'error') {
      setSyncError(err?.message || 'Sync failed');
    } else {
      setSyncError(null);
    }
    if (status === 'saved') {
      setTimeout(() => setSyncStatus((s) => (s === 'saved' ? 'idle' : s)), 2000);
    }
  }, []);

  const persistTrip = useCallback(
    async (tripId, trip, authUser) => {
      return updateTrip(tripId, trip, authUser);
    },
    []
  );

  useTripAutosave(activeTrip, user, persistTrip, handleSyncStatus);

  // Real-time trips subscription
  useEffect(() => {
    if (!user?.uid) {
      setTrips([]);
      setSavedPlaces([]);
      setActiveTrip(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubTrips = subscribeToUserTrips(
      user,
      (data) => {
        setTrips(data);
        setLoading(false);
        setActiveTrip((current) => {
          if (!current) return data[0] || null;
          const fresh = data.find((t) => t.id === current.id);
          if (!fresh) return data[0] || null;
          // Avoid overwriting in-progress local edits while saving
          if (syncStatusRef.current === 'pending' || syncStatusRef.current === 'saving') return current;
          return fresh;
        });
      },
      (err) => {
        setSyncError(err.message);
        setLoading(false);
      }
    );

    const unsubPlaces = subscribeToSavedPlaces(
      user,
      setSavedPlaces,
      (err) => setSyncError(err.message)
    );

    return () => {
      unsubTrips();
      unsubPlaces();
    };
  }, [user?.uid]);

  const patchActiveTrip = useCallback((updates) => {
    setActiveTrip((prev) => {
      if (!prev) return prev;
      const merged = { ...prev, ...updates };

      if (updates.itinerary && !updates.days) {
        merged.days = itineraryToDays(updates.itinerary, merged.startDate);
      }
      if (updates.days && !updates.itinerary) {
        merged.itinerary = updates.days.map((d) => ({
          day: d.day,
          date: d.date,
          title: d.title,
          activities: d.activities,
        }));
      }
      if (updates.budgetBreakdown || updates.budget) {
        const breakdown = updates.budgetBreakdown || updates.budget;
        merged.budgetBreakdown = breakdown;
        merged.budget = breakdown;
        merged.budgetTotal = calcBudgetTotal(breakdown);
      }
      if (updates.title && !updates.tripName) merged.tripName = updates.title;
      if (updates.tripName && !updates.title) merged.title = updates.tripName;

      setTrips((list) => list.map((t) => (t.id === merged.id ? merged : t)));
      return merged;
    });
  }, []);

  const createTrip = async (tripData = {}) => {
    if (!requireAuth()) return null;

    const empty = createEmptyTrip(tripData);
    setSyncStatus('saving');

    try {
      const saved = await saveTrip(empty, user);
      setTrips((prev) => [saved, ...prev.filter((t) => t.id !== saved.id)]);
      setActiveTrip(saved);
      setSyncStatus('saved');
      toast.success('Trip created and saved to cloud');
      return saved;
    } catch (err) {
      setSyncStatus('error');
      setSyncError(err.message);
      toast.error(err.message);
      throw err;
    }
  };

  const updateTripLocal = (tripId, updates) => {
    if (activeTripRef.current?.id === tripId) {
      patchActiveTrip(updates);
    } else {
      setTrips((list) =>
        list.map((t) => (t.id === tripId ? { ...t, ...updates } : t))
      );
    }
    setSyncStatus('pending');
  };

  const saveTripNow = async () => {
    if (!requireAuth() || !activeTrip?.id) return;
    setSyncStatus('saving');
    try {
      const saved = await updateTrip(activeTrip.id, activeTrip, user);
      setActiveTrip(saved);
      setTrips((list) => list.map((t) => (t.id === saved.id ? saved : t)));
      setSyncStatus('saved');
      toast.success('Trip saved successfully');
      return saved;
    } catch (err) {
      setSyncStatus('error');
      toast.error(err.message);
      throw err;
    }
  };

  const removeTrip = async (tripId) => {
    if (!requireAuth()) return;

    const prevTrips = trips;
    const prevActive = activeTrip;

    setTrips((list) => list.filter((t) => t.id !== tripId));
    if (activeTrip?.id === tripId) setActiveTrip(null);

    try {
      await deleteTrip(tripId, user);
      toast.success('Trip deleted');
    } catch (err) {
      setTrips(prevTrips);
      setActiveTrip(prevActive);
      toast.error(err.message);
      throw err;
    }
  };

  const retrySync = async () => {
    if (!activeTrip?.id || !user) return;
    setSyncStatus('saving');
    try {
      await updateTrip(activeTrip.id, activeTrip, user);
      setSyncStatus('saved');
      toast.success('Sync successful');
    } catch (err) {
      setSyncStatus('error');
      setSyncError(err.message);
    }
  };

  const toggleSavePlace = async (place) => {
    if (!requireAuth()) return;
    const exists = savedPlaces.some((p) => p.id === place.id);
    try {
      if (exists) {
        await removeSavedPlace(user, place.id);
        toast.success('Removed from saved');
      } else {
        await savePlace(user, place);
        toast.success('Place saved');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const isPlaceSaved = (placeId) => savedPlaces.some((p) => p.id === placeId);

  const exportPDF = (trip) => exportTripToPDF(trip || activeTrip);

  const defaultBudget = () => createEmptyTrip().budgetBreakdown;

  const value = {
    trips,
    savedPlaces,
    activeTrip,
    setActiveTrip,
    loading,
    syncStatus,
    syncError,
    createTrip,
    updateTrip: updateTripLocal,
    saveTripNow,
    removeTrip,
    retrySync,
    toggleSavePlace,
    isPlaceSaved,
    exportPDF,
    requireAuth,
    defaultBudget,
    recentTrips: trips.slice(0, 5),
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

export const useTrips = () => {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrips must be used within TripProvider');
  return ctx;
};
