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
## findTable

Purpose
Locate a table contained in a specified library (caslib or libref) on a CAS or SAS server.

Inputs
- lib (string, required): The library to search in (for example \`Public\`, \`sashelp\`, or a caslib name).
- name (string, required): Table name or substring to search for. Matching is case-insensitive.
- server (string, optional): Either 'cas' or 'sas'. Defaults to 'cas' when omitted.

What it returns
- An array of matching table name (empty array when no matches).

Usage notes
- Use this tool to verify that the table exists before calling \`readTable\` or \`tableInfo\`.

Examples
- find table iris in Public library in cas
- find table cars in sashelp in sas server
`;

  let spec = {
    name: 'findTable',
    description: description,
    schema: {
      server: z.string().default('cas'), // default server is 'cas',
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
