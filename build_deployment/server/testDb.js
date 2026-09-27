import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function testConnection() {
  try {
    console.log("Connecting to MySQL...", {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      database: process.env.DB_NAME || 'v3_itinerary'
    });
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    console.log("✅ Successfully connected to MySQL server.");
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'v3_itinerary'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log("✅ Database created or exists.");
    await connection.end();
  } catch (error) {
    console.error("❌ MySQL Connection Failed:", error.message);
  }
}
testConnection();
