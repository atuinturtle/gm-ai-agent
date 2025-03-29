// db/migrations.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

// This file is used to run migrations programmatically
async function runMigrations() {
  // Load database connection string from environment variables
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("Error: DATABASE_URL not found in environment variables");
    process.exit(1);
  }

  // Create a PostgreSQL connection pool
  const pool = new Pool({ connectionString });
  
  // Create a Drizzle instance (without schema, as we're just running migrations)
  const db = drizzle(pool);

  console.log('Running migrations...');
  
  try {
    // Run migrations from the specified directory
    await migrate(db, { migrationsFolder: 'drizzle/migrations' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run migrations when this file is executed directly
if (require.main === module) {
  runMigrations().catch(console.error);
}

export { runMigrations };