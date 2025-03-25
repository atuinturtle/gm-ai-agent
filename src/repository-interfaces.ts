// repository-interfaces.ts - Define repository interfaces
import { Conversation, Message } from './models';

export interface ConversationRepository {
  create(title: string): Promise<number>; // Return the ID of created conversation
  findById(id: number): Promise<Conversation | null>;
  findAll(): Promise<Conversation[]>;
}

export interface MessageRepository {
  create(message: Omit<Message, 'id'>): Promise<number>; // Return the ID of created message
  findByConversationId(conversationId: number): Promise<Message[]>;
}

export interface DatabaseService {
  initialize(): Promise<void>;
  close(): Promise<void>;
  getConversationRepository(): ConversationRepository;
  getMessageRepository(): MessageRepository;
}