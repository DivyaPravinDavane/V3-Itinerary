import { initDatabase, getDbStatus } from './db.js';

console.log('====================================================');
console.log('V3Itinerary MySQL Database Setup & Health Check');
console.log('====================================================');

async function main() {
  const success = await initDatabase();
  const status = getDbStatus();

  console.log('\nDatabase Connection Summary:');
  console.log('-----------------------------');
  console.log(`Type:       ${status.type}`);
  console.log(`Host:       ${status.host}`);
  console.log(`Database:   ${status.database}`);
  console.log(`User:       ${status.user}`);
  console.log(`Status:     ${status.connected ? 'ONLINE (Connected to MySQL)' : 'OFFLINE (Hybrid Fallback Mode)'}`);
  if (status.error) {
    console.log(`Error:      ${status.error}`);
    console.log('\nTips to configure MySQL:');
    console.log('1. Ensure MySQL server is running (e.g. `brew services start mysql` or MySQL Workbench)');
    console.log('2. Check your `.env` file credentials: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME');
  } else {
    console.log('\nAll tables created & ready for live orders!');
  }
  console.log('====================================================\n');
  process.exit(0);
}

main();
