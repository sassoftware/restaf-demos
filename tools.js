/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _describeTable from './toolhelpers/_describeTable.js';
import debug from 'debug';
const log = debug('tools');
/**
 * This function defines a set of tools that can be used to interact with SAS or CAS data.
 * It includes tools for reading data from specified tables, computing scores, and performing subtractions.
 * Each tool has a name, description, schema for input validation, and a handler function to execute the logic.
 * 
 * @returns {Array} An array of tool definitions.
 */



async function tools() {
 
  let desc = `
  ## Reads data from specified table from a specified library

  - The table is required. If not specified prompt user for its value
  - If library is not specified, it defaults to public for cas and sashelp for sas.
  - If table is specified as x.y, set library to x and table to y.
  - User can specify the server as either cas or sas. If not specified, it defaults to cas.
  - User can also specify the limit the number of rows read. If not specified default to 10.
  - User can also specify a where clause. if not specified, default to a blank string

  ## Example prompts
  
  - read cars from public library in cas server
  - read air from sashelp library in sas server
  `

  let samples = [
   
     {
      name: "ReadSASData",
      description: desc,
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
        log('devascore', a, b);
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
        log('devssub', a, b);
        return { content: [{ type: "text", text: String(a - b * 100) }] }
      }
    },
  ]
  
  return samples;
}
export default tools;
