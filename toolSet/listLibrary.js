/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _listLibrary from '../toolhelpers/_listLibrary.js';
function listLibrary() {

  let desc = `
  ## listLibrary:  List the libraries in a specified server(cas or sas)
  This tool lists the libraries in the specified server (CAS or SAS).
  You can optionally limit the number of itemsm returned by using the \`limit\` parameter.
  To get the next set of libraries use the start parameter by setting it to the previous limit + 1.


  ### Parameters
  - **server**: The server type, either 'cas' or 'sas'. Default is 'cas'.
  - **limit**: The maximum number of libraries to return. Default is 10.
  - **start**: The starting point for the list of libraries. Default is 1

  ## Sample Prompt
  - List libraries in the cas
  - List libraries in the sas
  - List libraries in the cas with a limit of 10
  - List libraries in the sas starting from 11

  `;


  let spec = {
    name: 'Listlibrary',
    description: desc,
    schema: {
      server: z.string().default('cas'),
      limit: z.number(),
      start: z.number(),
      where: z.string().default('')
    },
    required: ['server'],
    handler: async (params) => {
      let r = await _listLibrary(params);
      return r;

    }
  }
  return spec;
}
export default listLibrary;
