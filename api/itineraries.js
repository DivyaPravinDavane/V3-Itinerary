import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'srv1947.hstgr.io',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'u762329739_v3',
  password: process.env.DB_PASSWORD || 'Shah$@789',
  database: process.env.DB_NAME || 'u762329739_v3db',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  timezone: '+00:00'
};

let pool = null;
function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const p = getPool();

  if (req.method === 'GET') {
    try {
      const [rows] = await p.query('SELECT * FROM itineraries ORDER BY created_at DESC');
      const itineraries = rows.map(r => {
        try {
          return {
            ...r,
            durationDays: r.duration_days,
            durationNights: r.duration_nights,
            travelerType: r.traveler_type,
            itineraryCountLabel: r.itinerary_count_label,
            accessPrice: Number(r.access_price),
            gstAmount: Number(r.gst_amount),
            totalAccessPrice: Number(r.total_access_price),
            estimatedTripCost: Number(r.estimated_trip_cost),
            rating: Number(r.rating),
            reviewCount: r.review_count,
            coverImage: r.cover_image,
            galleryImages: typeof r.gallery_images_json === 'string' ? JSON.parse(r.gallery_images_json) : (r.gallery_images_json || []),
            bestTimeToVisit: r.best_time_to_visit,
            isPopular: Boolean(r.is_popular),
            agent: typeof r.agent_json === 'string' ? JSON.parse(r.agent_json) : (r.agent_json || {}),
            days: typeof r.days_json === 'string' ? JSON.parse(r.days_json) : (r.days_json || []),
            hotels: typeof r.hotels_json === 'string' ? JSON.parse(r.hotels_json) : (r.hotels_json || []),
            budgetBreakdown: typeof r.budget_breakdown_json === 'string' ? JSON.parse(r.budget_breakdown_json) : (r.budget_breakdown_json || {}),
            inclusions: typeof r.inclusions_json === 'string' ? JSON.parse(r.inclusions_json) : (r.inclusions_json || []),
            exclusions: typeof r.exclusions_json === 'string' ? JSON.parse(r.exclusions_json) : (r.exclusions_json || [])
          };
        } catch (e) {
          return r;
        }
      });
      return res.status(200).json({ success: true, count: itineraries.length, itineraries });
    } catch (err) {
      console.error('Error fetching itineraries from MySQL:', err);
      return res.status(500).json({ error: 'Failed to fetch itineraries', details: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const it = req.body || {};
      const itinId = it.id || `itin_${Date.now()}`;
      const slug = it.slug || (it.title || 'itinerary').toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const agentObj = it.agent || {};
      const agencyName = agentObj.agencyName || agentObj.agency_name || 'Verified Partner Agency';
      const founderName = agentObj.founderName || agentObj.founder_name || 'Agency Principal';
      const agentGst = agentObj.gstNumber || agentObj.gst_number || 'GSTIN27AAAAA0000A1Z5';
      const agentPhone = agentObj.phone || '';
      const agentEmail = agentObj.email || '';
      const agentLoc = agentObj.location || '';
      const locParts = agentLoc ? agentLoc.split(',') : [];
      const agentCity = locParts[0]?.trim() || '';
      const agentState = locParts[1]?.trim() || '';

      // 1. Insert into itineraries table
      await p.query(`
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
          slug = VALUES(slug),
          destination = VALUES(destination),
          country = VALUES(country),
          region = VALUES(region),
          duration_days = VALUES(duration_days),
          duration_nights = VALUES(duration_nights),
          traveler_type = VALUES(traveler_type),
          access_price = VALUES(access_price),
          gst_amount = VALUES(gst_amount),
          total_access_price = VALUES(total_access_price),
          estimated_trip_cost = VALUES(estimated_trip_cost),
          cover_image = VALUES(cover_image),
          overview = VALUES(overview),
          best_time_to_visit = VALUES(best_time_to_visit),
          agent_json = VALUES(agent_json),
          days_json = VALUES(days_json),
          hotels_json = VALUES(hotels_json),
          budget_breakdown_json = VALUES(budget_breakdown_json),
          inclusions_json = VALUES(inclusions_json),
          exclusions_json = VALUES(exclusions_json);
      `, [
        itinId, slug, it.destination || 'Destination', it.country || 'India', it.region || 'Domestic', it.title || 'Itinerary',
        it.durationDays || 5, it.durationNights || 4, it.travelerType || 'Family', it.itineraryCountLabel || '',
        it.accessPrice || 99, it.gstAmount || 0, it.totalAccessPrice || 99, it.estimatedTripCost || 55000,
        it.rating || 4.95, it.reviewCount || 18, it.coverImage || '',
        JSON.stringify(it.galleryImages || []),
        it.overview || '', it.bestTimeToVisit || 'Oct - Apr', it.isPopular ? 1 : 0,
        JSON.stringify(agentObj),
        JSON.stringify(it.days || []),
        JSON.stringify(it.hotels || []),
        JSON.stringify(it.budgetBreakdown || {}),
        JSON.stringify(it.inclusions || []),
        JSON.stringify(it.exclusions || [])
      ]);

      // 2. Insert into created_itineraries_by_travel_agents table for phpMyAdmin
      await p.query(`
        INSERT INTO created_itineraries_by_travel_agents (
          id, title, destination, country, region,
          duration_days, duration_nights, traveler_type,
          total_access_price, estimated_trip_cost,
          agency_name, founder_name, agent_gst, agent_phone, agent_email, agent_city, agent_state,
          cover_image, overview, best_time_to_visit,
          inclusions_json, exclusions_json, days_json, hotels_json, budget_breakdown_json,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED')
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          destination = VALUES(destination),
          country = VALUES(country),
          region = VALUES(region),
          duration_days = VALUES(duration_days),
          duration_nights = VALUES(duration_nights),
          traveler_type = VALUES(traveler_type),
          total_access_price = VALUES(total_access_price),
          estimated_trip_cost = VALUES(estimated_trip_cost),
          agency_name = VALUES(agency_name),
          founder_name = VALUES(founder_name),
          agent_gst = VALUES(agent_gst),
          agent_phone = VALUES(agent_phone),
          agent_email = VALUES(agent_email),
          agent_city = VALUES(agent_city),
          agent_state = VALUES(agent_state),
          cover_image = VALUES(cover_image),
          overview = VALUES(overview),
          best_time_to_visit = VALUES(best_time_to_visit),
          inclusions_json = VALUES(inclusions_json),
          exclusions_json = VALUES(exclusions_json),
          days_json = VALUES(days_json),
          hotels_json = VALUES(hotels_json),
          budget_breakdown_json = VALUES(budget_breakdown_json),
          status = 'PUBLISHED';
      `, [
        itinId, it.title, it.destination || 'Destination', it.country || 'India', it.region || 'Domestic',
        it.durationDays || 5, it.durationNights || 4, it.travelerType || 'Family',
        it.totalAccessPrice || 99, it.estimatedTripCost || 55000,
        agencyName, founderName, agentGst, agentPhone, agentEmail, agentCity, agentState,
        it.coverImage || '', it.overview || '', it.bestTimeToVisit || 'Oct - Apr',
        typeof it.inclusions === 'string' ? it.inclusions : JSON.stringify(it.inclusions || []),
        typeof it.exclusions === 'string' ? it.exclusions : JSON.stringify(it.exclusions || []),
        typeof it.days === 'string' ? it.days : JSON.stringify(it.days || []),
        typeof it.hotels === 'string' ? it.hotels : JSON.stringify(it.hotels || []),
        typeof it.budgetBreakdown === 'string' ? it.budgetBreakdown : JSON.stringify(it.budgetBreakdown || {})
      ]);

      return res.status(201).json({
        success: true,
        message: 'Itinerary saved & updated in created_itineraries_by_travel_agents (phpMyAdmin)',
        itinerary: { ...it, id: itinId, slug }
      });
    } catch (err) {
      console.error('Error saving itinerary to MySQL:', err);
      return res.status(500).json({ error: 'Failed to save itinerary', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
