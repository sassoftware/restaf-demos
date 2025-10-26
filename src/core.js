#!/usr/bin/env node
/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import corehttp from './corehttp.js';
//import	corehttproot from './corehttproot.js';
import createMcpServer from './createMcpServer.js';

async function core(appEnv) {
	if (appEnv.mcpType === 'http') {
		console.error('[Note]MCP Server starting with HTTP transport');
		
		await corehttp(appEnv);
	} else {
		console.error('[Note] MCP Server starting with stdio transport');
		await createMcpServer(appEnv);
	}
}

export default core;