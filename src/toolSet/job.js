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
- name(string, required): The name of the job or jobDefinitionto run. 

Optional Parameters
- type(string, required): Either job or definition. Default is job.
- scenario(string | object ,optional): Input values to program/ Accepts:
  - a comma-separated key=value string (e.g. "x=1, y=2"),
  - a JSON object with field names and values (recommended for typed inputs),
- output (string, optional): default is ' '.This is case-sensitive. 
  If specified, the data in this table will be returned as part of the response. 

Behavior & usage notes
- To run SAS code directly, use the \'program\' tool.
- For invoking pre-defined SAS macros, prefer the \`runMacro\` helper which converts simple parameter formats into \`%let\` statements and invokes the macro cleanly.

Examples
- job myjob scenario param1=10,param2=val2 with  output "mylib.MyOutputTable"
- job myjob scenario a=10,b=20 with output "mylib.MyOutputTable"
`;

  let spec = {
    name: 'jobs',
    description: description,
    schema: {
      name: z.string(),
      type: z.enum(['job', 'definition', 'def']).default('job'),
      scenario: z.any().default(''),
      output: z.string().default('')
    },
    required: ['name'],
    handler: async (params) => {
      let scenario = params.scenario;
      let scenarioObj ={};
       let count = 0;
       debugger;
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
      let r = await _jobSubmit(params);
      return r;
    }
  }
  return spec;
}

export default job;
