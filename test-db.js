//const { Client } = require('pg');
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect()
  .then(() => {
    console.log('✅ Connected to Render PostgreSQL!');
    return client.end();
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
  });
