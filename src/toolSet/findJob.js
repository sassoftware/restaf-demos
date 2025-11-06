/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _listJobs from '../toolhelpers/_listJobs.js';
function findJob(_appContext) {
  let llmDescription= {
  "purpose": "Map natural language requests to find a job in SAS Viya and return structured results.",
  "param_mapping": {
    "name": "required - single name. If missing, ask 'Which job name would you like to find?'.",

  },
  "response_schema": "{ jobs: Array<string|object> }",
  "behavior": "Return only JSON matching response_schema when invoked by an LLM. If no matches, return { jobs: [] }"
};
  let description = `
  ## findJob — locate a specific SAS Viya job

  LLM Invocation Guidance
  Use THIS tool when the user intent is to check if ONE job exists or retrieve its metadata:
  - "find job cars_job_v4"
  - "does job sales_summary exist"
  - "is there a job named churnScorer"
  - "lookup job forecast_monthly"
  - "verify job ETL_Daily" 

  Do NOT use this tool when the user asks for:
  - A list or browse of many jobs (use listJobs)
  - Do not use this tool if the user want to find lib, find table, and similar requests
  - Executing a job (use job)
  - Running a job definition (use jobdef)
  - Submitting arbitrary code (use program)

  Purpose
  Quickly determine whether a named job asset is present in the Viya environment and return its entry (or an empty result if not found).

  Parameters
  - name (string, required): Exact job name (case preserved). If multiple tokens/names supplied, take the first and ignore the rest; optionally ask for a single name.

  Behavior & Matching
  - Attempt exact match first (backend determines sensitivity).
  - Returns { jobs: [...] } where array length is 0 (not found) or 1+ (if backend returns multiple with the same display name).
  - No fuzzy guesses—never fabricate a job.
  - If no name provided: ask "Which job name would you like to find?".

  Response Contract
  - Always: { jobs: Array<string|object> }
  - On error: propagate structured server error (do not wrap in prose when invoked programmatically).

  Disambiguation Rules
  - Input only "find job" → ask for missing name.
  - Input contains verbs like "run" or "execute" → use job or jobdef instead.
  - Input requesting many (e.g., "find all jobs") → use listJobs.

  Examples (→ mapped params)
  - "find job cars_job_v4" → { name: "cars_job_v4" }
  - "does job ETL exist" → { name: "ETL" }
  - "is there a job named metricsRefresh" → { name: "metricsRefresh" }

  Negative Examples (should NOT call findJob)
  - "list jobs" (listJobs)
  - "run job cars_job_v4" (job)
  - "execute jobdef cars_job_v4" (jobdef)

  Clarifying Question Template
  - Missing name: "Which job name would you like to find?"
  - Multiple names: "Please provide just one job name (e.g. 'cars_job_v4')."

  Notes
  - For bulk existence checks loop over names and call findJob per name.
  - Combine with job tool if user wants to execute after confirming existence.
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
