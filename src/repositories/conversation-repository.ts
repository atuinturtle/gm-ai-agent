// repositories/ConversationRepository.ts
import { BaseRepository } from './baserepository';
import { conversations, Conversation, NewConversation } from '../db/schema';
import { sql } from 'drizzle-orm';
import { injectable, inject } from 'inversify';
import { IConversationRepository, TYPES } from '../di/interfaces';

@injectable()
export class ConversationRepository extends BaseRepository<Conversation, NewConversation> implements IConversationRepository {
  constructor(
    @inject(TYPES.Database) db: any
  ) {
    super(conversations, db, conversations.id);
  }

  // Add conversation-specific methods here
  async findByTitle(title: string): Promise<Conversation[]> {
    return this.db
      .select()
      .from(conversations)
      .where(sql`${conversations.title} ILIKE ${`%${title}%`}`);
  }

  async createWithTimestamp(title: string): Promise<Conversation> {
    const newConversation: NewConversation = {
      title,
      created_at: new Date()
    };
    
    return this.create(newConversation);
  }

  // Get most recent conversations
  async findRecent(limit: number = 10): Promise<Conversation[]> {
    return this.db
      .select()
      .from(conversations)
      .orderBy(sql`${conversations.created_at} DESC`)
      .limit(limit);
  }
}