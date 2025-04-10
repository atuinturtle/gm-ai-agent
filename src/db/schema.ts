import { pgTable, serial, timestamp, text, integer } from "drizzle-orm/pg-core";

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
  alias: text('alias').default('').notNull(),
  background: text('background').notNull(),
  heritage: text('heritage').notNull(),
});

export const playbooks = pgTable('playbooks', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // e.g., Cutter, Hound, Leech, Lurk, etc.
  description: text('description').notNull(),
});

export const abilities = pgTable('abilities', {
  id: serial('id').primaryKey(), 
  playbook_id: serial('playbook_id')
    .notNull()
    .references(() => playbooks.id),
  name: text('name').notNull(),
  description: text('description').notNull(),
});

export const character_abilities = pgTable('character_abilities', {
  id: serial('id').primaryKey(),
  character_id: serial('character_id')
    .notNull()
    .references(() => player_characters.id),
  ability_id: serial('ability_id')
    .notNull()
    .references(() => abilities.id),
  acquired_at: timestamp('acquired_at').defaultNow().notNull(),
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

export const character_actions = pgTable('character_actions', {
  id: serial('id').primaryKey(),
  character_id: serial('character_id')
    .notNull()
    .references(() => player_characters.id),
  action_id: serial('action_id')
    .notNull()
    .references(() => actions.id),
  rating: integer('rating').default(0).notNull(),
});

export const crews = pgTable('crews', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  crew_type_id: serial('crew_type_id')
    .notNull()
    .references(() => crew_types.id),
  reputation: integer('reputation').default(0).notNull(),
  hold: integer('hold').default(0).notNull(),
  tier: integer('tier').default(0).notNull(),
  heat: integer('heat').default(0).notNull(),
  wanted_level: integer('wanted_level').default(0).notNull(),
  coins: integer('coins').default(0).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const crew_types = pgTable('crew_types', {
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
export type Playbook = typeof playbooks.$inferSelect;