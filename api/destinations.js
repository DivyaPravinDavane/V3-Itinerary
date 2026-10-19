import { getPool, setCorsHeaders, parseRequestBody, ensureSchema } from './_db.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pool = getPool();
  await ensureSchema(pool);

  const parsedBody = parseRequestBody(req);
  const action = req.query?.action || '';
  const destId = req.query?.id;

  const cleanUrl = (req.url || '').split('?')[0];
  const isPopular = action === 'popular' || cleanUrl.endsWith('/popular');

  // 1. GET DESTINATIONS
  if (req.method === 'GET') {
    try {
      if (isPopular) {
        const [rows] = await pool.query('SELECT * FROM destinations WHERE is_popular = 1 AND is_active = 1 ORDER BY itinerary_count DESC');
        return res.status(200).json({ success: true, count: rows.length, destinations: rows });
      }

      if (destId) {
        const [rows] = await pool.query('SELECT * FROM destinations WHERE id = ? OR slug = ?', [destId, destId]);
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Destination not found' });
        }
        return res.status(200).json({ success: true, destination: rows[0] });
      }

      const [rows] = await pool.query('SELECT * FROM destinations ORDER BY name ASC');
      return res.status(200).json({ success: true, count: rows.length, destinations: rows });
    } catch (err) {
      console.error('Error fetching destinations:', err);
      return res.status(500).json({ error: 'Failed to fetch destinations', details: err.message });
    }
  }

  // 2. POST /api/destinations (Create)
  if (req.method === 'POST') {
    try {
      const d = parsedBody;
      const id = d.id || `dest_${Date.now()}`;
      const slug = d.slug || (d.name || 'destination').toLowerCase().replace(/[^a-z0-9]+/g, '-');

      await pool.query(`
        INSERT INTO destinations (
          id, name, slug, country, region, tagline, description,
          cover_image, gallery_images_json, best_time_to_visit,
          itinerary_count, starting_price, is_popular, is_active
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          slug = VALUES(slug),
          country = VALUES(country),
          region = VALUES(region),
          tagline = VALUES(tagline),
          description = VALUES(description),
          cover_image = VALUES(cover_image),
          gallery_images_json = VALUES(gallery_images_json),
          best_time_to_visit = VALUES(best_time_to_visit),
          itinerary_count = VALUES(itinerary_count),
          starting_price = VALUES(starting_price),
          is_popular = VALUES(is_popular),
          is_active = VALUES(is_active)
      `, [
        id, d.name, slug, d.country || 'India', d.region || 'Domestic',
        d.tagline || '', d.description || '', d.coverImage || d.cover_image || '',
        JSON.stringify(d.galleryImages || d.gallery_images_json || []),
        d.bestTimeToVisit || d.best_time_to_visit || '',
        d.itineraryCount || d.itinerary_count || 0,
        d.startingPrice || d.starting_price || 99,
        d.isPopular !== undefined ? (d.isPopular ? 1 : 0) : 1,
        d.isActive !== undefined ? (d.isActive ? 1 : 0) : 1
      ]);

      return res.status(201).json({
        success: true,
        message: 'Destination saved to MySQL database',
        destination: { id, slug, ...d }
      });
    } catch (err) {
      console.error('Error creating destination:', err);
      return res.status(500).json({ error: 'Failed to save destination', details: err.message });
    }
  }

  // 3. DELETE /api/destinations/:id
  if (req.method === 'DELETE') {
    try {
      const targetId = destId || parsedBody.id;
      if (!targetId) return res.status(400).json({ error: 'Missing destination ID' });
      await pool.query('DELETE FROM destinations WHERE id = ? OR slug = ?', [targetId, targetId]);
      return res.status(200).json({ success: true, message: 'Destination deleted' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete destination', details: err.message });
    }
  }

  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
