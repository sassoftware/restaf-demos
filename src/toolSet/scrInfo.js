/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import debug from 'debug';
import _scrInfo from '../toolhelpers/_scrInfo.js';
import scrModels from '../db/scrModels.js';


function scrInfo(_appContext) {
  const log = debug('scr');
  let description = `
## scrInfo

Purpose
Return the input/output schema and metadata for an SCR (Score Code Runtime) model.

Inputs
- name (string): The SCR model identifier. 
What it returns
- A JSON object describing the model's interface, typically including:
  - Input variables (names, types, required/optional)
  - Output variables (predictions, probabilities, scores)
  

Usage notes
- If no local mapping exists and \`name\` looks like a URL, the tool will attempt to fetch the schema from that URL.
- Ensure network connectivity and credentials for the remote SCR service when needed.

Examples
- describe scr model "https://scr-host/models/loan"
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
