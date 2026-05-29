import { useEffect, useState, useMemo, useRef, useId, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiSearch, FiMapPin, FiNavigation, FiX } from 'react-icons/fi';
import { ensureMapplsReady } from '../services/mapplsInstance';
import { getMapplsToken, fetchRoute, geocodeLocation } from '../services/mapService';
import { parseLocationCoords } from '../utils/helpers';
import { isSouthIndiaState, getSearchSuggestions } from '../utils/southIndiaData';
import { getQueryKey, getCachedImages, getOptimizedUrl, DEFAULT_PLACEHOLDER } from '../services/imageService';

const MAPPLS_TOKEN = getMapplsToken();
const SOUTH_INDIA_VIEW = { center: [80.2707, 13.0827], zoom: 4.8 }; // Default view centered on Chennai/South India (lng, lat)
const BENGALURU_COORDS = { lat: 12.9716, lng: 77.5946 }; // Reference starting coords

const isValidCoord = (lat, lng) =>
  Number.isFinite(lat) &&
  Number.isFinite(lng) &&
  lat >= -90.0 &&
  lat <= 90.0 &&
  lng >= -180.0 &&
  lng <= 180.0;

const computeView = (markers, center, zoom) => {
  if (center?.latitude != null && center?.longitude != null) {
    return { center: [center.longitude, center.latitude], zoom };
  }
  return SOUTH_INDIA_VIEW;
};

// Haversine formula to compute distance in km
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

