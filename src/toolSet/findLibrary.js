/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _listLibrary from '../toolhelpers/_listLibrary.js';
function findLibrary() {
  let llmDescription= {
  "purpose": "Map natural language requests to findLibrary parameters and return structured results.",
  "param_mapping": {
    "name": "required - single name. If missing, ask 'Which library name would you like to find?'.",
    "server": "infer 'cas' or 'sas' from prompt; default 'cas'"
  },
  "response_schema": "{ libraries: Array<string|object> }",
  "behavior": ["Return only JSON matching response_schema when invoked by an LLM. If no matches, return { libraries: [] }. Surface server errors directly.",
    { "input": "find library Public in cas server", "mapped_params": { "name": "Public", "server": "cas" } },
    { "input": "find lib Public", "mapped_params": { "name": "Public", "server": "cas" } },
    { "input": "find library sasuser in sas", "mapped_params": { "name": "sasuser", "server": "sas" } }
  ]
};
  let description = `
  ## findLibrary — locate one or more libraries on CAS or SAS

  Purpose
  - Locate a library on a specified server (CAS or SAS). 

  What it returns
  - An object with a single property, \`libraries\`, which is an array of matching library names or metadata objects (when available). If no matches are found, the array is empty.

  Key features
  - Accepts a single library name 
  - Returns either an array of matching library names or an array of metadata objects (when available) describing each library.

  Parameters
  - name (string, required): Library name to find.
  - server (string, optional): 'cas' or 'sas'. Default: 'cas'.

  Behavior
  - Case-insensitive matching on most servers; exact match preferred. 
  - The tool surfaces server errors directly.

  Usage examples
  - "find lib Public" is the same as "find library Public in cas"
  - "find library Public in cas server"
  - "find library sasuser in sas server"
  - "find library Public, Samples in cas"
  

  Response format
  - The tool returns an object with a single property, \`libraries\`, which is an array of matching library names or metadata objects. If no matches are found, the array is empty.

  Clarifying questions
  - If the input is ambiguous (e.g., no name provided), the tool should prompt: 'Which library name would you like to find?'.
  `;


  let spec = {
    name: 'findlibrary',
    description: description,
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
