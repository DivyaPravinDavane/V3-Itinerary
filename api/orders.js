import crypto from 'crypto';
import { getPool, setCorsHeaders, parseRequestBody, ensureSchema } from './_db.js';

function getLiveRazorpayKeys() {
  const envKey = (process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "").trim();
  const envSecret = (process.env.VITE_RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || "").trim();
  
  // Strictly enforce live keys: If env key is test mode (starts with rzp_test_), override with live key
  const keyId = (envKey && envKey.startsWith("rzp_live_")) ? envKey : "rzp_live_Tq8dvK47AREHHK";
  const keySecret = (envSecret && !envKey.startsWith("rzp_test_") && envSecret.length > 5) ? envSecret : "OqRL5KUsn0Eof6YuydfXWyMu";

  return { keyId, keySecret };
}

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
  const isVerifyPayment = action === 'verify-payment' || cleanUrl.endsWith('/verify-payment');

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
      const { keyId, keySecret } = getLiveRazorpayKeys();

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

  // 1c. POST /api/orders/verify-payment (Official Live Razorpay & Google Pay Payment Verification)
  if (req.method === "POST" && isVerifyPayment) {
    try {
      const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = parsedBody;
      if (!orderId || !razorpayPaymentId) {
        return res.status(400).json({ success: false, error: "Missing orderId or razorpayPaymentId" });
      }

      // Strictly disallow test mode payments
      if (razorpayPaymentId.includes("test") || razorpayPaymentId.startsWith("mock_")) {
        return res.status(400).json({ 
          success: false, 
          error: "Test mode transactions are strictly disabled. Only live Google Pay and Razorpay payments are accepted." 
        });
      }

      const { keyId, keySecret } = getLiveRazorpayKeys();

      // 1. If HMAC signature is provided, verify SHA256 signature
      let signatureValid = false;
      if (razorpayOrderId && razorpaySignature) {
        const expectedSignature = crypto
          .createHmac("sha256", keySecret)
          .update(`${razorpayOrderId}|${razorpayPaymentId}`)
          .digest("hex");
        signatureValid = expectedSignature === razorpaySignature;
      }

      // 2. Query Razorpay Live API to verify genuine payment status
      let apiVerified = false;
      let paymentDetails = null;
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const rzpRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpayPaymentId}`, {
          headers: { "Authorization": `Basic ${auth}` }
        });
        if (rzpRes.ok) {
          paymentDetails = await rzpRes.json();
          if (
            paymentDetails && 
            (paymentDetails.status === "captured" || paymentDetails.status === "authorized") &&
            paymentDetails.amount >= 9900 &&
            paymentDetails.currency === "INR"
          ) {
            apiVerified = true;
          }
        }
      } catch (e) {
        console.warn("Razorpay live payment fetch note:", e.message);
      }

      // Only grant PDF access if verified with live Razorpay
      if (!signatureValid && !apiVerified) {
        console.warn(`❌ [Razorpay] Payment verification failed for Order ${orderId}, PID: ${razorpayPaymentId}`);
        await pool.query('UPDATE orders SET status = "FAILED" WHERE order_id = ?', [orderId]);
        return res.status(400).json({
          success: false,
          error: "Payment verification failed. Could not confirm genuine live transaction with Razorpay / Google Pay."
        });
      }

      // Successfully verified! Update order in MySQL to PAID
      await pool.query(
        'UPDATE orders SET status = "PAID", razorpay_payment_id = ? WHERE order_id = ?',
        [razorpayPaymentId, orderId]
      );
      try {
        await pool.query(
          'UPDATE payments SET payment_status = "CONFIRMED", razorpay_payment_id = ? WHERE order_id = ?',
          [razorpayPaymentId, orderId]
        );
      } catch (pErr) {}

      console.log(`✅ [Razorpay Live Verified] Order ${orderId} marked PAID! Method: ${paymentDetails?.method || 'UPI/GPay/Card'}`);

      return res.status(200).json({
        success: true,
        verified: true,
        orderId,
        razorpayPaymentId,
        status: "PAID",
        method: paymentDetails?.method || "UPI / Razorpay"
      });
    } catch (err) {
      console.error("Error verifying Razorpay payment:", err);
      return res.status(500).json({ success: false, error: err.message });
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

      // Create live Razorpay Order & Payment Link for seamless Google Pay & Razorpay Checkout
      const { keyId: rzpKeyId, keySecret: rzpKeySecret } = getLiveRazorpayKeys();
      let razorpayOrderId = orderId;
      let paymentLinkUrl = '';

      try {
        const authHeader = 'Basic ' + Buffer.from(`${rzpKeyId}:${rzpKeySecret}`).toString('base64');
        
        // 1. Create real Razorpay Live Order
        const rzpOrderRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({
            amount: Math.round(Number(amountPaid) * 100),
            currency: 'INR',
            receipt: orderId.slice(0, 40),
            notes: {
              orderId,
              itineraryId,
              destination: destination || '',
              customerEmail: customerEmail || ''
            }
          })
        });

        if (rzpOrderRes.ok) {
          const rzpOrderData = await rzpOrderRes.json();
          if (rzpOrderData.id) {
            razorpayOrderId = rzpOrderData.id;
          }
        }

        // 2. Create real Razorpay Live Payment Link
        const plinkRes = await fetch('https://api.razorpay.com/v1/payment_links', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({
            amount: Math.round(Number(amountPaid) * 100),
            currency: 'INR',
            description: `${destination || 'Travel'} Itinerary Blueprint`,
            upi_link: true,
            customer: {
              name: customerName || 'Valued Traveler',
              email: customerEmail || 'traveler@v3itinerary.com',
              contact: customerMobile || '9820389694'
            },
            notify: { sms: false, email: false },
            callback_url: `https://www.v3itinerary.com/?order_id=${orderId}&status=paid`,
            callback_method: 'get'
          })
        });

        if (plinkRes.ok) {
          const plinkData = await plinkRes.json();
          if (plinkData.short_url) {
            paymentLinkUrl = plinkData.short_url;
          }
        }
      } catch (rzpErr) {
        console.warn('[Razorpay API note]:', rzpErr.message);
      }

      // Update order with razorpayOrderId if generated
      if (razorpayOrderId !== orderId) {
        try {
          await pool.query('UPDATE orders SET razorpay_order_id = ? WHERE order_id = ?', [razorpayOrderId, orderId]);
          await pool.query('UPDATE payments SET razorpay_order_id = ? WHERE order_id = ?', [razorpayOrderId, orderId]);
        } catch (uErr) {}
      }

      return res.status(201).json({
        success: true,
        message: 'Order initiated and recorded in MySQL as INITIATED',
        orderId,
        razorpayOrderId,
        paymentLinkUrl,
        keyId: rzpKeyId
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
