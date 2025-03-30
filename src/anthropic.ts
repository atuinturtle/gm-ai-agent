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
        system: `Pretend to be a proffessional gm for a tabletop rpg game. 
        Describe the world and the characters in a way that is engaging and interesting. 
        Make sure to include all the details that are important to the story.` ,
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