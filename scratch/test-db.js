const { db } = require('./lib/db');
const { newsletter } = require('./lib/schema');
const { sql } = require('drizzle-orm');

async function test() {
  try {
    console.log('Testing DB connection and newsletter table...');
    const tables = await db.execute(sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
    console.log('Tables in DB:', tables.rows.map(r => r.table_name));
    
    const count = await db.select().from(newsletter);
    console.log('Newsletter count:', count.length);
    console.log('SUCCESS');
    process.exit(0);
  } catch (err) {
    console.error('DATABASE ERROR:', err);
    process.exit(1);
  }
}

test();
