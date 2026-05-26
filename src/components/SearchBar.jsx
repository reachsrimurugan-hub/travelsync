import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { TRAVELER_OPTIONS } from '../utils/constants';
import { SOUTH_INDIA_STATES } from '../services/placesService';

export const SearchBar = ({ onPlacesLoaded }) => {
  const { searchFilters, updateFilters } = useApp();
  const [loading, setLoading] = useState(false);

  const loadPlaces = async () => {
    setLoading(true);
    try {
      const { state, district } = searchFilters;
      let places = [];
      if (state && district) {
        const { fetchPlacesByDistrict } = await import('../services/placesService');
        places = await fetchPlacesByDistrict(state, district);
      } else if (state) {
        const { fetchPlacesByState } = await import('../services/placesService');
        places = await fetchPlacesByState(state);
      } else {
        const { searchPlaces } = await import('../services/placesService');
        places = await searchPlaces(searchFilters.query || '', { state, district });
      }
      onPlacesLoaded?.(places);
      toast.success(`Found ${places.length} places in ${state || 'South India'}`);
    } catch {
      toast.error('Could not load places. Showing curated destinations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-panel">
      <div className="search-panel-inner">
        {/* Destination Selector */}
        <div className="search-field">
          <label htmlFor="destination">Destination</label>
          <select
            id="destination"
            value={searchFilters.state || ''}
            onChange={(e) => updateFilters({ state: e.target.value, district: '', location: e.target.value })}
          >
            <option value="">All South India</option>
            {SOUTH_INDIA_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Check In Date Picker */}
        <div className="search-field">
          <label htmlFor="startDate">Check In</label>
          <input
            id="startDate"
            type="date"
            value={searchFilters.startDate || ''}
            onChange={(e) => updateFilters({ startDate: e.target.value })}
          />
        </div>

        {/* Check Out Date Picker */}
        <div className="search-field">
          <label htmlFor="endDate">Check Out</label>
          <input
            id="endDate"
            type="date"
            value={searchFilters.endDate || ''}
            onChange={(e) => updateFilters({ endDate: e.target.value })}
          />
        </div>

        {/* Travelers Selector */}
        <div className="search-field">
          <label htmlFor="travelers">Travelers</label>
          <select
            id="travelers"
            value={searchFilters.travelers || 2}
            onChange={(e) => updateFilters({ travelers: Number(e.target.value) })}
          >
            {TRAVELER_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>

        {/* Search button */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={loadPlaces}
          disabled={loading}
        >
          <FiSearch size={18} /> {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </div>
  );
};

