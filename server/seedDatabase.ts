import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { ALL_ITINERARIES, POPULAR_DESTINATIONS } from '../src/data/mockData';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function seed() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  };

  try {
    console.log("Connecting to MySQL server...");
    const connection = await mysql.createConnection(dbConfig);
    
    console.log(`Creating database \`${process.env.DB_NAME || 'v3_itinerary'}\`...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'v3_itinerary'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${process.env.DB_NAME || 'v3_itinerary'}\`;`);

    console.log("Applying schema...");
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await connection.query(schemaSql);

    console.log("Seeding itineraries...");
    // Combine both sets to make sure we have all of them (removing duplicates by id)
    const all = [...ALL_ITINERARIES, ...POPULAR_DESTINATIONS];
    const unique = new Map();
    all.forEach(i => unique.set(i.id, { ...i, isPopular: POPULAR_DESTINATIONS.some(p => p.id === i.id) }));
    
    for (const itinerary of unique.values()) {
      await connection.query(`
        INSERT INTO itineraries (
          id, slug, destination, country, region, title, duration_days, duration_nights,
          traveler_type, itinerary_count_label, access_price, gst_amount, total_access_price,
          estimated_trip_cost, rating, review_count, cover_image, gallery_images_json,
          overview, best_time_to_visit, is_popular, agent_json, days_json, hotels_json,
          budget_breakdown_json, inclusions_json, exclusions_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          slug=VALUES(slug), destination=VALUES(destination), country=VALUES(country), region=VALUES(region),
          title=VALUES(title), duration_days=VALUES(duration_days), duration_nights=VALUES(duration_nights),
          traveler_type=VALUES(traveler_type), itinerary_count_label=VALUES(itinerary_count_label),
          access_price=VALUES(access_price), gst_amount=VALUES(gst_amount), total_access_price=VALUES(total_access_price),
          estimated_trip_cost=VALUES(estimated_trip_cost), rating=VALUES(rating), review_count=VALUES(review_count),
          cover_image=VALUES(cover_image), gallery_images_json=VALUES(gallery_images_json), overview=VALUES(overview),
          best_time_to_visit=VALUES(best_time_to_visit), is_popular=VALUES(is_popular), agent_json=VALUES(agent_json),
          days_json=VALUES(days_json), hotels_json=VALUES(hotels_json), budget_breakdown_json=VALUES(budget_breakdown_json),
          inclusions_json=VALUES(inclusions_json), exclusions_json=VALUES(exclusions_json)
      `, [
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
        itinerary.isPopular,
        JSON.stringify(itinerary.agent),
        JSON.stringify(itinerary.days),
        JSON.stringify(itinerary.hotels),
        JSON.stringify(itinerary.budgetBreakdown),
        JSON.stringify(itinerary.inclusions),
        JSON.stringify(itinerary.exclusions)
      ]);
      console.log(`- Inserted/Updated: ${itinerary.id} (${itinerary.title})`);
    }

    console.log("✅ Seeding completed successfully!");
    await connection.end();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
