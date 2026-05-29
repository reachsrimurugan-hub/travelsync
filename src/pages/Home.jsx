import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar, FiCompass, FiAward, FiTrendingUp, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { HeroSection } from '../components/HeroSection';
import { PlaceDetailModal } from '../components/PlaceDetailModal';
import { DynamicImage } from '../components/DynamicImage';
import { useApp } from '../context/AppContext';
import { filterSouthIndiaPlaces, getAllSouthIndiaPlaces } from '../utils/southIndiaData';

const ABOUT_FEATURES = [
  {
    icon: <FiAward />,
    title: 'AI-Powered Planning',
    desc: 'Let our intelligent algorithms build the perfect itinerary based on your taste.'
  },
  {
    icon: <FiCalendar />,
    title: 'Personalized Itineraries',
    desc: 'Fully customized travel plans tailored to your timeline and group size.'
  },
  {
    icon: <FiTrendingUp />,
    title: 'Smart Recommendations',
    desc: 'Discover popular attractions and secret locations rated highly by fellow travelers.'
  },
  {
    icon: <FiDollarSign />,
    title: 'Budget-Friendly Trips',
    desc: 'Accurate cost estimation and smart resource allocation for all budgets.'
  }
];

export const Home = () => {
  const { searchFilters } = useApp();
  const [detailId, setDetailId] = useState(null);
  const [mapPlaces, setMapPlaces] = useState([]);

  // Fetch full details of the 6 bento destinations
  const allPlaces = getAllSouthIndiaPlaces();
  const bentoPlaceIds = [
    'kl-munnar-tea',
    'tn-nilgiris-mudumalai',
    'tn-kodaikanal-lake',
    'kl-alleppey-houseboat',
    'ka-coorg-abbey',
    'ka-mysore-palace'
  ];
  const bentoPlaces = bentoPlaceIds
    .map(id => allPlaces.find(p => p.id === id))
    .filter(Boolean);

  // Recommendations based on selected location/filters
  const filters = { state: searchFilters.state, district: searchFilters.district };
  let recommendedPlaces = filterSouthIndiaPlaces({
    state: searchFilters.state
  });
  
  if (recommendedPlaces.length < 4) {
    recommendedPlaces = [...recommendedPlaces, ...allPlaces.filter(p => !bentoPlaceIds.includes(p.id))];
  }
  recommendedPlaces = recommendedPlaces.slice(0, 4);

  return (
    <>
      <Helmet>
        <title>TravelSync | Discover & Plan Your Dream Journey Across South India</title>
        <meta
          name="description"
          content="Explore the best destinations of Tamil Nadu, Kerala, Karnataka, and more with our AI-powered trip planner and optimized itineraries."
        />
      </Helmet>

      {/* Hero Section */}
      <HeroSection
        onPlacesLoaded={(places) => {
          setMapPlaces(places);
        }}
      />

      {/* Popular Places (Bento Grid Layout) */}
      <section className="section bento-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge">Handpicked for You</span>
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">Experience the ultimate charm of South India's historic and natural wonders.</p>
          </div>

          <div className="bento-grid">
            {bentoPlaces.map((place, idx) => {
              const cardClass = idx === 0
                ? 'bento-card bento-card-large'
                : 'bento-card bento-card-medium';

              return (
                <motion.div
                  key={place.id}
                  className={cardClass}
                  onClick={() => setDetailId(place.id)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <div className="bento-card-image-wrapper">
                    <DynamicImage
                      placeName={place.name}
                      district={place.district}
                      fallback={place.image}
                      alt={place.name}
                      width={idx === 0 ? 800 : 400}
                      height={idx === 0 ? 600 : 300}
                    />
                  </div>
                  <div className="bento-card-overlay">
                    <span className="bento-card-rating">
                      <FiStar size={12} style={{ fill: 'currentColor' }} /> {place.rating}
                    </span>
                    <div className="bento-card-info">
                      <span className="bento-card-tag">{place.district}</span>
                      <h3 className="bento-card-title">{place.name}</h3>
                      <p className="bento-card-desc">{place.description}</p>
                      <button type="button" className="bento-card-btn">
                        Explore Destination
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recommended Places Section */}
      <section className="section" style={{ background: 'var(--bg-primary)', padding: 'var(--section-gap) 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Tailored Recommendations</span>
            <h2 className="section-title">
              {searchFilters.state ? `Recommended in ${searchFilters.state}` : 'Recommended for You'}
            </h2>
            <p className="section-subtitle">Curated spots based on your active location selection.</p>
          </div>

          <div className="recommendations-row">
            {recommendedPlaces.map((place) => (
              <div key={place.id} className="recommended-card">
                <div style={{ position: 'relative', overflow: 'hidden', height: '180px' }}>
                  <DynamicImage
                    placeName={place.name}
                    district={place.district}
                    fallback={place.image}
                    alt={place.name}
                    width={400}
                    height={300}
                  />
                  <span className="bento-card-rating" style={{ top: '0.75rem', right: '0.75rem' }}>
                    <FiStar size={12} style={{ fill: 'currentColor' }} /> {place.rating}
                  </span>
                </div>
                <div className="recommended-card-body">
                  <div className="recommended-card-header">
                    <h3>{place.name}</h3>
                  </div>
                  <span className="dest-card-location" style={{ fontSize: '0.8rem' }}>
                    <FiMapPin /> {place.district}, {place.state}
                  </span>
                  <div className="recommended-card-footer">
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Est. Budget</span>
                      <span className="recommended-price">₹{place.budget?.toLocaleString()}</span>
                    </div>
                    <button
                      type="button"
                      className="recommended-explore-btn"
                      onClick={() => setDetailId(place.id)}
                    >
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Website Section */}
      <section className="about-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge">How It Works</span>
            <h2 className="section-title">Your AI-Powered Travel Partner</h2>
            <p className="section-subtitle">
              We leverage advanced planning models to streamline your travel experience from discovery to destination.
            </p>
          </div>

          {/* Staggered Entrance Cards */}
          <div className="about-grid">
            {ABOUT_FEATURES.map((feat, idx) => (
              <motion.div
                key={feat.title}
                className="about-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <div className="about-icon-wrapper">
                  {feat.icon}
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Place Detail Modal */}
      {detailId && (
        <PlaceDetailModal
          placeId={detailId}
          onClose={() => setDetailId(null)}
          onSelectNearby={(p) => setDetailId(p.id)}
        />
      )}
    </>
  );
};

