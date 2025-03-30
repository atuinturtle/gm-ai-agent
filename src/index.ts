import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { conversations } from './db/schema';

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(process.env.DATABASE_URL as string, { prepare: false })
export const db = drizzle(client);

db.select().from(conversations).then(console.log);