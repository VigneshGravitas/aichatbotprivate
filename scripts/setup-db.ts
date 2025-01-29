import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';

// Load environment variables
config({
  path: '.env.local',
});

async function setupDatabase() {
  try {
    // First connect to the default database to create our database
    const sql = postgres('postgresql://SA:Welcom@1234@inf-sw-dbs1-css.u1.niceondemand.com:5432/postgres', { 
      max: 1,
      ssl: false,
    });

    console.log('Connected to PostgreSQL server');

    // Create the database if it doesn't exist
    await sql`CREATE DATABASE "chatbotDB"`;
    console.log('Created chatbotDB database');

    // Close the connection to the default database
    await sql.end();

    // Connect to our new database
    const chatbotSql = postgres('postgresql://SA:Welcom@1234@inf-sw-dbs1-css.u1.niceondemand.com:5432/chatbotDB', {
      max: 1,
      ssl: false,
    });

    // Create the uuid-ossp extension
    await chatbotSql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    console.log('Created uuid-ossp extension');

    await chatbotSql.end();
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
