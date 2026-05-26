import axios from 'axios';
import {
  SOUTH_INDIA_STATES,
  DISTRICTS_BY_STATE,
  getDistrictsForState,
  filterSouthIndiaPlaces,
  getPlaceById,
  getAllSouthIndiaPlaces,
  getSearchSuggestions,
  enrichPlace,
  isSouthIndiaState,
} from '../utils/southIndiaData';

const RAPIDAPI_HOST = 'travel-advisor.p.rapidapi.com';
const API_KEY = import.meta.env.VITE_PLACES_API_KEY;

const api = axios.create({
  baseURL: `https://${RAPIDAPI_HOST}`,
  timeout: 14000,
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': RAPIDAPI_HOST,
  },
});

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map();

const cacheKey = (parts) => parts.filter(Boolean).join('|');

const getCached = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};

const setCache = (key, data) => cache.set(key, { data, ts: Date.now() });

const isSouthIndiaQuery = (text = '') => {
  const t = text.toLowerCase();
  return (
    t.includes('tamil') ||
    t.includes('kerala') ||
    t.includes('karnataka') ||
    t.includes('india') ||
    SOUTH_INDIA_STATES.some((s) => t.includes(s.toLowerCase())) ||
    Object.values(DISTRICTS_BY_STATE)
      .flat()
      .some((d) => t.includes(d.toLowerCase()))
  );
};

const normalizePlace = (item, meta = {}, index = 0) => {
  const fallback = getAllSouthIndiaPlaces()[index % 40];
  const photo = item.photo?.images?.large?.url || item.photo?.images?.medium?.url;
  const address = item.address || item.location_string || item.result_object?.location_string || '';
  const state = meta.state || inferState(address) || 'Tamil Nadu';
  const district = meta.district || inferDistrict(address, state) || meta.district;

  return enrichPlace({
    id: String(item.location_id || item.id || `${meta.district}-${index}`),
    name: item.name || item.title || fallback?.name,
    district: district || fallback?.district,
    state,
    category: meta.category || item.category || fallback?.category || 'nature',
    rating: Number(item.rating) || 4.4 + (index % 5) * 0.1,
    description: item.description || item.snippet || fallback?.description || 'Explore this South Indian destination.',
    image: photo || fallback?.image,
    latitude: item.latitude ?? item.lat ?? fallback?.lat,
    longitude: item.longitude ?? item.lng ?? fallback?.lng,
    budget: meta.budget || fallback?.budget || 2000,
    bestSeason: meta.bestSeason || fallback?.bestSeason || 'Oct - Mar',
    numReviews: item.num_reviews,
    apiSource: 'rapidapi',
  });
};

const inferState = (address = '') => {
  const a = address.toLowerCase();
  if (a.includes('kerala')) return 'Kerala';
  if (a.includes('karnataka')) return 'Karnataka';
  if (a.includes('tamil')) return 'Tamil Nadu';
  return null;
};

const inferDistrict = (address, state) => {
  const districts = getDistrictsForState(state) || [];
  const a = address.toLowerCase();
  return districts.find((d) => a.includes(d.toLowerCase())) || null;
};

const apiSearch = async (query, limit = 12) => {
  if (!API_KEY) return [];
  const { data } = await api.get('/locations/search', {
    params: { query: `${query} India`, limit },
  });
  return (data?.data || []).filter((item) => {
    const loc = (item.result_object?.location_string || item.name || '').toLowerCase();
    return isSouthIndiaQuery(loc) || isSouthIndiaQuery(query);
  });
};

const apiListByLocation = async (locationId, limit = 12) => {
  if (!API_KEY || !locationId) return [];
  const { data } = await api.get('/locations/list', {
    params: { location_id: locationId, limit },
  });
  return data?.data || [];
};

const mergeWithCurated = (apiPlaces, curated, limit = 12) => {
  const seen = new Set();
  const merged = [];
  [...apiPlaces, ...curated].forEach((p) => {
    const key = p.name?.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(p);
    }
  });
  return merged.slice(0, limit);
};

/** Fetch all places for a state */
export const fetchPlacesByState = async (state) => {
  if (!isSouthIndiaState(state)) return [];
  const key = cacheKey(['state', state]);
  const cached = getCached(key);
  if (cached) return cached;

  const curated = filterSouthIndiaPlaces({ state });
  let apiPlaces = [];

  try {
    const search = await apiSearch(`${state} tourist attractions`, 8);
    const locationId = search[0]?.location_id;
    if (locationId) {
      const list = await apiListByLocation(locationId, 8);
      apiPlaces = list.map((item, i) => normalizePlace(item, { state }, i));
    }
  } catch {
    /* use curated */
  }

  const result = mergeWithCurated(apiPlaces, curated, 24);
  setCache(key, result);
  return result;
};

