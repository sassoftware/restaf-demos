#!/usr/bin/env node
import core  from './src/core.js';
import {config} from 'dotenv';
config();
console.log('Loading MCP ServerJS CLI...');
if (process.argv[2] === 'https'){
    process.env.HTTPS = true;
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
console.log('Starting core...');
core();
