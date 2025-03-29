// db/schema.ts - Drizzle schema definitions
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

// Define the conversations table
export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  created_at: timestamp('created_at').notNull()
});

// Define the messages table
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversation_id: integer('conversation_id')
    .notNull()
    .references(() => conversations.id),
  sender: text('sender').notNull(),
  content: text('content').notNull(),
  timestamp: timestamp('timestamp').notNull()
});

// Define types based on the schema (for type safety)
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;