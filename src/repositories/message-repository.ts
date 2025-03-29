// repositories/MessageRepository.ts
import { messages, Message, NewMessage } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { injectable, inject } from 'inversify';
import { IMessageRepository, TYPES } from '../di/interfaces';
import { BaseRepository } from './baserepository';

@injectable()
export class MessageRepository extends BaseRepository<Message, NewMessage> implements IMessageRepository {
  constructor(
    @inject(TYPES.Database) db: any
  ) {
    super(messages, db, messages.id);
  }

  // Find messages by conversation ID
  async findByConversationId(conversationId: number): Promise<Message[]> {
    return this.db
      .select()
      .from(messages)
      .where(eq(messages.conversation_id, conversationId))
      .orderBy(messages.timestamp);
  }

  // Add a new message to a conversation
  async addToConversation(
    conversationId: number, 
    sender: string, 
    content: string
  ): Promise<Message> {
    const newMessage: NewMessage = {
      conversation_id: conversationId,
      sender,
      content,
      timestamp: new Date()
    };
    
    return this.create(newMessage);
  }

  // Get the latest message from a conversation
  async getLatestFromConversation(conversationId: number): Promise<Message | undefined> {
    const results = await this.db
      .select()
      .from(messages)
      .where(eq(messages.conversation_id, conversationId))
      .orderBy(sql`${messages.timestamp} DESC`)
      .limit(1);
      
    return results.length > 0 ? results[0] : undefined;
  }
}