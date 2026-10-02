import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// ─── MySQL Configuration ────────────────────────────────────────────────────
// Uses Unix socket for the local tarball MySQL (no Homebrew needed),
// falls back to TCP host/port if socket not found.
const MYSQL_SOCKET = '/tmp/mysql_v3.sock';

const isRemote = Boolean(
  process.env.DB_HOST && 
  process.env.DB_HOST !== 'localhost' && 
  process.env.DB_HOST !== '127.0.0.1'
);

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'v3_itinerary',
  ...(isRemote ? {} : { socketPath: MYSQL_SOCKET }),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00'
};

let mysqlPool = null;
let isMysqlConnected = false;
let mysqlError = null;

// ─── Initialize MySQL ────────────────────────────────────────────────────────
async function initMysql() {
  try {
    if (!isRemote) {
      try {
        const rootConn = await mysql.createConnection({
          socketPath: MYSQL_SOCKET,
          user: dbConfig.user,
          password: dbConfig.password
        });
        await rootConn.query(
          `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
        );
        await rootConn.end();
      } catch (localDbErr) {
        console.warn('[Local DB Init Note]:', localDbErr.message);
      }
    }

    mysqlPool = mysql.createPool(dbConfig);

    // Verify pool works
    const [rows] = await mysqlPool.query('SELECT 1 as ok');
    isMysqlConnected = rows[0].ok === 1;
    mysqlError = null;
    console.log(`✅ [MySQL] Connected to database "${dbConfig.database}" at ${dbConfig.host}:${dbConfig.port}`);

    // Ensure core tables exist
    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        full_name VARCHAR(120) NOT NULL,
        email VARCHAR(160) NOT NULL UNIQUE,
        mobile VARCHAR(30),
        role ENUM('customer', 'admin', 'agent') DEFAULT 'customer',
        password_hash VARCHAR(255),
        preferred_travel_type VARCHAR(60) DEFAULT 'Family / Leisure',
        preferred_budget_tier VARCHAR(60) DEFAULT 'Standard',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS travel_agents (
        id VARCHAR(64) PRIMARY KEY,
        agency_name VARCHAR(160) NOT NULL,
        founder_name VARCHAR(120) NOT NULL,
        gst_number VARCHAR(40) NOT NULL UNIQUE,
        phone VARCHAR(40) NOT NULL,
        email VARCHAR(160) NOT NULL,
        whatsapp VARCHAR(40),
        city VARCHAR(80),
        state VARCHAR(100),
        experience_years VARCHAR(50),
        business_type VARCHAR(50),
        specialisations TEXT,
        about_agency TEXT,
        destinations_sold TEXT,
        planned_uploads VARCHAR(50),
        business_proof_name VARCHAR(255),
        business_proof_url VARCHAR(500),
        business_proof_size INT DEFAULT 0,
        logo_name VARCHAR(255),
        logo_url VARCHAR(500),
        social_link VARCHAR(500),
        status ENUM('VERIFIED', 'PENDING_REVIEW', 'REJECTED') DEFAULT 'VERIFIED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS destinations (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(120) NOT NULL UNIQUE,
        country VARCHAR(100) NOT NULL,
        region ENUM('Domestic', 'International') DEFAULT 'Domestic',
        tagline VARCHAR(255),
        description TEXT,
        cover_image VARCHAR(512) NOT NULL,
        gallery_images_json JSON,
        best_time_to_visit VARCHAR(120),
        itinerary_count INT DEFAULT 0,
        starting_price DECIMAL(10,2) DEFAULT 99.00,
        is_popular BOOLEAN DEFAULT TRUE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS itineraries (
        id VARCHAR(64) PRIMARY KEY,
        slug VARCHAR(120) NOT NULL,
        destination VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        region VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        duration_days INT NOT NULL,
        duration_nights INT NOT NULL,
        traveler_type VARCHAR(60) NOT NULL,
        itinerary_count_label VARCHAR(60),
        access_price DECIMAL(10,2) DEFAULT 99.00,
        gst_amount DECIMAL(10,2) DEFAULT 0.00,
        total_access_price DECIMAL(10,2) DEFAULT 99.00,
        estimated_trip_cost DECIMAL(12, 2) NOT NULL,
        rating DECIMAL(3,2) DEFAULT 4.90,
        review_count INT DEFAULT 0,
        cover_image VARCHAR(512) NOT NULL,
        gallery_images_json JSON,
        overview TEXT,
        best_time_to_visit VARCHAR(120),
        is_popular BOOLEAN DEFAULT FALSE,
        agent_json JSON,
        days_json JSON,
        hotels_json JSON,
        budget_breakdown_json JSON,
        inclusions_json JSON,
        exclusions_json JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id VARCHAR(64) PRIMARY KEY,
        itinerary_id VARCHAR(64) NOT NULL,
        itinerary_title VARCHAR(255) NOT NULL,
        destination VARCHAR(100) NOT NULL,
        customer_name VARCHAR(120) NOT NULL,
        customer_email VARCHAR(160) NOT NULL,
        customer_mobile VARCHAR(30),
        amount_paid DECIMAL(10, 2) NOT NULL DEFAULT 99.00,
        payment_method VARCHAR(60) DEFAULT 'UPI / Razorpay Gateway',
        razorpay_payment_id VARCHAR(100) NOT NULL,
        razorpay_order_id VARCHAR(100),
        status ENUM('PAID', 'PENDING', 'FAILED') DEFAULT 'PAID',
        email_sent BOOLEAN DEFAULT FALSE,
        email_sent_to VARCHAR(160),
        agent_name VARCHAR(120),
        agent_phone VARCHAR(40),
        agent_email VARCHAR(160),
        agent_whatsapp VARCHAR(40),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS saved_itineraries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_email VARCHAR(160) NOT NULL,
        itinerary_id VARCHAR(64) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_user_itinerary (user_email, itinerary_id)
      );
    `);

    // Ensure payments table and status views exist
    try {
      await mysqlPool.query(`
        CREATE TABLE IF NOT EXISTS payments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id VARCHAR(64) NOT NULL,
          customer_name VARCHAR(120) NOT NULL,
          customer_mobile VARCHAR(30),
          customer_email VARCHAR(160) NOT NULL,
          customer_address TEXT,
          amount DECIMAL(10, 2) NOT NULL DEFAULT 99.00,
          payment_status VARCHAR(32) NOT NULL DEFAULT 'INITIATED',
          razorpay_order_id VARCHAR(100) DEFAULT '',
          razorpay_payment_id VARCHAR(100) DEFAULT '',
          payment_method VARCHAR(60) DEFAULT 'Razorpay Gateway',
          failure_reason TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          KEY idx_order_id (order_id),
          KEY idx_status (payment_status),
          KEY idx_customer_email (customer_email)
        );
      `);
      await mysqlPool.query(`CREATE OR REPLACE VIEW view_payments_initiated AS SELECT * FROM payments WHERE payment_status = 'INITIATED'`);
      await mysqlPool.query(`CREATE OR REPLACE VIEW view_payments_confirmed AS SELECT * FROM payments WHERE payment_status IN ('CONFIRMED', 'PAID')`);
      await mysqlPool.query(`CREATE OR REPLACE VIEW view_payments_failed AS SELECT * FROM payments WHERE payment_status = 'FAILED'`);
      await mysqlPool.query(`CREATE OR REPLACE VIEW view_payments_cancelled AS SELECT * FROM payments WHERE payment_status = 'CANCELLED'`);
    } catch (vErr) {
      console.warn('[Payments Views Setup Note]:', vErr.message);
    }


    // Ensure all onboarding columns exist in travel_agents table
    try {
      const [existing] = await mysqlPool.query(
        "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'travel_agents'",
        [dbConfig.database]
      );
      const colNames = existing.map(r => r.COLUMN_NAME);
      const cols = [
        ['state', 'VARCHAR(100)'],
        ['experience_years', 'VARCHAR(50)'],
        ['business_type', 'VARCHAR(50)'],
        ['specialisations', 'TEXT'],
        ['about_agency', 'TEXT'],
        ['destinations_sold', 'TEXT'],
        ['planned_uploads', 'VARCHAR(50)'],
        ['business_proof_name', 'VARCHAR(255)'],
        ['business_proof_url', 'VARCHAR(500)'],
        ['business_proof_size', 'INT DEFAULT 0'],
        ['logo_name', 'VARCHAR(255)'],
        ['logo_url', 'VARCHAR(500)'],
        ['social_link', 'VARCHAR(500)']
      ];
      for (const [col, type] of cols) {
        if (!colNames.includes(col)) {
          await mysqlPool.query(`ALTER TABLE travel_agents ADD COLUMN ${col} ${type}`);
        }
      }

      // Ensure users table role ENUM includes 'agent'
      try {
        await mysqlPool.query("ALTER TABLE users MODIFY COLUMN role ENUM('customer', 'admin', 'agent') DEFAULT 'customer'");
      } catch (roleEnumErr) {
        // Table already updated or compatible
      }
    } catch (migErr) {
      console.warn('[MySQL Migration Note]:', migErr.message);
    }
  } catch (err) {
    isMysqlConnected = false;
    mysqlError = err.message;
    console.error(`❌ [MySQL] Connection failed: ${err.message}`);
    console.error('   Make sure MySQL is running: node server/startMysql.js');
    throw err;  // Hard fail — MySQL is required
  }
}

export async function initDatabase() {
  await initMysql();
  return true;
}

// ─── Generic Query Helper ────────────────────────────────────────────────────
export async function executeQuery(sql, params = []) {
  const [results] = await mysqlPool.query(sql, params);
  return results;
}

// ─── Helper: parse JSON fields from MySQL itinerary row ─────────────────────
function parseItinerary(row) {
  if (!row) return null;
  return {
    ...row,
    durationDays: row.duration_days,
    durationNights: row.duration_nights,
    travelerType: row.traveler_type,
    itineraryCountLabel: row.itinerary_count_label,
    accessPrice: parseFloat(row.access_price),
    gstAmount: parseFloat(row.gst_amount),
    totalAccessPrice: parseFloat(row.total_access_price),
    estimatedTripCost: parseFloat(row.estimated_trip_cost),
    rating: parseFloat(row.rating),
    reviewCount: row.review_count,
    coverImage: row.cover_image,
    bestTimeToVisit: row.best_time_to_visit,
    isPopular: row.is_popular === 1,
    galleryImages: safeJsonParse(row.gallery_images_json, []),
    agent: safeJsonParse(row.agent_json, {}),
    days: safeJsonParse(row.days_json, []),
    hotels: safeJsonParse(row.hotels_json, []),
    budgetBreakdown: safeJsonParse(row.budget_breakdown_json, {}),
    inclusions: safeJsonParse(row.inclusions_json, []),
    exclusions: safeJsonParse(row.exclusions_json, [])
  };
}

function safeJsonParse(str, fallback) {
  if (str === null || str === undefined) return fallback;
  if (typeof str === 'object') return str; // MySQL JSON column already parsed
  try { return JSON.parse(str); } catch { return fallback; }
}

// ─── ITINERARIES ─────────────────────────────────────────────────────────────
export async function getAllItineraries() {
  const [rows] = await mysqlPool.query('SELECT * FROM itineraries ORDER BY is_popular DESC, rating DESC');
  return rows.map(parseItinerary);
}

export async function getItineraryById(id) {
  const [rows] = await mysqlPool.query('SELECT * FROM itineraries WHERE id = ?', [id]);
  return parseItinerary(rows[0]);
}

export async function getPopularDestinations() {
  const [rows] = await mysqlPool.query(
    'SELECT * FROM itineraries WHERE is_popular = 1 ORDER BY rating DESC'
  );
  return rows.map(parseItinerary);
}

export async function insertItinerary(it) {
  const itinId = it.id || `itin_${Date.now()}`;
  const slug = it.slug || (it.title || 'itinerary').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  await mysqlPool.query(`
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
      rating = VALUES(rating),
      review_count = VALUES(review_count),
      cover_image = VALUES(cover_image),
      gallery_images_json = VALUES(gallery_images_json),
      overview = VALUES(overview),
      best_time_to_visit = VALUES(best_time_to_visit),
      is_popular = VALUES(is_popular),
      agent_json = VALUES(agent_json),
      days_json = VALUES(days_json),
      hotels_json = VALUES(hotels_json),
      budget_breakdown_json = VALUES(budget_breakdown_json),
      inclusions_json = VALUES(inclusions_json),
      exclusions_json = VALUES(exclusions_json)
  `, [
    itinId, slug, it.destination || 'Destination', it.country || 'International', it.region || 'International', it.title,
    it.durationDays || 4, it.durationNights || 3, it.travelerType || 'Family', it.itineraryCountLabel || '',
    it.accessPrice || 99, it.gstAmount || 0, it.totalAccessPrice || 99, it.estimatedTripCost || 50000,
    it.rating || 4.9, it.reviewCount || 12, it.coverImage || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&auto=format&fit=crop&q=80',
    JSON.stringify(it.galleryImages || []),
    it.overview || '', it.bestTimeToVisit || 'Oct - Apr', it.isPopular ? 1 : 0,
    JSON.stringify(it.agent || { agencyName: 'Verified Partner Agency', founderName: 'Partner', phone: '+91 98000 00000', email: 'partner@v3itinerary.com', gstNumber: 'GSTIN27AAAAA0000A1Z5' }),
    JSON.stringify(it.days || []),
    JSON.stringify(it.hotels || []),
    JSON.stringify(it.budgetBreakdown || {}),
    JSON.stringify(it.inclusions || []),
    JSON.stringify(it.exclusions || [])
  ]);
  await logActivity('ITINERARY_SAVED', `Blueprint saved: ${it.title} (${it.destination})`);

  // Synchronize destination table so customer portal reflects it immediately
  try {
    const destName = it.destination;
    if (destName) {
      const [destRows] = await mysqlPool.query('SELECT id FROM destinations WHERE LOWER(name) = LOWER(?)', [destName]);
      if (destRows.length === 0) {
        await saveDestination({
          name: destName,
          country: it.country || 'India',
          region: it.region || 'Domestic',
          cover_image: it.coverImage || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&auto=format&fit=crop&q=80',
          tagline: `Curated verified blueprints for ${destName}`,
          description: it.overview || `Explore hand-crafted itineraries for ${destName}.`,
          itinerary_count: 1,
          starting_price: it.totalAccessPrice || 99
        });
      } else {
        const [cnt] = await mysqlPool.query('SELECT COUNT(*) as cnt FROM itineraries WHERE LOWER(destination) = LOWER(?)', [destName]);
        await mysqlPool.query('UPDATE destinations SET itinerary_count = ? WHERE id = ?', [cnt[0]?.cnt || 1, destRows[0].id]);
      }
    }
  } catch (dErr) {
    console.warn('[Destination Sync Note]:', dErr.message);
  }

  return getItineraryById(itinId);
}

export async function updateItineraryPopular(id, isPopular) {
  await mysqlPool.query(
    'UPDATE itineraries SET is_popular = ? WHERE id = ?',
    [isPopular ? 1 : 0, id]
  );
  await logActivity('ITINERARY_UPDATE', `Toggled itinerary ${id} featured status to ${isPopular ? 'Featured' : 'Standard'}`);
  return getItineraryById(id);
}

export async function deleteItinerary(id) {
  try {
    const [existing] = await mysqlPool.query('SELECT destination FROM itineraries WHERE id = ?', [id]);
    const destName = existing[0]?.destination;
    const [result] = await mysqlPool.query('DELETE FROM itineraries WHERE id = ?', [id]);
    if (destName) {
      const [cnt] = await mysqlPool.query('SELECT COUNT(*) as cnt FROM itineraries WHERE LOWER(destination) = LOWER(?)', [destName]);
      await mysqlPool.query('UPDATE destinations SET itinerary_count = ? WHERE LOWER(name) = LOWER(?)', [cnt[0]?.cnt || 0, destName]);
    }
    await logActivity('ITINERARY_DELETED', `Deleted itinerary ${id}`);
    return result;
  } catch (err) {
    console.error('Delete itinerary error:', err);
    throw err;
  }
}

export async function getItineraryCount() {
  const [rows] = await mysqlPool.query('SELECT COUNT(*) as count FROM itineraries');
  return rows[0].count;
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────
export async function insertOrder(order) {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  await mysqlPool.query(`
    INSERT INTO orders (
      order_id, itinerary_id, itinerary_title, destination,
      customer_name, customer_email, customer_mobile, customer_address,
      amount_paid, payment_method, razorpay_payment_id, razorpay_order_id,
      status, agent_name, agent_phone, agent_email, agent_whatsapp,
      email_sent, email_sent_to, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PAID', ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      status = 'PAID',
      razorpay_payment_id = VALUES(razorpay_payment_id),
      customer_address = IF(VALUES(customer_address) IS NOT NULL AND VALUES(customer_address) != '', VALUES(customer_address), customer_address)
  `, [
    order.orderId, order.itineraryId,
    order.itineraryTitle || 'Complete Travel Blueprint',
    order.destination || 'Travel Destination',
    order.customerName || 'Valued Traveler',
    order.customerEmail || '',
    order.customerMobile || '',
    order.customerAddress || '',
    order.amountPaid || 99.00,
    order.paymentMethod || 'UPI / Razorpay Gateway',
    order.razorpayPaymentId || '',
    order.razorpayOrderId || order.orderId,
    order.agentName || 'Verified Agent',
    order.agentPhone || '',
    order.agentEmail || '',
    order.agentWhatsapp || '',
    order.emailSent ? 1 : 0,
    order.emailSentTo || '',
    now
  ]);

  await logActivity('NEW_ORDER',
    `Order ${order.orderId} placed for ${order.destination} (₹${order.amountPaid || 99})`,
    { orderId: order.orderId, destination: order.destination, customerEmail: order.customerEmail }
  );

  // Sync payments table as CONFIRMED
  try {
    await mysqlPool.query(`
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
      order.orderId,
      order.customerName || 'Valued Traveler',
      order.customerMobile || '',
      order.customerEmail || '',
      order.customerAddress || '',
      order.amountPaid || 99.00,
      order.razorpayOrderId || order.orderId,
      order.razorpayPaymentId || '',
      order.paymentMethod || 'Razorpay Gateway',
      now
    ]);
  } catch (payErr) {
    console.warn('[Payments Table Sync Note]:', payErr.message);
  }

  return getOrderById(order.orderId);
}

export async function getOrders(emailFilter = null) {
  if (emailFilter) {
    const [rows] = await mysqlPool.query(
      'SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC', [emailFilter]
    );
    return rows;
  }
  const [rows] = await mysqlPool.query('SELECT * FROM orders ORDER BY created_at DESC');
  return rows;
}

export async function getOrderById(orderId) {
  const [rows] = await mysqlPool.query('SELECT * FROM orders WHERE order_id = ?', [orderId]);
  return rows[0] || null;
}

export async function getPayments(emailFilter = null) {
  if (emailFilter) {
    const [rows] = await mysqlPool.query(
      'SELECT * FROM payments WHERE customer_email = ? ORDER BY id DESC', [emailFilter]
    );
    return rows;
  }
  const [rows] = await mysqlPool.query('SELECT * FROM payments ORDER BY id DESC');
  return rows;
}

export async function initiateOrder(order) {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  await mysqlPool.query(`
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
    order.orderId, order.itineraryId,
    order.itineraryTitle || 'Complete Travel Blueprint',
    order.destination || 'Travel Destination',
    order.customerName || 'Valued Traveler',
    order.customerEmail || '',
    order.customerMobile || '',
    order.customerAddress || '',
    order.amountPaid || 99.00,
    order.orderId,
    order.agentName || 'Verified Agent',
    order.agentPhone || '',
    order.agentEmail || '',
    order.agentWhatsapp || '',
    now
  ]);

  // Record in payments table as INITIATED
  try {
    await mysqlPool.query(`
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
      order.orderId,
      order.customerName || 'Valued Traveler',
      order.customerMobile || '',
      order.customerEmail || '',
      order.customerAddress || '',
      order.amountPaid || 99.00,
      order.orderId,
      now
    ]);
  } catch (payErr) {
    console.warn('[Payments Table Sync Note]:', payErr.message);
  }

  await logActivity('ORDER_INITIATED',
    `Order ${order.orderId} initiated for ${order.destination} by ${order.customerName || order.customerEmail} (₹${order.amountPaid || 99})`,
    { orderId: order.orderId, destination: order.destination, customerEmail: order.customerEmail }
  );

  return getOrderById(order.orderId);
}

export async function updateOrderStatus(orderId, status, { razorpayPaymentId, reason } = {}) {
  // Normalize status: CONFIRMED and PAID both accepted
  const dbStatus = (status === 'PAID') ? 'CONFIRMED' : status;
  const updates = ['status = ?'];
  const params = [dbStatus];

  if (razorpayPaymentId) {
    updates.push('razorpay_payment_id = ?');
    params.push(razorpayPaymentId);
  }

  params.push(orderId);

  await mysqlPool.query(
    `UPDATE orders SET ${updates.join(', ')} WHERE order_id = ?`,
    params
  );

  // Synchronize status in payments table
  try {
    const pStatus = (status === 'PAID') ? 'CONFIRMED' : status;
    await mysqlPool.query(`
      UPDATE payments
      SET payment_status = ?,
          razorpay_payment_id = IF(? != '', ?, razorpay_payment_id),
          failure_reason = IF(? != '', ?, failure_reason)
      WHERE order_id = ?
    `, [pStatus, razorpayPaymentId || '', razorpayPaymentId || '', reason || '', reason || '', orderId]);
  } catch (payErr) {
    console.warn('[Payments Table Sync Note]:', payErr.message);
  }

  await logActivity('ORDER_STATUS_UPDATE',
    `Order ${orderId} status changed to ${dbStatus}${reason ? ` (${reason})` : ''}`,
    { orderId, status: dbStatus, reason, razorpayPaymentId }
  );

  return getOrderById(orderId);
}

export async function updateOrderEmailStatus(orderId, emailSentTo) {
  await mysqlPool.query(
    'UPDATE orders SET email_sent = 1, email_sent_to = ? WHERE order_id = ?',
    [emailSentTo, orderId]
  );
  await logActivity('EMAIL_DISPATCH', `PDF Blueprint emailed to ${emailSentTo} for order ${orderId}`);
}

// ─── USERS ────────────────────────────────────────────────────────────────────
export async function upsertUser(user) {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const userId = user.id || `usr_${Date.now()}`;
  const passwordVal = user.password || user.passwordHash || 'Secret@123';
  const whatsappVal = user.whatsapp || user.mobile || '';
  const pinVal = user.securityPin || user.security_pin || '';

  await mysqlPool.query(`
    INSERT INTO users (
      id, full_name, email, mobile, whatsapp, role,
      password_hash, security_pin,
      preferred_travel_type, preferred_budget_tier,
      created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      full_name = VALUES(full_name),
      mobile = VALUES(mobile),
      whatsapp = VALUES(whatsapp),
      role = VALUES(role),
      password_hash = IF(VALUES(password_hash) IS NOT NULL AND VALUES(password_hash) != '', VALUES(password_hash), password_hash),
      security_pin = IF(VALUES(security_pin) IS NOT NULL AND VALUES(security_pin) != '', VALUES(security_pin), security_pin),
      preferred_travel_type = VALUES(preferred_travel_type),
      preferred_budget_tier = VALUES(preferred_budget_tier),
      updated_at = VALUES(updated_at)
  `, [
    userId,
    user.fullName || 'Traveler',
    user.email,
    user.mobile || '',
    whatsappVal,
    user.role || 'customer',
    passwordVal,
    pinVal,
    user.preferredTravelType || 'Couple',
    user.preferredBudgetTier || 'Comfort',
    now,
    now
  ]);

  await logActivity(
    user.role === 'admin' ? 'ADMIN_LOGIN' : (user.isNewRegistration ? 'USER_REGISTER' : 'USER_LOGIN'),
    `${user.role === 'admin' ? 'Admin' : 'Customer'} authenticated: ${user.fullName || user.email} (${user.email})`,
    { email: user.email, mobile: user.mobile, role: user.role }
  );

  return getUserByEmail(user.email);
}

export async function getUserByEmail(email) {
  const [rows] = await mysqlPool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

// ─── AGENTS ───────────────────────────────────────────────────────────────────
export async function saveAgent(agent) {
  const agentId = agent.id || `ag-${Date.now().toString().slice(-4)}`;
  const gstNum = agent.gstNumber || agent.gstin || `V3G-${Date.now().toString().slice(-6)}`;
  const contact = agent.contactPerson || agent.founderName || agent.agencyName || 'Partner';
  const phone = agent.phone || agent.mobile || '';
  const city = agent.city || 'India';
  const state = agent.state || '';
  const whatsapp = agent.whatsapp || phone;
  const experienceYears = agent.experienceYears || '';
  const businessType = agent.businessType || 'Both';
  const specialisations = Array.isArray(agent.specialisations)
    ? JSON.stringify(agent.specialisations)
    : (agent.specialisations || '[]');
  const aboutAgency = agent.aboutAgency || '';
  const destinationsSold = agent.destinationsSold || '';
  const plannedUploads = agent.plannedUploads || '25 - 50';
  const proofName = agent.businessProofDoc?.name || agent.businessProofName || '';
  const proofUrl = agent.businessProofDoc?.url || agent.businessProofUrl || '';
  const proofSize = agent.businessProofDoc?.size || agent.businessProofSize || 0;
  const logoName = agent.logoDoc?.name || agent.logoName || '';
  const logoUrl = agent.logoDoc?.url || agent.logoUrl || '';
  const socialLink = agent.socialLink || '';

  try {
    await mysqlPool.query(`
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
      agentId, agent.agencyName, contact, gstNum, phone, agent.email, whatsapp,
      city, state, experienceYears, businessType, specialisations,
      aboutAgency, destinationsSold, plannedUploads,
      proofName, proofUrl, proofSize,
      logoName, logoUrl, socialLink
    ]);
  } catch (err) {
    console.warn('[MySQL saveAgent Warning]:', err.message);
  }

  const specLabel = Array.isArray(agent.specialisations) ? agent.specialisations.join(', ') : agent.specialisations;
  await logActivity('AGENT_ONBOARDING',
    `Travel Agent ${agent.agencyName} (${city}, ${state}) registered in MySQL! Type: ${businessType}, Specialisations: ${specLabel || 'General'}, Proof: ${proofName || 'None'}`
  );

  try {
    const [rows] = await mysqlPool.query('SELECT * FROM travel_agents WHERE id = ?', [agentId]);
    return rows[0] || { id: agentId, ...agent };
  } catch (e) {
    return { id: agentId, ...agent };
  }
}

export async function getAgents() {
  const [rows] = await mysqlPool.query(
    'SELECT * FROM travel_agents ORDER BY created_at DESC'
  );
  return rows;
}

export async function updateAgentStatus(agentId, status) {
  await mysqlPool.query(
    'UPDATE travel_agents SET status = ? WHERE id = ?', [status, agentId]
  );
  await logActivity('AGENT_STATUS_UPDATE', `Agent ${agentId} status → ${status}`);
}

export async function getAgentByEmailOrGst(identifier) {
  if (!identifier) return null;
  const clean = identifier.trim();
  const [rows] = await mysqlPool.query(
    'SELECT * FROM travel_agents WHERE LOWER(email) = LOWER(?) OR UPPER(gst_number) = UPPER(?) OR LOWER(agency_name) = LOWER(?) LIMIT 1',
    [clean, clean, clean]
  );
  return rows[0] || null;
}

// ─── WISHLIST ─────────────────────────────────────────────────────────────────
export async function toggleWishlist(userEmail, itineraryId) {
  const [existing] = await mysqlPool.query(
    'SELECT id FROM saved_itineraries WHERE user_email = ? AND itinerary_id = ?',
    [userEmail, itineraryId]
  );
  if (existing.length > 0) {
    await mysqlPool.query(
      'DELETE FROM saved_itineraries WHERE user_email = ? AND itinerary_id = ?',
      [userEmail, itineraryId]
    );
    return { saved: false, itineraryId };
  } else {
    await mysqlPool.query(
      'INSERT IGNORE INTO saved_itineraries (user_email, itinerary_id) VALUES (?, ?)',
      [userEmail, itineraryId]
    );
    return { saved: true, itineraryId };
  }
}

export async function getWishlist(userEmail) {
  const [rows] = await mysqlPool.query(
    'SELECT itinerary_id FROM saved_itineraries WHERE user_email = ?', [userEmail]
  );
  return rows.map(r => r.itinerary_id);
}

// ─── ACTIVITY LOGGING ─────────────────────────────────────────────────────────
export async function logActivity(eventType, description, metadata = {}) {
  try {
    await mysqlPool.query(
      'INSERT INTO activity_logs (event_type, description, metadata) VALUES (?, ?, ?)',
      [eventType, description, JSON.stringify(metadata)]
    );
  } catch (e) {
    // Ignore logging errors (table may not exist yet)
  }
}

export async function getRecentActivities(limit = 20) {
  try {
    const [rows] = await mysqlPool.query(
      'SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ?', [limit]
    );
    return rows;
  } catch {
    return [];
  }
}

// ─── DESTINATIONS MASTER TABLE ───────────────────────────────────────────────
export async function getAllDestinations() {
  const [rows] = await mysqlPool.query(
    'SELECT * FROM destinations WHERE is_active = TRUE ORDER BY is_popular DESC, name ASC'
  );
  return rows.map(r => ({
    ...r,
    galleryImages: typeof r.gallery_images_json === 'string' ? JSON.parse(r.gallery_images_json || '[]') : (r.gallery_images_json || [])
  }));
}

export async function getDestinationById(idOrSlug) {
  const [rows] = await mysqlPool.query(
    'SELECT * FROM destinations WHERE id = ? OR slug = ? LIMIT 1',
    [idOrSlug, idOrSlug]
  );
  if (!rows[0]) return null;
  const r = rows[0];
  return {
    ...r,
    galleryImages: typeof r.gallery_images_json === 'string' ? JSON.parse(r.gallery_images_json || '[]') : (r.gallery_images_json || [])
  };
}

export async function saveDestination(dest) {
  const name = dest.name || 'New Destination';
  const id = dest.id || `dest-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const slug = dest.slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const gallery = typeof dest.galleryImages === 'object' ? JSON.stringify(dest.galleryImages) : (dest.gallery_images_json || '[]');

  await mysqlPool.query(`
    INSERT INTO destinations (
      id, name, slug, country, region, tagline, description,
      cover_image, gallery_images_json, best_time_to_visit,
      itinerary_count, starting_price, is_popular, is_active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
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
    id, name, slug, dest.country || 'India', dest.region || 'Domestic',
    dest.tagline || '', dest.description || '', dest.cover_image || dest.coverImage || '',
    gallery, dest.best_time_to_visit || dest.bestTimeToVisit || 'October to March',
    dest.itinerary_count || dest.itineraryCount || 1, dest.starting_price || dest.startingPrice || 99.00,
    dest.is_popular !== undefined ? dest.is_popular : 1,
    dest.is_active !== undefined ? dest.is_active : 1
  ]);

  await logActivity('DESTINATION_SAVED', `Destination ${name} (${id}) updated in MySQL`);
  return getDestinationById(id);
}

export async function deleteDestination(id) {
  await mysqlPool.query('DELETE FROM destinations WHERE id = ?', [id]);
  await logActivity('DESTINATION_DELETED', `Destination ${id} removed from MySQL`);
  return { success: true, id };
}

// ─── REAL-TIME STATS ──────────────────────────────────────────────────────────
export async function getRealtimeStats() {
  const [[orderStats]] = await mysqlPool.query(
    'SELECT COUNT(*) as totalOrders, IFNULL(SUM(amount_paid), 0) as totalRevenue FROM orders'
  );
  const [[{ verifiedAgents }]] = await mysqlPool.query(
    "SELECT COUNT(*) as verifiedAgents FROM travel_agents WHERE status = 'VERIFIED'"
  );
  const [[{ registeredUsers }]] = await mysqlPool.query(
    'SELECT COUNT(*) as registeredUsers FROM users'
  );
  const [recentOrders] = await mysqlPool.query(
    'SELECT * FROM orders ORDER BY created_at DESC LIMIT 5'
  );
  const [[{ itineraryCount }]] = await mysqlPool.query(
    'SELECT COUNT(*) as itineraryCount FROM itineraries'
  );

  return {
    totalOrders: orderStats.totalOrders || 0,
    totalRevenue: parseFloat(orderStats.totalRevenue) || 0,
    verifiedAgents: verifiedAgents || 0,
    registeredUsers: registeredUsers || 0,
    itineraryCount: itineraryCount || 0,
    recentOrders,
    databaseEngine: 'MySQL 8.0.33 (Real-Time)',
    isMysqlConnected: true,
    timestamp: new Date().toISOString()
  };
}

export function getDbStatus() {
  return {
    engine: 'MySQL 8.0.33',
    connected: isMysqlConnected,
    host: `${dbConfig.host}:${dbConfig.port}`,
    database: dbConfig.database,
    socketPath: isRemote ? null : MYSQL_SOCKET,
    error: mysqlError
  };
}

export function getMysqlPool() {
  return mysqlPool;
}

export default {
  initDatabase,
  executeQuery,
  // Destinations
  getAllDestinations,
  getDestinationById,
  saveDestination,
  deleteDestination,
  // Itineraries
  getAllItineraries,
  getItineraryById,
  getPopularDestinations,
  insertItinerary,
  getItineraryCount,
  // Orders & Payments
  insertOrder,
  initiateOrder,
  updateOrderStatus,
  getOrders,
  getOrderById,
  getPayments,
  updateOrderEmailStatus,
  // Users
  upsertUser,
  getUserByEmail,
  // Agents
  saveAgent,
  getAgents,
  updateAgentStatus,
  getAgentByEmailOrGst,
  // Wishlist
  toggleWishlist,
  getWishlist,
  // Activity
  logActivity,
  getRecentActivities,
  // Stats
  getRealtimeStats,
  getDbStatus,
  getMysqlPool
};
