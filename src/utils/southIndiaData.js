/** South India travel regions — Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana, Puducherry */

export const SOUTH_INDIA_STATES = ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Puducherry'];

export const DISTRICTS_BY_STATE = {
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Erode', 'Tirunelveli',
    'Ooty', 'Kodaikanal', 'Thanjavur', 'Trichy', 'Yercaud', 'Rameswaram', 'Kanyakumari',
  ],
  Kerala: [
    'Kochi', 'Munnar', 'Alleppey', 'Wayanad', 'Kozhikode', 'Idukki',
    'Thekkady', 'Varkala', 'Kannur',
  ],
  Karnataka: [
    'Bengaluru', 'Mysore', 'Coorg', 'Hampi', 'Chikmagalur', 'Gokarna', 'Udupi', 'Mangalore',
  ],
  'Andhra Pradesh': [
    'Tirupati', 'Visakhapatnam', 'Araku Valley', 'Amaravati', 'Gandikota',
  ],
  Telangana: [
    'Hyderabad', 'Warangal', 'Nagarjuna Sagar', 'Ananthagiri Hills',
  ],
  Puducherry: [
    'Pondicherry', 'Karaikal',
  ],
};

export const SOUTH_INDIA_CATEGORIES = [
  { id: 'beaches', label: 'Beaches' },
  { id: 'hills', label: 'Hills' },
  { id: 'temples', label: 'Temples' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'waterfalls', label: 'Waterfalls' },
  { id: 'nature', label: 'Nature' },
  { id: 'historical', label: 'Historical' },
];

const img = (id) => `https://images.unsplash.com/photo-${id}?w=900&q=80`;

