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
  const orderIdQuery = req.query?.orderId || req.query?.id;

  // Determine subpath from URL if not provided via query
  const cleanUrl = (req.url || '').split('?')[0];
  const isInitiate = action === 'initiate' || cleanUrl.endsWith('/initiate');
  const isUpdateStatus = action === 'update-status' || cleanUrl.endsWith('/update-status');
  const isPayments = action === 'payments' || cleanUrl.endsWith('/payments');
  const isCreateRazorpayOrder = action === 'create-razorpay-order' || cleanUrl.endsWith('/create-razorpay-order');

  // 1. GET ORDERS / PAYMENTS
  if (req.method === 'GET') {
    try {
      const email = req.query?.email;

      if (isPayments) {
        if (email) {
          const [rows] = await pool.query('SELECT * FROM payments WHERE customer_email = ? ORDER BY id DESC', [email]);
          return res.status(200).json({ success: true, count: rows.length, payments: rows });
        }
        const [rows] = await pool.query('SELECT * FROM payments ORDER BY id DESC');
        return res.status(200).json({ success: true, count: rows.length, payments: rows });
      }

      if (orderIdQuery) {
        const [rows] = await pool.query('SELECT * FROM orders WHERE order_id = ?', [orderIdQuery]);
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Order not found' });
        }
        return res.status(200).json({ success: true, order: rows[0] });
      }

      if (email) {
        const [rows] = await pool.query('SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC', [email]);
        return res.status(200).json({ success: true, count: rows.length, orders: rows });
      }

      const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
      return res.status(200).json({ success: true, count: rows.length, orders: rows });
    } catch (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
    }
  }

  
  // 1b. POST /api/orders/create-razorpay-order (Razorpay API v1/orders)
  if (req.method === "POST" && isCreateRazorpayOrder) {
    try {
      const { amount = 99, receipt, notes = {} } = parsedBody;
      const keyId = (process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "rzp_live_Tq8dvK47AREHHK").trim();
      const keySecret = (process.env.VITE_RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || "").trim();

      if (!keyId || !keySecret || keyId === "your_razorpay_key_id_here") {
        return res.status(400).json({ error: "Razorpay keys not configured on server", fallback: true });
      }

      const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${auth}`
        },
        body: JSON.stringify({
          amount: Math.round(Number(amount) * 100),
          currency: "INR",
          receipt: receipt || `rcpt_${Date.now()}`,
          notes: typeof notes === "object" ? notes : {}
        })
      });

      const data = await rzpResponse.json();
      if (!rzpResponse.ok) {
        return res.status(rzpResponse.status).json({
          error: data.error?.description || "Failed to create Razorpay order",
          details: data
        });
      }

      return res.status(200).json({
        success: true,
        order: data,
        keyId
      });
    } catch (err) {
      console.error("Error creating Razorpay order:", err);
      return res.status(500).json({ error: "Failed to create Razorpay order", details: err.message });
    }
  }

  // 2. POST /api/orders/initiate
  if (req.method === 'POST' && isInitiate) {
    try {
      const {
        orderId, itineraryId, itineraryTitle, destination,
        customerName, customerEmail, customerMobile, customerAddress,
        amountPaid = 99.00,
        agentName, agentPhone, agentEmail, agentWhatsapp
      } = parsedBody;

      if (!orderId || !itineraryId) {
        return res.status(400).json({ error: 'Missing required fields: orderId, itineraryId' });
      }

      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

      // Insert into orders table as INITIATED
      await pool.query(`
        INSERT INTO orders (
          order_id, itinerary_id, itinerary_title, destination,
          customer_name, customer_email, customer_mobile, customer_address,
          amount_paid, payment_method, razorpay_payment_id, razorpay_order_id,
          status, agent_name, agent_phone, agent_email, agent_whatsapp,
          email_sent, email_sent_to, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Razorpay Gateway', '', ?, 'INITIATED', ?, ?, ?, ?, 0, '', ?)
        ON DUPLICATE KEY UPDATE
          customer_name = VALUES(customer_name),
          customer_email = VALUES(customer_email),
          customer_mobile = VALUES(customer_mobile),
          customer_address = VALUES(customer_address),
          status = IF(status IN ('PAID', 'CONFIRMED'), status, 'INITIATED')
      `, [
        orderId, itineraryId,
        itineraryTitle || 'Complete Travel Itinerary',
        destination || 'Travel Destination',
        customerName || 'Valued Traveler',
        customerEmail || '',
        customerMobile || '',
        customerAddress || '',
        amountPaid,
        orderId,
        agentName || 'Verified Agent',
        agentPhone || '',
        agentEmail || '',
        agentWhatsapp || '',
        now
      ]);

      // Record in payments table as INITIATED
      try {
        await pool.query(`
          INSERT INTO payments (
            order_id, customer_name, customer_mobile, customer_email, customer_address,
            amount, payment_status, razorpay_order_id, razorpay_payment_id, payment_method, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, 'INITIATED', ?, '', 'Razorpay Gateway', ?)
          ON DUPLICATE KEY UPDATE
            customer_name = VALUES(customer_name),
            customer_mobile = VALUES(customer_mobile),
            customer_email = VALUES(customer_email),
            customer_address = VALUES(customer_address),
            payment_status = IF(payment_status IN ('CONFIRMED', 'PAID'), payment_status, 'INITIATED')
        `, [
          orderId,
          customerName || 'Valued Traveler',
          customerMobile || '',
          customerEmail || '',
          customerAddress || '',
          amountPaid,
          orderId,
          now
        ]);
      } catch (payErr) {
        console.warn('[Payments table sync note]:', payErr.message);
      }

      // Upsert into users table
      if (customerEmail) {
        try {
          await pool.query(`
            INSERT INTO users (id, full_name, email, mobile, role)
            VALUES (?, ?, ?, ?, 'customer')
            ON DUPLICATE KEY UPDATE
              full_name = VALUES(full_name),
              mobile = VALUES(mobile)
          `, [`usr_${Date.now()}`, customerName || 'Valued Traveler', customerEmail, customerMobile || '']);
        } catch (uErr) {}
      }

      return res.status(201).json({
        success: true,
        message: 'Order initiated and recorded in MySQL as INITIATED',
        orderId
      });
    } catch (err) {
      console.error('Error initiating order:', err);
      return res.status(500).json({ error: 'Failed to initiate order', details: err.message });
    }
  }

  // 3. POST /api/orders/update-status
  if (req.method === 'POST' && isUpdateStatus) {
    try {
      const { orderId, status, razorpayPaymentId, reason } = parsedBody;
      if (!orderId || !status) {
        return res.status(400).json({ error: 'Missing orderId or status' });
      }

      const dbStatus = (status === 'PAID') ? 'CONFIRMED' : status;
      const updates = ['status = ?'];
      const params = [dbStatus];

      if (razorpayPaymentId) {
        updates.push('razorpay_payment_id = ?');
        params.push(razorpayPaymentId);
      }
      params.push(orderId);

      await pool.query(`UPDATE orders SET ${updates.join(', ')} WHERE order_id = ?`, params);

      try {
        await pool.query(`
          UPDATE payments
          SET payment_status = ?,
              razorpay_payment_id = IF(? != '', ?, razorpay_payment_id),
              failure_reason = IF(? != '', ?, failure_reason)
          WHERE order_id = ?
        `, [dbStatus, razorpayPaymentId || '', razorpayPaymentId || '', reason || '', reason || '', orderId]);
      } catch (pErr) {}

      return res.status(200).json({
        success: true,
        message: `Order status updated to ${dbStatus}`,
        orderId,
        status: dbStatus
      });
    } catch (err) {
      console.error('Error updating order status:', err);
      return res.status(500).json({ error: 'Failed to update order status', details: err.message });
    }
  }

  // 4. POST /api/orders (Standard Finalized Order)
  if (req.method === 'POST') {
    try {
      const {
        orderId, itineraryId, itineraryTitle, destination,
        customerName, customerEmail, customerMobile, customerAddress,
        amountPaid = 99.00, paymentMethod = 'UPI / Razorpay Gateway',
        razorpayPaymentId, razorpayOrderId,
        agentName, agentPhone, agentEmail, agentWhatsapp
      } = parsedBody;

      if (!orderId || !itineraryId) {
        return res.status(400).json({ error: 'Missing required fields: orderId, itineraryId' });
      }

      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

      await pool.query(`
        INSERT INTO orders (
          order_id, itinerary_id, itinerary_title, destination,
          customer_name, customer_email, customer_mobile, customer_address,
          amount_paid, payment_method, razorpay_payment_id, razorpay_order_id,
          status, agent_name, agent_phone, agent_email, agent_whatsapp,
          email_sent, email_sent_to, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PAID', ?, ?, ?, ?, 0, '', ?)
        ON DUPLICATE KEY UPDATE
          status = 'PAID',
          razorpay_payment_id = VALUES(razorpay_payment_id),
          customer_address = IF(VALUES(customer_address) IS NOT NULL AND VALUES(customer_address) != '', VALUES(customer_address), customer_address)
      `, [
        orderId, itineraryId,
        itineraryTitle || 'Complete Travel Blueprint',
        destination || 'Travel Destination',
        customerName || 'Valued Traveler',
        customerEmail || '',
        customerMobile || '',
        customerAddress || '',
        amountPaid,
        paymentMethod,
        razorpayPaymentId || '',
        razorpayOrderId || orderId,
        agentName || 'Verified Agent',
        agentPhone || '',
        agentEmail || '',
        agentWhatsapp || '',
        now
      ]);

      // Record in payments table as CONFIRMED
      try {
        await pool.query(`
          INSERT INTO payments (
            order_id, customer_name, customer_mobile, customer_email, customer_address,
            amount, payment_status, razorpay_order_id, razorpay_payment_id, payment_method, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, 'CONFIRMED', ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            payment_status = 'CONFIRMED',
            razorpay_payment_id = VALUES(razorpay_payment_id),
            customer_name = VALUES(customer_name),
            customer_mobile = VALUES(customer_mobile),
            customer_email = VALUES(customer_email),
            customer_address = IF(VALUES(customer_address) IS NOT NULL AND VALUES(customer_address) != '', VALUES(customer_address), customer_address)
        `, [
          orderId,
          customerName || 'Valued Traveler',
          customerMobile || '',
          customerEmail || '',
          customerAddress || '',
          amountPaid,
          razorpayOrderId || orderId,
          razorpayPaymentId || '',
          paymentMethod,
          now
        ]);
      } catch (payErr) {}

      // Upsert into users table
      if (customerEmail) {
        try {
          await pool.query(`
            INSERT INTO users (id, full_name, email, mobile, role)
            VALUES (?, ?, ?, ?, 'customer')
            ON DUPLICATE KEY UPDATE
              full_name = VALUES(full_name),
              mobile = VALUES(mobile)
          `, [`usr_${Date.now()}`, customerName || 'Valued Traveler', customerEmail, customerMobile || '']);
        } catch (uErr) {}
      }

      return res.status(201).json({
        success: true,
        message: 'Order saved to MySQL database and phpMyAdmin',
        orderId
      });
    } catch (err) {
      console.error('Error creating order:', err);
      return res.status(500).json({ error: 'Failed to save order', details: err.message });
    }
  }

  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
