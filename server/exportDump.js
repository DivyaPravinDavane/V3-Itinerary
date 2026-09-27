/**
 * exportDump.js — Generates a 100% structured, readable MySQL dump file (v3_itinerary_dump.sql)
 * with explicit column names in INSERT statements and clean CREATE TABLE definitions.
 * 
 * Usage: node server/exportDump.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase, executeQuery } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

async function generateStructuredDump() {
  await initDatabase();

  const tables = ['users', 'destinations', 'travel_agents', 'itineraries', 'orders', 'saved_itineraries', 'activity_logs'];

  let sql = `-- ==============================================================================
-- V3ITINERARY COMPLETE MYSQL DATABASE DUMP (STRUCTURE + ALL DATA)
-- Generated: ${new Date().toISOString()}
-- Database: v3_itinerary
-- MySQL Version: 8.0.33
-- 
-- CONNECTION INSTRUCTIONS:
-- Host:      127.0.0.1 (or localhost)
-- Port:      3306
-- User:      root
-- Password:  (leave empty / blank)
-- Database:  v3_itinerary
-- Socket:    /tmp/mysql_v3.sock
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS \`v3_itinerary\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`v3_itinerary\`;

SET NAMES utf8mb4;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET @OLD_TIME_ZONE = @@TIME_ZONE, TIME_ZONE = '+00:00';

`;

  function escapeSqlVal(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return String(val);
    if (typeof val === 'boolean') return val ? '1' : '0';
    if (val instanceof Date) {
      return "'" + val.toISOString().slice(0, 19).replace('T', ' ') + "'";
    }
    if (typeof val === 'object') {
      val = JSON.stringify(val);
    }
    const str = String(val)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\0/g, '\\0')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
    return "'" + str + "'";
  }

  for (const table of tables) {
    console.log(`Exporting table: ${table}`);
    sql += `-- ==============================================================================
-- 1. Table structure for \`${table}\`
-- ==============================================================================

DROP TABLE IF EXISTS \`${table}\`;
`;

    const createRows = await executeQuery(`SHOW CREATE TABLE \`${table}\``);
    const createStmt = createRows[0]['Create Table'];
    sql += createStmt + ';\n\n';

    const rows = await executeQuery(`SELECT * FROM \`${table}\``);
    if (rows.length === 0) {
      sql += `-- No data records for table \`${table}\`\n\n`;
      continue;
    }

    const columns = Object.keys(rows[0]);
    sql += `-- ------------------------------------------------------------------------------
-- 2. Data records for table \`${table}\` (${rows.length} rows)
-- ------------------------------------------------------------------------------

LOCK TABLES \`${table}\` WRITE;
INSERT INTO \`${table}\` (` + columns.map(c => '`' + c + '`').join(', ') + `) VALUES\n`;

    const rowStrings = rows.map(r => {
      const vals = columns.map(c => escapeSqlVal(r[c]));
      return '  (' + vals.join(', ') + ')';
    });

    sql += rowStrings.join(',\n') + ';\nUNLOCK TABLES;\n\n';
  }

  sql += `-- ==============================================================================
-- Restore Original Server Session Variables
-- ==============================================================================
SET TIME_ZONE = @OLD_TIME_ZONE;
SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;

-- ==============================================================================
-- END OF V3ITINERARY DATABASE DUMP
-- ==============================================================================
`;

  const outputPath = path.join(ROOT, 'v3_itinerary_dump.sql');
  fs.writeFileSync(outputPath, sql, 'utf8');
  console.log(`✅ Successfully wrote structured dump to: ${outputPath}`);
  console.log(`   File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
  process.exit(0);
}

generateStructuredDump().catch(err => {
  console.error('❌ Dump export failed:', err);
  process.exit(1);
});
