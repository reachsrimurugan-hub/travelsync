import { SOUTH_INDIA_STATES, getDistrictsForState } from '../services/placesService';
import { SOUTH_INDIA_CATEGORIES } from '../utils/southIndiaData';

export const SouthIndiaFilters = ({
  state,
  district,
  category,
  query = '',
  onStateChange,
  onDistrictChange,
  onCategoryChange,
  onQueryChange,
  showCategory = true,
  showSearch = true,
}) => {
  const districts = state ? getDistrictsForState(state) : [];

  return (
    <div className="south-india-filters glass-card">
      {showSearch && (
        <div className="search-field">
          <label htmlFor="place-search">Search places</label>
          <input
            id="place-search"
            type="search"
            placeholder="Place, district, or attraction..."
            value={query}
            onChange={(e) => onQueryChange?.(e.target.value)}
          />
        </div>
      )}
      <div className="search-field">
        <label htmlFor="state-select">State</label>
        <select
          id="state-select"
          value={state}
          onChange={(e) => {
            onStateChange?.(e.target.value);
            onDistrictChange?.('');
          }}
        >
          <option value="">All South India</option>
          {SOUTH_INDIA_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="search-field">
        <label htmlFor="district-select">District</label>
        <select
          id="district-select"
          value={district}
          onChange={(e) => onDistrictChange?.(e.target.value)}
          disabled={!state}
        >
          <option value="">{state ? 'All districts' : 'Select state first'}</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      {showCategory && (
        <div className="category-filters" style={{ gridColumn: '1 / -1' }}>
          <button
            type="button"
            className={`category-chip ${!category ? 'active' : ''}`}
            onClick={() => onCategoryChange?.('')}
          >
            All
          </button>
          {SOUTH_INDIA_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-chip ${category === cat.id ? 'active' : ''}`}
              onClick={() => onCategoryChange?.(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
