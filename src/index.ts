
import AnthropicClient from './anthropic';
import { PlayerService } from './service/player_service';

const anthropic = new AnthropicClient();
const playerService = new PlayerService();

await anthropic.connectToServer("src/session_mcp_server.ts");

await anthropic.generateText(
    `Welcome the user to the game. 
        Generate a starting situation that provides the crew with a clear goal, 
        but be patient and let the players take their time to react.
        Only move on to the heist when there is a clear plan then ask the player for the detail for the plan.
        The six possible plans are:
        - Assault Do violence to a target. Detail: The point of attack.
        - Deception Lure, trick, or manipulate. Detail: The method of deception.
        - Stealth Trespass unseen. Detail: The point of infiltration.
        - Occult Engage a supernatural power. Detail: The arcane method.
        - Social Negotiate, bargain, or persuade. Detail: The social connection.
        - Transport Carry cargo or people through danger. Detail: The route & means.
        Make sure to include all the details that are important to the story.`, 
    `You are a professional gm, and writer for the tabletop rpg game Blades in the Dark. 
        Describe the world and the characters in a way that is engaging and interesting. 
        You are in freeplay, so so there is no structure to the conversation.
        Your aim should be to give the crew opportunities to for heists.
        Make sure to include all the details that are important to the story.
        Use the senses to describe the world. Be descriptive and evocative, but don't be too verbose.`
).then((res) => {
    console.log(res.content[0]?.text ?? "No response");
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
    console.log(res.content[0]?.text ?? "No response");
});
