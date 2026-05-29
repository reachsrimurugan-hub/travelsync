import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FiPlus, FiDownload, FiTrash2, FiSave, FiShare2, FiZap, FiCalendar, FiUsers, 
  FiMapPin, FiNavigation, FiSend, FiClock, FiActivity, FiX, FiCheck, 
  FiCompass, FiTrendingUp, FiCloudRain, FiThermometer, FiGrid
} from 'react-icons/fi';
import { useTrips } from '../context/TripContext';
import { useApp } from '../context/AppContext';
import { BudgetChart } from '../components/BudgetChart';
import { PlannerTimeline } from '../components/PlannerTimeline';
import { MapView } from '../components/MapView';
import { SyncStatusBar } from '../components/SyncStatusBar';
import { DeleteTripModal } from '../components/DeleteTripModal';
import { GridSkeleton } from '../components/LoadingSkeleton';
import { DynamicImage } from '../components/DynamicImage';
import { MarkdownText } from '../components/MarkdownText';
import { generateAIResponse } from '../services/aiService';
import { geocodeLocation } from '../services/mapService';
import {
  SOUTH_INDIA_STATES,
  getDistrictsForState,
  fetchNearbyPlaces,
  fetchWeatherForLocation,
} from '../services/placesService';
import { getAllSouthIndiaPlaces } from '../utils/southIndiaData';
import { formatCurrency } from '../utils/helpers';

const TRANSPORT_MODES = ['Car', 'Train', 'Flight', 'Bus', 'Walking', 'Mixed'];

