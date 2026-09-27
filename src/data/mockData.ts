import type { Itinerary } from '../types';

export const POPULAR_DESTINATIONS: Itinerary[] = [
  {
    id: 'dubai-5d',
    slug: 'ultimate-dubai-family-desert-safari',
    destination: 'Dubai',
    country: 'United Arab Emirates',
    region: 'International',
    title: 'Ultimate Dubai Experience: Sky Views, Desert Safari & Palm Jumeirah',
    durationDays: 5,
    durationNights: 4,
    travelerType: 'Family',
    itineraryCountLabel: '128 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 48000,
    rating: 4.9,
    reviewCount: 128,
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The definitive blueprint for an unforgettable Dubai holiday. From standing at the pinnacle of Burj Khalifa to dune bashing through red desert sands and sailing the Dubai Marina at sunset.',
    bestTimeToVisit: 'November to March (Pleasant 24°C - 28°C)',
    isPopular: true,
    agent: {
      id: 'ag-101',
      agencyName: 'Arabian Horizon Holidays Pvt Ltd',
      founderName: 'Vikram Malhotra',
      gstNumber: '27AABCU9603R1ZM',
      isVerified: true,
      yearsInBusiness: 11,
      location: 'Mumbai & Dubai',
      rating: 4.9,
      reviewCount: 342,
      phone: '+91 98201 44521',
      whatsapp: '+91 98201 44521',
      email: 'bookings@arabianhorizon.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 42
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival, Check-in & Dubai Marina Dhow Cruise with Dinner',
        morning: 'Airport pick up in private AC sedan, scenic drive through Sheikh Zayed Road, early hotel check-in & freshen up.',
        afternoon: 'Explore Dubai Marina Walk, stroll through JBR The Beach, cafes, and waterfront promenade.',
        evening: 'Board luxury glass-enclosed Dhow Cruise at Marina; enjoy live Tanoura dance show, international buffet dinner, and skyline views.',
        highlights: ['Private Airport Transfer', 'JBR Beach Walk', 'Marina Dhow Cruise & Dinner']
      },
      {
        dayNumber: 2,
        title: 'Historic Al Fahidi, Dubai Frame & Burj Khalifa at Twilight',
        morning: 'Visit historic Al Fahidi Fort & Bastakiya quarter, take traditional Abra boat ride across Dubai Creek to Spice & Gold Souks.',
        afternoon: 'Head to Dubai Frame for 360-degree glass bridge views of Old vs New Dubai.',
        evening: 'Ascend Burj Khalifa 124th & 125th Floor Observatory at golden hour sunset; watch Dubai Mall Dancing Fountain show.',
        highlights: ['Creek Abra Ride', 'Dubai Frame Sky Glass', 'Burj Khalifa Level 124 Sunset']
      },
      {
        dayNumber: 3,
        title: 'Red Dune Desert Safari, Sandboarding & Bedouin BBQ Camp',
        morning: 'Relaxed morning at hotel pool or visit Museum of the Future (pre-booked morning slot).',
        afternoon: 'Pick up in 4x4 Land Cruiser for Lahbab Desert Safari; experience thrilling 45-min dune bashing and quad biking.',
        evening: 'Sunset photo stop in deep red dunes; enter Bedouin camp for camel rides, henna tattoo, fire show, belly dance, and BBQ dinner.',
        highlights: ['4x4 Dune Bashing', 'Sandboarding', 'Bedouin BBQ & Fire Spectacle']
      },
      {
        dayNumber: 4,
        title: 'Palm Jumeirah Monorail, Aquaventure & Ain Dubai Views',
        morning: 'Ride Palm Monorail to Atlantis The Palm; visit The Lost Chambers Aquarium with 65,000 marine animals.',
        afternoon: 'Thrills at Aquaventure Waterpark (world-record waterslides) or The View at The Palm 52nd floor observation deck.',
        evening: 'Sunset drinks or dinner overlooking Ain Dubai on Bluewaters Island; dine at waterfront Mediterranean restaurant.',
        highlights: ['The View at The Palm', 'Lost Chambers Aquarium', 'Bluewaters Island Stroll']
      },
      {
        dayNumber: 5,
        title: 'Souk Madinat Jumeirah, Souvenir Shopping & Departure',
        morning: 'Visit Souk Madinat Jumeirah (Venice of the Middle East) with postcard backdrop of Burj Al Arab.',
        afternoon: 'Last-minute tax-free shopping at Mall of the Emirates or City Centre Deira; enjoy dates and local delicacies.',
        evening: 'Assisted checkout and private drop-off at Dubai International Airport (DXB) 3.5 hours prior to flight.',
        highlights: ['Burj Al Arab Postcard Shot', 'Madinat Waterway Canal', 'Seamless Airport Drop']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Rove Downtown / Citymax Al Barsha', rating: 4.4, estPricePerNight: '₹4,500 - ₹6,000', perks: ['Central Metro Access', 'Free High-speed Wi-Fi', 'Outdoor Pool'] },
      { tier: 'Comfort', name: 'Aloft Palm Jumeirah / Millennium Place Marina', rating: 4.7, estPricePerNight: '₹9,500 - ₹14,000', perks: ['Marina Views', 'Private Beach Access', 'Complimentary Breakfast'] },
      { tier: 'Luxury', name: 'Atlantis The Palm / Address Downtown', rating: 4.9, estPricePerNight: '₹32,000 - ₹55,000', perks: ['Free Aquaventure Passes', 'Michelin Chef Restaurants', 'VIP Chauffeur'] }
    ],
    budgetBreakdown: {
      flights: 22000,
      accommodation: 14000,
      foodDining: 8000,
      activitiesSightseeing: 10000,
      localTransport: 4000
    },
    inclusions: [
      'Day-by-day precision schedule with metro/cab route maps',
      'Curated list of verified ticket booking links (saves 20% on retail prices)',
      'Direct WhatsApp and hotline contact with certified Dubai tour agency',
      'Local culinary & hidden gem food recommendations',
      'Emergency numbers, SIM card guidance, and visa checklist'
    ],
    exclusions: [
      'Flights, hotel room tariffs, and entry tickets (purchased separately with our discounted agent rates)',
      'UAE Tourist Visa fees and personal shopping expenses',
      'Tourism Dirham fee charged directly by hotels at check-in'
    ]
  },
  {
    id: 'maldives-4d',
    slug: 'maldives-overwater-villa-luxury-escape',
    destination: 'Maldives',
    country: 'Maldives',
    region: 'International',
    title: 'Idyllic Maldives Paradise: Overwater Villa, Coral Snorkeling & Sunset Cruise',
    durationDays: 4,
    durationNights: 3,
    travelerType: 'Couple',
    itineraryCountLabel: '85 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 65000,
    rating: 4.95,
    reviewCount: 94,
    coverImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'A dream romantic gateway blueprint designed for honeymooners and beach lovers. Includes seaplane/speedboat logistics, house reef snorkeling spots, private candlelit beach dinner, and overwater bungalow selection guide.',
    bestTimeToVisit: 'December to April (Dry Season, crystal turquoise water)',
    isPopular: true,
    agent: {
      id: 'ag-102',
      agencyName: 'Blue Atoll Travel Experts LLP',
      founderName: 'Ayesha Merchant',
      gstNumber: '29AAFCB7812L1Z3',
      isVerified: true,
      yearsInBusiness: 8,
      location: 'Bangalore & Male',
      rating: 4.9,
      reviewCount: 218,
      phone: '+91 99802 88412',
      whatsapp: '+91 99802 88412',
      email: 'hello@blueatollmaldives.com',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 29
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival at Velana International (MLE), Speedboat Transfer & Overwater Villa Check-in',
        morning: 'Land in Malé; greeted by resort representative at counter; scenic 25-minute speedboat ride across azure atolls.',
        afternoon: 'Check-in to iconic private overwater pool villa; welcome sparkling drink; direct swim into lagoon from villa deck.',
        evening: 'Sunset drinks at beachfront cocktail bar with live acoustic music; lavish international dinner buffet.',
        highlights: ['Scenic Atoll Speedboat Ride', 'Direct Lagoon Ocean Access', 'Sunset Welcome Cocktails']
      },
      {
        dayNumber: 2,
        title: 'House Reef Snorkeling Safari, Nurse Shark Sightings & Dolphin Cruise',
        morning: 'Guided morning snorkeling at house reef; encounter sea turtles, vibrant parrotfish, and harmless reef sharks.',
        afternoon: 'Spa relaxation at overwater glass-floor treatment pavilion or optional motorized jet ski excursion.',
        evening: 'Sunset Dhoni Boat cruise into open ocean; spot playful pods of wild spinner dolphins dancing alongside the hull.',
        highlights: ['Turtle & Coral Snorkeling', 'Overwater Ayurvedic Spa', 'Wild Spinner Dolphin Cruise']
      },
      {
        dayNumber: 3,
        title: 'Sandbank Picnic, Standup Paddleboarding & Private Beach BBQ',
        morning: 'Excursion to secluded uninhabited sandbank in the middle of the Indian Ocean for private breakfast & drone photography.',
        afternoon: 'Complimentary transparent kayak & stand-up paddleboarding around turquoise lagoon waters.',
        evening: 'Romantic private 4-course candlelit beach BBQ dinner under a canopy of starlit tropical skies.',
        highlights: ['Private Sandbank Picnic', 'Drone Photography Session', 'Starlight Beach Candlelight BBQ']
      },
      {
        dayNumber: 4,
        title: 'Sunrise Yoga, Souvenir Shopping in Malé & Departure',
        morning: 'Complimentary sunrise yoga on the jetty; lavish floating breakfast in your private overwater pool.',
        afternoon: 'Late checkout; return speedboat to Malé island; brief guided heritage walk through Malé Fish Market and Grand Mosque.',
        evening: 'Assisted departure check-in at Velana International Airport.',
        highlights: ['Overwater Pool Floating Breakfast', 'Malé Heritage Walk', 'Seamless Flight Connection']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Arena Beach Hotel / Kaani Palm Beach (Maafushi)', rating: 4.4, estPricePerNight: '₹6,500 - ₹9,000', perks: ['Bikini Beach Access', 'Free Snorkeling Gear', 'Speedboat Included'] },
      { tier: 'Comfort', name: 'Centara Ras Fushi Resort / Sun Siyam Olhuveli', rating: 4.8, estPricePerNight: '₹22,000 - ₹35,000', perks: ['Water Villa Upgrade', 'All-Inclusive Dine Around', 'Adults Only Wing'] },
      { tier: 'Luxury', name: 'Soneva Jani / Anantara Kihavah Villas', rating: 4.98, estPricePerNight: '₹85,000 - ₹1,60,000', perks: ['Overwater Water Slide', 'Underwater Wine Cellar', '24/7 Dedicated Butler'] }
    ],
    budgetBreakdown: {
      flights: 24000,
      accommodation: 28000,
      foodDining: 8000,
      activitiesSightseeing: 3500,
      localTransport: 1500
    },
    inclusions: [
      'Comprehensive speedboat vs seaplane transfer cost comparison',
      'Local island (Maafushi/Thulusdhoo) budget hack sheet (saves ₹40,000+)',
      'Verified water sports operator contacts with WhatsApp pre-booking',
      'Customs regulations, drone permit guidelines, and packing checklist'
    ],
    exclusions: [
      'Resort green tax ($6 per person/night charged by resort)',
      'Alcohol purchases on local inhabited islands (prohibited by Maldivian law; available on private resort islands)'
    ]
  },
  {
    id: 'singapore-4d',
    slug: 'universal-studios-singapore-family-adventure',
    destination: 'Singapore',
    country: 'Singapore',
    region: 'International',
    title: 'Universal Studios Singapore: 7 Themed Zones, Transformers 3D & Sentosa Express',
    durationDays: 4,
    durationNights: 3,
    travelerType: 'Family',
    itineraryCountLabel: '76 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 42000,
    rating: 4.88,
    reviewCount: 92,
    coverImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Full-throttle family adventure at Universal Studios Singapore: explore Hollywood, Sci-Fi City, Ancient Egypt, and The Lost World, coupled with Sentosa monorail and Marina Bay views.',
    bestTimeToVisit: 'Year-round destination (Fabulous Nov - Apr festivals)',
    isPopular: true,
    agent: {
      id: 'ag-103',
      agencyName: 'Lion City Journeys India Ltd',
      founderName: 'Rohan Deshmukh',
      gstNumber: '33AABCL4421P1Z9',
      isVerified: true,
      yearsInBusiness: 9,
      location: 'Chennai & Singapore',
      rating: 4.8,
      reviewCount: 165,
      phone: '+91 94441 55670',
      whatsapp: '+91 94441 55670',
      email: 'tours@lioncityjourneys.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 31
    },
    days: [
      {
        dayNumber: 1,
        title: 'Changi Jewel Rain Vortex, Civic District & Marina Bay Light Spectacle',
        morning: 'Arrive at Singapore Changi Airport; marvel at Jewel Rain Vortex waterfall & Shiseido Forest Valley; MRT card pickup.',
        afternoon: 'Hotel check-in; walk through historic Civic District, Merlion Park for photos with Merlion fountain.',
        evening: 'Walk the Helix Bridge; watch the Spectra Marina Bay Sands water & laser light show; dinner at Makansutra Gluttons Bay.',
        highlights: ['Changi Jewel Waterfall', 'Merlion Park Landmark', 'Spectra Light & Water Show']
      },
      {
        dayNumber: 2,
        title: 'Gardens by the Bay Flower Dome, Cloud Forest & Supertree Grove',
        morning: 'Cool off in climate-controlled Flower Dome and Cloud Forest indoor misty mountain & 35-meter waterfall.',
        afternoon: 'Ascend to Marina Bay Sands SkyPark Observation Deck for panoramic city-to-strait views.',
        evening: 'Garden Rhapsody musical light show under illuminated Supertrees; stroll through vibrant Chinatown for street food.',
        highlights: ['Cloud Forest Waterfall', 'MBS SkyPark 57th Floor', 'Supertree Garden Rhapsody']
      },
      {
        dayNumber: 3,
        title: 'Sentosa Island Cable Car, Universal Studios & S.E.A. Aquarium',
        morning: 'Take Singapore Cable Car from Mount Faber to Sentosa Island with breathtaking harbor views.',
        afternoon: 'Full-throttle fun at Universal Studios Singapore (Transformers 3D ride, Battlestar Galactica rollercoasters, Mummy ride).',
        evening: 'Visit S.E.A. Aquarium or relax at Siloso Beach; dinner at VivoCity waterfront promenade.',
        highlights: ['Mount Faber Cable Car', 'Universal Studios Thrills', 'Siloso Beach Sunset']
      },
      {
        dayNumber: 4,
        title: 'Little India, Kampong Glam Haji Lane & Changi Departure',
        morning: 'Explore vibrant cultural streets of Little India (Mustafa Centre shopping) and colourful street art in Kampong Glam Haji Lane.',
        afternoon: 'Savor traditional Kaya toast and Teh Tarik at Ya Kun Kaya; pick up pandan cake souvenirs.',
        evening: 'Hassle-free transfer to Changi Terminal for departure flight.',
        highlights: ['Haji Lane Boutique Alley', 'Mustafa Centre 24/7 Retail', 'Authentic Kaya Toast']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Hotel Boss / ibis budget Singapore Clarke Quay', rating: 4.3, estPricePerNight: '₹5,500 - ₹7,500', perks: ['Near MRT Stations', 'Clean & Compact', 'Rooftop Pool'] },
      { tier: 'Comfort', name: 'Parkroyal on Beach Road / Oasia Hotel Downtown', rating: 4.7, estPricePerNight: '₹12,000 - ₹18,000', perks: ['Sky Gardens', 'Prime Location', 'Full Buffet Breakfast'] },
      { tier: 'Luxury', name: 'Marina Bay Sands / The Fullerton Hotel', rating: 4.9, estPricePerNight: '₹45,000 - ₹85,000', perks: ['World-famous Infinity Pool', 'Heritage Luxury', 'Butler Service'] }
    ],
    budgetBreakdown: {
      flights: 19000,
      accommodation: 15000,
      foodDining: 7000,
      activitiesSightseeing: 9000,
      localTransport: 2500
    },
    inclusions: [
      'Complete EZ-Link MRT subway route map with exact station exit guidance',
      'Hawker Centre ordering guide & Michelin food stalls location map',
      'Direct WhatsApp line to Singapore Destination Expert planner',
      'Combo ticketing discount secrets for Gardens by the Bay + Universal'
    ],
    exclusions: [
      'Singapore Tourist Visa (Agent assists with fast paper eVisa application)',
      'Direct entry admission tickets'
    ]
  },
  {
    id: 'thailand-5d',
    slug: 'thailand-bangkok-pattaya-island-culture',
    destination: 'Thailand',
    country: 'Thailand',
    region: 'International',
    title: 'Treasures of Thailand: Bangkok Temples, Coral Island Pattaya & Floating Markets',
    durationDays: 5,
    durationNights: 4,
    travelerType: 'Group',
    itineraryCountLabel: '142 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 32000,
    rating: 4.9,
    reviewCount: 142,
    coverImage: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The ideal golden combo: Bangkok’s Grand Palace, Wat Pho Reclining Buddha, Chao Phraya dinner cruise, combined with Pattaya’s Coral Island parasailing, Alcazar cabaret show, and bustling night markets.',
    bestTimeToVisit: 'November to February (Cool & dry breeze)',
    isPopular: true,
    agent: {
      id: 'ag-104',
      agencyName: 'Siam Discovery Travel Pvt Ltd',
      founderName: 'Pradeep Sharma',
      gstNumber: '07AAGCS1290K1ZP',
      isVerified: true,
      yearsInBusiness: 14,
      location: 'New Delhi & Bangkok',
      rating: 4.9,
      reviewCount: 420,
      phone: '+91 98110 33290',
      whatsapp: '+91 98110 33290',
      email: 'info@siamdiscovery.in',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 54
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Bangkok, Transfer to Pattaya & Alcazar Cabaret Show',
        morning: 'Arrival at Suvarnabhumi Airport (BKK); meet driver; 2-hour private expressway drive to Pattaya seaside resort.',
        afternoon: 'Check-in to sea-view hotel in North Pattaya; relax by the pool; stroll through Central Pattaya Beach road.',
        evening: 'VIP seats at the world-renowned Alcazar Cabaret Dance Show with dazzling costumes; dinner at Indian oceanfront restaurant.',
        highlights: ['Private Highway Transfer', 'Pattaya Beachfront Hotel', 'Alcazar Cabaret VIP Show']
      },
      {
        dayNumber: 2,
        title: 'Speedboat to Coral Island (Koh Larn), Parasailing & Sea Walking',
        morning: 'Board shared speedboat to turquoise waters of Coral Island (Koh Larn); enjoy thrilling parasailing over the Gulf of Thailand.',
        afternoon: 'Underwater sea walking among tropical fish; banana boat rides; freshly prepared seafood lunch on white sandy beach.',
        evening: 'Return to mainland; visit Sanctuary of Wood Temple or enjoy Thai herbal massage; explore Pattaya Walking Street.',
        highlights: ['Coral Island Speedboat', 'Parasailing & Sea Walking', 'Traditional Thai Massage']
      },
      {
        dayNumber: 3,
        title: 'Pattaya to Bangkok via Gems Gallery & Chao Phraya Luxury Dinner Cruise',
        morning: 'Scenic journey back to Bangkok; visit world’s biggest World Gems Collection & handicraft centre.',
        afternoon: 'Hotel check-in in Sukhumvit/Pratunam; explore Siam Paragon or MBK Centre for electronics and fashion.',
        evening: 'Board White Orchid or Chaophraya Princess Luxury River Cruise; live saxophone band, Thai classical dance & grand buffet dinner.',
        highlights: ['World Gems Gallery', 'Siam Shopping Hub', 'Chao Phraya Dinner Cruise']
      },
      {
        dayNumber: 4,
        title: 'Grand Palace, Wat Pho Reclining Buddha & Asiatique The Riverfront',
        morning: 'Visit the majestic Grand Palace and sacred Wat Phra Kaew (Emerald Buddha); admire Thai royal architectural genius.',
        afternoon: 'Marvel at the 46-meter long gold-leaf Reclining Buddha at Wat Pho; take ferry across river to porcelain Wat Arun (Temple of Dawn).',
        evening: 'Sunset ferry to Asiatique The Riverfront open-air night bazaar; giant ferris wheel and artisanal craft shopping.',
        highlights: ['Grand Palace Complex', 'Wat Pho Reclining Buddha', 'Wat Arun Sunset & Asiatique']
      },
      {
        dayNumber: 5,
        title: 'Damnoen Saduak Floating Market & Suvarnabhumi Airport Departure',
        morning: 'Early morning excursion to Damnoen Saduak Floating Market; board wooden longtail boat gliding through fruit sellers.',
        afternoon: 'Pick up famous Thai dried fruits and Thai silk souvenirs at Platinum Fashion Mall; airport transfer.',
        evening: 'Assisted check-in at BKK airport for return flight.',
        highlights: ['Floating Market Longtail Boat', 'Platinum Mall Shopping', 'Seamless Airport Drop']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Ibis Pattaya / Season Siam Bangkok', rating: 4.3, estPricePerNight: '₹2,500 - ₹4,000', perks: ['Value for Money', 'Swimming Pool', 'Central Location'] },
      { tier: 'Comfort', name: 'Amari Pattaya / The Berkeley Pratunam Bangkok', rating: 4.7, estPricePerNight: '₹6,000 - ₹9,500', perks: ['Water Park & Lazy River', 'Direct Mall Access', 'Huge Buffet'] },
      { tier: 'Luxury', name: 'Dusit Thani Pattaya / Banyan Tree Bangkok', rating: 4.9, estPricePerNight: '₹16,000 - ₹28,000', perks: ['Private Beach Cove', 'Moon Bar Rooftop Views', 'Luxury Spa'] }
    ],
    budgetBreakdown: {
      flights: 16000,
      accommodation: 8000,
      foodDining: 4500,
      activitiesSightseeing: 5000,
      localTransport: 2500
    },
    inclusions: [
      'Detailed hourly road & boat travel navigation notes',
      'Bargaining cheat-sheet for Bangkok markets & tuk-tuks',
      'Direct WhatsApp access to certified Thailand inbound operator',
      'Indian meal options directory in Pattaya and Bangkok'
    ],
    exclusions: [
      'Thailand Visa on Arrival or electronic Visa fee',
      'Personal water sports fees at Coral Island'
    ]
  },
  {
    id: 'europe-7d',
    slug: 'europe-swiss-alps-hallstatt-paris-highlights',
    destination: 'Europe',
    country: 'Switzerland & Austria',
    region: 'International',
    title: 'Dream Europe Alpine Odyssey: Swiss Alps, Lucerne & Fairytale Hallstatt',
    durationDays: 7,
    durationNights: 6,
    travelerType: 'Couple',
    itineraryCountLabel: '210 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 145000,
    rating: 4.98,
    reviewCount: 210,
    coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The definitive European postcard holiday. Journey through Zurich, Lucerne, Mount Titlis revolving cable car, scenic Swiss rail across Lauterbrunnen 72 waterfalls, and fairytale lakeside Hallstatt in Austria.',
    bestTimeToVisit: 'May to October for alpine lakes, or Dec - Mar for snow ski',
    isPopular: true,
    agent: {
      id: 'ag-105',
      agencyName: 'EuroVistas Tours & Travels Pvt Ltd',
      founderName: 'Ananya Sengupta',
      gstNumber: '19AAACE4910Q1Z7',
      isVerified: true,
      yearsInBusiness: 16,
      location: 'Kolkata & Zurich',
      rating: 4.95,
      reviewCount: 512,
      phone: '+91 98300 77123',
      whatsapp: '+91 98300 77123',
      email: 'concierge@eurovistas.com',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 88
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Zurich, Swiss Travel Pass Activation & Lucerne Lake Cruise',
        morning: 'Arrive at Zurich Airport (ZRH); validate 4-Day First-Class Swiss Travel Pass; train to romantic Lucerne (50 mins).',
        afternoon: 'Stroll across 14th-century wooden Chapel Bridge (Kapellbrücke) and poignant Lion Monument.',
        evening: 'Scenic paddle-steamer cruise on Lake Lucerne with snow-dusted peaks in background; Swiss cheese fondue dinner.',
        highlights: ['First-Class Swiss Train', 'Historic Chapel Bridge', 'Lake Lucerne Steamer Cruise']
      },
      {
        dayNumber: 2,
        title: 'Mount Titlis Rotair Revolving Cable Car & Glacier Cliff Walk',
        morning: 'Train to Engelberg; board world-first revolving Titlis Rotair cable car ascending to 3,020 meters above sea level.',
        afternoon: 'Walk across Titlis Cliff Walk (Europe’s highest suspension footbridge); explore magical deep blue Glacier Cave.',
        evening: 'Return to Lucerne; lakeside evening walk; Swiss artisan chocolate shopping at Läderach.',
        highlights: ['Titlis Rotair Cable Car', 'Cliff Suspension Bridge', 'Läderach Chocolate Tasting']
      },
      {
        dayNumber: 3,
        title: 'Interlaken, Lauterbrunnen Valley of 72 Waterfalls & Grindelwald First',
        morning: 'GoldenPass train from Lucerne over Brünig Pass to Interlaken and fairytale Lauterbrunnen valley.',
        afternoon: 'Hike past roaring Staubbach Fall; cable car to Grindelwald-First for First Cliff Walk by Tissot.',
        evening: 'Cozy dinner in chalet village of Grindelwald with views of majestic Eiger North Face.',
        highlights: ['Lauterbrunnen Valley', 'Staubbach Waterfalls', 'Grindelwald First Cliff Walk']
      },
      {
        dayNumber: 4,
        title: 'Jungfraujoch – Top of Europe & Aletsch Glacier Ice Palace',
        morning: 'Board high-tech Eiger Express tricable gondola up to Jungfraujoch (3,454m), highest train station in Europe.',
        afternoon: 'Step onto Sphinx Observatory deck overlooking great Aletsch Glacier (UNESCO World Heritage); wander Ice Palace sculptures.',
        evening: 'Scenic train descent via Wengen; return to Zurich for overnight stay in city center.',
        highlights: ['Eiger Express Tricable Gondola', 'Sphinx Observatory', 'Aletsch Glacier Ice Palace']
      },
      {
        dayNumber: 5,
        title: 'Scenic ÖBB Rail to Salzburg & Fairytale Hallstatt Lake Village',
        morning: 'Comfortable rail journey crossing into Austria; arrive in breathtaking Salzkammergut Lake District.',
        afternoon: 'Arrive in world-famous fairytale Hallstatt; stroll ancient cobblestone market square and 7,000-year-old salt mine.',
        evening: 'Lakeside dinner overlooking tranquil swans and mirror reflections of Austrian wooden timber homes.',
        highlights: ['Salzkammergut Lake District', 'Hallstatt Market Square', 'World Oldest Salt Mine']
      },
      {
        dayNumber: 6,
        title: 'Salzburg Sound of Music Landmarks & Mirabell Gardens',
        morning: 'Short transfer to Mozart’s birthplace, Salzburg; explore Hohensalzburg Fortress high above baroque old town.',
        afternoon: 'Walk through Mirabell Gardens and Palace (filming spot for Do-Re-Mi); explore Getreidegasse boutique street.',
        evening: 'Classical Mozart evening concert at fortress hall with panoramic city views.',
        highlights: ['Hohensalzburg Fortress', 'Mirabell Gardens', 'Mozart Birthplace & Concert']
      },
      {
        dayNumber: 7,
        title: 'Vienna Panorama, Schönbrunn Palace & Flight Departure',
        morning: 'High-speed Railjet to Vienna; marvel at imperial Schönbrunn Palace and lavish Habsburg gardens.',
        afternoon: 'Enjoy authentic Viennese coffee and Sachertorte chocolate cake at historic Café Central.',
        evening: 'Vienna International Airport (VIE) departure for flight back home.',
        highlights: ['Schönbrunn Imperial Palace', 'Café Central Sachertorte', 'Direct Airport Express']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Ibis Styles Lucerne / Meininger Salzburg', rating: 4.4, estPricePerNight: '₹9,000 - ₹12,000', perks: ['Walking to Main Station', 'Free Wi-Fi', 'Continental Breakfast'] },
      { tier: 'Comfort', name: 'Hotel des Balances Lucerne / Heritage Hotel Hallstatt', rating: 4.8, estPricePerNight: '₹22,000 - ₹35,000', perks: ['Balcony Lake Views', 'Historic Boutique Charms', 'Gourmet Dining'] },
      { tier: 'Luxury', name: 'Victoria-Jungfrau Interlaken / Sacher Salzburg', rating: 5.0, estPricePerNight: '₹65,000 - ₹1,20,000', perks: ['Spa & Thermal Bath', 'World Famous Sacher Hotel', 'Five-Star Butler'] }
    ],
    budgetBreakdown: {
      flights: 55000,
      accommodation: 48000,
      foodDining: 22000,
      activitiesSightseeing: 14000,
      localTransport: 16000
    },
    inclusions: [
      'Complete Swiss Travel Pass vs Point-to-point ticket optimization strategy',
      'Schengen Visa appointment booking guide & document checklist template',
      'Step-by-step train platform numbers and transfer timings guide',
      'Direct WhatsApp and emergency helpline of certified European itinerary planner'
    ],
    exclusions: [
      'Schengen Visa fees and biometric appointment costs',
      'Swiss Pass & mountain excursion tickets'
    ]
  },
  {
    id: 'bali-5d',
    slug: 'bali-ubud-temples-seminyak-beaches-nusa-penida',
    destination: 'Bali',
    country: 'Indonesia',
    region: 'International',
    title: 'Tropical Bali Magic: Ubud Rice Terraces, Nusa Penida & Uluwatu Sunset',
    durationDays: 5,
    durationNights: 4,
    travelerType: 'Couple',
    itineraryCountLabel: '64 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 38000,
    rating: 4.92,
    reviewCount: 64,
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Immerse yourself in the Island of the Gods: emerald Tegalalang rice terraces in Ubud, thrilling jungle swings, sacred water temples, speed boat excursion to Nusa Penida’s Kelingking T-Rex cliff, and Uluwatu cliff sunset with Kecak fire dance.',
    bestTimeToVisit: 'April to October (Dry season, golden sunshine)',
    isPopular: true,
    agent: {
      id: 'ag-106',
      agencyName: 'Nusantara Global Tours Pvt Ltd',
      founderName: 'Ketut Wijaya & Rahul Nair',
      gstNumber: '32AABCN5540M1Z2',
      isVerified: true,
      yearsInBusiness: 10,
      location: 'Kochi & Denpasar',
      rating: 4.9,
      reviewCount: 290,
      phone: '+91 98470 22390',
      whatsapp: '+91 98470 22390',
      email: 'bali@nusantaraglobal.com',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 38
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Denpasar (DPS), Transfer to Cultural Ubud & Sacred Monkey Forest',
        morning: 'Arrive at Ngurah Rai International Airport; meet private English-speaking Balinese driver; scenic drive through artisan villages to Ubud.',
        afternoon: 'Hotel check-in to jungle-view villa; stroll through Sacred Monkey Forest Sanctuary with hundreds of playful Balinese macaques.',
        evening: 'Explore Ubud Art Market for bamboo straw bags and batik; dinner at Bebek Bengil (famous crispy duck restaurant).',
        highlights: ['Private Balinese Chauffeur', 'Sacred Monkey Forest', 'Authentic Ubud Art Market']
      },
      {
        dayNumber: 2,
        title: 'Tegalalang Rice Terraces, Aloha Jungle Swing & Tirta Empul Holy Water',
        morning: 'Sunrise photo shoot at emerald Tegalalang Rice Terraces; fly over jungle valley on iconic giant Bali Swing.',
        afternoon: 'Visit Tirta Empul Temple; take part in traditional Balinese Melukat holy water cleansing purification ritual.',
        evening: 'Sip Luwak coffee at scenic spice plantation; dinner in Ubud overlooking illuminated rainforest ravines.',
        highlights: ['Tegalalang Rice Paddies', 'Giant Jungle Swing', 'Holy Water Purification Ritual']
      },
      {
        dayNumber: 3,
        title: 'Speedboat to Nusa Penida Island: Kelingking T-Rex Cliff & Broken Beach',
        morning: 'Early morning speedboat from Sanur port to rugged Nusa Penida island.',
        afternoon: 'Marvel at jaw-dropping Kelingking T-Rex shaped cliff towering over turquoise ocean; visit Angel’s Billabong natural infinity pool and Broken Beach.',
        evening: 'Speedboat return to main island; transfer to trendy beachfront hotel in Seminyak or Canggu.',
        highlights: ['Kelingking T-Rex Cliff', 'Angel’s Billabong Pool', 'Seminyak Beachfront Sunset']
      },
      {
        dayNumber: 4,
        title: 'Seminyak Beach Clubs, Uluwatu Cliff Temple & Sunset Kecak Fire Dance',
        morning: 'Relaxed morning at Seminyak or Canggu; surf lesson or chill at beachfront club like Potato Head or Café del Mar.',
        afternoon: 'Drive along Bukit Peninsula; visit ancient Uluwatu Temple perched 70 meters high on a sheer limestone ocean cliff.',
        evening: 'Watch hypnotic Kecak Fire Dance performed against dramatic Indian Ocean sunset backdrop; seafood BBQ dinner on Jimbaran Bay sands.',
        highlights: ['Potato Head Beach Club', 'Uluwatu Cliff Temple', 'Kecak Fire Dance & Jimbaran BBQ']
      },
      {
        dayNumber: 5,
        title: 'Tanah Lot Water Temple, Souvenir Shopping & Denpasar Departure',
        morning: 'Visit iconic Tanah Lot Temple resting on an offshore rock formation wrapped in ocean waves.',
        afternoon: 'Last-minute shopping at Krisna Oleh Oleh for authentic Balinese coffee and handmade soaps; packing & checkout.',
        evening: 'Transfer to Denpasar airport for homeward flight.',
        highlights: ['Tanah Lot Rock Temple', 'Krisna Oleh Souvenir Hub', 'Seamless Airport Drop']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Komaneka at Rasa Sayang Ubud / Fairfield by Marriott Seminyak', rating: 4.4, estPricePerNight: '₹3,500 - ₹5,500', perks: ['Swimming Pool', 'Tropical Garden', 'Free Wi-Fi'] },
      { tier: 'Comfort', name: 'Padma Resort Ubud / W Bali Seminyak', rating: 4.8, estPricePerNight: '₹14,000 - ₹24,000', perks: ['Heated Infinity Pool', 'Beachfront Club', 'Luxury Spa'] },
      { tier: 'Luxury', name: 'Viceroy Bali / Bulgari Resort Bali', rating: 5.0, estPricePerNight: '₹48,000 - ₹95,000', perks: ['Valley Villa with Pool', 'Helipad Access', 'Private Ocean Butler'] }
    ],
    budgetBreakdown: {
      flights: 21000,
      accommodation: 10000,
      foodDining: 5000,
      activitiesSightseeing: 5000,
      localTransport: 3000
    },
    inclusions: [
      'Day-by-day GPS coordinates for photo spots and hidden beaches',
      'Driver tipping guidance and money exchange security tips',
      'Direct WhatsApp and emergency line to verified Bali agency founder',
      'Nusa Penida boat timing and sea-sickness prevention advisory'
    ],
    exclusions: [
      'Indonesia Visa on Arrival (USD 35 / ~₹2,900 payable at airport or online)',
      'Bali Tourist Levy (IDR 150,000 / ~₹800)'
    ]
  },
  {
    id: 'kashmir-6d',
    slug: 'grand-kashmir-srinagar-gulmarg-pahalgam',
    destination: 'Kashmir',
    country: 'India',
    region: 'Domestic',
    title: 'Grand Kashmir Paradise: Dal Lake Houseboat, Gulmarg Gondola & Betaab Valley',
    durationDays: 6,
    durationNights: 5,
    travelerType: 'Family',
    itineraryCountLabel: '92 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 36000,
    rating: 4.94,
    reviewCount: 112,
    coverImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1624823183493-5f67b579c501?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The definitive 6-day Kashmir family tour covering Dal Lake floating houseboats, Gulmarg Gondola Phase 2 snow peaks, Pahalgam Lidder River valley, and Aru & Betaab valleys.',
    bestTimeToVisit: 'March to November (Tulips in Spring, Snow in Winter)',
    isPopular: true,
    agent: {
      id: 'ag-107',
      agencyName: 'Pir Panjal Adventures LLP',
      founderName: 'Showkat Dar',
      gstNumber: '01AABCP8841L1Z2',
      isVerified: true,
      yearsInBusiness: 9,
      location: 'Srinagar, J&K',
      rating: 4.88,
      reviewCount: 260,
      phone: '+91 94190 33810',
      whatsapp: '+91 94190 33810',
      email: 'showkat@pirpanjaladventures.in',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 24
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Srinagar, Dal Lake Shikara & Cedarwood Houseboat',
        morning: 'Airport pick up in Srinagar; check into heritage hand-carved cedarwood luxury houseboat.',
        afternoon: 'Relaxed Shikara boat ride across Dal Lake floating gardens, lotus blooms, and Char Chinar.',
        evening: 'Sunset over Zabarwan mountains; authentic multi-course Kashmiri Wazwan feast on the houseboat.',
        highlights: ['Private Airport Transfer', 'Shikara Sunset Cruise', 'Cedarwood Houseboat Stay']
      },
      {
        dayNumber: 2,
        title: 'Srinagar to Gulmarg & Phase 1 and 2 Gondola Summit',
        morning: 'Morning drive to Gulmarg (52 km); check-in at mountain resort.',
        afternoon: 'Ascend Gulmarg Gondola Phase 1 (Kongdoori) & Phase 2 (Apharwat Peak at 13,780 ft) for breathtaking snow views.',
        evening: 'Snow sledging or hot Kahwa saffron tea with Kashmiri walnut cookies; bonfire dinner.',
        highlights: ['Apharwat Peak Summit', 'Gondola Phase 2 Snow Walk', 'Pine Forest Drive']
      },
      {
        dayNumber: 3,
        title: 'Gulmarg to Pahalgam (Valley of Shepherds)',
        morning: 'Scenic highway drive from Gulmarg to Pahalgam via saffron fields of Pampore.',
        afternoon: 'Check-in to riverside resort along the roaring Lidder River; stroll through Pahalgam market.',
        evening: 'Riverside trout fish dinner under star-studded Himalayan skies.',
        highlights: ['Pampore Saffron Farms', 'Lidder River Walk', 'Riverside Mountain Dining']
      },
      {
        dayNumber: 4,
        title: 'Pahalgam: Aru Valley, Betaab Valley & Chandanwari',
        morning: 'Local eco-cab excursion to picturesque Aru Valley and meadow walk.',
        afternoon: 'Explore lush green Betaab Valley (named after the Bollywood classic) & Chandanwari snow point.',
        evening: 'Relax by riverside bonfire with roasted corn and Kashmiri kahwa.',
        highlights: ['Betaab Valley Scenic Meadows', 'Aru Valley Panorama', 'Chandanwari Snow Stream']
      },
      {
        dayNumber: 5,
        title: 'Pahalgam to Srinagar, Mughal Gardens & Heritage Crafts',
        morning: 'Drive back to Srinagar; visit cascading Mughal water gardens (Nishat & Shalimar Bagh).',
        afternoon: 'Visit authentic Pashmina weaving and walnut wood carving artisan workshop.',
        evening: 'Sunset walking tour along Boulevard Road overlooking illuminated Dal Lake.',
        highlights: ['Nishat Bagh Mughal Terraces', 'Artisan Pashmina Loom', 'Waterfront Promenade']
      },
      {
        dayNumber: 6,
        title: 'Floating Market, Dry Fruits Shopping & Departure',
        morning: 'Early 6:30 AM Shikara ride to century-old floating vegetable & flower bazaar.',
        afternoon: 'Pick up finest Kashmiri saffron, walnuts, and dried apricots at Lal Chowk.',
        evening: 'Assisted drop-off at Srinagar Airport 2.5 hours prior to flight.',
        highlights: ['Early Morning Floating Bazaar', 'Dry Fruits Shopping', 'Smooth Departure']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Hotel Royal Heritage Srinagar', rating: 4.4, estPricePerNight: '₹3,200', perks: ['Near Dal Lake', 'Heating'] },
      { tier: 'Comfort', name: 'Sukoon Luxury Houseboat / Pine Palace Gulmarg', rating: 4.8, estPricePerNight: '₹8,500', perks: ['Mountain View', 'Heated Rooms', 'Wazwan Dining'] },
      { tier: 'Luxury', name: 'The Khyber Himalayan Resort Gulmarg', rating: 4.96, estPricePerNight: '₹29,000', perks: ['Gondola Proximity', 'Heated Indoor Pool', 'Spa'] }
    ],
    budgetBreakdown: {
      flights: 12000,
      accommodation: 12000,
      foodDining: 5000,
      activitiesSightseeing: 5000,
      localTransport: 4000
    },
    inclusions: [
      'Day-by-day routing with verified non-union driver contacts',
      'Gondola Phase 1 & 2 booking slot timing master guide',
      'Artisan craft authenticity certification tips'
    ],
    exclusions: ['Airfare and hotel bookings', 'Personal shopping and pony ride charges']
  },
  {
    id: 'goa-4d',
    slug: 'sunny-goa-beach-heritage-getaway',
    destination: 'Goa',
    country: 'India',
    region: 'Domestic',
    title: 'Sunny Goa Paradise: Calangute, Dudhsagar Waterfalls & Old Goa Heritage',
    durationDays: 4,
    durationNights: 3,
    travelerType: 'Group',
    itineraryCountLabel: '88 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 18000,
    rating: 4.89,
    reviewCount: 134,
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Experience the best of North and South Goa: pristine white sand beaches, UNESCO Portuguese churches, spice plantations, Dudhsagar waterfalls jeep safari, and vibrant beach shacks.',
    bestTimeToVisit: 'October to May',
    isPopular: true,
    agent: {
      id: 'ag-109',
      agencyName: 'Goa Coastal Horizons Tours',
      founderName: 'Alfonso Fernandes',
      gstNumber: '30AAACG4419N1ZX',
      isVerified: true,
      yearsInBusiness: 12,
      location: 'Panaji & Candolim',
      rating: 4.9,
      reviewCount: 310,
      phone: '+91 98221 55432',
      whatsapp: '+91 98221 55432',
      email: 'bookings@goacoastalhorizons.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 36
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival, Candolim Beach & Sunset Cruise on Mandovi River',
        morning: 'Airport / Madgaon station pickup; check into beachfront resort in North Goa.',
        afternoon: 'Relax at Candolim / Calangute beach; sample Goan fish curry thali and Bebinca dessert.',
        evening: 'Sunset luxury catamaran cruise on Mandovi River with live Goan folk dance and DJ.',
        highlights: ['Private Airport Pickup', 'Candolim Beach Front', 'Mandovi River Sunset Cruise']
      },
      {
        dayNumber: 2,
        title: 'Dudhsagar Waterfalls 4x4 Safari & Sahakari Spice Plantation',
        morning: 'Early 4x4 open jeep safari through Mollem National Park forest to milky Dudhsagar Falls; swim in natural pool.',
        afternoon: 'Visit organic Sahakari Spice Plantation; traditional Goan buffet lunch served on banana leaves.',
        evening: 'Relax back at hotel or explore Anjuna beach night market with live music.',
        highlights: ['Dudhsagar 4x4 Jeep Safari', 'Natural Jungle Pool Swim', 'Spice Plantation Feast']
      },
      {
        dayNumber: 3,
        title: 'Old Goa Basilica, Fontainhas Latin Quarter & Vagator Sunset',
        morning: 'Explore UNESCO heritage Basilica of Bom Jesus and Se Cathedral in Old Goa.',
        afternoon: 'Walk through colorful Portuguese heritage street of Fontainhas in Panaji; visit Chapora Fort (Dil Chahta Hai point).',
        evening: 'Sunset cocktails at iconic clifftop beach club Thalassa or Titlie in Vagator.',
        highlights: ['Old Goa UNESCO Basilica', 'Fontainhas Latin Quarter', 'Thalassa Sunset Lounge']
      },
      {
        dayNumber: 4,
        title: 'Water Sports at Baga Beach, Cashew Shopping & Departure',
        morning: 'Jet ski, parasailing, and banana boat rides at Baga Beach.',
        afternoon: 'Pick up authentic Goan feni, roasted cashews, and spices at Mapusa market.',
        evening: 'Assisted airport transfer to MOPA or Dabolim airport for your flight home.',
        highlights: ['Baga Parasailing & Watersports', 'Goan Cashews & Souvenirs', 'Smooth Airport Drop']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Santana Beach Resort Candolim', rating: 4.4, estPricePerNight: '₹2,800', perks: ['Direct Beach Access', 'Two Pools'] },
      { tier: 'Comfort', name: 'Taj Fort Aguada Resort & Spa', rating: 4.85, estPricePerNight: '₹14,000', perks: ['Sea-Facing Cliff', 'Heritage Luxury'] },
      { tier: 'Luxury', name: 'W Goa Vagator / The St. Regis Goa', rating: 4.98, estPricePerNight: '₹28,000', perks: ['Rock Pool', 'Private Butler', 'VIP Beach Cabanas'] }
    ],
    budgetBreakdown: {
      flights: 7000,
      accommodation: 6000,
      foodDining: 3000,
      activitiesSightseeing: 2000,
      localTransport: 1000
    },
    inclusions: [
      'Pre-negotiated self-drive car/scooter rental verified numbers',
      'Dudhsagar forest permit booking slot hack',
      'Curated list of hidden, non-crowded secret Goan beaches'
    ],
    exclusions: ['Airfare and hotel tariffs', 'Personal watersports charges']
  },
  {
    id: 'kerala-5d',
    slug: 'gods-own-country-munnar-thekkady-alleppey',
    destination: 'Kerala',
    country: 'India',
    region: 'Domestic',
    title: "God's Own Country: Munnar Tea Hills, Thekkady Safari & Alleppey Houseboat",
    durationDays: 5,
    durationNights: 4,
    travelerType: 'Couple',
    itineraryCountLabel: '94 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 24000,
    rating: 4.95,
    reviewCount: 178,
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Serene exploration of God’s Own Country: misty green tea plantations of Munnar, Periyar wildlife boat safari in Thekkady, and a private overnight traditional thatch houseboat cruise through tranquil Alleppey backwaters.',
    bestTimeToVisit: 'September to March',
    isPopular: true,
    agent: {
      id: 'ag-110',
      agencyName: 'Malabar Backwaters & Hills Pvt Ltd',
      founderName: 'Mathew Kurian',
      gstNumber: '32AABCM9102K1Z5',
      isVerified: true,
      yearsInBusiness: 15,
      location: 'Kochi & Alleppey',
      rating: 4.95,
      reviewCount: 480,
      phone: '+91 94470 11982',
      whatsapp: '+91 94470 11982',
      email: 'mathew@malabarbackwaters.in',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 44
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Cochin, Cheeyappara Waterfalls & Drive to Munnar',
        morning: 'Pickup at Cochin International Airport (COK); scenic hillside drive through rubber estates and cardamom plantations.',
        afternoon: 'Stop at Cheeyappara and Valara cascading waterfalls; check into hilltop resort in Munnar surrounded by tea gardens.',
        evening: 'Stroll through blossom gardens of Munnar town; sip fresh Nilgiri tea with warm cardamom banana fritters.',
        highlights: ['Cheeyappara Waterfalls', 'Munnar Tea Valley Drive', 'Hillside Resort Check-in']
      },
      {
        dayNumber: 2,
        title: 'Eravikulam National Park, Mattupetty Dam & Tea Museum',
        morning: 'Early morning safari in Eravikulam National Park (home to endangered Nilgiri Tahr mountain goat).',
        afternoon: 'Visit scenic Mattupetty Dam, Echo Point, and Tata Tea Museum with tea tasting workshop.',
        evening: 'Authentic Kerala Ayurvedic herbal oil body massage (Abhyangam) at resort spa.',
        highlights: ['Eravikulam Nilgiri Tahr', 'Mattupetty Speedboating', 'Ayurvedic Spa Rejuvenation']
      },
      {
        dayNumber: 3,
        title: 'Munnar to Thekkady: Spice Gardens & Periyar Wildlife Safari',
        morning: 'Scenic winding drive to Thekkady (Periyar); check-in to jungle lodge.',
        afternoon: 'Guided spice plantation walk learning about black pepper, vanilla, and cloves; Periyar lake boat safari.',
        evening: 'Watch thrilling Kalaripayattu martial arts and colorful Kathakali cultural dance performance.',
        highlights: ['Periyar Lake Wildlife Safari', 'Spice Plantation Walk', 'Kalaripayattu Martial Arts Show']
      },
      {
        dayNumber: 4,
        title: 'Thekkady to Alleppey: Private Deluxe Houseboat Backwater Cruise',
        morning: 'Drive down to Alleppey jetty; board traditional private air-conditioned thatched Kettuvallam Houseboat.',
        afternoon: 'Cruise through emerald palm-fringed canals and paddy fields; freshly prepared Kerala lunch with Karimeen Pollichathu.',
        evening: 'Sunset over Vembanad Lake; village fishing walk; romantic candlelit dinner prepared by on-board private chef.',
        highlights: ['Private Houseboat Cruise', 'Karimeen Fish Fry Feast', 'Vembanad Lake Stargazing']
      },
      {
        dayNumber: 5,
        title: 'Fort Kochi Heritage, Chinese Fishing Nets & Airport Drop',
        morning: 'Houseboat breakfast; drive to historic Fort Kochi; see iconic giant cantilevered Chinese Fishing Nets.',
        afternoon: 'Explore Jew Town, Paradesi Synagogue, and antique spice shops.',
        evening: 'Assisted drop-off at Cochin Airport for return flight.',
        highlights: ['Chinese Fishing Nets', 'Jew Town Antiques', 'Smooth Airport Connection']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Tea County Munnar / Lake Palace Alleppey', rating: 4.4, estPricePerNight: '₹3,500', perks: ['Tea Garden View', 'Breakfast Included'] },
      { tier: 'Comfort', name: 'Fragrant Nature Munnar / Luxury Premium Houseboat', rating: 4.8, estPricePerNight: '₹9,000', perks: ['Private Houseboat Chef', 'Fireplace Room'] },
      { tier: 'Luxury', name: 'Kumarakom Lake Resort / Spice Village Thekkady', rating: 4.96, estPricePerNight: '₹26,000', perks: ['Heritage Pool Villa', 'Private Lake Jetty'] }
    ],
    budgetBreakdown: {
      flights: 8000,
      accommodation: 9000,
      foodDining: 3500,
      activitiesSightseeing: 2500,
      localTransport: 1000
    },
    inclusions: [
      'Direct government-licensed Houseboat operator contacts (avoids middleman 40% markup)',
      'Eravikulam National Park online advance booking instructions',
      'Authentic certified Ayurvedic centres directory'
    ],
    exclusions: ['Airfare and accommodation fees', 'Personal spa treatment packages']
  },
  {
    id: 'manali-5d',
    slug: 'manali-snow-solang-valley-atal-tunnel',
    destination: 'Manali',
    country: 'India',
    region: 'Domestic',
    title: 'Manali Snow Odyssey: Solang Valley, Rohtang Snow & Atal Tunnel Sissu',
    durationDays: 5,
    durationNights: 4,
    travelerType: 'Group',
    itineraryCountLabel: '86 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 19000,
    rating: 4.91,
    reviewCount: 145,
    coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571843439991-dd2b8e051966?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Spectacular snow and adventure holiday in Himachal: Hadimba Temple, Old Manali cafes, paragliding in Solang Valley, driving through the engineering marvel of Atal Tunnel to frozen Sissu waterfalls in Lahaul Valley.',
    bestTimeToVisit: 'October to June (Snow from Dec to March)',
    isPopular: true,
    agent: {
      id: 'ag-111',
      agencyName: 'Himalayan Highs Travel LLP',
      founderName: 'Vikrant Thakur',
      gstNumber: '02AABCH8741M1Z1',
      isVerified: true,
      yearsInBusiness: 11,
      location: 'Manali & Chandigarh',
      rating: 4.9,
      reviewCount: 390,
      phone: '+91 98160 44820',
      whatsapp: '+91 98160 44820',
      email: 'vikrant@himalayanhighs.in',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 32
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Manali, Hadimba Temple & Old Manali Cafes',
        morning: 'Arrival at Manali (via Volvo bus or Bhuntar airport); check into mountain-view riverside resort.',
        afternoon: 'Visit ancient cedarwood Hadimba Devi Temple and Vashisht hot water sulfur springs.',
        evening: 'Stroll along cobblestone streets of Old Manali; wood-fired pizza dinner with acoustic live music.',
        highlights: ['Hadimba Forest Temple', 'Vashisht Hot Springs', 'Old Manali Cafe Culture']
      },
      {
        dayNumber: 2,
        title: 'Solang Valley Adventure Sports & Zorbing',
        morning: 'Drive to Solang Valley; soar high in tandem paragliding over snow peaks.',
        afternoon: 'Zorbing, ATV quad biking, and cable car ropeway ride to Mount Phatru.',
        evening: 'Bonfire dinner with local Himachali Siddu delicacy and trout fish fry.',
        highlights: ['Tandem Paragliding', 'Solang Ropeway Cable Car', 'Himachali Bonfire Night']
      },
      {
        dayNumber: 3,
        title: 'Atal Tunnel, Lahaul Valley & Frozen Sissu Waterfall',
        morning: 'Drive through world’s longest highway tunnel above 10,000 ft: Atal Tunnel (9.02 km).',
        afternoon: 'Emerge into breathtaking snowy landscapes of Lahaul Valley; walk to frozen Sissu Waterfall; snow tube rides.',
        evening: 'Return to Manali through illuminated tunnel; hot ginger lemon tea at Kothi.',
        highlights: ['Atal Tunnel Engineering Marvel', 'Sissu Waterfall Snow Point', 'Lahaul Valley Panorama']
      },
      {
        dayNumber: 4,
        title: 'Naggar Castle Heritage & Kullu White Water Rafting',
        morning: 'Visit historic 500-year-old Naggar Castle and Nicholas Roerich Art Gallery overlooking Beas valley.',
        afternoon: 'Thrilling Grade-3 white water rafting on Beas River in Kullu (14 km stretch).',
        evening: 'Pick up authentic Kullu woolen shawls and caps at Government Weaver Cooperative.',
        highlights: ['Naggar Heritage Castle', 'Kullu River Rafting', 'Kullu Shawl Handicrafts']
      },
      {
        dayNumber: 5,
        title: 'Mall Road Shopping & Departure',
        morning: 'Leisure morning walk along Mall Road; visit Tibetan Monastery.',
        afternoon: 'Pick up organic apple jam, pine nuts, and cedar wood souvenirs.',
        evening: 'Assisted boarding on evening luxury Volvo or airport drop at Bhuntar.',
        highlights: ['Tibetan Monastery', 'Himachali Apple Souvenirs', 'Smooth Volvo Boarding']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Hotel Snow Valley Resorts Manali', rating: 4.4, estPricePerNight: '₹2,600', perks: ['Snow Peak Views', 'Heated Rooms'] },
      { tier: 'Comfort', name: 'The Orchard Greens Resort & Spa', rating: 4.8, estPricePerNight: '₹6,500', perks: ['Apple Orchard', 'Balcony Views', 'Buffet'] },
      { tier: 'Luxury', name: 'Span Resort & Spa / The Himalayan Castle', rating: 4.98, estPricePerNight: '₹22,000', perks: ['Private Helipad', 'Riverside Luxury Suites', 'Spa'] }
    ],
    budgetBreakdown: {
      flights: 6000,
      accommodation: 6000,
      foodDining: 3500,
      activitiesSightseeing: 2500,
      localTransport: 1000
    },
    inclusions: [
      'Rohtang Pass NGT online permit application timing strategy',
      'Atal Tunnel snow chains and 4x4 driver verified contact list',
      'Safety equipment checklist for Beas river rafting'
    ],
    exclusions: ['Volvo bus / airfare tickets', 'Personal adventure sports gear rental']
  },
  {
    id: 'ladakh-6d',
    slug: 'majestic-ladakh-pangong-lake-nubra-valley',
    destination: 'Ladakh',
    country: 'India',
    region: 'Domestic',
    title: 'Majestic Ladakh: Leh Palace, Pangong Tso Lake & Nubra Valley Sand Dunes',
    durationDays: 6,
    durationNights: 5,
    travelerType: 'Group',
    itineraryCountLabel: '68 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 34000,
    rating: 4.96,
    reviewCount: 96,
    coverImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The ultimate high-altitude Himalayan road odyssey: Leh Palace, Magnetic Hill, crossing Khardung La (17,982 ft), double-humped camel safari in Nubra Valley dunes, and camping beside world-famous changing-color Pangong Tso Lake.',
    bestTimeToVisit: 'May to October',
    isPopular: true,
    agent: {
      id: 'ag-112',
      agencyName: 'Zanskar & Ladakh Treks LLP',
      founderName: 'Stanzin Dorjey',
      gstNumber: '01AABCZ6631P1Z9',
      isVerified: true,
      yearsInBusiness: 13,
      location: 'Leh Main Bazaar',
      rating: 4.95,
      reviewCount: 340,
      phone: '+91 94191 77210',
      whatsapp: '+91 94191 77210',
      email: 'stanzin@zanskartreks.in',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 28
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Leh (11,500 ft) & Mandatory Acclimatization',
        morning: 'Fly into Kushok Bakula Rimpochee Airport Leh; transfer to hotel; mandatory full-day rest for altitude acclimatization.',
        afternoon: 'Gentle walk to Leh Market in evening; sip hot butter tea (Gur Gur chai).',
        evening: 'Sunset view from Shanti Stupa overlooking entire Leh town and Stok Kangri peaks.',
        highlights: ['Scenic Flight Over Himalayas', 'Shanti Stupa Sunset', 'Altitude Acclimatization Guidance']
      },
      {
        dayNumber: 2,
        title: 'Magnetic Hill, Pathar Sahib Gurudwara & Sangam Confluence',
        morning: 'Drive down Indus valley; witness gravity-defying Magnetic Hill phenomenon.',
        afternoon: 'Visit sacred Gurudwara Pathar Sahib (maintained by Indian Army) and Sangam (confluence of Zanskar & Indus rivers).',
        evening: 'Explore 17th-century Leh Palace and Hall of Fame military war museum.',
        highlights: ['Magnetic Hill Mystery', 'Indus & Zanskar Sangam', 'Historic Leh Palace']
      },
      {
        dayNumber: 3,
        title: 'Leh to Nubra Valley via Khardung La Pass (17,982 ft)',
        morning: 'Drive across one of the highest motorable roads in the world: Khardung La Pass (17,982 ft); photo stop with Indian flag.',
        afternoon: 'Descend into lush Nubra Valley; visit giant 106-ft Maitreya Buddha statue at Diskit Monastery.',
        evening: 'Ride double-humped Bactrian Camels across Hunder white sand dunes with mountain backdrop; luxury Swiss tent camping.',
        highlights: ['Khardung La Summit (17,982 ft)', 'Diskit Golden Buddha', 'Hunder Sand Dunes Camel Safari']
      },
      {
        dayNumber: 4,
        title: 'Nubra Valley to Pangong Tso Lake via Shyok River Route',
        morning: 'Early morning drive through dramatic off-road trails along rushing Shyok River.',
        afternoon: 'First breathtaking sight of deep turquoise Pangong Tso Lake (14,270 ft) stretching across international borders.',
        evening: 'Stroll along lake shore; watch crystal blue waters change color at sunset; stargazing at Milky Way galaxy.',
        highlights: ['Shyok River Canyon Drive', 'Pangong Tso Blue Waters', 'Milky Way Stargazing at Lake']
      },
      {
        dayNumber: 5,
        title: 'Pangong Sunrise to Leh via Chang La Pass & Thiksey Monastery',
        morning: 'Golden sunrise over Pangong Lake; drive back to Leh crossing majestic Chang La Pass (17,590 ft).',
        afternoon: 'Tour Thiksey Monastery (resembling Potala Palace of Lhasa); visit Shey Palace.',
        evening: 'Farewell dinner at Tibetan Kitchen in Leh; sample steaming Momos and Thukpa noodle soup.',
        highlights: ['Pangong Golden Sunrise', 'Chang La Pass', 'Thiksey Monastery Complex']
      },
      {
        dayNumber: 6,
        title: 'Leh Airport Departure',
        morning: 'Transfer to Leh Airport with oxygenated vehicles.',
        afternoon: 'Board return flight with unforgettable memories of the Roof of the World.',
        evening: 'Home arrival.',
        highlights: ['Smooth Airport Drop', 'Himalayan Aerial Views']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Hotel Grand Willow Leh / Hunder Luxury Tents', rating: 4.4, estPricePerNight: '₹3,500', perks: ['Oxygen Cylinder Ready', 'Heated Bed'] },
      { tier: 'Comfort', name: 'The Grand Dragon Ladakh / Pangong Glamping Camp', rating: 4.85, estPricePerNight: '₹12,000', perks: ['Central Heating', 'Solar Water', 'Luxury Dining'] },
      { tier: 'Luxury', name: 'Chamba Camp Thiksey / The Abduz Leh', rating: 4.98, estPricePerNight: '₹45,000', perks: ['VIP Safari Glamping', 'Dedicated Butler', 'Gourmet Dining'] }
    ],
    budgetBreakdown: {
      flights: 14000,
      accommodation: 10000,
      foodDining: 4000,
      activitiesSightseeing: 3000,
      localTransport: 3000
    },
    inclusions: [
      'Inner Line Permit (ILP) & Protected Area Permit (PAP) online submission blueprint',
      'Acute Mountain Sickness (AMS) prevention and Diamox dosage protocol',
      'Ladakh Taxi Union approved fixed rate driver contacts'
    ],
    exclusions: ['Airfare and hotel tariffs', 'Camel ride and monument entry fees']
  },
  {
    id: 'rajasthan-6d',
    slug: 'royal-rajasthan-jaipur-jodhpur-udaipur',
    destination: 'Rajasthan',
    country: 'India',
    region: 'Domestic',
    title: 'Royal Rajasthan Heritage: Jaipur Pink City, Jodhpur Blue City & Udaipur Lakes',
    durationDays: 6,
    durationNights: 5,
    travelerType: 'Family',
    itineraryCountLabel: '110 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 29000,
    rating: 4.93,
    reviewCount: 168,
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Experience the regal splendor of India’s Desert Kingdom: Jaipur’s Amber Fort & Hawa Mahal, Jodhpur’s impregnable Mehrangarh Fort, and Udaipur’s romantic Lake Pichola boat cruises and grand palaces.',
    bestTimeToVisit: 'October to March',
    isPopular: true,
    agent: {
      id: 'ag-113',
      agencyName: 'Rajputana Heritage Journeys Pvt Ltd',
      founderName: 'Mahipendra Singh Rathore',
      gstNumber: '08AABCR7719L1Z8',
      isVerified: true,
      yearsInBusiness: 17,
      location: 'Jaipur & Udaipur',
      rating: 4.94,
      reviewCount: 520,
      phone: '+91 94140 66291',
      whatsapp: '+91 94140 66291',
      email: 'mahip@rajputanajourneys.com',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 52
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Jaipur, City Palace & Hawa Mahal Walk',
        morning: 'Airport / Railway station pickup; check into royal heritage haveli hotel in Jaipur.',
        afternoon: 'Tour the iconic Hawa Mahal (Palace of Winds), Jantar Mantar observatory, and City Palace museum.',
        evening: 'Traditional Rajasthani Thali dinner at Chokhi Dhani ethnic village with folk dance and puppet shows.',
        highlights: ['Heritage Haveli Check-in', 'Hawa Mahal Architecture', 'Chokhi Dhani Rajasthani Feast']
      },
      {
        dayNumber: 2,
        title: 'Amber Fort Elephant Ramp, Jaigarh & Jal Mahal',
        morning: 'Ascend majestic Amber Fort high on the Aravalli hills; admire the dazzling Sheesh Mahal (Mirror Palace).',
        afternoon: 'Visit Jaigarh Fort (housing world’s largest cannon on wheels); photo stop at floating Jal Mahal water palace.',
        evening: 'Bapu Bazaar shopping for handcrafted block-print quilts, juttis, and blue pottery.',
        highlights: ['Amber Fort Sheesh Mahal', 'World Largest Cannon at Jaigarh', 'Bapu Bazaar Shopping']
      },
      {
        dayNumber: 3,
        title: 'Jaipur to Jodhpur via Pushkar Brahma Temple',
        morning: 'Scenic expressway drive to Jodhpur; stop at sacred Pushkar Lake and the world’s only Brahma Temple.',
        afternoon: 'Arrive in Sun City Jodhpur; check into blue city heritage hotel.',
        evening: 'Sunset walk around Clock Tower market; sample authentic Mawa Kachori and Ghevar.',
        highlights: ['Pushkar Sacred Brahma Temple', 'Blue City Heritage Walk', 'Jodhpur Street Food']
      },
      {
        dayNumber: 4,
        title: 'Mehrangarh Fort, Jaswant Thada & Drive to Udaipur',
        morning: 'Explore massive Mehrangarh Fort rising 400 feet above the blue city; visit marble cenotaph of Jaswant Thada.',
        afternoon: 'Scenic drive through Aravalli hills to romantic Venice of the East: Udaipur; stop at Ranakpur Jain Temple.',
        evening: 'Check into lakeside palace hotel; relax by Lake Pichola promenade.',
        highlights: ['Mehrangarh Fort Ramparts', 'Ranakpur Marble Carvings', 'Udaipur Lakeside Arrival']
      },
      {
        dayNumber: 5,
        title: 'Udaipur City Palace & Lake Pichola Sunset Boat Cruise',
        morning: 'Tour grand Udaipur City Palace complex overlooking the serene lake.',
        afternoon: 'Visit Saheliyon Ki Bari royal fountains and Jagdish Temple.',
        evening: 'Private boat cruise on Lake Pichola passing Taj Lake Palace and Jag Mandir island at golden sunset.',
        highlights: ['City Palace Grandeur', 'Lake Pichola Sunset Cruise', 'Jag Mandir Island View']
      },
      {
        dayNumber: 6,
        title: 'Bagore Ki Haveli & Maharana Pratap Airport Departure',
        morning: 'Visit vintage car museum or stroll through Bagore Ki Haveli museum.',
        afternoon: 'Pick up miniature paintings and silver jewelry at Hathi Pol bazaar.',
        evening: 'Assisted airport transfer to Maharana Pratap Airport (UDR) for departure.',
        highlights: ['Vintage Car Museum', 'Rajasthani Silver Jewelry', 'Smooth Airport Drop']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Alsisar Haveli Jaipur / Mewar Haveli Udaipur', rating: 4.4, estPricePerNight: '₹3,500', perks: ['Heritage Courtyard', 'Rooftop Lake View'] },
      { tier: 'Comfort', name: 'Samode Haveli / Fateh Prakash Palace Udaipur', rating: 4.85, estPricePerNight: '₹11,000', perks: ['Lake Facing Rooms', 'Royal Hospitality', 'Pool'] },
      { tier: 'Luxury', name: 'The Leela Palace Udaipur / Rambagh Palace Jaipur', rating: 5.0, estPricePerNight: '₹48,000', perks: ['World Best Hotel Award', 'Private Boat Arrival', 'Royal Butler'] }
    ],
    budgetBreakdown: {
      flights: 9000,
      accommodation: 10000,
      foodDining: 4500,
      activitiesSightseeing: 3500,
      localTransport: 2000
    },
    inclusions: [
      'Jaipur & Udaipur combo monument pass discount links',
      'Lake Pichola private boat jetty direct booking hack',
      'Artisan authenticity guide for block print textiles & jewelry'
    ],
    exclusions: ['Airfare and accommodation tariffs', 'Camera monument fees']
  },
  {
    id: 'vietnam-6d',
    slug: 'enchanting-vietnam-hanoi-halong-bay-hoi-an',
    destination: 'Vietnam',
    country: 'Vietnam',
    region: 'International',
    title: 'Enchanting Vietnam: Hanoi Old Quarter, Halong Bay Cruise & Hoi An Lanterns',
    durationDays: 6,
    durationNights: 5,
    travelerType: 'Couple',
    itineraryCountLabel: '72 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 44000,
    rating: 4.95,
    reviewCount: 110,
    coverImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Discover the magic of Southeast Asia: bustling French colonial streets of Hanoi, luxury overnight cruise through UNESCO limestone karsts of Halong Bay, and fairytale glowing lanterns of UNESCO ancient town Hoi An.',
    bestTimeToVisit: 'October to April',
    isPopular: true,
    agent: {
      id: 'ag-114',
      agencyName: 'Indochina Trails & Voyages Ltd',
      founderName: 'Nguyen Van Minh & Ankit Agarwal',
      gstNumber: '07AABCI4412M1Z0',
      isVerified: true,
      yearsInBusiness: 10,
      location: 'Delhi & Hanoi',
      rating: 4.93,
      reviewCount: 290,
      phone: '+91 98110 88219',
      whatsapp: '+91 98110 88219',
      email: 'vietnam@indochinatrails.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 34
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Hanoi, Hoan Kiem Lake & Old Quarter Street Food',
        morning: 'Land at Noi Bai International Airport (HAN); private transfer to boutique French colonial hotel.',
        afternoon: 'Stroll around tranquil Hoan Kiem Lake, Ngoc Son Temple, and take a traditional electric cyclo ride through 36 guild streets.',
        evening: 'Savor famous Vietnamese Egg Coffee (Ca Phe Trung) and authentic steaming Pho noodle soup; Water Puppet Show.',
        highlights: ['Private Airport Pickup', 'Hoan Kiem Lake Walk', 'Egg Coffee & Water Puppet Show']
      },
      {
        dayNumber: 2,
        title: 'Hanoi to Halong Bay: Luxury Overnight Cruise & Sung Sot Cave',
        morning: 'Express limousine drive from Hanoi to Halong Bay marina; board luxury wooden junk ship cruise.',
        afternoon: 'Cruise past thousands of towering limestone emerald islands; explore giant Sung Sot (Surprise) Cave.',
        evening: 'Sunset cocktail party on sun deck; night squid fishing; 5-course seafood gourmet dinner under the stars.',
        highlights: ['Halong Bay Luxury Cruise', 'Sung Sot Limestone Cave', 'Sunset Deck Cocktails & Squid Fishing']
      },
      {
        dayNumber: 3,
        title: 'Halong Bay Kayaking, Flight to Da Nang & Lantern Town Hoi An',
        morning: 'Sunrise Tai Chi on deck; kayak through tranquil Luon Cave surrounded by monkeys.',
        afternoon: 'Disembark cruise; transfer to airport for short 1-hour flight to Da Nang; drive to ancient Hoi An.',
        evening: 'Stroll through glowing lantern-lit UNESCO Old Town; take a wishing candle wooden boat ride on Hoai River.',
        highlights: ['Sunrise Tai Chi & Kayak', 'Hoi An Lantern Town', 'Hoai River Candle Boat']
      },
      {
        dayNumber: 4,
        title: 'Bana Hills Golden Bridge & Coconut Basket Boat Ride',
        morning: 'Take world-record cable car to Ba Na Hills; walk across iconic giant stone hands Golden Bridge in the clouds.',
        afternoon: 'Visit Cam Thanh coconut water village; ride spinning round bamboo basket boats with local fishermen.',
        evening: 'Dinner at riverside restaurant in Hoi An; sample Cao Lau noodles and White Rose dumplings.',
        highlights: ['Ba Na Hills Golden Bridge', 'Spinning Bamboo Basket Boat', 'Hoi An Gourmet Cuisine']
      },
      {
        dayNumber: 5,
        title: 'An Bang Beach, Custom Tailoring & Cooking Class',
        morning: 'Relax at pristine An Bang white sand beach or take a 2-hour custom tailoring suit/dress fitting.',
        afternoon: 'Hands-on Vietnamese cooking class making crispy Banh Xeo pancakes and fresh spring rolls.',
        evening: 'Night market exploration; souvenir silk lanterns and Vietnamese ground coffee beans.',
        highlights: ['An Bang Beachfront', 'Custom Silk Tailoring', 'Authentic Cooking Class']
      },
      {
        dayNumber: 6,
        title: 'Da Nang Marble Mountains & Airport Departure',
        morning: 'Visit dramatic Marble Mountains caves and Dragon Bridge in Da Nang.',
        afternoon: 'Last-minute souvenir shopping for Cashews and Marou dark chocolate.',
        evening: 'Transfer to Da Nang International Airport (DAD) for homeward flight.',
        highlights: ['Marble Mountains Caves', 'Dragon Bridge Landmark', 'Smooth Flight Connection']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Hanoi Pearl Hotel / La Siesta Hoi An', rating: 4.5, estPricePerNight: '₹3,500', perks: ['Old Quarter Location', 'Free Breakfast'] },
      { tier: 'Comfort', name: 'Mon Chéri Halong Cruise / Anantara Hoi An Resort', rating: 4.88, estPricePerNight: '₹14,000', perks: ['Balcony Ocean Cruise', 'Riverfront Pool'] },
      { tier: 'Luxury', name: 'Capella Hanoi / Four Seasons Resort The Nam Hai', rating: 4.98, estPricePerNight: '₹42,000', perks: ['Michelin Dining', 'Private Beach Villa', 'Butler'] }
    ],
    budgetBreakdown: {
      flights: 21000,
      accommodation: 12000,
      foodDining: 5000,
      activitiesSightseeing: 4000,
      localTransport: 2000
    },
    inclusions: [
      'Vietnam eVisa step-by-step fast approval guidance ($25 official fee)',
      'Verified Halong Bay cruise operator direct discount links',
      'Hoi An 24-hour express tailor recommendations'
    ],
    exclusions: ['International and domestic flights', 'Personal tailor garments and shopping']
  },
  {
    id: 'japan-7d',
    slug: 'wonders-of-japan-tokyo-mount-fuji-kyoto',
    destination: 'Japan',
    country: 'Japan',
    region: 'International',
    title: 'Wonders of Japan: Tokyo Shinjuku, Mount Fuji & Kyoto Bamboo Groves',
    durationDays: 7,
    durationNights: 6,
    travelerType: 'Couple',
    itineraryCountLabel: '84 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 110000,
    rating: 4.97,
    reviewCount: 154,
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The ultimate Japanese dream journey: neon-lit Shibuya & Shinjuku in Tokyo, Mount Fuji 5th station with Hakone hot spring Onsen, 320 km/h Shinkansen Bullet Train, and ancient geishas & bamboo groves in Kyoto.',
    bestTimeToVisit: 'March to May (Cherry Blossom Sakura) or Oct - Nov (Autumn Foliage)',
    isPopular: true,
    agent: {
      id: 'ag-115',
      agencyName: 'Nippon Horizons Travel India Ltd',
      founderName: 'Kenji Takahashi & Rajesh Iyer',
      gstNumber: '27AABCN8890P1Z3',
      isVerified: true,
      yearsInBusiness: 14,
      location: 'Mumbai & Tokyo',
      rating: 4.96,
      reviewCount: 410,
      phone: '+91 98200 66190',
      whatsapp: '+91 98200 66190',
      email: 'concierge@nipponhorizons.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 40
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Tokyo, Shibuya Crossing & Shinjuku Neon Night',
        morning: 'Land at Tokyo Haneda or Narita Airport; pick up JR Rail Pass and Pocket Wi-Fi router.',
        afternoon: 'Check-in to hotel in Shinjuku; walk across world-famous Shibuya Scramble Crossing and see Hachiko statue.',
        evening: 'Panoramic night view from Tokyo Metropolitan Government Building; steaming hot ramen in Omoide Yokocho.',
        highlights: ['Shibuya Scramble Crossing', 'Hachiko Statue', 'Tokyo Skyline Night View']
      },
      {
        dayNumber: 2,
        title: 'Senso-ji Asakusa, Akihabara & teamLab Planets Digital Art',
        morning: 'Visit Tokyo’s oldest temple Senso-ji in Asakusa; stroll Nakamise shopping street for matcha snacks.',
        afternoon: 'Explore electronic and anime wonderland Akihabara; immerse in teamLab Planets interactive light museum.',
        evening: 'Sushi dinner in Ginza luxury district; stroll through upscale illuminated boulevards.',
        highlights: ['Senso-ji Temple', 'teamLab Planets Digital Museum', 'Ginza Sushi Experience']
      },
      {
        dayNumber: 3,
        title: 'Mount Fuji 5th Station, Lake Kawaguchiko & Hakone Onsen',
        morning: 'Scenic express drive to Mount Fuji 5th Station (2,305m) for majestic views of Japan’s sacred volcano.',
        afternoon: 'Cruise on Lake Kawaguchiko with mirror reflections of Mt. Fuji; ride Owakudani volcanic ropeway.',
        evening: 'Relax in natural volcanic thermal hot spring (Onsen); traditional multi-course Kaiseki dinner at Ryokan.',
        highlights: ['Mount Fuji 5th Station', 'Lake Kawaguchiko Cruise', 'Traditional Onsen & Kaiseki Dinner']
      },
      {
        dayNumber: 4,
        title: 'Shinkansen Bullet Train to Kyoto & Fushimi Inari 10,000 Gates',
        morning: 'Board ultra-fast Shinkansen Bullet Train (320 km/h) from Tokyo to cultural capital Kyoto (2 hours 15 mins).',
        afternoon: 'Hotel check-in; hike through iconic tunnel of 10,000 vermilion Torii gates at Fushimi Inari Shrine.',
        evening: 'Evening lantern walk through Gion Geisha district; spot Geiko and Maiko in traditional silk kimonos.',
        highlights: ['320 km/h Shinkansen Bullet Train', 'Fushimi Inari Torii Gates', 'Gion Historic Geisha District']
      },
      {
        dayNumber: 5,
        title: 'Arashiyama Bamboo Grove, Kinkaku-ji Golden Pavilion & Tea Ceremony',
        morning: 'Early morning peaceful walk through towering Arashiyama Bamboo Grove and Tenryu-ji Zen temple.',
        afternoon: 'Marvel at Kinkaku-ji (The Golden Pavilion) covered in gold leaf shimmering over mirror pond.',
        evening: 'Participate in authentic Japanese Matcha green tea ceremony with a Zen master.',
        highlights: ['Arashiyama Bamboo Forest', 'Kinkaku-ji Golden Pavilion', 'Authentic Zen Tea Ceremony']
      },
      {
        dayNumber: 6,
        title: 'Day Excursion to Nara Deer Park & Osaka Dotonbori Street Food',
        morning: 'Train to historic Nara; bow to hundreds of freely roaming sacred wild deer in Nara Park; visit giant bronze Todai-ji Buddha.',
        afternoon: 'Short train to vibrant Osaka; explore grand Osaka Castle.',
        evening: 'Feast on Takoyaki octopus balls and Okonomiyaki pancakes under giant neon Glico Man sign in Dotonbori.',
        highlights: ['Nara Friendly Deer Feeding', 'Todai-ji Giant Buddha', 'Dotonbori Neon Street Food']
      },
      {
        dayNumber: 7,
        title: 'Kansai / Haneda Airport Departure',
        morning: 'Last-minute shopping for Japanese confectionery (Tokyo Banana, KitKat Matcha) and tax-free ceramics.',
        afternoon: 'Direct Express train to Kansai (KIX) or Tokyo Haneda (HND) Airport.',
        evening: 'Assisted flight check-in for journey home.',
        highlights: ['Tax-free Confectionery Shopping', 'Seamless Express Train', 'Departure']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Sotetsu Fresa Inn Tokyo / Hotel Keihan Kyoto', rating: 4.5, estPricePerNight: '₹6,500', perks: ['Metro Connected', 'Clean & Compact', 'Free Wi-Fi'] },
      { tier: 'Comfort', name: 'Hotel Gracery Shinjuku / Cross Hotel Kyoto', rating: 4.8, estPricePerNight: '₹16,000', perks: ['Godzilla Terrace View', 'Spacious Rooms', 'Buffet'] },
      { tier: 'Luxury', name: 'Hoshinoya Kyoto / Aman Tokyo', rating: 5.0, estPricePerNight: '₹75,000', perks: ['Private Boat Arrival', 'World Top Luxury', 'Personal Concierge'] }
    ],
    budgetBreakdown: {
      flights: 45000,
      accommodation: 35000,
      foodDining: 14000,
      activitiesSightseeing: 8000,
      localTransport: 8000
    },
    inclusions: [
      'Japan Rail (JR) Pass vs Regional IC Card (Suica/Pasmo) optimization blueprint',
      'Japan Tourist eVisa application checklist & financial documentation templates',
      'Pocket Wi-Fi airport pickup instructions'
    ],
    exclusions: ['Japan eVisa consular fee', 'Personal shopping and Michelin dining reservations']
  },
  {
    id: 'andaman-5d',
    slug: 'andaman-island-paradise-port-blair-havelock',
    destination: 'Andaman',
    country: 'India',
    region: 'Domestic',
    title: 'Andaman Island Paradise: Port Blair Cellular Jail, Havelock Radhanagar & Scuba',
    durationDays: 5,
    durationNights: 4,
    travelerType: 'Couple',
    itineraryCountLabel: '58 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 28000,
    rating: 4.92,
    reviewCount: 98,
    coverImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Discover India’s premier tropical archipelago: historic Cellular Jail light & sound show, high-speed Makruzz catamaran to Havelock Island, sunset at Asia’s best Radhanagar Beach, and PADI certified scuba diving with sea turtles.',
    bestTimeToVisit: 'October to May',
    isPopular: true,
    agent: {
      id: 'ag-116',
      agencyName: 'Coral Reef Andaman Holidays LLP',
      founderName: 'Kishore Sengupta',
      gstNumber: '35AABCC8920R1Z2',
      isVerified: true,
      yearsInBusiness: 11,
      location: 'Port Blair & Havelock',
      rating: 4.9,
      reviewCount: 280,
      phone: '+91 94342 88190',
      whatsapp: '+91 94342 88190',
      email: 'bookings@andamanholidays.in',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 26
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Port Blair, Cellular Jail & Light & Sound Show',
        morning: 'Arrival at Veer Savarkar International Airport Port Blair; transfer to sea-facing hotel.',
        afternoon: 'Tour the historic Cellular Jail (Kala Pani) and learn about India’s freedom struggle.',
        evening: 'Spectacular emotional Light & Sound Show at Cellular Jail; fresh seafood dinner in Port Blair.',
        highlights: ['Private Airport Pickup', 'Historic Cellular Jail', 'Light & Sound Show']
      },
      {
        dayNumber: 2,
        title: 'Makruzz Catamaran to Havelock Island & Radhanagar Beach Sunset',
        morning: 'Board luxury high-speed Makruzz private catamaran across open azure waters to Havelock Island (Swaraj Dweep).',
        afternoon: 'Check-in to beachfront cottage; head to Radhanagar Beach (Beach No. 7), rated one of Asia’s finest beaches.',
        evening: 'Watch breathtaking golden sunset over turquoise waves; fresh coconut water and beach stroll.',
        highlights: ['High-speed Makruzz Catamaran', 'Radhanagar White Sand Beach', 'Magical Island Sunset']
      },
      {
        dayNumber: 3,
        title: 'Elephant Beach Speedboat, Coral Snorkeling & Scuba Diving',
        morning: 'Speedboat to Elephant Beach; explore shallow living coral reefs with vibrant clownfish and parrotfish.',
        afternoon: 'PADI-certified beginner introductory scuba diving session with professional underwater HD photos and videos.',
        evening: 'Candlelight seafood dinner at beach shack with live acoustic guitar.',
        highlights: ['Elephant Beach Speedboat', 'Living Coral Snorkeling', 'PADI Guided Scuba Diving']
      },
      {
        dayNumber: 4,
        title: 'Kalapathar Beach, Return to Port Blair & Chidiya Tapu Sunset',
        morning: 'Visit scenic Kalapathar Beach with black volcanic rocks contrasting against bright turquoise water.',
        afternoon: 'Catamaran cruise back to Port Blair; check into luxury hotel.',
        evening: 'Drive to Chidiya Tapu (Bird Island) for the most magnificent panoramic sunset in the Andamans.',
        highlights: ['Kalapathar Volcanic Beach', 'Return Catamaran Cruise', 'Chidiya Tapu Sunset Point']
      },
      {
        dayNumber: 5,
        title: 'Corbyn’s Cove Beach, Pearl Souvenirs & Departure',
        morning: 'Visit Corbyn’s Cove coconut-lined beach; water sports or sea breeze relaxation.',
        afternoon: 'Pick up genuine shell handicrafts, pearl jewelry, and Andaman spices at Sagarika Government Emporium.',
        evening: 'Assisted airport transfer for flight back home.',
        highlights: ['Corbyn’s Cove Beach', 'Sagarika Pearl Emporium', 'Smooth Airport Drop']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Symphony Palms Havelock / Peerless Port Blair', rating: 4.4, estPricePerNight: '₹3,500', perks: ['Direct Beach Access', 'Free Wi-Fi'] },
      { tier: 'Comfort', name: 'Barefoot at Havelock / SeaShell Port Blair', rating: 4.85, estPricePerNight: '₹10,500', perks: ['Eco Jungle Cottages', 'Private Beach Access', 'Buffet'] },
      { tier: 'Luxury', name: 'Taj Exotica Resort & Spa Andamans', rating: 4.98, estPricePerNight: '₹38,000', perks: ['Radhanagar Private Villa', 'Olympic Infinity Pool', 'Butler'] }
    ],
    budgetBreakdown: {
      flights: 11000,
      accommodation: 9000,
      foodDining: 3500,
      activitiesSightseeing: 3000,
      localTransport: 1500
    },
    inclusions: [
      'Makruzz private catamaran seat class comparison and booking strategy',
      'Scuba dive operator PADI certification verification guide',
      'Island permit and luggage transfer logistics'
    ],
    exclusions: ['Airfare and accommodation fees', 'Personal scuba video packages']
  },
  {
    id: 'srilanka-6d',
    slug: 'sri-lanka-wonder-sigiriya-kandy-bentota',
    destination: 'Sri Lanka',
    country: 'Sri Lanka',
    region: 'International',
    title: 'Sri Lanka Wonder: Sigiriya Rock Fortress, Kandy Tea Country & Bentota Beach',
    durationDays: 6,
    durationNights: 5,
    travelerType: 'Family',
    itineraryCountLabel: '62 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 32000,
    rating: 4.91,
    reviewCount: 116,
    coverImage: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The complete pearl of the Indian Ocean itinerary: climb ancient 5th-century Sigiriya Lion Rock Fortress, visit sacred Temple of the Sacred Tooth Relic in Kandy, scenic Nuwara Eliya tea train, and relax on golden beaches of Bentota.',
    bestTimeToVisit: 'November to April',
    isPopular: true,
    agent: {
      id: 'ag-117',
      agencyName: 'Ceylon Serendib Expeditions Pvt Ltd',
      founderName: 'Chaminda Silva',
      gstNumber: '29AAACC5519P1Z8',
      isVerified: true,
      yearsInBusiness: 12,
      location: 'Bangalore & Colombo',
      rating: 4.9,
      reviewCount: 310,
      phone: '+91 99801 33490',
      whatsapp: '+91 99801 33490',
      email: 'info@ceylonserendib.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 30
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Colombo, Pinnawala Elephant Orphanage & Sigiriya',
        morning: 'Arrive at Bandaranaike International Airport (CMB); meet private chauffeur guide.',
        afternoon: 'Visit Pinnawala Elephant Orphanage; watch giant elephant herds bathing in the river; drive to Sigiriya.',
        evening: 'Check into jungle eco-resort; authentic Sri Lankan rice and curry dinner with coconut sambal.',
        highlights: ['Private Chauffeur Transfer', 'Pinnawala Elephant Bathing', 'Sigiriya Eco Resort']
      },
      {
        dayNumber: 2,
        title: 'Sigiriya Lion Rock Fortress & Dambulla Golden Cave Temple',
        morning: 'Climb UNESCO World Heritage Sigiriya Rock Fortress; view ancient frescoes and mirror wall.',
        afternoon: 'Visit Dambulla Golden Cave Temple housing 153 magnificent Buddha statues inside five caves.',
        evening: 'Village bullock cart ride and catamaran lake boat ride with local tea and jaggery.',
        highlights: ['Sigiriya Lion Rock Fortress', 'Dambulla Golden Cave Temple', 'Traditional Village Experience']
      },
      {
        dayNumber: 3,
        title: 'Dambulla to Kandy: Spice Garden & Temple of the Tooth Relic',
        morning: 'Drive through Matale spice garden; learn about natural cinnamon, cardamom, and cocoa.',
        afternoon: 'Arrive in hill capital Kandy; visit sacred Temple of the Tooth Relic (Sri Dalada Maligawa).',
        evening: 'Stroll around tranquil Kandy Lake; watch vibrant traditional Kandyan fire dance performance.',
        highlights: ['Matale Spice Garden', 'Temple of Sacred Tooth Relic', 'Kandyan Fire Dance Show']
      },
      {
        dayNumber: 4,
        title: 'Scenic Blue Train to Nuwara Eliya (Little England)',
        morning: 'Board world-famous blue train winding through mist-covered emerald Ceylon tea estates and waterfalls.',
        afternoon: 'Tour historic Ceylon tea factory; sample pure single-origin Ceylon black tea; stroll Gregory Lake.',
        evening: 'Cozy colonial dinner in Nuwara Eliya with fresh strawberries and Devon cream.',
        highlights: ['Scenic Ceylon Blue Train', 'Tea Factory & Tasting', 'Gregory Lake Nuwara Eliya']
      },
      {
        dayNumber: 5,
        title: 'Nuwara Eliya to Bentota Golden Beach & Madu River Boat Safari',
        morning: 'Scenic descent through St. Clair and Devon waterfalls to golden coast of Bentota.',
        afternoon: 'Madu River mangrove boat safari visiting cinnamon island and fish massage.',
        evening: 'Visit Kosgoda Turtle Conservation Hatchery; release baby sea turtles into the ocean at sunset.',
        highlights: ['Madu River Mangrove Safari', 'Kosgoda Sea Turtle Hatchery', 'Bentota Beachfront Resort']
      },
      {
        dayNumber: 6,
        title: 'Colombo City Tour & Airport Departure',
        morning: 'Drive to Colombo; explore Galle Face Green promenade, Independence Square, and Gangaramaya Temple.',
        afternoon: 'Pick up famous Ceylon spices, pure Ceylon tea (Dilmah/Mlesna), and gems at Odel mall.',
        evening: 'Assisted airport transfer to Colombo Airport for return flight.',
        highlights: ['Colombo Gangaramaya Temple', 'Ceylon Tea Shopping', 'Smooth Flight Connection']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Hotel Sigiriya / Cinnamon Citadel Kandy', rating: 4.4, estPricePerNight: '₹3,200', perks: ['Sigiriya Rock View', 'Pool'] },
      { tier: 'Comfort', name: 'Heritance Tea Factory / Taj Bentota Resort', rating: 4.85, estPricePerNight: '₹9,500', perks: ['Tea Estate Luxury', 'Beachfront Club', 'Buffet'] },
      { tier: 'Luxury', name: 'Amangalla Galle / Ceylon Tea Trails', rating: 5.0, estPricePerNight: '₹44,000', perks: ['Colonial Relais & Châteaux', 'Private Butler', 'Helipad'] }
    ],
    budgetBreakdown: {
      flights: 14000,
      accommodation: 8000,
      foodDining: 4000,
      activitiesSightseeing: 4000,
      localTransport: 2000
    },
    inclusions: [
      'Sri Lanka ETA electronic visa fast approval procedure',
      'Scenic Kandy to Nuwara Eliya blue train observation car reserved ticketing guide',
      'Licensed English-speaking chauffeur guide contacts'
    ],
    exclusions: ['Sri Lanka ETA visa fee ($50)', 'Personal dining and spa expenses']
  },
  {
    id: 'australia-6d',
    slug: 'sydney-great-barrier-reef-cairns-6d',
    destination: 'Australia',
    country: 'Australia',
    region: 'International',
    title: 'Iconic Sydney & Great Barrier Reef: Opera House, Bondi Beach & Cairns Catamaran Snorkel',
    durationDays: 6,
    durationNights: 5,
    travelerType: 'Family',
    itineraryCountLabel: '42 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 108000,
    rating: 4.96,
    reviewCount: 218,
    coverImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The ultimate Australian bucket-list journey: witness sunset over Sydney Opera House, walk Bondi cliff paths, ride through Blue Mountains rainforests, and dive into the Great Barrier Reef.',
    bestTimeToVisit: 'September to November & March to May',
    isPopular: true,
    agent: {
      id: 'ag-118',
      agencyName: 'Aussie Horizons Travel Pvt Ltd',
      founderName: 'Marcus Hemsworth',
      gstNumber: '27AAACH9102K1ZP',
      phone: '+91 98204 77192',
      email: 'bookings@aussiehorizons.com',
      whatsapp: '+91 98204 77192',
      location: 'Mumbai & Sydney',
      rating: 4.96,
      reviewCount: 380,
      yearsInBusiness: 11,
      itinerariesPublished: 24,
      isVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Sydney, Circular Quay & Opera House Sunset',
        morning: 'Arrive at Sydney Kingsford Smith Airport (SYD); scenic transfer to Darling Harbour hotel.',
        afternoon: 'Stroll around Circular Quay, The Rocks historical cobblestone laneways, and Opera House forecourt.',
        evening: 'Sunset catamaran dinner cruise across Sydney Harbour passing beneath Harbour Bridge.',
        highlights: ['Circular Quay Walk', 'The Rocks Historic Precinct', 'Harbour Sunset Cruise']
      },
      {
        dayNumber: 2,
        title: 'Bondi Beach Coastal Walk & Taronga Zoo Ferry',
        morning: 'Scenic Bondi to Coogee cliffside coastal ocean walk with swim in Bondi Icebergs.',
        afternoon: 'Yellow Water Taxi to Taronga Zoo with panoramic skyline vistas and native koala encounters.',
        evening: 'Craft dining and craft beer tasting at Barangaroo waterfront promenade.',
        highlights: ['Bondi to Coogee Walk', 'Taronga Zoo Koalas', 'Barangaroo Dining']
      },
      {
        dayNumber: 3,
        title: 'Blue Mountains Day Trip: Three Sisters & Scenic World',
        morning: 'Scenic rail to Katoomba; visit Echo Point overlooking the legendary Three Sisters rock formation.',
        afternoon: 'Ride Scenic Railway (world steepest passenger train) and cableway down into ancient Jurassic rainforest.',
        evening: 'Stargazing dinner at Leura mountain village before returning to Sydney.',
        highlights: ['Three Sisters Echo Point', 'Scenic Railway Steep Descent', 'Jamison Valley Rainforest']
      },
      {
        dayNumber: 4,
        title: 'Flight to Cairns: Gateway to Great Barrier Reef',
        morning: 'Morning domestic flight from Sydney to tropical Cairns (Queensland).',
        afternoon: 'Check in to beachfront resort; visit Cairns Esplanade Lagoon and Night Markets.',
        evening: 'Fresh Queensland tiger prawn and barramundi seafood dinner along Cairns boardwalk.',
        highlights: ['Cairns Lagoon Swim', 'Tropical Boardwalk', 'Fresh Barramundi Feast']
      },
      {
        dayNumber: 5,
        title: 'Outer Great Barrier Reef Catamaran & Coral Snorkeling',
        morning: 'Board luxury high-speed catamaran to Moore Reef Outer Pontoon.',
        afternoon: 'Guided marine biologist snorkeling among sea turtles, clownfish, and semi-submersible coral viewing.',
        evening: 'Tropical buffet lunch on reef pontoon; evening return to Cairns.',
        highlights: ['Moore Reef Outer Barrier', 'Marine Biologist Snorkel', 'Semi-Sub Coral Explorer']
      },
      {
        dayNumber: 6,
        title: 'Kuranda Rainforest Skyrail & Departure',
        morning: 'Glide above rainforest canopy on Skyrail Rainforest Cableway to Kuranda artisan village.',
        afternoon: 'Scenic Kuranda Railway ride passing Barron Falls gorges back to Cairns Airport (CNS).',
        evening: 'Flight departure with lifelong Australian memories.',
        highlights: ['Skyrail Rainforest Canopy', 'Barron Falls Gorges', 'Kuranda Village']
      }
    ],
    hotels: [
      { name: 'Ibis Styles Sydney Central', tier: 'Budget', estPricePerNight: '₹6,500', perks: ['Central Location', 'Free WiFi'], rating: 4.2 },
      { name: 'Hyatt Regency Sydney / Cairns Pacific Hotel', tier: 'Comfort', estPricePerNight: '₹14,500', perks: ['Harbour Views', 'Buffet Breakfast', 'Pool'], rating: 4.85 },
      { name: 'Four Seasons Hotel Sydney / Crystalbrook Riley', tier: 'Luxury', estPricePerNight: '₹32,000', perks: ['Opera House Panorama', 'Luxury Butler', 'Infinity Pool'], rating: 4.95 }
    ],
    budgetBreakdown: {
      flights: 42000,
      accommodation: 28000,
      foodDining: 14000,
      localTransport: 8000,
      activitiesSightseeing: 16000
    },
    inclusions: [
      'Catamaran Moore Reef outer pontoon day cruise voucher',
      'Sydney Harbour ferry pass and Opal card pre-setup guide',
      'Verified local Australian tour operator direct contacts'
    ],
    exclusions: [
      'International and domestic airfares',
      'Personal scuba certification fees'
    ]
  }
];

