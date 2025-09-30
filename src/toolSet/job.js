/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';

import _jobSubmit from '../toolhelpers/_jobSubmit.js';


function job() {
  let description = `
## Job

Execute a job on a SAS Viya server

Required Parameters
- name(string, required): The name of the job or jobdef. If it is jobdef, the type must also be supplied with a value of 'def'

Optional Parameters
- type(string, optional):  if name refers to a jobdef, then then value of type must be set to 'def'. 
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
  - This should result in {name: 'xyz', type="job" scenario: {param1:10, param2:'val2'}}
- job myjob scenario a=10,b=20 
  - This should result in {name: 'myjob', type="job", scenario: {a:10, b:20}}
- job myjob a=10,b=0,c=30
  - This should result in {name: 'myjob', type="job", scenario: {a:10, b:0, c:30}}
- job name scenario {"a":10,"b":20} type='def'
  - This should result in {name: 'name', type="def", scenario: {a:10, b:20}}
`;

  let spec = {
    name: 'jobs',
    description: description,
    schema: {
      name: z.string(),
      type: z.string().default('job'),
      scenario: z.any().default('')
    },
    required: ['name'],
    handler: async (params) => {
      let scenario = params.scenario;
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
      if (!params.type) {
        params.type = 'job';
      }
      let r = await _jobSubmit(params);
      return r;
    }
  }
  return spec;
}

export default job;
