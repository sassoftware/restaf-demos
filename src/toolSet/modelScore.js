/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import debug from 'debug';
import _masScoring from '../toolhelpers/_masScoring.js';
const log = debug('tools');

function modelScore() {
  let description = `
## modelScore

Purpose
Score user-supplied scenario data using a model published to MAS (Model Aggregation Service) on SAS Viya.

Inputs
- model (string, required): The name of the model as published to MAS.
- scenario (string | object | array, required): Data to score. Accepts:
  - a string of comma-separated key=value pairs (e.g. "x=1, y=2"),
  - a plain object with field names and values (e.g. {x: 1, y: 2}),
  - an array of objects for batch scoring (the first element is used when a single scenario object is expected).
- uflag (boolean, optional): When true, returned model field names will be prefixed with an underscore. Default: false.

Output
- Returns scoring results merged with the input fields and any model-produced fields (predictions, probabilities, scores), plus available scoring metadata.

Parsing & behavior
- If scenario is a string, the tool parses comma-separated key=value pairs into an object.
- If scenario is an array, the first element will be used when a single scenario is required; the tool supports batch scoring when the underlying MAS scoring helper accepts arrays.

Usage notes
- Use this tool after confirming the model name with listModels or modelInfo.
- Ensure MAS connectivity and credentials are available to the runtime.
- Validate and cast numeric fields as needed before scoring; the simple string parser does not coerce types beyond leaving values as strings.

Examples
- modelScore with model='mycoolmodel' and scenario='{x:1,y:2}'
- modelScore with model='cancer1' and scenario='age=45, sex=M, tumor=stage2'
`;
  let spec = {
    name: 'modelScore',
    description: description,
    schema: {
      'model': z.string(),
      'scenario': z.any(),
      'uflag': z.boolean()
    },
    required: ['model', 'scenario'],
    handler: async (iparams) => {
      let params = {...iparams}; 
      let scenario = params.scenario;
   
        // Convert the scenario string to an object
        // Example: "x=1, y=2, z=3" to { x: 1, y: 2, z: 3 }
      let scenarioObj ={};
       let count = 0;
      if (typeof scenario === 'object') {
        scenarioObj = scenario;
      } else if (Array.isArray(scenario)) { 
        scenarioObj = scenario[0];
      } else {
        console.log('Incoming scenario', scenario);
        scenarioObj = scenario.split(',').reduce((acc, pair) => {
            let [key, value] = pair.split('=');
            acc[key.trim()] = value;
            count++;
            return acc;
          }, {});
        }
      params.scenario= scenarioObj;
      log('modelScore params', params);
      // Check if the params.scenario is a string and parse it
      let r = await _masScoring(params)
      return r;
    }
  }
  return spec;
}

export default modelScore;
