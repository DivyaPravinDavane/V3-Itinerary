import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initDatabase,
  insertOrder,
  initiateOrder,
  updateOrderStatus,
  getOrders,
  getOrderById,
  getPayments,
  updateOrderEmailStatus,
  upsertUser,
  saveAgent,
  getAgents,
  updateAgentStatus,
  getAgentByEmailOrGst,
  toggleWishlist,
  getWishlist,
  getRecentActivities,
  getRealtimeStats,
  getDbStatus,
  getAllItineraries,
  getItineraryById,
  getPopularDestinations,
  getItineraryCount,
  insertItinerary,
  getCreatedItinerariesByTravelAgents,
  updateItineraryPopular,
  deleteItinerary,
  getAllDestinations,
  getDestinationById,
  saveDestination,
  deleteDestination,
  logActivity,
  getMysqlPool
} from './db.js';
import { sendItineraryPdfEmail } from './emailService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

// SSE (Server-Sent Events) real-time clients
const realtimeClients = new Set();

/**
 * Broadcast a real-time event to all SSE-connected clients
 */
function broadcastRealtimeEvent(eventType, payload) {
  const message = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of realtimeClients) {
    try { client.write(message); } catch { realtimeClients.delete(client); }
  }
}

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use('/uploads', express.static(uploadsDir));

// ─── 1. Health Check ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    server: 'V3Itinerary MySQL Real-Time API',
    database: getDbStatus(),
    realtimeClients: realtimeClients.size,
    timestamp: new Date().toISOString()
  });
});

// ─── 2. Real-Time SSE Stream ──────────────────────────────────────────────────
app.get('/api/realtime/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  try {
    const stats = await getRealtimeStats();
    res.write(`event: connected\ndata: ${JSON.stringify({ message: 'MySQL Real-Time Connected', stats })}\n\n`);
  } catch {
    res.write(`event: connected\ndata: ${JSON.stringify({ message: 'MySQL Real-Time Connected' })}\n\n`);
  }

  realtimeClients.add(res);

  const heartbeat = setInterval(() => {
    try { res.write(': heartbeat\n\n'); }
    catch { clearInterval(heartbeat); realtimeClients.delete(res); }
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    realtimeClients.delete(res);
  });
});

// ─── 3. Real-Time Stats ───────────────────────────────────────────────────────
app.get('/api/realtime/stats', async (req, res) => {
  try {
    const stats = await getRealtimeStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
  }
});

// ─── 4. Activity Feed ─────────────────────────────────────────────────────────
app.get('/api/realtime/activities', async (req, res) => {
  try {
    const activities = await getRecentActivities(30);
    res.json({ success: true, activities });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities', details: error.message });
  }
});

// ─── 5. Create Order (MySQL Insert + SSE Broadcast) ───────────────────────────
app.post('/api/orders', async (req, res) => {
  try {
    const {
      orderId, itineraryId, itineraryTitle, destination,
      customerName, customerEmail, customerMobile, customerAddress,
      amountPaid = 99.00, paymentMethod = 'UPI / Razorpay Gateway',
      razorpayPaymentId, razorpayOrderId,
      agentName, agentPhone, agentEmail, agentWhatsapp
    } = req.body;

    if (!orderId || !itineraryId || !razorpayPaymentId) {
      return res.status(400).json({ error: 'Missing required fields: orderId, itineraryId, razorpayPaymentId' });
    }

    const savedOrder = await insertOrder({
      orderId, itineraryId,
      itineraryTitle: itineraryTitle || 'Complete Travel Blueprint',
      destination: destination || 'Travel Destination',
      customerName: customerName || 'Valued Traveler',
      customerEmail: customerEmail || '',
      customerMobile: customerMobile || '',
      customerAddress: customerAddress || '',
      amountPaid, paymentMethod,
      razorpayPaymentId,
      razorpayOrderId: razorpayOrderId || orderId,
      agentName: agentName || 'Verified Agent',
      agentPhone: agentPhone || '',
      agentEmail: agentEmail || '',
      agentWhatsapp: agentWhatsapp || ''
    });

    if (customerEmail) {
      try {
        await upsertUser({
          id: `usr_${Date.now()}`,
          email: customerEmail,
          fullName: customerName || 'Valued Traveler',
          mobile: customerMobile || '',
          address: customerAddress || '',
          role: 'customer'
        });
      } catch (userErr) {
        console.warn('Auto-upsert user notice:', userErr.message);
      }
    }

    const stats = await getRealtimeStats();
    await logActivity('ORDER_CREATED', `Order ${orderId} placed by ${customerName || customerEmail} for ${itineraryTitle || 'Blueprint'} (₹${amountPaid})`, {
      orderId, itineraryId, customerEmail, amountPaid, razorpayPaymentId
    });
    broadcastRealtimeEvent('order_created', { order: savedOrder, stats });

    console.log(`💳 [MySQL] Order ${orderId} — ₹${amountPaid} — ${customerEmail} — Razorpay: ${razorpayPaymentId}`);

    res.status(201).json({
      success: true,
      message: 'Order saved to MySQL database',
      order: savedOrder
    });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Failed to save order', details: error.message });
  }
});

