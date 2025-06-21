/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _listLibrary from '../toolhelpers/_listLibrary.js';
function libraryExists() {
  let desc = `
      ## Check for the existence of a specified library in specified server
      
      This tool verifies that the specified library exists in the specified server. 
      if it exist the tool wil return a string 'YES'. If it does not exist, it will return a string 'NO'
      If multiple libraries are specified (separated by comma) then make repeated calls for each library in the list and see if that library exists.
      If the library is specified as *, the tool will return the list of vailable libraries.`
    ;
  let spec = {
    name: 'libraryExists',
    description: desc,
    schema: {
      server: z.string().default('cas'),
      library: z.string()
    },
    required: ['library'],
    handler: async ({ server, library }) => {
      const params = { server, library };
      let iparams = {
        source: (server.trim().toLowerCase() === 'sas') ? 'compute' : 'cas', // default source
        library: library || '*',
      };
      iparams.source = params.server.trim().toLowerCase() === 'sas' ? 'compute' : 'cas';
      let r = await _listLibrary(iparams);
      return r;

    }
  }
  return spec;
}
export default libraryExists;
