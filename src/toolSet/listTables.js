/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import debug from 'debug';
import _listTables from '../toolhelpers/_listTables.js';


function listTables() {
  const log = debug('tools');
  let llmDescription =  {
  "purpose": "Map natural language requests to listTables parameters and return a compact machine-readable response.",
  "param_mapping": {
    "lib": "required - infer from phrases like 'in <lib>' or ask a short clarifying question if missing",
    "server": "infer 'cas' or 'sas' from prompt keywords; default 'cas'",
    "limit": "positive integer, default 10",
    "start": "1-indexed offset, default 1",
    "where": "optional filter string"
  },
  "response_schema": "{ tables: string[], nextStart?: number }",
  "behavior": "Return only JSON that matches response_schema. If ambiguous, ask one short clarifying question. If no results, return { tables: [] }. Include nextStart = start + limit when more results likely exist.",
  "clarification_rules": "If lib missing: 'Which library do you want to list tables from?'. If server ambiguous: 'Do you mean CAS or SAS?'. If user says 'next', interpret as start = previousStart + previousLimit.",
  "examples": [
    { "input": "list tables in samples in cas", "mapped_params": { "lib": "Samples", "server": "cas" } },
    { "input": "show me sashelp tables, 5 per page", "mapped_params": { "lib": "sashelp", "server": "sas", "limit": 5 } }
  ]
};

  let description = `
## listTables — list tables in a library on CAS or SAS

Purpose
- Return the tables contained in a specified library (lib) on either a CAS or SAS server.
- Designed for natural-language use: short prompts or full parameter objects are supported.

Parameters
- lib (string, required): Library name to inspect (e.g., 'Samples', 'sashelp').
- server (string, optional): 'cas' or 'sas'. Default: 'cas'.
- limit (number, optional): Maximum number of tables to return. Default: 10.
- start (number, optional): 1-indexed offset for paging. Default: 1.
- where (string, optional): Optional server-side filter expression (server-dependent).

Behavior & response
- Returns an ordered array of table names by default, e.g. ["WATER_CLUSTER","COSTCHANGE"].
- Use \`start\` and \`limit\` to page through results. Responses may include a pagination hint.
- If the server exposes richer metadata the result may include objects with additional fields (owner, rows, create time).

Pagination example
- First page: { lib: 'Samples', server: 'cas', start: 1, limit: 10 }
- Next page:  { lib: 'Samples', server: 'cas', start: 11, limit: 10 }

Usage tips
- Short user prompts like "list sas tables in sashelp" are mapped automatically.
- If you need full inventory, page through results rather than requesting extremely large limits.
- To inspect a specific table, use the \`tableInfo\` or \`readTable\` tools after obtaining the table name.

Errors
- The tool surfaces server errors and returns an empty array when no tables match.

`;

  let spec = {
    name: 'listTables',
    description: description,

    schema: {
      'lib': z.string(),
      'server': z.string(), // default server is 'cas'
      'limit': z.number().default(10),
      'start': z.number() 
    },
    required: ['lib'],
    handler: async (params) => { 
      // Check if the params.scenario is a string and parse it
      let r = await _listTables(params);
      return r;
    }
  }
  return spec;
}

export default listTables;
