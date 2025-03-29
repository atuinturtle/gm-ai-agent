// di/interfaces.ts
import { Conversation, Message, NewConversation, NewMessage } from '../db/schema';

// Repository interfaces
export interface IBaseRepository<T, InsertT> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | undefined>;
  create(data: InsertT): Promise<T>;
  update(id: number, data: Partial<InsertT>): Promise<T | undefined>;
  delete(id: number): Promise<boolean>;
}

export interface IConversationRepository extends IBaseRepository<Conversation, NewConversation> {
  findByTitle(title: string): Promise<Conversation[]>;
  createWithTimestamp(title: string): Promise<Conversation>;
  findRecent(limit?: number): Promise<Conversation[]>;
}

export interface IMessageRepository extends IBaseRepository<Message, NewMessage> {
  findByConversationId(conversationId: number): Promise<Message[]>;
  addToConversation(conversationId: number, sender: string, content: string): Promise<Message>;
  getLatestFromConversation(conversationId: number): Promise<Message | undefined>;
}

// Service interfaces
export interface IConversationService {
  createConversation(title: string): Promise<Conversation>;
  getConversationWithMessages(id: number): Promise<{ conversation: Conversation, messages: Message[] } | undefined>;
  sendMessageAndGetResponse(conversationId: number, userMessage: string): Promise<{ userMessage: Message, assistantMessage: Message }>;
  getRecentConversations(limit?: number): Promise<Conversation[]>;
}

// Symbol identifiers for dependency injection
export const TYPES = {
  Database: Symbol.for('Database'),
  ConversationRepository: Symbol.for('ConversationRepository'),
  MessageRepository: Symbol.for('MessageRepository'),
  ConversationService: Symbol.for('ConversationService'),
  ApiKey: Symbol.for('ApiKey')
};