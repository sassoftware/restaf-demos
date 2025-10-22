/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
//import _listLibrary from '../toolhelpers/_listLibrary.js';
function findLibrary(_appContext) {
  
  let description = `
  ## findLibrary — locate a specific CAS or SAS library

  LLM Invocation Guidance
  Use THIS tool when the user asks any of the following (intent = existence / lookup of ONE library):
  - "find lib Public"
  - "does library SASHELP exist"
  - "is PUBLIC library available in cas"
  - "lookup library sasuser in sas"
  - "show me library metadata for Models"

  Do NOT use this tool when the user wants:
  - A list or enumeration of many/all libraries (use listLibrary)
  - Tables inside a library (use listTables)
  - Columns or schema of a table (use tableInfo)
  - Creating/assigning libraries (use program or another admin tool)

  Purpose
  Quickly verify whether a single named library exists on CAS or SAS and return its entry (or empty if not found).

  Parameters
  - name (string, required) : Exact library (caslib) name to locate. If multiple names provided (comma/space separated), use the first and ignore the rest; optionally ask for one name.
  - server (cas|sas, default 'cas') : Target environment. If omitted or ambiguous default to 'cas'.

  Behavior & Matching
  - Performs an exact name match (case-insensitive where backend supports it).
  - Returns an object: { libraries: [...] } where the array contains zero or one items (backend may still return richer metadata).
  - If no match: { libraries: [] } (do NOT fabricate suggestions).
  - If user supplies no name: ask a clarifying question: "Which library name would you like to find?".
  - If user clearly wants a list ("list", "show all", "enumerate") route to listLibrary instead.

  Response Contract
  - Always: { libraries: Array<string|object> }
  - Never include prose when invoked programmatically; only the JSON structure.

  Disambiguation Rules
  - Input only "find library" → ask for the missing name.
  - Input with both library name and words like "tables" → prefer listTables.
  - Input like "find libraries" (plural) → prefer listLibrary unless user clarifies to a single name.

  Examples (→ mapped params)
  - "find lib Public" → { name: "Public", server: "cas" }
  - "find library sasuser in sas" → { name: "sasuser", server: "sas" }
  - "does library Formats exist" → { name: "Formats", server: "cas" }
  - "is SystemData library in cas" → { name: "SystemData", server: "cas" }

  Negative Examples (should NOT call findLibrary)
  - "list libs" (listLibrary)
  -  Do not use this tool if the user want to find table, find job, find model, find job, find jobdef  and similar requests
  - "show tables in Public" (listTables)
  - "describe table cars in sashelp" (tableInfo)

  Clarifying Question Template
  - Missing name: "Which library name would you like to find?"
  - Multiple names: "Please provide just one library name to look up (e.g. 'Public')."

  Notes
  - For bulk validation of many names, call this tool repeatedly per name.
  - For pagination or discovery, switch to listLibrary.
  `;

  let _listLibrary = _appContext.toolsHelper._listLibrary;
  let spec = {
    name: 'findLibrary',
    description: description,
    schema: {
      name: z.string(),
      server: z.string().default('cas')
    },
    required: ['name'],
    handler: async (params) => {
      // normalize server to lowercase & default
      if (!params.server) params.server = 'cas';
      params.server = params.server.toLowerCase();

      // If multiple names passed (comma or space separated), take the first token (defensive)
      if (params.name && /[,\s]+/.test(params.name.trim())) {
        params.name = params.name.split(/[,\s]+/).filter(Boolean)[0];
      }

      let r = await _listLibrary(params);
      return r;
    }
  }
  return spec;
}
export default findLibrary;
