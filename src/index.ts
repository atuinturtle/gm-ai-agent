import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { conversations, messages } from './db/schema';
import { eq } from 'drizzle-orm';
import AnthropicClient from './anthropic';

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(process.env.DATABASE_URL as string, { prepare: false })
export const db = drizzle(client);

const anthropic = new AnthropicClient();

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
