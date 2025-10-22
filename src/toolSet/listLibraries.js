/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
//import _listLibrary from '../toolhelpers/_listLibrary.js';
function listLibraries(_appContext) {
 
  let description = `
  ## listLibraries — enumerate CAS or SAS libraries

  LLM Invocation Guidance (critical)
  Use THIS tool when the user asks for: "list libs", "list libraries", "show cas libs", "show sas libs", "what libraries are available", "list caslib(s)", "enumerate libraries", "libraries in cas", "libraries in sas".
  DO NOT use this tool when the user asks for: tables inside a specific library (choose listTables), columns/metadata of a table, job/program execution, models, or scoring.

  Trigger Phrase → Parameter Mapping
  - "cas libs" / "in cas" / "cas libraries" → { server: 'cas' }
  - "sas libs" / "in sas" / "base sas libraries" → { server: 'sas' }
  - "next" (after prior call) → { start: previous.start + previous.limit }
  - "first 20 cas libs" → { server: 'cas', limit: 20 }
  - If server unspecified: default to CAS.

  Parameters
  - server (cas|sas, default 'cas')
  - limit (integer > 0, default 10)
  - start (1-based offset, default 1)
  - where (optional filter expression, default '')

  Response Contract
  Return JSON-like structure from helper; consumers may extract an array of library objects/names. If number of returned items === limit supply a pagination hint: start = start + limit.

  Behavior Summary
  - Pure listing; no side effects.
  - Provide deterministic ordering as supplied by backend (client may page).
  - If ambiguous short request like "list" or "libs" and no prior context: assume { server: 'cas' }.
  - If user explicitly asks for ALL (e.g. "all cas libs") and count likely large, honor limit=50 unless user supplies a value; include note about paging.

  Disambiguation Rules
  - If user mentions a singular library name plus desire for tables ("list tables in SASHELP") choose listTables (not this tool).
  - If user mixes "tables" and "libraries" ask for clarification unless clearly about libraries.

  Examples
  - "list libraries" → { server: 'cas', start:1, limit:10 }
  - "list libs" → { server: 'cas', start:1, limit:10 }
  - "list sas libs" → { server: 'sas' }
  - "show me 25 cas libraries" → { server:'cas', limit:25 }
  - "next" (after prior call {start:1,limit:10}) → { start:11, limit:10 }
  - "filter cas libs" (no criterion) → ask: "Provide a filter or continue without one?"

  Negative Examples (do not route here)
  - "list tables in public" (route to listTables)
  - "list models, list tables, list jobs, list jobdef and similar request"
  - "describe library" (likely listTables or tableInfo depending on follow-up)
  - "run program to make a lib" (program tool)

  Error Handling
  - On backend error: return structured error with message field; do not hallucinate libraries.
  - Empty result set → return empty list plus (if start>1) a hint that paging may have exceeded available items.

  Rationale
  Concise, signal-rich description increases probability this spec is selected for generic library enumeration intents.
  `;


  // NOTE: Standardized tool name to 'listLibrary'. Earlier legacy name 'Listlibrary'
  // has been removed from the manifest; keep only this canonical name moving forward.
  
  let _listLibrary = _appContext.toolsHelper._listLibrary;
  let spec = {
    name: 'listLibraries',
    description: description,
    schema: {
      server: z.string().default('cas'),
      limit: z.number().default(10),
      start: z.number().default(1), // added default to match documentation
      where: z.string().default('')
    },
    // 'server' has a default so we don't mark it required
    required: [],
    handler: async (params) => {
      // normalize server just in case caller sends 'CAS'/'SAS'
      params.server = (params.server || 'cas').toLowerCase();
      
      let r = await _listLibrary(params);
      return r;
    }
  };
  return spec;
}
export default listLibraries;
