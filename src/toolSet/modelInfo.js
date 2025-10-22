/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import debug from 'debug';
//import _masDescribe from '../toolhelpers/_masDescribe.js';
const log = debug('tools');

function modelInfo(_appContext) {
  let description = `
## modelInfo

Purpose
Return metadata for a model published to the MAS (Model Aggregation Service) in SAS Viya.

Inputs
- model (string): The name of the model as published to MAS.

What it returns
- A JSON object containing model metadata as provided by MAS, typically including:
  - Inputs: variable names, data types, roles/usage, allowed values or ranges
  - Outputs: prediction names, types, levels or classes
 
Usage notes
- Use this to discover required scoring inputs and to interpret model outputs before calling scoring endpoints.

Example prompts
- info on cancer1
- describe model mycoolmodel
`;
let _masDescribe = _appContext.toolsHelper._masDescribe;
  let spec = {
    name: 'modelInfo',
    description: description,
    schema: {
      'model': z.string()
    },
    required: ['model'],
    handler: async (params) => {
      let r = await _masDescribe(params);
      return r;
    }
  }
  return spec;
}

export default modelInfo;
