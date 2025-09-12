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

Inputs
- program (string, required): Full SAS program text to execute on the server (for example: \`data a; x=1; run;\`).

Output
- Returns the response from the execution helper, typically containing ods, log, list of tables created

Behavior & usage notes
- This tool sends the supplied \`program\` verbatim to the SAS execution helper. It does not modify or validate the SAS code.
- For invoking pre-defined SAS macros, prefer the \`runMacro\` helper which converts simple parameter formats into \`%let\` statements and invokes the macro cleanly.
- Be cautious when executing arbitrary code — validate or sanitize inputs in untrusted environments.

Examples
- run sas "data a; x=1; run;"
- run sas "ods html style=barrettsblue; proc print data=sashelp.class; run; ods html close;"
`;
  let spec = {
    name: 'runSAS',
    description: description,
    
     schema: {
      program: z.string()
    },
    required: ['program'],
    handler: async (params) => {
      let src = params.program;
      console.log('runSAS handler', src);
      let r = await _submitCode(src, {})
      return r;
    }
  }
  return spec;
}

export default runSAS;
