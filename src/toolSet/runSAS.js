/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import _submitCode from '../toolhelpers/_submitCode.js';
import { required } from 'zod/v4-mini';


function runSAS() {
  let description = `
  ## runSAS - This tool  runs the user supplied SAS program on SAS Viya server.  
 
  ### Required Parameters

  - program - the code for the SAS program to be executed on the SAS server

  ### Output
  The tool will return results in a JSON format

  ### Sample Prompts
  - run sas 'data a; x=1; run;'
  - run sas 'ods html style=barrettsblue; proc print data=sashelp.class; run; ods html close;'
  
  ### Notes
  If you have built macros on the SAS server use the runMacro tool instead.
  `;
  let spec = {
    name: 'runSAS',
    description: description,
    
     schema: {
      program: z.string()
    },
    required: ['program'],
    /*
    inputSchema: {
      type: 'object',
      properties: {
        program: {
          type: 'string', description: 'the SAS code to be executed on the SAS server'
        }
      },
      required: ['program'],
    },
   
    outputSchema: {
      type: 'object',
      properties: {
        ods: {
          type: 'string',
          description: 'The ODS output from the submitted SAS code'
        },
        log: {
          type: 'string',
          description: 'The SAS log from the submitted SAS code'
        },
        tables: {
          type: 'array',
          description: 'Any output tables from the submitted SAS code'
        }
      }
    },
    */
   
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
