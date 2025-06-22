/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import debug from 'debug';
import _listTables from '../toolhelpers/_listTables.js';
const log = debug('tools');

function listTables() {
  let description = `
## listTables  - This tool listts the table in a specified library(lib) in either CAS or SAS server.
The prompt must of the form  
  - list tables in <library_name> in <server_name>.
It can be optionally followed by a limit parameter.
.
The limit parameter is the number of tablesthat are returned. The default is 10.

### Parameters
  - lib = the name of the library from which to list tables.
  - server = the name of the server from which to list tables. Default is 'cas'.
  - limit = the number of models to return. Default is 10.

### Sample Prompts
- list tables in samples in cas server and limit to 20
- list tables in sashelp in sas server and limit to 5
`;

  let spec = {
    name: 'listTables',
    description: description,
    schema: {
      'lib': z.string(),
      'server': z.string(), // default server is 'cas'
      'limit': z.number()
    },
    required: ['lib'],
    handler: async (params) => { 
      // Check if the params.scenario is a string and parse it
      let r = await _listTables(params);
      return r;
    }
  }
  return spec;
}

export default listTables;
