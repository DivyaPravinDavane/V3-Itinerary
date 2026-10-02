import type { Itinerary } from '../types';

/**
 * Curated mapping of destinations to their associated cities, towns,
 * islands, regions, and iconic travel hubs.
 */
export const DESTINATION_CITIES: Record<string, string[]> = {
  // ─── Domestic Destinations (India) ──────────────────────────────────────────
  'kashmir': [
    'Srinagar', 'Gulmarg', 'Pahalgam', 'Sonamarg', 'Dal Lake', 'Yusmarg',
    'Doodhpathri', 'Aru Valley', 'Betaab Valley', 'Sinthan Top', 'Gurez Valley',
    'Anantnag', 'Baramulla', 'Kupwara', 'Pulwama', 'Jammu', 'Patnitop', 'Katra'
  ],
  'goa': [
    'Panaji', 'Panjim', 'Calangute', 'Baga', 'Candolim', 'Anjuna', 'Vagator',
    'Morjim', 'Arambol', 'Ashwem', 'Colva', 'Benaulim', 'Margao', 'Madgaon',
    'Palolem', 'Agonda', 'Cavelossim', 'Old Goa', 'Mapusa', 'Porvorim', 'Dudhsagar'
  ],
  'kerala': [
    'Kochi', 'Cochin', 'Ernakulam', 'Munnar', 'Alleppey', 'Alappuzha',
    'Thekkady', 'Periyar', 'Wayanad', 'Varkala', 'Kovalam', 'Kumarakom',
    'Trivandrum', 'Thiruvananthapuram', 'Athirappilly', 'Bekal', 'Kozhikode',
    'Calicut', 'Poovar', 'Vagamon', 'Marari'
  ],
  'manali': [
    'Manali', 'Old Manali', 'Solang Valley', 'Solang', 'Rohtang Pass', 'Rohtang',
    'Kasol', 'Kullu', 'Shimla', 'Dharamshala', 'McLeod Ganj', 'Spiti Valley',
    'Spiti', 'Kaza', 'Tosh', 'Malana', 'Manikaran', 'Jibhi', 'Tirthan Valley',
    'Sethan', 'Atal Tunnel', 'Sissu', 'Naggar', 'Kasauli', 'Dalhousie', 'Khajjiar', 'Bir Billing'
  ],
  'ladakh': [
    'Leh', 'Nubra Valley', 'Nubra', 'Pangong Tso', 'Pangong Lake', 'Pangong',
    'Khardung La', 'Chang La', 'Magnetic Hill', 'Tso Moriri', 'Zanskar', 'Kargil',
    'Diskit', 'Hunder', 'Turtuk', 'Alchi', 'Hemis', 'Lamayuru', 'Hanle'
  ],
  'rajasthan': [
    'Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer', 'Pushkar', 'Bikaner',
    'Mount Abu', 'Ajmer', 'Ranthambore', 'Sawai Madhopur', 'Chittorgarh',
    'Kumbhalgarh', 'Mandawa', 'Shekhawati', 'Bundi', 'Bharatpur', 'Alwar', 'Neemrana'
  ],
  'andaman': [
    'Port Blair', 'Havelock Island', 'Havelock', 'Swaraj Dweep', 'Neil Island',
    'Shaheed Dweep', 'Radhanagar', 'Baratang', 'Ross Island', 'Elephant Beach',
    'Kalapathar Beach', 'Chidiya Tapu', 'Diglipur', 'Wandoor'
  ],
  'sikkim': [
    'Gangtok', 'Pelling', 'Lachung', 'Lachen', 'Yumthang Valley', 'Nathula Pass',
    'Tsomgo Lake', 'Ravangla', 'Namchi', 'Zuluk', 'Yuksom', 'Darjeeling'
  ],
  'meghalaya': [
    'Shillong', 'Cherrapunji', 'Sohra', 'Dawki', 'Mawlynnong', 'Nongriat',
    'Jowai', 'Elephant Falls', 'Krang Suri', 'Umiam Lake'
  ],
  'uttarakhand': [
    'Rishikesh', 'Haridwar', 'Mussoorie', 'Nainital', 'Dehradun', 'Jim Corbett',
    'Corbett', 'Auli', 'Chopta', 'Kedarnath', 'Badrinath', 'Kausani', 'Lansdowne',
    'Almora', 'Ranikhet', 'Dhanaulti', 'Mukteshwar'
  ],
  'karnataka': [
    'Bangalore', 'Bengaluru', 'Coorg', 'Kodagu', 'Madikeri', 'Mysore', 'Mysuru',
    'Hampi', 'Gokarna', 'Chikmagalur', 'Dandeli', 'Kabini', 'Badami', 'Mangalore', 'Udupi'
  ],
  'maharashtra': [
    'Mumbai', 'Bombay', 'Pune', 'Lonavala', 'Khandala', 'Mahabaleshwar', 'Alibaug',
    'Panchgani', 'Matheran', 'Shirdi', 'Nashik', 'Aurangabad', 'Ajanta', 'Ellora', 'Kolhapur'
  ],
  'tamil nadu': [
    'Chennai', 'Ooty', 'Kodaikanal', 'Madurai', 'Rameswaram', 'Kanyakumari',
    'Pondicherry', 'Puducherry', 'Mahabalipuram', 'Coimbatore', 'Coonoor'
  ],
  'madhya pradesh': [
    'Bhopal', 'Indore', 'Ujjain', 'Gwalior', 'Khajuraho', 'Pachmarhi',
    'Kanha', 'Bandhavgarh', 'Jabalpur', 'Orchha', 'Sanchi', 'Omkareshwar'
  ],

  // ─── International Destinations ─────────────────────────────────────────────
  'dubai': [
    'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah',
    'Palm Jumeirah', 'Dubai Marina', 'Downtown Dubai', 'Deira', 'Bur Dubai',
    'Jumeirah', 'Al Fahidi', 'Al Barsha', 'Yas Island'
  ],
  'maldives': [
    'Male', 'Malé', 'Hulhumale', 'Maafushi', 'Baa Atoll', 'Ari Atoll',
    'South Ari Atoll', 'North Male Atoll', 'Addu City', 'Dhangethi', 'Ukulhas',
    'Rasdhoo', 'Dhigurah', 'Thulusdhoo', 'Fulhadhoo'
  ],
  'singapore': [
    'Singapore', 'Sentosa', 'Sentosa Island', 'Marina Bay', 'Chinatown',
    'Little India', 'Orchard Road', 'Clarke Quay', 'Jurong', 'Bugis', 'Changi'
  ],
  'thailand': [
    'Bangkok', 'Phuket', 'Krabi', 'Pattaya', 'Chiang Mai', 'Koh Samui',
    'Phi Phi', 'Phi Phi Islands', 'Koh Phangan', 'Koh Tao', 'Hua Hin',
    'Ayutthaya', 'Railay', 'Railay Beach', 'Patong', 'Kata', 'Karon', 'Chiang Rai'
  ],
  'switzerland': [
    'Zurich', 'Zürich', 'Lucerne', 'Luzern', 'Interlaken', 'Geneva', 'Genève',
    'Zermatt', 'Bern', 'Basel', 'Lausanne', 'St. Moritz', 'Engelberg',
    'Lauterbrunnen', 'Grindelwald', 'Montreux', 'Lugano', 'Mt Titlis', 'Titlis',
    'Mt Pilatus', 'Pilatus', 'Jungfrau', 'Jungfraujoch', 'Matterhorn'
  ],
  'europe': [
    'Paris', 'Rome', 'Zurich', 'Lucerne', 'Interlaken', 'Geneva', 'Zermatt',
    'Amsterdam', 'London', 'Barcelona', 'Madrid', 'Venice', 'Florence', 'Milan',
    'Prague', 'Vienna', 'Budapest', 'Munich', 'Berlin', 'Frankfurt', 'Brussels',
    'Salzburg', 'Innsbruck', 'Lauterbrunnen', 'Grindelwald', 'Engelberg', 'Mt Titlis',
    'Athens', 'Santorini', 'Mykonos', 'Lisbon', 'Dublin', 'Edinburgh', 'Nice', 'Monaco',
    'Naples', 'Amalfi', 'Positano', 'Capri', 'Vatican', 'Seville'
  ],
  'bali': [
    'Bali', 'Ubud', 'Seminyak', 'Kuta', 'Canggu', 'Nusa Dua', 'Denpasar',
    'Sanur', 'Uluwatu', 'Jimbaran', 'Nusa Penida', 'Nusa Lembongan',
    'Lovina', 'Amed', 'Legian', 'Gianyar', 'Tabanan', 'Bedugul', 'Kintamani'
  ],
  'vietnam': [
    'Hanoi', 'Da Nang', 'Danang', 'Hoi An', 'Ho Chi Minh', 'Ho Chi Minh City',
    'Saigon', 'Ha Long', 'Ha Long Bay', 'Halong Bay', 'Ninh Binh', 'Sapa',
    'Phu Quoc', 'Hue', 'Nha Trang', 'Phong Nha', 'Mekong Delta'
  ],
  'japan': [
    'Tokyo', 'Kyoto', 'Osaka', 'Hiroshima', 'Nara', 'Hakone', 'Mount Fuji',
    'Fuji', 'Sapporo', 'Yokohama', 'Nagoya', 'Kobe', 'Takayama', 'Kanazawa',
    'Fukuoka', 'Shibuya', 'Shinjuku', 'Ginza', 'Akihabara', 'Asakusa', 'Nikko'
  ],
  'sri lanka': [
    'Colombo', 'Kandy', 'Bentota', 'Galle', 'Ella', 'Sigiriya', 'Nuwara Eliya',
    'Mirissa', 'Negombo', 'Dambulla', 'Yala', 'Weligama', 'Trincomalee',
    'Unawatuna', 'Hikkaduwa', 'Arugam Bay', 'Pinnawala'
  ],
  'australia': [
    'Sydney', 'Melbourne', 'Brisbane', 'Gold Coast', 'Cairns', 'Perth',
    'Adelaide', 'Hobart', 'Great Barrier Reef', 'Whitsundays', 'Byron Bay',
    'Blue Mountains', 'Sunshine Coast', 'Darwin'
  ],
  'mauritius': [
    'Port Louis', 'Grand Baie', 'Flic en Flac', 'Belle Mare', 'Le Morne',
    'Trou aux Biches', 'Chamarel', 'Mahebourg', 'Black River Gorges'
  ],
  'malaysia': [
    'Kuala Lumpur', 'Penang', 'Langkawi', 'Malacca', 'Melaka', 'Kota Kinabalu',
    'Genting Highlands', 'Cameron Highlands', 'George Town', 'Johor Bahru'
  ],
  'turkey': [
    'Istanbul', 'Cappadocia', 'Antalya', 'Bodrum', 'Pamukkale', 'Izmir',
    'Ephesus', 'Fethiye', 'Goreme', 'Ankara'
  ],
  'egypt': [
    'Cairo', 'Giza', 'Luxor', 'Aswan', 'Alexandria', 'Sharm El Sheikh', 'Hurghada', 'Dahab'
  ],
  'greece': [
    'Athens', 'Santorini', 'Mykonos', 'Crete', 'Rhodes', 'Corfu', 'Zakynthos', 'Oia', 'Fira'
  ],
  'italy': [
    'Rome', 'Florence', 'Venice', 'Milan', 'Naples', 'Amalfi', 'Positano', 'Capri',
    'Pisa', 'Lake Como', 'Cinque Terre', 'Verona', 'Sicily'
  ],
  'france': [
    'Paris', 'Nice', 'Lyon', 'Marseille', 'Cannes', 'Bordeaux', 'Strasbourg', 'Monaco', 'Chamonix', 'Versailles'
  ],
  'united kingdom': [
    'London', 'Edinburgh', 'Manchester', 'Liverpool', 'Oxford', 'Cambridge', 'Bath', 'Glasgow'
  ],
  'usa': [
    'New York', 'NYC', 'Los Angeles', 'LA', 'Las Vegas', 'San Francisco', 'Miami', 'Orlando', 'Chicago', 'Hawaii', 'Honolulu'
  ],
  'bhutan': [
    'Thimphu', 'Paro', 'Punakha', 'Phobjikha', 'Bumthang', 'Tiger\'s Nest'
  ],
  'nepal': [
    'Kathmandu', 'Pokhara', 'Chitwan', 'Nagarkot', 'Bhaktapur', 'Annapurna', 'Everest'
  ]
};

