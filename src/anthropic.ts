import { Anthropic } from '@anthropic-ai/sdk';

type Message = {
  role: "user" | "assistant";
  content: string;
}

class AnthropicClient {
  private anthropic: Anthropic;
  private conversationHistory: Message[] = [];

  constructor() {
    this.anthropic = new Anthropic();
  }

  async generateText(prompt: string): Promise<any> {
    this.addMessageToHistory("user", prompt);

    const response = await this.anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1000,
        temperature: 1,
        system: `Pretend to be a proffessional gm for a tabletop rpg game. 
        Describe the world and the characters in a way that is engaging and interesting. 
        Make sure to include all the details that are important to the story.` ,
        messages: this.conversationHistory
      });

    this.addMessageToHistory("assistant", response.content[0].text);

    return response;
  }

  private addMessageToHistory(role: "user" | "assistant", content: string): void {
    this.conversationHistory.push({ role, content });
  }
}

export default AnthropicClient;