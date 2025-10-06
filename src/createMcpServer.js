
/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { randomUUID } from "node:crypto"
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js"
import toolSet from './toolSet/index.js';


async function createMcpServer(appEnv) {

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



  toolSet.forEach(tool => {
    // (`Registering tool in createMcpServer  : ${JSON.stringify(tool)}`);
   
    mcpServer.tool(
      tool.name,
      tool.description,
      tool.schema,
      tool.handler
    )
  })
  appEnv.mcpServer = mcpServer;
  debugger;
  let transport = (appEnv.mcpType === 'http') 
  ? new StreamableHTTPServerTransport({
    sessionIdGenerator: ()=> randomUUID(),
    enableJsonResponse: true,
    onsessioninitialized: (sessionId) => {
      appEnv.transports[sessionId] = transport;

    }
  })
  : new StdioServerTransport(/*{
    sessionIdGenerator: ()=> randomUUID(),
    enableJsonResponse: true,
    onsessioninitialized: (sessionId) => {
      appEnv.transports[sessionId] = transport;

    }
  }*/);

  console.error('[Note] Created MCP Server', transport);
  console.error('[Note] Transport mode:====================================', appEnv.mcpType);
  await mcpServer.connect(transport);
  return transport;
  
}
export default createMcpServer;