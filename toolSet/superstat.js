/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import _submitCode from '../toolhelpers/_submitCode.js';
import { z } from 'zod';

function superstat() {
  let desc = `
      superstat:  compute superstat for two numbers. 

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

      let r = await _submitCode(src, params);
      return r;
    }

  };
  return spec;
}
export default superstat;
