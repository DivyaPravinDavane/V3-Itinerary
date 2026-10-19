import { getPool, setCorsHeaders, ensureSchema } from './_db.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const pool = getPool();
    await ensureSchema(pool);
    const [rows] = await pool.query('SELECT 1 as is_alive');
    return res.status(200).json({
      status: 'online',
      server: 'V3Itinerary Vercel Serverless API',
      database: {
        isMysqlConnected: true,
        databaseEngine: 'MySQL (Hostinger)',
        database: process.env.DB_NAME || 'u762329739_v3db',
        host: process.env.DB_HOST || 'srv1947.hstgr.io',
        port: 3306,
        status: 'Connected'
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({
      status: 'degraded',
      server: 'V3Itinerary Vercel Serverless API',
      database: {
        isMysqlConnected: false,
        error: err.message
      },
      timestamp: new Date().toISOString()
    });
  }
}
