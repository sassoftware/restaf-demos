/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { randomUUID } from "node:crypto";

async function createHttpTransport( mcpServer) {
  
  let transport = null;
  try {
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      enableJsonResponse: true,
    });
    console.error("Connecting mcpServer to transport", transport);
    await mcpServer.connect(transport);
    console.error("Successfully connected to the mcp server");
  } catch (error) {
    console.error("Error connecting mcpServer to transport:", error);
  }

  return transport;
}
export default createHttpTransport;
