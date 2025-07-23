/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import debug from 'debug';
import _scrScore from '../toolhelpers/_scrScore.js';
import scrModels from '../db/scrModels.js';

const log = debug('scr');

function scrScore() {
  let description = `
  ## scrScore - This tool is used to score a scenario using a model published as a SCR container to some provider like 
  Azure.

  The input to this tool is:
  - name - the name of the deployed SCR container.
  - scenario - The scenario is a key-values pairs like x=1, y=2, z=3
    - if scenario is not specified, the tool will return the variables in the model
  - stream - if this optional input is true, the result is returned as a string of the form "x=1, y=2, z=3"


  ### Sample Prompts
  - scrscore with url  for x1=1,x2=2

  ### Notes
  Use scrInfo to get the input variables for the model.
  `;
  let spec = {
    name: 'scrScore',
    description: description,
    schema: {
      name: z.string(),
      scenario: z.string(),
      stream: z.boolean()
    },
    required: ['name', 'scenario'],
    handler: async (params) => {
      let url= scrModels(params.name);
      if (url === null) {
        return { status: { statusCode: 2, msg: `SCR model ${params.name} not found` }, results: {} };
      }
      let r = await _scrScore({url: url, scenario: params.scenario, stream });
      return r;
    }
  }

  return spec;
}

export default scrScore;