export const ADDITIONAL_ITINERARIES: Itinerary[] = [
  // DUBAI PACKAGES
  {
    id: 'dubai-3d',
    slug: 'dubai-express-weekend-escape',
    destination: 'Dubai',
    country: 'United Arab Emirates',
    region: 'International',
    title: 'Dubai Express: Marina Yacht, Burj Khalifa & Souks Weekend',
    durationDays: 3,
    durationNights: 2,
    travelerType: 'Solo',
    itineraryCountLabel: '128 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 28000,
    rating: 4.8,
    reviewCount: 76,
    coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Ideal 72-hour high-impact Dubai itinerary curated for fast-paced explorers and weekend holiday makers.',
    bestTimeToVisit: 'November to April',
    agent: {
      id: 'ag-105',
      agencyName: 'Gulf Express Travel Solutions',
      founderName: 'Sameer Qureshi',
      gstNumber: '27AACCG1182K1Z9',
      isVerified: true,
      yearsInBusiness: 7,
      location: 'Mumbai & Dubai Deira',
      rating: 4.8,
      reviewCount: 189,
      phone: '+91 98110 55219',
      whatsapp: '+91 98110 55219',
      email: 'sameer@gulfexpresstravel.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 19
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Dubai Marina Luxury Sunset Yacht Cruise',
        morning: 'Morning arrival at DXB Airport, metro ride to hotel, check-in & relax.',
        afternoon: 'Explore JBR Walk, swim at Marina Beach, and visit Ain Dubai plaza.',
        evening: 'Shared luxury yacht cruise through Dubai Marina and Palm Jumeirah lagoon with dinner.',
        highlights: ['Dubai Marina Yacht Cruise', 'Ain Dubai Photo Stop', 'JBR Dining']
      },
      {
        dayNumber: 2,
        title: 'Burj Khalifa Sky Views & Desert Dune Safari with BBQ',
        morning: 'Pre-booked 124th floor Burj Khalifa observation deck and Dubai Mall Fountain walk.',
        afternoon: '4x4 Desert Safari pick-up, sandboarding and exhilarating dune bashing.',
        evening: 'Bedouin campsite dinner, belly dance and Tanoura fire performance under the stars.',
        highlights: ['Burj Khalifa Level 124', '4x4 Dune Bashing', 'Bedouin BBQ Dinner']
      },
      {
        dayNumber: 3,
        title: 'Old Dubai Gold Souk, Traditional Abra & Airport Departure',
        morning: 'Traditional wooden Abra boat across Dubai Creek, exploring Spice and Gold Souks.',
        afternoon: 'Last-minute souvenirs at Deira, lunch at authentic Arabic restaurant.',
        evening: 'Metro transfer directly to Terminal 3 for return flight.',
        highlights: ['Abra Boat Creek Crossing', 'Gold Souk Bargaining', 'Seamless Departure']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Rove City Centre', rating: 4.5, estPricePerNight: '₹4,000', perks: ['Metro Connected', 'Free Wi-Fi'] },
      { tier: 'Comfort', name: 'Millennium Place Marina', rating: 4.7, estPricePerNight: '₹9,000', perks: ['Marina View', 'Pool'] },
      { tier: 'Luxury', name: 'Address Downtown', rating: 4.9, estPricePerNight: '₹34,000', perks: ['Burj View', 'VIP Lounge'] }
    ],
    budgetBreakdown: {
      flights: 18000,
      accommodation: 8000,
      foodDining: 5000,
      activitiesSightseeing: 6000,
      localTransport: 2000
    },
    inclusions: [
      'Concise 3-day route optimized with Dubai Metro stops',
      'Yacht and safari direct agent booking promo codes',
      'Visa and currency exchange recommendations'
    ],
    exclusions: ['Flights and hotel bookings', 'Personal dining and shopping']
  },
  {
    id: 'dubai-7d',
    slug: 'grand-emirates-dubai-abu-dhabi-glamping',
    destination: 'Dubai',
    country: 'United Arab Emirates',
    region: 'International',
    title: 'Grand Emirates: Dubai Luxury, Abu Dhabi Mosque & Desert Glamping',
    durationDays: 7,
    durationNights: 6,
    travelerType: 'Family',
    itineraryCountLabel: '128 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 74000,
    rating: 4.96,
    reviewCount: 142,
    coverImage: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The complete 7-day master itinerary combining Dubai’s futuristic marvels with Abu Dhabi’s Grand Mosque and Louvre Museum.',
    bestTimeToVisit: 'October to May',
    agent: {
      id: 'ag-106',
      agencyName: 'Royal Mirage Tours & Travels Pvt Ltd',
      founderName: 'Pooja Mehra',
      gstNumber: '27AABCR9912M1Z0',
      isVerified: true,
      yearsInBusiness: 14,
      location: 'Delhi & Dubai Business Bay',
      rating: 4.95,
      reviewCount: 420,
      phone: '+91 98101 22910',
      whatsapp: '+91 98101 22910',
      email: 'pooja@royalmiragetravels.com',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 54
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Private Marina Dhow Dinner',
        morning: 'VIP airport transfer to luxury accommodation in Downtown Dubai.',
        afternoon: 'Relax by infinity pool and take in panoramic skyline views.',
        evening: 'Private upper-deck Dhow dinner cruise at Dubai Marina.',
        highlights: ['VIP Airport Pickup', 'Marina Skyline Dhow Cruise']
      },
      {
        dayNumber: 2,
        title: 'Burj Khalifa Level 148 Sky & Museum of the Future',
        morning: 'Morning entry to Museum of the Future with guided robotics exhibit.',
        afternoon: 'High-tea at Atmosphere Burj Khalifa Level 148 VIP lounge.',
        evening: 'Dubai Mall dancing fountain show and luxury souk shopping.',
        highlights: ['Museum of the Future', 'Burj Khalifa Level 148', 'Dubai Fountain VIP']
      },
      {
        dayNumber: 3,
        title: 'Full Day Abu Dhabi: Sheikh Zayed Mosque & Louvre',
        morning: 'Private AC transfer to Abu Dhabi; tour the iconic Sheikh Zayed Grand Mosque.',
        afternoon: 'Explore Louvre Abu Dhabi dome gallery and Yas Marina Circuit.',
        evening: 'Return to Dubai along scenic coastal highway; seaside seafood dinner.',
        highlights: ['Sheikh Zayed Grand Mosque', 'Louvre Abu Dhabi', 'Yas Island']
      },
      {
        dayNumber: 4,
        title: 'Overnight Luxury Desert Glamping & Stargazing',
        morning: 'Leisure morning at Dubai Miracle Garden.',
        afternoon: 'Luxury 4x4 transfer to private desert conservation reserve; camel trekking.',
        evening: 'Private starlit Bedouin dinner and overnight stay in luxury air-conditioned dome tent.',
        highlights: ['Miracle Garden', 'Desert Conservation Reserve', 'Overnight Glamping']
      },
      {
        dayNumber: 5,
        title: 'Desert Sunrise, Hot Air Balloon & Palm Jumeirah',
        morning: 'Sunrise hot air balloon ride over golden Arabian dunes with falconry show.',
        afternoon: 'Return to city; check into Palm Jumeirah beach resort.',
        evening: 'Sunset drinks at The View at The Palm 52nd floor.',
        highlights: ['Hot Air Balloon Sunrise', 'Falconry Display', 'Palm Jumeirah Check-in']
      },
      {
        dayNumber: 6,
        title: 'Aquaventure Waterpark & Atlantis Underwater Dining',
        morning: 'Full-day unlimited VIP access to Aquaventure Waterpark.',
        afternoon: 'Swim with dolphins at Dolphin Bay Atlantis.',
        evening: 'Fine dining at Ossiano underwater Michelin-starred restaurant.',
        highlights: ['Aquaventure Waterpark', 'Underwater Dining Experience']
      },
      {
        dayNumber: 7,
        title: 'Old Dubai Heritage Souks & Airport Departure',
        morning: 'Al Fahidi historic quarter walk and perfume souk custom blending.',
        afternoon: 'Last-minute gold and spices purchases.',
        evening: 'Chauffeured airport transfer for flight home.',
        highlights: ['Custom Perfume Blending', 'Spice Souk', 'VIP Chauffeur Transfer']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Rove Downtown', rating: 4.6, estPricePerNight: '₹5,500', perks: ['Downtown location', 'Pool'] },
      { tier: 'Comfort', name: 'Sofitel Dubai Downtown', rating: 4.8, estPricePerNight: '₹14,000', perks: ['Club Lounge', 'Spa'] },
      { tier: 'Luxury', name: 'Atlantis The Royal', rating: 4.98, estPricePerNight: '₹55,000', perks: ['Private Beach', 'Celebrity Chefs'] }
    ],
    budgetBreakdown: {
      flights: 24000,
      accommodation: 26000,
      foodDining: 12000,
      activitiesSightseeing: 16000,
      localTransport: 6000
    },
    inclusions: [
      'Complete 7-day dual-emirate schedule (Dubai + Abu Dhabi)',
      'VIP passes reservation links & hot air balloon operator contacts',
      'Dedicated WhatsApp emergency support with Pooja Mehra'
    ],
    exclusions: ['Flights and hotel tariffs', 'Personal shopping expenses']
  },

  // MALDIVES PACKAGES
  {
    id: 'maldives-budget-5d',
    slug: 'maldives-budget-island-hopping-snorkeling',
    destination: 'Maldives',
    country: 'Maldives',
    region: 'International',
    title: 'Maldives Island Hopping & Whale Shark Snorkeling: Maafushi & Gulhi',
    durationDays: 5,
    durationNights: 4,
    travelerType: 'Group',
    itineraryCountLabel: '85 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 38000,
    rating: 4.91,
    reviewCount: 72,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
    overview: 'Experience the pristine turquoise waters of the Maldives at a fraction of resort costs: local island hopping, whale shark & manta ray excursions, sandbank picnics, and night fishing.',
    bestTimeToVisit: 'December to April',
    agent: {
      id: 'ag-102',
      agencyName: 'Blue Atoll Travel Experts LLP',
      founderName: 'Ayesha Merchant',
      gstNumber: '29AAFCB7812L1Z3',
      isVerified: true,
      yearsInBusiness: 8,
      location: 'Bangalore & Male',
      rating: 4.9,
      reviewCount: 218,
      phone: '+91 99802 88412',
      whatsapp: '+91 99802 88412',
      email: 'hello@blueatollmaldives.com',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 29
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Malé & Speedboat to Maafushi Island',
        morning: 'Land in Malé; local speedboat to vibrant Maafushi island (30 mins).',
        afternoon: 'Check-in to beachfront boutique hotel; swim at Maafushi Bikini Beach.',
        evening: 'Fresh grilled tuna steak dinner on the beach with coconut water.',
        highlights: ['Speedboat Transfer', 'Maafushi Bikini Beach', 'Beachfront Seafood Grill']
      },
      {
        dayNumber: 2,
        title: 'Whale Shark & Giant Manta Ray Snorkeling Safari',
        morning: 'Excursion boat to South Ari Atoll; swim alongside majestic gentle giant Whale Sharks.',
        afternoon: 'Snorkel at Manta Point with graceful manta rays.',
        evening: 'Return to Maafushi; live acoustic music at harbor cafe.',
        highlights: ['Whale Shark Swimming', 'Manta Ray Coral Reef', 'Harbor Cafe Night']
      },
      {
        dayNumber: 3,
        title: 'Private Sandbank Picnic & Nurse Shark Lagoon',
        morning: 'Boat trip to a deserted powdery white sandbank surrounded by 360-degree turquoise waters.',
        afternoon: 'Swim with gentle harmless Nurse Sharks and stingrays in shallow waters.',
        evening: 'Night fishing cruise; get your fresh catch cooked for dinner.',
        highlights: ['Deserted Sandbank Oasis', 'Nurse Shark Swim', 'Sunset Night Fishing']
      },
      {
        dayNumber: 4,
        title: 'Island Hopping to Gulhi Island & Watersports',
        morning: 'Speedboat to quiet local Gulhi Island; relax on pristine crystal lagoon.',
        afternoon: 'Jet ski, banana boat ride, and stand-up paddleboarding.',
        evening: 'Sunset beach bonfire BBQ dinner.',
        highlights: ['Gulhi Island Lagoon', 'Watersports Thrills', 'Sunset Beach Bonfire']
      },
      {
        dayNumber: 5,
        title: 'Malé City Tour & Airport Drop',
        morning: 'Speedboat back to Malé; visit National Museum and Fish Market.',
        afternoon: 'Duty-free souvenir shopping at Malé airport terminal.',
        evening: 'Board return flight.',
        highlights: ['Malé Cultural Walk', 'Smooth Airport Connection']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Kaani Grand Seaview Maafushi', rating: 4.5, estPricePerNight: '₹5,500', perks: ['Ocean Balcony', 'Free Breakfast'] },
      { tier: 'Comfort', name: 'Arena Beach Hotel Maafushi', rating: 4.8, estPricePerNight: '₹8,500', perks: ['Rooftop Pool', 'Bikini Beach Direct'] },
      { tier: 'Luxury', name: 'Sun Siyam Olhuveli (Day Pass Upgrade)', rating: 4.9, estPricePerNight: '₹22,000', perks: ['Water Villa Day Lounge', 'All-Inclusive Dine'] }
    ],
    budgetBreakdown: {
      flights: 22000,
      accommodation: 10000,
      foodDining: 4000,
      activitiesSightseeing: 2000,
      localTransport: 1000
    },
    inclusions: [
      'Local island speed boat timetable and direct booking links',
      'Whale shark licensed operator pre-reservation discount code',
      'Maafushi bikini beach rules and dress code guide'
    ],
    exclusions: ['Airfare and accommodation fees', 'Personal watersports rentals']
  },

  // SINGAPORE PACKAGES
  {
    id: 'singapore-3d',
    slug: 'singapore-city-highlights-gardens-sentosa',
    destination: 'Singapore',
    country: 'Singapore',
    region: 'International',
    title: 'Gardens by the Bay: Cloud Forest, Flower Dome & Supertree Skyway',
    durationDays: 3,
    durationNights: 2,
    travelerType: 'Couple',
    itineraryCountLabel: '76 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 31000,
    rating: 4.92,
    reviewCount: 95,
    coverImage: 'https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=800&q=80'],
    overview: 'Explore the architectural wonder of Gardens by the Bay: the mist-shrouded Cloud Mountain waterfall, 3,000 plant species in Flower Dome, and the nighttime Supertree light symphony.',
    bestTimeToVisit: 'Year-round',
    agent: {
      id: 'ag-103',
      agencyName: 'Lion City Journeys India Ltd',
      founderName: 'Rohan Deshmukh',
      gstNumber: '33AABCL4421P1Z9',
      isVerified: true,
      yearsInBusiness: 9,
      location: 'Chennai & Singapore',
      rating: 4.8,
      reviewCount: 165,
      phone: '+91 94441 55670',
      whatsapp: '+91 94441 55670',
      email: 'tours@lioncityjourneys.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 26
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival, Jewel Changi Rain Vortex & Gardens by the Bay',
        morning: 'Land at Changi Airport; witness the 40-meter indoor Rain Vortex waterfall at Jewel.',
        afternoon: 'Check-in to hotel; explore Flower Dome & Cloud Forest mist-shrouded indoor mountain.',
        evening: 'Witness Garden Rhapsody light and sound show beneath illuminated Supertrees; Satay by the Bay feast.',
        highlights: ['Jewel Changi Rain Vortex', 'Cloud Forest Waterfall', 'Supertree Light Show']
      },
      {
        dayNumber: 2,
        title: 'Supertree OCBC Skyway, Marina Bay Sands & River Cruise',
        morning: 'Walk 22 meters above ground on the OCBC Skyway suspended between Supertrees.',
        afternoon: 'Ascend Marina Bay Sands 57th Floor SkyPark observation deck for 360-degree skyline views.',
        evening: 'Electric traditional bumboat cruise along Singapore River through Clarke Quay and Boat Quay.',
        highlights: ['OCBC Skyway Aerial Walk', 'MBS SkyPark Observatory', 'Singapore River Bumboat Cruise']
      },
      {
        dayNumber: 3,
        title: 'Merlion Park, Chinatown Food Street & Departure',
        morning: 'Morning photo op with the iconic Merlion spouting water into Marina Bay.',
        afternoon: 'Explore colorful shophouses of Chinatown; lunch at Michelin-starred hawker stall Liao Fan Hawker Chan.',
        evening: 'MRT ride directly to Changi Terminal for departure flight.',
        highlights: ['Merlion Park Landmark', 'Chinatown Hawker Feast', 'Direct MRT to Terminal']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'ibis budget Singapore Clarke Quay', rating: 4.3, estPricePerNight: '₹6,000', perks: ['Central MRT', 'Rooftop Pool'] },
      { tier: 'Comfort', name: 'PARKROYAL on Beach Road', rating: 4.7, estPricePerNight: '₹14,000', perks: ['Marina Bay Proximity', 'Modern Spa'] },
      { tier: 'Luxury', name: 'Marina Bay Sands', rating: 4.96, estPricePerNight: '₹48,000', perks: ['Iconic 57th Floor Infinity Pool', 'VIP SkyPark'] }
    ],
    budgetBreakdown: {
      flights: 18000,
      accommodation: 8000,
      foodDining: 2500,
      activitiesSightseeing: 2000,
      localTransport: 500
    },
    inclusions: [
      'Efficient MRT routing map with tap-and-pay credit card guide',
      'Direct ticket links with 15% discount on Supertrees and SkyPark',
      'Michelin Bib Gourmand street food curation'
    ],
    exclusions: ['Airfare and accommodation fees', 'Personal dining and shopping']
  },
  {
    id: 'singapore-pass',
    slug: 'mmt-experience-pass-singapore-3-activity-pass',
    destination: 'Singapore',
    country: 'Singapore',
    region: 'International',
    title: 'MMT Experience Pass Singapore-3 Activity Pass',
    durationDays: 5,
    durationNights: 4,
    travelerType: 'Couple',
    itineraryCountLabel: '76 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 45000,
    rating: 4.9,
    reviewCount: 108,
    coverImage: 'https://images.unsplash.com/photo-1513415564515-763d91423bdd?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1513415564515-763d91423bdd?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The smartest 3-in-1 combo pass blueprint: Mount Faber Cable Car sky pass, Sentosa SkyHelix panoramic ride, and Madame Tussauds 4D Marvel experience with free cancellation guidance.',
    bestTimeToVisit: 'Year-round',
    agent: {
      id: 'ag-103',
      agencyName: 'Lion City Journeys India Ltd',
      founderName: 'Rohan Deshmukh',
      gstNumber: '33AABCL4421P1Z9',
      isVerified: true,
      yearsInBusiness: 9,
      location: 'Chennai & Singapore',
      rating: 4.8,
      reviewCount: 165,
      phone: '+91 94441 55670',
      whatsapp: '+91 94441 55670',
      email: 'tours@lioncityjourneys.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 26
    },
    days: [
      {
        dayNumber: 1,
        title: 'Changi Arrival, Mount Faber Cable Car & Sentosa Hotel Check-in',
        morning: 'Private AC transfer from Changi to Mount Faber Peak; board the panoramic Singapore Cable Car.',
        afternoon: 'Check-in to Sentosa beachfront resort; poolside cocktail and beach walk.',
        evening: 'Dine at Quayside Isle waterfront marina with views of luxury yachts.',
        highlights: ['Mount Faber Cable Car', 'Sentosa Resort Check-in', 'Quayside Isle Waterfront']
      },
      {
        dayNumber: 2,
        title: 'SkyHelix Sentosa, Madame Tussauds & Skyline Luge Rides',
        morning: 'Ride SkyHelix Sentosa, Singapore’s highest open-air panoramic ride 79 meters above sea level.',
        afternoon: 'Interactive photos with celebrities and 4D Marvel Universe at Madame Tussauds.',
        evening: 'Race down Sentosa Skyline Luge tracks illuminated under neon night lights.',
        highlights: ['SkyHelix Open-Air Panorama', 'Madame Tussauds 4D Marvel', 'Night Skyline Luge Tracks']
      },
      {
        dayNumber: 3,
        title: 'Universal Studios VIP Access & Siloso Beach Sunset',
        morning: 'Full day Sentosa Express access into Universal Studios Singapore thrilling movie zones.',
        afternoon: 'Transformers 3D battle and Jurassic Park Rapids Adventure ride.',
        evening: 'Sunset drinks at Rumours Beach Club Siloso Beach with live DJ sets.',
        highlights: ['Universal Studios Express', 'Jurassic Rapids Adventure', 'Rumours Beach Club Sunset']
      },
      {
        dayNumber: 4,
        title: 'Marina Bay Sands Shopping, ArtScience Museum & Merlion',
        morning: 'Monorail to mainland; explore immersive digital art at ArtScience Museum Future World.',
        afternoon: 'Luxury duty-free shopping at The Shoppes at Marina Bay Sands.',
        evening: 'Spectra light & water show followed by Michelin seafood dinner at Jumbo Seafood.',
        highlights: ['ArtScience Future World', 'Marina Bay Shoppes', 'Jumbo Chili Crab Dinner']
      },
      {
        dayNumber: 5,
        title: 'Jewel Changi Canopy Park & Departure',
        morning: 'Explore Jewel Changi Canopy Park, hedge maze, and glass sky nets.',
        afternoon: 'Last minute Singapore souvenir shopping and tax refund processing.',
        evening: 'Departure from Singapore Changi International Terminal.',
        highlights: ['Canopy Park Glass Nets', 'Tax Refund Guidance', 'Smooth Departure']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Travelodge Harbourfront Singapore', rating: 4.4, estPricePerNight: '₹7,500', perks: ['Sentosa Monorail Access', 'Rooftop Pool'] },
      { tier: 'Comfort', name: 'Village Hotel Sentosa', rating: 4.8, estPricePerNight: '₹18,000', perks: ['4 Themed Pools', 'Free Sentosa Express Passes'] },
      { tier: 'Luxury', name: 'Capella Singapore Sentosa', rating: 4.98, estPricePerNight: '₹62,000', perks: ['Private Villa Plunge Pool', 'Historic Colonial Luxury'] }
    ],
    budgetBreakdown: {
      flights: 20000,
      accommodation: 16000,
      foodDining: 5000,
      activitiesSightseeing: 3500,
      localTransport: 500
    },
    inclusions: [
      '3-in-1 Sentosa pass pre-booking links with priority voucher codes',
      'Free cancellation terms checklist',
      'Complete Sentosa monorail & beach shuttle schedule'
    ],
    exclusions: ['Airfare and accommodation fees', 'Personal dining and retail purchases']
  },
  {
    id: 'singapore-wings-of-time',
    slug: 'wings-of-time-fireworks-symphony-singapore',
    destination: 'Singapore',
    country: 'Singapore',
    region: 'International',
    title: 'Wings of Time Fireworks Symphony',
    durationDays: 3,
    durationNights: 2,
    travelerType: 'Couple',
    itineraryCountLabel: '76 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 29000,
    rating: 4.86,
    reviewCount: 78,
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'An enchanting multi-sensory beach extravaganza set against the open sea at Siloso Beach, featuring water displays, laser lasers, fire effects, and spectacular fireworks.',
    bestTimeToVisit: 'Year-round',
    agent: {
      id: 'ag-103',
      agencyName: 'Lion City Journeys India Ltd',
      founderName: 'Rohan Deshmukh',
      gstNumber: '33AABCL4421P1Z9',
      isVerified: true,
      yearsInBusiness: 9,
      location: 'Chennai & Singapore',
      rating: 4.8,
      reviewCount: 165,
      phone: '+91 94441 55670',
      whatsapp: '+91 94441 55670',
      email: 'tours@lioncityjourneys.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 26
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival, Siloso Beachfront Walk & Wings of Time Night Spectacle',
        morning: 'Smooth arrival at Changi; direct transfer to Sentosa Island.',
        afternoon: 'Stroll along Siloso Beach; beachside coconut drink at Trapizza.',
        evening: 'Reserved premium seats for Wings of Time outdoor sea fireworks show; beachside seafood BBQ dinner.',
        highlights: ['Siloso Beach Front', 'Wings of Time Sea Fireworks', 'Trapizza Beach Dining']
      },
      {
        dayNumber: 2,
        title: 'Sentosa Skyline Luge & Marina Bay Sands Sunset',
        morning: 'Ride downhill on the Skyline Luge and chairlift with coastal views.',
        afternoon: 'Cross to Marina Bay Sands SkyPark for 360-degree Singapore skyline panoramas.',
        evening: 'Spectra light & water laser fountain show at the Marina promenade.',
        highlights: ['Skyline Luge Thrills', 'MBS SkyPark 57th Floor', 'Spectra Water Light Symphony']
      },
      {
        dayNumber: 3,
        title: 'Jewel Changi Rain Vortex & Flight Departure',
        morning: 'Breakfast and check-out; visit Jewel Changi 40m indoor waterfall.',
        afternoon: 'Shop duty-free at Terminal 1-3 retail luxury hubs.',
        evening: 'Board return flight with unforgettable fireworks memories.',
        highlights: ['Jewel Rain Vortex', 'Terminal Duty-Free', 'Seamless Flight Connection']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Siloso Beach Resort Sentosa', rating: 4.3, estPricePerNight: '₹8,500', perks: ['Direct Beach Access', 'Eco Resort Pool'] },
      { tier: 'Comfort', name: 'Oasia Resort Sentosa', rating: 4.7, estPricePerNight: '₹16,000', perks: ['Wellness Spa', 'Next to Monorail Station'] },
      { tier: 'Luxury', name: 'The Barracks Hotel Sentosa', rating: 4.96, estPricePerNight: '₹55,000', perks: ['Equerry Butler Service', 'Private Pool Access'] }
    ],
    budgetBreakdown: {
      flights: 18000,
      accommodation: 7000,
      foodDining: 2500,
      activitiesSightseeing: 1000,
      localTransport: 500
    },
    inclusions: [
      'Premium reserved seating tips for Wings of Time',
      'Free beach tram routing guide',
      'Best evening photo vantage spots'
    ],
    exclusions: ['Airfare and accommodation fees', 'Personal dining and shopping']
  },
  {
    id: 'singapore-oceanarium',
    slug: 'singapore-oceanarium-sea-aquarium',
    destination: 'Singapore',
    country: 'Singapore',
    region: 'International',
    title: 'Singapore Oceanarium',
    durationDays: 4,
    durationNights: 3,
    travelerType: 'Family',
    itineraryCountLabel: '76 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 38000,
    rating: 4.91,
    reviewCount: 114,
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Dive deep into S.E.A. Aquarium & Singapore Oceanarium, home to more than 100,000 marine animals across 1,000 species, giant manta rays, and an underwater glass walk.',
    bestTimeToVisit: 'Year-round',
    agent: {
      id: 'ag-103',
      agencyName: 'Lion City Journeys India Ltd',
      founderName: 'Rohan Deshmukh',
      gstNumber: '33AABCL4421P1Z9',
      isVerified: true,
      yearsInBusiness: 9,
      location: 'Chennai & Singapore',
      rating: 4.8,
      reviewCount: 165,
      phone: '+91 94441 55670',
      whatsapp: '+91 94441 55670',
      email: 'tours@lioncityjourneys.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 26
    },
    days: [
      {
        dayNumber: 1,
        title: 'Changi Arrival, Singapore Cable Car & Sentosa',
        morning: 'Land in Singapore; take the scenic cable car across Keppel Harbour into Sentosa.',
        afternoon: 'Hotel check-in; explore Resorts World Sentosa waterfront boardwalk.',
        evening: 'Dinner at Malaysian Food Street; sample authentic Penang Char Kway Teow.',
        highlights: ['Keppel Harbour Cable Car', 'Resorts World Promenade', 'Malaysian Food Street']
      },
      {
        dayNumber: 2,
        title: 'S.E.A. Aquarium Open Ocean & Shark Seas Tunnel',
        morning: 'Explore S.E.A. Aquarium; marvel at giant manta rays, goliath groupers, and sea jellies.',
        afternoon: 'Walk through the 360-degree underwater shark dome with over 200 apex predators.',
        evening: 'Sunset coffee at Hard Rock Hotel pool terrace; evening stroll along Palawan Beach.',
        highlights: ['Open Ocean Habitat Tank', 'Shark Tunnel Walk', 'Palawan Beach Suspension Bridge']
      },
      {
        dayNumber: 3,
        title: 'Adventure Cove Waterpark & Dolphin Island',
        morning: 'High-speed water slides, Dueling Dingo, and lazy river cruising through an underwater tunnel.',
        afternoon: 'Snorkel over the Rainbow Reef surrounded by 20,000 colorful tropical fish.',
        evening: 'Dine at Ocean Restaurant with floor-to-ceiling glass aquarium view.',
        highlights: ['Rainbow Reef Snorkeling', 'Adventure Cove Waterslides', 'Aquarium Dining Experience']
      },
      {
        dayNumber: 4,
        title: 'Gardens by the Bay & Changi Flight Departure',
        morning: 'Visit Gardens by the Bay Supertrees & Flower Dome on mainland.',
        afternoon: 'Last-minute retail therapy at Changi Jewel Shiseido Forest.',
        evening: 'Board return flight home.',
        highlights: ['Supertree Observation Deck', 'Jewel Changi Forest', 'Smooth Flight Departure']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Hotel Chancellor@Orchard', rating: 4.3, estPricePerNight: '₹6,800', perks: ['Rooftop Pool', 'Central Orchard Road'] },
      { tier: 'Comfort', name: 'Hotel Ora Resorts World Sentosa', rating: 4.8, estPricePerNight: '₹17,500', perks: ['Direct Steps to Aquarium', 'Free Express Passes'] },
      { tier: 'Luxury', name: 'Equarius Ocean Suites', rating: 4.98, estPricePerNight: '₹75,000', perks: ['Underwater Bedroom Wall', 'Private Jacuzzi'] }
    ],
    budgetBreakdown: {
      flights: 19000,
      accommodation: 12000,
      foodDining: 4000,
      activitiesSightseeing: 2500,
      localTransport: 500
    },
    inclusions: [
      'Direct admission discount links for S.E.A. Aquarium & Adventure Cove',
      'Behind-the-scenes marine keeper feeding times schedule',
      'Child and family transit logistics guide'
    ],
    exclusions: ['Airfare and accommodation fees', 'Personal dining and shopping']
  },
  {
    id: 'singapore-night-safari',
    slug: 'singapore-night-safari-wildlife-park',
    destination: 'Singapore',
    country: 'Singapore',
    region: 'International',
    title: 'Night Safari',
    durationDays: 4,
    durationNights: 3,
    travelerType: 'Group',
    itineraryCountLabel: '76 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 36000,
    rating: 4.89,
    reviewCount: 88,
    coverImage: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Ride the open-air guided tram through 6 geographical zones of the world’s first nocturnal wildlife park: Asian elephants, Malayan tigers, fishing cats, and Creatures of the Night show.',
    bestTimeToVisit: 'Year-round',
    agent: {
      id: 'ag-103',
      agencyName: 'Lion City Journeys India Ltd',
      founderName: 'Rohan Deshmukh',
      gstNumber: '33AABCL4421P1Z9',
      isVerified: true,
      yearsInBusiness: 9,
      location: 'Chennai & Singapore',
      rating: 4.8,
      reviewCount: 165,
      phone: '+91 94441 55670',
      whatsapp: '+91 94441 55670',
      email: 'tours@lioncityjourneys.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 26
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Singapore, City Tour & Night Safari Adventure',
        morning: 'Airport pickup and hotel check-in.',
        afternoon: 'Explore Singapore Botanical Gardens, a UNESCO World Heritage site.',
        evening: 'Board the guided Night Safari tram into deep nocturnal rainforest habitats; reserved VIP seats at Creatures of the Night amphitheater show.',
        highlights: ['Singapore Botanic Gardens', 'Night Safari Tram Ride', 'Creatures of the Night Show']
      },
      {
        dayNumber: 2,
        title: 'River Wonders & Singapore Zoo Breakfast with Wildlife',
        morning: 'Breakfast with wildlife at Singapore Zoo; visit Giant Panda Forest (Jia Jia & Kai Kai).',
        afternoon: 'Ride the Amazon River Quest boat at River Wonders.',
        evening: 'Dinner at Lau Pa Sat festival market; satay street experience.',
        highlights: ['Giant Panda Forest', 'Amazon River Quest Boat', 'Lau Pa Sat Satay Street']
      },
      {
        dayNumber: 3,
        title: 'Sentosa Island Cable Car & Marina Bay Skyline',
        morning: 'Cross into Sentosa via scenic cable car; relax at Tanjong Beach Club.',
        afternoon: 'Return to Marina Bay for SkyPark 57th Floor observation view.',
        evening: 'Spectra light, laser, and fountain show on Marina Bay promenade.',
        highlights: ['Mount Faber Cable Car', 'Marina Bay SkyPark', 'Spectra Light Spectacle']
      },
      {
        dayNumber: 4,
        title: 'Kampong Glam Haji Lane, Jewel Changi & Departure',
        morning: 'Stroll the colorful boutique alleys and mural walls of Haji Lane.',
        afternoon: 'Head to Jewel Changi; explore Rain Vortex waterfall.',
        evening: 'Assisted airport check-in for departure flight.',
        highlights: ['Haji Lane Shophouse Murals', 'Jewel Rain Vortex', 'Assisted Airport Check-in']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'ibis budget Singapore Bugis', rating: 4.3, estPricePerNight: '₹6,200', perks: ['Near Downtown MRT', 'Clean & Compact'] },
      { tier: 'Comfort', name: 'Orchard Rendezvous Hotel', rating: 4.7, estPricePerNight: '₹14,500', perks: ['Spacious Family Rooms', 'Direct Mandai Express Bus'] },
      { tier: 'Luxury', name: 'The Ritz-Carlton Millenia Singapore', rating: 4.96, estPricePerNight: '₹50,000', perks: ['Iconic Octagonal Bathroom Window', 'Marina Views'] }
    ],
    budgetBreakdown: {
      flights: 18000,
      accommodation: 11000,
      foodDining: 4000,
      activitiesSightseeing: 2500,
      localTransport: 500
    },
    inclusions: [
      'Mandai Shuttle Express timetable & pickup map',
      'Creatures of the Night amphitheater VIP booking hack',
      'Night-time camera photography settings guide'
    ],
    exclusions: ['Airfare and accommodation fees', 'Personal dining and shopping']
  },

  // THAILAND PACKAGES
  {
    id: 'thailand-4d',
    slug: 'thailand-bangkok-pattaya-fun-escape',
    destination: 'Thailand',
    country: 'Thailand',
    region: 'International',
    title: 'Thailand Fun Escape: Bangkok Grand Palace & Pattaya Coral Island',
    durationDays: 4,
    durationNights: 3,
    travelerType: 'Group',
    itineraryCountLabel: '142 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 26000,
    rating: 4.87,
    reviewCount: 96,
    coverImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80'],
    overview: 'High-energy 4-day party and sightseeing package covering Pattaya speedboats, parasailing at Koh Larn Coral Island, Bangkok river temples, and bustling night markets.',
    bestTimeToVisit: 'November to April',
    agent: {
      id: 'ag-108',
      agencyName: 'Siam Discovery Travels Pvt Ltd',
      founderName: 'Anong Promthep',
      gstNumber: '27AABCS5542Q1Z8',
      isVerified: true,
      yearsInBusiness: 10,
      location: 'Mumbai & Bangkok Sukhumvit',
      rating: 4.89,
      reviewCount: 380,
      phone: '+91 98200 44192',
      whatsapp: '+91 98200 44192',
      email: 'bookings@siamdiscovery.com',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 45
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Bangkok, Transfer to Pattaya & Alcazar Cabaret',
        morning: 'Airport pick up at Suvarnabhumi Airport (BKK); scenic 2-hour AC highway drive to Pattaya.',
        afternoon: 'Hotel check-in and beach walk along Pattaya Beach Road.',
        evening: 'VIP seats at the dazzling Alcazar Cabaret show featuring sensational costumes and lighting.',
        highlights: ['Airport AC Transfer', 'Pattaya Beachfront', 'Alcazar Cabaret Show']
      },
      {
        dayNumber: 2,
        title: 'Speedboat to Koh Larn Coral Island & Water Sports',
        morning: 'Private speedboat to crystal-clear Koh Larn Coral Island; thrilling parasailing over the sea.',
        afternoon: 'Banana boat rides, jet skiing, and fresh seafood lunch on Tien Beach.',
        evening: 'Return to Pattaya mainland; explore vibrant Walking Street nightlife and street food stalls.',
        highlights: ['Speedboat to Koh Larn', 'Parasailing & Jet Ski', 'Pattaya Walking Street']
      },
      {
        dayNumber: 3,
        title: 'Pattaya to Bangkok: Wat Arun & Chao Phraya Dinner Cruise',
        morning: 'Drive back to Bangkok; visit iconic porcelain-covered Wat Arun (Temple of Dawn).',
        afternoon: 'Shopping at MBK Center and Platinum Fashion Mall for bargains.',
        evening: 'Luxury dinner cruise along Chao Phraya River with live pop music and illuminated temple views.',
        highlights: ['Wat Arun Temple', 'Platinum Mall Bargain Shopping', 'Chao Phraya Dinner Cruise']
      },
      {
        dayNumber: 4,
        title: 'Chatuchak Weekend Market & Airport Drop-off',
        morning: 'Shop at massive Chatuchak market or CentralWorld; Thai coconut ice cream treat.',
        afternoon: 'Authentic 60-minute traditional Thai massage.',
        evening: 'Private airport drop at BKK/DMK for your return flight.',
        highlights: ['Chatuchak Market', 'Traditional Thai Massage', 'Smooth Airport Drop']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Holiday Inn Express Siam', rating: 4.4, estPricePerNight: '₹3,200', perks: ['BTS SkyTrain Access', 'Free Breakfast'] },
      { tier: 'Comfort', name: 'Amari Pattaya / Avani Sukhumvit', rating: 4.7, estPricePerNight: '₹7,500', perks: ['Lagoon Pool', 'Rooftop Lounge'] },
      { tier: 'Luxury', name: 'The Peninsula Bangkok', rating: 4.96, estPricePerNight: '₹24,000', perks: ['Riverfront Terraces', 'Helipad & Spa'] }
    ],
    budgetBreakdown: {
      flights: 15000,
      accommodation: 6000,
      foodDining: 2500,
      activitiesSightseeing: 2000,
      localTransport: 500
    },
    inclusions: [
      'Bangkok to Pattaya transit guidelines with fixed fair drivers',
      'Pre-negotiated speedboat ticket booking links',
      'Top night market food safety checklist'
    ],
    exclusions: ['Flights and hotel tariffs', 'Personal water sports rentals']
  },
  {
    id: 'thailand-phuket-6d',
    slug: 'phuket-krabi-phi-phi-island-hopping',
    destination: 'Thailand',
    country: 'Thailand',
    region: 'International',
    title: 'Phuket & Krabi Island Hopping: Phi Phi Speedboat & James Bond Island',
    durationDays: 6,
    durationNights: 5,
    travelerType: 'Couple',
    itineraryCountLabel: '142 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 38000,
    rating: 4.94,
    reviewCount: 162,
    coverImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80'],
    overview: 'The quintessential tropical Thailand paradise: Patong beach nightlife in Phuket, speedboat cruise through towering limestone cliffs of Phi Phi Islands (Maya Bay), sea kayaking at James Bond Island, and Krabi’s Railay Beach.',
    bestTimeToVisit: 'November to April',
    agent: {
      id: 'ag-104',
      agencyName: 'Siam Discovery Travel Pvt Ltd',
      founderName: 'Pradeep Sharma',
      gstNumber: '07AAGCS1290K1ZP',
      isVerified: true,
      yearsInBusiness: 14,
      location: 'New Delhi & Bangkok',
      rating: 4.9,
      reviewCount: 420,
      phone: '+91 98110 33290',
      whatsapp: '+91 98110 33290',
      email: 'info@siamdiscovery.in',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 54
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Phuket (HKT), Patong Beach & Bangla Road',
        morning: 'Arrival at Phuket International Airport; scenic transfer to hotel in Patong or Karon Beach.',
        afternoon: 'Relax on the soft sands of Patong Beach; sip fresh dragonfruit smoothie.',
        evening: 'Explore the energetic lights and music of Bangla Road; dinner at seafood street market.',
        highlights: ['Phuket Airport Transfer', 'Patong Beach Sunset', 'Bangla Road Night Market']
      },
      {
        dayNumber: 2,
        title: 'Speedboat to Phi Phi Islands, Maya Bay & Monkey Beach',
        morning: 'Board luxury speedboat to Phi Phi Don and Phi Phi Leh; swim in the crystal turquoise waters of Maya Bay (from The Beach movie).',
        afternoon: 'Snorkel at Pileh Lagoon and spot playful wild macaques at Monkey Beach; buffet lunch on Phi Phi Don.',
        evening: 'Return to Phuket; relax with traditional Thai foot reflexology massage.',
        highlights: ['Maya Bay Turquoise Lagoon', 'Pileh Lagoon Cliff Swim', 'Monkey Beach Snorkeling']
      },
      {
        dayNumber: 3,
        title: 'Phang Nga Bay, James Bond Island & Sea Canoeing',
        morning: 'Tour spectacular Phang Nga Bay national park; board longtail boat to iconic James Bond Island (Koh Tapu).',
        afternoon: 'Guided sea canoeing through dark limestone caves and secret hidden lagoons of Koh Panak.',
        evening: 'Sunset drinks at Baba Nest rooftop lounge overlooking Andaman Sea.',
        highlights: ['James Bond Island Limestone Pin', 'Sea Cave Canoeing', 'Baba Nest Rooftop']
      },
      {
        dayNumber: 4,
        title: 'Phuket to Krabi: Ferry Transfer & Railay Beach Rock Cliffs',
        morning: 'Scenic ferry across Andaman Sea from Phuket to Ao Nang, Krabi (2 hours).',
        afternoon: 'Longtail boat to world-famous Railay Beach surrounded by sheer limestone karst cliffs; rock climbing demo.',
        evening: 'Watch rock climbers and fiery red sunset on Phra Nang Cave beach.',
        highlights: ['Andaman Sea Ferry Crossing', 'Railay Beach Karsts', 'Phra Nang Sunset Cave']
      },
      {
        dayNumber: 5,
        title: 'Krabi 4-Island Tour: Koh Poda & Chicken Island Sandbar',
        morning: 'Speedboat tour visiting Koh Poda, Chicken Island, Tub Island, and Koh Mor.',
        afternoon: 'Walk across the miraculous Talay Waek white sandbar connecting two islands during low tide; coral snorkeling.',
        evening: 'Dinner at Ao Nang cliffside Thai restaurant overlooking illuminated bay.',
        highlights: ['Talay Waek Ocean Sandbar', 'Koh Poda White Beach', 'Ao Nang Cliffside Dining']
      },
      {
        dayNumber: 6,
        title: 'Krabi Tiger Cave Temple & Airport Departure',
        morning: 'Visit historic Tiger Cave Temple (Wat Tham Suea) with panoramic mountain valley views.',
        afternoon: 'Pick up authentic Thai cashew snacks and herbal balms.',
        evening: 'Transfer to Krabi (KBV) or Phuket (HKT) Airport for homeward flight.',
        highlights: ['Tiger Cave Temple', 'Thai Souvenirs Shopping', 'Smooth Airport Drop']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Lub d Phuket Patong / ibis Styles Krabi Ao Nang', rating: 4.4, estPricePerNight: '₹2,800', perks: ['Walking to Beach', 'Outdoor Pool'] },
      { tier: 'Comfort', name: 'Amari Phuket / Centara Grand Beach Resort Krabi', rating: 4.8, estPricePerNight: '₹8,500', perks: ['Private Beach Cove', 'Cliffside Spa', 'Buffet'] },
      { tier: 'Luxury', name: 'Rayavadee Krabi / Sri Panwa Phuket', rating: 4.98, estPricePerNight: '₹38,000', perks: ['Private Pavilion Pool', 'Grotto Dining', 'Helipad'] }
    ],
    budgetBreakdown: {
      flights: 18000,
      accommodation: 10000,
      foodDining: 4500,
      activitiesSightseeing: 4000,
      localTransport: 1500
    },
    inclusions: [
      'Phuket to Krabi ferry fast-track ticket voucher codes',
      'Maya Bay environmental fee and entry timing advisory',
      'Direct WhatsApp emergency line for Andaman boat transfers'
    ],
    exclusions: ['Thailand Tourist Visa fees', 'Phang Nga National Park fee (THB 400)']
  },

  // EUROPE PACKAGES
  {
    id: 'europe-paris-swiss-6d',
    slug: 'paris-zurich-swiss-alps-romance',
    destination: 'Europe',
    country: 'France & Switzerland',
    region: 'International',
    title: 'Paris & Swiss Alps Romance: Eiffel Tower, Lucerne Lake & Jungfraujoch Top of Europe',
    durationDays: 6,
    durationNights: 5,
    travelerType: 'Couple',
    itineraryCountLabel: '210 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 135000,
    rating: 4.97,
    reviewCount: 188,
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The golden combination of French romance and Alpine majesty: Eiffel Tower summit at sunset, Louvre Museum, high-speed TGV Lyria train across the border, Lucerne wooden bridges, and snow-capped Jungfraujoch summit in the Swiss Alps.',
    bestTimeToVisit: 'April to October',
    agent: {
      id: 'ag-105',
      agencyName: 'EuroVistas Tours & Travels Pvt Ltd',
      founderName: 'Ananya Sengupta',
      gstNumber: '19AAACE4910Q1Z7',
      isVerified: true,
      yearsInBusiness: 16,
      location: 'Kolkata & Zurich',
      rating: 4.95,
      reviewCount: 512,
      phone: '+91 98300 77123',
      whatsapp: '+91 98300 77123',
      email: 'concierge@eurovistas.com',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 88
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Paris, Seine River Cruise & Eiffel Tower Twilight',
        morning: 'Arrive at Paris Charles de Gaulle (CDG); RER train to central Paris hotel; freshen up.',
        afternoon: 'Stroll along Champs-Élysées to Arc de Triomphe; visit iconic Louvre glass pyramid.',
        evening: 'Glass-canopy Seine River Bateaux Mouches cruise past illuminated Notre-Dame; watch Eiffel Tower sparkling lights show.',
        highlights: ['Seine River Cruise', 'Arc de Triomphe', 'Eiffel Tower Sparkling Lights']
      },
      {
        dayNumber: 2,
        title: 'Eiffel Tower 2nd Floor, Montmartre & Sacré-Cœur Basilica',
        morning: 'Ascend Eiffel Tower 2nd floor for 360-degree panoramic views of Paris.',
        afternoon: 'Wander artistic cobblestone streets of Montmartre; portrait artists at Place du Tertre; visit white-domed Sacré-Cœur Basilica.',
        evening: 'Dinner at classic French bistro in Saint-Germain-des-Prés with croissants and café au lait.',
        highlights: ['Eiffel Tower Summit Views', 'Montmartre Artists Square', 'Sacré-Cœur Basilica']
      },
      {
        dayNumber: 3,
        title: 'TGV High-Speed Train to Switzerland & Lucerne Lake Cruise',
        morning: 'Board 300 km/h TGV Lyria high-speed train from Paris Gare de Lyon to Zurich/Lucerne (4 hours).',
        afternoon: 'Stroll across 14th-century wooden Chapel Bridge and historic Lion Monument.',
        evening: 'Scenic paddle-steamer cruise on Lake Lucerne with snow-capped alpine peaks; Swiss cheese fondue dinner.',
        highlights: ['TGV High-Speed Train Cross-Border', 'Historic Chapel Bridge', 'Lake Lucerne Steamer Cruise']
      },
      {
        dayNumber: 4,
        title: 'Jungfraujoch – Top of Europe (3,454m) & Eiger Express Gondola',
        morning: 'GoldenPass train to Interlaken; ride the futuristic Eiger Express tricable gondola to Eigergletscher.',
        afternoon: 'Jungfrau railway to Top of Europe (3,454m); walk through Ice Palace sculptures and Sphinx Observatory overlooking Aletsch Glacier.',
        evening: 'Scenic descent through fairytale chalet village of Grindelwald; Swiss hot chocolate.',
        highlights: ['Jungfraujoch Top of Europe', 'Eiger Express Gondola', 'Aletsch Glacier Ice Palace']
      },
      {
        dayNumber: 5,
        title: 'Mount Titlis Revolving Cable Car & Engelberg Alpine Valley',
        morning: 'Train to Engelberg; board revolving Titlis Rotair cable car up to 3,020 meters.',
        afternoon: 'Walk across Europe’s highest suspension bridge (Titlis Cliff Walk); glacier snow tube fun.',
        evening: 'Swiss luxury chocolate tasting at Läderach in Lucerne.',
        highlights: ['Titlis Rotair Cable Car', 'Cliff Suspension Bridge', 'Läderach Chocolate Tasting']
      },
      {
        dayNumber: 6,
        title: 'Zurich Old Town & Airport Departure',
        morning: 'Train to Zurich; stroll along luxury Bahnhofstrasse and historic Altstadt.',
        afternoon: 'Lakeside walk along Lake Zurich; Swiss duty-free shopping.',
        evening: 'Zurich International Airport (ZRH) departure for flight home.',
        highlights: ['Bahnhofstrasse Shopping', 'Lake Zurich Promenade', 'Seamless Airport Connection']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Ibis Paris Tour Eiffel / Ibis Styles Lucerne', rating: 4.4, estPricePerNight: '₹10,000', perks: ['Walking to Metro/Train', 'Free Wi-Fi'] },
      { tier: 'Comfort', name: 'Hotel Des Balances Lucerne / Pullman Paris', rating: 4.8, estPricePerNight: '₹24,000', perks: ['Eiffel Tower / Lake Views', 'Historic Charms'] },
      { tier: 'Luxury', name: 'Four Seasons George V Paris / Victoria-Jungfrau', rating: 5.0, estPricePerNight: '₹75,000', perks: ['Michelin Dining', 'Luxury Alpine Spa', 'VIP Butler'] }
    ],
    budgetBreakdown: {
      flights: 52000,
      accommodation: 45000,
      foodDining: 20000,
      activitiesSightseeing: 12000,
      localTransport: 6000
    },
    inclusions: [
      'Dual-nation TGV Lyria and Swiss Travel Pass coordination matrix',
      'Schengen France + Switzerland dual entry visa blueprint',
      'Skip-the-line Eiffel Tower and Louvre reserved slot booking secrets'
    ],
    exclusions: ['Schengen Visa biometric fee', 'Swiss Pass mountain excursion add-ons']
  },

  // BALI PACKAGES
  {
    id: 'bali-4d',
    slug: 'bali-express-ubud-rice-terraces-beach-clubs',
    destination: 'Bali',
    country: 'Indonesia',
    region: 'International',
    title: 'Bali Express: Ubud Waterfalls, Rice Terraces & Seminyak Beach Clubs',
    durationDays: 4,
    durationNights: 3,
    travelerType: 'Solo',
    itineraryCountLabel: '64 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 29000,
    rating: 4.88,
    reviewCount: 84,
    coverImage: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80'],
    overview: 'High-energy 4-day tropical escape highlighting Ubud jungle swings, Tegalalang rice terraces, sacred monkey forest, and Seminyak sunset beach clubs.',
    bestTimeToVisit: 'April to October',
    agent: {
      id: 'ag-104',
      agencyName: 'Nusantara Island Holidays Pvt Ltd',
      founderName: 'Ketut Astawa',
      gstNumber: '24AAACN9921B1Z4',
      isVerified: true,
      yearsInBusiness: 12,
      location: 'Ahmedabad & Denpasar Bali',
      rating: 4.9,
      reviewCount: 310,
      phone: '+91 97240 88210',
      whatsapp: '+91 97240 88210',
      email: 'bali@nusantaraholidays.com',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 38
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Denpasar, Private Transfer to Ubud & Jungle Cafe',
        morning: 'Land at Ngurah Rai Airport (DPS); private AC car transfer through Balinese stone carving villages to Ubud.',
        afternoon: 'Check into rainforest pool villa; enjoy tropical coconut welcome drink.',
        evening: 'Walk through Ubud traditional art market and dine at organic cafe overlooking the jungle canopy.',
        highlights: ['Private Airport Pickup', 'Rainforest Villa Check-in', 'Ubud Art Market Walk']
      },
      {
        dayNumber: 2,
        title: 'Tegalalang Rice Terraces, Jungle Swing & Tirta Empul',
        morning: 'Early 7 AM visit to Tegalalang rice terraces before crowds; ride the famous Bali valley swing.',
        afternoon: 'Visit holy water temple of Tirta Empul for traditional Balinese cleansing blessing.',
        evening: 'Dinner in Ubud center accompanied by a traditional Legong dance performance.',
        highlights: ['Tegalalang Rice Terraces', 'Bali Valley Swing', 'Tirta Empul Holy Spring']
      },
      {
        dayNumber: 3,
        title: 'Ubud to Seminyak: Tegenungan Waterfall & Potato Head Sunset',
        morning: 'Scenic stop at Tegenungan Waterfall and dip in freshwater pool.',
        afternoon: 'Drive to southern Bali coast (Seminyak); check into stylish beach hotel.',
        evening: 'VIP daybed entry at Potato Head Beach Club; cocktail sunset over the Indian Ocean.',
        highlights: ['Tegenungan Waterfall', 'Seminyak Boutique Stroll', 'Potato Head Beach Sunset']
      },
      {
        dayNumber: 4,
        title: 'Uluwatu Clifftop Temple & Airport Departure',
        morning: 'Surf or relax on Seminyak beach; indulge in Balinese aromatherapy massage.',
        afternoon: 'Visit breathtaking Uluwatu clifftop temple perched 70 meters above crashing waves.',
        evening: 'Private airport transfer to DPS for evening return flight.',
        highlights: ['Balinese Aromatherapy Spa', 'Uluwatu Ocean Cliff', 'Seamless Airport Drop']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Pertiwi Bisma Ubud', rating: 4.5, estPricePerNight: '₹3,500', perks: ['Rice Field View', 'Infinity Pool'] },
      { tier: 'Comfort', name: 'Maya Ubud Resort & Spa', rating: 4.8, estPricePerNight: '₹9,500', perks: ['River Valley', 'Free Yoga Classes'] },
      { tier: 'Luxury', name: 'Alila Seminyak', rating: 4.95, estPricePerNight: '₹26,000', perks: ['Direct Beachfront', 'Sunset Bar'] }
    ],
    budgetBreakdown: {
      flights: 17000,
      accommodation: 6000,
      foodDining: 3000,
      activitiesSightseeing: 2000,
      localTransport: 1000
    },
    inclusions: [
      'Smart 4-day route optimized to avoid southern Bali traffic bottlenecks',
      'VIP beach club daybed booking tips',
      'SIM card and scooter rental guidance'
    ],
    exclusions: ['Airfare and accommodation tariffs', 'Personal dining and club tabs']
  },

  // KASHMIR PACKAGES
  {
    id: 'kashmir-4d',
    slug: 'kashmir-express-gulmarg-dal-lake',
    destination: 'Kashmir',
    country: 'India',
    region: 'Domestic',
    title: 'Kashmir Express: Dal Lake Houseboat & Gulmarg Snow Peaks',
    durationDays: 4,
    durationNights: 3,
    travelerType: 'Couple',
    itineraryCountLabel: '92 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 22000,
    rating: 4.85,
    reviewCount: 88,
    coverImage: 'https://images.unsplash.com/photo-1568889753852-196c487a536e?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1568889753852-196c487a536e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552098933-a5ceb0e5dd91?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'A romantic short getaway through Srinagar’s floating markets and Gulmarg’s world-famous Gondola cable car.',
    bestTimeToVisit: 'March to October',
    agent: {
      id: 'ag-107',
      agencyName: 'Pir Panjal Adventures LLP',
      founderName: 'Showkat Dar',
      gstNumber: '01AABCP8841L1Z2',
      isVerified: true,
      yearsInBusiness: 9,
      location: 'Srinagar, J&K',
      rating: 4.88,
      reviewCount: 260,
      phone: '+91 94190 33810',
      whatsapp: '+91 94190 33810',
      email: 'showkat@pirpanjaladventures.in',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 24
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Srinagar, Shikara Ride & Houseboat Check-in',
        morning: 'Airport pick up in Srinagar; drive through willow trees to Dal Lake ghat.',
        afternoon: 'Traditional Shikara boat ride across floating gardens, lotus flowers, and Char Chinar.',
        evening: 'Check-in to heritage hand-carved cedarwood luxury Houseboat; authentic Kashmiri Wazwan dinner.',
        highlights: ['Shikara Boat on Dal Lake', 'Char Chinar Island', 'Wazwan Dinner on Houseboat']
      },
      {
        dayNumber: 2,
        title: 'Scenic Drive to Gulmarg & Phase 1 Gondola Ride',
        morning: 'Drive to Gulmarg through apple orchards and pine forests (2 hrs).',
        afternoon: 'Pre-booked Gondola Cable Car Phase 1 to Kongdoori (10,000 ft); snow activities and ATV ride.',
        evening: 'Hot Kahwa saffron tea with walnut fudge overlooking Apharwat mountain range; return to Srinagar.',
        highlights: ['Gulmarg Gondola Phase 1', 'Kongdoori Snow Walk', 'Authentic Kashmiri Kahwa']
      },
      {
        dayNumber: 3,
        title: 'Mughal Gardens, Shankaracharya Temple & Old City Souks',
        morning: 'Visit Shalimar Bagh and Nishat Bagh cascading water gardens.',
        afternoon: 'Ascend Shankaracharya Temple hill for 360-degree valley view; visit Pashmina shawl loom workshop.',
        evening: 'Sunset dinner at Boulevard road waterfront overlooking illuminated Dal Lake.',
        highlights: ['Nishat & Shalimar Gardens', 'Pashmina Craft Loom', 'Shankaracharya Viewpoint']
      },
      {
        dayNumber: 4,
        title: 'Floating Flower Market & Airport Departure',
        morning: 'Early 6 AM Shikara visit to Srinagar’s famous floating vegetable & flower market.',
        afternoon: 'Dry fruits and saffron shopping at Lal Chowk.',
        evening: 'Drop-off at Sheikh ul-Alam International Airport Srinagar for flight home.',
        highlights: ['Early Morning Floating Market', 'Pashmina & Saffron Shopping', 'Airport Drop']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Hotel Royal Heritage Srinagar', rating: 4.4, estPricePerNight: '₹3,000', perks: ['Near Dal Lake', 'Heating'] },
      { tier: 'Comfort', name: 'Sukoon Luxury Heritage Houseboat', rating: 4.8, estPricePerNight: '₹8,500', perks: ['Cedarwood Decor', 'Wazwan Dining'] },
      { tier: 'Luxury', name: 'The Khyber Himalayan Resort Gulmarg', rating: 4.96, estPricePerNight: '₹28,000', perks: ['Heated Pool', 'Gondola View'] }
    ],
    budgetBreakdown: {
      flights: 11000,
      accommodation: 7000,
      foodDining: 4000,
      activitiesSightseeing: 5000,
      localTransport: 3000
    },
    inclusions: [
      'Gondola Phase 1 booking slot timing secret guide (avoids 3-hr queues)',
      'Verified driver contact numbers with non-union harassment guarantee',
      'Pashmina testing guide so you never buy fake synthetic wool'
    ],
    exclusions: ['Airfare and hotel reservations', 'Pony / horse ride union charges']
  },

  // GOA PACKAGES
  {
    id: 'goa-luxury-5d',
    slug: 'luxury-south-goa-coastal-serenity',
    destination: 'Goa',
    country: 'India',
    region: 'Domestic',
    title: 'Luxury South Goa Coastal Retreat: Private Yacht, Palolem Beach & Heritage Palaces',
    durationDays: 5,
    durationNights: 4,
    travelerType: 'Couple',
    itineraryCountLabel: '88 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 35000,
    rating: 4.94,
    reviewCount: 118,
    coverImage: 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=800&q=80'],
    overview: 'Unwind in peaceful luxury South Goa: pristine crescent Palolem & Agonda beaches, Cabo de Rama cliff fort, Portuguese mansions of Chandor, and private sunset yacht cruise with champagne.',
    bestTimeToVisit: 'October to May',
    agent: {
      id: 'ag-109',
      agencyName: 'Goa Coastal Horizons Tours',
      founderName: 'Alfonso Fernandes',
      gstNumber: '30AAACG4419N1ZX',
      isVerified: true,
      yearsInBusiness: 12,
      location: 'Panaji & Candolim',
      rating: 4.9,
      reviewCount: 310,
      phone: '+91 98221 55432',
      whatsapp: '+91 98221 55432',
      email: 'bookings@goacoastalhorizons.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 36
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in South Goa & Private Beachfront Check-in',
        morning: 'Airport chauffeur pickup; scenic drive through lush coconut groves to 5-star South Goa resort.',
        afternoon: 'Relax on private white sand beach in Cavelossim or Benaulim.',
        evening: 'Candlelight dinner at Martin’s Corner with famous butter garlic crab and live retro music.',
        highlights: ['Private Chauffeur Pickup', 'South Goa Private Beach', 'Martin’s Corner Famous Seafood']
      },
      {
        dayNumber: 2,
        title: 'Palolem Crescent Beach, Butterfly Beach & Dolphin Safari',
        morning: 'Drive down to crescent-shaped Palolem Beach; scenic boat ride to secluded Butterfly Beach.',
        afternoon: 'Spot playful wild dolphins in the Arabian Sea; organic salad lunch at beachside vegan shack.',
        evening: 'Silent Noise headphone party at Palolem or sunset yoga on the rocks.',
        highlights: ['Palolem Crescent Bay', 'Butterfly Beach Seclusion', 'Wild Dolphin Boat Tour']
      },
      {
        dayNumber: 3,
        title: 'Cabo de Rama Cliff Fort & Cola Beach Freshwater Lagoon',
        morning: 'Visit historic Cabo de Rama Fort perched dramatically over deep blue ocean cliffs.',
        afternoon: 'Explore hidden Cola Beach with emerald freshwater lagoon flowing into the sea; kayak in lagoon.',
        evening: 'Private sunset yacht charter along Sal River with sparkling wine.',
        highlights: ['Cabo de Rama Ocean Fort', 'Cola Beach Natural Lagoon', 'Private Sunset Yacht Charter']
      },
      {
        dayNumber: 4,
        title: 'Braganza Heritage Mansion & Divar Island Ferry',
        morning: 'Tour the 450-year-old Menezes Braganza House in Chandor with Belgian crystal chandeliers and ballroom.',
        afternoon: 'Local ferry to peaceful Divar Island; cycle through traditional Goan villages.',
        evening: 'Gourmet fine dining at Cavatina by Chef Avinash Martins (Modern Goan gastronomy).',
        highlights: ['Braganza Portuguese Palace', 'Divar Island Cycling', 'Cavatina Gourmet Dinner']
      },
      {
        dayNumber: 5,
        title: 'Leisure Morning & Airport Departure',
        morning: 'Spa massage at resort; seaside breakfast.',
        afternoon: 'Pick up authentic Bebinca and Feni.',
        evening: 'Assisted transfer to Dabolim or MOPA Airport.',
        highlights: ['Resort Ayurvedic Spa', 'Airport Drop']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'The Tubki Resort Patnem', rating: 4.4, estPricePerNight: '₹3,000', perks: ['Near Palolem', 'Pool'] },
      { tier: 'Comfort', name: 'Caravela Beach Resort Varca', rating: 4.8, estPricePerNight: '₹12,000', perks: ['Direct Beachfront', 'Golf Course', 'Buffet'] },
      { tier: 'Luxury', name: 'The St. Regis Goa Resort / The Leela Goa', rating: 5.0, estPricePerNight: '₹32,000', perks: ['Private Beach Lagoon', 'Butler Service', 'Spa'] }
    ],
    budgetBreakdown: {
      flights: 8000,
      accommodation: 18000,
      foodDining: 5000,
      activitiesSightseeing: 3000,
      localTransport: 1000
    },
    inclusions: [
      'South Goa secluded secret beaches GPS pin list',
      'Private yacht charter operator direct WhatsApp reservation',
      'Curated heritage mansion appointment guidance'
    ],
    exclusions: ['Airfare and accommodation fees', 'Personal dining and spa services']
  },

  // HIMACHAL / MANALI PACKAGES
  {
    id: 'himachal-shimla-manali-6d',
    slug: 'shimla-manali-classic-himalayan-circuit',
    destination: 'Manali',
    country: 'India',
    region: 'Domestic',
    title: 'Shimla & Manali Classic Himalayan Circuit: Mall Road, Kufri & Solang Valley',
    durationDays: 6,
    durationNights: 5,
    travelerType: 'Family',
    itineraryCountLabel: '86 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 24000,
    rating: 4.93,
    reviewCount: 172,
    coverImage: 'https://images.unsplash.com/photo-1571843439991-dd2b8e051966?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1571843439991-dd2b8e051966?auto=format&fit=crop&w=800&q=80'],
    overview: 'The complete Himachal family road trip: colonial British summer capital Shimla, snowy adventure at Kufri, scenic Beas river valley drive to Manali, Solang Valley paragliding, and Atal Tunnel.',
    bestTimeToVisit: 'Year-round (Snow in Dec - March)',
    agent: {
      id: 'ag-111',
      agencyName: 'Himalayan Highs Travel LLP',
      founderName: 'Vikrant Thakur',
      gstNumber: '02AABCH8741M1Z1',
      isVerified: true,
      yearsInBusiness: 11,
      location: 'Manali & Chandigarh',
      rating: 4.9,
      reviewCount: 390,
      phone: '+91 98160 44820',
      whatsapp: '+91 98160 44820',
      email: 'vikrant@himalayanhighs.in',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 32
    },
    days: [
      {
        dayNumber: 1,
        title: 'Chandigarh to Shimla (Queen of Hills)',
        morning: 'Pickup from Chandigarh airport/railway station; scenic mountain drive up to Shimla (3.5 hrs).',
        afternoon: 'Check-in to heritage hotel; stroll along pedestrian Mall Road and historic Ridge.',
        evening: 'Visit neo-Gothic Christ Church and Lakkar Bazaar wooden craft stalls.',
        highlights: ['Shimla Mountain Drive', 'Historic Ridge & Christ Church', 'Lakkar Bazaar Crafts']
      },
      {
        dayNumber: 2,
        title: 'Kufri Snow Adventure & Jakhoo Monkey Temple',
        morning: 'Drive to Kufri (8,600 ft); snow activities, horse rides to Mahasu Peak, and Himalayan Nature Park.',
        afternoon: 'Ascend Jakhoo ropeway cable car to giant 108-ft Lord Hanuman statue at Jakhoo Hill.',
        evening: 'Sunset dinner overlooking pine valley views from Mall Road restaurant.',
        highlights: ['Kufri Snow Point', 'Jakhoo Ropeway Cable Car', 'Himalayan Nature Park']
      },
      {
        dayNumber: 3,
        title: 'Shimla to Manali via Kullu Valley & Pandoh Dam',
        morning: 'Scenic highway journey winding through Mandi and roaring Beas River (7-8 hrs).',
        afternoon: 'Stop at Pandoh Dam and Hanogi Mata Temple; explore Kullu shawl factory.',
        evening: 'Arrival in Manali; check-in to pine-forest resort; bonfire dinner.',
        highlights: ['Scenic Beas River Drive', 'Pandoh Dam View', 'Manali Resort Bonfire']
      },
      {
        dayNumber: 4,
        title: 'Solang Valley Paragliding & Atal Tunnel Sissu',
        morning: 'Drive to Solang Valley for high-altitude paragliding and zorbing.',
        afternoon: 'Drive through landmark 9.02 km Atal Tunnel to snowy Sissu waterfalls in Lahaul.',
        evening: 'Return to Manali; hot Kahwa and trout fish dinner in Old Manali.',
        highlights: ['Solang Paragliding', 'Atal Tunnel Drive', 'Sissu Waterfall Snow Point']
      },
      {
        dayNumber: 5,
        title: 'Hadimba Temple, Vashisht Springs & Mall Road',
        morning: 'Visit wooden Hadimba Temple in ancient deodar forest and natural hot springs of Vashisht.',
        afternoon: 'Visit Tibetan Monastery and shop for local apple juice and jams.',
        evening: 'Relax by Beas river banks with bonfire.',
        highlights: ['Hadimba Temple', 'Vashisht Hot Springs', 'Manali Riverside Relax']
      },
      {
        dayNumber: 6,
        title: 'Manali to Chandigarh Departure',
        morning: 'Check-out and scenic return drive down to Chandigarh.',
        afternoon: 'Drop at Chandigarh Airport / Railway Station for flight home.',
        evening: 'Home arrival with Himalayan memories.',
        highlights: ['Smooth Chandigarh Drop', 'Scenic Valley Views']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Hotel Willow Banks Shimla / Snow Valley Manali', rating: 4.4, estPricePerNight: '₹2,800', perks: ['Mall Road Connected', 'Heating'] },
      { tier: 'Comfort', name: 'The Clarkes Hotel Shimla / The Orchard Greens Manali', rating: 4.8, estPricePerNight: '₹7,500', perks: ['Heritage British Decor', 'Apple Orchard View'] },
      { tier: 'Luxury', name: 'Wildflower Hall Shimla / The Himalayan Castle Manali', rating: 5.0, estPricePerNight: '₹28,000', perks: ['Oberoi Luxury Spa', 'Heated Outdoor Whirlpool'] }
    ],
    budgetBreakdown: {
      flights: 7000,
      accommodation: 9000,
      foodDining: 4500,
      activitiesSightseeing: 2500,
      localTransport: 1000
    },
    inclusions: [
      'Chandigarh to Shimla-Manali taxi driver non-union verified phone numbers',
      'Jakhoo and Solang ropeway pre-booking tips',
      'Packing checklist for Himalayan weather transitions'
    ],
    exclusions: ['Airfare and accommodation tariffs', 'Personal adventure sports fees']
  },

  // RAJASTHAN PACKAGES
  {
    id: 'rajasthan-jaisalmer-4d',
    slug: 'jaisalmer-thar-desert-safari-golden-fort',
    destination: 'Rajasthan',
    country: 'India',
    region: 'Domestic',
    title: 'Jaisalmer Desert Magic: Sam Sand Dunes, Camel Safari & Living Golden Fort',
    durationDays: 4,
    durationNights: 3,
    travelerType: 'Group',
    itineraryCountLabel: '110 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 19000,
    rating: 4.92,
    reviewCount: 94,
    coverImage: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80'],
    overview: 'Step into the Arabian Nights in the Thar Desert: live inside the world’s only living Golden Fort (Sonar Qila), explore Patwon Ki Haveli, ride camels across Sam Sand Dunes, and sleep in luxury desert tents under the Milky Way.',
    bestTimeToVisit: 'October to March',
    agent: {
      id: 'ag-113',
      agencyName: 'Rajputana Heritage Journeys Pvt Ltd',
      founderName: 'Mahipendra Singh Rathore',
      gstNumber: '08AABCR7719L1Z8',
      isVerified: true,
      yearsInBusiness: 17,
      location: 'Jaipur & Udaipur',
      rating: 4.94,
      reviewCount: 520,
      phone: '+91 94140 66291',
      whatsapp: '+91 94140 66291',
      email: 'mahip@rajputanajourneys.com',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 52
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Jaisalmer & Sunset at Gadisar Lake',
        morning: 'Arrive at Jaisalmer Airport / Railway Station; check into golden sandstone heritage haveli.',
        afternoon: 'Explore Gadisar Lake with beautiful carved stone cenotaphs and temples in water.',
        evening: 'Sunset view over the Golden City from Vyas Chhatri; dinner at rooftop fort-view restaurant.',
        highlights: ['Golden Haveli Check-in', 'Gadisar Lake Water Cenotaphs', 'Vyas Chhatri Sunset']
      },
      {
        dayNumber: 2,
        title: 'Jaisalmer Golden Fort (Sonar Qila) & Intricate Havelis',
        morning: 'Guided walking tour through Jaisalmer Fort (one of the largest fully preserved fortified cities in the world).',
        afternoon: 'Tour the breathtaking stone latticework of Patwon Ki Haveli, Nathmal Ki Haveli, and Salim Singh Ki Haveli.',
        evening: 'Shop for mirror-work embroidery, leather journals, and camel wool blankets in Sadar Bazaar.',
        highlights: ['Living Sonar Qila Fort', 'Patwon Ki Haveli Stone Carvings', 'Sadar Bazaar Handicrafts']
      },
      {
        dayNumber: 3,
        title: 'Abandoned Kuldhara Ghost Village & Sam Dunes Glamping',
        morning: 'Visit the haunting 13th-century abandoned ghost village of Kuldhara and ancient Bada Bagh royal cenotaphs.',
        afternoon: 'Drive into Thar Desert; check into luxury Swiss tent camp at Sam Sand Dunes.',
        evening: 'Sunset camel safari and 4x4 dune bashing; traditional Kalbeliya folk dance around bonfire with gala dinner under stars.',
        highlights: ['Kuldhara Ghost Village', 'Sam Sand Dunes Camel Safari', 'Kalbeliya Fire Dance & Bonfire']
      },
      {
        dayNumber: 4,
        title: 'Desert Sunrise & Departure',
        morning: 'Watch spectacular golden sunrise over endless desert dunes; traditional Rajasthani breakfast.',
        afternoon: 'Transfer to Jaisalmer or Jodhpur Airport / Railway Station.',
        evening: 'Flight home with memories of the Thar.',
        highlights: ['Thar Desert Sunrise', 'Smooth Departure']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Hotel Garh Jaisal / Desert Dream Royal Camp', rating: 4.4, estPricePerNight: '₹2,600', perks: ['Inside Fort', 'Desert Tent Included'] },
      { tier: 'Comfort', name: 'Fort Rajwada / Damodra Desert Camp', rating: 4.85, estPricePerNight: '₹7,500', perks: ['Heritage Pool', 'Luxury Swiss Tent', 'Buffet'] },
      { tier: 'Luxury', name: 'Suryagarh Jaisalmer / The Serai', rating: 5.0, estPricePerNight: '₹32,000', perks: ['Palace Luxury Fort', 'Stargazing Butler', 'Spa'] }
    ],
    budgetBreakdown: {
      flights: 7000,
      accommodation: 6000,
      foodDining: 3000,
      activitiesSightseeing: 2000,
      localTransport: 1000
    },
    inclusions: [
      'Verified desert camp operator contacts with no hidden charge guarantee',
      'Authentic Jaisalmer yellow stone and camel leather purchasing guide',
      'Desert stargazing camera settings guide'
    ],
    exclusions: ['Airfare and accommodation fees', 'Personal quad biking fees at dunes']
  },

  // KERALA ROMANTIC ESCAPE
  {
    id: 'kerala-4d',
    slug: 'wayanad-munnar-romantic-escape',
    destination: 'Kerala',
    country: 'India',
    region: 'Domestic',
    title: 'Wayanad & Munnar Romantic Escape: Chembra Peak, Tea Plantations & Treehouse Stays',
    durationDays: 4,
    durationNights: 3,
    travelerType: 'Couple',
    itineraryCountLabel: '88 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 21000,
    rating: 4.92,
    reviewCount: 96,
    coverImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Misty green tea gardens, private treehouse living, bamboo rafting on emerald rivers, and heart-shaped Chembra Lake trek.',
    bestTimeToVisit: 'September to March',
    agent: {
      id: 'ag-109',
      agencyName: 'Malabar Backwaters & Hills Pvt Ltd',
      founderName: 'Anand Nair',
      gstNumber: '32AABCM9102K1Z4',
      isVerified: true,
      yearsInBusiness: 8,
      location: 'Kochi, Kerala',
      rating: 4.91,
      reviewCount: 310,
      phone: '+91 94470 22105',
      whatsapp: '+91 94470 22105',
      email: 'anand@malabarbackwaters.in',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 26
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Calicut & Scenic Drive to Wayanad Rainforest',
        morning: 'Arrive at Calicut (CCJ); scenic mountain ghat road drive to Vythiri.',
        afternoon: 'Check into rainforest treehouse resort; herbal spice plantation walk.',
        evening: 'Candlelight dinner on private balcony overlooking misty valley.',
        highlights: ['Treehouse Check-in', 'Spice Plantation Walk', 'Private Balcony Dinner']
      },
      {
        dayNumber: 2,
        title: 'Chembra Peak Heart Lake Trek & Banasura Sagar Dam',
        morning: 'Guided trek to natural heart-shaped lake at Chembra Peak.',
        afternoon: 'Speedboat ride on Banasura Sagar (India’s largest earthen dam).',
        evening: 'Ayurvedic couple massage and campfire dinner.',
        highlights: ['Chembra Heart Lake', 'Banasura Sagar Dam', 'Ayurvedic Spa']
      },
      {
        dayNumber: 3,
        title: 'Kuruva Island Bamboo Rafting & Edakkal Ancient Caves',
        morning: 'Bamboo river rafting along Kuruva Dweep uninhabited island.',
        afternoon: 'Explore prehistoric petroglyphs at Edakkal Caves.',
        evening: 'Authentic Malabar traditional feast (Appam with stew).',
        highlights: ['Kuruva Bamboo Rafting', 'Edakkal Caves', 'Malabar Cuisine']
      },
      {
        dayNumber: 4,
        title: 'Misty Sunrise & Calicut Departure',
        morning: 'Watch valley fog clear over tea slopes; fresh Nilgiri tea tasting.',
        afternoon: 'Transfer to Calicut Airport (CCJ) for return flight.',
        evening: 'Flight home refreshed.',
        highlights: ['Misty Tea Sunrise', 'Smooth Departure']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Green Gates Hotel Wayanad', rating: 4.3, estPricePerNight: '₹2,500', perks: ['Plantation View', 'Breakfast'] },
      { tier: 'Comfort', name: 'Vythiri Resort / Pepper Trail', rating: 4.85, estPricePerNight: '₹8,500', perks: ['Treehouse Living', 'Ayurvedic Spa'] },
      { tier: 'Luxury', name: 'Evolve Back Kuruba Safari Lodge', rating: 5.0, estPricePerNight: '₹29,000', perks: ['Private Pool Villa', 'Fine Dining'] }
    ],
    budgetBreakdown: { flights: 6500, accommodation: 6000, foodDining: 3500, activitiesSightseeing: 2000, localTransport: 1500 },
    inclusions: ['Verified Wayanad forest entry permits', 'Ayurveda center direct discount vouchers', 'Treehouse booking direct contact'],
    exclusions: ['Airfare and accommodation fees', 'Personal spa therapies']
  },

  // LADAKH EXPEDITION
  {
    id: 'ladakh-5d',
    slug: 'high-altitude-ladakh-khardungla-adventure',
    destination: 'Ladakh',
    country: 'India',
    region: 'Domestic',
    title: 'High Altitude Ladakh Adventure: Khardung La, Nubra Sand Dunes & Magnetic Hill',
    durationDays: 5,
    durationNights: 4,
    travelerType: 'Solo',
    itineraryCountLabel: '74 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 28000,
    rating: 4.95,
    reviewCount: 138,
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The quintessential Himalayan high-pass adventure: crossing 17,582 ft Khardung La, riding double-humped Bactrian camels on Nubra sand dunes, and gazing at billions of stars under Bortle 1 skies.',
    bestTimeToVisit: 'May to September',
    agent: {
      id: 'ag-111',
      agencyName: 'Pir Panjal Adventures LLP',
      founderName: 'Showkat Dar',
      gstNumber: '01AABCP8841L1Z2',
      isVerified: true,
      yearsInBusiness: 9,
      location: 'Leh & Srinagar',
      rating: 4.88,
      reviewCount: 260,
      phone: '+91 94190 33810',
      whatsapp: '+91 94190 33810',
      email: 'showkat@pirpanjaladventures.in',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 24
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Leh & Mandatory Altitude Acclimatization',
        morning: 'Fly into Kushok Bakula Rimpochee Airport (IXL); transfer to boutique heritage hotel.',
        afternoon: 'Rest and acclimatize; garlic soup and warm butter tea.',
        evening: 'Gentle sunset stroll to Shanti Stupa for panoramic Leh city views.',
        highlights: ['Leh Airport Arrival', 'Acclimatization Rest', 'Shanti Stupa Sunset']
      },
      {
        dayNumber: 2,
        title: 'Sham Valley: Hall of Fame, Magnetic Hill & Sangam Confluence',
        morning: 'Visit Hall of Fame war museum and Gurudwara Pathar Sahib.',
        afternoon: 'Experience gravity-defying Magnetic Hill and Zanskar-Indus river confluence.',
        evening: 'Dinner at Leh Main Bazaar Tibetan cafe (Thukpa & Tingmo).',
        highlights: ['Magnetic Hill', 'Sangam Confluence', 'Tibetan Cafe Dining']
      },
      {
        dayNumber: 3,
        title: 'Crossing Khardung La Pass (17,582 ft) to Nubra Valley',
        morning: 'Epic climb over Khardung La pass adorned with thousands of Buddhist prayer flags.',
        afternoon: 'Descend into Hunder; ride double-humped Bactrian camels on cold desert white dunes.',
        evening: 'Milky Way stargazing camp stay under pristine skies.',
        highlights: ['Khardung La Summit', 'Bactrian Camel Safari', 'Milky Way Stargazing']
      },
      {
        dayNumber: 4,
        title: 'Diskit Monastery Giant Buddha & Return to Leh',
        morning: 'Visit 106-foot Maitreya Buddha statue at cliffside Diskit Monastery.',
        afternoon: 'Drive back to Leh over Khardung La; stop for hot Maggie at North Pullu.',
        evening: 'Last-minute souvenir shopping for Pashmina and apricot oil in Leh.',
        highlights: ['Diskit Giant Buddha', 'Himalayan Pass Return', 'Pashmina Shopping']
      },
      {
        dayNumber: 5,
        title: 'Leh Airport Departure',
        morning: 'Early morning mountain-view breakfast; airport transfer.',
        afternoon: 'Scenic flight over snow-capped Himalayan ranges.',
        evening: 'Arrive home.',
        highlights: ['Scenic Flight', 'Safe Journey']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Hotel Singge Palace Leh / Nubra Deluxe Camp', rating: 4.4, estPricePerNight: '₹3,000', perks: ['Heated Rooms', 'Campfire Included'] },
      { tier: 'Comfort', name: 'The Grand Dragon Ladakh / Desert Himalayas Resort', rating: 4.88, estPricePerNight: '₹9,500', perks: ['Oxygen Concentrators', 'Central Heating', 'Buffet'] },
      { tier: 'Luxury', name: 'The Chamba Camp Thiksey', rating: 5.0, estPricePerNight: '₹36,000', perks: ['Luxury Glamping', 'Personal Butler', 'Monastery Excursions'] }
    ],
    budgetBreakdown: { flights: 9000, accommodation: 9000, foodDining: 4500, activitiesSightseeing: 3000, localTransport: 2500 },
    inclusions: ['Inner Line Permits (ILP) official guide', 'Verified non-union taxi rate chart', 'High-altitude medical checklist'],
    exclusions: ['Airfare and accommodation fees', 'Camel safari fee']
  },

  // ANDAMAN SCUBA & REEF ESCAPE
  {
    id: 'andaman-4d',
    slug: 'havelock-neil-island-scuba-escapade',
    destination: 'Andaman',
    country: 'India',
    region: 'Domestic',
    title: 'Havelock & Neil Island Escapade: Scuba Diving, Elephant Beach & Natural Coral Bridge',
    durationDays: 4,
    durationNights: 3,
    travelerType: 'Group',
    itineraryCountLabel: '65 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 26000,
    rating: 4.93,
    reviewCount: 104,
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'High-energy tropical island adventure: scuba diving with sea turtles in Nemo Reef, glass-bottom boats to Elephant Beach, and natural rock bridges on Neil Island.',
    bestTimeToVisit: 'October to May',
    agent: {
      id: 'ag-115',
      agencyName: 'Blue Atoll Travel Experts LLP',
      founderName: 'Captain Ramesh Varma',
      gstNumber: '35AABCB7841N1Z5',
      isVerified: true,
      yearsInBusiness: 12,
      location: 'Port Blair, Andaman',
      rating: 4.95,
      reviewCount: 420,
      phone: '+91 94342 88120',
      whatsapp: '+91 94342 88120',
      email: 'ramesh@blueatoll.in',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 38
    },
    days: [
      {
        dayNumber: 1,
        title: 'Port Blair to Havelock Island via Makruzz Catamaran',
        morning: 'Arrive in Port Blair; board Makruzz high-speed AC catamaran to Havelock.',
        afternoon: 'Check into beach resort with private access to turquoise lagoon.',
        evening: 'Sunset walk at Kalapathar Beach with roasted sea snacks.',
        highlights: ['Makruzz Catamaran Cruise', 'Beach Resort Check-in', 'Kalapathar Sunset']
      },
      {
        dayNumber: 2,
        title: 'Scuba Diving at Nemo Reef & Elephant Beach Water Sports',
        morning: 'PADI-certified beginner scuba dive session among clownfish and live corals.',
        afternoon: 'Speedboat transfer to Elephant Beach for parasailing and sea walk.',
        evening: 'Seafood barbecue dinner at Barefoot Beach bar.',
        highlights: ['PADI Scuba Diving', 'Elephant Beach Parasailing', 'Seafood BBQ']
      },
      {
        dayNumber: 3,
        title: 'Neil Island Day Cruise: Natural Bridge & Laxmanpur Sunset',
        morning: 'Ferry to Neil Island (Shaheed Dweep); explore the limestone Natural Rock Bridge.',
        afternoon: 'Swim in calm crystal-clear waters of Bharatpur Beach.',
        evening: 'Spectacular crimson sunset at Laxmanpur Beach point.',
        highlights: ['Neil Island Natural Bridge', 'Bharatpur Beach', 'Laxmanpur Sunset']
      },
      {
        dayNumber: 4,
        title: 'Return to Port Blair & Flight Departure',
        morning: 'Morning cruise back to Port Blair; visit Samudrika Naval Marine Museum.',
        afternoon: 'Airport drop at Veer Savarkar International Airport (IXZ).',
        evening: 'Flight home with tropical memories.',
        highlights: ['Marine Museum', 'Smooth Airport Drop']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Havelock Country Homes', rating: 4.3, estPricePerNight: '₹3,000', perks: ['Pool', 'Close to Beach'] },
      { tier: 'Comfort', name: 'Symphony Palms Beach Resort / Seashell Havelock', rating: 4.82, estPricePerNight: '₹8,000', perks: ['Private Beach', 'Breakfast Buffet'] },
      { tier: 'Luxury', name: 'Taj Exotica Resort & Spa, Andamans', rating: 5.0, estPricePerNight: '₹38,000', perks: ['Radhanagar Villa', 'Luxury Butler', 'Spa'] }
    ],
    budgetBreakdown: { flights: 9500, accommodation: 8500, foodDining: 4000, activitiesSightseeing: 2500, localTransport: 1500 },
    inclusions: ['Private ferry ticket pre-booking links', 'PADI dive center direct discount coupon', 'Island scooter rental contact'],
    exclusions: ['Airfare and accommodation fees', 'Scuba photo/video raw footage']
  },

  // VIETNAM DISCOVERY
  {
    id: 'vietnam-5d',
    slug: 'central-vietnam-danang-hoian-golden-bridge',
    destination: 'Vietnam',
    country: 'Vietnam',
    region: 'International',
    title: 'Central Vietnam Highlights: Da Nang Golden Bridge, Hoi An Lanterns & Marble Mountains',
    durationDays: 5,
    durationNights: 4,
    travelerType: 'Couple',
    itineraryCountLabel: '82 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 32000,
    rating: 4.96,
    reviewCount: 154,
    coverImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'The trendiest Vietnam getaway: walk on the giant stone hands of the Golden Bridge in Ba Na Hills, cruise Hoi An lantern-lit canals in a coconut basket boat, and savor authentic egg coffee.',
    bestTimeToVisit: 'February to August',
    agent: {
      id: 'ag-113',
      agencyName: 'Siam Discovery Travel Pvt Ltd',
      founderName: 'Somchai Prasert',
      gstNumber: '27AABCS7712M1Z8',
      isVerified: true,
      yearsInBusiness: 14,
      location: 'Mumbai & Bangkok',
      rating: 4.92,
      reviewCount: 520,
      phone: '+91 98200 44102',
      whatsapp: '+91 98200 44102',
      email: 'somchai@siamdiscovery.in',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 44
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Da Nang & Dragon Bridge Fire Show',
        morning: 'Arrive at Da Nang International Airport (DAD); check into beachfront hotel on My Khe Beach.',
        afternoon: 'Relax on the sands of My Khe Beach; Vietnamese iced coffee at local cafe.',
        evening: 'Watch the Dragon Bridge breathe fire and water; dinner at night seafood market.',
        highlights: ['My Khe Beach', 'Dragon Bridge Fire Show', 'Seafood Night Market']
      },
      {
        dayNumber: 2,
        title: 'Ba Na Hills & Iconic Golden Hands Bridge',
        morning: 'Ride world record cable car to Sun World Ba Na Hills.',
        afternoon: 'Walk across the world-famous Golden Bridge held aloft by colossal stone hands.',
        evening: 'Explore French Village and wine cellars before descending back to Da Nang.',
        highlights: ['Golden Hands Bridge Walk', 'Ba Na Hills Cable Car', 'French Village']
      },
      {
        dayNumber: 3,
        title: 'Marble Mountains & Hoi An Ancient Lantern Town',
        morning: 'Explore Buddhist caves and stone carving village at Marble Mountains.',
        afternoon: 'Transfer to UNESCO World Heritage Hoi An Ancient Town; tailor-made suit shopping.',
        evening: 'Release glowing paper lanterns into Thu Bon River; authentic Cao Lau noodle dinner.',
        highlights: ['Marble Mountains Caves', 'Hoi An Ancient Streets', 'Floating River Lanterns']
      },
      {
        dayNumber: 4,
        title: 'Bay Mau Coconut Forest Basket Boat Ride',
        morning: 'Traditional spinning round bamboo basket boat ride through mangrove waterways.',
        afternoon: 'Cooking class learning Vietnamese spring rolls and Banh Xeo pancakes.',
        evening: 'Night stroll through night market illuminated by thousands of silk lanterns.',
        highlights: ['Coconut Basket Boat', 'Vietnamese Cooking Class', 'Silk Lantern Night Market']
      },
      {
        dayNumber: 5,
        title: 'Departure from Da Nang',
        morning: 'Last bowl of Pho Bo breakfast; souvenir coffee and pepper shopping.',
        afternoon: 'Transfer to Da Nang Airport for flight home.',
        evening: 'Flight home.',
        highlights: ['Pho Breakfast', 'Smooth Departure']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Haian Riverfront Hotel Da Nang', rating: 4.4, estPricePerNight: '₹2,800', perks: ['Rooftop Pool', 'Breakfast'] },
      { tier: 'Comfort', name: 'La Siesta Hoi An Resort & Spa', rating: 4.9, estPricePerNight: '₹6,500', perks: ['Saltwater Pool', 'Rice Field View', 'Spa'] },
      { tier: 'Luxury', name: 'InterContinental Danang Sun Peninsula Resort', rating: 5.0, estPricePerNight: '₹34,000', perks: ['Private Bay', 'Bill Bensley Design', 'Michelin Dining'] }
    ],
    budgetBreakdown: { flights: 11000, accommodation: 9500, foodDining: 5000, activitiesSightseeing: 4000, localTransport: 2500 },
    inclusions: ['Ba Na Hills express cable car e-ticket tips', 'Hoi An custom tailoring best shops list', 'Vietnam E-visa fast-track step by step'],
    exclusions: ['Airfare and accommodation fees', 'Tailor garments']
  },

  // JAPAN CULTURAL IMMERSION
  {
    id: 'japan-5d',
    slug: 'kyoto-osaka-cultural-gourmet-trail',
    destination: 'Japan',
    country: 'Japan',
    region: 'International',
    title: 'Kyoto & Osaka Cultural Immersion: Fushimi Inari Torii Gates, Dotonbori & Nara Deer Park',
    durationDays: 5,
    durationNights: 4,
    travelerType: 'Couple',
    itineraryCountLabel: '68 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 58000,
    rating: 4.97,
    reviewCount: 165,
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Experience the cultural soul of Japan: walk beneath ten thousand vermillion torii gates at Fushimi Inari, feed bowing sacred deer in Nara, and eat your way through the neon food paradise of Osaka’s Dotonbori.',
    bestTimeToVisit: 'March to May & September to November',
    agent: {
      id: 'ag-114',
      agencyName: 'EuroVistas Tours & Travels Pvt Ltd',
      founderName: 'Marcus Lindholm',
      gstNumber: '27AABCE9942P1Z0',
      isVerified: true,
      yearsInBusiness: 16,
      location: 'Mumbai & Tokyo',
      rating: 4.96,
      reviewCount: 480,
      phone: '+91 98201 55203',
      whatsapp: '+91 98201 55203',
      email: 'marcus@eurovistas.in',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 40
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Osaka & Neon Dotonbori Street Food Feast',
        morning: 'Arrive at Kansai International Airport (KIX); board Haruka express train to Namba.',
        afternoon: 'Check into stylish Namba hotel; stroll along Shinsaibashi shopping arcade.',
        evening: 'Glico Man sign photo; street food crawl tasting fresh Takoyaki, Okonomiyaki, and Wagyu skewers.',
        highlights: ['KIX Airport Arrival', 'Glico Running Man', 'Dotonbori Street Food Crawl']
      },
      {
        dayNumber: 2,
        title: 'Historical Osaka Castle & Bullet Train to Kyoto',
        morning: 'Tour the grand samurai fortress of Osaka Castle and outer moats.',
        afternoon: 'Board the Shinkansen bullet train (15 minutes) to historic Kyoto.',
        evening: 'Check into Machiya townhouse or boutique ryokan; Kaiseki multi-course dinner.',
        highlights: ['Osaka Castle Fortress', 'Shinkansen Bullet Train', 'Kyoto Kaiseki Dining']
      },
      {
        dayNumber: 3,
        title: 'Fushimi Inari 10,000 Torii Gates & Gion Geisha District',
        morning: 'Early morning hike through the mystical orange tunnels of Fushimi Inari Taisha shrine.',
        afternoon: 'Visit Kiyomizu-dera wooden temple with panoramic views over Kyoto.',
        evening: 'Evening lantern walk through stone-paved Gion streets; spot Geiko and Maiko.',
        highlights: ['Fushimi Inari Shrine', 'Kiyomizu-dera Temple', 'Gion Historic District']
      },
      {
        dayNumber: 4,
        title: 'Nara Sacred Deer Park & Giant Bronze Buddha',
        morning: 'Day trip to Nara; feed holy bowing shika deer with deer rice crackers (Shika-senbei).',
        afternoon: 'Marvel at the 15-meter bronze Great Buddha inside Todai-ji wooden temple.',
        evening: 'Return to Osaka; craft beer and matcha dessert tasting in Umeda Sky Building.',
        highlights: ['Nara Bowing Deer', 'Todai-ji Great Buddha', 'Umeda Sky Building Night View']
      },
      {
        dayNumber: 5,
        title: 'Kansai Departure',
        morning: 'Final matcha latte and duty-free souvenir shopping at airport (Royce chocolate & Tokyo Banana).',
        afternoon: 'Flight departure from Kansai Airport.',
        evening: 'Arrive home with unforgettable memories.',
        highlights: ['Duty Free Souvenirs', 'Smooth Flight Home']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Hotel Gracery Kyoto Sanjo', rating: 4.4, estPricePerNight: '₹5,500', perks: ['Central Location', 'Heated Toilet'] },
      { tier: 'Comfort', name: 'Cross Hotel Osaka / Kyoto Century Hotel', rating: 4.88, estPricePerNight: '₹12,000', perks: ['Near Station', 'Rain Shower', 'Buffet'] },
      { tier: 'Luxury', name: 'Hoshinoya Kyoto / The Ritz-Carlton Kyoto', rating: 5.0, estPricePerNight: '₹65,000', perks: ['River Boat Arrival', 'Michelin Chef', 'Zen Garden'] }
    ],
    budgetBreakdown: { flights: 18000, accommodation: 16000, foodDining: 12000, activitiesSightseeing: 7000, localTransport: 5000 },
    inclusions: ['ICOCA transit card setup instructions', 'JR Shinkansen ticketing direct machine guide', 'Luggage forwarding (Takkyubin) service manual'],
    exclusions: ['Airfare and accommodation fees', 'Ryokan onsen private rental']
  },

  // SRI LANKA SCENIC TEA & WHALES
  {
    id: 'srilanka-5d',
    slug: 'ella-tea-country-nine-arch-mirissa',
    destination: 'Sri Lanka',
    country: 'Sri Lanka',
    region: 'International',
    title: 'Scenic Sri Lanka Tea Country: Ella Nine Arch Bridge, Nuwara Eliya & Mirissa Beach',
    durationDays: 5,
    durationNights: 4,
    travelerType: 'Family',
    itineraryCountLabel: '58 Itineraries',
    accessPrice: 99,
    gstAmount: 0,
    totalAccessPrice: 99,
    estimatedTripCost: 24000,
    rating: 4.91,
    reviewCount: 92,
    coverImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Ride the world’s most scenic blue train through misty Ceylon tea plantations, watch steam trains pass the iconic Nine Arch Bridge in Ella, and spot blue whales leaping in the Indian Ocean.',
    bestTimeToVisit: 'November to April',
    agent: {
      id: 'ag-116',
      agencyName: 'Lion City Journeys India Ltd',
      founderName: 'Priya Fernando',
      gstNumber: '29AABCL6631Q1Z3',
      isVerified: true,
      yearsInBusiness: 11,
      location: 'Chennai & Colombo',
      rating: 4.93,
      reviewCount: 370,
      phone: '+91 98400 99214',
      whatsapp: '+91 98400 99214',
      email: 'priya@lioncityjourneys.in',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      itinerariesPublished: 30
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival in Colombo & Scenic Hill Country Drive to Nuwara Eliya',
        morning: 'Arrive at Bandaranaike International Airport (CMB); private chauffeur pick-up.',
        afternoon: 'Drive into the misty highlands of Little England (Nuwara Eliya); visit Ramboda Waterfalls.',
        evening: 'High tea at Grand Hotel colonial lounge with Ceylon strawberries and clotted cream.',
        highlights: ['Private Chauffeur Pickup', 'Ramboda Falls', 'Colonial High Tea']
      },
      {
        dayNumber: 2,
        title: 'World’s Most Scenic Blue Train to Ella',
        morning: 'Board the iconic blue train from Nanu Oya to Ella through emerald tea plantations.',
        afternoon: 'Hang out of the open carriage doors capturing world-famous mountain photos.',
        evening: 'Check into Ella mountain resort; dinner with live acoustic music at Cafe Chill.',
        highlights: ['Scenic Blue Train Journey', 'Ella Mountain View Check-in', 'Cafe Chill Dinner']
      },
      {
        dayNumber: 3,
        title: 'Ella Nine Arch Bridge & Little Adam’s Peak Hike',
        morning: 'Watch the vintage train cross the colonial stone Nine Arch Demodara bridge.',
        afternoon: 'Easy 45-minute hike up Little Adam’s Peak for 360-degree gorge views.',
        evening: 'Swim under Ravana Falls; coconut roti and curry dinner.',
        highlights: ['Nine Arch Bridge Train Crossing', 'Little Adam Peak Hike', 'Ravana Falls']
      },
      {
        dayNumber: 4,
        title: 'Descent to Mirissa Beach & Coconut Tree Hill',
        morning: 'Scenic drive down to the southern coast; check into beach hotel in Mirissa.',
        afternoon: 'Sunset photo session at the iconic sea cliff of Coconut Tree Hill.',
        evening: 'Fresh grilled jumbo prawns dinner with feet in the sand right on Mirissa beach.',
        highlights: ['Southern Coast Drive', 'Coconut Tree Hill', 'Beachfront Seafood Dinner']
      },
      {
        dayNumber: 5,
        title: 'Mirissa Blue Whale Safari & Colombo Departure',
        morning: 'Early morning boat excursion spotting the world’s largest animal — the majestic Blue Whale.',
        afternoon: 'Expressway drive to Colombo Airport (CMB) with stop at Galle Dutch Fort.',
        evening: 'Flight home.',
        highlights: ['Blue Whale Safari', 'Galle Dutch Fort', 'Smooth Airport Drop']
      }
    ],
    hotels: [
      { tier: 'Budget', name: 'Ella Flower Garden Resort', rating: 4.4, estPricePerNight: '₹2,600', perks: ['Gap View', 'Breakfast'] },
      { tier: 'Comfort', name: '98 Acres Resort & Spa / Heritance Tea Factory', rating: 4.9, estPricePerNight: '₹8,500', perks: ['Private Chalet', 'Infinity Pool'] },
      { tier: 'Luxury', name: 'Cape Weligama - Relais & Chateaux', rating: 5.0, estPricePerNight: '₹34,000', perks: ['Cliff Ocean Villa', 'Private Butler', 'Fine Dining'] }
    ],
    budgetBreakdown: { flights: 8000, accommodation: 7500, foodDining: 4000, activitiesSightseeing: 2500, localTransport: 2000 },
    inclusions: ['Blue train reserved ticket pre-purchase guide', 'Mirissa ethical whale watching operator contact', 'Sri Lanka tourist ETA visa fast guide'],
    exclusions: ['Airfare and accommodation fees', 'Whale boat private charter']
  }
];

export const ALL_ITINERARIES: Itinerary[] = [...POPULAR_DESTINATIONS, ...ADDITIONAL_ITINERARIES];
