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

export const characters = pgTable('characters', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  background: varchar('background').notNull(),
  heritage: varchar('heritage').notNull(),
  actions: varchar('actions').notNull(),
});

export const attributes = pgTable('attributes', { 
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description').notNull(),
});

export const actions = pgTable('actions', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description').notNull(),
  attribute_id: serial('attribute_id')
    .notNull()
    .references(() => attributes.id),
});

export const abilities = pgTable('abilities', {
  id: serial('id').primaryKey(), 
  name: varchar('name').notNull(),
  description: varchar('description').notNull(),
});