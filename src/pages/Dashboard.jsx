import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMap, FiPlus, FiCompass, FiZap } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { formatCurrency, formatDate, getInitials } from '../utils/helpers';
import { HERO_IMAGES } from '../utils/constants';
import { GridSkeleton } from '../components/LoadingSkeleton';
import { DynamicImage } from '../components/DynamicImage';

export const Dashboard = () => {
  const { user, profile } = useAuth();
  const { trips, recentTrips, loading, setActiveTrip } = useTrips();

  const name = profile?.name || user?.displayName || 'Traveler';
  const photo = profile?.photoURL || user?.photoURL;

  return (
    <>
      <Helmet>
        <title>Dashboard | TravelSync TripNest</title>
      </Helmet>
      <div className="container page-wrapper">
        <motion.div
          className="glass-card profile-header"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="profile-avatar">
            {photo ? <img src={photo} alt="" /> : getInitials(name)}
          </div>
          <div>
            <h1>
              Hello, <span className="gradient-text">{name.split(' ')[0]}</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
          </div>
        </motion.div>

        <div className="profile-stats">
          <div className="glass-card stat-card">
            <strong>{trips.length}</strong>
            <span>Total Trips</span>
          </div>
          <div className="glass-card stat-card">
            <strong>{trips.reduce((s, t) => s + (t.travelers || 0), 0)}</strong>
            <span>Travelers Planned</span>
          </div>
          <div className="glass-card stat-card">
            <strong>{formatCurrency(trips.reduce((s, t) => s + (t.budgetTotal || 0), 0))}</strong>
            <span>Total Budget</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
          <Link to="/planner" className="btn btn-primary">
            <FiPlus /> New Trip
          </Link>
          <Link to="/discover" className="btn btn-outline">
            <FiCompass /> Discover
          </Link>
          <Link to="/ai-assistant" className="btn btn-outline">
            <FiZap /> AI Assistant
          </Link>
        </div>

        <h2 className="section-title" style={{ fontSize: '1.35rem' }}>
          Recently Planned
        </h2>
        {loading ? (
          <GridSkeleton count={3} />
        ) : recentTrips.length ? (
          <div className="places-grid">
            {recentTrips.map((trip, i) => (
              <motion.article
                key={trip.id}
                className="dest-card my-trip-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="my-trip-card-image">
                  <DynamicImage
                    placeName={(trip.destination || '').split(',')[0]?.trim()}
                    district={(trip.destination || '').split(',')[1]?.trim()}
                    fallback={trip.image || HERO_IMAGES[i % HERO_IMAGES.length]}
                    width={400}
                    height={260}
                    alt={trip.tripName || trip.title}
                  />
                </div>
                <div className="my-trip-card-body">
                  <h3>{trip.tripName || trip.title}</h3>
                  <p className="dest-card-location">{trip.destination}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
                  </p>
                  <Link
                    to="/planner"
                    className="btn btn-primary"
                    style={{ marginTop: '0.75rem', width: '100%' }}
                    onClick={() => setActiveTrip(trip)}
                  >
                    <FiMap /> Continue Planning
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            No trips yet. <Link to="/planner">Create your first trip</Link>.
          </p>
        )}

        <Link to="/saved" className="btn btn-outline">
          View all saved trips →
        </Link>
      </div>
    </>
  );
};