// ─── 5a. Initiate Order (Payment Started -> Recorded as INITIATED) ───────────
app.post('/api/orders/initiate', async (req, res) => {
  try {
    const {
      orderId, itineraryId, itineraryTitle, destination,
      customerName, customerEmail, customerMobile, customerAddress,
      amountPaid = 99.00,
      agentName, agentPhone, agentEmail, agentWhatsapp
    } = req.body;

    if (!orderId || !itineraryId) {
      return res.status(400).json({ error: 'Missing required fields: orderId, itineraryId' });
    }

    const initiatedOrder = await initiateOrder({
      orderId, itineraryId,
      itineraryTitle: itineraryTitle || 'Complete Travel Blueprint',
      destination: destination || 'Travel Destination',
      customerName: customerName || 'Valued Traveler',
      customerEmail: customerEmail || '',
      customerMobile: customerMobile || '',
      customerAddress: customerAddress || '',
      amountPaid,
      agentName: agentName || 'Verified Agent',
      agentPhone: agentPhone || '',
      agentEmail: agentEmail || '',
      agentWhatsapp: agentWhatsapp || ''
    });

    if (customerEmail) {
      try {
        await upsertUser({
          id: `usr_${Date.now()}`,
          email: customerEmail,
          fullName: customerName || 'Valued Traveler',
          mobile: customerMobile || '',
          address: customerAddress || '',
          role: 'customer'
        });
      } catch (userErr) {
        console.warn('Auto-upsert user on initiate notice:', userErr.message);
      }
    }

    const stats = await getRealtimeStats();
    broadcastRealtimeEvent('order_initiated', { order: initiatedOrder, stats });

    console.log(`🟡 [MySQL] Order ${orderId} INITIATED — ₹${amountPaid} — ${customerEmail}`);

    res.status(201).json({
      success: true,
      message: 'Order initiated and recorded in MySQL as INITIATED',
      order: initiatedOrder
    });
  } catch (error) {
    console.error('Error initiating order:', error);
    res.status(500).json({ error: 'Failed to initiate order', details: error.message });
  }
});

// ─── 5b. Update Order Status (CANCELLED, FAILED, PAID) ────────────────────────
app.post('/api/orders/update-status', async (req, res) => {
  try {
    const { orderId, status, razorpayPaymentId, reason } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({ error: 'Missing orderId or status' });
    }

    const updatedOrder = await updateOrderStatus(orderId, status, { razorpayPaymentId, reason });
    const stats = await getRealtimeStats();
    broadcastRealtimeEvent('order_status_updated', { order: updatedOrder, stats });

    console.log(`⚡ [MySQL] Order ${orderId} status → ${status} ${reason ? `(${reason})` : ''}`);

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status', details: error.message });
  }
});

