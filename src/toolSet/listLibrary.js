/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _listLibrary from '../toolhelpers/_listLibrary.js';
function listLibrary() {
  let llmDescription = {
  "purpose": "Map natural language requests to the listLibrary tool parameters and return a compact, machine-readable response.",
  "param_mapping": {
    "server": "infer from keywords 'cas' or 'sas' (default 'cas')",
    "limit": "positive integer. if not specified, set limit to 1",
    "start": "1-indexed offset. if not specified, set start to 1",
    "where": "optional filter string, default ''"
  },
  "response_schema": "{ libraries: string[] }",
  "behavior": "Return only a JSON object matching response_schema. Use defaults when params missing. If ambiguous, ask one short clarifying question. If no results, return { libraries: [] }. Include pagination hint: nextStart = start + limit.",
  "examples": [
    { "input": "list sas libs", "mapped_params": { "server": "sas" } },
    { "input": "show me cas libraries, 20 per page", "mapped_params": { "server": "cas", "limit": 20 } },
    { "input": "next", "note": "interpret as start = previousStart + previousLimit" }
  ],
  "clarification_rules": "If server not inferable and user message short, ask: 'Do you mean CAS or SAS?'. If user asks for 'all', suggest paging and ask preferred page size.",
  "safety": "Do not call external services beyond the tool; surface tool errors as structured error objects."
};

  let description = `
  ## listLibrary — list libraries in a CAS or SAS server

  Purpose
  This tool returns the libraries available on the specified server (CAS or SAS).
  It is designed to be used with natural-language prompts: The LLM will map flexible user requests to the parameters below (for example, "show me SAS libs" → { server: 'sas' }).

  Key features
  - Pagination support: use \`start\` and \`limit\` to page through results.
  - Filtering: a lightweight \`where\` string may be supplied for server-side filtering if supported.

  Parameters
  - server (string, optional): 'cas' or 'sas'. Default: 'cas'.
  - limit (number, optional): Maximum number of libraries to return. If not specified, defaults to 10.
  - start (number, optional): 1-indexed offset for paging. Default: 1.
  - where (string, optional): Optional filter expression (server-dependent). Default: ''

  Behavior and response
  - Returns an array of library names (strings) by default, e.g. ["SASHELP","SASUSER"].
  - Response is deterministic for identical parameters; change \`start\`/\`limit\` to paginate.
 
  Pagination example
  - First page: { server: 'cas', start: 1, limit: 10 }
  - Nextpage:  { server: 'cas', start: 11, limit: 10 }

  Pagination instructions
  - if the returned number of libraries equals the limit, include \`nextStart\` in the response (nextStart = start + limit) to indicate more results may be available.

  Usage tips
  - Short prompts like "list sas libs" are automatically translated to { server: 'sas' }.
  - To inspect a library contents use the \`listTables\` tool after obtaining the library name.
  - If you need a full inventory, increase \`limit\` and page through results; consider server-side limits.

  Error handling
  - The tool surfaces server errors and empty results. If no libraries are returned, try adjusting \`server\`, \`where\`, or \`start\`.

  Sample prompts
  - "List libraries in the cas" - this maps to { server: 'cas', limit: 10, start: 1 }
  - "Show sas libraries" - this maps to { server: 'sas', limit: 10, start: 1 }
  - "List libraries in cas with limit 20" - this maps to { server: 'cas', limit: 20, start: 1 }
  - "List next 10 libraries" - this maps to { server: 'cas', start: (last limit + 1), limit: 10 }

  `;


  let spec = {
    name: 'Listlibrary',
    description: description,
    schema: {
      server: z.string().default('cas'),
      limit: z.number().default(10),
      start: z.number(),
      where: z.string().default('')
    },
    required: ['server'],
    handler: async (params) => {
      let r = await _listLibrary(params);
      return r;

    }
  }
  return spec;
}
export default listLibrary;
