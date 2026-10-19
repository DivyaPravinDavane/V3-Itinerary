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
  const agentId = req.query?.id;

  const cleanUrl = (req.url || '').split('?')[0];
  const isRegister = action === 'register' || cleanUrl.endsWith('/register');
  const isProfile = action === 'profile' || cleanUrl.includes('/profile');
  const isStatus = action === 'status' || cleanUrl.includes('/status');

  // 1. GET AGENT PROFILE OR ALL AGENTS
  if (req.method === 'GET') {
    try {
      if (isProfile || req.query?.email || req.query?.gst) {
        const emailOrGst = (req.query?.email || req.query?.gst || '').trim();
        if (!emailOrGst) {
          return res.status(400).json({ error: 'Email or GST is required' });
        }
        const [rows] = await pool.query(
          'SELECT * FROM travel_agents WHERE email = ? OR gst_number = ? LIMIT 1',
          [emailOrGst, emailOrGst]
        );
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Agent profile not found' });
        }
        return res.status(200).json({ success: true, agent: rows[0] });
      }

      if (agentId) {
        const [rows] = await pool.query('SELECT * FROM travel_agents WHERE id = ?', [agentId]);
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Agent not found' });
        }
        return res.status(200).json({ success: true, agent: rows[0] });
      }

      const [rows] = await pool.query('SELECT * FROM travel_agents ORDER BY created_at DESC');
      return res.status(200).json({ success: true, count: rows.length, agents: rows });
    } catch (err) {
      console.error('Error fetching agents:', err);
      return res.status(500).json({ error: 'Failed to fetch agents', details: err.message });
    }
  }

  // 2. POST AGENT REGISTRATION
  if (req.method === 'POST') {
    try {
      const b = parsedBody;
      const id = b.id || `ag-${Date.now().toString(36)}`;
      const agencyName = b.agencyName || b.agency_name || 'Partner Agency';
      const founderName = b.founderName || b.founder_name || b.contactPerson || agencyName;
      const gstNumber = b.gstNumber || b.gstin || b.gst_number || `V3G-${Date.now().toString().slice(-6)}`;
      const phone = b.phone || b.mobile || '';
      const email = (b.email || '').trim().toLowerCase();
      const whatsapp = b.whatsapp || phone;
      const city = b.city || 'Mumbai';
      const state = b.state || 'Maharashtra';
      const experienceYears = String(b.experienceYears || b.experience_years || '');
      const businessType = b.businessType || b.business_type || 'Both';
      const specialisations = Array.isArray(b.specialisations)
        ? JSON.stringify(b.specialisations)
        : (b.specialisations || '[]');
      const aboutAgency = b.aboutAgency || b.about_agency || '';
      const destinationsSold = b.destinationsSold || b.destinations_sold || '';
      const plannedUploads = b.plannedUploads || b.planned_uploads || '25 - 50';
      const proofName = b.businessProofDoc?.name || b.businessProofName || b.business_proof_name || '';
      const proofUrl = b.businessProofDoc?.url || b.businessProofUrl || b.business_proof_url || '';
      const proofSize = b.businessProofDoc?.size || b.businessProofSize || b.business_proof_size || 0;
      const logoName = b.logoDoc?.name || b.logoName || b.logo_name || '';
      const logoUrl = b.logoDoc?.url || b.logoUrl || b.logo_url || '';
      const socialLink = b.socialLink || b.social_link || '';

      await pool.query(`
        INSERT INTO travel_agents (
          id, agency_name, founder_name, gst_number, phone, email, whatsapp,
          city, state, experience_years, business_type, specialisations,
          about_agency, destinations_sold, planned_uploads,
          business_proof_name, business_proof_url, business_proof_size,
          logo_name, logo_url, social_link, status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'VERIFIED')
        ON DUPLICATE KEY UPDATE
          agency_name = VALUES(agency_name),
          founder_name = VALUES(founder_name),
          phone = VALUES(phone),
          whatsapp = VALUES(whatsapp),
          city = VALUES(city),
          state = VALUES(state),
          experience_years = VALUES(experience_years),
          business_type = VALUES(business_type),
          specialisations = VALUES(specialisations),
          about_agency = VALUES(about_agency),
          destinations_sold = VALUES(destinations_sold),
          planned_uploads = VALUES(planned_uploads),
          business_proof_name = VALUES(business_proof_name),
          business_proof_url = VALUES(business_proof_url),
          business_proof_size = VALUES(business_proof_size),
          logo_name = VALUES(logo_name),
          logo_url = VALUES(logo_url),
          social_link = VALUES(social_link),
          status = 'VERIFIED'
      `, [
        id, agencyName, founderName, gstNumber, phone, email, whatsapp,
        city, state, experienceYears, businessType, specialisations,
        aboutAgency, destinationsSold, plannedUploads,
        proofName, proofUrl, proofSize,
        logoName, logoUrl, socialLink
      ]);

      // Also upsert agent into users table so they can authenticate
      if (email) {
        try {
          await pool.query(`
            INSERT INTO users (id, full_name, email, mobile, whatsapp, role, security_pin)
            VALUES (?, ?, ?, ?, ?, 'agent', ?)
            ON DUPLICATE KEY UPDATE
              full_name = VALUES(full_name),
              mobile = VALUES(mobile),
              whatsapp = VALUES(whatsapp),
              role = 'agent',
              security_pin = VALUES(security_pin)
          `, [id, founderName, email, phone, whatsapp, gstNumber]);
        } catch (uErr) {}
      }

      return res.status(201).json({
        success: true,
        message: 'Agent registered and saved in MySQL travel_agents (phpMyAdmin)',
        agent: { id, agencyName, founderName, email, phone, gstNumber }
      });
    } catch (err) {
      console.error('Error registering agent:', err);
      return res.status(500).json({ error: 'Agent registration failed', details: err.message });
    }
  }

  // 3. PUT /api/agents/:id/status
  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const targetId = agentId || parsedBody.id;
      const status = parsedBody.status || 'VERIFIED';
      if (!targetId) {
        return res.status(400).json({ error: 'Missing agent ID' });
      }

      await pool.query('UPDATE travel_agents SET status = ? WHERE id = ?', [status, targetId]);
      return res.status(200).json({ success: true, message: `Agent status updated to ${status}` });
    } catch (err) {
      console.error('Error updating agent status:', err);
      return res.status(500).json({ error: 'Failed to update agent status', details: err.message });
    }
  }

  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
