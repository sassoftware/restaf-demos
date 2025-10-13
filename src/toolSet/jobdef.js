/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';

import _jobSubmit from '../toolhelpers/_jobSubmit.js';


function jobDef() {
  // JSON object for LLM/tooling
  const descriptionJson = {
  
    purpose:  "Execute a jobdefinition on a SAS Viya server.",
    parameters: {
      required: {
        name: "string (required) - The name of the jobdefinition"
      },
      optional: {
        scenario: "string | object (optional) - Input values to program. Accepts a comma-separated key=value string (e.g. 'x=1, y=2') or a JSON object with field names and values."
      }
    },
    usage_notes: [
      "To run SAS code directly, use the 'program' tool.",
      "To run a job  use the jobdefinition tool.",
      "For invoking pre-defined SAS macros, prefer the runMacro helper which converts simple parameter formats into %let statements and invokes the macro cleanly."
    ],
    response: "The response could include log, listing and JSON output depending on how the jobdefinition is defined. If output includes the JSON key, display it in a tabular format if possible.",
    examples: [
      {
        input: "jobdef xyz scenario param1=10,param2=val2 output='a.json'",
        result: "{name: 'xyz',  scenario: {param1: 10, param2: 'val2'}, output: 'a'}"
      },
      {
        input: "jobdef myjobdefinition scenario a=10,b=20",
        result: "{name: 'myjobdefinition',  scenario: {a: 10, b: 20}, output: 'a'}"
      },
      {
        input: "jobdef myjobdefinition a=10,b=0,c=30",
        result: "{name: 'myjobdefinition',  scenario: {a: 10, b: 0, c: 30}, output: 'a'}"
      },
      {
        input: "jobdef name scenario {\"a\":10,\"b\":20}",
        result: "{name: 'name',scenario: {a: 10, b: 20}, output: 'a'}"
      }
    ]
  };

  let description = [
  '## jobdef',
  '',
  'Execute a jobdefinition on a SAS Viya server',
  '',
  'Required Parameters',
  '- name (string, required): The name of the jobdefinition',
  '',
  'Optional Parameters',
  '- scenario (string | object, optional): Input values to program. Accepts:',
  '  - a comma-separated key=value string (e.g. "x=1, y=2"),',
  '  - a JSON object with field names and values (recommended for typed inputs),',
 
  '',
  'Behavior & usage notes',
  "- To run SAS code directly, use the 'program' tool.",
  '- For invoking pre-defined SAS macros, prefer the runMacro helper which converts simple parameter formats into %let statements and invokes the macro cleanly.',
  '',
  'Response',
  'The response could include log, listing and a tables object depending on how the jobdefinition is defined.',

  'Behavior & usage notes',
  'By default display the contents of the tables in a tabular format if possible.',
  'Examples',
  '- jobdef xyz param1=10,param2=val2',
  "  - This should result in {name: 'xyz', scenario: {param1: 10, param2: 'val2'}}",
  '- jobdef myjobdef scenario a=10,b=20',
  "  - This should result in {name: 'myjobdef',  scenario: {a: 10, b: 20}}",
  ''
].join('\n');

  let spec = {
    name: 'jobdef',
    description: description,
    schema: {
      name: z.string(),
      scenario: z.any().default(''),
    },
    required: ['name'],
    handler: async (params) => {
      let scenario = params.scenario;
      let scenarioObj = {};
      let count = 0;
      // debugger;
      if (scenario == null) {
        scenarioObj = {};
      } else if (typeof scenario === 'object') {
        scenarioObj = scenario;
      } else if (Array.isArray(scenario)) {
        scenarioObj = scenario[0];
      } else if (typeof scenario === 'string') {
        if (scenario.trim() === '') {
          scenarioObj = {};
        } else {
         // console.error('Incoming scenario', scenario);
          scenarioObj = scenario.split(',').reduce((acc, pair) => {
            let [key, value] = pair.split('=');
            acc[key.trim()] = value;
            count++;
            return acc;
          }, {});
        }
      }
      params.type = 'def';
      params.scenario = scenarioObj;
      let r = await _jobSubmit(params);
      return r;
    }
  };
  return spec;
}

export default jobDef;
