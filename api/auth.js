import { getPool, setCorsHeaders, parseRequestBody, ensureSchema } from './_db.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pool = getPool();
  await ensureSchema(pool);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const b = parseRequestBody(req);
    const { 
      email, fullName, role = 'customer', mobile, whatsapp,
      password, passwordHash, securityPin, isNewRegistration,
      preferredTravelType, preferredBudgetTier,
      agencyName, gstNumber
    } = b;

    if (!email && !gstNumber && !agencyName) {
      return res.status(400).json({ error: 'Email, GST Number, or Agency Name is required' });
    }

    let agentData = null;
    if (role === 'agent') {
      const lookupVal = (email || gstNumber || agencyName || '').trim();
      const [agents] = await pool.query(
        'SELECT * FROM travel_agents WHERE email = ? OR gst_number = ? OR agency_name = ? LIMIT 1',
        [lookupVal, lookupVal, lookupVal]
      );
      if (agents.length > 0) {
        agentData = agents[0];
      }
    }

    const effectiveEmail = (
      email ||
      (agentData ? agentData.email : `${(agencyName || 'agent').toLowerCase().replace(/[^a-z0-9]/g, '')}@agency.v3itinerary.com`)
    ).trim().toLowerCase();

    const effectiveName = fullName || (agentData ? (agentData.founder_name || agentData.agency_name) : agencyName) || 'Travel Partner';
    const effectiveMobile = mobile || (agentData ? agentData.phone : '');
    const effectiveWhatsapp = whatsapp || effectiveMobile || (agentData ? (agentData.whatsapp || agentData.phone) : '');
    const effectivePin = securityPin || (agentData ? agentData.gst_number : '');
    const passwordVal = password || passwordHash || 'Secret@123';
    const userId = agentData ? agentData.id : `usr_${Date.now()}`;

    await pool.query(`
      INSERT INTO users (
        id, full_name, email, mobile, whatsapp, role,
        password_hash, security_pin,
        preferred_travel_type, preferred_budget_tier
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        full_name = VALUES(full_name),
        mobile = VALUES(mobile),
        whatsapp = VALUES(whatsapp),
        role = VALUES(role),
        password_hash = IF(VALUES(password_hash) IS NOT NULL AND VALUES(password_hash) != '', VALUES(password_hash), password_hash),
        security_pin = IF(VALUES(security_pin) IS NOT NULL AND VALUES(security_pin) != '', VALUES(security_pin), security_pin),
        preferred_travel_type = VALUES(preferred_travel_type),
        preferred_budget_tier = VALUES(preferred_budget_tier)
    `, [
      userId,
      effectiveName,
      effectiveEmail,
      effectiveMobile,
      effectiveWhatsapp,
      role,
      passwordVal,
      effectivePin,
      preferredTravelType || 'Couple',
      preferredBudgetTier || 'Comfort'
    ]);

    const [userRows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [effectiveEmail]);
    const user = userRows[0] || {
      id: userId,
      fullName: effectiveName,
      email: effectiveEmail,
      mobile: effectiveMobile,
      role
    };

    return res.status(200).json({
      success: true,
      message: 'User authenticated and synchronized with MySQL (phpMyAdmin)',
      user,
      agent: agentData
    });
  } catch (err) {
    console.error('Error in auth:', err);
    return res.status(500).json({ error: 'Authentication failed', details: err.message });
  }
}