/**
 * Common quick-search cities to show as helpful suggestion chips
 */
export const POPULAR_SEARCH_CITIES: string[] = [
  'Paris',
  'Zurich',
  'Gulmarg',
  'Phuket',
  'Seminyak',
  'Munnar',
  'Jaipur',
  'Calangute',
  'Tokyo',
  'Abu Dhabi',
  'Lucerne',
  'Rome',
  'Bangkok',
  'Ubud',
  'Pahalgam',
  'Hoi An',
  'Kandy',
  'Sydney'
];

/**
 * Returns static cities for a given destination name
 */
export function getDestinationCities(destName: string): string[] {
  if (!destName) return [];
  const normalized = destName.toLowerCase().trim();
  
  if (DESTINATION_CITIES[normalized]) {
    return DESTINATION_CITIES[normalized];
  }
  
  // Try partial key matching
  for (const [key, cities] of Object.entries(DESTINATION_CITIES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return cities;
    }
  }

  return [];
}

/**
 * Returns a deduplicated list of cities/places for a destination,
 * combining the curated dictionary with any dynamic locations found in its itineraries.
 */
export function getCitiesForDestination(destName: string, itineraries: Itinerary[] = []): string[] {
  const citiesSet = new Set<string>();

  // 1. Add curated static cities
  getDestinationCities(destName).forEach(c => citiesSet.add(c));

  // 2. Extract dynamic places from matching itineraries
  const matchingItineraries = itineraries.filter(
    it => it.destination.toLowerCase() === destName.toLowerCase()
  );

  matchingItineraries.forEach(it => {
    // Check day titles & highlights for city keywords
    if (it.days && Array.isArray(it.days)) {
      it.days.forEach(day => {
        if (day.highlights && Array.isArray(day.highlights)) {
          day.highlights.forEach(h => {
            // Check if highlight contains a known city name or clean label
            const trimmed = h.trim();
            if (trimmed.length > 2 && trimmed.length < 30 && !trimmed.includes('Transfer') && !trimmed.includes('Flight')) {
              // Add prominent highlights
              const words = trimmed.split(/[-–,:]/)[0].trim();
              if (words.length > 2 && words.length < 25) {
                // If it matches any known city, definitely add it
                for (const cities of Object.values(DESTINATION_CITIES)) {
                  const found = cities.find(c => c.toLowerCase() === words.toLowerCase());
                  if (found) citiesSet.add(found);
                }
              }
            }
          });
        }
      });
    }
  });

  return Array.from(citiesSet);
}

