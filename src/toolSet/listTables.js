/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import debug from 'debug';
import _listTables from '../toolhelpers/_listTables.js';


function listTables(_appContext) {
  const log = debug('tools');

  let description = `
  ## listTables — enumerate tables within a specific CAS or SAS library

  LLM Invocation Guidance (When to use)
  Use THIS tool when the user explicitly wants the tables inside ONE library:
  - "list tables in Samples"
  - "show tables in sashelp"
  - "list cas tables in Public"
  - "list 25 tables in Samples"
  - "next tables" (after a prior listTables call)

  Do NOT use this tool to list the following
  - lib -> use listLibraries
  - list models -> use listModels
  - list jobs -> use listJobs
  - list jobdefs -> use listJobdefs
  - Finding whether a library exists (use findLibrary)
  - Describing a single table's columns or metadata (use tableInfo)
  - Reading table data rows (use readTable)
  - Listing jobs/models (other specialized tools)

  Purpose
  Return the names (and possibly lightweight metadata) of tables contained in a specified library (CAS caslib or SAS libref).

  Parameters
  - lib (string, required): Library to inspect (e.g. "Samples", "sashelp").
  - server (cas|sas, default 'cas'): Target environment; default when unspecified is CAS.
  - limit (number, default 10): Page size.
  - start (number, default 1): 1-based offset for pagination.
  - where (string, optional): Filter expression (if supported by backend) or ignored safely.

  Response Contract
  - JSON: { tables: string[] [, start:number]? }
  - tables array is empty when no matches.
  - Include start = start + limit when length === limit (possible more pages).

  Pagination Examples
  - First page: { lib:'Samples', start:1, limit:10 }
  - Next page:  { lib:'Samples', start:11, limit:10 }

  Disambiguation & Clarification
  - Missing library name → ask: "Which library do you want to list tables from?"
  - Input only "list tables" → ask for the library unless prior context supplies one.
  - If user mentions multiple libs ("tables in Public and Samples") → request a single library.

  Negative Examples (should NOT call listTables)
  - "list libs" (listLibraries)
  - "find lib Public" (findLibrary)
  - "describe table cars" (tableInfo)
  - "read table cars from sashelp" (readTable)

  Usage Tips
  - After listing, call tableInfo to inspect structure or readTable for sample data.
  - Keep limit moderate; page for very large libraries.

  Examples (→ mapped params)
  - "list tables in samples" → { lib:"samples", start:1, limit:10 }
  - "show 25 tables in sashelp" → { lib:"sashelp", limit:25, start:1 }
  - "next tables" (after previous {start:1,limit:10}) → { start:11, limit:10, lib:<previousLib> }
  `;
    
  let spec = {
    name: 'listTables',
    description: description,

    schema: {
      'lib': z.string(),
      'server': z.string().default('cas'),
      'limit': z.number().default(10),
      'start': z.number().default(1)
    },
    required: ['lib'],
    handler: async (params) => { 
      let r = await _listTables(params);
      return r;
    }
  }
  return spec;
}

export default listTables;
