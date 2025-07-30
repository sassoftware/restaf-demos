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
  ## modelScore - This tool scores user supplied scenario data with a model published to MAS server in SAS Viya. 
   
  ### Output
  The tool will return the scoring results merged with the fields used by the model for scoring

  ### Required Parameters

  - model - the name assigned to the model in MAS server.
    - The model name is the name assigned to the model when it was published to MAS server
  - scenario - The scenario is a key-values pairs like x=1, y=2, z=3.

  ### Optional Parameters
  - uflag - uflag is optional. uflag is set to false by default. If true, the names of the model fields have a leading underscore.
 

  ### Sample Prompts
  - modelscore with mycoolmodel for x1=1,x2=2 
  - score model mycoolmodel with x1=1,x2=2 
  - score mycoolmodel with x1=1,x2=2 

 

  ### Notes
  In a real solution, each model will have its own tool named in a user friendly manner
  and the user only has to supply the scenario object.
  For example, the model "mycoolmodel" could have a tool named "MyCoolModel".
  `;
  let spec = {
    name: 'modelScore',
    description: description,
    schema: {
      'model': z.string(),
      'scenario': z.string(),
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
       
        scenarioObj = scenario.split(',').reduce((acc, pair) => {
            let [key, value] = pair.split('=');
            acc[key.trim()] = value;
            count++;
            return acc;
          }, {});
        }
      params.scenario= scenarioObj;
      console.log('count', count);
      console.log('scnario', Object.keys(scenario).length);
      log('modelScore params', params);
      // Check if the params.scenario is a string and parse it
      let r = await _masScoring(params)
      return r;
    }
  }
  return spec;
}

export default modelScore;
