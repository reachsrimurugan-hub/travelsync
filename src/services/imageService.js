const PEXELS_API_KEY = 'wpQu9BnURJxiZBDYt7bwwfBZEJjm7McwGXIeOgQBECtJBlZBdNSaA5A8';
const CACHE_PREFIX = 'ts_img_cache_';
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days cache

// High-quality travel default placeholder
export const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80';

// In-memory cache to avoid reading from localStorage repeatedly
const memoryCache = new Map();

// Track in-flight Pexels API requests to prevent concurrent identical queries
const pendingRequests = new Map();

/**
 * Normalizes query string based on place name and district
 */
export const getQueryKey = (placeName, district) => {
  const namePart = (placeName || '').trim().toLowerCase();
  const districtPart = (district || '').trim().toLowerCase();
  
  if (namePart && districtPart && !namePart.includes(districtPart)) {
    return `${namePart} ${districtPart}`;
  }
  return namePart || districtPart || 'south india';
};

/**
 * Reads cached image URLs from localStorage/memory
 */
export const getCachedImages = (queryKey) => {
  if (!queryKey) return null;
  const normalizedKey = queryKey.trim().toLowerCase();
  if (memoryCache.has(normalizedKey)) {
    return memoryCache.get(normalizedKey);
  }

  try {
    const dataStr = localStorage.getItem(`${CACHE_PREFIX}${normalizedKey}`);
    if (dataStr) {
      const { urls, timestamp } = JSON.parse(dataStr);
      if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
        memoryCache.set(normalizedKey, urls);
        return urls;
      }
    }
  } catch (e) {
    console.warn('Failed to read image cache', e);
  }
  return null;
};

/**
 * Saves image URLs to cache
 */
export const setCachedImages = (queryKey, urls) => {
  if (!queryKey) return;
  const normalizedKey = queryKey.trim().toLowerCase();
  memoryCache.set(normalizedKey, urls);
  try {
    localStorage.setItem(
      `${CACHE_PREFIX}${normalizedKey}`,
      JSON.stringify({ urls, timestamp: Date.now() })
    );
  } catch (e) {
    console.warn('Failed to write image cache', e);
  }
};

/**
 * Optimizes a Pexels image URL by replacing or appending resizing parameters.
 * Pexels URLs support standard Imgix query parameters.
 */
export const getOptimizedUrl = (url, width, height) => {
  if (!url) return DEFAULT_PLACEHOLDER;
  
  // Only modify pexels image links
  if (!url.includes('images.pexels.com')) {
    // If it's an Unsplash fallback, we can also optimize it if it has w/q params
    if (url.includes('images.unsplash.com')) {
      try {
        const urlObj = new URL(url);
        urlObj.searchParams.set('auto', 'format');
        urlObj.searchParams.set('fit', 'crop');
        if (width) urlObj.searchParams.set('w', width.toString());
        if (height) urlObj.searchParams.set('h', height.toString());
        return urlObj.toString();
      } catch {
        return url;
      }
    }
    return url;
  }

  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('auto', 'compress');
    urlObj.searchParams.set('cs', 'tinysrgb');
    urlObj.searchParams.set('fit', 'crop');
    if (width) urlObj.searchParams.set('w', width.toString());
    if (height) urlObj.searchParams.set('h', height.toString());
    return urlObj.toString();
  } catch (e) {
    return url;
  }
};

/**
 * Fetches image URLs dynamically from Pexels API for a query
 */
export const fetchPexelsImages = async (queryKey) => {
  if (!queryKey) return [];
  
  const normalizedKey = queryKey.trim().toLowerCase();

  // Double check cache
  const cached = getCachedImages(normalizedKey);
  if (cached) return cached;

  // If there's already an active request for this key, return its promise
  if (pendingRequests.has(normalizedKey)) {
    return pendingRequests.get(normalizedKey);
  }

  const promise = (async () => {
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(normalizedKey)}&per_page=2`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Extract the raw large URL. We'll add custom optimization parameters later
      const urls = (data.photos || []).map(p => p.src.large);

      setCachedImages(normalizedKey, urls);
      return urls;
    } catch (e) {
      console.error('Error fetching from Pexels API:', e);
      return [];
    } finally {
      // Remove from pending map once resolved or rejected
      pendingRequests.delete(normalizedKey);
    }
  })();

  pendingRequests.set(normalizedKey, promise);
  return promise;
};
