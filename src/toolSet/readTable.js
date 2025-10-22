/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import debug from 'debug';

import _readTable from  '../toolhelpers/_readTable.js';
function readTable(_app) {
   
     let describe = `
## readTable

Purpose
Read rows from a table in a specified library (caslib or libref) on a CAS or SAS server.

Required parameters
- table (string): Table name to read.
- lib (string): The caslib or libref containing the table.

Optional parameters
- server (string): Target server, either \`cas\` or \`sas\`. Defaults to \`cas\`.
- start (number): 1-based row index to start reading from. Defaults to 1.
- limit (number): Maximum number of rows to return. Defaults to 10.
- where (string): Optional SQL-style WHERE clause to filter rows. Defaults to empty (no filter).
- format (boolean): When true, return formatted/labelled values; when false return raw values. Defaults to true.
- row (number): If provided, read a single row (sets \`start\` to this value and \`limit\` to 1).

Output
- The tool returns an object containing  an array of row objects. Consumers should render results as a markdown table for readability. If the resultset is large, display the first \`limit\` rows (default 10).

Usage notes
- Use \`findTable\` or \`listTables\` to if the table exists before calling \`readTable\`.

Examples
- read table \`cars\` in lib \`Public\` on the cas server -> { "table": "cars", "lib": "Public", "server": "cas", limit: 10, start: 1 }
- read table \`employees\` in lib \`mylib\` on the sas server with where \`age > 30\` and limit 50 -> { "table": "employees", "lib": "mylib", "server": "sas", "where": "age > 30", "limit": 50 }
- read table \`air\` in lib \`sashelp\` on the sas server limit 50 -> { "table": "air", "lib": "sashelp", "server": "sas", "limit": 50, start: 1 }
`;
    let _readTable = _app.toolsHelper._readTable;
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