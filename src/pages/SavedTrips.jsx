import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit3, FiTrash2, FiMap } from 'react-icons/fi';
import { useTrips } from '../context/TripContext';
import { DestinationCard } from '../components/DestinationCard';
import { DeleteTripModal } from '../components/DeleteTripModal';
import { GridSkeleton } from '../components/LoadingSkeleton';
import { PlaceDetailModal } from '../components/PlaceDetailModal';
import { DynamicImage } from '../components/DynamicImage';
import { formatDate, formatCurrency } from '../utils/helpers';
import { HERO_IMAGES } from '../utils/constants';

const tripImage = (trip, index) =>
  trip.image || HERO_IMAGES[index % HERO_IMAGES.length];

export const SavedTrips = () => {
  const {
    trips,
    savedPlaces,
    recentTrips,
    setActiveTrip,
    exportPDF,
    removeTrip,
    loading,
  } = useTrips();
  const navigate = useNavigate();
  const [detailId, setDetailId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openPlanner = (trip) => {
    setActiveTrip(trip);
    navigate('/planner');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await removeTrip(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  if (loading && !trips.length) {
    return (
      <div className="container page-wrapper">
        <GridSkeleton count={4} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Trips | TravelSync TripNest</title>
      </Helmet>
      <div className="container page-wrapper">
        <h1 className="section-title">
          My <span className="gradient-text">Trips</span>
        </h1>
        <p className="section-subtitle">Cloud-synced plans from Firebase Firestore</p>

        <section className="section" style={{ paddingTop: '1rem' }}>
          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>
            Recently Planned
          </h2>
          {recentTrips.length ? (
            <div className="places-grid">
              {recentTrips.map((trip, i) => (
                <article key={trip.id} className="dest-card my-trip-card">
                  <div className="my-trip-card-image">
                    <DynamicImage
                      placeName={(trip.destination || '').split(',')[0]?.trim()}
                      district={(trip.destination || '').split(',')[1]?.trim()}
                      fallback={tripImage(trip, i)}
                      width={400}
                      height={260}
                      alt={trip.destination}
                    />
                  </div>
                  <div className="my-trip-card-body">
                    <h3>{trip.tripName || trip.title}</h3>
                    <p className="dest-card-location">{trip.destination}</p>
                    <div className="trip-card-meta">
                      <span>
                        {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
                      </span>
                      <span>{trip.travelers} travelers</span>
                      <span className="text-accent">{formatCurrency(trip.budgetTotal || 0)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                      <button type="button" className="btn btn-primary" onClick={() => openPlanner(trip)}>
                        <FiMap /> Continue Planning
                      </button>
                      <button type="button" className="btn btn-outline" onClick={() => openPlanner(trip)}>
                        <FiEdit3 /> Edit
                      </button>
                      <button type="button" className="btn btn-outline" onClick={() => exportPDF(trip)}>
                        PDF
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={() => setDeleteTarget(trip)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>
              No trips yet. <Link to="/planner">Start planning</Link>.
            </p>
          )}
        </section>

        <section className="section">
          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>
            All Saved Trips
          </h2>
          {trips.length > recentTrips.length ? (
            <div className="places-grid">
              {trips.slice(recentTrips.length).map((trip, i) => (
                <div key={trip.id} className="trip-card">
                  <h3>{trip.tripName || trip.title}</h3>
                  <div className="trip-card-meta">
                    <span>{trip.destination}</span>
                    <span>{formatCurrency(trip.budgetTotal || 0)}</span>
                  </div>
                  <button type="button" className="btn btn-primary" onClick={() => openPlanner(trip)}>
                    Open in Planner
                  </button>
                </div>
              ))}
            </div>
          ) : trips.length ? null : (
            <p style={{ color: 'var(--text-muted)' }}>Your trips appear here after you create them.</p>
          )}
        </section>

        <section className="section">
          <h2 className="section-title" style={{ fontSize: '1.25rem' }}>
            Saved Places
          </h2>
          {savedPlaces.length ? (
            <div className="places-grid">
              {savedPlaces.map((place, i) => (
                <DestinationCard
                  key={place.id || place.docId || i}
                  place={place}
                  index={i}
                  onViewDetails={(p) => setDetailId(p.id)}
                />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>
              Bookmark places from <Link to="/discover">Discover</Link>.
            </p>
          )}
        </section>
      </div>

      {detailId && <PlaceDetailModal placeId={detailId} onClose={() => setDetailId(null)} />}
      <DeleteTripModal
        trip={deleteTarget}
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
};
