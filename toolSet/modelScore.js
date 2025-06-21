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
      ## modelScore - This tool is used to score a scenario using a model published to MAS serer in SAS Viya.
      The input to this tool is:

      
      - model - the name assigned to the model in MAS server.
        - The model name is the name assigned to the model when it was published to MAS server
      - scenario - The scenario is a key-values pairs like x=1, y=2, z=3
        - if scenario is not specified, the tool will return the variables in the model
         

      ### Sample Prompts
      - modelscore with mycoolmodel for x1=1,x2=2
    
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
      'scenario': z.string('') 
    },
    required: ['model', 'scenario'],
    handler: async (params) => {
      let {model, scenario, uflag} = params;
      console.log(params);
        // Convert the scenario string to an object
        // Example: "x=1, y=2, z=3" to { x: 1, y: 2, z: 3 }
      let scenarioObj = scenario.split(',').reduce((acc, pair) => {
          let [key, value] = pair.split('=');
          acc[key.trim()] = value.trim();
          return acc;
        }, {});
      let iparams = {
        model: model,
        scenario: scenarioObj,
        uflag: uflag // Assuming uflag is always f for this tool
      };
      console.log('modelScore params', iparams);
      // Check if the params.scenario is a string and parse it
      let r = await _masScoring(iparams);
      return r;
    }
  }
  return spec;
}

export default modelScore;
