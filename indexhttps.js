#!/usr/bin/env node
/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import express from 'express';
import createMcpServer from './createMcpServer.js'; // Adjust the import path as needed
import tools from './tools.js'; // Adjust the import path as needed
import https from 'https';
import { _lte, _templateLiteral } from 'zod/v4/core';

var key = fs.readFileSync('./tls/tls.key');
var cert = fs.readFileSync('./tls/tls.crt');
let options = { key, cert };

const app = express();
let server = https.createServer(options, app);
/*
app.use('/mcp', express.json());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if (req.method === 'OPTIONS') {
		res.sendStatus(200);
	} else {
		next();
	}
});
*/

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
		usage: 'Use with MCP Inspector or compatible MCP clients'
	});
});

// Root endpoint info
app.get('/', (req, res) => {

	debugger;
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

async function handleRequest(req, res) {
	try {
		debugger;
	
		// new server and transport on each invocation
		let {mcpServer,transport} = await createMcpServer(tools(),null, null);
		
		// let mcpServer handle the request
		await transport.handleRequest(req, res, req.body);
		return; //no-op
	} catch (error) {
		console.error('Error handling MCP request:', error);
		if (!res.headersSent) {
			res.status(500).json({
				jsonrpc: '2.0',
				error: {
					code: -32603,
					message: 'Internal server error',
				},
				id: null,
			});
		}
	}


}
// Handle POST requests for client-to-server communication
app.post('/mcp', (req, res) => {
	console.log('Received MCP request:', req.body);
	debugger;
	console.log(req.headers);
	handleRequest(req, res)
	.then (() => {
		
	})
	.catch((error) => {
		console.error('Error handling MCP request:', error);
		if (!res.headersSent) {
			res.status(200).json({
				jsonrpc: '2.0',
				error: {
					code: -32603,
					message: JSON.stringify(error),
				},
				id: null,
			});
		}
	});
});

app.get('/mcptest', (req, res) => {
	console.log('Received MCPtest request:', req.body);
	debugger;
	console.log(req.headers);
	handleRequest(req, res)
	.then (() => {
		console.log('MCP request handled successfully');
	})
	.catch((error) => {
		console.error('Error handling MCP request:', error);
		if (!res.headersSent) {
			res.status(200).json({
				jsonrpc: '2.0',
				error: {
					code: -32603,
					message: JSON.stringify(error),
				},
				id: null,
			});
		}
	});
});
// Start the server
const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
	console.log(`MCP Stateless Streamable HTTPS Server listening on port ${PORT}`);
});