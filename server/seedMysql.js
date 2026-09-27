/**
 * seedMysql.js — Seeds ALL_ITINERARIES from mockData.ts into MySQL v3_itinerary database.
 * Run: node server/seedMysql.js
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockDataPath = path.join(__dirname, '..', 'src', 'data', 'mockData.ts');

console.log('\n📦 [MySQL Seed Script] Starting...');
console.log(`📂 Source: ${mockDataPath}\n`);

// ─── Parse mockData.ts ─────────────────────────────────────────────────────
const rawContent = fs.readFileSync(mockDataPath, 'utf-8');

let jsContent = rawContent
  .replace(/import\s+type\s+\{[^}]*\}\s+from\s+'[^']*';?\s*/g, '')
  .replace(/:\s*Itinerary\[\]/g, '')
  .replace(/export\s+const/g, 'const');

const extractFn = new Function(`
  ${jsContent}
  return { POPULAR_DESTINATIONS, ADDITIONAL_ITINERARIES, ALL_ITINERARIES };
`);

const { ALL_ITINERARIES } = extractFn();
console.log(`✅ Parsed ${ALL_ITINERARIES.length} itineraries from mockData.ts`);

const isRemote = Boolean(
  process.env.DB_HOST && 
  process.env.DB_HOST !== 'localhost' && 
  process.env.DB_HOST !== '127.0.0.1'
);

const pool = await mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'v3_itinerary',
  ...(isRemote ? {} : { socketPath: '/tmp/mysql_v3.sock' }),
  waitForConnections: true,
  connectionLimit: 5
});

// Test connection
const [testRows] = await pool.query('SELECT VERSION() as v');
console.log(`✅ MySQL Connected — Version: ${testRows[0].v}\n`);

// ─── Seed Itineraries ───────────────────────────────────────────────────────
const insertSQL = `
  INSERT INTO itineraries (
    id, slug, destination, country, region, title,
    duration_days, duration_nights, traveler_type, itinerary_count_label,
    access_price, gst_amount, total_access_price, estimated_trip_cost,
    rating, review_count, cover_image, gallery_images_json,
    overview, best_time_to_visit, is_popular,
    agent_json, days_json, hotels_json, budget_breakdown_json,
    inclusions_json, exclusions_json
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    destination = VALUES(destination),
    cover_image = VALUES(cover_image),
    gallery_images_json = VALUES(gallery_images_json),
    is_popular = VALUES(is_popular),
    days_json = VALUES(days_json),
    hotels_json = VALUES(hotels_json),
    budget_breakdown_json = VALUES(budget_breakdown_json),
    agent_json = VALUES(agent_json)
`;

let successCount = 0;
let errorCount = 0;

for (const it of ALL_ITINERARIES) {
  try {
    await pool.query(insertSQL, [
      it.id,
      it.slug || '',
      it.destination,
      it.country || '',
      it.region || 'International',
      it.title,
      it.durationDays,
      it.durationNights,
      it.travelerType || 'Family',
      it.itineraryCountLabel || '',
      it.accessPrice || 99,
      it.gstAmount || 0,
      it.totalAccessPrice || 99,
      it.estimatedTripCost || 0,
      it.rating || 4.9,
      it.reviewCount || 0,
      it.coverImage || '',
      JSON.stringify(it.galleryImages || []),
      it.overview || '',
      it.bestTimeToVisit || '',
      it.isPopular ? 1 : 0,
      JSON.stringify(it.agent || {}),
      JSON.stringify(it.days || []),
      JSON.stringify(it.hotels || []),
      JSON.stringify(it.budgetBreakdown || {}),
      JSON.stringify(it.inclusions || []),
      JSON.stringify(it.exclusions || [])
    ]);
    successCount++;
    console.log(`   ✅ [${successCount}/${ALL_ITINERARIES.length}] ${it.id} — ${it.destination}`);
  } catch (err) {
    errorCount++;
    console.error(`   ❌ Failed: ${it.id} — ${err.message}`);
  }
}

