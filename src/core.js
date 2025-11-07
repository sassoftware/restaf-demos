#!/usr/bin/env node
/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import corehttp from './corehttp.js';

async function core(cache,mcpType,appEnvBase) {
	if (mcpType === 'http') {
		console.error('[Note]MCP Server starting with HTTP transport');
		await corehttp(cache, appEnvBase);
	} else {
		console.error('[Note] MCP Server starting with stdio transport');
		let mcpServer = cache.get("mcpServer");
		await createMcpTransport(mcpServer,mcpType,appEnvBase);
	}
}

export default core;