export const Planner = () => {
  const {
    trips,
    activeTrip,
    setActiveTrip,
    createTrip,
    updateTrip,
    saveTripNow,
    removeTrip,
    exportPDF,
    defaultBudget,
    loading,
    syncStatus,
    syncError,
    retrySync,
    requireAuth,
  } = useTrips();
  
  const { showToast } = useApp();
  const [mapCenter, setMapCenter] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [plannerState, setPlannerState] = useState('Tamil Nadu');
  const [plannerDistrict, setPlannerDistrict] = useState('Ooty');
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Redesign state
  const [activeTab, setActiveTab] = useState('attractions');
  const [explorerSearch, setExplorerSearch] = useState('');
  const [explorerSort, setExplorerSort] = useState('rating');
  const [explorerCategory, setExplorerCategory] = useState('');
  


  // AI Assistant Widget State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your TravelSync AI Assistant. Let me help you optimize your itinerary, adjust your budget, or find the best spots!",
      suggestions: ['Suggest hotels', 'Plan a 5-day itinerary', 'Reduce budget']
    }
  ]);
  const [aiTyping, setAiTyping] = useState(false);
  const aiBottomRef = useRef(null);

  // Auto-select first trip if none is active on page load
  useEffect(() => {
    if (!activeTrip && trips && trips.length > 0) {
      setActiveTrip(trips[0]);
    }
  }, [trips, activeTrip, setActiveTrip]);

  useEffect(() => {
    if (isAiOpen) {
      aiBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, aiTyping, isAiOpen]);

  const handleNewTrip = async () => {
    if (!requireAuth()) return;
    await createTrip({
      tripName: 'New Adventure',
      destination: 'Tamil Nadu',
      startDate: new Date().toISOString().slice(0, 10),
      budgetBreakdown: defaultBudget(),
    });
  };

  const handleBudgetChange = (key, value) => {
    if (!activeTrip) return;
    const budgetBreakdown = { ...activeTrip.budgetBreakdown, [key]: value };
    updateTrip(activeTrip.id, { budgetBreakdown, budget: budgetBreakdown });
  };

  const handleItineraryUpdate = ({ days, itinerary }) => {
    if (!activeTrip) return;
    updateTrip(activeTrip.id, { days, itinerary });
  };

  const handleAIItinerary = async () => {
    if (!activeTrip) return;
    setAiLoading(true);
    await generateAIResponse('plan itinerary', {
      destination: activeTrip.destination,
      travelers: activeTrip.travelers,
    });
    showToast('AI suggestions ready — check Assistant for details');
    setAiLoading(false);
    setIsAiOpen(true);
  };

  const loadMapForTrip = async () => {
    if (!activeTrip?.destination) return;
    const geo = await geocodeLocation(activeTrip.destination);
    setMapCenter({ latitude: geo.lat, longitude: geo.lng, zoom: 11 });
    
    if (geo.lat && geo.lng) {
      setWeatherLoading(true);
      try {
        const weather = await fetchWeatherForLocation(geo.lat, geo.lng);
        setWeatherData(weather);
      } catch (err) {
        console.error('Error fetching weather:', err);
      } finally {
        setWeatherLoading(false);
      }
    }
  };

  useEffect(() => {
    if (activeTrip) {
      loadMapForTrip();
      const parts = (activeTrip.destination || '').split(',').map((s) => s.trim());
      if (parts.length >= 2) {
        setPlannerDistrict(parts[0]);
        setPlannerState(parts[1]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrip?.id, activeTrip?.destination]);

  useEffect(() => {
    if (!plannerDistrict || !plannerState) return;
    setNearbyLoading(true);
    fetchNearbyPlaces(null, null, plannerDistrict, plannerState)
      .then(setNearbyPlaces)
      .finally(() => setNearbyLoading(false));
  }, [plannerDistrict, plannerState]);

  const applyDestination = (state, district) => {
    if (!activeTrip) return;
    const dest = `${district}, ${state}`;
    updateTrip(activeTrip.id, { destination: dest });
    setPlannerState(state);
    setPlannerDistrict(district);
  };

  const confirmDelete = async () => {
    if (!activeTrip) return;
    setDeleting(true);
    try {
      await removeTrip(activeTrip.id);
      setDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const shareTrip = () => {
    if (!activeTrip) return;
    navigator.clipboard.writeText(window.location.href);
    showToast('Trip planner link copied to clipboard!');
  };

  const sendToAi = async (text) => {
    const msg = text || aiInput;
    if (!msg.trim()) return;
    setAiInput('');
    setAiMessages((m) => [...m, { role: 'user', content: msg }]);
    setAiTyping(true);
    try {
      const res = await generateAIResponse(msg, {
        destination: activeTrip?.destination || 'South India',
        travelers: activeTrip?.travelers || 2,
        budget: activeTrip?.budgetTotal || 3500,
      });
      setAiMessages((m) => [...m, res]);
    } catch {
      setAiMessages((m) => [...m, { role: 'assistant', content: 'Failed to generate response. Please try again.' }]);
    } finally {
      setAiTyping(false);
    }
  };

  // Calculations for insights row
  const calculateTotalDays = () => {
    if (!activeTrip?.startDate || !activeTrip?.endDate) return 1;
    const start = new Date(activeTrip.startDate);
    const end = new Date(activeTrip.endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getPlacesCount = () => {
    const days = activeTrip?.days || activeTrip?.itinerary || [];
    return days.reduce((sum, day) => sum + (day.activities?.length || 0), 0);
  };

  const getBestVisitingTime = () => {
    const allPlaces = getAllSouthIndiaPlaces();
    const destName = (activeTrip?.destination || '').split(',')[0]?.trim().toLowerCase();
    const matchedPlace = allPlaces.find(
      (p) => p.name.toLowerCase() === destName || p.district.toLowerCase() === destName
    );
    return matchedPlace?.bestSeason || 'Year-round';
  };

  const getRecommendationNote = (condition, temp) => {
    const c = (condition || '').toLowerCase();
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower') || c.includes('thunderstorm')) {
      return '🌧️ Rain expected. Carry an umbrella or raincoat, and plan indoor activities where possible.';
    }
    if (c.includes('snow') || c.includes('chill') || temp < 15) {
      return '❄️ Cold weather. Bundle up with warm layers and warm clothing.';
    }
    if (c.includes('cloud') || c.includes('fog') || c.includes('mist')) {
      return '☁️ Overcast skies. Good for sightseeing, but keep an eye on visibility if driving.';
    }
    if (temp > 32) {
      return '☀️ Hot weather. Stay hydrated, wear light clothing, and avoid direct midday sun.';
    }
    return '☀️ Pleasant weather. Perfect time to explore. Layered light clothing recommended.';
  };

  const tripPlaces = activeTrip
    ? [
        {
          id: activeTrip.id,
          name: activeTrip.destination,
          latitude: mapCenter?.latitude,
          longitude: mapCenter?.longitude,
        },
        ...nearbyPlaces.map((p) => ({
          id: p.id,
          name: p.name,
          latitude: p.latitude,
          longitude: p.longitude,
        })),
      ]
    : [];

  // Tab Explorer Mock Content Generation
  const getExplorerHotels = () => {
    const dist = plannerDistrict || 'Local';
    return [
      { id: 'h1', name: `${dist} Heritage Resort`, rating: 4.8, price: '₹4,500 - ₹8,000', distance: '1.2 km', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80', description: 'Premium cottages, outdoor pool, ayurvedic spa, and mountain views.' },
      { id: 'h2', name: 'Tea Valley Boutique Stay', rating: 4.6, price: '₹3,200 - ₹5,500', distance: '2.5 km', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80', description: 'Cozy boutique wooden rooms surrounded by organic tea plantations.' },
      { id: 'h3', name: 'Misty Hills Residency', rating: 4.5, price: '₹2,000 - ₹3,500', distance: '3.8 km', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80', description: 'Modern rooms, local kitchen breakfast, and clean budget suites.' },
      { id: 'h4', name: 'Pine View Eco Lodge', rating: 4.7, price: '₹3,800 - ₹6,000', distance: '1.9 km', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80', description: 'Eco-friendly forest cottages with valley hiking trails directly from property.' }
    ];
  };

  const getExplorerRestaurants = () => {
    const dist = plannerDistrict || 'Local';
    return [
      { id: 'r1', name: `${dist} Spice House`, rating: 4.7, price: '₹500 - ₹1,200', distance: '0.8 km', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', description: 'Authentic local cuisine, traditional thalis, and fresh coastal curries.' },
      { id: 'r2', name: 'Heritage Curry Kitchen', rating: 4.5, price: '₹400 - ₹900', distance: '1.5 km', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', description: 'Traditional family recipes, clay oven dishes, and aromatic biryanis.' },
      { id: 'r3', name: 'Sunset Valley Café', rating: 4.4, price: '₹300 - ₹700', distance: '2.3 km', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80', description: 'Freshly brewed coffees, local snacks, and panoramic balcony seats.' },
      { id: 'r4', name: 'The Coconut Grove Diner', rating: 4.6, price: '₹600 - ₹1,500', distance: '3.1 km', image: 'https://images.unsplash.com/photo-1502301197179-6522b4b12d62?w=600&q=80', description: 'Fine dining under palm trees with local music and candlelight setups.' }
    ];
  };

  const getExplorerActivities = () => {
    return [
      { id: 'a1', name: 'Scenic Valley Trekking', rating: 4.8, price: '₹1,500 / traveler', distance: '3.5 km', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', description: 'Guided group hike through mountain paths to hidden waterfalls.' },
      { id: 'a2', name: 'Spice Plantation Guided Tour', rating: 4.6, price: '₹800 / traveler', distance: '4.2 km', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', description: 'Walk through organic gardens, learning about cardamom, pepper, and vanilla.' },
      { id: 'a3', name: 'Boating & Water Activities', rating: 4.7, price: '₹1,200 / boat', distance: '1.0 km', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80', description: 'Row boats, pedal boats, and motorboat rides on the main lake.' },
      { id: 'a4', name: 'Local Cultural Dance Show', rating: 4.5, price: '₹500 / seat', distance: '0.5 km', image: 'https://images.unsplash.com/photo-1537996192894-86f8a88d2b4d?w=600&q=80', description: 'Evening performance showing classical music, arts, and fire dance.' }
    ];
  };

  const getActiveItems = () => {
    if (activeTab === 'attractions') {
      return nearbyPlaces.map(p => ({
        id: p.id,
        name: p.name,
        rating: p.rating,
        category: p.category,
        distance: '1.5 km',
        price: p.budget ? `₹${p.budget.toLocaleString()}` : 'Entry Free',
        image: p.image,
        description: p.description,
        isAttraction: true
      }));
    }
    if (activeTab === 'hotels') return getExplorerHotels();
    if (activeTab === 'restaurants') return getExplorerRestaurants();
    return getExplorerActivities();
  };

  const getFilteredExplorerItems = () => {
    let items = getActiveItems();
    if (explorerSearch.trim()) {
      const q = explorerSearch.toLowerCase();
      items = items.filter(
        item =>
          item.name?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      );
    }
    if (explorerCategory && activeTab === 'attractions') {
      items = items.filter(item => item.category === explorerCategory);
    }
    if (explorerSort === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (explorerSort === 'distance') {
      items.sort((a, b) => {
        const distA = parseFloat(a.distance) || 0;
        const distB = parseFloat(b.distance) || 0;
        return distA - distB;
      });
    }
    return items;
  };

  const handleAddPlaceToItinerary = (p) => {
    const days = activeTrip.days || activeTrip.itinerary || [];
    const last = days[days.length - 1] || { day: 1, activities: [] };
    const updated = [...days.slice(0, -1), {
      ...last,
      activities: [
        ...(last.activities || []),
        {
          time: '10:00',
          title: p.name,
          description: p.description || '',
          location: p.distance ? `${p.name} (${p.distance})` : p.name,
          duration: p.isAttraction ? '2 hrs' : '1.5 hrs',
        },
      ],
    }];
    handleItineraryUpdate({
      days: updated.length ? updated : [{ day: 1, title: 'Day 1', activities: [{ time: '10:00', title: p.name, description: p.description || '', location: p.name }] }],
      itinerary: updated,
    });
    showToast(`Added ${p.name} to itinerary!`);
  };

  if (loading && !trips.length) {
    return (
      <div className="container page-wrapper">
        <GridSkeleton count={3} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Planner | TravelSync TripNest</title>
      </Helmet>
      
      {/* Sync Status Floating Indicator */}
      <div className="sync-status-floating-wrap">
        <SyncStatusBar status={syncStatus} error={syncError} onRetry={retrySync} />
      </div>

      <div className="container page-wrapper">
        <div className="planner-dashboard-container">
        
        {/* Main Content Area */}
        <main className="planner-main-content">
          
          {/* Header Dashboard section */}
          <header className="planner-header-dashboard glass-card">
            <div className="header-dashboard-top">
              
              <div className="header-title-and-select">
                <select
                  value={activeTrip?.id || ''}
                  onChange={(e) => {
                    const found = trips.find((t) => t.id === e.target.value);
                    if (found) setActiveTrip(found);
                  }}
                  className="header-trip-select-dropdown"
                  aria-label="Select active trip"
                >
                  <option value="" disabled>Select active trip...</option>
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.tripName || t.title || 'Untitled Trip'}
                    </option>
                  ))}
                </select>

                {activeTrip ? (
                  <input
                    value={activeTrip.tripName || activeTrip.title || ''}
                    onChange={(e) =>
                      updateTrip(activeTrip.id, { tripName: e.target.value, title: e.target.value })
                    }
                    className="trip-name-header-input"
                    placeholder="Give your trip a name..."
                  />
                ) : (
                  <h1 className="header-h1-placeholder">Start Planning</h1>
                )}
              </div>

              {/* Action buttons */}
              <div className="header-dashboard-actions">
                <button type="button" className="btn btn-outline header-action-btn" onClick={handleNewTrip}>
                  <FiPlus /> New Trip
                </button>
                {activeTrip && (
                  <>
                    <button type="button" className="btn btn-outline header-action-btn" onClick={saveTripNow}>
                      <FiSave /> Save
                    </button>
                    <button type="button" className="btn btn-outline header-action-btn" onClick={() => exportPDF(activeTrip)}>
                      <FiDownload /> PDF
                    </button>
                    <button type="button" className="btn btn-outline header-action-btn" onClick={shareTrip}>
                      <FiShare2 /> Share
                    </button>
                    <button type="button" className="btn btn-primary header-action-btn" onClick={() => setIsAiOpen(true)}>
                      <FiZap /> AI Assistant
                    </button>
                    <button type="button" className="btn-icon-danger-circle" onClick={() => setDeleteOpen(true)}>
                      <FiTrash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {activeTrip && (
              <div className="header-dashboard-summary-chips">
                <div className="summary-chip">
                  <FiMapPin className="chip-icon" />
                  <span>{activeTrip.destination || 'Select destination'}</span>
                </div>
                <div className="summary-chip">
                  <FiCalendar className="chip-icon" />
                  <span>
                    {activeTrip.startDate ? new Date(activeTrip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Start Date'} - {activeTrip.endDate ? new Date(activeTrip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'End Date'}
                  </span>
                </div>
                <div className="summary-chip">
                  <FiUsers className="chip-icon" />
                  <span>{activeTrip.travelers || 1} {activeTrip.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
                </div>
                <div className="summary-chip font-bold color-accent">
                  <span>Budget: {formatCurrency(activeTrip.budgetTotal || activeTrip.budget?.budgetTotal || 0)}</span>
                </div>
              </div>
            )}
          </header>

          {activeTrip ? (
            <div className="dashboard-grid-layout">
              
              {/* Row 2: Two Columns: Trip Info Card (35%) + Map (65%) */}
              <section className="dashboard-twocol-section">
                
                {/* Left Column: Trip Information form */}
                <div className="trip-info-card glass-card">
                  <h3>Trip Information</h3>
                  <div className="form-grid-spacing">
                    <div className="form-group-item">
                      <label>Destination Region</label>
                      <div className="flex-dropdowns">
                        <select
                          value={plannerState}
                          onChange={(e) => {
                            setPlannerState(e.target.value);
                            setPlannerDistrict('');
                          }}
                          aria-label="State selection"
                        >
                          {SOUTH_INDIA_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <select
                          value={plannerDistrict}
                          onChange={(e) => applyDestination(plannerState, e.target.value)}
                          aria-label="District selection"
                        >
                          {getDistrictsForState(plannerState).map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex-date-row">
                      <div className="form-group-item flex-1">
                        <label>Start Date</label>
                        <input
                          type="date"
                          value={activeTrip.startDate || ''}
                          onChange={(e) => updateTrip(activeTrip.id, { startDate: e.target.value })}
                        />
                      </div>
                      <div className="form-group-item flex-1">
                        <label>End Date</label>
                        <input
                          type="date"
                          value={activeTrip.endDate || ''}
                          onChange={(e) => updateTrip(activeTrip.id, { endDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex-date-row">
                      <div className="form-group-item flex-1">
                        <label>Travelers</label>
                        <input
                          type="number"
                          min={1}
                          value={activeTrip.travelers || 1}
                          onChange={(e) => updateTrip(activeTrip.id, { travelers: Number(e.target.value) })}
                        />
                      </div>
                      <div className="form-group-item flex-1">
                        <label>Transportation</label>
                        <select
                          value={activeTrip.transportMode || 'Car'}
                          onChange={(e) => updateTrip(activeTrip.id, { transportMode: e.target.value })}
                        >
                          {TRANSPORT_MODES.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group-item">
                      <label>Trip Planning Notes</label>
                      <textarea
                        value={activeTrip.notes || ''}
                        onChange={(e) => updateTrip(activeTrip.id, { notes: e.target.value })}
                        placeholder="Add flight tickets, hotel confirmation codes, or backup plans here..."
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Route Map (65%) */}
                <div className="trip-map-card glass-card">
                  <div className="map-card-header-overlay">
                    <h3>Interactive Route Map</h3>
                    <span className="badge-overlay">Active Route</span>
                  </div>
                  <div className="map-view-wrapper">
                    <MapView places={tripPlaces} center={mapCenter} showRoute height="100%" />
                  </div>
                </div>
              </section>

              {/* Row 3: Insights Grid (3 Cards: Budget Allocation, Weather, Stats) */}
              <section className="dashboard-insights-grid">
                
                {/* 1. Budget Allocation Card */}
                <div className="insight-card glass-card budget-insight">
                  <h3>Budget Allocation</h3>
                  <div className="budget-insight-body">
                    <BudgetChart
                      budget={activeTrip.budgetBreakdown || activeTrip.budget}
                      onChange={handleBudgetChange}
                    />
                  </div>
                </div>

                {/* 2. Weather Insight Card */}
                <div className="insight-card glass-card weather-insight">
                  <h3>Destination Weather</h3>
                  <div className="weather-insight-body">
                    {weatherLoading ? (
                      <div className="weather-loading-spinner">
                        <div className="weather-loading-pulse"></div>
                        <span>Updating weather conditions...</span>
                      </div>
                    ) : (
                      <>
                        <div className="weather-current-row">
                          <div className="weather-temp-badge">
                            <FiThermometer className="temp-icon" />
                            <span>{Math.round(weatherData?.temperature?.degrees ?? 24)}°C</span>
                          </div>
                          <div className="weather-desc">
                            <strong>{weatherData?.weatherCondition?.description?.text || 'Pleasant'}</strong>
                            <span>{activeTrip?.destination || 'Ooty, TN'}</span>
                          </div>
                        </div>
                        
                        <div className="weather-metrics-list">
                          <div className="weather-metric-item">
                            <div className="metric-header">
                              <FiCloudRain />
                              <span>Rain Probability</span>
                            </div>
                            <strong>{weatherData?.precipitation?.probability?.percent ?? 15}%</strong>
                          </div>
                          <div className="weather-metric-item">
                            <div className="metric-header">
                              <FiClock />
                              <span>Best Visiting Time</span>
                            </div>
                            <strong>{getBestVisitingTime()}</strong>
                          </div>
                        </div>
                        
                        <div className="weather-recommendation-note">
                          <p>
                            {getRecommendationNote(
                              weatherData?.weatherCondition?.description?.text,
                              weatherData?.temperature?.degrees ?? 24
                            )}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 3. Trip Statistics Card */}
                <div className="insight-card glass-card stats-insight">
                  <h3>Trip Statistics</h3>
                  <div className="stats-insight-body">
                    <div className="stats-metric-grid">
                      <div className="stat-grid-item">
                        <div className="stat-icon-wrap">
                          <FiCalendar />
                        </div>
                        <div className="stat-data">
                          <span>Total Days</span>
                          <strong>{calculateTotalDays()} Days</strong>
                        </div>
                      </div>

                      <div className="stat-grid-item">
                        <div className="stat-icon-wrap">
                          <FiActivity />
                        </div>
                        <div className="stat-data">
                          <span>Places Added</span>
                          <strong>{getPlacesCount()} Stops</strong>
                        </div>
                      </div>

                      <div className="stat-grid-item">
                        <div className="stat-icon-wrap">
                          <FiNavigation />
                        </div>
                        <div className="stat-data">
                          <span>Total Distance</span>
                          <strong>~{(tripPlaces.length > 1 ? (tripPlaces.length - 1) * 35 : 0)} km</strong>
                        </div>
                      </div>

                      <div className="stat-grid-item">
                        <div className="stat-icon-wrap">
                          <FiClock />
                        </div>
                        <div className="stat-data">
                          <span>Est. Travel Time</span>
                          <strong>~{(tripPlaces.length > 1 ? ((tripPlaces.length - 1) * 45 / 60).toFixed(1) : 0)} hrs</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Row 4: Itinerary Timeline (Full-width) */}
              <section className="dashboard-timeline-section glass-card">
                <div className="timeline-section-header">
                  <div>
                    <h3>Itinerary Timeline</h3>
                    <p>Build and customize your day-by-day sightseeing calendar</p>
                  </div>
                  <button type="button" className="btn btn-outline btn-sm" onClick={handleAIItinerary} disabled={aiLoading}>
                    {aiLoading ? 'Thinking...' : 'AI Itinerary Generator'}
                  </button>
                </div>
                <PlannerTimeline
                  days={activeTrip.days}
                  itinerary={activeTrip.itinerary}
                  onUpdate={handleItineraryUpdate}
                />
              </section>

              {/* Row 5: Attraction Explorer Section (Full-width Tab-navigation) */}
              <section className="dashboard-explorer-section glass-card">
                <div className="explorer-header-row">
                  <div>
                    <h3>Attraction & Amenities Explorer</h3>
                    <p>Discover things to do, stays, and dining in {plannerDistrict}</p>
                  </div>
                  
                  {/* Category tabs */}
                  <div className="explorer-tab-buttons">
                    <button 
                      type="button" 
                      className={`tab-btn ${activeTab === 'attractions' ? 'active' : ''}`}
                      onClick={() => setActiveTab('attractions')}
                    >
                      Attractions
                    </button>
                    <button 
                      type="button" 
                      className={`tab-btn ${activeTab === 'hotels' ? 'active' : ''}`}
                      onClick={() => setActiveTab('hotels')}
                    >
                      Hotels
                    </button>
                    <button 
                      type="button" 
                      className={`tab-btn ${activeTab === 'restaurants' ? 'active' : ''}`}
                      onClick={() => setActiveTab('restaurants')}
                    >
                      Restaurants
                    </button>
                    <button 
                      type="button" 
                      className={`tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
                      onClick={() => setActiveTab('activities')}
                    >
                      Activities
                    </button>
                  </div>
                </div>

                {/* Filters, Search, Sort controls */}
                <div className="explorer-controls-row">
                  <div className="explorer-search-input-wrap">
                    <FiCompass className="search-icon" />
                    <input 
                      type="text"
                      placeholder={`Search ${activeTab}...`}
                      value={explorerSearch}
                      onChange={(e) => setExplorerSearch(e.target.value)}
                    />
                  </div>

                  <div className="explorer-filter-groups">
                    {activeTab === 'attractions' && (
                      <select 
                        value={explorerCategory}
                        onChange={(e) => setExplorerCategory(e.target.value)}
                        className="explorer-select"
                        aria-label="Filter category"
                      >
                        <option value="">All Categories</option>
                        <option value="beaches">Beaches</option>
                        <option value="hills">Hills</option>
                        <option value="adventure">Adventure</option>
                        <option value="waterfalls">Waterfalls</option>
                        <option value="nature">Nature</option>
                        <option value="historical">Historical</option>
                      </select>
                    )}

                    <select
                      value={explorerSort}
                      onChange={(e) => setExplorerSort(e.target.value)}
                      className="explorer-select"
                      aria-label="Sort options"
                    >
                      <option value="rating">Sort by Rating</option>
                      <option value="distance">Sort by Distance</option>
                    </select>
                  </div>
                </div>

                {/* Explorer Items grid */}
                {nearbyLoading ? (
                  <GridSkeleton count={4} />
                ) : (
                  <div className="explorer-cards-grid">
                    {getFilteredExplorerItems().map((item) => (
                      <div key={item.id} className="explorer-item-card glass-card">
                        <div className="explorer-card-img-wrap">
                          <DynamicImage
                            placeName={item.name}
                            district={plannerDistrict}
                            fallback={item.image}
                            width={300}
                            height={180}
                            alt={item.name}
                          />
                          <span className="card-rating-badge">
                            ★ {item.rating}
                          </span>
                        </div>
                        
                        <div className="explorer-card-content">
                          <div className="card-title-row">
                            <h4>{item.name}</h4>
                            <span className="card-tag">{item.category || activeTab}</span>
                          </div>
                          
                          <p className="card-description">
                            {item.description || `Explore this gorgeous spot in ${plannerDistrict}.`}
                          </p>

                          <div className="card-metrics-row">
                            <span className="metric"><FiNavigation size={12} /> {item.distance || '1.5 km'}</span>
                            <span className="metric"><FiClock size={12} /> {item.price || 'Entry Free'}</span>
                          </div>
                          
                          <button
                            type="button"
                            className="btn btn-outline add-to-trip-btn"
                            onClick={() => handleAddPlaceToItinerary(item)}
                          >
                            <FiPlus /> Add to Trip
                          </button>
                        </div>
                      </div>
                    ))}
                    {getFilteredExplorerItems().length === 0 && (
                      <div className="empty-explorer-state">
                        <p>No results found matching your current search parameters.</p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>
          ) : (
            <div className="no-active-trip-state glass-card">
              <FiCompass className="compass-icon animate-pulse" />
              <h3>No Active Trip Selected</h3>
              <p>Create a new trip or select an existing adventure from the dropdown at the top to start planning.</p>
              <button type="button" className="btn btn-primary" onClick={handleNewTrip}>
                <FiPlus /> Create New Trip
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Floating/Bottom Sheet AI Travel Assistant */}
      <div className={`floating-ai-assistant-widget ${isAiOpen ? 'is-open' : 'is-closed'}`}>
        
        {/* Toggle bubble button */}
        {!isAiOpen && (
          <button 
            type="button" 
            className="ai-widget-bubble-btn"
            onClick={() => setIsAiOpen(true)}
            aria-label="Open AI Assistant"
          >
            <FiZap className="zap-icon" />
            <span className="tooltip-text">Ask AI Assistant</span>
          </button>
        )}

        {/* Panel interface */}
        {isAiOpen && (
          <div className="ai-widget-panel glass-card">
            
            {/* Widget Header */}
            <div className="ai-widget-header">
              <div className="header-info">
                <FiZap className="text-accent" />
                <div>
                  <h4>AI Travel Assistant</h4>
                  <span>Powered by TravelSync</span>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-icon-tiny"
                onClick={() => setIsAiOpen(false)}
                title="Minimize"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Widget Suggestions list */}
            <div className="ai-suggested-actions-row">
              <button type="button" onClick={() => sendToAi('plan itinerary')}>Itinerary</button>
              <button type="button" onClick={() => sendToAi('optimize route')}>Optimize Route</button>
              <button type="button" onClick={() => sendToAi('reduce budget')}>Reduce Budget</button>
              <button type="button" onClick={() => sendToAi('suggest restaurants')}>Restaurants</button>
              <button type="button" onClick={() => sendToAi('suggest hotels')}>Hotels</button>
            </div>

            {/* Messages box */}
            <div className="ai-widget-messages">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`ai-message-bubble ${msg.role}`}>
                  <MarkdownText text={msg.content} />
                  {msg.suggestions && (
                    <div className="message-suggestions-list">
                      {msg.suggestions.map((s) => (
                        <button key={s} type="button" onClick={() => sendToAi(s)}>
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {aiTyping && (
                <div className="ai-message-bubble assistant typing">
                  <div className="typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
              <div ref={aiBottomRef} />
            </div>

            {/* Text Input area */}
            <form 
              className="ai-widget-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                sendToAi();
              }}
            >
              <input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask about route, hotels, spots..."
              />
              <button type="submit" className="btn btn-primary btn-icon-only" aria-label="Send">
                <FiSend size={14} />
              </button>
            </form>
          </div>
        )}
      </div>
      </div>

      <DeleteTripModal
        trip={activeTrip}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </>
  );
};
