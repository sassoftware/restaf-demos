
/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import toolSet from './toolSet/index.js';


async function createMcpServer(mode) {
  //const log = debug('mcpserver');
  // Create an MCP server

  const mcpServer = new McpServer({
    name: 'Viya-scoring-mcp-server',
    version: '0.3.0'
  }, { capabilities: {
      tools: {
        listChanged: true
      },
    }
  });

  // Register the addition tool
  // TBD: Register resources and prompts


 // log(`Creating MCP server in ${mode} mode`);
  toolSet.forEach(tool => {
    // (`Registering tool in createMcpServer  : ${JSON.stringify(tool)}`);
    mcpServer.tool(
      tool.name,
      tool.description,
      tool.schema,
      tool.handler
    )
  })

  const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true 
      });

  console.error('[Note] Transport mode:', mode);
  await mcpServer.connect(transport);
  return { mcpServer, transport };
  
}
export default createMcpServer;