#!/usr/bin/env node
/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import corehttp from './corehttp.js';
import createMcpServer from './createMcpServer.js';


async function core() {
	const appEnv = {
		HTTPS: (process.env.HTTPS != null && process.env.HTTPS.toUpperCase() === 'TRUE') ? true : false,
		tls: null,
		transports: {},
		mcpServer: null,
		store: null,
		casServer: null,
		casSessionId: null,
		computeSessionId: null,
		mcpType: process.env.MCPTYPE || 'stdio'
	};
	console.error(`MCP Type: ${appEnv.mcpType}`);
	if (appEnv.mcpType === 'http') {
		console.error('[Note]MCP Server starting with HTTP transport');
		await corehttp(appEnv);
	} else {
		console.error('[Note] MCP Server starting with stdio transport');
		/*
		const transport = await createMcpServer(appEnv);
		await transport.start();
		*/
		await createMcpServer(appEnv);
	}
}

export default core;