/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _listLibrary from '../toolhelpers/_listLibrary.js';
function findLibrary() {

  let desc = `
  ## findLibrary — locate one or more libraries on CAS or SAS

  Purpose
  - Locate one or more library names on a specified server (CAS or SAS). Designed for concise natural-language prompts and programmatic calls.

  Key features
  - Accepts a single library name or a comma/space-separated list of names and repeats the lookup for each.
  - Returns either an array of matching library names or an array of metadata objects (when available) describing each library.

  Parameters
  - name (string, required): Library name to find. Can be a single name or a comma-separated list (e.g. "Public, sasuser").
  - server (string, optional): 'cas' or 'sas'. Default: 'cas'.

  Behavior
  - Case-insensitive matching on most servers; exact match preferred. If multiple names provided, results are returned in the same order as input.
  - If no matches are found, the tool returns an empty array.
  - The tool surfaces server errors directly.

  Usage examples
  - "find library Public in cas server"
  - "find library sasuser in sas server"
  - "find library Public, Samples in cas"

  Clarifying questions
  - If the input is ambiguous (e.g., no name provided), the tool should prompt: 'Which library name would you like to find?'.
  `;


  let spec = {
    name: 'findlibrary',
    description: desc,
    llmDescription: `{
  "purpose": "Map natural language requests to findLibrary parameters and return structured results.",
  "param_mapping": {
    "name": "required - single name or comma-separated list. If missing, ask 'Which library name would you like to find?'.",
    "server": "infer 'cas' or 'sas' from prompt; default 'cas'"
  },
  "response_schema": "{ libraries: Array<string|object> }",
  "behavior": "Return only JSON matching response_schema when invoked by an LLM. If multiple names provided, return results in the same order. If ambiguous, ask one short clarifying question.",
  "examples": [
    { "input": "find library Public in cas server", "mapped_params": { "name": "Public", "server": "cas" } },
    { "input": "find library sasuser", "mapped_params": { "name": "sasuser" } }
  ]
}`,
    schema: {
      name: z.string(),
      server: z.string()
    },
    required: ['name'],
    handler: async (params) => {
      let r = await _listLibrary(params);
      return r;

    }
  }
  return spec;
}
export default findLibrary;
