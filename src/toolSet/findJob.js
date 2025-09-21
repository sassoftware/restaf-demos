/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _listJobs from '../toolhelpers/_listJobs.js';
function findJob() {
  let llmDescription= {
  "purpose": "Map natural language requests to findJob parameters and return structured results.",
  "param_mapping": {
    "name": "required - single name. If missing, ask 'Which job name would you like to find?'.",
    "server": "infer 'cas' or 'sas' from prompt; default 'cas'"
  },
  "response_schema": "{ jobs: Array<string|object> }",
  "behavior": ["Return only JSON matching response_schema when invoked by an LLM. If no matches, return { jobs: [] }. Surface server errors directly.",
    { "input": "find job xyz", "mapped_params": { "name": "Public" } }
  ]
};
  let description = `
  ## findJob — locate one or more jobs on CAS or SAS

  Purpose
  - Locate a job on a specified server (CAS or SAS). 

  What it returns
  - An object with a single property, jobs, which is an array of matching job names or metadata objects (when available). If no matches are found, the array is empty.

  Key features
  - Accepts a single job name
  - Returns either an array of matching job names or an array of metadata objects (when available) describing each job.

  Parameters
  - name (string, required): Job name to find.
 

  Behavior
  - Case-sensitive matching on most servers; exact match preferred. 
  - The tool surfaces server errors directly.

  Usage examples
  - "find job xyz" 
 

  Response format
  - The tool returns an object with a single property, \`libraries\`, which is an array of matching library names or metadata objects. If no matches are found, the array is empty.

  Clarifying questions
  - If the input is ambiguous (e.g., no name provided), the tool should prompt: 'Which library name would you like to find?'.
  `;


  let spec = {
    name: 'findJob',
    description: description,
    schema: {
      name: z.string(),
      server: z.string()
    },
    required: ['name'],
    handler: async (params) => {
      let r = await _listJobs(params);
      return r;

    }
  }
  return spec;
}
export default findJob;
