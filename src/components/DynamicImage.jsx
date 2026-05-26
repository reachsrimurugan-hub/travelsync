import { useState, useEffect, useRef } from 'react';
import { getCachedImages, fetchPexelsImages, getOptimizedUrl, DEFAULT_PLACEHOLDER, getQueryKey } from '../services/imageService';

export const DynamicImage = ({
  placeName = '',
  district = '',
  fallback = '',
  width = 400,
  height = 300,
  alt = '',
  className = '',
  imageIndex = 0,
  style = {},
  ...props
}) => {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  const queryKey = getQueryKey(placeName, district);

  // Lazy loading: Trigger visibility using Intersection Observer
  useEffect(() => {
    if (!containerRef.current) return;

    // Check if IntersectionObserver is supported (fallback to immediate load if not)
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '120px', // Preload when within 120px of viewport
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch and resolve the image asynchronously when visible
  useEffect(() => {
    if (!visible) return;

    let active = true;

    const resolveImage = async () => {
      // 1. Check if cache exists
      const cached = getCachedImages(queryKey);
      if (cached && cached.length > imageIndex) {
        if (active) {
          setSrc(getOptimizedUrl(cached[imageIndex], width, height));
          setLoading(false);
        }
        return;
      }

      // 2. Fetch from Pexels API
      try {
        const urls = await fetchPexelsImages(queryKey);
        if (active) {
          if (urls && urls.length > imageIndex) {
            setSrc(getOptimizedUrl(urls[imageIndex], width, height));
          } else {
            // If API returned some images but not enough for the requested index,
            // fallback to the provided static image or the default placeholder
            setSrc(fallback || DEFAULT_PLACEHOLDER);
          }
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setSrc(fallback || DEFAULT_PLACEHOLDER);
          setLoading(false);
        }
      }
    };

    resolveImage();

    return () => {
      active = false;
    };
  }, [visible, queryKey, imageIndex, fallback, width, height]);

  return (
    <div
      ref={containerRef}
      className={`dynamic-img-container ${loading ? 'loading' : ''} ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {loading && (
        <div
          className="skeleton"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            borderRadius: 'inherit',
          }}
        />
      )}
      {src && (
        <img
          src={src}
          alt={alt || placeName || 'Travel location'}
          onLoad={() => setLoading(false)}
          onError={(e) => {
            e.target.src = fallback || DEFAULT_PLACEHOLDER;
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loading ? 0 : 1,
            transition: 'opacity 0.25s ease-in-out, transform 0.5s ease',
            borderRadius: 'inherit',
          }}
          {...props}
        />
      )}
    </div>
  );
};
export default DynamicImage;
