import { db } from "./db/db";
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { PlayerService } from "./service/player_service";

const server = new McpServer({
    name: "session",
    version: "0.1.0",
    capabilities: {
        resources: {
        },
        tools: {
        },
    },
});

server.resource(
    "current_player",
    new ResourceTemplate("player://current", { list: undefined}),
    async () => ({
        contents: [{
            uri: "player://current",
            text: JSON.stringify(await new PlayerService().getCharacterWithDetails(1))
        }]
    })
)

server.tool(
    "get_current_players",
    { sessionId: z.number() },
    async ({ sessionId }) => {
        const player = await new PlayerService().getCharacterWithDetails(sessionId);
        return { 
            content: [{
                type: "text",
                text: JSON.stringify([player])
            }]
        };
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Session MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});