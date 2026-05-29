export const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0);

export const formatDate = (date) => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

export const getInitials = (name = '') =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'TN';

export const debounce = (fn, ms = 300) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

export const parseLocationCoords = (place) => {
  const lat = place?.latitude ?? place?.lat ?? place?.geo?.lat ?? 48.8566;
  const lng = place?.longitude ?? place?.lng ?? place?.geo?.lng ?? 2.3522;
  return { lat: Number(lat), lng: Number(lng) };
};
