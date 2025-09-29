/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';

import _jobSubmit from '../toolhelpers/_jobSubmit.js';


function jobdef() {
  let description = `
## Job Definition

Define a job Definition to be executed on a SAS Viya server

Required Parameters
- name(string, required): The name of the job Definition 

Optional Parameters
- scenario(string | object ,optional): Input values to program/ Accepts:
  - a comma-separated key=value string (e.g. "x=1, y=2"),
  - a JSON object with field names and values (recommended for typed inputs),

Behavior & usage notes
- To run SAS code directly, use the \'program\' tool.
- For invoking pre-defined SAS macros, prefer the \`runMacro\` helper which converts simple parameter formats into \`%let\` statements and invokes the macro cleanly.

Response
The response could include log, listing and json output depending on how the job is defined.
If output includes the JSON key, display it in a tabular format if possible.

Examples
- job xyz scenario param1=10,param2=val2 
  - This should result in {name: 'xyz', scenario: {param1:10, param2:'val2'}}
- job mydef scenario a=10,b=20 
  - This should result in {name: 'mydef', scenario: {a:10, b:20}}
- job mydef a=10,b=0,c=30
  - This should result in {name: 'mydef', scenario: {a:10, b:0, c:30}}
`;

  let spec = {
    name: 'jobdef',
    description: description,
    schema: {
      name: z.string(),
      scenario: z.any().default('')
    },
    required: ['name'],
    handler: async (params) => {
      let scenario = params.scenario;
      params.type = 'jobdef';
      let scenarioObj ={};
       let count = 0;
       debugger;
       if (scenario == null) {
        scenarioObj = {};
       }
      else if (typeof scenario === 'object') {
        scenarioObj = scenario;
      } else if (Array.isArray(scenario)) { 
        scenarioObj = scenario[0];
      } else if (typeof scenario === 'string') {
        if (scenario.trim() === '') {
          scenarioObj = {};
        } else {
          console.log('Incoming scenario', scenario);
          scenarioObj = scenario.split(',').reduce((acc, pair) => {
              let [key, value] = pair.split('=');
              acc[key.trim()] = value;
              count++;
              return acc;
            }, {});
          }
        }
      params.scenario= scenarioObj;
      let r = await _jobSubmit(params);
      return r;
    }
  }
  return spec;
}

export default jobdef;
