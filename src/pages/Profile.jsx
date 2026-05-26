import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { getInitials } from '../utils/helpers';

export const Profile = () => {
  const { user, profile, updateUserProfile } = useAuth();
  const { trips, savedPlaces } = useTrips();
  const [name, setName] = useState(profile?.name || profile?.displayName || user?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateUserProfile({ name, bio });
    setSaving(false);
  };

  return (
    <>
      <Helmet>
        <title>Profile | TravelSync TripNest</title>
      </Helmet>
      <div className="container page-wrapper">
        <div className="glass-card profile-header">
          <div className="profile-avatar">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" />
            ) : (
              getInitials(name || user?.email)
            )}
          </div>
          <div>
            <h1>{name || 'Traveler'}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="glass-card stat-card">
            <strong>{trips.length}</strong>
            <span>Trips Planned</span>
          </div>
          <div className="glass-card stat-card">
            <strong>{savedPlaces.length}</strong>
            <span>Saved Places</span>
          </div>
          <div className="glass-card stat-card">
            <strong>{trips.filter((t) => t.itinerary?.length > 1).length}</strong>
            <span>Multi-day Plans</span>
          </div>
        </div>

        <div className="glass-card planner-section profile-form">
          <h2>Edit Profile</h2>
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input id="displayName" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
          </div>
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/planner" className="btn btn-outline">
            Open Planner
          </Link>
          <Link to="/saved" className="btn btn-outline">
            Saved Trips
          </Link>
        </div>
      </div>
    </>
  );
};
