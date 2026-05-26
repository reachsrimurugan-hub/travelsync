import { generateId } from './helpers';

export const defaultBudgetBreakdown = () => ({
  hotels: 600,
  food: 320,
  transport: 200,
  activities: 240,
  shopping: 160,
});

export const calcBudgetTotal = (breakdown = {}) =>
  Object.values(breakdown).reduce((sum, v) => sum + (Number(v) || 0), 0);

/** Normalize UI / legacy trip → Firestore document shape */
export const toFirestoreTrip = (trip, userId) => {
  const budgetBreakdown = trip.budgetBreakdown || trip.budget || defaultBudgetBreakdown();
  const days = trip.days || itineraryToDays(trip.itinerary, trip.startDate);

  return {
    userId,
    tripName: trip.tripName || trip.title || 'New Adventure',
    destination: trip.destination || '',
    startDate: trip.startDate || '',
    endDate: trip.endDate || '',
    travelers: Number(trip.travelers) || 2,
    transportMode: trip.transportMode || 'Car',
    budget: Number(trip.budget) || calcBudgetTotal(budgetBreakdown),
    days,
    budgetBreakdown,
    savedPlaces: trip.savedPlaces || [],
    notes: trip.notes || '',
    image: trip.image || '',
  };
};

/** Firestore document → UI trip (keeps backward-compatible fields) */
export const fromFirestoreTrip = (docSnap) => {
  const data = docSnap.data?.() ?? docSnap;
  const id = docSnap.id ?? data.id;

  const budgetBreakdown = data.budgetBreakdown || data.budget || defaultBudgetBreakdown();
  const days = data.days || [];
  const itinerary = daysToItinerary(days);

  return {
    id,
    userId: data.userId,
    tripName: data.tripName || data.title || 'Untitled Trip',
    title: data.tripName || data.title || 'Untitled Trip',
    destination: data.destination || '',
    startDate: data.startDate || '',
    endDate: data.endDate || '',
    travelers: data.travelers ?? 2,
    transportMode: data.transportMode || 'Car',
    budgetTotal: data.budget ?? calcBudgetTotal(budgetBreakdown),
    budgetBreakdown,
    budget: budgetBreakdown,
    days,
    itinerary,
    savedPlaces: data.savedPlaces || [],
    notes: data.notes || '',
    image: data.image || '',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export const createEmptyTrip = (overrides = {}) => {
  const budgetBreakdown = overrides.budgetBreakdown || defaultBudgetBreakdown();
  const startDate = overrides.startDate || new Date().toISOString().slice(0, 10);

  return {
    tripName: overrides.tripName || overrides.title || 'New Adventure',
    title: overrides.tripName || overrides.title || 'New Adventure',
    destination: overrides.destination || '',
    startDate,
    endDate: overrides.endDate || '',
    travelers: overrides.travelers ?? 2,
    transportMode: overrides.transportMode || 'Car',
    budgetTotal: calcBudgetTotal(budgetBreakdown),
    budgetBreakdown,
    budget: budgetBreakdown,
    days: overrides.days || [
      {
        day: 1,
        date: startDate,
        title: 'Day 1',
        activities: [],
      },
    ],
    itinerary: overrides.itinerary || [{ day: 1, title: 'Day 1', activities: [] }],
    savedPlaces: [],
    notes: '',
    image: '',
    ...overrides,
  };
};

export const itineraryToDays = (itinerary = [], startDate = '') => {
  if (!itinerary?.length) {
    return [{ day: 1, date: startDate, title: 'Day 1', activities: [] }];
  }
  return itinerary.map((d, i) => ({
    day: d.day ?? i + 1,
    date: d.date || addDays(startDate, i),
    title: d.title || `Day ${d.day ?? i + 1}`,
    activities: (d.activities || []).map(normalizeActivity),
  }));
};

export const daysToItinerary = (days = []) =>
  days.map((d) => ({
    day: d.day,
    date: d.date,
    title: d.title || `Day ${d.day}`,
    activities: (d.activities || []).map(normalizeActivity),
  }));

const normalizeActivity = (act) => {
  if (typeof act === 'string') return { time: '09:00', title: act, description: '', location: '' };
  return {
    time: act.time || '09:00',
    title: act.title || act.name || '',
    name: act.title || act.name || '',
    description: act.description || '',
    location: act.location || '',
    type: act.type,
  };
};

const addDays = (dateStr, days) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const tripPayloadHash = (trip) =>
  JSON.stringify(toFirestoreTrip(trip, trip.userId || 'local'));

export const newTripId = () => generateId();
