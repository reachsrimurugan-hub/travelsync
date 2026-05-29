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

const API_KEY = import.meta.env.VITE_PLACES_API_KEY;

let googleMapsPromise = null;

const loadGoogleMaps = () => {
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve(window.google.maps);
      return;
    }

    // Check if script is already present
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.includes('maps.googleapis.com/maps/api/js')) {
        const oldOnload = scripts[i].onload;
        scripts[i].onload = () => {
          if (oldOnload) oldOnload();
          resolve(window.google.maps);
        };
        return;
      }
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = (e) => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

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
  const isGoogle = !!item.place_id;

  let photo = null;
  if (isGoogle) {
    if (typeof item.photos?.[0]?.getUrl === 'function') {
      photo = item.photos[0].getUrl({ maxWidth: 600, maxHeight: 400 });
    } else if (item.photos?.[0]?.photo_reference) {
      photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${item.photos[0].photo_reference}&key=${API_KEY}`;
    }
  } else {
    photo = item.photo?.images?.large?.url || item.photo?.images?.medium?.url;
  }

  const address = item.formatted_address || item.vicinity || item.address || item.location_string || item.result_object?.location_string || '';
  const state = meta.state || inferState(address) || 'Tamil Nadu';
  const district = meta.district || inferDistrict(address, state) || meta.district || address.split(',')[0]?.trim();

  let lat = fallback?.lat;
  let lng = fallback?.lng;
  if (isGoogle) {
    if (typeof item.geometry?.location?.lat === 'function') {
      lat = item.geometry.location.lat();
      lng = item.geometry.location.lng();
    } else {
      lat = item.geometry?.location?.lat ?? item.lat ?? fallback?.lat;
      lng = item.geometry?.location?.lng ?? item.lng ?? fallback?.lng;
    }
  } else {
    lat = item.latitude ?? item.lat ?? fallback?.lat;
    lng = item.longitude ?? item.lng ?? fallback?.lng;
  }

  return enrichPlace({
    id: String(item.place_id || item.location_id || item.id || `${meta.district}-${index}`),
    name: item.name || item.title || fallback?.name,
    district: district || fallback?.district,
    state,
    category: meta.category || item.category || fallback?.category || 'nature',
    rating: Number(item.rating) || 4.4 + (index % 5) * 0.1,
    description: item.description || item.snippet || fallback?.description || 'Explore this South Indian destination.',
    image: photo || fallback?.image,
    latitude: lat,
    longitude: lng,
    budget: meta.budget || fallback?.budget || 2000,
    bestSeason: meta.bestSeason || fallback?.bestSeason || 'Oct - Mar',
    numReviews: item.user_ratings_total ?? item.num_reviews ?? 150,
    apiSource: isGoogle ? 'google' : 'rapidapi',
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

const mockApiSearch = (query = '', limit = 12) => {
  const matched = filterSouthIndiaPlaces({ query });
  return matched.slice(0, limit).map((p) => ({
    location_id: p.id,
    name: p.name,
    result_object: {
      location_id: p.id,
      location_string: `${p.district}, ${p.state}`,
    },
    location_string: `${p.district}, ${p.state}`,
    address: `${p.district}, ${p.state}`,
    latitude: p.latitude,
    longitude: p.longitude,
    rating: String(p.rating),
    description: p.description,
    photo: {
      images: {
        large: { url: p.image },
        medium: { url: p.image },
      },
    },
    category: p.category,
    num_reviews: String(p.numReviews || 120),
    budget: p.budget,
    bestSeason: p.bestSeason,
  }));
};

const mockApiListByLocation = (locationId, limit = 12) => {
  const place = getPlaceById(locationId);
  const matchedState = place ? place.state : '';
  const matchedDistrict = place ? place.district : '';

  const related = filterSouthIndiaPlaces({ state: matchedState, district: matchedDistrict }).filter(
    (p) => p.id !== locationId
  );
  const fallbackList = related.length ? related : getAllSouthIndiaPlaces().filter((p) => p.id !== locationId);

  return fallbackList.slice(0, limit).map((p) => ({
    location_id: p.id,
    name: p.name,
    result_object: {
      location_id: p.id,
      location_string: `${p.district}, ${p.state}`,
    },
    location_string: `${p.district}, ${p.state}`,
    address: `${p.district}, ${p.state}`,
    latitude: p.latitude,
    longitude: p.longitude,
    rating: String(p.rating),
    description: p.description,
    photo: {
      images: {
        large: { url: p.image },
        medium: { url: p.image },
      },
    },
    category: p.category,
    num_reviews: String(p.numReviews || 120),
    budget: p.budget,
    bestSeason: p.bestSeason,
  }));
};

const apiSearch = async (query, limit = 12) => {
  try {
    if (!API_KEY) throw new Error('No API key configured');

    const maps = await loadGoogleMaps();
    const dummyDiv = document.createElement('div');
    const service = new maps.places.PlacesService(dummyDiv);

    return new Promise((resolve) => {
      service.textSearch(
        {
          query: `${query} South India`,
        },
        (results, status) => {
          if (status === maps.places.PlacesServiceStatus.OK && results) {
            const filtered = results.filter((item) => {
              const addr = (item.formatted_address || item.name || '').toLowerCase();
              return isSouthIndiaQuery(addr) || isSouthIndiaQuery(query);
            });
            resolve(filtered.slice(0, limit));
          } else {
            console.warn(`Google Places search status: ${status}. Falling back to mock.`);
            resolve(mockApiSearch(query, limit));
          }
        }
      );
    });
  } catch (error) {
    console.warn(`Google Places search failed, falling back to mock. Error: ${error.message}`);
    return mockApiSearch(query, limit);
  }
};

const apiListByLocation = async (locationId, limit = 12) => {
  try {
    if (!API_KEY || !locationId) throw new Error('No API key or location ID');

    if (locationId.includes('-') || !isNaN(locationId)) {
      return mockApiListByLocation(locationId, limit);
    }

    const maps = await loadGoogleMaps();
    const dummyDiv = document.createElement('div');
    const service = new maps.places.PlacesService(dummyDiv);

    const details = await new Promise((resolve, reject) => {
      service.getDetails(
        {
          placeId: locationId,
          fields: ['geometry'],
        },
        (place, status) => {
          if (status === maps.places.PlacesServiceStatus.OK && place) {
            resolve(place);
          } else {
            reject(new Error(`Failed to get details for locationId: ${locationId}, status: ${status}`));
          }
        }
      );
    });

    if (!details.geometry?.location) {
      throw new Error('No geometry location available');
    }

    return new Promise((resolve) => {
      service.nearbySearch(
        {
          location: details.geometry.location,
          radius: 15000,
          type: 'tourist_attraction',
        },
        (results, status) => {
          if (status === maps.places.PlacesServiceStatus.OK && results) {
            resolve(results.slice(0, limit));
          } else {
            console.warn(`Google Nearby search status: ${status}. Falling back to mock.`);
            resolve(mockApiListByLocation(locationId, limit));
          }
        }
      );
    });
  } catch (error) {
    console.warn(`Google list by location failed, falling back to mock. Error: ${error.message}`);
    return mockApiListByLocation(locationId, limit);
  }
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

  const result = mergeWithCurated(apiPlaces, curated, 40);
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

const googleGetDetails = async (placeId) => {
  const maps = await loadGoogleMaps();
  const dummyDiv = document.createElement('div');
  const service = new maps.places.PlacesService(dummyDiv);

  return new Promise((resolve, reject) => {
    service.getDetails(
      {
        placeId,
        fields: ['name', 'rating', 'formatted_address', 'photos', 'reviews', 'url', 'geometry', 'opening_hours'],
      },
      (place, status) => {
        if (status === maps.places.PlacesServiceStatus.OK && place) {
          resolve(place);
        } else {
          reject(new Error(`Google Places getDetails failed with status: ${status}`));
        }
      }
    );
  });
};

/** Place details with gallery, nearby, tips */
const googleNearbySearch = async (location, type, limit = 5) => {
  try {
    const maps = await loadGoogleMaps();
    const dummyDiv = document.createElement('div');
    const service = new maps.places.PlacesService(dummyDiv);

    return new Promise((resolve) => {
      service.nearbySearch(
        {
          location,
          radius: 10000, // 10 km
          type,
        },
        (results, status) => {
          if (status === maps.places.PlacesServiceStatus.OK && results) {
            resolve(
              results.slice(0, limit).map((p) => ({
                id: p.place_id,
                name: p.name,
                rating: p.rating,
                vicinity: p.vicinity || p.formatted_address || '',
              }))
            );
          } else {
            resolve([]);
          }
        }
      );
    });
  } catch (err) {
    console.warn(`Google Nearby search for ${type} failed:`, err);
    return [];
  }
};

export const fetchPlaceDetails = async (placeId) => {
  const curated = getPlaceById(placeId);
  const key = cacheKey(['details', placeId]);
  const cached = getCached(key);
  if (cached) return cached;

  try {
    if (API_KEY && placeId && !placeId.includes('-') && isNaN(placeId)) {
      const details = await googleGetDetails(placeId);

      const photoUrls = (details.photos || []).slice(0, 5).map((p) => {
        if (typeof p.getUrl === 'function') {
          return p.getUrl({ maxWidth: 800, maxHeight: 600 });
        }
        return '';
      }).filter(Boolean);

      const address = details.formatted_address || '';
      const state = inferState(address) || curated?.state || 'Tamil Nadu';
      const district = inferDistrict(address, state) || curated?.district || address.split(',')[0]?.trim();

      const base = normalizePlace(
        {
          place_id: placeId,
          name: details.name,
          formatted_address: details.formatted_address,
          rating: details.rating,
          geometry: details.geometry,
          photos: details.photos,
        },
        { state, district },
        0
      );

      const location = details.geometry?.location;
      let restaurants = [];
      let hotels = [];

      if (location) {
        restaurants = await googleNearbySearch(location, 'restaurant', 5);
        hotels = await googleNearbySearch(location, 'lodging', 5);
      }

      if (!restaurants.length) restaurants = defaultRestaurants(district);
      if (!hotels.length) hotels = defaultHotels(district);

      const nearby = await fetchNearbyPlaces(
        base.latitude,
        base.longitude,
        district,
        state
      );

      const detail = {
        ...base,
        ...curated,
        reviews: (details.reviews || []).slice(0, 5).map((r) => ({
          author: r.author_name || 'Traveler',
          rating: r.rating,
          text: r.text || '',
        })),
        restaurants,
        hotels,
        gallery: photoUrls.length ? photoUrls : [curated?.image].filter(Boolean),
        nearbyPlaces: nearby.filter((p) => p.id !== placeId),
        travelTips: curated?.travelTips || `Plan 2–3 days in ${district} for the best experience.`,
        bestSeason: curated?.bestSeason || 'Oct - Mar',
        routeDetails: `Reach ${district} via nearest airport or railway. Local taxis and buses available.`,
        phone: details.formatted_phone_number || 'N/A',
        website: details.url || '',
        openingHours: details.opening_hours?.weekday_text || [],
      };
      setCache(key, detail);
      return detail;
    }
  } catch (error) {
    console.warn(`Google fetchPlaceDetails failed, falling back to curated. Error: ${error.message}`);
  }

  if (curated) {
    let restaurants = [];
    let hotels = [];

    if (API_KEY && curated.lat && curated.lng) {
      try {
        const maps = await loadGoogleMaps();
        const loc = new maps.LatLng(curated.lat, curated.lng);
        restaurants = await googleNearbySearch(loc, 'restaurant', 5);
        hotels = await googleNearbySearch(loc, 'lodging', 5);
      } catch (e) {
        console.warn('Google nearby search for curated failed:', e);
      }
    }

    if (!restaurants.length) restaurants = defaultRestaurants(curated.district);
    if (!hotels.length) hotels = defaultHotels(curated.district);

    const nearby = await fetchNearbyPlaces(curated.lat, curated.lng, curated.district, curated.state);
    const detail = {
      ...curated,
      lat: curated.lat,
      lng: curated.lng,
      reviews: defaultReviews(),
      restaurants,
      hotels,
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

export const fetchWeatherForLocation = async (lat, lng) => {
  if (!lat || !lng) return null;

  // 1. Try Google Weather API
  if (API_KEY) {
    try {
      const { data } = await axios.get('https://weather.googleapis.com/v1/currentConditions:lookup', {
        params: {
          key: API_KEY,
          'location.latitude': lat,
          'location.longitude': lng,
        },
        timeout: 8000,
      });
      if (data) {
        return {
          temperature: data.temperature || { degrees: 24, unit: 'CELSIUS' },
          weatherCondition: data.weatherCondition || { type: 'CLEAR', description: { text: 'Clear' } },
          relativeHumidity: data.relativeHumidity ?? 60,
          cloudCover: data.cloudCover ?? 10,
          precipitation: data.precipitation || { probability: { percent: 15 } }
        };
      }
    } catch (error) {
      console.warn('Google Weather API failed, falling back to Open-Meteo:', error.message);
    }
  }

  // 2. Try Open-Meteo API
  try {
    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lng,
        current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,cloud_cover',
      },
      timeout: 5000,
    });
    if (data?.current) {
      const code = data.current.weather_code ?? 0;
      let description = 'Clear';
      let type = 'CLEAR';
      if (code === 0) { description = 'Clear Sky'; type = 'CLEAR'; }
      else if (code >= 1 && code <= 3) { description = 'Partly Cloudy'; type = 'PARTLY_CLOUDY'; }
      else if (code >= 45 && code <= 48) { description = 'Foggy'; type = 'CLOUDY'; }
      else if (code >= 51 && code <= 55) { description = 'Drizzle'; type = 'LIGHT_RAIN'; }
      else if (code >= 61 && code <= 65) { description = 'Rainy'; type = 'RAIN'; }
      else if (code >= 71 && code <= 77) { description = 'Snowy'; type = 'SNOW'; }
      else if (code >= 80 && code <= 82) { description = 'Rain Showers'; type = 'RAIN_SHOWERS'; }
      else if (code >= 95 && code <= 99) { description = 'Thunderstorm'; type = 'THUNDERSTORM'; }

      return {
        temperature: { degrees: data.current.temperature_2m ?? 24, unit: 'CELSIUS' },
        weatherCondition: { type, description: { text: description } },
        relativeHumidity: data.current.relative_humidity_2m ?? 60,
        cloudCover: data.current.cloud_cover ?? 10,
        precipitation: { probability: { percent: data.current.precipitation > 0 ? 80 : 15 } }
      };
    }
  } catch (err) {
    console.warn('Open-Meteo weather request failed:', err.message);
  }

  // 3. Mock Fallback
  return {
    temperature: { degrees: 26, unit: 'CELSIUS' },
    weatherCondition: { type: 'CLEAR', description: { text: 'Pleasant' } },
    relativeHumidity: 55,
    cloudCover: 12,
    precipitation: { probability: { percent: 10 } }
  };
};

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
