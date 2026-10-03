-- ==============================================================================
-- V3Itinerary Platform - MySQL Database Schema
-- Database: v3_itinerary
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS v3_itinerary CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE v3_itinerary;

-- 1. Users Table (Customer & Admin Accounts)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  mobile VARCHAR(30),
  role ENUM('customer', 'admin') DEFAULT 'customer',
  password_hash VARCHAR(255),
  preferred_travel_type VARCHAR(60) DEFAULT 'Family / Leisure',
  preferred_budget_tier VARCHAR(60) DEFAULT 'Standard',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Destinations Master Table
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

-- 3. Itineraries Table (Destinations & Certified Travel Blueprints)
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

-- 3b. Created Itineraries by Travel Agents (Dedicated Agent Blueprints Table for phpMyAdmin)
CREATE TABLE IF NOT EXISTS created_itineraries_by_travel_agents (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  region VARCHAR(100) DEFAULT 'Domestic',
  duration_days INT NOT NULL DEFAULT 5,
  duration_nights INT NOT NULL DEFAULT 4,
  traveler_type VARCHAR(60) NOT NULL DEFAULT 'Family',
  total_access_price DECIMAL(10,2) DEFAULT 99.00,
  estimated_trip_cost DECIMAL(12, 2) NOT NULL DEFAULT 55000.00,
  agency_name VARCHAR(160) NOT NULL,
  founder_name VARCHAR(120),
  agent_gst VARCHAR(50),
  agent_phone VARCHAR(40),
  agent_email VARCHAR(160),
  agent_city VARCHAR(80),
  agent_state VARCHAR(80),
  cover_image VARCHAR(512),
  overview TEXT,
  best_time_to_visit VARCHAR(120),
  inclusions_json JSON,
  exclusions_json JSON,
  days_json JSON,
  hotels_json JSON,
  budget_breakdown_json JSON,
  status ENUM('PUBLISHED', 'DRAFT', 'ARCHIVED') DEFAULT 'PUBLISHED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_agent_email (agent_email),
  KEY idx_agent_gst (agent_gst),
  KEY idx_destination (destination)
);

CREATE OR REPLACE VIEW agent_created_itineraries AS 
SELECT * FROM created_itineraries_by_travel_agents;

-- 4. Orders & Payments Table (Flat ₹99 Purchases & Razorpay Gateway Transactions)
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

-- 4. Saved Itineraries (Customer Wishlist)
CREATE TABLE IF NOT EXISTS saved_itineraries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(160) NOT NULL,
  itinerary_id VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_itinerary (user_email, itinerary_id)
);

-- 5. Verified Travel Agents Onboarding
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
