import { Anthropic } from '@anthropic-ai/sdk';

class AnthropicClient {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic();
  }

  async generateText(prompt: string) {
    return this.anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1000,
        temperature: 1,
        system: "Respond only with short poems.",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              }
            ]
          }
        ]
      });
  }
}

export default AnthropicClient;