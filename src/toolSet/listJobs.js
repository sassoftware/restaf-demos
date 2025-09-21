/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _listJobs from '../toolhelpers/_listJobs.js';
function listJobs() {
  let llmDescription = {
  "purpose": "Map natural language requests tJobs tool parameters and return a compact, machine-readable response.",
  "param_mapping": {
    "limit": "positive integer. if not specified, set limit to 1",
    "start": "1-indexed offset. if not specified, set start to 1",
    "where": "optional filter string, default ''"
  },
  "response_schema": "{ : string[] }",
  "behavior": "Return only a JSON object matching response_schema. Use defaults when params missing. If ambiguous, ask one short clarifying question. If no results, return { : [] }. Include pagination hint: nextStart = start + limit.",
  "examples": [
    { "input": "list jobs", "mapped_params": { "server": "sas" } },
    { "input": "show me jobs , 20 per page", "mapped_params": { "limit": 20 } },
    { "input": "next", "note": "interpret as start = previousStart + previousLimit" }
  ],
  
  "safety": "Do not call external services beyond the tool; surface tool errors as structured error objects."
};

  let description = `
  ## listJobs — list jobs defined on the server

  Purpose
  This tool returns the  available jobs on the Viya server
  It is designed to be used with natural-language prompts: The LLM will map flexible user requests to the parameters below (for example, "show me SAS libs" → { server: 'sas' }).

  Key features
  - Pagination support: use \`start\` and \`limit\` to page through results.
  - Filtering: a lightweight \`where\` string may be supplied for server-side filtering if supported.

  Parameters
  - limit (number, optional): Maximum number of  to return. If not specified, defaults to 10.
  - start (number, optional): 1-indexed offset for paging. Default: 1.
  - where (string, optional): Optional filter expression (server-dependent). Default: ''

  Behavior and response
  - Returns an array of job names (strings) by default, e.g. ["A", "b""].
  - Response is deterministic for identical parameters; change \`start\`/\`limit\` to paginate.
 
  Pagination example
  - First page: {  start: 1, limit: 10 }
  - Nextpage:  {  start: 11, limit: 10 }

  Pagination instructions
  - if the returned number of  equals the limit, include \`nextStart\` in the response (nextStart = start + limit) to indicate more results may be available.

  Usage tips
  - Short prompts like "list sas jobs" are automatically translated to { server: 'sas' }.
  - If you need a full inventory, increase \`limit\` and page through results; consider server-side limits.

  Error handling
  - The tool surfaces server errors and empty results. If no  are returned, try adjusting \`server\`, \`where\`, or \`start\`.

  Sample prompts
  - "listjobs" - this maps to {  limit: 10, start: 1 

  `;


  let spec = {
    name: 'ListJobs',
    description: description,
    schema: {
      limit: z.number().default(10),
      start: z.number().default(1),
      where: z.string().default('')
    },
    required: ['server'],
    handler: async (params) => {
      let r = await _listJobs(params);
      return r;

    }
  }
  return spec;
}
export default listJobs;
