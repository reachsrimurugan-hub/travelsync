import { motion } from 'framer-motion';
import { FiMapPin, FiStar } from 'react-icons/fi';
import { useTrips } from '../context/TripContext';
import toast from 'react-hot-toast';
import { DynamicImage } from './DynamicImage';

export const DestinationCard = ({ place, onViewDetails, index = 0, exploreLabel = 'Explore' }) => {
  const { isPlaceSaved, toggleSavePlace } = useTrips();
  const saved = isPlaceSaved(place.id);

  const handleBookmark = async (e) => {
    e.stopPropagation();
    await toggleSavePlace(place);
    toast.success(saved ? 'Removed from saved' : 'Saved to your trips');
  };

  return (
    <motion.article
      className="dest-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="dest-card-image">
        <DynamicImage
          placeName={place.name}
          district={place.district}
          fallback={place.image}
          width={400}
          height={300}
          alt={place.name}
        />
        <span className="dest-card-badge">
          <FiStar /> {place.rating}
        </span>
        {place.category && (
          <span className="dest-card-badge" style={{ left: '0.75rem', right: 'auto' }}>
            {place.category}
          </span>
        )}
      </div>
      <div className="dest-card-body">
        <h3>{place.name}</h3>
        <div className="dest-card-meta">
          {place.district && <span className="south-india-badge">{place.district}</span>}
          {place.state && <span className="south-india-badge">{place.state}</span>}
        </div>
        <p className="dest-card-location">
          <FiMapPin /> {place.location || `${place.district}, ${place.state}`}
        </p>
        <p className="dest-card-desc">{place.description}</p>
        <div className="dest-card-footer">
          <span className="dest-card-weather">{place.weather || 'Pleasant'}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className={`bookmark-btn ${saved ? 'active' : ''}`}
              onClick={handleBookmark}
              aria-label={saved ? 'Unsave' : 'Save'}
            >
              {saved ? '★' : '☆'}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              onClick={() => onViewDetails?.(place)}
            >
              {exploreLabel}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
