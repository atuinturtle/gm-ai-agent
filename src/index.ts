// index.ts
import 'reflect-metadata'; // Required for InversifyJS
import { container } from './di/container';
import { TYPES, IConversationService } from './di/interfaces';
import { testConnection } from './db/connection';
import { runMigrations } from './db/migrations';

async function main() {
  // First, run database migrations if needed
  await runMigrations();
  
  // Test database connection
  const connectionSuccessful = await testConnection();
  if (!connectionSuccessful) {
    console.error("Failed to connect to the database. Exiting...");
    process.exit(1);
  }
  
  // Get the conversation service from the container
  const conversationService = container.get<IConversationService>(TYPES.ConversationService);
  
  // Create a new conversation
  const conversation = await conversationService.createConversation(
    'Blades in the Dark GM Conversation'
  );
  console.log('Created new conversation:', conversation);
  
  // Send a message and get a response
  const result = await conversationService.sendMessageAndGetResponse(
    conversation.id,
    'Pretend to be GM for the game Blades in the Dark.'
  );
  
  console.log('\nUser Message:');
  console.log(result.userMessage.content);
  
  console.log('\nClaude\'s Response:');
  console.log(result.assistantMessage.content);
  
  // Get recent conversations
  const recentConversations = await conversationService.getRecentConversations();
  console.log('\nRecent conversations:');
  console.log(recentConversations);
}

// Run the main function
main().catch(error => {
  console.error('An error occurred:', error);
});