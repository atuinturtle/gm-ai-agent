import { Anthropic } from "@anthropic-ai/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { MessageParam, Resource, Tool } from "@anthropic-ai/sdk/resources/messages.mjs";

class AnthropicClient {
  private mcp: Client;
  private anthropic: Anthropic;
  private transport: StdioClientTransport | null = null;
  private tools: Tool[] = [];
  private resources: Resource[] = [];
  private conversationHistory: MessageParam[] = [];

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

    for (const content of response.content) {
      if (content.type === "text") {
        this.addMessageToHistory("assistant", content.text);
      } else if (content.type === "tool_use") {
        const toolName = content.name;
        const toolArg = content.input as { [x: string]: unknown } | undefined;
        console.log("Tool use: %s with args: %s", toolName, toolArg);
        const toolResult = await this.mcp.callTool({
          name: toolName,
          arguments: toolArg
        });
        console.log("Tool result: %s", toolResult);
        this.addMessageToHistory("user", toolResult.content as string);
        const response = await this.generateText(toolResult.content as string, systemPrompt);
      }
    }
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