/** Fetch places for a specific district */
export const fetchPlacesByDistrict = async (state, district) => {
  if (!state || !district) return [];
  const key = cacheKey(['district', state, district]);
  const cached = getCached(key);
  if (cached) return cached;

  const curated = filterSouthIndiaPlaces({ state, district });
  let apiPlaces = [];

  try {
    const search = await apiSearch(`${district} ${state} attractions`, 6);
    apiPlaces = search.map((item, i) =>
      normalizePlace(item, { state, district }, i)
    );
    if (search[0]?.location_id) {
      const list = await apiListByLocation(search[0].location_id, 6);
      const extra = list.map((item, i) => normalizePlace(item, { state, district }, i));
      apiPlaces = mergeWithCurated(extra, apiPlaces, 10);
    }
  } catch {
    /* curated fallback */
  }

  const result = mergeWithCurated(apiPlaces, curated, 16);
  setCache(key, result);
  return result;
};

/** Popular places — optional state/district filters */
export const fetchPopularPlaces = async (filters = {}) => {
  const state = typeof filters === 'string' ? '' : filters.state;
  const district = typeof filters === 'string' ? filters : filters.district;
  const legacyQuery = typeof filters === 'string' ? filters : filters.query;

  if (district && state) return fetchPlacesByDistrict(state, district);
  if (state) return fetchPlacesByState(state);

  const key = cacheKey(['popular', state, district, legacyQuery]);
  const cached = getCached(key);
  if (cached) return cached;

  const curated = filterSouthIndiaPlaces({ query: legacyQuery }).sort((a, b) => b.rating - a.rating);
  setCache(key, curated.slice(0, 20));
  return curated.slice(0, 20);
};

/** Section-based lists for homepage */
export const fetchSectionPlaces = async (section, filters = {}) => {
  const key = cacheKey(['section', section, filters.state, filters.district]);
  const cached = getCached(key);
  if (cached) return cached;

  let places = filterSouthIndiaPlaces({ ...filters, section });
  if (filters.state) {
    const statePlaces = await fetchPlacesByState(filters.state);
    places = mergeWithCurated(places, statePlaces, 12);
  }
  setCache(key, places);
  return places;
};

/** Category filter (Discover) */
export const fetchPlacesByCategory = async (category, filters = {}) => {
  const state = filters.state || '';
  const district = filters.district || '';
  const key = cacheKey(['category', category, state, district]);
  const cached = getCached(key);
  if (cached) return cached;

  let base = filterSouthIndiaPlaces({ state, district, category });
  if (district && state) {
    const districtPlaces = await fetchPlacesByDistrict(state, district);
    base = mergeWithCurated(
      districtPlaces.filter((p) => !category || p.category === category),
      base,
      16
    );
  } else if (state) {
    const statePlaces = await fetchPlacesByState(state);
    base = mergeWithCurated(
      statePlaces.filter((p) => !category || p.category === category),
      base,
      20
    );
  }

  setCache(key, base);
  return base;
};

/** Nearby places by coordinates or district */
export const fetchNearbyPlaces = async (lat, lng, district, state) => {
  const key = cacheKey(['nearby', lat, lng, district, state]);
  const cached = getCached(key);
  if (cached) return cached;

  let results = [];
  if (district && state) {
    results = filterSouthIndiaPlaces({ state, district }).slice(0, 6);
  }

  try {
    if (API_KEY && lat && lng) {
      const search = await apiSearch(`attractions near ${district || 'South India'}`, 6);
      const apiResults = search.map((item, i) =>
        normalizePlace(item, { state, district, lat, lng }, i)
      );
      results = mergeWithCurated(apiResults, results, 8);
    }
  } catch {
    /* keep curated */
  }

  if (!results.length) {
    results = filterSouthIndiaPlaces({ state }).slice(0, 6);
  }

  setCache(key, results);
  return results;
};

/** Debounced search — place name, district, category */
export const searchPlaces = async (query, filters = {}) => {
  if (!query?.trim() && !filters.state && !filters.district) {
    return getAllSouthIndiaPlaces().slice(0, 20);
  }

  const key = cacheKey(['search', query, filters.state, filters.district, filters.category]);
  const cached = getCached(key);
  if (cached) return cached;

  let curated = filterSouthIndiaPlaces({
    state: filters.state,
    district: filters.district,
    category: filters.category,
    query,
  });

  if (query?.trim()) {
    try {
      const q = filters.district
        ? `${query} ${filters.district} ${filters.state || 'Tamil Nadu'}`
        : `${query} ${filters.state || 'South India'}`;
      const search = await apiSearch(q, 10);
      const apiPlaces = search.map((item, i) =>
        normalizePlace(item, { state: filters.state, district: filters.district, category: filters.category }, i)
      );
      curated = mergeWithCurated(apiPlaces, curated, 20);
    } catch {
      /* curated only */
    }
  }

  setCache(key, curated);
  return curated;
};

export const getPlaceSearchSuggestions = (query) => getSearchSuggestions(query);

