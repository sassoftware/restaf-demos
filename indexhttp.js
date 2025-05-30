#!/usr/bin/env node
/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import express from 'express';
import createMcpServer from './createMcpServer.js';
import tools from './tools.js';
import cors from 'cors';

// setup express server
const app = express();
app.use(express.json());
app.use(cors())

// setup routes
app.get('/health', (req, res) => {
	console.log('Received request for health endpoint');
	debugger;
	res.json({
		name: 'Notes MCP Server',
		version: '1.0.0',
		description: 'A Model Context Protocol server for managing notes',
		endpoints: {
			mcp: '/mcp',
			sse: '/sse',
			health: '/health'
		},
		usage: 'Use with MCP Inspector or compatible MCP clients like vscode or your own MCP client'
	});
});

// Root endpoint info
app.get('/', (req, res) => {
	res.json({
		name: 'Notes MCP Server',
		version: '1.0.0',
		description: 'A Model Context Protocol server for managing notes',
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
		console.log(req.headers);
		// new server and transport on each invocation
		let { mcpServer, transport } = await createMcpServer('http', tools(), null, null);

		// let mcpServer handle the request
		console.log('Request body:', req.body);
		await transport.handleRequest(req, res, req.body);

	} catch (error) {
		console.error('Error handling MCP request:', error);
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
app.listen(PORT, () => {
	console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
});