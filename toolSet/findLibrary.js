/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _listLibrary from '../toolhelpers/_listLibrary.js';
function findLibrary() {

  let desc = `
  ## findLibrary: find a specified library in the CAS or SAS server. If multiple names are specified, repeat the operation for
  each of the names


  ### Parameters
  - **name**: The name of the library to find
  - **server**: The server to search in, either 'cas' or 'sas'. Default is 'cas'.
  

  ## Sample Prompt
  - find library Public in cas server
  - find library sasuser in sas server
 
  `;


  let spec = {
    name: 'findlibrary',
    description: desc,
    schema: {
      name: z.string(),
      server: z.string()
    },
    required: ['name'],
    handler: async (params) => {
      let r = await _listLibrary(params);
      return r;

    }
  }
  return spec;
}
export default findLibrary;
