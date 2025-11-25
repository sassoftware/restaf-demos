/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import debug from 'debug';

import _readTable from  '../toolhelpers/_readTable.js';
function readTable(_appContext) {
   
     let describe = `
## readTable — retrieve rows from a table in a CAS or SAS library

LLM Invocation Guidance (When to use)
Use THIS tool when:
- User wants to read data from a table: "read table customers"
- User wants sample rows: "show me 10 rows from sales"
- User wants filtered data: "read from orders where status = 'shipped'"
- User wants from specific library: "read table cars in sashelp"
- User wants from specific server: "read from mylib.employees on sas"

Do NOT use this tool for:
- Listing tables in a library (use listTables)
- Getting table structure/metadata (use tableInfo)
- Running SQL queries (use sasQuery)
- Executing SAS programs (use program)
- Running statistical analysis (use appropriate analytics tools)

Purpose
Read one or more rows from a specified table in a CAS caslib or SAS libref. Supports pagination, filtering with WHERE clauses, and formatted/raw value display. Use this to inspect table data, sample rows, or retrieve filtered subsets.

Parameters
- table (string, required): Table name to read.
- lib (string, required): The caslib or libref containing the table.
- server (string, default 'cas'): Target server: 'cas' or 'sas'.
- start (number, default 1): 1-based row index to start reading from.
- limit (number, default 10): Maximum number of rows to return (1-1000 recommended).
- where (string, optional): SQL-style WHERE clause to filter rows (e.g., "age > 30 AND status = 'active'").
- format (boolean, default true): When true, return formatted/labeled values; when false return raw values.
- row (number, optional): Read a single specific row (sets start to this value and limit to 1).

Response Contract
Returns a JSON object containing:
- rows: Array of row objects with column names as keys
- total (optional): Total count of rows in table (if available)
- filtered_count (optional): Count of rows matching WHERE clause (if WHERE used)
- columns (optional): Column metadata including names and types
- Empty array if no rows match the criteria

Pagination & Filtering
- First page default: { start: 1, limit: 10 }
- To get next page: increment start by limit (e.g., { start: 11, limit: 10 })
- Use WHERE clause for server-side filtering: { where: "age > 30" }

Disambiguation & Clarification
- Missing library: ask "Which library contains the table you want to read?"
- Missing table: ask "Which table would you like to read?"
- Ambiguous lib.table format: parse and use as separate parameters
- Multiple tables: clarify which one (readTable handles one table at a time)

Examples (→ mapped params)
- "read table cars in Samples" → { table: "cars", lib: "Samples", start: 1, limit: 10 }
- "show 25 rows from customers" → { table: "customers", lib: <current_lib>, limit: 25, start: 1 }
- "read orders where status = 'shipped' limit 50" → { table: "orders", lib: <lib>, where: "status = 'shipped'", limit: 50, start: 1 }
- "read row 15 from employees in mylib on sas" → { table: "employees", lib: "mylib", server: "sas", row: 15 }
- "get next 10 rows" (after previous {start:1,limit:10}) → { table: <same>, lib: <same>, start: 11, limit: 10 }

Negative Examples (should NOT call readTable)
- "list tables in Samples" (use listTables instead)
- "what columns are in the cars table?" (use tableInfo instead)
- "execute this SQL query" (use sasQuery instead)
- "run this SAS code" (use program instead)

Related Tools
- listTables — to browse available tables in a library
- tableInfo — to inspect table structure, columns, and metadata
- findTable — to check if a table exists in a library
- listLibraries — to browse available libraries
- sasQuery — to run complex SQL queries across tables
`;
  
    let  specs = {
      name: 'readTable',
      description: describe,
      schema: {
        table: z.string(),
        lib: z.string(),
        start: z.number(),
        limit: z.number().default(10),
        server: z.string().default('cas'),
        where: z.string().default(''),
        format: z.boolean().default(true)

      },
      required: ['table', 'lib'],
      handler: async (params) => {
        let r = await _readTable(params,'query');
        return r;
      }
    }
    return specs;
}
export default readTable;