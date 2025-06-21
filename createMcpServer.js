
/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import toolSet from './toolSet/index.js';
import debug from 'debug';
const log = debug('mcpserver');

async function createMcpServer(mode) {
  // Create an MCP server

  const mcpServer = new McpServer({
    name: 'SAS Viya Sample MCP Server',
    version: '0.3.0'
  }, { capabilities: {
      tools: {
        listChanged: true
      },
    }
  });

  // Register the addition tool
  // TBD: Register resources and prompts


  console.log(`Creating MCP server in ${mode} mode`);
  toolSet.forEach(tool => {
    log(`Registering tool in createMcpServer  : ${tool.name}`);
    mcpServer.tool(
      tool.name,
      tool.description,
      tool.schema,
      tool.handler
    )
  })

  // Create the transport based on the mode
  const transport = (mode === 'http')
    ? new StreamableHTTPServerTransport({
       sessionIdGenerator: undefined,
        enableJsonResponse: true , 
        port:8080,
        host: 'localhost',
        endpoint: '/mcp',
        reponseMode: 'stream'
      })
    : new StdioServerTransport();
  console.log('Using transport:', transport);
  await mcpServer.connect(transport);
  return { mcpServer, transport };
  
}
export default createMcpServer;