const PLACES = [
  // Tamil Nadu
  { id: 'tn-chennai-marina', name: 'Marina Beach', district: 'Chennai', state: 'Tamil Nadu', category: 'beaches', rating: 4.5, lat: 13.0500, lng: 80.2824, budget: 1500, bestSeason: 'Nov - Feb', image: img('1582512286196-9eb83d8c0b0b'), description: 'One of the longest urban beaches in the world with sunset walks and street food.' },
  { id: 'tn-chennai-kapaleeshwarar', name: 'Kapaleeshwarar Temple', district: 'Chennai', state: 'Tamil Nadu', category: 'temples', rating: 4.7, lat: 13.0339, lng: 80.2700, budget: 800, bestSeason: 'Year-round', image: img('1588666309925-ef2b099b6a0a'), description: 'Iconic Dravidian temple dedicated to Lord Shiva in Mylapore.' },
  { id: 'tn-cbe-ooty-rail', name: 'Nilgiri Mountain Railway', district: 'Coimbatore', state: 'Tamil Nadu', category: 'nature', rating: 4.8, lat: 11.4064, lng: 76.6932, budget: 2200, bestSeason: 'Apr - Jun', image: img('1506905925346-21bda4d32df4'), description: 'UNESCO heritage toy train journey through misty blue hills.' },
  { id: 'tn-madurai-meenakshi', name: 'Meenakshi Amman Temple', district: 'Madurai', state: 'Tamil Nadu', category: 'temples', rating: 4.9, lat: 9.9195, lng: 78.1193, budget: 1200, bestSeason: 'Oct - Mar', image: img('1537996192894-86f8a88d2b4d'), description: 'Magnificent temple complex with towering gopurams and vibrant rituals.' },
  { id: 'tn-salem-yercaud', name: 'Yercaud Lake', district: 'Yercaud', state: 'Tamil Nadu', category: 'hills', rating: 4.4, lat: 11.7753, lng: 78.2093, budget: 1800, bestSeason: 'Sep - May', image: img('1469474968028-56623f02e42e'), description: 'Serene hill-station lake surrounded by coffee estates and forests.' },
  { id: 'tn-ooty-botanical', name: 'Government Botanical Garden', district: 'Ooty', state: 'Tamil Nadu', category: 'nature', rating: 4.6, lat: 11.4064, lng: 76.7100, budget: 2000, bestSeason: 'Mar - Jun', image: img('1506905925346-21bda4d32df4'), description: 'Lush colonial-era gardens with rare plants and flower shows.' },
  { id: 'tn-ooty-doddabetta', name: 'Doddabetta Peak', district: 'Ooty', state: 'Tamil Nadu', category: 'hills', rating: 4.5, lat: 11.4001, lng: 76.7354, budget: 2100, bestSeason: 'Apr - Jun', image: img('1476514525535-07fb3b4d462a'), description: 'Highest point in the Nilgiris with panoramic valley views.' },
  { id: 'tn-kodaikanal-lake', name: 'Kodaikanal Lake', district: 'Kodaikanal', state: 'Tamil Nadu', category: 'hills', rating: 4.7, lat: 10.2381, lng: 77.4892, budget: 2400, bestSeason: 'Sep - May', image: img('1488646953014-85cb44e25828'), description: 'Star-shaped lake perfect for boating and misty morning walks.' },
  { id: 'tn-thanjavur-brihadeeswara', name: 'Brihadeeswara Temple', district: 'Thanjavur', state: 'Tamil Nadu', category: 'historical', rating: 4.9, lat: 10.7829, lng: 79.1318, budget: 1100, bestSeason: 'Nov - Feb', image: img('1537996192894-86f8a88d2b4d'), description: 'UNESCO Chola masterpiece with a massive granite vimana.' },
  { id: 'tn-trichy-rockfort', name: 'Rockfort Temple', district: 'Trichy', state: 'Tamil Nadu', category: 'temples', rating: 4.6, lat: 10.8282, lng: 78.6929, budget: 1000, bestSeason: 'Oct - Mar', image: img('1588666309925-ef2b099b6a0a'), description: 'Ancient temple atop a 83m rock with city views.' },
  { id: 'tn-rameswaram-pamban', name: 'Pamban Bridge', district: 'Rameswaram', state: 'Tamil Nadu', category: 'historical', rating: 4.7, lat: 9.2881, lng: 79.3127, budget: 1600, bestSeason: 'Oct - Mar', image: img('1558981284-6d48e2417e5e'), description: 'India\'s first sea bridge connecting mainland to sacred Rameswaram island.' },
  { id: 'tn-kanyakumari-vivekananda', name: 'Vivekananda Rock Memorial', district: 'Kanyakumari', state: 'Tamil Nadu', category: 'historical', rating: 4.8, lat: 8.0780, lng: 77.5550, budget: 1400, bestSeason: 'Oct - Mar', image: img('1514282401047-d79a71a590e8'), description: 'Where three seas meet — stunning sunrise and spiritual heritage.' },
  { id: 'tn-erode-kodiveri', name: 'Kodiveri Falls', district: 'Erode', state: 'Tamil Nadu', category: 'waterfalls', rating: 4.3, lat: 11.4200, lng: 77.2800, budget: 1300, bestSeason: 'Jul - Dec', image: img('1558981284-6d48e2417e5e'), description: 'Picturesque cascade on the Bhavani river ideal for day trips.' },
  { id: 'tn-tirunelveli-courtallam', name: 'Courtallam Falls', district: 'Tirunelveli', state: 'Tamil Nadu', category: 'waterfalls', rating: 4.5, lat: 8.9300, lng: 77.2800, budget: 1500, bestSeason: 'Jun - Sep', image: img('1558981284-6d48e2417e5e'), description: 'The "Spa of South India" — therapeutic waterfalls in the Western Ghats.' },

  // Kerala
  { id: 'kl-kochi-fort', name: 'Fort Kochi', district: 'Kochi', state: 'Kerala', category: 'historical', rating: 4.7, lat: 9.9658, lng: 76.2425, budget: 2200, bestSeason: 'Oct - Mar', image: img('1582512286196-9eb83d8c0b0b'), description: 'Colonial streets, Chinese fishing nets, and vibrant art cafés.' },
  { id: 'kl-munnar-tea', name: 'Munnar Tea Gardens', district: 'Munnar', state: 'Kerala', category: 'hills', rating: 4.8, lat: 10.0889, lng: 77.0595, budget: 2800, bestSeason: 'Sep - May', image: img('1506905925346-21bda4d32df4'), description: 'Rolling emerald tea estates, mist, and cool mountain air.' },
  { id: 'kl-alleppey-houseboat', name: 'Alleppey Backwaters', district: 'Alleppey', state: 'Kerala', category: 'nature', rating: 4.9, lat: 9.4981, lng: 76.3388, budget: 3500, bestSeason: 'Nov - Feb', image: img('1514282401047-d79a71a590e8'), description: 'Houseboat cruises through palm-fringed canals and lagoons.' },
  { id: 'kl-wayanad-edakkal', name: 'Edakkal Caves', district: 'Wayanad', state: 'Kerala', category: 'adventure', rating: 4.5, lat: 11.6600, lng: 76.2400, budget: 2000, bestSeason: 'Oct - May', image: img('1469474968028-56623f02e42e'), description: 'Prehistoric petroglyphs in a scenic cave complex.' },
  { id: 'kl-kozhikode-beach', name: 'Kozhikode Beach', district: 'Kozhikode', state: 'Kerala', category: 'beaches', rating: 4.4, lat: 11.2588, lng: 75.7804, budget: 1800, bestSeason: 'Oct - Mar', image: img('1582512286196-9eb83d8c0b0b'), description: 'Historic Malabar coast with legendary seafood and sunsets.' },
  { id: 'kl-idukki-dam', name: 'Idukki Arch Dam', district: 'Idukki', state: 'Kerala', category: 'nature', rating: 4.6, lat: 9.8500, lng: 76.9700, budget: 2100, bestSeason: 'Sep - Feb', image: img('1476514525535-07fb3b4d462a'), description: 'Asia\'s first arch dam set in dramatic Western Ghats scenery.' },
  { id: 'kl-thekkady-periyar', name: 'Periyar Wildlife Sanctuary', district: 'Thekkady', state: 'Kerala', category: 'nature', rating: 4.7, lat: 9.6000, lng: 77.1700, budget: 3200, bestSeason: 'Oct - Mar', image: img('1516026672322-bc52c845a3a5'), description: 'Boat safaris to spot elephants and birds by Periyar Lake.' },
  { id: 'kl-varkala-cliff', name: 'Varkala Cliff Beach', district: 'Varkala', state: 'Kerala', category: 'beaches', rating: 4.6, lat: 8.7379, lng: 76.7163, budget: 2400, bestSeason: 'Oct - Mar', image: img('1514282401047-d79a71a590e8'), description: 'Cliff-top beach with Ayurveda retreats and golden sunsets.' },
  { id: 'kl-kannur-theyyam', name: 'Payyambalam Beach', district: 'Kannur', state: 'Kerala', category: 'beaches', rating: 4.5, lat: 11.8745, lng: 75.3704, budget: 2000, bestSeason: 'Oct - Mar', image: img('1582512286196-9eb83d8c0b0b'), description: 'Quiet northern Kerala coast near Theyyam cultural heartland.' },

  // Karnataka
  { id: 'ka-blr-lalbagh', name: 'Lalbagh Botanical Garden', district: 'Bengaluru', state: 'Karnataka', category: 'nature', rating: 4.5, lat: 12.9507, lng: 77.5848, budget: 1800, bestSeason: 'Year-round', image: img('1469474968028-56623f02e42e'), description: 'Historic 240-acre garden with glass house and flower shows.' },
  { id: 'ka-blr-palace', name: 'Bangalore Palace', district: 'Bengaluru', state: 'Karnataka', category: 'historical', rating: 4.4, lat: 12.9986, lng: 77.5921, budget: 1600, bestSeason: 'Year-round', image: img('1537996192894-86f8a88d2b4d'), description: 'Tudor-style palace with ornate interiors and sprawling grounds.' },
  { id: 'ka-mysore-palace', name: 'Mysore Palace', district: 'Mysore', state: 'Karnataka', category: 'historical', rating: 4.9, lat: 12.3051, lng: 76.6551, budget: 1500, bestSeason: 'Oct - Mar', image: img('1537996192894-86f8a88d2b4d'), description: 'Illuminated royal residence and Dasara festival centerpiece.' },
  { id: 'ka-mysore-chamundi', name: 'Chamundi Hills', district: 'Mysore', state: 'Karnataka', category: 'temples', rating: 4.6, lat: 12.2729, lng: 76.6700, budget: 1200, bestSeason: 'Year-round', image: img('1588666309925-ef2b099b6a0a'), description: 'Hilltop temple with city panoramas and giant Nandi statue.' },
  { id: 'ka-coorg-abbey', name: 'Abbey Falls', district: 'Coorg', state: 'Karnataka', category: 'waterfalls', rating: 4.5, lat: 12.4500, lng: 75.7200, budget: 2600, bestSeason: 'Jul - Feb', image: img('1558981284-6d48e2417e5e'), description: 'Coffee-country waterfall amid lush Kodagu rainforest.' },
  { id: 'ka-coorg-raja', name: 'Raja\'s Seat', district: 'Coorg', state: 'Karnataka', category: 'hills', rating: 4.4, lat: 12.4200, lng: 75.7400, budget: 2500, bestSeason: 'Sep - May', image: img('1476514525535-07fb3b4d462a'), description: 'Sunset viewpoint once favored by Kodagu kings.' },
  { id: 'ka-hampi-virupaksha', name: 'Virupaksha Temple', district: 'Hampi', state: 'Karnataka', category: 'historical', rating: 4.9, lat: 15.3350, lng: 76.4600, budget: 1800, bestSeason: 'Oct - Feb', image: img('1537996192894-86f8a88d2b4d'), description: 'UNESCO Vijayanagara ruins on the Tungabhadra riverbanks.' },
  { id: 'ka-hampi-boulder', name: 'Hampi Boulders', district: 'Hampi', state: 'Karnataka', category: 'adventure', rating: 4.7, lat: 15.3200, lng: 76.4700, budget: 1900, bestSeason: 'Nov - Feb', image: img('1469474968028-56623f02e42e'), description: 'Otherworldly granite landscapes for bouldering and photography.' },
  { id: 'ka-chikmagalur-mullayanagiri', name: 'Mullayanagiri Peak', district: 'Chikmagalur', state: 'Karnataka', category: 'hills', rating: 4.6, lat: 13.3900, lng: 75.7200, budget: 2300, bestSeason: 'Sep - Feb', image: img('1506905925346-21bda4d32df4'), description: 'Karnataka\'s highest peak in the coffee land of Chikmagalur.' },
  { id: 'ka-gokarna-beach', name: 'Om Beach', district: 'Gokarna', state: 'Karnataka', category: 'beaches', rating: 4.6, lat: 14.5170, lng: 74.3188, budget: 2000, bestSeason: 'Oct - Mar', image: img('1514282401047-d79a71a590e8'), description: 'Laid-back coastal paradise shaped like the sacred Om symbol.' },
  { id: 'ka-udupi-krishna', name: 'Udupi Sri Krishna Temple', district: 'Udupi', state: 'Karnataka', category: 'temples', rating: 4.7, lat: 13.3409, lng: 74.7421, budget: 1400, bestSeason: 'Year-round', image: img('1588666309925-ef2b099b6a0a'), description: 'Famous temple town and birthplace of Udupi cuisine.' },
  { id: 'ka-mangalore-panambur', name: 'Panambur Beach', district: 'Mangalore', state: 'Karnataka', category: 'beaches', rating: 4.4, lat: 12.9464, lng: 74.8030, budget: 1700, bestSeason: 'Oct - Mar', image: img('1582512286196-9eb83d8c0b0b'), description: 'Clean urban beach with water sports on the Arabian Sea.' },

  // Andhra Pradesh
  { id: 'ap-tirupati', name: 'Tirumala Venkateswara Temple', district: 'Tirupati', state: 'Andhra Pradesh', category: 'temples', rating: 4.9, lat: 13.6833, lng: 79.3500, budget: 1500, bestSeason: 'Sep - Mar', image: img('1588666309925-ef2b099b6a0a'), description: 'Sacred hilltop temple of Lord Venkateswara, one of the most visited pilgrimage sites globally.' },
  { id: 'ap-araku', name: 'Araku Valley Coffee Gardens', district: 'Araku Valley', state: 'Andhra Pradesh', category: 'hills', rating: 4.6, lat: 18.3333, lng: 82.8833, budget: 2000, bestSeason: 'Oct - Mar', image: img('1469474968028-56623f02e42e'), description: 'Scenic hill station famous for its coffee plantations, tribal culture, and waterfalls.' },
  { id: 'ap-rishikonda', name: 'Rishikonda Beach', district: 'Visakhapatnam', state: 'Andhra Pradesh', category: 'beaches', rating: 4.5, lat: 17.7820, lng: 83.3854, budget: 1200, bestSeason: 'Oct - Mar', image: img('1582512286196-9eb83d8c0b0b'), description: 'Beautiful sandy beach ideal for water sports and evening walks.' },
  { id: 'ap-gandikota', name: 'Gandikota Fort & Canyon', district: 'Gandikota', state: 'Andhra Pradesh', category: 'historical', rating: 4.7, lat: 14.8152, lng: 78.2868, budget: 1800, bestSeason: 'Sep - Feb', image: img('1476514525535-07fb3b4d462a'), description: 'Stunning gorge carved by the Pennar river, known as the Grand Canyon of India.' },
  { id: 'ap-amaravati', name: 'Amaravati Stupa', district: 'Amaravati', state: 'Andhra Pradesh', category: 'historical', rating: 4.4, lat: 16.5744, lng: 80.3575, budget: 1000, bestSeason: 'Nov - Feb', image: img('1537996192894-86f8a88d2b4d'), description: 'Ancient Buddhist site featuring a massive stupa and museum with relic treasures.' },

  // Telangana
  { id: 'tg-charminar', name: 'Charminar', district: 'Hyderabad', state: 'Telangana', category: 'historical', rating: 4.7, lat: 17.3616, lng: 78.4747, budget: 1000, bestSeason: 'Oct - Mar', image: img('1537996192894-86f8a88d2b4d'), description: 'Global icon of Hyderabad, a 16th-century mosque with four grand arches and minarets.' },
  { id: 'tg-golconda', name: 'Golconda Fort', district: 'Hyderabad', state: 'Telangana', category: 'historical', rating: 4.8, lat: 17.3833, lng: 78.4011, budget: 1200, bestSeason: 'Nov - Feb', image: img('1582512286196-9eb83d8c0b0b'), description: 'Fortified citadel of the Qutb Shahi dynasty famous for its acoustic effects and light show.' },
  { id: 'tg-warangal', name: 'Thousand Pillar Temple', district: 'Warangal', state: 'Telangana', category: 'temples', rating: 4.6, lat: 18.0033, lng: 79.5694, budget: 900, bestSeason: 'Oct - Mar', image: img('1588666309925-ef2b099b6a0a'), description: 'Masterpiece of Kakatiya sculpture dedicated to Lord Shiva, Vishnu, and Surya.' },
  { id: 'tg-nagarjuna', name: 'Nagarjuna Sagar Dam', district: 'Nagarjuna Sagar', state: 'Telangana', category: 'nature', rating: 4.5, lat: 16.5800, lng: 79.3100, budget: 1500, bestSeason: 'Aug - Dec', image: img('1476514525535-07fb3b4d462a'), description: 'One of the world\'s largest masonry dams, creating a giant lake on the Krishna River.' },

  // Puducherry
  { id: 'py-promenade', name: 'Promenade Beach', district: 'Pondicherry', state: 'Puducherry', category: 'beaches', rating: 4.6, lat: 11.9348, lng: 79.8373, budget: 1500, bestSeason: 'Oct - Mar', image: img('1514282401047-d79a71a590e8'), description: 'Scenic beachfront promenade lined with colonial buildings and cafes.' },
  { id: 'py-auroville', name: 'Matrimandir, Auroville', district: 'Pondicherry', state: 'Puducherry', category: 'historical', rating: 4.8, lat: 12.0068, lng: 79.8105, budget: 2000, bestSeason: 'Nov - Feb', image: img('1582512286196-9eb83d8c0b0b'), description: 'Golden metallic sphere representing peace, located in the experimental township of Auroville.' }
];

