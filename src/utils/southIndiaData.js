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
    'Shivamogga', 'Belagavi', 'Dandeli', 'Vijayapura',
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

const img = (id) => `https://images.unsplash.com/photo-${id}?w=900&q=80`; const PLACES = [
  // Tamil Nadu
  { id: 'tn-chennai-marina', name: 'Marina Beach', district: 'Chennai', state: 'Tamil Nadu', category: 'beaches', rating: 4.5, lat: 13.0500, lng: 80.2824, budget: 1500, bestSeason: 'Nov - Feb', image: img('1582512286196-9eb83d8c0b0b'), description: 'One of the longest urban beaches in the world with sunset walks and street food.' },
  { id: 'tn-chennai-kapaleeshwarar', name: 'Kapaleeshwarar Temple', district: 'Chennai', state: 'Tamil Nadu', category: 'temples', rating: 4.7, lat: 13.0339, lng: 80.2700, budget: 800, bestSeason: 'Year-round', image: img('1588666309925-ef2b099b6a0a'), description: 'Iconic Dravidian temple dedicated to Lord Shiva in Mylapore.' },
  { id: 'tn-chennai-elliots', name: 'Elliot\'s Beach', district: 'Chennai', state: 'Tamil Nadu', category: 'beaches', rating: 4.4, lat: 12.9984, lng: 80.2755, budget: 1000, bestSeason: 'Nov - Feb', image: img('1544735716-392fe2489ffa'), description: 'Calm beach popular with youth, featuring the Schmidt Memorial and cozy cafes.' },
  { id: 'tn-cbe-ooty-rail', name: 'Nilgiri Mountain Railway', district: 'Coimbatore', state: 'Tamil Nadu', category: 'nature', rating: 4.8, lat: 11.4064, lng: 76.6932, budget: 2200, bestSeason: 'Apr - Jun', image: img('1506905925346-21bda4d32df4'), description: 'UNESCO heritage toy train journey through misty blue hills and deep valleys.' },
  { id: 'tn-cbe-marudhamalai', name: 'Marudhamalai Temple', district: 'Coimbatore', state: 'Tamil Nadu', category: 'temples', rating: 4.6, lat: 11.0456, lng: 76.8833, budget: 800, bestSeason: 'Year-round', image: img('1600100397608-f010e9602e1c'), description: 'Hilltop temple dedicated to Lord Murugan, set amidst lush green surroundings.' },
  { id: 'tn-madurai-meenakshi', name: 'Meenakshi Amman Temple', district: 'Madurai', state: 'Tamil Nadu', category: 'temples', rating: 4.9, lat: 9.9195, lng: 78.1193, budget: 1200, bestSeason: 'Oct - Mar', image: img('1537996192894-86f8a88d2b4d'), description: 'Magnificent temple complex with towering gopurams and vibrant spiritual rituals.' },
  { id: 'tn-madurai-mahal', name: 'Thirumalai Nayakkar Mahal', district: 'Madurai', state: 'Tamil Nadu', category: 'historical', rating: 4.5, lat: 9.9150, lng: 78.1235, budget: 900, bestSeason: 'Oct - Mar', image: img('1545569341-9eb8b30979d9'), description: '17th-century palace built by the Nayak dynasty, famous for giant pillars.' },
  { id: 'tn-salem-yercaud', name: 'Yercaud', district: 'Yercaud', state: 'Tamil Nadu', category: 'hills', rating: 4.4, lat: 11.7753, lng: 78.2093, budget: 1800, bestSeason: 'Sep - May', image: img('1469474968028-56623f02e42e'), description: 'Serene hill-station lake surrounded by coffee estates and thick forests.' },
  { id: 'tn-salem-kiliyur', name: 'Kiliyur Falls', district: 'Salem', state: 'Tamil Nadu', category: 'waterfalls', rating: 4.4, lat: 11.7925, lng: 78.2045, budget: 1200, bestSeason: 'Jul - Nov', image: img('1470071459604-3b5ec3a7fe05'), description: 'A beautiful 90-foot waterfall in the Shevaroy Hills, perfect for trekking.' },
  { id: 'tn-ooty-botanical', name: 'Government Botanical Garden', district: 'Ooty', state: 'Tamil Nadu', category: 'nature', rating: 4.6, lat: 11.4064, lng: 76.7100, budget: 2000, bestSeason: 'Mar - Jun', image: img('1506905925346-21bda4d32df4'), description: 'Lush colonial-era gardens with thousands of rare plants and flower shows.' },
  { id: 'tn-ooty-doddabetta', name: 'Doddabetta Peak', district: 'Ooty', state: 'Tamil Nadu', category: 'hills', rating: 4.5, lat: 11.4001, lng: 76.7354, budget: 2100, bestSeason: 'Apr - Jun', image: img('1476514525535-07fb3b4d462a'), description: 'Highest point in the Nilgiris, offering telescope house views of valleys.' },
  { id: 'tn-kodaikanal-lake', name: 'Kodaikanal Lake', district: 'Kodaikanal', state: 'Tamil Nadu', category: 'hills', rating: 4.7, lat: 10.2381, lng: 77.4892, budget: 2400, bestSeason: 'Sep - May', image: img('1488646953014-85cb44e25828'), description: 'Star-shaped lake perfect for rowing boats, walking, and cycling around.' },
  { id: 'tn-kodaikanal-pillar', name: 'Pillar Rocks', district: 'Kodaikanal', state: 'Tamil Nadu', category: 'hills', rating: 4.6, lat: 10.2185, lng: 77.4645, budget: 1500, bestSeason: 'Sep - May', image: img('1486873249359-2731bd6da57b'), description: 'Three massive granite rock pillars standing tall amidst mist and clouds.' },
  { id: 'tn-thanjavur-brihadeeswara', name: 'Brihadeeswara Temple', district: 'Thanjavur', state: 'Tamil Nadu', category: 'historical', rating: 4.9, lat: 10.7829, lng: 79.1318, budget: 1100, bestSeason: 'Nov - Feb', image: img('1537996192894-86f8a88d2b4d'), description: 'UNESCO Chola masterpiece featuring a giant monolithic Nandi and vimana.' },
  { id: 'tn-trichy-rockfort', name: 'Rockfort Temple', district: 'Trichy', state: 'Tamil Nadu', category: 'temples', rating: 4.6, lat: 10.8282, lng: 78.6929, budget: 1000, bestSeason: 'Oct - Mar', image: img('1588666309925-ef2b099b6a0a'), description: 'Ancient temple structure perched atop a massive 83-meter-tall rock.' },
  { id: 'tn-trichy-srirangam', name: 'Ranganathaswamy Temple', district: 'Trichy', state: 'Tamil Nadu', category: 'temples', rating: 4.9, lat: 10.8622, lng: 78.6902, budget: 1200, bestSeason: 'Oct - Mar', image: img('1609137144815-5e0427c3d26f'), description: 'Huge active temple complex spanning 156 acres, dedicated to Lord Ranganatha.' },
  { id: 'tn-rameswaram-pamban', name: 'Pamban Bridge', district: 'Rameswaram', state: 'Tamil Nadu', category: 'historical', rating: 4.7, lat: 9.2881, lng: 79.3127, budget: 1600, bestSeason: 'Oct - Mar', image: img('1558981284-6d48e2417e5e'), description: 'India\'s historic sea bridge connecting mainland to the holy Rameswaram island.' },
  { id: 'tn-rameswaram-dhanushkodi', name: 'Dhanushkodi Beach', district: 'Rameswaram', state: 'Tamil Nadu', category: 'beaches', rating: 4.8, lat: 9.1554, lng: 79.4183, budget: 2000, bestSeason: 'Oct - Mar', image: img('1507525428034-b723cf961d3e'), description: 'Stunning ghost town beach where the Bay of Bengal and Indian Ocean merge.' },
  { id: 'tn-kanyakumari-vivekananda', name: 'Vivekananda Rock Memorial', district: 'Kanyakumari', state: 'Tamil Nadu', category: 'historical', rating: 4.8, lat: 8.0780, lng: 77.5550, budget: 1400, bestSeason: 'Oct - Mar', image: img('1514282401047-d79a71a590e8'), description: 'Offshore rock memorial honoring Swami Vivekananda, where three oceans meet.' },
  { id: 'tn-erode-kodiveri', name: 'Kodiveri Falls', district: 'Erode', state: 'Tamil Nadu', category: 'waterfalls', rating: 4.3, lat: 11.4200, lng: 77.2800, budget: 1300, bestSeason: 'Jul - Dec', image: img('1518495973542-4542c06a5843'), description: 'Picturesque waterfall cascade on Bhavani river, popular for picnics.' },
  { id: 'tn-erode-bhavanisagar', name: 'Bhavanisagar Dam', district: 'Erode', state: 'Tamil Nadu', category: 'nature', rating: 4.4, lat: 11.4689, lng: 77.1158, budget: 1500, bestSeason: 'Aug - Jan', image: img('1472214222541-d510753a49f8'), description: 'One of the largest earthen dams in the world with parks and play areas.' },
  { id: 'tn-tirunelveli-courtallam', name: 'Courtallam Falls', district: 'Tirunelveli', state: 'Tamil Nadu', category: 'waterfalls', rating: 4.5, lat: 8.9300, lng: 77.2800, budget: 1500, bestSeason: 'Jun - Sep', image: img('1558981284-6d48e2417e5e'), description: 'Therapeutic waterfalls in the Western Ghats, called the Spa of South India.' },
  { id: 'tn-tirunelveli-tiger', name: 'KMTR Tiger Reserve', district: 'Tirunelveli', state: 'Tamil Nadu', category: 'nature', rating: 4.6, lat: 8.6500, lng: 77.3000, budget: 2500, bestSeason: 'Oct - Mar', image: img('1516026672322-bc52c845a3a5'), description: 'Kalakkad Mundanthurai Tiger Reserve, a rich biodiversity hot-spot.' },
  { id: 'tn-cbe-adiyogi', name: 'Adiyogi Shiva Statue', district: 'Coimbatore', state: 'Tamil Nadu', category: 'historical', rating: 4.8, lat: 10.9755, lng: 76.7407, budget: 1500, bestSeason: 'Year-round', image: img('1500530855697-b586d89ba3ee'), description: 'World-famous 112-foot Shiva statue and spiritual destination at Isha Yoga Center.' },
  { id: 'tn-cbe-siruvani', name: 'Siruvani Waterfalls', district: 'Coimbatore', state: 'Tamil Nadu', category: 'waterfalls', rating: 4.6, lat: 10.9498, lng: 76.6820, budget: 1400, bestSeason: 'Jul - Jan', image: img('1518495973542-4542c06a5843'), description: 'Scenic waterfall known for its crystal-clear water and lush forest surroundings.' },
  { id: 'tn-ooty-pykara', name: 'Pykara Falls', district: 'Ooty', state: 'Tamil Nadu', category: 'waterfalls', rating: 4.5, lat: 11.4673, lng: 76.5985, budget: 1800, bestSeason: 'Apr - Jun', image: img('1558981284-6d48e2417e5e'), description: 'Popular waterfall and boating destination surrounded by pine forests.' },
  { id: 'tn-ooty-lake', name: 'Ooty Lake', district: 'Ooty', state: 'Tamil Nadu', category: 'nature', rating: 4.4, lat: 11.4060, lng: 76.6935, budget: 1700, bestSeason: 'Apr - Jun', image: img('1488646953014-85cb44e25828'), description: 'Artificial lake offering boating, cycling, and scenic hill views.' },
  { id: 'tn-kodaikanal-coakers', name: 'Coaker’s Walk', district: 'Kodaikanal', state: 'Tamil Nadu', category: 'nature', rating: 4.6, lat: 10.2322, lng: 77.4895, budget: 1200, bestSeason: 'Sep - May', image: img('1486873249359-2731bd6da57b'), description: 'Cliffside walking path offering panoramic valley and mountain views.' },
  { id: 'tn-kodaikanal-guna', name: 'Guna Caves', district: 'Kodaikanal', state: 'Tamil Nadu', category: 'nature', rating: 4.5, lat: 10.2215, lng: 77.4556, budget: 1500, bestSeason: 'Sep - May', image: img('1476514525535-07fb3b4d462a'), description: 'Mysterious cave system surrounded by dense pine forests and dramatic cliffs.' },
  { id: 'tn-madurai-gandhi', name: 'Gandhi Memorial Museum', district: 'Madurai', state: 'Tamil Nadu', category: 'historical', rating: 4.4, lat: 9.9380, lng: 78.1382, budget: 800, bestSeason: 'Oct - Mar', image: img('1545569341-9eb8b30979d9'), description: 'Museum showcasing India’s freedom struggle and Mahatma Gandhi’s life.' },
  { id: 'tn-thanjavur-palace', name: 'Thanjavur Palace', district: 'Thanjavur', state: 'Tamil Nadu', category: 'historical', rating: 4.4, lat: 10.7860, lng: 79.1378, budget: 1000, bestSeason: 'Nov - Feb', image: img('1545569341-9eb8b30979d9'), description: 'Historic Maratha palace complex featuring museums, towers, and art galleries.' },
  { id: 'tn-trichy-samayapuram', name: 'Samayapuram Mariamman Temple', district: 'Trichy', state: 'Tamil Nadu', category: 'temples', rating: 4.8, lat: 10.9195, lng: 78.7425, budget: 1000, bestSeason: 'Year-round', image: img('1588666309925-ef2b099b6a0a'), description: 'Renowned temple dedicated to Goddess Mariamman attracting millions of devotees.' },
  { id: 'tn-rameswaram-ramanathaswamy', name: 'Ramanathaswamy Temple', district: 'Rameswaram', state: 'Tamil Nadu', category: 'temples', rating: 4.9, lat: 9.2881, lng: 79.3174, budget: 1200, bestSeason: 'Oct - Mar', image: img('1609137144815-5e0427c3d26f'), description: 'Sacred Jyotirlinga temple famous for its massive corridors and holy wells.' },
  { id: 'tn-kanyakumari-thiruvalluvar', name: 'Thiruvalluvar Statue', district: 'Kanyakumari', state: 'Tamil Nadu', category: 'historical', rating: 4.7, lat: 8.0778, lng: 77.5548, budget: 1300, bestSeason: 'Oct - Mar', image: img('1514282401047-d79a71a590e8'), description: '133-foot stone statue dedicated to Tamil poet and philosopher Thiruvalluvar.' },
  { id: 'tn-dharmapuri-hogenakkal', name: 'Hogenakkal Falls', district: 'Dharmapuri', state: 'Tamil Nadu', category: 'waterfalls', rating: 4.7, lat: 12.1180, lng: 77.7755, budget: 1800, bestSeason: 'Jul - Jan', image: img('1518495973542-4542c06a5843'), description: 'Spectacular waterfall on the Kaveri River known as the Niagara of India.' },
  { id: 'tn-theni-meghamalai', name: 'Meghamalai', district: 'Theni', state: 'Tamil Nadu', category: 'hills', rating: 4.8, lat: 9.6730, lng: 77.3915, budget: 2200, bestSeason: 'Sep - May', image: img('1469474968028-56623f02e42e'), description: 'Pristine mountain range featuring tea estates, forests, and wildlife.' },
  { id: 'tn-kanchipuram-ekambareswarar', name: 'Ekambareswarar Temple', district: 'Kanchipuram', state: 'Tamil Nadu', category: 'temples', rating: 4.8, lat: 12.8475, lng: 79.6993, budget: 900, bestSeason: 'Year-round', image: img('1588666309925-ef2b099b6a0a'), description: 'Ancient Shiva temple famous for its towering gopuram and sacred mango tree.' },
  { id: 'tn-mahabalipuram-shore', name: 'Shore Temple', district: 'Chengalpattu', state: 'Tamil Nadu', category: 'historical', rating: 4.8, lat: 12.6166, lng: 80.1998, budget: 1400, bestSeason: 'Nov - Feb', image: img('1537996192894-86f8a88d2b4d'), description: 'UNESCO World Heritage monument overlooking the Bay of Bengal.' },
  { id: 'tn-cuddalore-pichavaram', name: 'Pichavaram Mangrove Forest', district: 'Cuddalore', state: 'Tamil Nadu', category: 'nature', rating: 4.7, lat: 11.4295, lng: 79.7900, budget: 1700, bestSeason: 'Nov - Feb', image: img('1516026672322-bc52c845a3a5'), description: 'One of the largest mangrove ecosystems in India with boating through waterways.' },
  { id: 'tn-nilgiris-mudumalai', name: 'Mudumalai Tiger Reserve', district: 'Nilgiris', state: 'Tamil Nadu', category: 'nature', rating: 4.8, lat: 11.5590, lng: 76.5345, budget: 2500, bestSeason: 'Oct - May', image: img('1516026672322-bc52c845a3a5'), description: 'Major wildlife reserve home to elephants, tigers, leopards, and diverse birdlife.' },


  { id: 'kl-kochi-fort', name: 'Fort Kochi', district: 'Kochi', state: 'Kerala', category: 'historical', rating: 4.7, lat: 9.9658, lng: 76.2425, budget: 2200, bestSeason: 'Oct - Mar', image: img('1582512286196-9eb83d8c0b0b'), description: 'Colonial heritage streets, famous giant Chinese fishing nets, and cafes.' },
  { id: 'kl-kochi-athirappilly', name: 'Athirappilly Waterfalls', district: 'Kochi', state: 'Kerala', category: 'waterfalls', rating: 4.9, lat: 10.2851, lng: 76.5694, budget: 1800, bestSeason: 'Jun - Nov', image: img('1470071459604-3b5ec3a7fe05'), description: 'Scenic 80-foot waterfall in lush rainforest, known as India\'s Niagara.' },
  { id: 'kl-munnar-tea', name: 'Munnar Tea Gardens', district: 'Munnar', state: 'Kerala', category: 'hills', rating: 4.8, lat: 10.0889, lng: 77.0595, budget: 2800, bestSeason: 'Sep - May', image: img('1506905925346-21bda4d32df4'), description: 'Endless rolling emerald tea estates, mist-covered hills, and mountain air.' },
  { id: 'kl-munnar-eravikulam', name: 'Eravikulam National Park', district: 'Munnar', state: 'Kerala', category: 'nature', rating: 4.7, lat: 10.1500, lng: 77.0600, budget: 2500, bestSeason: 'Sep - May', image: img('1441974231531-c6227db76b6e'), description: 'Home to the endangered Nilgiri Tahr mountain goat and misty valleys.' },
  { id: 'kl-munnar-mattupetty', name: 'Mattupetty Dam', district: 'Munnar', state: 'Kerala', category: 'adventure', rating: 4.5, lat: 10.1064, lng: 77.1245, budget: 2200, bestSeason: 'Sep - May', image: img('1472214222541-d510753a49f8'), description: 'Lake reservoir offering speedboat trips and beautiful reflection views.' },
  { id: 'kl-alleppey-houseboat', name: 'Alleppey Backwaters', district: 'Alleppey', state: 'Kerala', category: 'nature', rating: 4.9, lat: 9.4981, lng: 76.3388, budget: 3500, bestSeason: 'Nov - Feb', image: img('1514282401047-d79a71a590e8'), description: 'Houseboat cruises along serene palm-fringed canals, lagoons, and lakes.' },
  { id: 'kl-alleppey-marari', name: 'Marari Beach', district: 'Alleppey', state: 'Kerala', category: 'beaches', rating: 4.6, lat: 9.6015, lng: 76.2980, budget: 2800, bestSeason: 'Nov - Feb', image: img('1520250497591-112f2f40a3f4'), description: 'Quiet, clean beach popular for Ayurvedic resorts and lazy afternoons.' },
  { id: 'kl-wayanad-edakkal', name: 'Edakkal Caves', district: 'Wayanad', state: 'Kerala', category: 'adventure', rating: 4.5, lat: 11.6600, lng: 76.2400, budget: 2000, bestSeason: 'Oct - May', image: img('1469474968028-56623f02e42e'), description: 'Prehistoric stone carvings inside a natural cave atop Ambukuthi Hills.' },
  { id: 'kl-wayanad-banasura', name: 'Banasura Sagar Dam', district: 'Wayanad', state: 'Kerala', category: 'adventure', rating: 4.6, lat: 11.6400, lng: 75.9600, budget: 2200, bestSeason: 'Oct - May', image: img('1518495973542-4542c06a5843'), description: 'Largest earthen dam in India with trekking pathways and speedboats.' },
  { id: 'kl-kozhikode-beach', name: 'Kozhikode Beach', district: 'Kozhikode', state: 'Kerala', category: 'beaches', rating: 4.4, lat: 11.2588, lng: 75.7804, budget: 1800, bestSeason: 'Oct - Mar', image: img('1582512286196-9eb83d8c0b0b'), description: 'Historic coast with centennial piers, sunsets, and local delicacies.' },
  { id: 'kl-kozhikode-kappad', name: 'Kappad Beach', district: 'Kozhikode', state: 'Kerala', category: 'historical', rating: 4.6, lat: 11.3828, lng: 75.7188, budget: 1600, bestSeason: 'Oct - Mar', image: img('1507525428034-b723cf961d3e'), description: 'The famous shore where Vasco da Gama landed in 1498, marking the sea route.' },
  { id: 'kl-idukki-dam', name: 'Idukki Arch Dam', district: 'Idukki', state: 'Kerala', category: 'nature', rating: 4.6, lat: 9.8500, lng: 76.9700, budget: 2100, bestSeason: 'Sep - Feb', image: img('1476514525535-07fb3b4d462a'), description: 'Remarkable double-curvature arch dam built across the Kuravan and Kurathi hills.' },
  { id: 'kl-idukki-vagamon', name: 'Vagamon Pine Forest', district: 'Idukki', state: 'Kerala', category: 'hills', rating: 4.6, lat: 9.6800, lng: 76.9000, budget: 2300, bestSeason: 'Sep - May', image: img('1486873249359-2731bd6da57b'), description: 'Enchanting pine forest plantations and rolling meadows with cool winds.' },
  { id: 'kl-thekkady-periyar', name: 'Periyar Wildlife Sanctuary', district: 'Thekkady', state: 'Kerala', category: 'nature', rating: 4.7, lat: 9.6000, lng: 77.1700, budget: 3200, bestSeason: 'Oct - Mar', image: img('1516026672322-bc52c845a3a5'), description: 'Tiger and elephant forest reserve with boat tours on Periyar Lake.' },
  { id: 'kl-varkala-cliff', name: 'Varkala Cliff Beach', district: 'Varkala', state: 'Kerala', category: 'beaches', rating: 4.6, lat: 8.7379, lng: 76.7163, budget: 2400, bestSeason: 'Oct - Mar', image: img('1514282401047-d79a71a590e8'), description: 'Unique cliffs bordering the Arabian Sea, featuring mineral springs.' },
  { id: 'kl-kannur-theyyam',name: 'Payyambalam Beach', district: 'Kannur', state: 'Kerala', category: 'beaches', rating: 4.5, lat: 11.8745, lng: 75.3704, budget: 2000, bestSeason: 'Oct - Mar', image: img('1582512286196-9eb83d8c0b0b'), description: 'Serene beach near Kannur town, popular for soft sand walks.' },
  { id: 'kl-munnar-topstation', name: 'Top Station', district: 'Munnar', state: 'Kerala', category: 'hills', rating: 4.8, lat: 10.1147, lng: 77.2455, budget: 2500, bestSeason: 'Sep - May', image: img('1506905925346-21bda4d32df4'), description: 'Highest viewpoint in Munnar offering breathtaking views of the Western Ghats and Tamil Nadu plains.' },
  { id: 'kl-munnar-echo', name: 'Echo Point', district: 'Munnar', state: 'Kerala', category: 'nature', rating: 4.6, lat: 10.1216, lng: 77.1865, budget: 1800, bestSeason: 'Sep - May', image: img('1472214222541-d510753a49f8'), description: 'Scenic lake-side destination famous for natural echo phenomena and misty hills.' },
  { id: 'kl-thekkady-gavi', name: 'Gavi', district: 'Pathanamthitta', state: 'Kerala', category: 'nature', rating: 4.8, lat: 9.4367, lng: 77.1684, budget: 3000, bestSeason: 'Oct - Mar', image: img('1516026672322-bc52c845a3a5'), description: 'Eco-tourism hotspot featuring forests, wildlife, trekking trails, and pristine lakes.' },
  { id: 'kl-wayanad-chembra', name: 'Chembra Peak', district: 'Wayanad', state: 'Kerala', category: 'adventure', rating: 4.8, lat: 11.5335, lng: 76.0898, budget: 2200, bestSeason: 'Oct - May', image: img('1469474968028-56623f02e42e'), description: 'Popular trekking destination known for the heart-shaped lake and panoramic mountain views.' },
  { id: 'kl-wayanad-soochipara', name: 'Soochipara Falls', district: 'Wayanad', state: 'Kerala', category: 'waterfalls', rating: 4.7, lat: 11.5173, lng: 76.0813, budget: 2000, bestSeason: 'Jun - Jan', image: img('1470071459604-3b5ec3a7fe05'), description: 'Three-tier waterfall surrounded by dense forests and rocky cliffs.' },
  { id: 'kl-wayanad-kuruvadweep', name: 'Kuruva Island', district: 'Wayanad', state: 'Kerala', category: 'nature', rating: 4.6, lat: 11.8214, lng: 76.0875, budget: 1800, bestSeason: 'Oct - May', image: img('1516026672322-bc52c845a3a5'), description: 'Protected river delta with bamboo rafting, rare flora, and peaceful nature walks.' },
  { id: 'kl-alleppey-kumarakom', name: 'Kumarakom Bird Sanctuary', district: 'Kottayam', state: 'Kerala', category: 'nature', rating: 4.5, lat: 9.6175, lng: 76.4297, budget: 2200, bestSeason: 'Nov - Feb', image: img('1516026672322-bc52c845a3a5'), description: 'Famous bird sanctuary on Vembanad Lake attracting migratory birds from across the world.' },
  { id: 'kl-kovalam-beach', name: 'Kovalam Beach', district: 'Thiruvananthapuram', state: 'Kerala', category: 'beaches', rating: 4.8, lat: 8.4009, lng: 76.9784, budget: 2800, bestSeason: 'Oct - Mar', image: img('1520250497591-112f2f40a3f4'), description: 'World-famous crescent-shaped beach destination known for resorts, surfing, and sunsets.' },
  { id: 'kl-thiruvananthapuram-padmanabha', name: 'Sree Padmanabhaswamy Temple', district: 'Thiruvananthapuram', state: 'Kerala', category: 'temples', rating: 4.9, lat: 8.4828, lng: 76.9436, budget: 1500, bestSeason: 'Year-round', image: img('1588666309925-ef2b099b6a0a'), description: 'Ancient Vishnu temple renowned for its architecture and legendary treasure vaults.' },
  { id: 'kl-thiruvananthapuram-poovar', name: 'Poovar Island', district: 'Thiruvananthapuram', state: 'Kerala', category: 'nature', rating: 4.7, lat: 8.3156, lng: 77.0695, budget: 3000, bestSeason: 'Oct - Mar', image: img('1514282401047-d79a71a590e8'), description: 'Picturesque island where the river, lake, sea, and beach converge.' },
  { id: 'kl-kannur-stangelo', name: 'St. Angelo Fort', district: 'Kannur', state: 'Kerala', category: 'historical', rating: 4.6, lat: 11.8672, lng: 75.3522, budget: 1500, bestSeason: 'Oct - Mar', image: img('1545569341-9eb8b30979d9'), description: 'Historic Portuguese fort overlooking the Arabian Sea and Kannur coastline.' },
  { id: 'kl-kannur-muzhappilangad', name: 'Muzhappilangad Drive-in Beach', district: 'Kannur', state: 'Kerala', category: 'beaches', rating: 4.8, lat: 11.8002, lng: 75.4555, budget: 2200, bestSeason: 'Oct - Mar', image: img('1507525428034-b723cf961d3e'), description: 'India’s longest drive-in beach offering unique seaside driving experiences.' },
  { id: 'kl-kasaragod-bekal', name: 'Bekal Fort', district: 'Kasaragod', state: 'Kerala', category: 'historical', rating: 4.8, lat: 12.3926, lng: 75.0335, budget: 2000, bestSeason: 'Oct - Mar', image: img('1537996192894-86f8a88d2b4d'), description: 'Largest fort in Kerala featuring spectacular sea views and movie-famous landscapes.' },
  { id: 'kl-kasaragod-ranipuram', name: 'Ranipuram Hills', district: 'Kasaragod', state: 'Kerala', category: 'hills', rating: 4.7, lat: 12.4346, lng: 75.3597, budget: 2400, bestSeason: 'Oct - Feb', image: img('1469474968028-56623f02e42e'), description: 'Beautiful hill station with trekking trails, grasslands, and evergreen forests.' },
  { id: 'kl-palakkad-silentvalley', name: 'Silent Valley National Park', district: 'Palakkad', state: 'Kerala', category: 'nature', rating: 4.9, lat: 11.0737, lng: 76.5353, budget: 2800, bestSeason: 'Nov - Apr', image: img('1516026672322-bc52c845a3a5'), description: 'Pristine rainforest ecosystem known for rare wildlife and untouched biodiversity.' },
  { id: 'kl-palakkad-malampuzha', name: 'Malampuzha Dam', district: 'Palakkad', state: 'Kerala', category: 'nature', rating: 4.5, lat: 10.8406, lng: 76.6908, budget: 1800, bestSeason: 'Oct - Feb', image: img('1472214222541-d510753a49f8'), description: 'Popular dam destination with gardens, ropeway rides, and boating facilities.' },
  { id: 'kl-thrissur-guruvayur', name: 'Guruvayur Temple', district: 'Thrissur', state: 'Kerala', category: 'temples', rating: 4.9, lat: 10.5946, lng: 76.0411, budget: 1500, bestSeason: 'Year-round', image: img('1609137144815-5e0427c3d26f'), description: 'One of India’s most important Krishna temples attracting millions of devotees annually.' },
  { id: 'kl-thrissur-vazhachal', name: 'Vazhachal Waterfalls', district: 'Thrissur', state: 'Kerala', category: 'waterfalls', rating: 4.7, lat: 10.2984, lng: 76.5775, budget: 1800, bestSeason: 'Jun - Nov', image: img('1470071459604-3b5ec3a7fe05'), description: 'Beautiful waterfall located amidst dense tropical forests near Athirappilly.' },
  { id: 'kl-kochi-marine', name: 'Marine Drive', district: 'Kochi', state: 'Kerala', category: 'nature', rating: 4.6, lat: 9.9816, lng: 76.2750, budget: 1800, bestSeason: 'Oct - Mar', image: img('1514282401047-d79a71a590e8'), description: 'Popular waterfront promenade offering sunset views, shopping, and cruises.' },
  { id: 'kl-kochi-jewtown', name: 'Jew Town', district: 'Kochi', state: 'Kerala', category: 'historical', rating: 4.5, lat: 9.9570, lng: 76.2593, budget: 1500, bestSeason: 'Oct - Mar', image: img('1545569341-9eb8b30979d9'), description: 'Historic neighborhood featuring antique shops, synagogues, and colonial charm.' },
  // Karnataka
  { id: 'ka-blr-lalbagh', name: 'Lalbagh Botanical Garden', district: 'Bengaluru', state: 'Karnataka', category: 'nature', rating: 4.7, lat: 12.9507, lng: 77.5848, budget: 1200, bestSeason: 'Oct - Feb', image: img('1506744038136-46273834b3fb'), description: 'Historic botanical garden containing rare plants, lakes, and a glass house modeled on London\'s Crystal Palace.' },
  { id: 'ka-bengaluru-cubbon', name: 'Cubbon Park', district: 'Bengaluru', state: 'Karnataka', category: 'nature', rating: 4.6, lat: 12.9763, lng: 77.5929, budget: 1000, bestSeason: 'Oct - Feb', image: img('1511497584788-876760111969'), description: 'Large urban green space ideal for walking, cycling, and relaxation.' },
  { id: 'ka-blr-palace', name: 'Bangalore Palace', district: 'Bengaluru', state: 'Karnataka', category: 'historical', rating: 4.4, lat: 12.9986, lng: 77.5921, budget: 1600, bestSeason: 'Year-round', image: img('1537996192894-86f8a88d2b4d'), description: 'Tudor-style royal palace featuring majestic wooden carvings and gardens.' },
  { id: 'ka-blr-bannerghatta', name: 'Bannerghatta National Park', district: 'Bengaluru', state: 'Karnataka', category: 'nature', rating: 4.5, lat: 12.8009, lng: 77.5750, budget: 2500, bestSeason: 'Sep - Jan', image: img('1516026672322-bc52c845a3a5'), description: 'Lush park with animal safaris, a rescue center, and a multi-level butterfly house.' },
  { id: 'ka-mysore-palace', name: 'Mysore Palace', district: 'Mysore', state: 'Karnataka', category: 'historical', rating: 4.9, lat: 12.3051, lng: 76.6551, budget: 1500, bestSeason: 'Oct - Mar', image: img('1548013146-72479768bada'), description: 'Magnificent royal palace of the Wodeyars, famous for its grand architecture and evening illuminations.' },
  { id: 'ka-mysore-chamundi', name: 'Chamundi Hills', district: 'Mysore', state: 'Karnataka', category: 'temples', rating: 4.8, lat: 12.2720, lng: 76.6707, budget: 1200, bestSeason: 'Oct - Mar', image: img('1588666309925-ef2b099b6a0a'), description: 'Sacred hilltop temple of Goddess Chamundeshwari with a massive stone Nandi and panoramic city views.' },
  { id: 'ka-mysore-brindavan', name: 'Brindavan Gardens', district: 'Mysore', state: 'Karnataka', category: 'nature', rating: 4.5, lat: 12.4278, lng: 76.5722, budget: 1200, bestSeason: 'Oct - Mar', image: img('1469474968028-56623f02e42e'), description: 'Terraced flower gardens alongside the KRS dam, famous for musical fountains.' },
  { id: 'ka-bandipur-nationalpark', name: 'Bandipur National Park', district: 'Mysore', state: 'Karnataka', category: 'nature', rating: 4.8, lat: 11.6586, lng: 76.6298, budget: 2800, bestSeason: 'Oct - May', image: img('1516026672322-bc52c845a3a5'), description: 'Premier tiger reserve known for elephants, wildlife safaris, and dense forests.' },
  { id: 'ka-coorg-abbey', name: 'Abbey Falls', district: 'Coorg', state: 'Karnataka', category: 'waterfalls', rating: 4.6, lat: 12.4584, lng: 75.7398, budget: 1800, bestSeason: 'Jul - Feb', image: img('1470071459604-3b5ec3a7fe05'), description: 'Scenic waterfall flowing between coffee and spice plantations in Coorg.' },
  { id: 'ka-coorg-raja', name: 'Raja\'s Seat', district: 'Coorg', state: 'Karnataka', category: 'hills', rating: 4.7, lat: 12.4244, lng: 75.7382, budget: 1200, bestSeason: 'Oct - Mar', image: img('1514282401047-d79a71a590e8'), description: 'Famous sunset viewpoint and seasonal flower garden overlooking valleys and mist-covered hills.' },
  { id: 'ka-coorg-dubare', name: 'Dubare Elephant Camp', district: 'Coorg', state: 'Karnataka', category: 'adventure', rating: 4.6, lat: 12.3700, lng: 75.9000, budget: 3000, bestSeason: 'Sep - May', image: img('1516026672322-bc52c845a3a5'), description: 'Eco-camp on Cauvery river where visitors interact closely with elephants.' },
  { id: 'ka-hampi-virupaksha', name: 'Virupaksha Temple', district: 'Hampi', state: 'Karnataka', category: 'historical', rating: 4.9, lat: 15.3350, lng: 76.4600, budget: 1500, bestSeason: 'Oct - Feb', image: img('1539650116574-75c0c6d73f5d'), description: 'UNESCO World Heritage temple dedicated to Lord Shiva, active since the 7th century.' },
  { id: 'ka-hampi-boulder', name: 'Hampi Boulders', district: 'Hampi', state: 'Karnataka', category: 'adventure', rating: 4.7, lat: 15.3200, lng: 76.4700, budget: 1900, bestSeason: 'Nov - Feb', image: img('1469474968028-56623f02e42e'), description: 'Otherworldly rock formations and ruins along the Tungabhadra river.' },
  { id: 'ka-hampi-chariot', name: 'Stone Chariot Vittala Temple', district: 'Hampi', state: 'Karnataka', category: 'historical', rating: 4.9, lat: 15.3410, lng: 76.4670, budget: 1500, bestSeason: 'Nov - Feb', image: img('1512453979798-5ea266f8880c'), description: 'Iconic monolithic stone chariot shrine located within the Vittala Temple complex.' },
  { id: 'ka-chikmagalur-mullayanagiri', name: 'Mullayanagiri Peak', district: 'Chikmagalur', state: 'Karnataka', category: 'hills', rating: 4.9, lat: 13.3908, lng: 75.7217, budget: 2200, bestSeason: 'Sep - Mar', image: img('1506905925346-21bda4d32df4'), description: 'The highest mountain peak in Karnataka, offering spectacular trekking, cold winds, and misty hiking trails.' },
  { id: 'ka-chikmagalur-bababudangiri', name: 'Baba Budangiri Hills', district: 'Chikmagalur', state: 'Karnataka', category: 'hills', rating: 4.8, lat: 13.4167, lng: 75.7667, budget: 2000, bestSeason: 'Sep - Mar', image: img('1486873249359-2731bd6da57b'), description: 'Scenic range named after Sufi saint Baba Budan, known for caves, coffee plantations, and trekking.' },
  { id: 'ka-dakshinakannada-kudremukh', name: 'Kudremukh Peak', district: 'Chikmagalur', state: 'Karnataka', category: 'adventure', rating: 4.9, lat: 13.1326, lng: 75.2516, budget: 2500, bestSeason: 'Oct - Feb', image: img('1469474968028-56623f02e42e'), description: 'Iconic trekking destination with rolling grasslands and breathtaking landscapes.' },
  { id: 'ka-gokarna-beach', name: 'Om Beach', district: 'Gokarna', state: 'Karnataka', category: 'beaches', rating: 4.8, lat: 14.5195, lng: 74.3180, budget: 2000, bestSeason: 'Oct - Mar', image: img('1520250497591-112f2f40a3f4'), description: 'Naturally shaped like the spiritual Om symbol, hosting scenic coastal views, beach shacks, and water activities.' },
  { id: 'ka-gokarna-kudle', name: 'Kudle Beach', district: 'Gokarna', state: 'Karnataka', category: 'beaches', rating: 4.6, lat: 14.5200, lng: 74.3100, budget: 1800, bestSeason: 'Oct - Mar', image: img('1507525428034-b723cf961d3e'), description: 'Quiet crescent beach surrounded by hills, famous for cafes and sunsets.' },
  { id: 'ka-gokarna-mahabaleshwar', name: 'Mahabaleshwar Temple', district: 'Gokarna', state: 'Karnataka', category: 'temples', rating: 4.8, lat: 14.5479, lng: 74.3188, budget: 1200, bestSeason: 'Year-round', image: img('1588666309925-ef2b099b6a0a'), description: 'Ancient Shiva temple attracting pilgrims from across India.' },
  { id: 'ka-udupi-krishna', name: 'Udupi Sri Krishna Temple', district: 'Udupi', state: 'Karnataka', category: 'temples', rating: 4.9, lat: 13.3409, lng: 74.7421, budget: 1200, bestSeason: 'Year-round', image: img('1609137144815-5e0427c3d26f'), description: 'Historic 13th-century pilgrimage temple dedicated to Lord Krishna, where worship is done through an ornate silver window.' },
  { id: 'ka-udupi-malpe', name: 'St. Mary\'s Island & Malpe Beach', district: 'Udupi', state: 'Karnataka', category: 'beaches', rating: 4.7, lat: 13.3486, lng: 74.6975, budget: 1800, bestSeason: 'Oct - May', image: img('1520250497591-112f2f40a3f4'), description: 'Popular beach destination famous for water sports and unique basaltic rock columnar formations on St. Mary\'s Island.' },
  { id: 'ka-mangalore-panambur', name: 'Panambur Beach', district: 'Mangalore', state: 'Karnataka', category: 'beaches', rating: 4.4, lat: 12.9464, lng: 74.8030, budget: 1700, bestSeason: 'Oct - Mar', image: img('1582512286196-9eb83d8c0b0b'), description: 'Safe and clean beach managed by a private agency, famous for kite festivals.' },
  { id: 'ka-mangalore-tannirbhavi', name: 'Tannirbhavi Beach', district: 'Mangalore', state: 'Karnataka', category: 'beaches', rating: 4.4, lat: 12.8944, lng: 74.8130, budget: 1500, bestSeason: 'Oct - Mar', image: img('1544735716-392fe2489ffa'), description: 'Serene beach flanked by tall pine trees, popular for quiet nature walks.' },
  { id: 'ka-shivamogga-jogfalls', name: 'Jog Falls', district: 'Shivamogga', state: 'Karnataka', category: 'waterfalls', rating: 4.9, lat: 14.2294, lng: 74.8103, budget: 2200, bestSeason: 'Jul - Dec', image: img('1558981284-6d48e2417e5e'), description: 'One of India’s tallest waterfalls, plunging dramatically from great heights.' },
  { id: 'ka-belagavi-gokak', name: 'Gokak Falls', district: 'Belagavi', state: 'Karnataka', category: 'waterfalls', rating: 4.6, lat: 16.1703, lng: 74.8224, budget: 1800, bestSeason: 'Jul - Dec', image: img('1518495973542-4542c06a5843'), description: 'Spectacular waterfall often compared to a miniature Niagara Falls.' },
  { id: 'ka-dandeli-kali', name: 'Kali River', district: 'Dandeli', state: 'Karnataka', category: 'adventure', rating: 4.8, lat: 15.2365, lng: 74.6170, budget: 3000, bestSeason: 'Oct - Mar', image: img('1472214222541-d510753a49f8'), description: 'Adventure hotspot for white-water rafting, kayaking, and nature camps.' },
  { id: 'ka-vijayapura-golgumbaz', name: 'Gol Gumbaz', district: 'Vijayapura', state: 'Karnataka', category: 'historical', rating: 4.7, lat: 16.8302, lng: 75.7353, budget: 1500, bestSeason: 'Nov - Feb', image: img('1545569341-9eb8b30979d9'), description: 'Architectural marvel featuring one of the world’s largest unsupported domes.' },

  // Andhra Pradesh
  { id: 'ap-tirupati', name: 'Tirumala Venkateswara Temple', district: 'Tirupati', state: 'Andhra Pradesh', category: 'temples', rating: 4.9, lat: 13.6833, lng: 79.3500, budget: 1500, bestSeason: 'Sep - Mar', image: img('1588666309925-ef2b099b6a0a'), description: 'World-famous temple of Lord Venkateswara located in the sacred Seshachalam hills.' },
  { id: 'ap-tirupati-talakona', name: 'Talakona Waterfalls', district: 'Tirupati', state: 'Andhra Pradesh', category: 'waterfalls', rating: 4.6, lat: 13.7800, lng: 79.2500, budget: 1500, bestSeason: 'Sep - Jan', image: img('1470071459604-3b5ec3a7fe05'), description: 'The highest waterfall in Andhra Pradesh, set in beautiful green forest canopy.' },
  { id: 'ap-araku', name: 'Araku Valley Coffee Gardens', district: 'Araku Valley', state: 'Andhra Pradesh', category: 'hills', rating: 4.6, lat: 18.3333, lng: 82.8833, budget: 2000, bestSeason: 'Oct - Mar', image: img('1469474968028-56623f02e42e'), description: 'Breathtaking hill valley filled with coffee gardens, waterfalls, and tribal history.' },
  { id: 'ap-rishikonda', name: 'Rishikonda Beach', district: 'Visakhapatnam', state: 'Andhra Pradesh', category: 'beaches', rating: 4.5, lat: 17.7820, lng: 83.3854, budget: 1200, bestSeason: 'Oct - Mar', image: img('1582512286196-9eb83d8c0b0b'), description: 'Clean golden sand beach on the Bay of Bengal, known for water sports.' },
  { id: 'ap-vizag-borra', name: 'Borra Caves', district: 'Visakhapatnam', state: 'Andhra Pradesh', category: 'adventure', rating: 4.7, lat: 18.2800, lng: 83.0400, budget: 2200, bestSeason: 'Nov - Feb', image: img('1469474968028-56623f02e42e'), description: 'Million-year-old deep limestone caves located in the beautiful Ananthagiri hill range.' },
  { id: 'ap-vizag-yarada', name: 'Yarada Beach', district: 'Visakhapatnam', state: 'Andhra Pradesh', category: 'beaches', rating: 4.5, lat: 17.6534, lng: 83.2721, budget: 1400, bestSeason: 'Oct - Mar', image: img('1520250497591-112f2f40a3f4'), description: 'A gorgeous beach surrounded by green hills, offering absolute tranquility.' },
  { id: 'ap-gandikota', name: 'Gandikota Fort & Canyon', district: 'Gandikota', state: 'Andhra Pradesh', category: 'historical', rating: 4.7, lat: 14.8152, lng: 78.2868, budget: 1800, bestSeason: 'Sep - Feb', image: img('1476514525535-07fb3b4d462a'), description: 'Magnificent gorge formed by the Pennar river, flanked by red sandstone cliffs.' },
  { id: 'ap-gandikota-temple', name: 'Madhavaraya Temple Ruins', district: 'Gandikota', state: 'Andhra Pradesh', category: 'historical', rating: 4.5, lat: 14.8140, lng: 78.2850, budget: 1200, bestSeason: 'Sep - Feb', image: img('1537996192894-86f8a88d2b4d'), description: 'Ancient fortress temple with elaborate towers, reflecting Vijayanagara architectural heritage.' },
  { id: 'ap-amaravati', name: 'Amaravati Stupa', district: 'Amaravati', state: 'Andhra Pradesh', category: 'historical', rating: 4.4, lat: 16.5744, lng: 80.3575, budget: 1000, bestSeason: 'Nov - Feb', image: img('1537996192894-86f8a88d2b4d'), description: 'Ruined ancient Buddhist monument and site museum featuring relief carvings.' },

  // Telangana
  { id: 'tg-charminar', name: 'Charminar', district: 'Hyderabad', state: 'Telangana', category: 'historical', rating: 4.7, lat: 17.3616, lng: 78.4747, budget: 1000, bestSeason: 'Oct - Mar', image: img('1537996192894-86f8a88d2b4d'), description: 'Historic 16th-century landmark mosque with four towering minarets.' },
  { id: 'tg-golconda', name: 'Golconda Fort', district: 'Hyderabad', state: 'Telangana', category: 'historical', rating: 4.8, lat: 17.3833, lng: 78.4011, budget: 1200, bestSeason: 'Nov - Feb', image: img('1582512286196-9eb83d8c0b0b'), description: 'Fascinating diamond-trading capital fort known for its brilliant acoustics.' },
  { id: 'tg-hyd-ramoji', name: 'Ramoji Film City', district: 'Hyderabad', state: 'Telangana', category: 'adventure', rating: 4.6, lat: 17.2543, lng: 78.6808, budget: 4500, bestSeason: 'Oct - Mar', image: img('1507699622107-4be7a3c34a7a'), description: 'Sprawling film studio city with replicas, theme gardens, and daily shows.' },
  { id: 'tg-hyd-birla', name: 'Birla Mandir', district: 'Hyderabad', state: 'Telangana', category: 'temples', rating: 4.7, lat: 17.4062, lng: 78.4690, budget: 500, bestSeason: 'Year-round', image: img('1588666309925-ef2b099b6a0a'), description: 'Majestic white marble temple standing on a 280-foot-high hill overlooking the city.' },
  { id: 'tg-warangal', name: 'Thousand Pillar Temple', district: 'Warangal', state: 'Telangana', category: 'temples', rating: 4.6, lat: 18.0033, lng: 79.5694, budget: 900, bestSeason: 'Oct - Mar', image: img('1588666309925-ef2b099b6a0a'), description: 'Kakatiya masterpiece featuring highly detailed stone pillars and black basalt Nandi.' },
  { id: 'tg-warangal-ramappa', name: 'Ramappa Temple', district: 'Warangal', state: 'Telangana', category: 'historical', rating: 4.9, lat: 18.2592, lng: 79.9431, budget: 1100, bestSeason: 'Oct - Mar', image: img('1537996192894-86f8a88d2b4d'), description: 'UNESCO temple constructed in 1213 AD, famous for lightweight floating bricks.' },
  { id: 'tg-nagarjuna', name: 'Nagarjuna Sagar Dam', district: 'Nagarjuna Sagar', state: 'Telangana', category: 'nature', rating: 4.5, lat: 16.5800, lng: 79.3100, budget: 1500, bestSeason: 'Aug - Dec', image: img('1476514525535-07fb3b4d462a'), description: 'Massive masonry dam creating a scenic reservoir and the island museum of Nagarjunakonda.' },
  { id: 'tg-nagarjuna-waterfalls', name: 'Ethipothala Waterfalls', district: 'Nagarjuna Sagar', state: 'Telangana', category: 'waterfalls', rating: 4.4, lat: 16.5167, lng: 79.3333, budget: 1200, bestSeason: 'Jul - Oct', image: img('1470071459604-3b5ec3a7fe05'), description: '70-foot-high cascading waterfall feeding a scenic lagoon on Chandravanka river.' },
  { id: 'tg-ananthagiri', name: 'Ananthagiri Hills Forest', district: 'Ananthagiri Hills', state: 'Telangana', category: 'nature', rating: 4.4, lat: 17.3000, lng: 77.8500, budget: 2200, bestSeason: 'Jul - Nov', description: 'Serene forest retreat and trekking route, origin of the Musi river near Hyderabad.' },

  // Puducherry
  { id: 'py-promenade', name: 'Promenade Beach', district: 'Pondicherry', state: 'Puducherry', category: 'beaches', rating: 4.6, lat: 11.9348, lng: 79.8373, budget: 1500, bestSeason: 'Oct - Mar', image: img('1514282401047-d79a71a590e8'), description: 'Beautiful beach sidewalk flanked by French-colonial houses, statutes, and cafes.' },
  { id: 'py-auroville', name: 'Matrimandir, Auroville', district: 'Pondicherry', state: 'Puducherry', category: 'historical', rating: 4.8, lat: 12.0068, lng: 79.8105, budget: 2000, bestSeason: 'Nov - Feb', image: img('1582512286196-9eb83d8c0b0b'), description: 'Golden metallic sphere representing spiritual unity, situated in Auroville township.' },
  { id: 'py-paradise', name: 'Paradise Beach', district: 'Pondicherry', state: 'Puducherry', category: 'beaches', rating: 4.7, lat: 11.8860, lng: 79.8164, budget: 2000, bestSeason: 'Oct - Mar', image: img('1520250497591-112f2f40a3f4'), description: 'Pristine beach with gold sands, accessible via Chunnambar backwater boat house.' },
  { id: 'py-french-quarter', name: 'White Town', district: 'Pondicherry', state: 'Puducherry', category: 'historical', rating: 4.8, lat: 11.9338, lng: 79.8354, budget: 2500, bestSeason: 'Nov - Feb', image: img('1545569341-9eb8b30979d9'), description: 'Charming heritage area featuring French architecture, cafes, and boutiques.' },
  { id: 'py-karaikal-beach', name: 'Karaikal Beach', district: 'Karaikal', state: 'Puducherry', category: 'beaches', rating: 4.3, lat: 10.9250, lng: 79.8550, budget: 1200, bestSeason: 'Oct - Mar', image: img('1507525428034-b723cf961d3e'), description: 'Quiet coastal stretch on the Bay of Bengal, featuring recreation parks.' }
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
