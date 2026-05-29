const IMG = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

export const MOCK_PLACES = [
  {
    id: '1',
    name: 'Santorini Caldera View',
    location: 'Santorini, Greece',
    rating: 4.9,
    description: 'Iconic whitewashed villages perched on volcanic cliffs with stunning Aegean sunsets.',
    image: IMG('1613395879184-b440d309f1ce'),
    category: 'beaches',
    weather: '24°C Sunny',
    latitude: 36.3932,
    longitude: 25.4615,
    budget: 2800,
    bestTime: 'April - October',
  },
  {
    id: '2',
    name: 'Banff National Park',
    location: 'Alberta, Canada',
    rating: 4.8,
    description: 'Turquoise lakes and dramatic Rocky Mountain peaks in a UNESCO World Heritage site.',
    image: IMG('1506905925346-21bda4d32df4'),
    category: 'mountains',
    weather: '12°C Clear',
    latitude: 51.4968,
    longitude: -115.9281,
    budget: 3200,
    bestTime: 'June - September',
  },
  {
    id: '3',
    name: 'Angkor Archaeological Park',
    location: 'Siem Reap, Cambodia',
    rating: 4.9,
    description: 'Ancient Khmer archaeological complex and the largest monument ruins in the world.',
    image: IMG('1537996192894-86f8a88d2b4d'),
    category: 'historical',
    weather: '30°C Humid',
    latitude: 13.4125,
    longitude: 103.8670,
    budget: 1500,
    bestTime: 'November - March',
  },
  {
    id: '4',
    name: 'Iguazu Falls',
    location: 'Argentina / Brazil',
    rating: 4.9,
    description: 'Majestic waterfall system surrounded by subtropical rainforest and wildlife.',
    image: IMG('1558981284-6d48e2417e5e'),
    category: 'waterfalls',
    weather: '26°C Misty',
    latitude: -25.6953,
    longitude: -54.4367,
    budget: 2200,
    bestTime: 'March - May',
  },
  {
    id: '5',
    name: 'Queenstown Adventure Hub',
    location: 'New Zealand',
    rating: 4.7,
    description: 'Bungee jumping, skiing, and jet boating in the adventure capital of the world.',
    image: IMG('1507699622107-4be7a3c34a7a'),
    category: 'adventure',
    weather: '18°C Breezy',
    latitude: -45.0312,
    longitude: 168.6626,
    budget: 4000,
    bestTime: 'December - February',
  },
  {
    id: '6',
    name: 'Amazon Rainforest Lodge',
    location: 'Manaus, Brazil',
    rating: 4.6,
    description: 'Eco-lodges deep in the Amazon with guided wildlife and river expeditions.',
    image: IMG('1516026672322-bc52c845a3a5'),
    category: 'nature',
    weather: '28°C Rain',
    latitude: -3.1190,
    longitude: -60.0217,
    budget: 2600,
    bestTime: 'June - November',
  },
  {
    id: '7',
    name: 'Maldives Overwater Villa',
    location: 'Malé, Maldives',
    rating: 4.9,
    description: 'Crystal-clear lagoons, coral reefs, and luxury overwater bungalows.',
    image: IMG('1514282401047-d79a71a590e8'),
    category: 'beaches',
    weather: '29°C Sunny',
    latitude: 4.1755,
    longitude: 73.5093,
    budget: 5500,
    bestTime: 'November - April',
  },
  {
    id: '8',
    name: 'Kyoto Bamboo Grove',
    location: 'Kyoto, Japan',
    rating: 4.8,
    description: 'Serene bamboo forest paths near historic shrines and traditional tea houses.',
    image: IMG('1493976040374-85c8e445f4f7'),
    category: 'nature',
    weather: '22°C Mild',
    latitude: 35.0170,
    longitude: 135.6726,
    budget: 3100,
    bestTime: 'March - May',
  },
];

export const filterMockPlaces = (query = '', category = '') => {
  let list = [...MOCK_PLACES];
  if (category) list = list.filter((p) => p.category === category);
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  return list;
};

export const getMockPlaceById = (id) => MOCK_PLACES.find((p) => p.id === id) || MOCK_PLACES[0];
