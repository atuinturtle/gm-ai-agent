// index.ts
import { Anthropic } from '@anthropic-ai/sdk';

// Bun automatically loads environment variables from .env files
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("Error: ANTHROPIC_API_KEY not found in environment variables");
  process.exit(1);
}

// Initialize the Anthropic client with your API key
const anthropic = new Anthropic({
  apiKey: apiKey,
});

// Function to generate a response from Claude
async function askClaude(userMessage: string) {
  try {
    // Create a message using the Anthropic API
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219", // Using the latest Claude model as of your date
      max_tokens: 1024,
      messages: [
        { role: "user", content: userMessage }
      ],
    });

    // The response contains the AI's message
    console.log("Claude's response:");
    console.log(response.content[0].text);
    
    // Return the response if you want to use it elsewhere
    return response.content[0].text;
  } catch (error) {
    console.error("Error calling Anthropic API:", error);
    throw error;
  }
}

// Call the function with a test message
async function main() {
  const question = `Pretend to be GM for the game Blades in the Dark.`;
  console.log(`Asking Claude: "${question}"`);
  await askClaude(question);
}

// Run the main function
main().catch(error => {
  console.error(error);
});