// ─── Seed Travel Agents ─────────────────────────────────────────────────────
console.log('\n🏢 Seeding verified travel agents...');
const agents = [
  ['ag-101', 'Arabian Horizon Holidays Pvt Ltd', 'Vikram Malhotra', '27AABCU9603R1ZM', '+91 98201 44521', 'bookings@arabianhorizon.com', '+91 98201 44521', 'Mumbai', 'VERIFIED'],
  ['ag-102', 'Blue Atoll Travel Experts LLP', 'Ayesha Merchant', '29AAFCB7812L1Z3', '+91 99802 88412', 'hello@blueatollmaldives.com', '+91 99802 88412', 'Bangalore', 'VERIFIED'],
  ['ag-103', 'Lion City Journeys India Ltd', 'Rohan Deshmukh', '33AABCL4421P1Z9', '+91 94441 55670', 'tours@lioncityjourneys.com', '+91 94441 55670', 'Chennai', 'VERIFIED'],
  ['ag-104', 'Siam Discovery Travel Pvt Ltd', 'Pradeep Sharma', '07AAGCS1290K1ZP', '+91 98110 33290', 'info@siamdiscovery.in', '+91 98110 33290', 'New Delhi', 'VERIFIED'],
  ['ag-105', 'EuroVistas Tours & Travels Pvt Ltd', 'Ananya Sengupta', '19AAACE4910Q1Z7', '+91 98300 77123', 'concierge@eurovistas.com', '+91 98300 77123', 'Kolkata', 'VERIFIED'],
  ['ag-106', 'Nusantara Global Tours Pvt Ltd', 'Rahul Nair', '32AABCN5540M1Z2', '+91 98470 22390', 'bali@nusantaraglobal.com', '+91 98470 22390', 'Kochi', 'VERIFIED'],
  ['ag-107', 'Pir Panjal Adventures LLP', 'Showkat Dar', '01AABCP8841L1Z2', '+91 94190 33810', 'showkat@pirpanjaladventures.in', '+91 94190 33810', 'Srinagar', 'VERIFIED'],
  ['ag-109', 'Goa Coastal Horizons Tours', 'Alfonso Fernandes', '30AAACG4419N1ZX', '+91 98221 55432', 'bookings@goacoastalhorizons.com', '+91 98221 55432', 'Panaji', 'VERIFIED'],
  ['ag-110', 'Malabar Backwaters & Hills Pvt Ltd', 'Mathew Kurian', '32AABCM9102K1Z5', '+91 94470 11982', 'mathew@malabarbackwaters.in', '+91 94470 11982', 'Kochi', 'VERIFIED'],
  ['ag-111', 'Himalayan Highs Travel LLP', 'Vikrant Thakur', '02AABCH8741M1Z1', '+91 98160 44820', 'vikrant@himalayanhighs.in', '+91 98160 44820', 'Manali', 'VERIFIED'],
];

for (const [id, agencyName, founderName, gstNumber, phone, email, whatsapp, city, status] of agents) {
  try {
    await pool.query(`
      INSERT INTO travel_agents (id, agency_name, founder_name, gst_number, phone, email, whatsapp, city, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE agency_name = VALUES(agency_name)
    `, [id, agencyName, founderName, gstNumber, phone, email, whatsapp, city, status]);
    console.log(`   ✅ Agent: ${agencyName}`);
  } catch (err) {
    console.error(`   ❌ Agent failed: ${agencyName} — ${err.message}`);
  }
}

// ─── Verify ─────────────────────────────────────────────────────────────────
const [[{ itinCount }]] = await pool.query('SELECT COUNT(*) as itinCount FROM itineraries');
const [[{ popularCount }]] = await pool.query('SELECT COUNT(*) as popularCount FROM itineraries WHERE is_popular = 1');
const [[{ agentCount }]] = await pool.query('SELECT COUNT(*) as agentCount FROM travel_agents');

console.log(`
═══════════════════════════════════════════════════════════
🎉 MYSQL SEED COMPLETE
   Total itineraries:       ${itinCount}
   Popular destinations:    ${popularCount}
   Verified agents:         ${agentCount}
   Successfully seeded:     ${successCount}
   Errors:                  ${errorCount}
═══════════════════════════════════════════════════════════
`);

await pool.end();
