/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _describeTable from './toolhelpers/_describeTable.js';
import { required } from 'zod/v4-mini';
import { fi } from 'zod/v4/locales';


async function tools() {
 
  let samples = [
   
     {
      name: "ReadSASData",
      description: `Reads data from specified table from a specified library.
      if library is not specified, it defaults to public for cas and sashelp for sas.
       User can specify the server as either cas or sas. If not specified, it defaults to cas.
       User can also specify the limit the number of rows read. If not specified default to 10.
       User can also specify a where clause. if not specified, default to a blank string`,
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
        console.log('params', iparams);
        let r = await _describeTable(iparams, 'query');
        console.log('describeTable', r);
        return r;
      }
    },
    {
      name: "devascore",
      description: `compute Deva Score for two numbers. If more than 2 numbers are provided, process the numbers from the left as follows:
       - compute score for the first two numbers
       - use the result and the next number to compute the next score
       - repeat until all numbers are processed`,
      schema: {
        a: z.number(),
        b: z.number()
      },
      handler: async ({ a, b }) => {
        console.log('devascore', a, b);
        return { content: [{ type: "text", text: String((a + b) * 100) }] }
      }
    },
    {
      name: "devssub",
      description: "compute Deva Sub for two numbers",
      schema: {
        a: z.number(),
        b: z.number()
      },
      handler: async ({ a, b }) => {
        console.log('devssub', a, b);
        return { content: [{ type: "text", text: String(a - b * 100) }] }
      }
    },
  ]
  
  return samples;
}
export default tools;
