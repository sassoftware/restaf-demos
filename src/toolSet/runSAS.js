/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import _submitCode from '../toolhelpers/_submitCode.js';


function runSAS() {
  let description = `
## runSAS

Execute a SAS program on a SAS Viya server by submitting raw SAS code.

Required parameters
- program(string, required): An alias for program is src. Full SAS program text to execute on the server (for example: \`data a; x=1; run;\`)
- folder(string, optional): if folder is specified, the program is assumed to be in that folder on the server. Default is blank.
- scenario (string | object ,optional): Input values to program/ Accepts:
  - a comma-separated key=value string (e.g. "x=1, y=2"),
  - a JSON object with field names and values (recommended for typed inputs),
- output (string, optional): This is case-sensitive. If specified, the data in this table will be returned as part of the response.
- limit (number, optional): maximum number of rows to return from the output. Default is 100

Behavior & usage notes
- This tool sends the supplied \`program\` verbatim to the SAS execution helper. It does not modify or validate the SAS code.
- For invoking pre-defined SAS macros, prefer the \`runMacro\` helper which converts simple parameter formats into \`%let\` statements and invokes the macro cleanly.
- Be cautious when executing arbitrary code — validate or sanitize inputs in untrusted environments.

Examples
- run sas "data a; x=1; run;"
- run sas " proc print data=sashelp.class; run;"
- run sas "data work.a; x=1; run;" output=work.a limit=50
- run sas sample folder=/Public/models output=work.a limit=50
- run sas sample folder=/Public/models scenario="name='John', age=45" output=work.a limit=50
- run sas sample folder=/Public/models with scenario name=John,age=45 output=work.a limit=50 
  - this should be the same as the previous example and is just a different syntax. The result should be
    {program: "sample", folder: "/Public/models", scenario: {name: "John", age: 45}, output: "work.a", limit: 50}
`;
  let spec = {
    name: 'runSAS',
    description: description,
    
     schema: {
      program: z.string(),
      scenario: z.any(),
      output: z.string(),
      folder: z.string(),
      limit: z.number().default(100)
    },
    required: ['program'],
    handler: async (params) => {
      let {program, folder, args} = params;
      // figure out src
      let src = program;
      if (folder != null && folder.trim().length > 0) {
        if (program.indexOf('.sas') < 0) {
          program = program + '.sas';
        }
        src = `
          filename mcptemp filesrvc folderpath="${folder}";
          %include mcptemp("${program}");
          filename mcptemp clear;
        `;
      }
      // figure out macros
      let scenario = params.scenario;
      if (typeof scenario === 'string' && scenario.includes('=')) {
        scenario = scenario.split(',').reduce((acc, pair) => {
          const [k, ...rest] = pair.split('=');
          if (!k) return acc;
          acc[k.trim()] = rest.join('=').trim();
          return acc;
        }, {});
      }
      console.log('params', params);
      console.log('runSAS handler', src);
      let iparms = {
        args: scenario,
        output: params.output,
        limit: params.limit
      }
      console.log('iparms', iparms);
      let r = await _submitCode(src, iparms);
      return r;
    }
  }
  return spec;
}

export default runSAS;
