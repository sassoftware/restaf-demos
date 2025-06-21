/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import debug from 'debug';
import _modelList from '../toolhelpers/_modelList.js';
const log = debug('tools');

function listModels() {
  let description = `
      ## listModels - This tool list all the available models in the MAS server.
      The prompt must of the form  
        - list models. 
      It can be optionally followed  by a limit parameter.
      The limit parameter is the number of models that are returned. The default is 10.
      
      ### Parameters
       - limit = the number of models to return. Default is 10.

      ### Sample Prompts
      - list models and  limit to 20
      `;

  let spec = {
    name: 'listModels',
    description: description,
    schema: {
      'limit': z.number().default(10) 
    },
    handler: async (params) => { 
      // Check if the params.scenario is a string and parse it
      let r = await _modelList(params);
      return r;
    }
  }
  return spec;
}

export default listModels;
