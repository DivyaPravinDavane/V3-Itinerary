import { getPool, setCorsHeaders, parseRequestBody, ensureSchema } from './_db.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pool = getPool();
  await ensureSchema(pool);

  // 1. GET /api/wishlist?email=...
  if (req.method === 'GET') {
    try {
      const email = req.query?.email;
      if (!email) return res.status(200).json({ success: true, savedIds: [] });

      const [rows] = await pool.query(
        'SELECT itinerary_id FROM saved_itineraries WHERE user_email = ?',
        [email]
      );
      const savedIds = rows.map(r => r.itinerary_id);
      return res.status(200).json({ success: true, savedIds });
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      return res.status(500).json({ error: 'Failed to fetch wishlist', details: err.message });
    }
  }

  // 2. POST /api/wishlist/toggle
  if (req.method === 'POST') {
    try {
      const { userEmail, itineraryId } = parseRequestBody(req);
      if (!userEmail || !itineraryId) {
        return res.status(400).json({ error: 'userEmail and itineraryId are required' });
      }

      const [existing] = await pool.query(
        'SELECT id FROM saved_itineraries WHERE user_email = ? AND itinerary_id = ?',
        [userEmail, itineraryId]
      );

      let saved = false;
      if (existing.length > 0) {
        await pool.query(
          'DELETE FROM saved_itineraries WHERE user_email = ? AND itinerary_id = ?',
          [userEmail, itineraryId]
        );
        saved = false;
      } else {
        await pool.query(
          'INSERT INTO saved_itineraries (user_email, itinerary_id) VALUES (?, ?)',
          [userEmail, itineraryId]
        );
        saved = true;
      }

      return res.status(200).json({
        success: true,
        saved,
        itineraryId,
        message: saved ? 'Saved to wishlist (phpMyAdmin)' : 'Removed from wishlist (phpMyAdmin)'
      });
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      return res.status(500).json({ error: 'Failed to update wishlist', details: err.message });
    }
  }

  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
