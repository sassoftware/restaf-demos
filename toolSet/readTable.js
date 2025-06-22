/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import debug from 'debug';
const log = debug('tools');
import _describeTable from '../toolhelpers/_describeTable.js';
function readTable() {
     let describe = `
## readTable is a tool to read data from  the specified table and from the  specified lib

### Required Parameters
- table - the name of the table to read
- lib  - the caslib or libref the table is in.

### Optional Parameters
- User can specify the server as either cas or sas. If not specified, default server to cas
- User can also specify the limit the number of rows read. If not specified default to 10.
- User can also specify the start row. If not specified, default to 1.
- User can also specify a where clause. if not specified, default to a blank string. 
- If the user specfies a specific row number to read, then set start to that row number and limit to 1.

### Format of the response
Always try to display the data as a table using markdown format. If the table is too large, then display the first 10 rows of the table.

### Example prompts
- read cars in lib Public  in cas server
- read air in lib sashelp in sas server

`;
    let  specs = {
      name: 'readTable',
      description: describe,
      schema: {
        table: z.string(),
        lib: z.string(),
        start: z.number(),
        limit: z.number(),
        server: z.string(),
        where: z.string()
      },
      required: ['table', 'lib'],
      handler: async (params) => {
        log('params', params);
        let r = await _describeTable(params, 'query');
        log('describeTable', r);
        return r;
      }
    }
    return specs;
}
export default readTable;