/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _describeTable from './toolhelpers/_describeTable.js';
import { required } from 'zod/v4-mini';


async function tools() {
 
  // need to redo if this ever becomes more than a  demo
  
  let cardesc = 
  `report on Deva Car Company. User can filter on the value of make, model and msrp
 
  `;

  let samples = [
    {
      name: "devascore",
      description: "compute Deva Score for two numbers",
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
    /*
       {
      name: "DevaDB",
      description: `Deva DB is a database with multiple tables. User can request data from a specified table.
      They can optionally limit the number of rows returned` ,
      schema: {
        table: z.string(),
        limit: z.number()
      },
      required: ['table'],
      handler: async ({ table, limit}) => {
        const params = { table, limit };
        let iparams = {
          table: table,
          lib: 'public',
          limit: limit || 10, // default limit
          source: 'cas', // default source
          format: true, // default format
          where: '' // no filter by default
        };
        console.log('params', iparams);
        let r = await _describeTable(iparams, 'query');
        console.log('describeTable', r);
        return r;
      }
      
      
    },
    */
     {
      name: "ReadSASData",
      description: `Reads data from specified table from a speified library.
       The default server is cas, but user specify sas as the server. 
       User can also specify the limit the number of rows read. User can also specify a where clause.`,
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
    }
  ]
  
  return samples;
}
export default tools;
