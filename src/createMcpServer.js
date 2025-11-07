/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Creates and configures an MCP server instance.
 * @param {Object} cache - The session cache to store the MCP server instance.
 * @returns {Promise<McpServer>} The configured MCP server instance.  
 * @example
 * Notes: Handles both http and stdio transports scenarios
 * 
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import makeTools from "./toolSet/makeTools.js";

async function createMcpServer(cache, _appContext) {
  debugger;
  let mcpServer = new McpServer(
    {
      name: "sasmcp",
      version: "0.3.0",
    },
    {
      capabilities: {
        tools: {
          listChanged: true,
        },
      },
    }
  );
  let toolSet = makeTools(_appContext);

  //wrapping tool handler to pass _appContext
  //can be ignored or used as needed.

  const wrapf = (cache, builtin) => async (args) => {
    debugger;
    let currentId = cache.get('currentId');
    let _appContext = cache.get(currentId);
    let params;
    if (args == null) {
      params = {_appContext};
    } else {
      params = Object.assign({}, args, {_appContext});
    }
  
    debugger;
    console.error(params);
    let r = await builtin(params); 
    return r;
  }
    
  toolSet.forEach((tool, i) => {
    console.error(`\n[Note] Registering tool ${i + 1} : ${tool.name}`);
    let toolHandler = wrapf(cache, tool.handler);
    mcpServer.tool(tool.name, tool.description, tool.schema, toolHandler);
  });
  cache.set("mcpServer", mcpServer);
  return mcpServer;
}

export default createMcpServer;
