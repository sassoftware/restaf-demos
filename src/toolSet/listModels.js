/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import _listModels from '../toolhelpers/_listModels.js';

function listModels(appEnv) {
  let description = `
  ## listModels - This tool list all the available models in the MAS server.
  The prompt must of the form  
    - list models. 
  It can be optionally followed  by a limit parameter.
  The limit parameter is the number of models that are returned. The default is 10.
  
  ### Parameters
    - limit = the number of models to return. Default is 10.
    - start = the index to start from. Default is 1. Use this to paginate through the list of models by specifying the start value as the previous limit + 1.

  ### Sample Prompts
  - list models and  limit to 20
  `;

  let spec = {
    name: 'listModels',
    description: description,
    schema: {
      'limit': z.number(),
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
