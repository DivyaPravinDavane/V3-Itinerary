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
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const p = getPool();

  // Extract ID from query, body, or URL path
  let targetId = req.query?.id;
  if (!targetId && req.body) {
    try {
      const parsedBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (parsedBody && parsedBody.id) {
        targetId = parsedBody.id;
      }
    } catch (e) {}
  }
  if (!targetId && req.url) {
    const cleanUrl = req.url.split('?')[0];
    const parts = cleanUrl.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];
    if (lastPart && lastPart !== 'agent-created-itineraries' && lastPart !== 'agent-created-itineraries.js') {
      targetId = decodeURIComponent(lastPart);
    }
  }

  // 1. GET AGENT ITINERARIES
  if (req.method === 'GET') {
    try {
      if (targetId) {
        const [rows] = await p.query('SELECT * FROM created_itineraries_by_travel_agents WHERE id = ?', [targetId]);
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Itinerary not found' });
        }
        return res.status(200).json({ success: true, itinerary: rows[0] });
      }

      const { email, gst } = req.query;
      let query = 'SELECT * FROM created_itineraries_by_travel_agents';
      const params = [];
      if (email || gst) {
        query += ' WHERE LOWER(agent_email) = LOWER(?) OR LOWER(agent_gst) = LOWER(?)';
        params.push(email || gst, email || gst);
      }
      query += ' ORDER BY created_at DESC';
      const [rows] = await p.query(query, params);
      return res.status(200).json({ success: true, count: rows.length, itineraries: rows });
    } catch (err) {
      console.error('Error fetching created_itineraries_by_travel_agents:', err);
      return res.status(500).json({ error: 'Failed to fetch itineraries', details: err.message });
    }
  }

  // 2. POST (CREATE ITINERARY)
  if (req.method === 'POST') {
    try {
      const it = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const itinId = targetId || it.id || `itin_${Date.now()}`;
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

      // 1. Insert into created_itineraries_by_travel_agents
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

      // 2. Also insert into itineraries
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
        typeof it.days === 'string' ? it.days : JSON.stringify(it.days || []),
        typeof it.hotels === 'string' ? it.hotels : JSON.stringify(it.hotels || []),
        typeof it.budgetBreakdown === 'string' ? it.budgetBreakdown : JSON.stringify(it.budgetBreakdown || {}),
        typeof it.inclusions === 'string' ? it.inclusions : JSON.stringify(it.inclusions || []),
        typeof it.exclusions === 'string' ? it.exclusions : JSON.stringify(it.exclusions || [])
      ]);

      return res.status(201).json({
        success: true,
        message: 'Itinerary saved to created_itineraries_by_travel_agents in phpMyAdmin',
        itinerary: { ...it, id: itinId, slug }
      });
    } catch (err) {
      console.error('Error in agent-created-itineraries API:', err);
      return res.status(500).json({ error: 'Failed to save itinerary', details: err.message });
    }
  }

  // 3. PUT (UPDATE ITINERARY IN BOTH TABLES IN PHPMYADMIN)
  if (req.method === 'PUT') {
    try {
      const it = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const itinId = targetId || it.id;
      if (!itinId) {
        return res.status(400).json({ error: 'Missing itinerary ID for update' });
      }

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

      // 1. Update created_itineraries_by_travel_agents
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

      // 2. Update itineraries table
      await p.query(`
        UPDATE itineraries SET
          title = ?, destination = ?, country = ?, region = ?,
          duration_days = ?, duration_nights = ?, traveler_type = ?,
          access_price = ?, gst_amount = ?, total_access_price = ?, estimated_trip_cost = ?,
          cover_image = ?, overview = ?, best_time_to_visit = ?,
          agent_json = ?, days_json = ?, hotels_json = ?, budget_breakdown_json = ?,
          inclusions_json = ?, exclusions_json = ?
        WHERE id = ? OR TRIM(id) = ?
      `, [
        it.title, it.destination || 'Destination', it.country || 'India', it.region || 'Domestic',
        it.durationDays || 5, it.durationNights || 4, it.travelerType || 'Family',
        it.accessPrice || 99, it.gstAmount || 0, it.totalAccessPrice || 99, it.estimatedTripCost || 55000,
        it.coverImage || '', it.overview || '', it.bestTimeToVisit || 'Oct - Apr',
        JSON.stringify(agentObj),
        typeof it.days === 'string' ? it.days : JSON.stringify(it.days || []),
        typeof it.hotels === 'string' ? it.hotels : JSON.stringify(it.hotels || []),
        typeof it.budgetBreakdown === 'string' ? it.budgetBreakdown : JSON.stringify(it.budgetBreakdown || {}),
        typeof it.inclusions === 'string' ? it.inclusions : JSON.stringify(it.inclusions || []),
        typeof it.exclusions === 'string' ? it.exclusions : JSON.stringify(it.exclusions || []),
        itinId, itinId
      ]);

      return res.status(200).json({
        success: true,
        message: 'Itinerary updated in created_itineraries_by_travel_agents & itineraries (phpMyAdmin)',
        itinerary: { ...it, id: itinId }
      });
    } catch (err) {
      console.error('Error updating itinerary in MySQL:', err);
      return res.status(500).json({ error: 'Failed to update itinerary', details: err.message });
    }
  }

  // 4. DELETE (REMOVE FROM BOTH TABLES IN PHPMYADMIN)
  if (req.method === 'DELETE') {
    try {
      const it = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const itinId = targetId || it.id || req.query?.id;
      if (!itinId) {
        return res.status(400).json({ error: 'Missing itinerary ID for deletion' });
      }

      const cleanId = String(itinId).trim();
      // 1. Delete from created_itineraries_by_travel_agents
      await p.query('DELETE FROM created_itineraries_by_travel_agents WHERE id = ? OR TRIM(id) = ?', [cleanId, cleanId]);

      // 2. Delete from itineraries table
      await p.query('DELETE FROM itineraries WHERE id = ? OR TRIM(id) = ?', [cleanId, cleanId]);

      // 3. Clean up customer wishlists if any
      await p.query('DELETE FROM saved_itineraries WHERE itinerary_id = ? OR TRIM(itinerary_id) = ?', [cleanId, cleanId]).catch(() => {});

      return res.status(200).json({
        success: true,
        message: 'Itinerary deleted from created_itineraries_by_travel_agents and itineraries (phpMyAdmin)',
        id: cleanId
      });
    } catch (err) {
      console.error('Error deleting itinerary from MySQL:', err);
      return res.status(500).json({ error: 'Failed to delete itinerary', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
