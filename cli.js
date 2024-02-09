#!/usr/bin/env node
import main from './packages/gptViyaCli/main.js';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
main();
