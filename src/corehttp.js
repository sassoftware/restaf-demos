
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


// setup express server

async function corehttp(appEnv) {
	// setup for change to persistence session
	const app = express();
	app.use(express.json());
	app.use(cors({
		origin: "*",
		exposedHeaders: ['mcp-session-id'],
		allowedHeaders: ["Accept", "Authorization", "Content-Type", "If-None-Match", "Accept-language", "mcp-session-id"],

	}));

	// setup routes
	app.get('/health', (req, res) => {
		console.error('Received request for health endpoint');

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
		let transport;
		try {
			let sessionId = req.headers['mcp-session-id'];
			console.error('MCP session id:', sessionId);
			if (sessionId && appEnv.transports[sessionId]) {
				console
				transport = appEnv.transports[sessionId];
			} else {
				// create a new transport
				console.error('Creating new transport for session');
				
				transport = await createMcpServer(appEnv);
				//console.error(transport);
			}

		} catch (error) {
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
		await transport.handleRequest(req, res, req.body);

	}

	app.post('/mcp', handleRequest);

	// Start the server
	const PORT = appEnv.PORT; 

	// get user specified TLS options 
	console.error('HTTPS=', appEnv.HTTPS);
	if (appEnv.SSLCERT != null && appEnv.HTTPS === true) {
		let tlsdir = appEnv.SSLCERT;
		let options = {};
		if (tlsdir != null && fs.existsSync(`${tlsdir}/key.pem`) === true) {
			options.key = fs.readFileSync(`${tlsdir}/key.pem`, { encoding: 'utf8' });
			options.cert = fs.readFileSync(`${tlsdir}/crt.pem`, { encoding: 'utf8' });
			if (fs.existsSync(`${tlsdir}/ca.pem`) === true) {
				options.ca = fs.readFileSync(`${tlsdir}/ca.pem`, { encoding: 'utf8' });
			}
			appEnv.tls = options;
		}
	}


	// place holder - https server has issues as mcp server
	if (appEnv.HTTPS === true) {
		if (appEnv.tls === null) {
			appEnv.tls = await getTls();
			appEnv.tls.requestCert = false;
			appEnv.tls.rejectUnauthorized = false;
		}

		console.error(`[Note] MCP Server listening on port ${PORT}`);
		console.error('[Note] Visit https://localhost:8080/health for health check');
		console.error('[Note] Configure your mcp host to use https://localhost:8080/mcp to interact with the MCP server');
		console.error('[Note] Press Ctrl+C to stop the server');

		let server = https.createServer(appEnv.tls, app);
		server.listen(PORT, () => {
		});
	} else {

		console.error(`[Note] MCP Server listening on port ${PORT}`);
		console.error('[Note] Visit http://localhost:8080/health for health check');
		console.error('[Note] Configure your mcp host to use http://localhost:8080/mcp to interact with the MCP server');
		console.error('[Note] Press Ctrl+C to stop the server');


		let appServer = app.listen(PORT, () => {
		});
		process.on('SIGTERM', () => {
			console.error('Server closed');
			appServer.close(() => {

			});
			process.exit(0);
		});
		process.on('SIGINT', () => {
			console.error('Server closed');
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
		let tlscreate = (appEnv.TLS_CREATE == null)
			? 'TLS_CREATE=C:US,ST:NC,L:Cary,O:SAS Institute,OU:STO,CN:localhost,ALT:na.sas.com'
			: appEnv.TLS_CREATE;
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
				value: d.CN  
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
		console.error('Generated self-signed TLS certificate');
		console.error(pems)
		// selfsigned generates a new keypair
		let tls = {
			cert: pems.cert,
			key: pems.private
		};
		console.error('Generated self-signed TLS certificate');
		return tls;


	}
}

export default corehttp;