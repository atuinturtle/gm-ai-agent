// di/container.ts
import 'reflect-metadata'; // Required for InversifyJS
import { Container } from 'inversify';
import { db } from '../db/connection';
import { TYPES } from './interfaces';

// Repositories
import { IConversationRepository, IMessageRepository } from './interfaces';
import { ConversationRepository } from '../repositories/conversation-repository';
import { MessageRepository } from '../repositories/message-repository';

// Services
import { IConversationService } from './interfaces';
import { ConversationService } from '../services/conversation-service';

// Create and configure the container
const container = new Container({ defaultScope: 'Singleton' });

// Bind the database connection
container.bind(TYPES.Database).toConstantValue(db);

// Bind the API key
container.bind<string>(TYPES.ApiKey).toConstantValue(process.env.API_KEY || '');

// Bind repositories
container.bind<IConversationRepository>(TYPES.ConversationRepository).to(ConversationRepository);
container.bind<IMessageRepository>(TYPES.MessageRepository).to(MessageRepository);

// Bind services
container.bind<IConversationService>(TYPES.ConversationService).to(ConversationService);

export { container };