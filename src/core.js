#!/usr/bin/env node
/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import express from 'express';
import createMcpServer from './createMcpServer.js';
import https from 'https';
import cors from 'cors';
import debug from 'debug';
import fs from 'fs';
import selfsigned from 'selfsigned';
import { ca } from 'zod/v4/locales';
const log = debug('main');

// setup express server


async function core() {
	// setup for change to persistence session
	const appEnv = {
		HTTPS: (process.env.HTTPS != null && process.env.HTTPS.toUpperCase() === 'TRUE')?  true : false,
		tls: null,
		mcpSessions: {},
		store: null,
		casSessionId: null,
		computeSessionId: null
	};
	const app = express();
	app.use(express.json());
	app.use(cors({
		origin: "*",
		exposedHeaders: ['Mcp-Session-Id'],
		allowedHeaders: ["Accept", "Authorization", "Content-Type", "If-None-Match", "Accept-language", "Mcp-Session-Id"],
		// allowedHeaders: ['Content-Type', 'mcp-session-id'],
	}));

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

			let { _mcpServer, transport } = await createMcpServer('http',appEnv);

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
	const handleRequest2 = async (req, res) => {
		try {
			debugger;

			log(req.headers);
			// new server and transport on each invocation
			// let mcpServer handle the request
			log('Request body:', req.body);
			res.json({ x: 1 })

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
	app.post('/mcp2', handleRequest2);

	// Start the server
	const PORT = process.env.PORT || 8080;

	// get user specified TLS options 
	if (process.env.TLS_CRT != null && fs.existsSync(process.env.TLS_CRT) === true) {
		let options = {};
		options.key = fs.readFileSync(process.env.TLS_KEY, { encoding: 'utf8' });
		options.cert = fs.readFileSync(process.env.TLS_CRT, { encoding: 'utf8' });
		options.ca = fs.readFileSync(process.env.TLS_CA, { encoding: 'utf8' });
		appEnv.tls = options;
	}

	// place holder - https server has issues as mcp server
	if (appEnv.HTTPS === true) {
		if (appEnv.tls === null) {
			appEnv.tls = await getTls();
			appEnv.tls.requestCert = false;
			appEnv.tls.rejectUnauthorized = false;
		}
		
		console.log(`MCP Server listening on port ${PORT}`);
		console.log('Visit https://localhost:8080/health for health check');
		console.log('Configure your mcp host to use https://localhost:8080/mcp to interact with the MCP server');
		console.log('Press Ctrl+C to stop the server');
		let server = https.createServer(appEnv.tls);
		server.listen(PORT, () => {
		});
	} else {
		console.log(`MCP Server listening on port ${PORT}`);
		console.log('Visit http://localhost:8080/health for health check');
		console.log('Configure your mcp host to use http://localhost:8080/mcp to interact with the MCP server');
		console.log('Press Ctrl+C to stop the server');
	
		let appServer = app.listen(PORT, () => {
		});
		process.on('SIGTERM', () => {
			console.log('Server closed');
			appServer.close(() => {
				
			});
			process.exit(0);
		});
		process.on('SIGINT', () => {
			console.log('Server closed');
			appServer.close(() => {
				
			});
			process.exit(0);
		});
	}

	async function getTls() {
		let options = {
			keySize: 2048,
			days: 360,
			algorithm: "sha256",
			clientCertificate: true,
			extensions: {},
		};
		let tlscreate = (process.env.TLS_CREATE == null) 
		? 'TLS_CREATE=C:US,ST:NC,L:Cary,O:SAS Institute,OU:STO,CN:localhost,ALT:na.sas.com'
		: process.env.TLS_CREATE;
		let subjt = tlscreate.replaceAll('"', '').trim();
		let subj = subjt.split(',');

		let d = {};
		subj.map(c => {
			let r = c.split(':');
			d[r[0]] = r[1];
			return { value: r[1] };
		});

		let attr = [
			{
				name: 'commonName',
				value: d.CN /*process.env.APPHOST*/,
			},
			{
				name: 'countryName',
				value: d.C
			}, {
				shortName: 'ST',
				value: d.ST
			}, {
				name: 'localityName',
				value: d.L,
			}, {
				name: 'organizationName',
				value: d.O
			},
			{
				shortName: 'OU',
				value: d.OU
			}
		];


		let pems = selfsigned.generate(attr);
		console.log
		let tls = {
			cert: pems.cert,
			key: pems.private
		};
		console.log('Generated self-signed TLS certificate');
		return tls;


	}
}

export default core;