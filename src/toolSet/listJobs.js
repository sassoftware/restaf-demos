/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _listJobs from '../toolhelpers/_listJobs.js';
function listJobs() {
  // LLM guidance object retained for potential future consumption; not exported directly.
  let llmDescription = {
    purpose: "Map natural language requests to listJobs parameters and return a machine-readable response.",
    param_mapping: {
      limit: "positive integer. if not specified, set limit to 10",
      start: "1-indexed offset. if not specified, set start to 1",
      where: "optional filter string, default '' (may be ignored)"
    },
    response_schema: "{ jobs: string[] , start?: number }",
    behavior: "Return only JSON matching response_schema. If ambiguous, ask at most one clarifying question. If no results, return { jobs: [] }. Include start when a full page is returned.",
    examples: [
      { input: "list jobs", mapped_params: { start: 1, limit: 10 } },
      { input: "show me jobs, 20 per page", mapped_params: { start: 1, limit: 20 } },
      { input: "next jobs", note: "interpret as start = previousStart + previousLimit" }
    ],
    safety: "Surface backend errors directly; do not hallucinate job names."
  };

  let description = `
  ## listJobs — enumerate SAS Viya job assets

  LLM Invocation Guidance (When to use)
  Use THIS tool when the user wants to browse or list many job definitions / job assets:
  - "list jobs"
  - "show jobs"
  - "list available jobs"
  - "browse jobs"
  - "next jobs" (after a previous page)
  - "list 25 jobs" / "list jobs limit 25"

  Do NOT use this tool for:
  - Checking existence of ONE job (use findJob)
  - Executing/running a job (use job)
  - Running a job definition (use jobdef)
  - Submitting SAS code (use program)

  Purpose
  Page through job assets deployed/registered in SAS Viya Job Execution service.

  Parameters
  - limit (number, default 10): Number of jobs to return.
  - start (number, default 1): 1-based offset for paging.
  - where (string, optional): Filter expression (future use / passthrough; empty string by default). If unsupported, it may be ignored gracefully.

  Response Contract
  - Returns an array of job names or objects (backend-dependent) inside structuredContent.
  - If items.length === limit, caller may request next page using start + limit.
  - Provide optional hint start = start + limit when page might continue.

  Pagination Examples
  - First page: { start:1, limit:10 }
  - Next page:  { start:11, limit:10 }

  Disambiguation & Clarification
  - Input only "list" → ask: "List jobs? (Say 'list jobs' to proceed)" unless prior context indicates jobs listing.
  - "find job X" → route to findJob instead.
  - Input contains "run"/"execute" plus job name → route to job/jobdef.

  Negative Examples (should NOT call listJobs)
  - "find job abc" (findJob)
  - "run job abc" (job)
  - "job abc" (job)
  - "find model xyz" (findModel)
  - "list models" (listModels)
  - "list tables in lib xyz" (listTables)
  - "show me libraries" (listLibraries)
  - "describe job abc" (findJob then possibly job for execution)

  Error Handling
  - On backend error: surface structured error payload (do not fabricate job names).
  - Empty page (items.length === 0) with start > 1 may mean caller paged past end.

  Usage Tips
  - Increase limit for fewer round trips; keep reasonable to avoid large payloads.
  - Combine with findJob for confirmation before execution.

  Examples (→ mapped params)
  - "list jobs" → { start:1, limit:10 }
  - "list 25 jobs" → { start:1, limit:25 }
  - "next jobs" (after prior {start:1,limit:10}) → { start:11, limit:10 }
  `;


  let spec = {
    name: 'listJobs',
    description: description,
    schema: {
      limit: z.number().default(10),
      start: z.number().default(1),
      where: z.string().default('')
    },
  // No 'server' required; backend context is implicit in helper
  required: [],
    handler: async (params) => {
      // _listJob handles all validation and defaults
      const result = await _listJobs(params);
      return result;
    }
  }
  return spec;
}
export default listJobs;
