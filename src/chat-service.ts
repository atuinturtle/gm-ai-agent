// chat-service.ts - Service that uses repositories to handle chat operations
import { Conversation, Message } from './models';
import { DatabaseService } from './repository-interfaces';

export class ChatService {
  private currentConversationId?: number;
  
  constructor(private dbService: DatabaseService) {}

  async initialize(): Promise<void> {
    await this.dbService.initialize();
  }

  async createConversation(title: string): Promise<number> {
    const conversationRepo = this.dbService.getConversationRepository();
    const conversationId = await conversationRepo.create(title);
    this.currentConversationId = conversationId;
    return conversationId;
  }

  async saveMessage(sender: 'user' | 'system', content: string): Promise<void> {
    if (!this.currentConversationId) {
      throw new Error('No active conversation. Please create a conversation first.');
    }

    const messageRepo = this.dbService.getMessageRepository();
    await messageRepo.create({
      role: sender as 'user' | 'assistant',
      content: content,
      timestamp: new Date().toISOString(),
      conversation_id: this.currentConversationId
    });
  }

  async getConversationHistory(): Promise<Message[]> {
    if (!this.currentConversationId) {
      return [];
    }

    const messageRepo = this.dbService.getMessageRepository();
    return await messageRepo.findByConversationId(this.currentConversationId);
  }

  async listConversations(): Promise<Conversation[]> {
    const conversationRepo = this.dbService.getConversationRepository();
    return await conversationRepo.findAll();
  }

  async loadConversation(id: number): Promise<Conversation | null> {
    const conversationRepo = this.dbService.getConversationRepository();
    const conversation = await conversationRepo.findById(id);
    
    if (conversation) {
      this.currentConversationId = conversation.id;
    }
    
    return conversation;
  }

  async getCurrentConversation(): Promise<Conversation | null> {
    if (!this.currentConversationId) {
      return null;
    }

    const conversationRepo = this.dbService.getConversationRepository();
    return await conversationRepo.findById(this.currentConversationId);
  }

  async close(): Promise<void> {
    await this.dbService.close();
  }
}