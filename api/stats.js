import { getPool, setCorsHeaders, ensureSchema } from './_db.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pool = getPool();
  await ensureSchema(pool);

  const cleanUrl = (req.url || '').split('?')[0];
  const isActivities = req.query?.action === 'activities' || cleanUrl.endsWith('/activities');

  try {
    if (isActivities) {
      const [orders] = await pool.query(
        'SELECT order_id, itinerary_title, customer_name, customer_email, amount_paid, destination, created_at, status FROM orders ORDER BY created_at DESC LIMIT 20'
      );
      const activities = orders.map(o => ({
        id: o.order_id,
        action: 'ORDER_PLACED',
        description: `Order placed for ${o.destination} (₹${o.amount_paid}) by ${o.customer_name || o.customer_email}`,
        timestamp: o.created_at,
        meta: o
      }));
      return res.status(200).json({ success: true, count: activities.length, activities });
    }

    // Default: stats
    const [[{ totalOrders = 0 } = {}]] = await pool.query("SELECT COUNT(*) as totalOrders FROM orders WHERE status IN ('PAID', 'CONFIRMED')");
    const [[{ totalRevenue = 0 } = {}]] = await pool.query("SELECT COALESCE(SUM(amount_paid), 0) as totalRevenue FROM orders WHERE status IN ('PAID', 'CONFIRMED')");
    const [[{ verifiedAgents = 0 } = {}]] = await pool.query("SELECT COUNT(*) as verifiedAgents FROM travel_agents WHERE status = 'VERIFIED'");
    const [[{ registeredUsers = 0 } = {}]] = await pool.query("SELECT COUNT(*) as registeredUsers FROM users");
    const [recentOrders] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 10");

    return res.status(200).json({
      success: true,
      totalOrders: Number(totalOrders),
      totalRevenue: Number(totalRevenue),
      verifiedAgents: Number(verifiedAgents),
      registeredUsers: Number(registeredUsers),
      recentOrders,
      databaseEngine: 'MySQL (Hostinger)',
      dbPath: 'srv1947.hstgr.io / u762329739_v3db',
      isMysqlConnected: true,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    return res.status(500).json({ error: 'Failed to fetch stats', details: err.message });
  }
}
