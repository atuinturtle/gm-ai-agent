import { Anthropic } from "@anthropic-ai/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import readline from "readline/promises";
import dotenv from "dotenv";
import type { MessageParams, Resource, Tool } from "@anthropic-ai/sdk/resources/messages.mjs";

class AnthropicClient {
  private mcp: Client;
  private anthropic: Anthropic;
  private transport: StdioClientTransport | null = null;
  private tools: Tool[] = [];
  private resources: Resource[] = [];
  private conversationHistory: MessageParams[] = [];

  constructor() {
    this.anthropic = new Anthropic();
    this.mcp = new Client({ name: "gm-agent", version: "0.1.0" });
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<Anthropic.Messages.Message> {
    this.addMessageToHistory("user", prompt);
    console.log(this.conversationHistory);

    const response = await this.anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1000,
        temperature: 1,
        system: systemPrompt,
        messages: this.conversationHistory,
        tools: this.tools
      });

    this.addMessageToHistory("assistant", response.content[0].text);
    console.log(this.conversationHistory);

    return response;
  }

  private addMessageToHistory(role: "user" | "assistant", content: string): void {
    this.conversationHistory.push({ role, content });
  }

  async getTools() : Promise<Tool[]> {
    try {
      const toolsResult = await this.mcp.listTools();
      return toolsResult.tools.map((tool) => {
        return {
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema
        };
      });
    } catch (e) {
      console.log("Failed to get tools: ", e);
      return [];
    }
  }

  async getResources() : Promise<Resource[]> {
    try {
      const resourcesResult = await this.mcp.listResources();
      return resourcesResult.resources.map((resource) => {
        return {
        uri: resource.uri,
        name: resource.name,
        description: resource.description,
        inputSchema: resource.inputSchema,
      };
    });
    } catch (e) {
      console.log("Failed to get resources: ", e);
      return [];
    }
  }

  async connectToServer(serverScriptPath: string) {
    try {
      const command = Bun.which("bun") ?? "bun";

      this.transport = new StdioClientTransport({
        command,
        args: [serverScriptPath],
      });
      await this.mcp.connect(this.transport);

      this.tools = await this.getTools();
      this.resources = await this.getResources();
      console.log("Connected to MCP server with tools: %s and resources: %s", this.tools.map(({ name }) => name), this.resources.map(({ name }) => name));
    } catch (e) {
      console.log("Failed to connect to MCP server: ", e);
      throw e;
    }
  }
}

export default AnthropicClient;