export const MapView = ({
  places = [],
  center,
  zoom = 10,
  height = '100%',
  showRoute = false,
  onMarkerClick,
  selectedId = null,
  showSearchBar = false,
  onPlaceSelect,
}) => {
  const reactId = useId();
  const mapContainerId = useMemo(
    () => `mappls-map-${reactId.replace(/:/g, '')}`,
    [reactId]
  );

  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const routeLayerRef = useRef(null);
  const mapplsApiRef = useRef(null);
  const searchContainerRef = useRef(null);
  const prevPlacesLength = useRef(places.length);

  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(zoom || 4.8);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResultPlace, setSearchResultPlace] = useState(null);

  // Nearby attractions & Route State
  const [nearbyAttractions, setNearbyAttractions] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [userLocation, setUserLocation] = useState(BENGALURU_COORDS);

  // Clear search result marker when list of places changes
  useEffect(() => {
    setSearchResultPlace(null);
  }, [places]);

  const markers = useMemo(
    () => {
      let list = (places || [])
        .map((p) => {
          const { lat, lng } = parseLocationCoords(p);
          const distance = userLocation
            ? calculateHaversineDistance(userLocation.lat, userLocation.lng, lat, lng)
            : null;
          return { lat, lng, id: p.id, label: p.name, place: p, distance };
        });

      if (searchResultPlace) {
        const { lat, lng } = parseLocationCoords(searchResultPlace);
        const distance = userLocation
          ? calculateHaversineDistance(userLocation.lat, userLocation.lng, lat, lng)
          : null;
        if (!list.some((m) => m.id === searchResultPlace.id)) {
          list.push({
            lat,
            lng,
            id: searchResultPlace.id,
            label: searchResultPlace.name,
            place: searchResultPlace,
            distance,
          });
        }
      }

      return list.filter((m) => isValidCoord(m.lat, m.lng));
    },
    [places, userLocation, searchResultPlace]
  );

  // Custom Zoom-based Clustering logic
  const clusteredMarkers = useMemo(() => {
    // Zoom <= 6.5: Group markers by State
    if (currentZoom <= 6.5 && markers.length > 5) {
      const stateMap = {};
      markers.forEach((m) => {
        const stateName = m.place.state || 'South India';
        if (!stateMap[stateName]) stateMap[stateName] = [];
        stateMap[stateName].push(m);
      });

      return Object.entries(stateMap).map(([stateName, list]) => {
        const avgLat = list.reduce((sum, item) => sum + item.lat, 0) / list.length;
        const avgLng = list.reduce((sum, item) => sum + item.lng, 0) / list.length;
        return {
          id: `cluster-state-${stateName.replace(/\s+/g, '-')}`,
          lat: avgLat,
          lng: avgLng,
          label: `${stateName} (${list.length} places)`,
          isCluster: true,
          clusterType: 'state',
          stateName,
          count: list.length,
        };
      });
    }

    // Zoom between 6.5 and 8.5: Group markers by District
    if (currentZoom <= 8.5 && markers.length > 5) {
      const districtMap = {};
      markers.forEach((m) => {
        const districtName = m.place.district || 'District';
        if (!districtMap[districtName]) districtMap[districtName] = [];
        districtMap[districtName].push(m);
      });

      return Object.entries(districtMap).map(([districtName, list]) => {
        const avgLat = list.reduce((sum, item) => sum + item.lat, 0) / list.length;
        const avgLng = list.reduce((sum, item) => sum + item.lng, 0) / list.length;
        return {
          id: `cluster-district-${districtName.replace(/\s+/g, '-')}`,
          lat: avgLat,
          lng: avgLng,
          label: `${districtName} (${list.length} places)`,
          isCluster: true,
          clusterType: 'district',
          districtName,
          stateName: list[0]?.place.state,
          count: list.length,
        };
      });
    }

    // Zoom > 8.5: Show all individual places
    return markers;
  }, [markers, currentZoom]);

  const initialView = useMemo(
    () => computeView(markers, center, zoom),
    [markers, center, zoom]
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch route and nearby attractions details when selectedId changes
  useEffect(() => {
    if (!selectedId || !places.length) {
      setNearbyAttractions([]);
      setRouteInfo(null);
      return;
    }
    const currentPlace = places.find((p) => p.id === selectedId);
    if (!currentPlace) return;

    const nearby = places
      .filter((p) => p.id !== selectedId && p.district === currentPlace.district)
      .slice(0, 3);
    setNearbyAttractions(nearby);

    if (nearby.length > 0) {
      const waypoints = [currentPlace, ...nearby].map((p) => {
        const { lat, lng } = parseLocationCoords(p);
        return { lat, lng };
      });

      let totalDistance = 0;
      for (let i = 0; i < waypoints.length - 1; i++) {
        totalDistance += calculateHaversineDistance(
          waypoints[i].lat,
          waypoints[i].lng,
          waypoints[i + 1].lat,
          waypoints[i + 1].lng
        );
      }
      const estTimeMins = Math.round((totalDistance / 50) * 60) + 15; // 50km/h average + pad time
      setRouteInfo({
        distance: totalDistance,
        duration: estTimeMins,
        name: `${currentPlace.name} Tour Route`,
      });
    } else {
      setRouteInfo(null);
    }
  }, [selectedId, places]);

  // Centering/Zooming on the selectedId marker when it changes
  useEffect(() => {
    if (!mapReady || !selectedId || !mapRef.current) return;
    const selectedMarker = markers.find((m) => m.id === selectedId);
    if (selectedMarker) {
      const map = mapRef.current;
      map.flyTo?.({
        center: [selectedMarker.lng, selectedMarker.lat],
        zoom: 12,
        speed: 1.2,
      }) || map.setCenter?.([selectedMarker.lng, selectedMarker.lat]);
    }
  }, [selectedId, mapReady, markers]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => {
      try {
        m.remove?.();
      } catch {
        /* ignore */
      }
    });
    markersRef.current = [];
  }, []);

  const clearRoute = useCallback(() => {
    if (routeLayerRef.current && mapplsApiRef.current) {
      try {
        mapplsApiRef.current.removeLayer(routeLayerRef.current);
      } catch {
        /* ignore */
      }
      routeLayerRef.current = null;
    }
  }, []);

  const fitToMarkers = useCallback(() => {
    const map = mapRef.current;
    const api = mapplsApiRef.current;
    if (!map || markers.length === 0) return;

    if (markers.length === 1) {
      map.setCenter?.([markers[0].lng, markers[0].lat]);
      map.setZoom?.(11);
      return;
    }

    try {
      api?.fitBounds?.({
        map,
        bounds: markers.map((m) => [m.lng, m.lat]),
        padding: 60,
      });
    } catch {
      const view = computeView(markers, null, zoom);
      map.setCenter?.(view.center);
      map.setZoom?.(view.zoom);
    }
  }, [markers, zoom]);

  const renderMarkers = useCallback(() => {
    const map = mapRef.current;
    const api = mapplsApiRef.current;
    if (!map || !api) return;

    clearMarkers();

    clusteredMarkers.forEach((m) => {
      const selected = selectedId === m.id;
      let popupHtml = '';

      if (m.isCluster) {
        popupHtml = `
          <div class="map-popup-cluster">
            <strong>${m.label}</strong>
            <p>Tap cluster to expand and zoom in</p>
          </div>
        `;
      } else {
        const distanceText = m.distance
          ? `<span class="map-popup-distance">🚗 ${m.distance} km from you</span>`
          : '';
        const budgetText = m.place.budget
          ? `<span class="map-popup-budget">💰 ₹${m.place.budget.toLocaleString()}</span>`
          : '';
        const queryKey = getQueryKey(m.place.name, m.place.district);
        const cached = getCachedImages(queryKey);
        const imgUrl = (cached && cached.length > 0)
          ? getOptimizedUrl(cached[0], 240, 180)
          : (m.place.image || DEFAULT_PLACEHOLDER);

        popupHtml = `
          <div class="map-popup-card">
            <img src="${imgUrl}" class="map-popup-img" alt="${m.label}" />
            <div class="map-popup-content">
              <h3>${m.label}</h3>
              <p class="map-popup-location">📍 ${m.place.district}, ${m.place.state}</p>
              <p class="map-popup-desc">${m.place.description || ''}</p>
              <div class="map-popup-meta">
                <span class="map-popup-rating">⭐ ${m.place.rating}</span>
                ${budgetText}
                ${distanceText}
              </div>
            </div>
          </div>
        `;
      }

      const markerOptions = {
        map,
        position: { lat: m.lat, lng: m.lng },
        width: m.isCluster ? 40 : 36,
        height: m.isCluster ? 40 : 42,
        popupHtml,
        popupOptions: {
          openPopup: selected && !m.isCluster,
          autoClose: true,
          offset: { bottom: [0, -36] },
        },
      };

      const marker = api.Marker(markerOptions);

      // Handle marker hover popup card (tooltip)
      const element = marker.getElement?.();
      if (element) {
        element.style.cursor = 'pointer';
        element.addEventListener('mouseenter', () => {
          if (!m.isCluster) {
            try {
              marker.openPopup?.();
            } catch {
              /* ignore */
            }
          }
        });
        element.addEventListener('mouseleave', () => {
          if (!m.isCluster && selectedId !== m.id) {
            try {
              marker.closePopup?.();
            } catch {
              /* ignore */
            }
          }
        });
      }

      const handleMarkerClick = () => {
        if (m.isCluster) {
          const nextZoom = m.clusterType === 'state' ? 7.5 : 10;
          map.flyTo?.({
            center: [m.lng, m.lat], // mapbox center is [lng, lat]
            zoom: nextZoom,
            speed: 1.2,
          }) || map.setCenter?.([m.lng, m.lat]);
          if (!map.flyTo) {
            map.setZoom?.(nextZoom);
          }
        } else {
          onMarkerClick?.(m.place);
        }
      };

      if (marker?.addListener) {
        marker.addListener('click', handleMarkerClick);
      } else if (marker?.on) {
        marker.on('click', handleMarkerClick);
      }

      if (selected && !m.isCluster) {
        try {
          marker.setZIndex?.(999);
          // Small timeout to ensure popup opening works correctly
          setTimeout(() => {
            try {
              marker.openPopup?.();
            } catch {
              /* ignore */
            }
          }, 150);
        } catch {
          /* ignore */
        }
      }

      markersRef.current.push(marker);
    });

    if (prevPlacesLength.current !== places.length) {
      fitToMarkers();
      prevPlacesLength.current = places.length;
    }
  }, [clusteredMarkers, selectedId, onMarkerClick, clearMarkers, fitToMarkers, places.length]);

  const renderRoute = useCallback(async () => {
    const map = mapRef.current;
    const api = mapplsApiRef.current;
    if (!map || !api || !showRoute || !MAPPLS_TOKEN) {
      clearRoute();
      return;
    }

    let routeWaypoints = [];
    if (selectedId && nearbyAttractions.length > 0) {
      const currentPlace = places.find((p) => p.id === selectedId);
      if (currentPlace) {
        routeWaypoints = [currentPlace, ...nearbyAttractions];
      }
    } else if (markers.length >= 2) {
      routeWaypoints = markers.map((m) => m.place);
    }

    if (routeWaypoints.length < 2) {
      clearRoute();
      return;
    }

    const geometry = await fetchRoute(routeWaypoints.map((w) => parseLocationCoords(w)));
    clearRoute();
    if (!geometry) return;

    try {
      routeLayerRef.current = api.Polyline({
        map,
        paths: geometry,
        strokeColor: '#ff6b35',
        strokeWeight: 5,
        strokeOpacity: 0.9,
        fitbounds: false,
      });
    } catch {
      try {
        routeLayerRef.current = api.addGeoJson({
          map,
          geojson: { type: 'Feature', geometry },
          fitbounds: false,
          style: { strokeColor: '#ff6b35', strokeWeight: 5 },
        });
      } catch {
        /* route optional */
      }
    }
  }, [markers, showRoute, clearRoute, selectedId, nearbyAttractions, places]);

  // Autocomplete change handler
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim()) {
      const suggestionsList = getSearchSuggestions(val);
      setSuggestions(suggestionsList);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  // Suggestion click handler
  const handleSelectSuggestion = (sug) => {
    setShowDropdown(false);
    setSearchQuery(sug.name || sug.label || '');

    if (sug.type === 'place') {
      setSearchResultPlace(sug);
      const lat = sug.lat || sug.latitude;
      const lng = sug.lng || sug.longitude;
      mapRef.current?.flyTo?.({
        center: [lng, lat],
        zoom: 12,
        speed: 1.2,
      }) || mapRef.current?.setCenter?.([lng, lat]);
      onMarkerClick?.(sug);
      onPlaceSelect?.(sug);
    } else if (sug.type === 'district') {
      const districtPlaces = places.filter((p) => p.district === sug.name);
      if (districtPlaces.length > 0) {
        const avgLat = districtPlaces.reduce((sum, p) => sum + (p.latitude || p.lat), 0) / districtPlaces.length;
        const avgLng = districtPlaces.reduce((sum, p) => sum + (p.longitude || p.lng), 0) / districtPlaces.length;
        mapRef.current?.flyTo?.({
          center: [avgLng, avgLat],
          zoom: 9.5,
          speed: 1.2,
        }) || mapRef.current?.setCenter?.([avgLng, avgLat]);
      }
      onPlaceSelect?.({ district: sug.name, state: sug.state });
    }
  };

  // Explicit form submit / Geocoder
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowDropdown(false);

    try {
      const result = await geocodeLocation(searchQuery);

      // Check if it's in our curated list
      const matchedCurated = places.find((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchedCurated) {
        setSearchResultPlace(matchedCurated);
        const lat = matchedCurated.latitude || matchedCurated.lat;
        const lng = matchedCurated.longitude || matchedCurated.lng;
        mapRef.current?.flyTo?.({
          center: [lng, lat],
          zoom: 12,
          speed: 1.2,
        }) || mapRef.current?.setCenter?.([lng, lat]);
        onMarkerClick?.(matchedCurated);
        onPlaceSelect?.(matchedCurated);
      } else {
        // Construct dynamic marker for discovered place
        const placeParts = result.place ? result.place.split(',') : [];
        const detectedState = placeParts.length > 1 ? placeParts[placeParts.length - 2].trim() : 'India';

        const newDynamicPlace = {
          id: `dynamic-${Date.now()}`,
          name: result.place || searchQuery,
          district: searchQuery,
          state: detectedState,
          category: 'nature',
          rating: 4.5,
          lat: result.lat,
          lng: result.lng,
          latitude: result.lat,
          longitude: result.lng,
          description: `Discovered location near: ${result.lat.toFixed(4)}, ${result.lng.toFixed(4)}`,
          image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80',
          budget: 1500,
          bestSeason: 'Oct - Mar',
        };

        setSearchResultPlace(newDynamicPlace);

        mapRef.current?.flyTo?.({
          center: [result.lng, result.lat],
          zoom: 11,
          speed: 1.2,
        }) || mapRef.current?.setCenter?.([result.lng, result.lat]);

        onPlaceSelect?.(newDynamicPlace);
        onMarkerClick?.(newDynamicPlace);
      }
    } catch (err) {
      toast.error('Failed to find location. Please try a different query.');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!MAPPLS_TOKEN) return undefined;

    let cancelled = false;

    ensureMapplsReady()
      .then((api) => {
        if (cancelled) return;
        mapplsApiRef.current = api;

        const map = api.Map({
          id: mapContainerId,
          properties: {
            center: initialView.center,
            zoom: initialView.zoom,
            minZoom: 3.5,
            maxZoom: 15,
            maxBounds: [
              [67.0, 6.0],
              [98.0, 37.0],
            ],
            zoomControl: true,
            scrollWheel: true,
            scrollZoom: true,
            fullscreenControl: false,
            geolocation: false,
          },
        });

        mapRef.current = map;

        const onLoad = () => {
          if (!cancelled) {
            setMapReady(true);
          }
        };

        if (map.on) {
          map.on('load', onLoad);
          map.on('zoomend', () => {
            if (!cancelled && map.getZoom) {
              setCurrentZoom(map.getZoom());
            }
          });
        } else if (map.addListener) {
          map.addListener('load', onLoad);
          map.addListener('zoomend', () => {
            if (!cancelled && map.getZoom) {
              setCurrentZoom(map.getZoom());
            }
          });
        } else {
          setTimeout(onLoad, 600);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setMapError(err.message || 'Failed to load Mappls map');
        }
      });

    return () => {
      cancelled = true;
      setMapReady(false);
      clearMarkers();
      clearRoute();
      try {
        mapRef.current?.remove?.();
      } catch {
        /* ignore */
      }
      mapRef.current = null;
    };
  }, [mapContainerId, clearMarkers, clearRoute]);

  useEffect(() => {
    if (!mapReady) return;
    renderMarkers();
    renderRoute();
  }, [mapReady, renderMarkers, renderRoute]);

  if (!MAPPLS_TOKEN) {
    return (
      <div
        className="map-container map-container--empty"
        style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Add <code>VITE_MAPPLS_API_KEY</code> to <code>.env</code> to enable Mappls maps.
          <br />
          <small>{markers.length} destination(s) ready to plot</small>
        </p>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="map-container map-container--empty" style={{ height }}>
        <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          {mapError}
          <br />
          <small>
            Verify your Mappls key at{' '}
            <a href="https://apis.mappls.com/console/" target="_blank" rel="noreferrer">
              apis.mappls.com/console
            </a>
          </small>
        </p>
      </div>
    );
  }

  return (
    <div className="map-container mappls-map-wrap" style={{ height }}>
      {/* Floating Glassmorphism Search Bar */}
      {showSearchBar && (
        <div className="map-floating-search-wrap" ref={searchContainerRef}>
          <form className="map-floating-search-bar" onSubmit={handleSearchSubmit}>
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search South India (Ooty, Munnar...)"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.trim() && setShowDropdown(true)}
            />
            {isSearching ? (
              <div className="search-spinner-tiny" />
            ) : searchQuery ? (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions([]);
                  setShowDropdown(false);
                }}
              >
                <FiX size={16} />
              </button>
            ) : null}
          </form>

          {/* Autocomplete Suggestions */}
          {showDropdown && suggestions.length > 0 && (
            <div className="map-search-suggestions">
              {suggestions.map((sug, idx) => (
                <button
                  key={`${sug.id || idx}-${sug.name}`}
                  type="button"
                  className="suggestion-item"
                  onClick={() => handleSelectSuggestion(sug)}
                >
                  <FiMapPin className="item-icon" />
                  <div className="suggestion-text">
                    <span className="suggestion-title">{sug.name}</span>
                    <span className="suggestion-subtitle">
                      {sug.type === 'place'
                        ? `${sug.district}, ${sug.state}`
                        : `${sug.state} (District)`}
                    </span>
                  </div>
                  <span className="suggestion-tag">{sug.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Map Canvas */}
      <div id={mapContainerId} className="mappls-map-canvas" style={{ width: '100%', height: '100%' }} />

      {/* Dark overlay gradients for readability */}
      <div className="map-gradient-overlay-bottom" />
      <div className="map-gradient-overlay-top" />

      {/* Loading Skeleton */}
      {!mapReady && (
        <div className="map-loading-overlay">
          <div className="map-loading-skeleton" />
          <div className="map-loading-text">Loading South India Map...</div>
        </div>
      )}

      {/* Map Legend & Stats */}
      {mapReady && (
        <div className="map-legend">
          <span>{markers.length} places · South India Bounds Enabled</span>
        </div>
      )}

      {/* Route Info Overlay Card */}
      {mapReady && routeInfo && (
        <div className="map-route-info-card glass-card">
          <div className="route-card-header">
            <FiNavigation className="route-icon" />
            <div>
              <h4>{routeInfo.name}</h4>
              <p>Driving route connecting nearby attractions</p>
            </div>
          </div>
          <div className="route-card-metrics">
            <div className="metric">
              <span className="metric-label">Distance</span>
              <span className="metric-val">{routeInfo.distance} km</span>
            </div>
            <div className="metric">
              <span className="metric-label">Est. Time</span>
              <span className="metric-val">{routeInfo.duration} mins</span>
            </div>
          </div>
          {nearbyAttractions.length > 0 && (
            <div className="route-card-stops">
              <h5>Stops:</h5>
              <ul>
                {nearbyAttractions.map((att) => (
                  <li key={att.id}>• {att.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