/**
 * Check whether a destination matches a user query (city, destination name, country, etc.)
 */
export function checkDestinationMatchesQuery(
  destName: string,
  country: string,
  query: string,
  itineraries: Itinerary[] = [],
  description: string = '',
  vibes: string[] = []
): { isMatch: boolean; matchedCity?: string; score: number } {
  if (!query || !query.trim()) {
    return { isMatch: true, score: 0 };
  }

  const q = query.toLowerCase().trim();
  const dNameLower = destName.toLowerCase();
  const countryLower = (country || '').toLowerCase();
  const descLower = (description || '').toLowerCase();

  // 1. Exact or starts-with destination name match
  if (dNameLower === q) {
    return { isMatch: true, matchedCity: destName, score: 100 };
  }
  if (dNameLower.startsWith(q)) {
    return { isMatch: true, matchedCity: destName, score: 90 };
  }
  if (dNameLower.includes(q)) {
    return { isMatch: true, matchedCity: destName, score: 80 };
  }

  // 2. Exact or starts-with country match
  if (countryLower === q) {
    return { isMatch: true, score: 75 };
  }
  if (countryLower.includes(q)) {
    return { isMatch: true, score: 70 };
  }

  // 3. Check associated cities
  const cities = getCitiesForDestination(destName, itineraries);
  
  // Exact city match
  const exactCity = cities.find(c => c.toLowerCase() === q);
  if (exactCity) {
    return { isMatch: true, matchedCity: exactCity, score: 95 };
  }

  // City starts with query
  const startsWithCity = cities.find(c => c.toLowerCase().startsWith(q));
  if (startsWithCity) {
    return { isMatch: true, matchedCity: startsWithCity, score: 85 };
  }

  // City includes query (if query is at least 3 chars)
  if (q.length >= 3) {
    const includesCity = cities.find(c => c.toLowerCase().includes(q));
    if (includesCity) {
      return { isMatch: true, matchedCity: includesCity, score: 75 };
    }
  }

  // 4. Check dynamic itineraries for this destination
  const matchingItins = itineraries.filter(
    it => it.destination.toLowerCase() === dNameLower
  );
  
  for (const it of matchingItins) {
    if (it.title.toLowerCase().includes(q)) {
      return { isMatch: true, score: 65 };
    }
    if (it.overview.toLowerCase().includes(q)) {
      return { isMatch: true, score: 60 };
    }
    if (it.days && Array.isArray(it.days)) {
      for (const d of it.days) {
        if (d.title && d.title.toLowerCase().includes(q)) {
          return { isMatch: true, score: 60 };
        }
        if (d.highlights && Array.isArray(d.highlights) && d.highlights.some(h => h.toLowerCase().includes(q))) {
          return { isMatch: true, score: 55 };
        }
        if ((d.morning && d.morning.toLowerCase().includes(q)) ||
            (d.afternoon && d.afternoon.toLowerCase().includes(q)) ||
            (d.evening && d.evening.toLowerCase().includes(q))) {
          return { isMatch: true, score: 50 };
        }
      }
    }
  }

  // 5. Description match
  if (descLower.includes(q)) {
    return { isMatch: true, score: 40 };
  }

  // 6. Vibes match
  if (vibes.some(v => v.toLowerCase().includes(q))) {
    return { isMatch: true, score: 30 };
  }

  return { isMatch: false, score: 0 };
}
