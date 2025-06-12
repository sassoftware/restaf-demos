#!/usr/bin/env node

/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import createMcpServer from './createMcpServer.js';
import tools from './tools.js'; // Adjust the import path as needed

createMcpServer('stdio')
    .then(({ mcpServer, transport }) => {
        console.log('MCP Server is running...')
    })
    .catch(err => {
        console.error('Error starting MCP Server:', err);
        process.exit(1);
    });
