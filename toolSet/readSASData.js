/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import debug from 'debug';
const log = debug('tools');
import _describeTable from '../toolhelpers/_describeTable.js';
function readSASData() {
     let describe = `
  ## Reads data from specified table from a specified library

  - The table is required. If not specified prompt user for its value
  - If table is specified as x.y, set library to x and table to y.
  - If library is not specified, it defaults to public for cas and sashelp for sas.
  - User can specify the server as either cas or sas. If not specified, it defaults to cas.
  - User can also specify the limit the number of rows read. If not specified default to 10.
  - User can also specify a where clause. if not specified, default to a blank string. 

  ## Example prompts
  
  - read cars from public library in cas server
  - read air from sashelp library in sas server

  `;
    let  specs = {
      name: 'readSASData',
      description: describe,
      schema: {
        table: z.string(),
        library: z.string().optional(),
        limit: z.number().optional(),
        server: z.string().optional().default('cas'),
        where: z.string().default(' ')
      },
      required: ['table'],
      handler: async ({ table, library, limit, server, where }) => {
        const params = { table, limit, server, where };
        let iparams = {
          table: table,
          lib: library || '',
          limit: limit|| 10, // default limit
          source: (server=== 'sas') ? 'compute' : 'cas', // default source
          format: true, // default format
          where: where || '' // no filter by default
        };
        if (library == null || library.trim().length === 0) {
          iparams.lib = (iparams.source === 'cas') ? 'public' : 'sashelp'; // default library
        }
        log('params', iparams);
        let r = await _describeTable(iparams, 'query');
        log('describeTable', r);
        return r;
      }
    }
    return specs;
}
export default readSASData;