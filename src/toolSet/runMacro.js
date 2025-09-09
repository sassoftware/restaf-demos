/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import _submitCode from '../toolhelpers/_submitCode.js';


function runMacro() {
  let description = `
  ## runMacro - This tool  runs the user supplied model nam SAS Viya server.  
 
  ### Required Parameters
   - macro - the name of the macro to be executed on the SAS server

  ### Optional Parameters
  - scenario - the scenario to be passed to the macro. User will specify  this in the form x=1, y=2, z=ccc but you must convert it to a string in the form '%let x=1; %let y=2; %let z=ccc; ' if not specified set the value of scenario to an empty string.

  ### Sample Prompts
  - macro abc with x=1, y=2, cccc
 
  ### Instructions
  Instruction: "Convert the following scenario string into SAS %let statements. If the input already contains %let or other SAS macro syntax, return it unchanged. Output only the SAS code, e.g. %let x=1; %let y=abc;."
  Examples:
  Input: "x=1,y=abc" → "%let x=1; %let y=abc;"
  Input: "a=1, b = "a,b" " → "%let a=1; %let b="a,b";"
  Input: "%let x=2; %abc;" → "%let x=2; %abc;"

 
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
      console.log('code to submit', src);
      let r = await _submitCode(src, {})
      return r;
    }
  }
  return spec;
}

export default runMacro;
