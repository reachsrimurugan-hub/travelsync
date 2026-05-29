import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar, FiMapPin, FiSun, FiNavigation } from 'react-icons/fi';
import { usePlaceDetails } from '../hooks/usePlaces';
import { useTrips } from '../context/TripContext';
import { formatCurrency } from '../utils/helpers';
import { GridSkeleton } from './LoadingSkeleton';
import { DynamicImage } from './DynamicImage';
import { DEFAULT_PLACEHOLDER } from '../services/imageService';

export const PlaceDetailModal = ({ placeId, onClose, onSelectNearby, onViewInMap }) => {
  const { place, loading } = usePlaceDetails(placeId);
  const { isPlaceSaved, toggleSavePlace } = useTrips();
  const saved = place ? isPlaceSaved(place.id) : false;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!placeId) return null;

  return (
    <AnimatePresence>
      <div className="place-detail-modal">
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="modal-content"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28 }}
        >
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <FiX size={20} />
          </button>
          {loading ? (
            <div style={{ padding: '2rem' }}>
              <GridSkeleton count={1} />
            </div>
          ) : place ? (
            <>
              <div className="modal-gallery">
                <DynamicImage
                  placeName={place.name}
                  district={place.district}
                  imageIndex={0}
                  fallback={place.gallery?.[0] || place.image}
                  className="modal-gallery-main"
                  width={600}
                  height={400}
                />
                <DynamicImage
                  placeName={place.name}
                  district={place.district}
                  imageIndex={1}
                  fallback={place.gallery?.[1] || place.image}
                  width={300}
                  height={200}
                />
                <DynamicImage
                  placeName={place.name}
                  district={place.district}
                  imageIndex={2}
                  fallback={place.gallery?.[2] || DEFAULT_PLACEHOLDER}
                  width={300}
                  height={200}
                />
              </div>
              <div className="modal-body">
                <div className="modal-header-row">
                  <h2>{place.name}</h2>
                  <div className="modal-actions-wrap">
                    <button
                      type="button"
                      className={`btn ${saved ? 'btn-primary' : 'btn-outline'} modal-planner-cta`}
                      onClick={() => toggleSavePlace(place)}
                    >
                      {saved ? '★ Saved' : '☆ Add to Planner'}
                    </button>
                    {onViewInMap && (
                      <button
                        type="button"
                        className="btn btn-primary modal-map-cta"
                        onClick={() => {
                          onViewInMap(place);
                          onClose();
                        }}
                      >
                        <FiNavigation /> View in Map
                      </button>
                    )}
                  </div>
                </div>
                <div className="dest-card-meta">
                  <span className="south-india-badge">{place.district}</span>
                  <span className="south-india-badge">{place.state}</span>
                  <span className="south-india-badge">{place.category}</span>
                </div>
                <p className="dest-card-location">
                  <FiMapPin /> {place.location}
                  <span style={{ marginLeft: '1rem' }}>
                    <FiStar className="text-accent" /> {place.rating}
                  </span>
                </p>
                <p style={{ margin: '1rem 0', color: 'var(--text-secondary)' }}>{place.description}</p>
                
                <div className="modal-info-pills">
                  <div className="info-pill glass-card">
                    <FiSun className="pill-icon" />
                    <div>
                      <span className="pill-label">Best Season</span>
                      <span className="pill-value">{place.bestSeason || place.bestTime}</span>
                    </div>
                  </div>
                  <div className="info-pill glass-card">
                    <span className="pill-icon-currency">₹</span>
                    <div>
                      <span className="pill-label">Estimated Budget</span>
                      <span className="pill-value text-accent">{formatCurrency(place.budget)}</span>
                    </div>
                  </div>
                </div>

                {place.travelTips && (
                  <p className="glass-card modal-travel-tips">
                    <strong style={{ color: 'var(--accent)' }}>Travel tips:</strong> {place.travelTips}
                  </p>
                )}

                <div className="detail-grid">
                  <div className="detail-list glass-card">
                    <h4>Restaurants</h4>
                    <ul>
                      {(place.restaurants || []).map((r) => {
                        const isStr = typeof r === 'string';
                        const name = isStr ? r : r.name;
                        const rating = !isStr && r.rating ? ` (★ ${r.rating})` : '';
                        const vicinity = !isStr && r.vicinity ? ` - ${r.vicinity}` : '';
                        return (
                          <li key={isStr ? r : (r.id || r.name)}>
                            <strong>{name}</strong>{rating}{vicinity}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="detail-list glass-card">
                    <h4>Hotels</h4>
                    <ul>
                      {(place.hotels || []).map((h) => {
                        const isStr = typeof h === 'string';
                        const name = isStr ? h : h.name;
                        const rating = !isStr && h.rating ? ` (★ ${h.rating})` : '';
                        const vicinity = !isStr && h.vicinity ? ` - ${h.vicinity}` : '';
                        return (
                          <li key={isStr ? h : (h.id || h.name)}>
                            <strong>{name}</strong>{rating}{vicinity}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                {place.routeDetails && (
                  <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <strong>Route:</strong> {place.routeDetails}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="places-empty" style={{ padding: '2rem' }}>
              <p>Place not found.</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
