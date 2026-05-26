import { createContext, useContext, useState, useCallback } from 'react';

const defaultFilters = {
  state: '',
  district: '',
  category: '',
  query: '',
  location: '',
  budget: 'moderate',
  travelers: 2,
  startDate: '',
  endDate: '',
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [searchFilters, setSearchFilters] = useState(defaultFilters);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const updateFilters = useCallback((updates) => {
    setSearchFilters((prev) => {
      const next = { ...prev, ...updates };
      if (updates.state !== undefined || updates.district !== undefined) {
        next.location = updates.district
          ? `${updates.district}, ${updates.state || prev.state}`
          : updates.state || '';
      }
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        searchFilters,
        updateFilters,
        selectedPlace,
        setSelectedPlace,
        drawerOpen,
        setDrawerOpen,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
