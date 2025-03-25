import { Database } from 'bun:sqlite';
import { Conversation, Message } from './models';
import { ConversationRepository, MessageRepository, DatabaseService } from './repository-interfaces';

export class SQLiteDatabase implements DatabaseService {
  private db: Database | null = null;
  private conversationRepo: SQLiteConversationRepository | null = null;
  private messageRepo: SQLiteMessageRepository | null = null;

  constructor(private dbPath: string = 'chat.db') {}

  async initialize(): Promise<void> {
    this.db = new Database(this.dbPath);
    
    // Create tables if they don't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        conversation_id INTEGER NOT NULL,
        FOREIGN KEY (conversation_id) REFERENCES conversations (id)
      );
    `);
    
    this.conversationRepo = new SQLiteConversationRepository(this.db);
    this.messageRepo = new SQLiteMessageRepository(this.db);
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  getConversationRepository(): ConversationRepository {
    if (!this.conversationRepo) {
      throw new Error('Database not initialized');
    }
    return this.conversationRepo;
  }

  getMessageRepository(): MessageRepository {
    if (!this.messageRepo) {
      throw new Error('Database not initialized');
    }
    return this.messageRepo;
  }
}

class SQLiteConversationRepository implements ConversationRepository {
  constructor(private db: Database) {}

  async create(title: string): Promise<number> {
    const now = new Date().toISOString();
    const result = this.db.run(
      'INSERT INTO conversations (created_at) VALUES (?)',
      [now]
    );
    return result.lastInsertId;
  }

  async findById(id: number): Promise<Conversation | null> {
    const conversation = this.db.query(
      'SELECT * FROM conversations WHERE id = ?'
    ).get(id) as Conversation | null;
    
    return conversation;
  }

  async findAll(): Promise<Conversation[]> {
    const conversations = this.db.query(
      'SELECT * FROM conversations ORDER BY created_at DESC'
    ).all() as Conversation[];
    
    return conversations;
  }
}

class SQLiteMessageRepository implements MessageRepository {
  constructor(private db: Database) {}

  async create(message: Omit<Message, 'id'>): Promise<number> {
    const result = this.db.run(
      'INSERT INTO messages (role, content, timestamp, conversation_id) VALUES (?, ?, ?, ?)',
      [message.role, message.content, message.timestamp, message.conversation_id]
    );
    return result.lastInsertId;
  }

  async findByConversationId(conversationId: number): Promise<Message[]> {
    const messages = this.db.query(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC'
    ).all(conversationId) as Message[];
    
    return messages;
  }
}
