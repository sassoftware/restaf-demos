/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import _submitCode from '../toolhelpers/_submitCode.js';


function runMacro(_appContext) {
  let description = `
## runMacro

Submit and execute a SAS macro on a SAS Viya server by generating and sending SAS code.

Inputs
- macro (string, required): The name of the macro to execute (provide the macro identifier without the leading "%").
- scenario (string, optional): Parameters or SAS setup code to send before invoking the macro. Accepted formats:
  - Comma-separated key=value pairs (e.g. "x=1, y=abc") — converted to SAS %let statements.
  - Raw SAS macro code (e.g. "%let x=1; %let y=abc;") — passed through unchanged when it already contains SAS macro syntax.

Behavior
- If \`scenario\` contains SAS macro syntax (contains \`%let\` or other macro markers), it is sent unchanged.
- Otherwise the tool converts comma-separated parameters into \`%let\` statements (e.g. "x=1,y=abc" → "%let x=1; %let y=abc;") and appends a macro invocation \`%<macro>;\`.
- The resulting SAS code is submitted via the internal \`_submitCode\` helper and the submission result is returned.

Output
- Returns the response produced by \`_submitCode\`, typically including ods, log, list of tables created by the macro

Usage notes
- Ensure the target SAS environment has the macro defined
- This helper does not perform advanced input validation or type coercion — validate parameters before calling when needed.

Examples
- run macro \`abc\` with scenario \`x=1, y=2\`
- run macro \`summarize\` with raw SAS code \`%let x=1; %let y=2;\` (the helper will pass it through unchanged)
`;

  let spec = {
    name: 'runMacro',
    description: description,
    
     schema: {
      macro: z.string(),
      scenario: z.string()
    },
    required: ['macro'],
    handler: async (params) => {
      const scenarioRaw = (params.scenario || '').trim();
      let setup = '';
      if (scenarioRaw) {
        // If the scenario already contains macro syntax, send it through unchanged
        const hasMacroSyntax = /%let\b|%[a-zA-Z_]\w*\s*\(|%[a-zA-Z_]\w*\s*;/.test(scenarioRaw) || scenarioRaw.includes('%');
        if (hasMacroSyntax) {
          setup = scenarioRaw;
        } else {
          // Convert "x=1,y=abc" -> "%let x=1; %let y=abc;"
          setup = scenarioRaw.split(',')
            .map(p => p.trim())
            .filter(Boolean)
            .map(p => {
              const [k, ...rest] = p.split('=');
              if (!k) return '';
              const key = k.trim();
              const val = rest.join('=').trim();
              return `%let ${key}=${val};`;
            })
            .filter(Boolean)
            .join(' ');
        }
      }
      const src = `${setup} %${params.macro};`;
      params.src = src;
      let r = await _submitCode(params);
      return r;
    }
  }
  return spec;
}

export default runMacro;
