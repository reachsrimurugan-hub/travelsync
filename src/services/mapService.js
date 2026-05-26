import axios from 'axios';

const MAPPLS_TOKEN =
  import.meta.env.VITE_MAPPLS_API_KEY || import.meta.env.VITE_MAPBOX_TOKEN;

/** South India default when geocoding fails */
const SOUTH_INDIA_CENTER = { lat: 11.5, lng: 77.5, place: 'South India' };

export const getMapplsToken = () => MAPPLS_TOKEN;

/** @deprecated Use getMapplsToken */
export const getMapboxToken = getMapplsToken;

export const geocodeLocation = async (query) => {
  if (!MAPPLS_TOKEN || !query?.trim()) return { ...SOUTH_INDIA_CENTER, place: query };

  try {
    const { data } = await axios.get('https://search.mappls.com/search/places/textsearch/json', {
      params: {
        query: `${query.trim()}, India`,
        region: 'IND',
        access_token: MAPPLS_TOKEN,
      },
      timeout: 12000,
    });

    const hit =
      data?.suggestedLocations?.[0] ||
      data?.userAddedLocations?.[0] ||
      (Array.isArray(data?.copResults) ? data.copResults[0] : data?.copResults);

    const lat = parseFloat(hit?.latitude ?? hit?.lat);
    const lng = parseFloat(hit?.longitude ?? hit?.lng);

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return {
        lat,
        lng,
        place: hit.placeName || hit.placeAddress || hit.formattedAddress || query,
      };
    }

    const { data: geoData } = await axios.get('https://search.mappls.com/search/address/geocode', {
      params: {
        address: `${query.trim()}, India`,
        access_token: MAPPLS_TOKEN,
      },
      timeout: 12000,
    });

    const cop = Array.isArray(geoData?.copResults)
      ? geoData.copResults[0]
      : geoData?.copResults;
    const elat = parseFloat(cop?.latitude ?? cop?.lat);
    const elng = parseFloat(cop?.longitude ?? cop?.lng);
    if (Number.isFinite(elat) && Number.isFinite(elng)) {
      return { lat: elat, lng: elng, place: cop?.formattedAddress || query };
    }
  } catch {
    /* fall through */
  }

  return { ...SOUTH_INDIA_CENTER, place: query };
};

export const fetchRoute = async (waypoints) => {
  if (!MAPPLS_TOKEN || waypoints.length < 2) return null;

  try {
    const coords = waypoints.map((w) => `${w.lng},${w.lat}`).join(';');
    const { data } = await axios.get(
      `https://route.mappls.com/route/direction/route_adv/driving/${coords}`,
      {
        params: {
          geometries: 'geojson',
          steps: false,
          access_token: MAPPLS_TOKEN,
        },
        timeout: 15000,
      }
    );
    return data?.routes?.[0]?.geometry || null;
  } catch {
    return null;
  }
};

export const buildMarkersFromPlaces = (places) =>
  (places || []).map((p, i) => ({
    id: p.id || String(i),
    lat: p.latitude ?? p.lat,
    lng: p.longitude ?? p.lng,
    label: p.name,
  }));

export const defaultMapCenter = SOUTH_INDIA_CENTER;