export const getDistrictsForState = (state) => DISTRICTS_BY_STATE[state] || [];

export const isSouthIndiaState = (state) => SOUTH_INDIA_STATES.includes(state);

export const filterSouthIndiaPlaces = ({
  state = '',
  district = '',
  category = '',
  query = '',
  section = '',
} = {}) => {
  let list = [...PLACES];

  if (state) list = list.filter((p) => p.state === state);
  if (district) list = list.filter((p) => p.district === district);
  if (category) list = list.filter((p) => p.category === category);
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (section === 'trending') list = [...list].sort((a, b) => b.rating - a.rating).slice(0, 8);
  if (section === 'weekend') list = list.filter((p) => ['hills', 'beaches', 'nature'].includes(p.category)).slice(0, 8);
  if (section === 'hidden') list = [...list].reverse().slice(0, 8);
  if (section === 'nature') list = list.filter((p) => ['nature', 'waterfalls', 'hills'].includes(p.category));

  return list.map(enrichPlace);
};

export const getPlaceById = (id) => {
  const p = PLACES.find((x) => x.id === id);
  return p ? enrichPlace(p) : null;
};

export const enrichPlace = (p) => ({
  ...p,
  latitude: p.latitude ?? p.lat,
  longitude: p.longitude ?? p.lng,
  lat: p.lat ?? p.latitude,
  lng: p.lng ?? p.longitude,
  location: `${p.district}, ${p.state}`,
  weather: p.weather || '24°C Pleasant',
  travelTips: p.travelTips || `Best visited during ${p.bestSeason}. Explore local cuisine and culture in ${p.district}.`,
});

export const getAllSouthIndiaPlaces = () => PLACES.map(enrichPlace);

export const getSearchSuggestions = (query, limit = 6) => {
  if (!query?.trim()) return [];
  const q = query.toLowerCase();
  const matches = PLACES.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.state.toLowerCase().startsWith(q)
  );
  const districts = Object.entries(DISTRICTS_BY_STATE).flatMap(([state, dists]) =>
    dists.filter((d) => d.toLowerCase().includes(q)).map((d) => ({ type: 'district', name: d, state }))
  );
  return [
    ...matches.slice(0, limit).map((p) => ({ type: 'place', ...enrichPlace(p) })),
    ...districts.slice(0, 3).map((d) => ({ type: 'district', name: d.name, state: d.state, label: `${d.name}, ${d.state}` })),
  ].slice(0, limit);
};
