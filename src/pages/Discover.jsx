import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiStar, FiNavigation, FiX, FiMap, FiList } from 'react-icons/fi';
import { useSouthIndiaPlaces } from '../hooks/useSouthIndiaPlaces';
import { useApp } from '../context/AppContext';
import { PlaceDetailModal } from '../components/PlaceDetailModal';
import { MapView } from '../components/MapView';
import { DynamicImage } from '../components/DynamicImage';
import { SOUTH_INDIA_STATES } from '../services/placesService';

export const Discover = () => {
  const { searchFilters, updateFilters } = useApp();
  const [detailId, setDetailId] = useState(null);
  const [mapHighlightId, setMapHighlightId] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMapPlace, setActiveMapPlace] = useState(null);

  // Local Search Inputs
  const [localQuery, setLocalQuery] = useState(searchFilters.query || '');
  const [localState, setLocalState] = useState(searchFilters.state || '');
  const [localBudget, setLocalBudget] = useState(searchFilters.budget || 'all');

  const itemsPerPage = 8;

  // Sync global searchFilters to local state on load/update
  useEffect(() => {
    setLocalQuery(searchFilters.query || '');
    setLocalState(searchFilters.state || '');
    setLocalBudget(searchFilters.budget || 'all');
  }, [searchFilters]);

  const filters = {
    state: searchFilters.state,
    district: searchFilters.district,
    category: searchFilters.category,
    query: searchFilters.query,
  };

  const { places, allPlaces, loading, error, retry } = useSouthIndiaPlaces(filters);

  // Fallback to allPlaces if places is sliced/empty
  const mapPlaces = allPlaces.length ? allPlaces : places;

  // Local Budget Filter
  const filteredPlaces = mapPlaces.filter((place) => {
    if (!searchFilters.budget || searchFilters.budget === 'all') return true;
    if (searchFilters.budget === 'low') return place.budget <= 1500;
    if (searchFilters.budget === 'mid') return place.budget > 1500 && place.budget <= 3500;
    if (searchFilters.budget === 'luxury') return place.budget > 3500;
    return true;
  });

  // Client-Side Pagination
  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
  const paginatedPlaces = filteredPlaces.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({
      query: localQuery,
      state: localState,
      budget: localBudget,
      district: '', // Reset district filter on new search
    });
    setCurrentPage(1);
  };

  const handleViewInMap = (place) => {
    setViewMode('map');
    setMapHighlightId(place.id);
    setActiveMapPlace(place);
  };

  return (
    <>
      <Helmet>
        <title>Discover South India | TravelSync</title>
      </Helmet>

      {/* Hero Search Section */}
      <section className="discover-hero">
        <div
          className="discover-hero-bg"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=1920&q=80')`,
          }}
        />
        <div className="discover-hero-overlay" />

        <div className="discover-hero-content container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="discover-hero-text"
          >
            <h1>Find your next adventure</h1>
            <p>Explore majestic temples, pristine beaches, misty hill stations, and hidden treasures.</p>
          </motion.div>

          {/* Floating Search Container */}
          <motion.form
            onSubmit={handleSearchSubmit}
            className="discover-search-bar glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Field 1: Destination input */}
            <div className="search-input-field">
              <FiSearch className="field-icon" />
              <input
                type="text"
                placeholder="Search destinations or activities..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
              />
            </div>

            <div className="search-field-divider" />

            {/* Field 2: Location selector */}
            <div className="search-select-field">
              <select
                value={localState}
                onChange={(e) => setLocalState(e.target.value)}
                aria-label="Select Region"
              >
                <option value="">All South India</option>
                {SOUTH_INDIA_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-field-divider" />

            {/* Field 3: Budget Selector */}
            <div className="search-select-field">
              <select
                value={localBudget}
                onChange={(e) => setLocalBudget(e.target.value)}
                aria-label="Select Budget Range"
              >
                <option value="all">All Budgets</option>
                <option value="low">Low-cost (under ₹1,500)</option>
                <option value="mid">Mid-range (₹1,500 - ₹3,500)</option>
                <option value="luxury">Luxury (over ₹3,500)</option>
              </select>
            </div>

            {/* CTA button */}
            <button type="submit" className="btn btn-primary search-submit-btn">
              Explore Places
            </button>
          </motion.form>
        </div>
      </section>

      <div className="container page-wrapper">
        {/* Results Header with View Toggles */}
        <div className="discover-results-header">
          <div className="results-header-left">
            <h2>Popular Destinations</h2>
            <p className="section-subtitle">
              {filteredPlaces.length} handpicked places worth exploring
            </p>
          </div>

          <div className="segmented-toggle">
            <button
              type="button"
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FiList /> List View
            </button>
            <button
              type="button"
              className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              <FiMap /> Map View
            </button>
          </div>
        </div>

        {/* View Mode Switching Feed */}
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div
              key="list"
              className="discover-list-pane"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              {loading ? (
                <div className="loading-spinner-wrap" style={{ padding: '4rem 0' }}>
                  <div className="search-spinner-tiny" style={{ width: 40, height: 40, margin: '0 auto' }} />
                </div>
              ) : error ? (
                <div className="places-empty glass-card">
                  <p>{error}</p>
                  <button type="button" className="btn btn-primary" onClick={retry}>
                    Retry
                  </button>
                </div>
              ) : filteredPlaces.length === 0 ? (
                <div className="places-empty glass-card">
                  <p>No places found matching your current search filters.</p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      updateFilters({ state: '', district: '', category: '', query: '', budget: 'all' });
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="discover-grid-layout">
                    {paginatedPlaces.map((place) => (
                      <div
                        key={place.id}
                        className="discover-dest-card"
                        onClick={() => {
                          setMapHighlightId(place.id);
                          setDetailId(place.id);
                        }}
                      >
                        <div className="dest-card-image-wrap">
                          <DynamicImage
                            placeName={place.name}
                            district={place.district}
                            fallback={place.image}
                            width={300}
                            height={400}
                            alt={place.name}
                          />
                          <div className="dest-card-overlay-gradient" />
                        </div>
                        <div className="dest-card-overlay-content">
                          <h3>{place.name}</h3>
                          <span className="dest-card-loc">
                            <FiMapPin className="pin-icon" /> {place.district || place.location || place.state}, {place.state}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Section */}
                  {totalPages > 1 && (
                    <div className="pagination-wrap">
                      <button
                        type="button"
                        className="pagination-btn"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Previous
                      </button>
                      <div className="pagination-pages">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            type="button"
                            className={`pagination-number ${pageNum === currentPage ? 'active' : ''}`}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="pagination-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="map"
              className="discover-map-pane glass-card"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              <MapView
                places={filteredPlaces}
                height="100%"
                showRoute={filteredPlaces.length > 1 && filteredPlaces.length <= 10}
                selectedId={mapHighlightId}
                onMarkerClick={(place) => {
                  setMapHighlightId(place.id);
                  setActiveMapPlace(place);
                }}
                showSearchBar={true}
                onPlaceSelect={(selected) => {
                  if (selected.id) {
                    setMapHighlightId(selected.id);
                    setActiveMapPlace(selected);
                  }
                }}
              />

              {/* Mobile details floating bottom sheet */}
              <AnimatePresence>
                {activeMapPlace && (
                  <motion.div
                    className="map-bottom-sheet glass-card"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25 }}
                  >
                    <button
                      type="button"
                      className="close-sheet-btn"
                      onClick={() => setActiveMapPlace(null)}
                      aria-label="Close details"
                    >
                      <FiX size={18} />
                    </button>
                    <div
                      className="sheet-inner"
                      onClick={() => {
                        setDetailId(activeMapPlace.id);
                      }}
                    >
                      <div className="sheet-img-container">
                        <DynamicImage
                          placeName={activeMapPlace.name}
                          district={activeMapPlace.district}
                          fallback={activeMapPlace.image}
                          width={140}
                          height={100}
                          alt={activeMapPlace.name}
                        />
                      </div>
                      <div className="sheet-info">
                        <h4>{activeMapPlace.name}</h4>
                        <span className="sheet-location">
                          <FiMapPin size={12} /> {activeMapPlace.district}, {activeMapPlace.state}
                        </span>
                        <div className="sheet-meta">
                          <span className="sheet-rating">
                            <FiStar size={12} style={{ fill: 'currentColor' }} /> {activeMapPlace.rating}
                          </span>
                          <span className="sheet-budget">
                            ₹{activeMapPlace.budget?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Place Details Modal Preview */}
      {detailId && (
        <PlaceDetailModal
          placeId={detailId}
          onClose={() => {
            setDetailId(null);
            setMapHighlightId(null);
          }}
          onSelectNearby={(p) => {
            setDetailId(p.id);
            setMapHighlightId(p.id);
          }}
          onViewInMap={(place) => {
            handleViewInMap(place);
          }}
        />
      )}
    </>
  );
};
