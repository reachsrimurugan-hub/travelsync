import { useState, useEffect } from 'react';
import { fetchPlaceDetails, searchPlaces, fetchPlacesByCategory } from '../services/placesService';

export const usePlaces = (filters = {}) => {
  const state = typeof filters === 'string' ? '' : filters.state || filters.location || '';
  const district = typeof filters === 'string' ? filters : filters.district || '';
  const category = typeof filters === 'string' ? '' : filters.category || '';
  const query = typeof filters === 'string' ? filters : filters.query || '';

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        let data;
        if (category || state || district || query) {
          data = category
            ? await fetchPlacesByCategory(category, { state, district, query })
            : await searchPlaces(query, { state, district, category });
        } else {
          data = await searchPlaces('', {});
        }
        if (!cancelled) setPlaces(data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [state, district, category, query]);

  return { places, loading, error };
};

export const usePlaceDetails = (placeId) => {
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!placeId) return;
    setLoading(true);
    fetchPlaceDetails(placeId)
      .then(setPlace)
      .catch(() => setPlace(null))
      .finally(() => setLoading(false));
  }, [placeId]);

  return { place, loading };
};
