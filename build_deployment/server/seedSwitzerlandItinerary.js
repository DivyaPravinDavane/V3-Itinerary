import dotenv from 'dotenv';
import { insertItinerary, initDatabase, getMysqlPool } from './db.js';

dotenv.config();

const switzerlandItinerary = {
  id: 'switzerland-6d',
  slug: 'switzerland-alps-lucerne-interlaken-glacier-express',
  destination: 'Switzerland',
  country: 'Switzerland',
  region: 'International',
  title: 'Classic Switzerland: Zurich, Lucerne, Interlaken & Mt Titlis Snow Peaks',
  durationDays: 6,
  durationNights: 5,
  travelerType: 'Couple',
  itineraryCountLabel: '3 Itineraries',
  accessPrice: 99,
  gstAmount: 0,
  totalAccessPrice: 99,
  estimatedTripCost: 165000,
  rating: 4.97,
  reviewCount: 184,
  coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
  galleryImages: [
    'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  ],
  overview: 'The definitive Swiss fairytale holiday. Ride world-famous panoramic trains through snow-capped valleys, ascend Mt. Titlis in a revolving cable car, cruise crystal-clear Lake Lucerne, and explore the 72 waterfalls of Lauterbrunnen.',
  bestTimeToVisit: 'May to October for emerald meadows, December to April for winter snow ski',
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
    phone: '+91 98302 77149',
    whatsapp: '+91 98302 77149',
    email: 'alpine@eurovistas.in',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    itinerariesPublished: 9
  },
  days: [
    {
      dayNumber: 1,
      title: 'Arrival in Zurich & Scenic Train to Lake Lucerne',
      morning: 'Land at Zurich International Airport (ZRH). Collect your validated Swiss Travel Pass and board the Swiss Federal Rail to Lucerne (45 mins).',
      afternoon: 'Check-in to your 4-star lakeside hotel. Stroll across the iconic 14th-century Chapel Bridge (Kapellbrücke) and the Lion Monument.',
      evening: 'Romantic 1-hour sunset cruise on Lake Lucerne with panoramic views of Mt. Pilatus and alpine foothills. Traditional fondue dinner at Wirtshaus Taube.',
      highlights: ['Chapel Bridge & Water Tower', 'Lake Lucerne Sunset Cruise', 'Swiss Cheese Fondue']
    },
    {
      dayNumber: 2,
      title: 'Mount Titlis & Rotair Revolving Cable Car',
      morning: 'Scenic train ride from Lucerne to Engelberg valley station. Board the Titlis Xpress gondola up to Trübsee lake.',
      afternoon: 'Board the world’s first rotating cable car, Titlis Rotair, to 3,020m altitude. Walk the Titlis Cliff Walk Europe’s highest suspension bridge and explore the Glacier Cave.',
      evening: 'Return to Lucerne by 5 PM. Free evening to shop for Swiss chocolates at Läderach and luxury watches along Schwanenplatz.',
      highlights: ['Titlis Rotair Revolving Cable Car', 'Cliff Walk Suspension Bridge', 'Glacier Ice Grotto']
    },
    {
      dayNumber: 3,
      title: 'GoldenPass Panoramic Express to Interlaken',
      morning: 'Board the legendary GoldenPass Line train featuring panoramic glass windows traversing Brunig Pass and emerald Lake Brienz to Interlaken.',
      afternoon: 'Arrive in Interlaken nestled between Lake Thun and Lake Brienz. Check-in and take the funicular up to Harder Kulm (Two Lakes Bridge) for a bird’s eye view of the Eiger, Mönch & Jungfrau.',
      evening: 'Stroll along Höheweg boulevard watching paragliders land against the golden alpine sunset. Dinner at Bebbis Restaurant.',
      highlights: ['GoldenPass Scenic Express', 'Harder Kulm Skyline Deck', 'Interlaken Boulevard']
    },
    {
      dayNumber: 4,
      title: 'Lauterbrunnen Valley of 72 Waterfalls & Grindelwald First',
      morning: 'Short cogwheel train into Lauterbrunnen fairy-tale valley. Photograph Staubbach Falls cascading 300m directly beside rustic Swiss chalets.',
      afternoon: 'Continue to Grindelwald First. Experience the thrilling First Cliff Walk by Tissot and option for First Flyer zipline over mountain peaks.',
      evening: 'Return to Interlaken. Relax at local artisanal cafes with hot Swiss apple strudel and vanilla cream.',
      highlights: ['Staubbach Falls in Lauterbrunnen', 'Grindelwald First Cliff Walk', 'Swiss Chalet Photography']
    },
    {
      dayNumber: 5,
      title: 'Lake Thun Steamship Cruise & Historic Bern Old Town',
      morning: 'Board historic paddle steamer on turquoise Lake Thun past medieval Oberhofen Castle.',
      afternoon: 'Short 25-minute train to Bern, Switzerland’s UNESCO-listed capital. Walk through 6km of covered sandstone arcades, see the Zytglogge astronomical clock and Bear Park.',
      evening: 'Return to Zurich by high-speed rail. Check-in to luxury airport hotel. Farewell Swiss dinner in Zurich Old Town (Altstadt).',
      highlights: ['Lake Thun Castle Cruise', 'Bern UNESCO Old Town', 'Zytglogge Clock Tower']
    },
    {
      dayNumber: 6,
      title: 'Zurich Bahnhofstrasse & Departure',
      morning: 'Breakfast overlooking Lake Zurich. Leisurely walk along Bahnhofstrasse luxury avenue and Lindenhof hilltop viewpoint.',
      afternoon: 'Last-minute duty-free shopping at Lindt Home of Chocolate museum with the world’s largest chocolate fountain.',
      evening: 'Transfer to Zurich Airport (ZRH) via Swiss Rail. Board your onward flight back home carrying unforgettable alpine memories.',
      highlights: ['Lindt Chocolate Fountain', 'Bahnhofstrasse Shopping', 'Lindenhof Hill Panoramic View']
    }
  ],
  hotels: [
    {
      tier: 'Comfort',
      name: 'Hotel Des Balances / AMERON Hotel Flora',
      rating: 4.8,
      estPricePerNight: '₹14,500/night',
      perks: ['Overlooking Reuss River', 'Free Lucerne City Mobility Pass', 'Full Swiss Buffet Breakfast']
    },
    {
      tier: 'Luxury',
      name: 'Victoria-Jungfrau Grand Hotel & Spa Interlaken',
      rating: 4.95,
      estPricePerNight: '₹32,000/night',
      perks: ['Direct Jungfrau views', '5500 sqm Nescens Spa', 'Complimentary Champagne on arrival']
    }
  ],
  budgetBreakdown: {
    flights: 55000,
    accommodation: 62000,
    foodDining: 24000,
    activitiesSightseeing: 18000,
    localTransport: 6000
  },
  inclusions: [
    'Complete 6-Day Day-by-Day Turn-by-Turn Blueprint with exact train times and platform numbers',
    'Full Swiss Travel Pass integration guide with routes covering 100% of trains, boats & 50% cable cars',
    'Verified contact of certified Swiss specialist travel agent for visa letters & hotel vouchers',
    'Handpicked curated halal, vegetarian & Indian restaurant options across Zurich, Lucerne & Interlaken',
    'Secret photography coordinates for Lauterbrunnen and Chapel Bridge without tourists',
    'Full refund guarantee if any train route or timing is inaccurate'
  ],
  exclusions: [
    'International flight tickets from India to Zurich (recommended airlines and cheapest booking dates listed in PDF)',
    'Schengen visa fees (full document checklist and agent assistance included)',
    'Personal shopping & winter gear rental'
  ]
};

async function run() {
  await initDatabase();
  console.log('Inserting Switzerland itinerary into Hostinger MySQL...');
  const result = await insertItinerary(switzerlandItinerary);
  console.log('✅ Switzerland itinerary successfully saved in MySQL:', result?.id, result?.title);

  const pool = getMysqlPool();
  await pool.end();
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error inserting Switzerland itinerary:', err);
  process.exit(1);
});
