
/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";


async function createMcpServer(mode, tools, prompts, resources) {
  // Create an MCP server

  const mcpServer = new McpServer({
    name: "demo",
    version: "1.0.0"
  }, { capabilities: {
      tools: {
        listChanged: true
      },
    }
  });

  // Register the addition tool

  tools.forEach(tool => {
    console.log(`Registering tool: ${tool.name}`);
    console.log(`Description: ${tool.description}`);  
    console.log(`Schema: ${JSON.stringify(tool.schema)}`);
    mcpServer.tool(
      tool.name,
      tool.description,
      tool.schema,
      tool.handler
    )
  })

  // Register the prompts(TBD)
  // Register resources(TBD)

  // create a transport for the mcp server

  const transport = (mode === "http")
    ? new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true })
    : new StdioServerTransport();

  await mcpServer.connect(transport);
  return { mcpServer, transport };

}
export default createMcpServer;