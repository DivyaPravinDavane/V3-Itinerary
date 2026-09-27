/**
 * seedDatabase.js — Reads ALL_ITINERARIES from mockData.ts and seeds them into the SQLite itineraries table.
 * Run: node server/seedDatabase.js
 */

import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'v3_realtime.db');
const mockDataPath = path.join(__dirname, '..', 'src', 'data', 'mockData.ts');

console.log(`\n🗄️  [Seed Script] Connecting to SQLite database: ${dbPath}`);
console.log(`📂 [Source File]  Reading mock data from: ${mockDataPath}\n`);

// Read the TS file as plain text and extract the data
const rawContent = fs.readFileSync(mockDataPath, 'utf-8');

// Strip TypeScript-specific syntax so we can eval it as plain JS
let jsContent = rawContent
  // Remove the import type line
  .replace(/import\s+type\s+\{[^}]*\}\s+from\s+'[^']*';?\s*/g, '')
  // Remove TypeScript type annotations from exports
  .replace(/:\s*Itinerary\[\]/g, '')
  // Replace 'export const' with 'const' (we'll capture them via global scope)
  .replace(/export\s+const/g, 'const');

// Use Function constructor to eval
let POPULAR_DESTINATIONS, ADDITIONAL_ITINERARIES, ALL_ITINERARIES;
try {
  const extractFn = new Function(`
    ${jsContent}
    return { POPULAR_DESTINATIONS, ADDITIONAL_ITINERARIES, ALL_ITINERARIES };
  `);
  const extracted = extractFn();
  POPULAR_DESTINATIONS = extracted.POPULAR_DESTINATIONS;
  ADDITIONAL_ITINERARIES = extracted.ADDITIONAL_ITINERARIES;
  ALL_ITINERARIES = extracted.ALL_ITINERARIES;
} catch (err) {
  console.error('❌ Failed to parse mockData.ts:', err.message);
  console.error('   Attempting alternative extraction...');
  
  // Alternative: try extracting array boundaries manually
  // Find POPULAR_DESTINATIONS array
  try {
    const popStart = rawContent.indexOf('export const POPULAR_DESTINATIONS');
    const addStart = rawContent.indexOf('export const ADDITIONAL_ITINERARIES');
    const allStart = rawContent.indexOf('export const ALL_ITINERARIES');
    
    // Extract POPULAR_DESTINATIONS
    const popBlock = rawContent.substring(popStart, addStart);
    const popArrayStart = popBlock.indexOf('[');
    const popArrayContent = popBlock.substring(popArrayStart);
    // Find matching bracket
    let depth = 0; let popEnd = 0;
    for (let i = 0; i < popArrayContent.length; i++) {
      if (popArrayContent[i] === '[') depth++;
      if (popArrayContent[i] === ']') depth--;
      if (depth === 0) { popEnd = i + 1; break; }
    }
    const popStr = popArrayContent.substring(0, popEnd)
      .replace(/'/g, '"')
      .replace(/(\w+):/g, '"$1":')
      .replace(/,\s*([}\]])/g, '$1');
    
    console.error('   Alternative extraction also failed. Please check mockData.ts format.');
    process.exit(1);
  } catch (e2) {
    console.error('❌ All extraction methods failed:', e2.message);
    process.exit(1);
  }
}

console.log(`✅ Parsed ${ALL_ITINERARIES.length} itineraries from mockData.ts`);
console.log(`   ├─ Popular Destinations: ${POPULAR_DESTINATIONS?.length || 0}`);
console.log(`   └─ Additional Itineraries: ${ADDITIONAL_ITINERARIES?.length || 0}\n`);

// Open SQLite database
const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL;');

// Create itineraries table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS itineraries (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL,
    destination TEXT NOT NULL,
    country TEXT NOT NULL,
    region TEXT NOT NULL,
    title TEXT NOT NULL,
    duration_days INTEGER NOT NULL,
    duration_nights INTEGER NOT NULL,
    traveler_type TEXT NOT NULL,
    itinerary_count_label TEXT,
    access_price REAL DEFAULT 99.00,
    gst_amount REAL DEFAULT 0.00,
    total_access_price REAL DEFAULT 99.00,
    estimated_trip_cost REAL NOT NULL,
    rating REAL DEFAULT 4.90,
    review_count INTEGER DEFAULT 0,
    cover_image TEXT NOT NULL,
    gallery_images_json TEXT,
    overview TEXT,
    best_time_to_visit TEXT,
    is_popular INTEGER DEFAULT 0,
    agent_json TEXT,
    days_json TEXT,
    hotels_json TEXT,
    budget_breakdown_json TEXT,
    inclusions_json TEXT,
    exclusions_json TEXT,
    created_at TEXT NOT NULL
  );
`);

// Prepare the INSERT statement
const insertStmt = db.prepare(`
  INSERT OR REPLACE INTO itineraries (
    id, slug, destination, country, region, title,
    duration_days, duration_nights, traveler_type, itinerary_count_label,
    access_price, gst_amount, total_access_price, estimated_trip_cost,
    rating, review_count, cover_image, gallery_images_json,
    overview, best_time_to_visit, is_popular,
    agent_json, days_json, hotels_json, budget_breakdown_json,
    inclusions_json, exclusions_json, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Seed each itinerary
let successCount = 0;
let errorCount = 0;

for (const it of ALL_ITINERARIES) {
  try {
    const now = new Date().toISOString();
    insertStmt.run(
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
      JSON.stringify(it.exclusions || []),
      now
    );
    successCount++;
    console.log(`   ✅ [${successCount}/${ALL_ITINERARIES.length}] Seeded: ${it.id} — ${it.destination} — "${it.title.substring(0, 60)}..."`);
  } catch (err) {
    errorCount++;
    console.error(`   ❌ Failed to seed ${it.id}: ${err.message}`);
  }
}

// Verify
const count = db.prepare('SELECT COUNT(*) as count FROM itineraries').get().count;
const popularCount = db.prepare('SELECT COUNT(*) as count FROM itineraries WHERE is_popular = 1').get().count;

console.log(`\n═══════════════════════════════════════════════════════════`);
console.log(`🎉 SEED COMPLETE`);
console.log(`   Total itineraries in database: ${count}`);
console.log(`   Popular destinations:          ${popularCount}`);
console.log(`   Successfully seeded:           ${successCount}`);
console.log(`   Errors:                        ${errorCount}`);
console.log(`   Database path:                 ${dbPath}`);
console.log(`═══════════════════════════════════════════════════════════\n`);

db.close();
