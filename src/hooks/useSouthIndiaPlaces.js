import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchPlacesByState,
  fetchPlacesByDistrict,
  fetchPlacesByCategory,
  searchPlaces,
  fetchSectionPlaces,
} from '../services/placesService';
import { debounce } from '../utils/helpers';

const PAGE_SIZE = 9;

export const useSouthIndiaPlaces = (filters = {}) => {
  const { state = '', district = '', category = '', query = '' } = filters;
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (query?.trim()) {
        data = await searchPlaces(query, { state, district, category });
      } else if (category) {
        data = await fetchPlacesByCategory(category, { state, district });
      } else if (district && state) {
        data = await fetchPlacesByDistrict(state, district);
      } else if (state) {
        data = await fetchPlacesByState(state);
      } else {
        data = await searchPlaces('', { state, district, category });
      }
      setPlaces(data);
      setPage(1);
    } catch (e) {
      setError(e.message || 'Failed to load places');
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [state, district, category, query, retryCount]);

  useEffect(() => {
    load();
  }, [load]);

  const debouncedSearch = useMemo(
    () =>
      debounce((q, f) => {
        searchPlaces(q, f).then(setPlaces).catch((e) => setError(e.message));
      }, 400),
    []
  );

  const search = (q) => debouncedSearch(q, { state, district, category });

  const visiblePlaces = places.slice(0, page * PAGE_SIZE);
  const hasMore = visiblePlaces.length < places.length;
  const loadMore = () => setPage((p) => p + 1);
  const retry = () => setRetryCount((c) => c + 1);

  return {
    places: visiblePlaces,
    allPlaces: places,
    loading,
    error,
    hasMore,
    loadMore,
    reload: load,
    retry,
    search,
  };
};

export const useHomeSections = (filters) => {
  const [sections, setSections] = useState({
    popular: [],
    trending: [],
    weekend: [],
    hidden: [],
    nature: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const popularPromise =
      filters.district && filters.state
        ? fetchPlacesByDistrict(filters.state, filters.district)
        : filters.state
          ? fetchPlacesByState(filters.state)
          : searchPlaces('', {});

    Promise.all([
      popularPromise,
      fetchSectionPlaces('trending', filters),
      fetchSectionPlaces('weekend', filters),
      fetchSectionPlaces('hidden', filters),
      fetchSectionPlaces('nature', filters),
    ])
      .then(([popular, trending, weekend, hidden, nature]) => {
        if (!cancelled) {
          setSections({ popular, trending, weekend, hidden, nature });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filters.state, filters.district]);

  return { sections, loading };
};