// ─── 6. Get Orders ────────────────────────────────────────────────────────────
app.get('/api/orders', async (req, res) => {
  try {
    const { email, agentEmail, agentName } = req.query;
    let orders = await getOrders(email || null);
    if (agentEmail) {
      orders = orders.filter(o => 
        (o.agent_email && o.agent_email.toLowerCase().trim() === String(agentEmail).toLowerCase().trim())
      );
    }
    if (agentName) {
      orders = orders.filter(o => 
        (o.agent_name && o.agent_name.toLowerCase().includes(String(agentName).toLowerCase().trim()))
      );
    }
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

// ─── 7. Get Order by ID ───────────────────────────────────────────────────────
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const order = await getOrderById(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order', details: error.message });
  }
});

// ─── 7B. Get Payments (Initiated, Confirmed, Paid, Failed, Cancelled) ──────────
app.get('/api/payments', async (req, res) => {
  try {
    const { email } = req.query;
    const payments = await getPayments(email || null);
    res.json({ success: true, count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments', details: error.message });
  }
});

// ─── 8. Auth / User Sync ─────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { 
      email, fullName, role = 'customer', mobile, whatsapp,
      password, passwordHash, securityPin, isNewRegistration,
      preferredTravelType, preferredBudgetTier,
      agencyName, gstNumber
    } = req.body;

    if (!email && !gstNumber) return res.status(400).json({ error: 'Email or GST is required' });

    let agentData = null;
    if (role === 'agent') {
      agentData = await getAgentByEmailOrGst(email || gstNumber || agencyName);
    }

    const effectiveEmail = (email || (agentData ? agentData.email : `${(agencyName || 'agent').toLowerCase().replace(/[^a-z0-9]/g, '')}@agency.v3itinerary.com`)).trim().toLowerCase();
    const effectiveName = fullName || (agentData ? (agentData.agency_name || agentData.founder_name) : agencyName) || 'Travel Partner';

    const user = await upsertUser({
      id: agentData ? agentData.id : `usr_${Date.now()}`,
      email: effectiveEmail,
      fullName: effectiveName,
      mobile: mobile || (agentData ? agentData.phone : ''),
      whatsapp: whatsapp || mobile || (agentData ? (agentData.whatsapp || agentData.phone) : ''),
      password: password || passwordHash || '',
      securityPin: securityPin || (agentData ? agentData.gst_number : ''),
      isNewRegistration: Boolean(isNewRegistration),
      role,
      preferredTravelType: preferredTravelType || 'Couple',
      preferredBudgetTier: preferredBudgetTier || 'Comfort'
    });

    const actionName = role === 'agent' ? 'AGENT_LOGIN' : (role === 'admin' ? 'ADMIN_LOGIN' : 'LOGIN');
    broadcastRealtimeEvent('user_activity', { action: actionName, user, agent: agentData });
    res.json({ success: true, user, agent: agentData });
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

// ─── 8B. Travel Agent Profile API ───────────────────────────────────────────
app.get('/api/agent/profile', async (req, res) => {
  try {
    const { email, gst } = req.query;
    if (!email && !gst) return res.status(400).json({ error: 'Email or GST is required' });
    const agent = await getAgentByEmailOrGst(email || gst);
    if (!agent) return res.status(404).json({ error: 'Agent profile not found' });
    res.json({ success: true, agent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent profile', details: error.message });
  }
});

// ─── 9. Wishlist ──────────────────────────────────────────────────────────────
app.post('/api/wishlist/toggle', async (req, res) => {
  try {
    const { userEmail, itineraryId } = req.body;
    if (!userEmail || !itineraryId) {
      return res.status(400).json({ error: 'userEmail and itineraryId required' });
    }
    const result = await toggleWishlist(userEmail, itineraryId);
    broadcastRealtimeEvent('wishlist_updated', { userEmail, ...result });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update wishlist', details: error.message });
  }
});

app.get('/api/wishlist', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.json({ success: true, savedIds: [] });
    const savedIds = await getWishlist(email);
    res.json({ success: true, savedIds });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist', details: error.message });
  }
});

// ─── 9b. Document & Media Upload ─────────────────────────────────────────────
app.post(['/api/upload-document', '/api/upload-image'], async (req, res) => {
  try {
    const { fileName, fileBase64, mimeType } = req.body;
    if (!fileBase64 || !fileName) {
      return res.status(400).json({ error: 'File base64 data and file name are required' });
    }
    const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, safeName);
    fs.writeFileSync(filePath, buffer);
    const fileUrl = `/uploads/${safeName}`;
    const host = req.get('host');
    const protocol = req.protocol || 'http';
    const fullUrl = host ? `${protocol}://${host}${fileUrl}` : fileUrl;
    res.json({
      success: true,
      url: fileUrl,
      fullUrl: fullUrl,
      fileName: safeName,
      originalName: fileName,
      size: buffer.length,
      mimeType: mimeType || 'application/octet-stream'
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

// ─── 10. Travel Agents ────────────────────────────────────────────────────────
app.post('/api/agents/register', async (req, res) => {
  try {
    const agent = await saveAgent(req.body);
    const stats = await getRealtimeStats();
    broadcastRealtimeEvent('agent_registered', { agent, stats });
    res.status(201).json({
      success: true,
      message: 'Agent registered in MySQL database',
      agent
    });
  } catch (error) {
    res.status(500).json({ error: 'Agent registration failed', details: error.message });
  }
});

app.get('/api/agents', async (req, res) => {
  try {
    const agents = await getAgents();
    res.json({ success: true, count: agents.length, agents });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agents', details: error.message });
  }
});

app.put('/api/agents/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await updateAgentStatus(req.params.id, status || 'VERIFIED');
    broadcastRealtimeEvent('agent_status_updated', { agentId: req.params.id, status });
    res.json({ success: true, message: `Agent status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update agent status', details: error.message });
  }
});

// ─── 11. Send PDF Email ───────────────────────────────────────────────────────
app.post('/api/send-pdf-email', async (req, res) => {
  try {
    const {
      toEmail, customerName, itineraryTitle, destination,
      orderId, amountPaid = 99.00, pdfBase64,
      agentName, agentPhone, agentEmail
    } = req.body;

    if (!toEmail) {
      return res.status(400).json({ error: 'Recipient email is required' });
    }

    const emailResult = await sendItineraryPdfEmail({
      toEmail, customerName, itineraryTitle, destination,
      orderId, amountPaid, pdfBase64, agentName, agentPhone, agentEmail
    });

    if (orderId) {
      await updateOrderEmailStatus(orderId, toEmail);
      await logActivity('EMAIL_SENT', `PDF Blueprint dispatched to ${toEmail} for Order ${orderId}`, { orderId, toEmail });
      broadcastRealtimeEvent('email_dispatched', { orderId, toEmail, timestamp: new Date().toISOString() });
    }

    res.json({
      success: true,
      message: `Itinerary PDF dispatched to ${toEmail}`,
      result: emailResult
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send PDF email', details: error.message });
  }
});

// ─── 12. Get All Itineraries (MySQL) ──────────────────────────────────────────
app.get('/api/itineraries', async (req, res) => {
  try {
    const { agent_email, agent_id, agent_gst } = req.query;
    let itineraries = await getAllItineraries();
    if (agent_email || agent_id || agent_gst) {
      const cleanEmail = (agent_email || '').trim().toLowerCase();
      const cleanId = (agent_id || '').trim().toLowerCase();
      const cleanGst = (agent_gst || '').trim().toUpperCase();
      itineraries = itineraries.filter(it => {
        const ag = it.agent || {};
        const itEmail = String(ag.email || it.agent_email || '').trim().toLowerCase();
        const itId = String(ag.id || it.agent_id || '').trim().toLowerCase();
        const itGst = String(ag.gstNumber || ag.gst_number || it.agent_gst || '').trim().toUpperCase();
        if (cleanEmail && itEmail && cleanEmail === itEmail) return true;
        if (cleanId && itId && cleanId === itId) return true;
        if (cleanGst && itGst && cleanGst.length >= 15 && cleanGst === itGst && !cleanGst.includes('0000A1Z5')) return true;
        return false;
      });
    }
    res.json({ success: true, count: itineraries.length, itineraries });
  } catch (error) {
    console.error('Error fetching itineraries from MySQL:', error);
    res.status(500).json({ error: 'Failed to fetch itineraries', details: error.message });
  }
});

// ─── 13. Get Single Itinerary ─────────────────────────────────────────────────
app.get('/api/itineraries/:id', async (req, res) => {
  try {
    const itinerary = await getItineraryById(req.params.id);
    if (!itinerary) return res.status(404).json({ error: 'Itinerary not found' });
    res.json({ success: true, itinerary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch itinerary', details: error.message });
  }
});

app.post('/api/itineraries', async (req, res) => {
  try {
    const saved = await insertItinerary(req.body);
    broadcastRealtimeEvent('itinerary_saved', { itinerary: saved });
    res.status(201).json({ success: true, message: 'Blueprint saved dynamically to MySQL', itinerary: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save itinerary', details: error.message });
  }
});

app.put('/api/itineraries/:id/featured', async (req, res) => {
  try {
    const { isPopular } = req.body;
    const updated = await updateItineraryPopular(req.params.id, Boolean(isPopular));
    broadcastRealtimeEvent('itinerary_saved', { id: req.params.id, isPopular: Boolean(isPopular) });
    res.json({ success: true, message: `Itinerary featured status updated to ${isPopular}`, itinerary: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update itinerary featured status', details: error.message });
  }
});

app.put(['/api/itineraries/:id', '/api/itineraries'], async (req, res) => {
  try {
    const id = req.params?.id || req.query?.id || req.body?.id;
    if (!id) return res.status(400).json({ error: 'Missing itinerary ID for update' });
    const saved = await insertItinerary({ ...req.body, id });
    broadcastRealtimeEvent('itinerary_saved', { itinerary: saved });
    res.json({ success: true, message: 'Blueprint updated dynamically in MySQL and created_itineraries_by_travel_agents', itinerary: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update itinerary', details: error.message });
  }
});

app.delete(['/api/itineraries/:id', '/api/itineraries'], async (req, res) => {
  try {
    const id = req.params?.id || req.query?.id || req.body?.id;
    if (!id) return res.status(400).json({ error: 'Missing itinerary ID for deletion' });
    const result = await deleteItinerary(id);
    broadcastRealtimeEvent('itinerary_saved', { id, deleted: true });
    res.json({ success: true, message: 'Blueprint removed from MySQL and created_itineraries_by_travel_agents', result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete itinerary', details: error.message });
  }
});

// ─── 13b. Agent Created Itineraries (phpMyAdmin Table) ───────────────────────
app.get('/api/agent-created-itineraries', async (req, res) => {
  try {
    const { email, gst, agent_id } = req.query;
    const itineraries = await getCreatedItinerariesByTravelAgents(email || gst || agent_id || '');
    res.json({ success: true, count: itineraries.length, itineraries });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent created itineraries', details: error.message });
  }
});

app.post('/api/agent-created-itineraries', async (req, res) => {
  try {
    const saved = await insertItinerary(req.body);
    broadcastRealtimeEvent('itinerary_saved', { itinerary: saved });
    res.status(201).json({ 
      success: true, 
      message: 'Itinerary saved & updated in created_itineraries_by_travel_agents (phpMyAdmin)', 
      itinerary: saved 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save agent created itinerary', details: error.message });
  }
});

app.put(['/api/agent-created-itineraries/:id', '/api/agent-created-itineraries'], async (req, res) => {
  try {
    const id = req.params?.id || req.query?.id || req.body?.id;
    if (!id) return res.status(400).json({ error: 'Missing itinerary ID for update' });
    const saved = await insertItinerary({ ...req.body, id });
    broadcastRealtimeEvent('itinerary_saved', { itinerary: saved });
    res.json({ success: true, message: 'Itinerary updated in created_itineraries_by_travel_agents (phpMyAdmin)', itinerary: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update agent created itinerary', details: error.message });
  }
});

app.delete(['/api/agent-created-itineraries/:id', '/api/agent-created-itineraries'], async (req, res) => {
  try {
    const id = req.params?.id || req.query?.id || req.body?.id;
    if (!id) return res.status(400).json({ error: 'Missing itinerary ID for deletion' });
    const result = await deleteItinerary(id);
    broadcastRealtimeEvent('itinerary_saved', { id, deleted: true });
    res.json({ success: true, message: 'Itinerary removed from created_itineraries_by_travel_agents (phpMyAdmin)', result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete agent created itinerary', details: error.message });
  }
});

// ─── 14. Popular Destinations (MySQL) ────────────────────────────────────────
app.get('/api/destinations/popular', async (req, res) => {
  try {
    const destinations = await getPopularDestinations();
    res.json({ success: true, count: destinations.length, destinations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular destinations', details: error.message });
  }
});

// ─── 15. Destinations Master Table API (Dynamic & Real-Time) ─────────────────
app.get('/api/destinations', async (req, res) => {
  try {
    const destinations = await getAllDestinations();
    res.json({ success: true, count: destinations.length, destinations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destinations', details: error.message });
  }
});

app.get('/api/destinations/:id', async (req, res) => {
  try {
    const destination = await getDestinationById(req.params.id);
    if (!destination) return res.status(404).json({ error: 'Destination not found' });
    res.json({ success: true, destination });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destination', details: error.message });
  }
});

app.post('/api/destinations', async (req, res) => {
  try {
    const saved = await saveDestination(req.body);
    broadcastRealtimeEvent('destination_saved', { destination: saved });
    res.status(201).json({ success: true, message: 'Destination saved dynamically to MySQL', destination: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save destination', details: error.message });
  }
});

app.put('/api/destinations/:id', async (req, res) => {
  try {
    const saved = await saveDestination({ ...req.body, id: req.params.id });
    broadcastRealtimeEvent('destination_saved', { destination: saved });
    res.json({ success: true, message: 'Destination updated dynamically in MySQL', destination: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update destination', details: error.message });
  }
});

app.delete('/api/destinations/:id', async (req, res) => {
  try {
    const result = await deleteDestination(req.params.id);
    broadcastRealtimeEvent('destination_deleted', { id: req.params.id });
    res.json({ success: true, message: 'Destination removed from MySQL', result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete destination', details: error.message });
  }
});

// ─── Real-Time phpMyAdmin & Direct MySQL Query Change Detector ────────────────
let lastFingerprint = null;

function startDatabaseChangeDetector(pool) {
  if (!pool) return;
  setInterval(async () => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM destinations) as dest_count,
          (SELECT IFNULL(MAX(UNIX_TIMESTAMP(updated_at)), 0) FROM destinations) as dest_max_upd,
          (SELECT COUNT(*) FROM itineraries) as itin_count,
          (SELECT IFNULL(MAX(UNIX_TIMESTAMP(updated_at)), 0) FROM itineraries) as itin_max_upd,
          (SELECT COUNT(*) FROM travel_agents) as agent_count,
          (SELECT IFNULL(MAX(UNIX_TIMESTAMP(updated_at)), 0) FROM travel_agents) as agent_max_upd,
          (SELECT COUNT(*) FROM orders) as order_count,
          (SELECT IFNULL(MAX(UNIX_TIMESTAMP(updated_at)), 0) FROM orders) as order_max_upd,
          (SELECT COUNT(*) FROM saved_itineraries) as wishlist_count
      `);

      const current = rows[0];
      if (!current) return;

      if (!lastFingerprint) {
        lastFingerprint = current;
        return;
      }

      const destChanged = current.dest_count !== lastFingerprint.dest_count || 
                          current.dest_max_upd !== lastFingerprint.dest_max_upd;
      const itinChanged = current.itin_count !== lastFingerprint.itin_count || 
                          current.itin_max_upd !== lastFingerprint.itin_max_upd;
      const agentChanged = current.agent_count !== lastFingerprint.agent_count || 
                           current.agent_max_upd !== lastFingerprint.agent_max_upd;
      const orderChanged = current.order_count !== lastFingerprint.order_count ||
                           current.order_max_upd !== lastFingerprint.order_max_upd;
      const wishlistChanged = current.wishlist_count !== lastFingerprint.wishlist_count;

      if (destChanged || itinChanged || agentChanged || orderChanged || wishlistChanged) {
        console.log(`⚡ [MySQL phpMyAdmin Detector] External SQL change detected! dest:${destChanged} itin:${itinChanged} agent:${agentChanged} order:${orderChanged} wishlist:${wishlistChanged}`);
        
        lastFingerprint = current;

        // Broadcast to all connected frontend clients
        broadcastRealtimeEvent('database_mutation', {
          destinations: destChanged,
          itineraries: itinChanged,
          agents: agentChanged,
          orders: orderChanged,
          wishlist: wishlistChanged,
          timestamp: new Date().toISOString()
        });

        if (destChanged) {
          broadcastRealtimeEvent('destination_saved', { source: 'phpmyadmin_sql' });
        }
        if (itinChanged) {
          broadcastRealtimeEvent('itinerary_saved', { source: 'phpmyadmin_sql' });
        }
        if (orderChanged) {
          broadcastRealtimeEvent('order_created', { source: 'phpmyadmin_sql' });
        }
        if (agentChanged) {
          broadcastRealtimeEvent('agent_status_updated', { source: 'phpmyadmin_sql' });
        }
        if (wishlistChanged) {
          broadcastRealtimeEvent('wishlist_updated', { source: 'phpmyadmin_sql' });
        }
      }
    } catch {
      // Ignore intermittent network blips
    }
  }, 1500);
}

// ─── Static Frontend Serving (Production) ────────────────────────────────────
const distPath = fs.existsSync(path.join(__dirname, '../dist'))
  ? path.join(__dirname, '../dist')
  : (fs.existsSync(path.join(__dirname, './dist')) ? path.join(__dirname, './dist') : null);

if (distPath) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ─── Start Server ─────────────────────────────────────────────────────────────
async function startServer() {
  try {
    await initDatabase();
    startDatabaseChangeDetector(getMysqlPool());
    app.listen(PORT, () => {
      console.log(`\n🚀 V3Itinerary MySQL API running on http://localhost:${PORT}`);
      console.log(`📡 SSE Stream: http://localhost:${PORT}/api/realtime/stream`);
      console.log(`📦 Itineraries: http://localhost:${PORT}/api/itineraries`);
      console.log(`🌟 Popular: http://localhost:${PORT}/api/destinations/popular\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('\nTo start MySQL, run:');
    console.error('  node server/startMysql.js\n');
    process.exit(1);
  }
}

startServer();
