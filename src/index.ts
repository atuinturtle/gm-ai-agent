import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { conversations, messages } from './db/schema';
import { eq } from 'drizzle-orm';
import AnthropicClient from './anthropic';

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(process.env.DATABASE_URL as string, { prepare: false })
export const db = drizzle(client);

const anthropic = new AnthropicClient();

await anthropic.generateText(
    `Welcome the user to the game. 
        Generate a starting situation that provides the crew with a clear goal.
        Make sure to include all the details that are important to the story.`, 
    `You are a professional gm for the tabletop rpg game Blades in the Dark. 
        Describe the world and the characters in a way that is engaging and interesting. 
        You are in freeplay, so so there is no structure to the conversation.
        Your aim should be to give the crew opportunities to for heists.
        Make sure to include all the details that are important to the story.
        Use the senses to describe the world. Be descriptive and evocative.`
).then((res) => {
    console.log(res.content[0].text);
});

console.log("Enter a prompt: ");
let prompt = "";

for await (const line of process.stdin) {
    prompt = line.toString().trim();
    break;
}

if (!prompt) {
    console.error("No prompt provided");
    process.exit(1);
}
console.log(prompt);
anthropic.generateText(prompt).then((res) => {
    console.log(res.content[0].text);
});
