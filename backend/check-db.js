// Quick script to check database connection
import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '306127',
  database: 'postgres', // Connect to default database first
});

try {
  await client.connect();
  console.log('✅ Connected to PostgreSQL');
  
  // Check if database exists
  const result = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = 'luyen_tap_tieu_hoc'"
  );
  
  if (result.rows.length === 0) {
    console.log('❌ Database "luyen_tap_tieu_hoc" does not exist');
    console.log('Creating database...');
    await client.query('CREATE DATABASE luyen_tap_tieu_hoc');
    console.log('✅ Database created!');
  } else {
    console.log('✅ Database "luyen_tap_tieu_hoc" exists');
  }
  
  await client.end();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

