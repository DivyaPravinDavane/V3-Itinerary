import { DatabaseSync } from 'node:sqlite';
import { ALL_ITINERARIES, POPULAR_DESTINATIONS } from '../src/data/mockData';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqliteDbPath = path.join(__dirname, 'v3_realtime.db');

function seed() {
  try {
    const sqliteDb = new DatabaseSync(sqliteDbPath);
    console.log(`🗄️ Connected to SQLite database at: ${sqliteDbPath}`);

    const all = [...ALL_ITINERARIES, ...POPULAR_DESTINATIONS];
    const unique = new Map();
    all.forEach(i => unique.set(i.id, { ...i, isPopular: POPULAR_DESTINATIONS.some(p => p.id === i.id) }));
    
    const stmt = sqliteDb.prepare(`
      INSERT OR REPLACE INTO itineraries (
        id, slug, destination, country, region, title, duration_days, duration_nights,
        traveler_type, itinerary_count_label, access_price, gst_amount, total_access_price,
        estimated_trip_cost, rating, review_count, cover_image, gallery_images_json,
        overview, best_time_to_visit, is_popular, agent_json, days_json, hotels_json,
        budget_breakdown_json, inclusions_json, exclusions_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    for (const itinerary of unique.values()) {
      stmt.run(
        itinerary.id,
        itinerary.slug,
        itinerary.destination,
        itinerary.country,
        itinerary.region,
        itinerary.title,
        itinerary.durationDays,
        itinerary.durationNights,
        itinerary.travelerType,
        itinerary.itineraryCountLabel,
        itinerary.accessPrice,
        itinerary.gstAmount,
        itinerary.totalAccessPrice,
        itinerary.estimatedTripCost,
        itinerary.rating,
        itinerary.reviewCount,
        itinerary.coverImage,
        JSON.stringify(itinerary.galleryImages),
        itinerary.overview,
        itinerary.bestTimeToVisit,
        itinerary.isPopular ? 1 : 0,
        JSON.stringify(itinerary.agent),
        JSON.stringify(itinerary.days),
        JSON.stringify(itinerary.hotels),
        JSON.stringify(itinerary.budgetBreakdown),
        JSON.stringify(itinerary.inclusions),
        JSON.stringify(itinerary.exclusions),
        now
      );
      console.log(`- Inserted/Updated: ${itinerary.id} (${itinerary.title})`);
    }

    console.log("✅ Seeding completed successfully in SQLite!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
