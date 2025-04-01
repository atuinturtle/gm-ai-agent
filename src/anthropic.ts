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

  async generateText(prompt: string, systemPrompt?: string): Promise<Anthropic.Messages.Message> {
    this.addMessageToHistory("user", prompt);
    console.log(this.conversationHistory);

    const response = await this.anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1000,
        temperature: 1,
        system: systemPrompt,
        messages: this.conversationHistory
      });

    this.addMessageToHistory("assistant", response.content[0].text);
    console.log(this.conversationHistory);

    return response;
  }

  private addMessageToHistory(role: "user" | "assistant", content: string): void {
    this.conversationHistory.push({ role, content });
  }
}

export default AnthropicClient;