/** Place details with gallery, nearby, tips */
export const fetchPlaceDetails = async (placeId) => {
  const curated = getPlaceById(placeId);
  const key = cacheKey(['details', placeId]);
  const cached = getCached(key);
  if (cached) return cached;

  try {
    if (API_KEY && placeId && !placeId.includes('-')) {
      const { data: d } = await api.get(`/locations/${placeId}/details`, {
        params: { currency: 'USD', lang: 'en_US' },
      });
      const base = normalizePlace(
        {
          location_id: placeId,
          name: d?.name,
          address: d?.address_obj?.address_string,
          rating: d?.rating,
          description: d?.description,
          latitude: d?.latitude,
          longitude: d?.longitude,
          num_reviews: d?.num_reviews,
          photo: d?.photo,
        },
        { state: curated?.state, district: curated?.district },
        0
      );

      const nearby = await fetchNearbyPlaces(
        d?.latitude,
        d?.longitude,
        curated?.district,
        curated?.state
      );

      const detail = {
        ...base,
        ...curated,
        reviews: (d?.reviews || []).slice(0, 5).map((r) => ({
          author: r.user?.username || 'Traveler',
          rating: r.rating,
          text: r.text,
        })),
        restaurants: extractNames(d?.restaurants, curated?.district, 'restaurant'),
        hotels: extractNames(d?.hotels, curated?.district, 'hotel'),
        gallery: [
          d?.photo?.images?.original?.url,
          d?.photo?.images?.large?.url,
          curated?.image,
        ].filter(Boolean),
        nearbyPlaces: nearby.filter((p) => p.id !== placeId),
        travelTips: curated?.travelTips || `Plan 2–3 days in ${curated?.district || base.district} for the best experience.`,
        bestSeason: curated?.bestSeason || 'Oct - Mar',
        routeDetails: `Reach ${curated?.district || base.district} via nearest airport or railway. Local taxis and buses available.`,
      };
      setCache(key, detail);
      return detail;
    }
  } catch {
    /* fall through */
  }

  if (curated) {
    const nearby = await fetchNearbyPlaces(curated.lat, curated.lng, curated.district, curated.state);
    const detail = {
      ...curated,
      lat: curated.lat,
      lng: curated.lng,
      reviews: defaultReviews(),
      restaurants: defaultRestaurants(curated.district),
      hotels: defaultHotels(curated.district),
      gallery: [curated.image, getAllSouthIndiaPlaces()[1]?.image, getAllSouthIndiaPlaces()[2]?.image].filter(Boolean),
      nearbyPlaces: nearby.filter((p) => p.id !== placeId).slice(0, 5),
      travelTips: curated.travelTips,
      routeDetails: `Travel to ${curated.district}, ${curated.state} by train, bus, or flight to the nearest city.`,
    };
    setCache(key, detail);
    return detail;
  }

  return null;
};

const extractNames = (list, district, type) => {
  if (list?.length) return list.slice(0, 5).map((r) => r.name || r);
  return type === 'restaurant'
    ? defaultRestaurants(district)
    : defaultHotels(district);
};

const defaultReviews = () => [
  { author: 'Priya R.', rating: 5, text: 'A must-visit in South India. Stunning views and rich culture.' },
  { author: 'Arjun M.', rating: 4, text: 'Well worth the trip. Go early morning to avoid crowds.' },
  { author: 'Meera K.', rating: 5, text: 'Perfect weekend getaway from the city!' },
];

const defaultRestaurants = (district) => [
  `${district || 'Local'} Spice House`,
  'Coastal Curry Kitchen',
  'Heritage Thali Restaurant',
  'Sunset Café',
];

const defaultHotels = (district) => [
  `${district || 'Hill'} Heritage Resort`,
  'Tea Valley Boutique Stay',
  'Backwater Retreat',
  'City Comfort Inn',
];

// Legacy exports for compatibility
export const searchLocations = async (query) =>
  getSearchSuggestions(query).map((s) => ({
    id: s.id || s.name,
    name: s.name,
    label: s.label || `${s.name}${s.state ? `, ${s.state}` : ''}`,
    location: s.location || s.label,
    state: s.state,
    district: s.district,
  }));

export const fetchNearbyAttractions = fetchNearbyPlaces;

export const getTrendingPlaces = (filters = {}) =>
  filterSouthIndiaPlaces({ ...filters, section: 'trending' });

export const getHiddenGems = (filters = {}) =>
  filterSouthIndiaPlaces({ ...filters, section: 'hidden' });

export const getWeekendGetaways = (filters = {}) =>
  filterSouthIndiaPlaces({ ...filters, section: 'weekend' });

export const getNatureEscapes = (filters = {}) =>
  filterSouthIndiaPlaces({ ...filters, section: 'nature' });

export const getRecommendedTrips = (filters = {}) =>
  filterSouthIndiaPlaces(filters)
    .slice(0, 3)
    .map((p) => ({
      ...p,
      duration: '3–5 days',
      price: p.budget,
      title: `${p.district} Escape`,
    }));

export { SOUTH_INDIA_STATES, DISTRICTS_BY_STATE, getDistrictsForState };
