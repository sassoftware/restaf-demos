/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import debug from 'debug';
import _score from '../toolhelpers/_score.js';
const log = debug('tools');

function loanscore() {
  let description = `
      ## loanscore  - This tool is used to score a loan application using a model published to SCR.

      It is based on a model that was published to SCR a long time ago. Used here to demonstrate how 
      to use a model in SCR to score.

    ### Input Parameters

    The required input parameters for this tool are as follows:
    - loan

    ### Output
    - The tool returns a score based on the input parameters, which indicates the  next action for the loan application. 
      
      `;
  let spec = {
    name: 'loanscore',
    description: description,
    schema: {
      'loan': z.number(),
    },
    required: ['loan'],
    handler: handlerfn
  };

  //custom handler function to score a loan application
  async function handlerfn(params) {
    let iparms = {
      "clage": 94.36666667,
      "clno": 9,
      "debtinc": 0,
      "delinq": 0,
      "derog": 0,
      "job": "Other",
      "loan": params.loan,
      "mortdue": 25860,
      "ninq": 1,
      "reason": "HomeImp",
      "value": 39025,
      "yoj": 10.5
    };

    let { outputs, error } = await _score(process.env.LOANURL, iparms);
   
    if (error !== null) {
      console.error('Error scoring loan:', error);
      return { content: [{ type: 'text', text: `Error scoring loan: ${error.message}` }] };
    }
    else {
      let output = {};
      outputs.map((item) => {
        if (item.name === 'loanaction' ){
          output[item.name] = item.value;
        }
        else if (item.name === 'Rating_pool') {
          output[item.name] = item.value;
        }
      });
      return {content: [
        {
          type: 'text',
          text: JSON.stringify(output)
        }
      ]
    }
  }
}

return spec;
}

export default loanscore;
