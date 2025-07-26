/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import debug from 'debug';
const log = debug('tools');
import _tableInfo  from '../toolhelpers/_tableInfo.js';
function tableInfo(Table) {
     let describe = `
## tableInfo is a tool that returns information about a table.
Use readTable to read the table and get the data.

### Required Parameters
- table - the name of the table to get information about.
- lib  - the caslib or libref the table is in. 

## Required Parameters
- table - the name of the table to read
- lib  - the caslib or libref the table is in.

## Optional Parameters
- server - the server to read the table from. The value can be either 'cas' or 'sas'. Default is cas.

### Example prompts
- tableInfo  for   cars in lib Public  


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
        let r = await _tableInfo(params, 'describe');
        return r;
      }
    }
    return specs;
}
export default tableInfo;