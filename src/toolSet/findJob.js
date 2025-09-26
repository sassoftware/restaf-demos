/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _listJobs from '../toolhelpers/_listJobs.js';
function findJob() {
  let llmDescription= {
  "purpose": "Map natural language requests to find a job in SAS Viya and return structured results.",
  "param_mapping": {
    "name": "required - single name. If missing, ask 'Which job name would you like to find?'.",

  },
  "response_schema": "{ jobs: Array<string|object> }",
  "behavior": "Return only JSON matching response_schema when invoked by an LLM. If no matches, return { jobs: [] }"
};
  let description = `
  ## findJob — locate one or more jobs on Viya Server

  Purpose
  - Locate a job on Viya Server

  What it returns
  - An object with a single property, job, which is an array of matching job names or metadata objects (when available). If no matches are found, the array is empty.

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
 
  `;


  let spec = {
    name: 'findJob',
    description: description,
    schema: {
      name: z.string()
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
