import { pgTable, serial, timestamp, text } from "drizzle-orm/pg-core";

export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  created_at: timestamp('created_at').notNull()
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversation_id: serial('conversation_id')
    .notNull()
    .references(() => conversations.id),
  sender: text('sender').notNull(),
  content: text('content').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

export const player_characters = pgTable('player_characters', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  background: text('background').notNull(),
  heritage: text('heritage').notNull(),
});

export const attributes = pgTable('attributes', { 
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
});

export const actions = pgTable('actions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  attribute_id: serial('attribute_id')
    .notNull()
    .references(() => attributes.id),
});

export const abilities = pgTable('abilities', {
  id: serial('id').primaryKey(), 
  name: text('name').notNull(),
  description: text('description').notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type PlayerCharacter = typeof player_characters.$inferSelect;
export type NewPlayerCharacter = typeof player_characters.$inferInsert;
export type Attribute = typeof attributes.$inferSelect;
export type Action = typeof actions.$inferSelect;
export type Ability = typeof abilities.$inferSelect;
