/**
 * startMysql.js — Starts the local MySQL 8.0.33 tarball server.
 * Run: node server/startMysql.js
 */

import { execSync, spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const MYSQL_DIR = path.join(ROOT, 'mysql-8.0.33-macos13-x86_64');
const MYSQL_DATA = path.join(ROOT, 'mysql-data');
const MYSQL_BIN = path.join(MYSQL_DIR, 'bin', 'mysqld');
const MYSQL_SOCK = '/tmp/mysql_v3.sock';
const MYSQL_PID = '/tmp/mysql_v3.pid';
const MYSQL_LOG = path.join(MYSQL_DATA, 'mysql-error.log');

// Check if MySQL tarball exists
if (!fs.existsSync(MYSQL_BIN)) {
  console.error(`❌ MySQL binary not found at: ${MYSQL_BIN}`);
  process.exit(1);
}

// Check if already running
try {
  const pid = execSync('pgrep -f mysqld 2>/dev/null', { encoding: 'utf-8' }).trim();
  if (pid) {
    console.log(`✅ MySQL already running (PID: ${pid})`);
    console.log(`   Socket: ${MYSQL_SOCK}`);
    process.exit(0);
  }
} catch { /* not running */ }

console.log('🚀 Starting MySQL 8.0.33...');

const mysqld = spawn(MYSQL_BIN, [
  `--basedir=${MYSQL_DIR}`,
  `--datadir=${MYSQL_DATA}`,
  `--socket=${MYSQL_SOCK}`,
  '--port=3306',
  `--pid-file=${MYSQL_PID}`,
  `--log-error=${MYSQL_LOG}`,
  '--daemonize'
], { stdio: 'inherit' });

mysqld.on('exit', (code) => {
  if (code === 0) {
    setTimeout(() => {
      try {
        const pid = execSync('pgrep -f mysqld', { encoding: 'utf-8' }).trim();
        console.log(`✅ MySQL 8.0.33 started (PID: ${pid})`);
        console.log(`   Socket:   ${MYSQL_SOCK}`);
        console.log(`   Data dir: ${MYSQL_DATA}`);
        console.log(`   Log:      ${MYSQL_LOG}`);
        console.log('\n📋 Now run: node server/server.js\n');
      } catch {
        console.error('❌ MySQL failed to start. Check log:', MYSQL_LOG);
        process.exit(1);
      }
    }, 2000);
  } else {
    console.error(`❌ mysqld exited with code ${code}`);
    console.error(`   Check error log: ${MYSQL_LOG}`);
    process.exit(1);
  }
});
