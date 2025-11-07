
/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
async function coreSSE(mcpServer) { 
  let transport = new StdioServerTransport();
  await mcpServer.connect(transport);
  console.error("MCP Server connected over stdio transport.");
  return transport;
}
export default coreSSE;