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
        start: z.number().default(1),
        limit: z.number().default(10),
        server: z.string().default('cas'),
        where: z.string().default(' ')
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