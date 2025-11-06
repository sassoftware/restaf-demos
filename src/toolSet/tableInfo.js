/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import debug from 'debug';

import _tableInfo  from '../toolhelpers/_tableInfo.js';
function tableInfo(_appContext) {

     let describe = `
## tableInfo

Purpose
Return metadata about a table in a specified library (caslib or libref). Use \`readTable\` to fetch actual row data.

Required parameters
- table (string): The name of the table.
- lib (string): The caslib or libref containing the table.

Optional parameters
- server (string): Target server, either 'cas' or 'sas'. Defaults to 'cas'.

What it returns
- Column metadata (name, type, label, formats) and table-level statistics when available (row count, file size, creation/modified timestamps).

Usage notes
- Use this tool to inspect schema and column types before scoring or reading data.
- Combine with \`readTable\` for sample rows and \`listTables\` to discover available tables.


Example
- tableInfo for table \`cars\` in lib \`Public\`
- describe table \`air\` in lib \`sashelp\` on the sas server
- info on table \`mydata\` in lib \`mylib\` on the cas server
- desc table \`sales\` in lib \`analytics\`

`;
   
    let  specs = {
      name: 'tableInfo',
      description: describe,
      schema: {
        table: z.string(),
        lib: z.string(),
        server: z.string()
      },
      required: ['table', 'lib'],
      handler: async (params) => {
        params.describe = true;
        let r = await _tableInfo(params);
        return r;
      }
    }
    return specs;
}
export default tableInfo;