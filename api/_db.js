import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'srv1947.hstgr.io',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'u762329739_v3',
  password: process.env.DB_PASSWORD || 'Shah$@789',
  database: process.env.DB_NAME || 'u762329739_v3db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  connectTimeout: 20000
};

let pool = null;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
}

export function parseRequestBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (e) {
      return {};
    }
  }
  return req.body;
}

let schemaInitialized = false;

export async function ensureSchema(p) {
  if (schemaInitialized) return;
  try {
    // 1. users table
    await p.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        full_name VARCHAR(120) NOT NULL,
        email VARCHAR(160) NOT NULL UNIQUE,
        mobile VARCHAR(30),
        whatsapp VARCHAR(30),
        role ENUM('customer', 'admin', 'agent') DEFAULT 'customer',
        password_hash VARCHAR(255),
        security_pin VARCHAR(50),
        preferred_travel_type VARCHAR(60) DEFAULT 'Family / Leisure',
        preferred_budget_tier VARCHAR(60) DEFAULT 'Standard',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // 2. orders table
    await p.query(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id VARCHAR(64) PRIMARY KEY,
        itinerary_id VARCHAR(64) NOT NULL,
        itinerary_title VARCHAR(255) NOT NULL,
        destination VARCHAR(100) NOT NULL,
        customer_name VARCHAR(120) NOT NULL,
        customer_email VARCHAR(160) NOT NULL,
        customer_mobile VARCHAR(30),
        customer_address TEXT,
        amount_paid DECIMAL(10, 2) NOT NULL DEFAULT 99.00,
        payment_method VARCHAR(60) DEFAULT 'UPI / Razorpay Gateway',
        razorpay_payment_id VARCHAR(100) DEFAULT '',
        razorpay_order_id VARCHAR(100) DEFAULT '',
        status VARCHAR(32) DEFAULT 'PAID',
        email_sent BOOLEAN DEFAULT FALSE,
        email_sent_to VARCHAR(160),
        agent_name VARCHAR(120),
        agent_phone VARCHAR(40),
        agent_email VARCHAR(160),
        agent_whatsapp VARCHAR(40),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. payments table
    await p.query(`
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

    // 4. travel_agents table
    await p.query(`
      CREATE TABLE IF NOT EXISTS travel_agents (
        id VARCHAR(64) PRIMARY KEY,
        agency_name VARCHAR(160) NOT NULL,
        founder_name VARCHAR(120),
        gst_number VARCHAR(50),
        phone VARCHAR(40),
        email VARCHAR(160),
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
        business_proof_url LONGTEXT,
        business_proof_size INT DEFAULT 0,
        logo_name VARCHAR(255),
        logo_url LONGTEXT,
        social_link VARCHAR(500),
        status VARCHAR(32) DEFAULT 'VERIFIED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. saved_itineraries table
    await p.query(`
      CREATE TABLE IF NOT EXISTS saved_itineraries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_email VARCHAR(160) NOT NULL,
        itinerary_id VARCHAR(64) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_user_itinerary (user_email, itinerary_id)
      );
    `);

    // 6. Ensure pdf_url is LONGTEXT in itineraries and created_itineraries_by_travel_agents
    try {
      await p.query(`ALTER TABLE itineraries MODIFY COLUMN pdf_url LONGTEXT`);
    } catch (e) {}
    try {
      await p.query(`ALTER TABLE created_itineraries_by_travel_agents MODIFY COLUMN pdf_url LONGTEXT`);
    } catch (e) {}
    try {
      await p.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_address TEXT`);
    } catch (e) {}

    schemaInitialized = true;
  } catch (err) {
    console.warn('[ensureSchema note]:', err.message);
  }
}
