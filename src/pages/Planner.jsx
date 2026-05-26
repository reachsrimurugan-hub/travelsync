import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiDownload, FiTrash2, FiSave } from 'react-icons/fi';
import { useTrips } from '../context/TripContext';
import { useApp } from '../context/AppContext';
import { BudgetChart } from '../components/BudgetChart';
import { PlannerTimeline } from '../components/PlannerTimeline';
import { MapView } from '../components/MapView';
import { SyncStatusBar } from '../components/SyncStatusBar';
import { DeleteTripModal } from '../components/DeleteTripModal';
import { GridSkeleton } from '../components/LoadingSkeleton';
import { DynamicImage } from '../components/DynamicImage';
import { generateAIResponse } from '../services/aiService';
import { geocodeLocation } from '../services/mapService';
import {
  SOUTH_INDIA_STATES,
  getDistrictsForState,
  fetchNearbyPlaces,
} from '../services/placesService';
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
  };

  const loadMapForTrip = async () => {
    if (!activeTrip?.destination) return;
    const geo = await geocodeLocation(activeTrip.destination);
    setMapCenter({ latitude: geo.lat, longitude: geo.lng, zoom: 11 });
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
      <div className="container page-wrapper">
        <h1 className="section-title">
          Travel <span className="gradient-text">Planner</span>
        </h1>
        <p className="section-subtitle">
          Changes auto-save to Firestore every few seconds when you&apos;re logged in.
        </p>

        <SyncStatusBar status={syncStatus} error={syncError} onRetry={retrySync} />

        <div className="planner-actions">
          <button type="button" className="btn btn-primary" onClick={handleNewTrip}>
            <FiPlus /> Add Trip
          </button>
          {activeTrip && (
            <>
              <button type="button" className="btn btn-outline" onClick={saveTripNow}>
                <FiSave /> Save Now
              </button>
              <button type="button" className="btn btn-outline" onClick={() => exportPDF(activeTrip)}>
                <FiDownload /> Export PDF
              </button>
              <button type="button" className="btn btn-outline" onClick={handleAIItinerary} disabled={aiLoading}>
                AI Itinerary
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setDeleteOpen(true)}>
                <FiTrash2 /> Delete
              </button>
            </>
          )}
        </div>

        <div className="planner-layout">
          <aside className="planner-sidebar glass-card" style={{ padding: '1.25rem' }}>
            <h3>Your Trips</h3>
            <div className="trip-list">
              {trips.map((t) => (
                <div
                  key={t.id}
                  className={`trip-item ${activeTrip?.id === t.id ? 'active' : ''}`}
                  onClick={() => setActiveTrip(t)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveTrip(t)}
                >
                  <strong>{t.tripName || t.title}</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.destination}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>
                    {formatCurrency(t.budgetTotal || 0)}
                  </p>
                </div>
              ))}
              {!trips.length && <p style={{ color: 'var(--text-muted)' }}>No trips yet. Create one!</p>}
            </div>
          </aside>

          {activeTrip ? (
            <>
              <section className="glass-card planner-section">
                <h2>Trip Overview</h2>
                <div className="planner-form">
                  <input
                    value={activeTrip.tripName || activeTrip.title || ''}
                    onChange={(e) =>
                      updateTrip(activeTrip.id, { tripName: e.target.value, title: e.target.value })
                    }
                    placeholder="Trip name"
                  />
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Destination (South India)</label>
                  <select
                    value={plannerState}
                    onChange={(e) => {
                      setPlannerState(e.target.value);
                      setPlannerDistrict('');
                    }}
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
                  >
                    {getDistrictsForState(plannerState).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={activeTrip.startDate || ''}
                    onChange={(e) => updateTrip(activeTrip.id, { startDate: e.target.value })}
                  />
                  <input
                    type="date"
                    value={activeTrip.endDate || ''}
                    onChange={(e) => updateTrip(activeTrip.id, { endDate: e.target.value })}
                  />
                  <input
                    type="number"
                    min={1}
                    value={activeTrip.travelers}
                    onChange={(e) => updateTrip(activeTrip.id, { travelers: Number(e.target.value) })}
                    placeholder="Travelers"
                  />
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
                  <textarea
                    value={activeTrip.notes || ''}
                    onChange={(e) => updateTrip(activeTrip.id, { notes: e.target.value })}
                    placeholder="Notes..."
                  />
                </div>
              </section>

              <section className="glass-card planner-section">
                <h2>
                  Budget Allocation — {formatCurrency(activeTrip.budgetTotal || 0)}
                </h2>
                <BudgetChart
                  budget={activeTrip.budgetBreakdown || activeTrip.budget}
                  onChange={handleBudgetChange}
                />
              </section>

              <section className="glass-card planner-section" style={{ gridColumn: '1 / -1' }}>
                <h2>Itinerary Timeline</h2>
                <PlannerTimeline
                  days={activeTrip.days}
                  itinerary={activeTrip.itinerary}
                  onUpdate={handleItineraryUpdate}
                />
              </section>

              <section className="glass-card planner-section planner-map-section" style={{ gridColumn: '1 / -1' }}>
                <h2>Route Map</h2>
                <MapView places={tripPlaces} center={mapCenter} showRoute height="400px" />
              </section>

              <section className="glass-card planner-section" style={{ gridColumn: '1 / -1' }}>
                <h2>Suggested Nearby Places — {plannerDistrict}</h2>
                <p className="section-subtitle" style={{ marginBottom: '1rem' }}>
                  Add these attractions to your itinerary
                </p>
                {nearbyLoading ? (
                  <GridSkeleton count={3} />
                ) : (
                  <div className="nearby-places-grid">
                    {nearbyPlaces.map((p) => (
                      <div key={p.id} className="nearby-mini-card">
                        <DynamicImage
                          placeName={p.name}
                          district={p.district}
                          fallback={p.image}
                          width={120}
                          height={90}
                          alt={p.name}
                        />
                        <strong>{p.name}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {p.category} · {p.rating}★
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ marginTop: '0.5rem', width: '100%', fontSize: '0.8rem' }}
                          onClick={() => {
                            const days = activeTrip.days || activeTrip.itinerary || [];
                            const last = days[days.length - 1] || { day: 1, activities: [] };
                            const updated = [...days.slice(0, -1), {
                              ...last,
                              activities: [
                                ...(last.activities || []),
                                {
                                  time: '10:00',
                                  title: p.name,
                                  description: p.description,
                                  location: p.district,
                                },
                              ],
                            }];
                            handleItineraryUpdate({
                              days: updated.length ? updated : [{ day: 1, title: 'Day 1', activities: [{ time: '10:00', title: p.name, description: p.description, location: p.district }] }],
                              itinerary: updated,
                            });
                            showToast(`Added ${p.name} to itinerary`);
                          }}
                        >
                          Add to plan
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <h4 style={{ marginTop: '1.5rem', color: 'var(--accent)' }}>Recommended Restaurants</h4>
                <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', paddingLeft: '1.25rem' }}>
                  <li>{plannerDistrict} Spice House — local thali & seafood</li>
                  <li>Heritage Kitchen — traditional {plannerState} cuisine</li>
                  <li>Hill View Café — scenic dining</li>
                </ul>
              </section>
            </>
          ) : (
            <div
              className="glass-card planner-section"
              style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}
            >
              <p>Select or create a trip to start planning.</p>
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
