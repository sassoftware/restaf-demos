/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import debug from 'debug';
import _scrInfo from '../toolhelpers/_scrInfo.js';
import scrModels from '../db/scrModels.js';


function scrInfo() {
  const log = debug('scr');
  let description = `
  ## scrInfo is tool that returns information about a SCR model. 
 It returns the input and output schema for the SCR model.
  ### Sample queries

  - describe scr model "loan"
  - describe scr model http://....
  `;
  let spec = {
    name: 'scrInfo',
    description: description,
    schema: {
      name: z.string(),
    },
    required: ['name'],
    handler: async (params) => {
      let url= scrModels(params.name);
      if (url === null) {
        return { status: { statusCode: 2, msg: `SCR model ${params.name} not found` }, results: {} };
      }
      let r = await _scrInfo({url});
      return r;
    }
  }
  return spec;
}

export default scrInfo;
