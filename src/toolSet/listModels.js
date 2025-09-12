/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import _listModels from '../toolhelpers/_listModels.js';

function listModels(appEnv) {
  let description = `
## listModels

Return a paginated list of models registered in the MAS on a SAS Viya deployment.

Inputs
- limit (number, optional): Maximum number of models to return. Default: 10.
- start (number, optional): 1-based index to start the page from. Default: 1. Use this to paginate through results (nextStart = start + limit).

What it returns
- An array of models(or an empty array if no models found). 

Usage notes
- Use this tool to discover available models before calling \`modelInfo\` or \`modelScore\`.
- For large registries, page through results by incrementing \`start\` with the previous \`limit\`.


Examples
- list models
- list models with limit 20
`;

  let spec = {
    name: 'listModels',
    description: description,
    schema: {
      'limit': z.number().default(10),
      'start': z.number() 
    },
    handler: async (params) => { 
      // Check if the params.scenario is a string and parse it
      let r = await _listModels(params);
      return r;
    }
  }
  return spec;
}

export default listModels;
