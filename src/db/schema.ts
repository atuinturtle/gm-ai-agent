import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  title: varchar('title').notNull(),
  created_at: timestamp('created_at').notNull()
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversation_id: serial('conversation_id')
    .notNull()
    .references(() => conversations.id),
  sender: varchar('sender').notNull(),
  content: varchar('content').notNull(),
  created_at: timestamp('created_at').notNull()
});
