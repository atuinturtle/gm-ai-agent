// services/ConversationService.ts
import { Anthropic } from '@anthropic-ai/sdk';
import { Conversation, Message } from '../db/schema';
import { injectable, inject } from 'inversify';
import { 
  IConversationRepository, 
  IMessageRepository, 
  IConversationService,
  TYPES 
} from '../di/interfaces';

@injectable()
export class ConversationService implements IConversationService {
  private anthropic: Anthropic;
  
  constructor(
    @inject(TYPES.ConversationRepository) private conversationRepo: IConversationRepository,
    @inject(TYPES.MessageRepository) private messageRepo: IMessageRepository,
    @inject(TYPES.ApiKey) apiKey: string
  ) {
    // Initialize the Anthropic client
    this.anthropic = new Anthropic({
      apiKey: apiKey,
    });
  }

  // Create a new conversation
  async createConversation(title: string): Promise<Conversation> {
    return this.conversationRepo.createWithTimestamp(title);
  }

  // Get a conversation by ID, including all messages
  async getConversationWithMessages(id: number): Promise<{ conversation: Conversation, messages: Message[] } | undefined> {
    const conversation = await this.conversationRepo.findById(id);
    
    if (!conversation) {
      return undefined;
    }
    
    const messages = await this.messageRepo.findByConversationId(id);
    
    return { conversation, messages };
  }

  // Add a user message to a conversation and get a response from Claude
  async sendMessageAndGetResponse(conversationId: number, userMessage: string): Promise<{ userMessage: Message, assistantMessage: Message }> {
    // First, add the user message to the conversation
    const userMsg = await this.messageRepo.addToConversation(
      conversationId,
      'user',
      userMessage
    );
    
    // Get the conversation history
    const messages = await this.messageRepo.findByConversationId(conversationId);
    
    // Prepare the message history for Claude
    const messageHistory = messages.map(msg => ({
      role: msg.sender as 'user' | 'assistant',
      content: msg.content
    }));
    
    try {
      // Call Claude with the conversation history
      const response = await this.anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1024,
        messages: messageHistory,
      });
      
      // Add Claude's response to the conversation
      const assistantMsg = await this.messageRepo.addToConversation(
        conversationId,
        'assistant',
        response.content[0].type
      );
      
      return { userMessage: userMsg, assistantMessage: assistantMsg };
    } catch (error) {
      console.error("Error calling Anthropic API:", error);
      
      // Add an error message to the conversation
      const errorMsg = await this.messageRepo.addToConversation(
        conversationId,
        'assistant',
        'Sorry, I encountered an error while processing your request.'
      );
      
      return { userMessage: userMsg, assistantMessage: errorMsg };
    }
  }

  // Get recent conversations
  async getRecentConversations(limit: number = 10): Promise<Conversation[]> {
    return this.conversationRepo.findRecent(limit);
  }
}