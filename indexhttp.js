#!/usr/bin/env node
/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import express from 'express';
import createMcpServer from './createMcpServer.js';
import cors from 'cors';
import debug from 'debug';
const log = debug('main');

// setup express server
/*
var key = fs.readFileSync('./tls/tls.key');
var cert = fs.readFileSync('./tls/tls.crt');
let options = { key, cert };
*/
const app = express();
app.use(express.json());
app.use(cors())

// setup routes
app.get('/health', (req, res) => {
	log('Received request for health endpoint');
	debugger;
	res.json({
		name: '@sassoftware/mcp-server',
		version: '1.0.0',
		description: 'SAS Viya Sample MCP Server',
		endpoints: {
			mcp: '/mcp',
			health: '/health'
		},
		usage: 'Use with MCP Inspector or compatible MCP clients like vscode or your own MCP client'
	});
});

// Root endpoint info

app.get('/', (req, res) => {
	res.json({
		name: 'SAS Viya Sample MCP Server',
		version: '1.0.0',
		description: 'SAS Viya Sample MCP Server',
		endpoints: {
			mcp: '/mcp',
			health: '/health'
		},
		usage: 'Use with MCP Inspector or compatible MCP clients'
	});
});


// mcp endpoint - the key entrypoint for the MCP server
const handleRequest = async (req, res) => {
	try {
		debugger;
		log(req.headers);
		// new server and transport on each invocation
		
		let { _mcpServer, transport } = await createMcpServer('http');

		// let mcpServer handle the request
		log('Request body:', req.body);
		await transport.handleRequest(req, res, req.body);

	} catch (error) {
		log('Error handling MCP request:', error);
		if (!res.headersSent) {
			res.status(500).json({
				jsonrpc: '2.0',
				error: {
					code: -32603,
					message: JSON.stringify(error),
				},
				id: null,
			});
		}
	}

}
app.post('/mcp', handleRequest);

// Start the server
const PORT = process.env.PORT || 8080;
console.log(`MCP Server listening on port ${PORT}`);
console.log('Visit http://localhost:8080/health for health check');
console.log('Configure your mcp host to use http://localhost:8080/mcp to interact with the MCP server');
console.log('Press Ctrl+C to stop the server');
app.listen(PORT, () => {
	console.log(`Running...`);
});
