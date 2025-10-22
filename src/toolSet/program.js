/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
//import _submitCode from '../toolhelpers/_submitCode.js';


function program(_ap) {
  let description = `
## Program

Execute a program on a SAS Viya server

Required Parameters
- src(string, required): The sas program to execute. This can be either:
  - a string containing the SAS code to execute, or
  - the name of a .sas file stored on the server in the specified folder

Optional Parameters
- folder(string, optional): if folder is specified, the src is assumed to be in that folder on the server under that name. Default is ' '.
- scenario (string | object ,optional): Input values to program/ Accepts:
  - a comma-separated key=value string (e.g. "x=1, y=2"),
  - a JSON object with field names and values (recommended for typed inputs),
- output (string, optional): default is ' '.This is case-sensitive. If specified, the data in this table will be returned as part of the response.
- limit (number, optional): maximum number of rows to return from the output. Default is 100

Behavior & usage notes
- This tool sends the supplied \`src\` verbatim to the SAS execution helper. It does not modify or validate the SAS code.
- For invoking pre-defined SAS macros, prefer the \`runMacro\` helper which converts simple parameter formats into \`%let\` statements and invokes the macro cleanly.
- Be cautious when executing arbitrary code — validate or sanitize inputs in untrusted environments.

Response
- If output is specified and the specified table exists in the response, display the data as a markdown table. 
Examples
- program "data a; x=1; run;"  - this is the simplest usage  -- {src= "data a; x=1; run;", folder=" ", output=" ", limit=100}
- program "data work.a; x=1; run;" output=a limit=50  -- {src= "data work.a; x=1; run;", folder=" ", output="a", limit=50}

- program sample folder=/Public/models output=A limit=50 -- {src= "sample", folder="/Public/models", output="A", limit=50}
- program sample folder=/Public/models scenario="name='John', age=45" output=a limit=50 -- {src= "sample", folder="/Public/models", scenario: {name: "John", age: 45}, output="a", limit=50}
- program sample folder=/Public/models with scenario name=John,age=45 output=a limit=50  -- {src= "sample.sas", folder="/Public/models", scenario: {name: "John", age: 45}, output="a", limit=50}
  - this should be the same as the previous example and is just a different syntax. The result should be
    {program: "sample", folder: "/Public/models", scenario: {name: "John", age: 45}, output: "a", limit: 50}
`;
  let _submitCode = _ap.toolsHelper._submitCode;
  let spec = {
    name: 'program',
    description: description,
    schema: {
      src: z.string(),
      scenario: z.any().default(''),
      output: z.string().default(''),
      folder: z.string().default(''),
      limit: z.number().default(100)
    },
  // NOTE: Previously 'required' incorrectly listed 'program' which does not
  // exist in the schema. This prevented execution in some orchestrators that
  // enforce required parameter presence, causing only descriptions to appear.
  // Corrected to 'src'.
  required: ['src'],
    handler: async (params) => {
      let {src, folder, scenario} = params;
      // figure out src
      let isrc = src;
      if (folder != null && folder.trim().length > 0) {
        if (isrc.indexOf('.sas') < 0) {
          isrc = isrc + '.sas';
        }
        isrc = `
          filename mcptemp filesrvc folderpath="${folder}";
          %include mcptemp("${isrc}");
          filename mcptemp clear;
        `;
      }
      // figure out macros
  
      if (typeof scenario === 'string' && scenario.includes('=')) {
        scenario = scenario.split(',').reduce((acc, pair) => {
          const [k, ...rest] = pair.split('=');
          if (!k) return acc;
          acc[k.trim()] = rest.join('=').trim();
          return acc;
        }, {});
      }
      let iparms = {
        args: scenario,
        output: params.output,
        limit: params.limit,
        src: isrc
      }
     // console.error('iparms', iparms);
      let r = await _submitCode(iparms);
      return r;
    }
  }
  return spec;
}

export default program;
