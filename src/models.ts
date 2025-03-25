// models.ts - Define our domain models
export interface Message {
    id?: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    conversation_id: number;
  }
  
  export interface Conversation {
    id?: number;
    created_at: string;
  }