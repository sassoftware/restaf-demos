/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import _submitCode from '../toolhelpers/_submitCode.js';
import { z } from 'zod';

function superstat(_appContext) {
  let desc = `
  ## superstat:  compute superstat for two numbers using SAS programming 

  ## Details
  This is a tool to demonstrate using SAS programming to score. The SAS program for suprestat is
  below. In a real application this would be a more complex program that is 
  available to the SAS server.

  
    ods html style=barrettsblue;  
    data temp;
    superstat = (&a + &b) * 42;
    run;
    proc print data=temp;
    run;
    ods html close; 
    run;
  
  ## Sample Prompt

    - compute superstat for 1 and 2
    - compute superstat for 3,5
    
    `;

  let spec = {
    name: 'superstat',
    description: desc,
    schema: {
      a: z.number(),
      b: z.number()
    },
    required: ['a', 'b'],
    handler: async (params) => {
      let src = `
          ods html style=barrettsblue;  
          data temp;
          superstat = (&a + &b) * 42;
          run;
          proc print data=temp;
          run;
          ods html close; 
          run;
          `;
      params.src = src;
      let r = await _submitCode(params);
      return r;
    }

  };
  return spec;
}
export default superstat;
