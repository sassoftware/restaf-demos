/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import debug from 'debug';
import _listTables from '../toolhelpers/_listTables.js';
const log = debug('tools');

function findTable() {
  let description = `
## findLibrary: find a specified table in specified library in the CAS or SAS server.
If server is not specified default to 'cas'.
If multiple names are specified, repeat the operation for
  each of the names


  ### Required Parameters
  - **name**: The name of the tableto find
  - **lib**: The name of the library where the table is located

  ### Optional Parameters
  - **server**: The server to search in, either 'cas' or 'sas'. Default is 'cas'.
  

  ## Sample Prompt
  - find table iris in  Public library in cas server
  - find table iris in sasuser library in sas server

 `;

  let spec = {
    name: 'findTable',
    description: description,
    schema: {
      server: z.string(), // default server is 'cas',
      name: z.string(),
      lib: z.string()
    },
    required: ['name', 'lib'],
    handler: async (params) => {
      // Check if the params.scenario is a string and parse it
      let r = await _listTables(params);
      return r;
    }
  }
  return spec;
}

export default findTable;
