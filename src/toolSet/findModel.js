/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import _listModels from '../toolhelpers/_listModels.js';

function findModel() {
  let description = `
  ## findModel - This the specified model in he MAS server.
  
  ### Parameters
  - **name**: The name of the model to find.

  ### Sample Prompts
  - find model myModel
  `;

  let spec = {
    name: 'findModel',
    description: description,
    schema: {
      'name': z.string()
    },
    required: ['name'],
    handler: async (params) => { 
      // Check if the params.scenario is a string and parse it
      let r = await _listModels(params);
      return r;
    }
  }
  return spec;
}

export default findModel;
