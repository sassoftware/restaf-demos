/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import _scrScore from '../toolhelpers/_scrScore.js';
import scrModels from '../db/scrModels.js';



function scrScore(_appContext) {
  let description = `
## scrScore

Purpose
Score a scenario using a model deployed as a SCR container  in Azure or another host).

Inputs
- url (string, required): SCR model identifier (URL)
- scenario (string | object | array, optional): Input values to score. Accepts:
  - a comma-separated key=value string (e.g. "x=1, y=2"),
  - a JSON object with field names and values (recommended for typed inputs),
  - an array of objects for batch scoring. If omitted, the tool will return the model's input variable definitions.

What it returns
- When scoring: the SCR endpoint response (predictions, probabilities, scores) merged with or alongside the supplied inputs.
- When \`scenario\` is omitted: metadata describing the model's input variables (names, types, required/optional).

Usage notes
- Run \`scrInfo\` first to inspect the expected input variables and types.
- Prefer structured objects for numeric/date values to avoid type ambiguity; the simple string parser keeps values as strings.
- Ensure network connectivity and any required credentials for the target SCR service.

Examples
- scrScore with url="loan" and scenario="age=45, income=60000"
- scrScore with url="https://scr-host/models/loan" and scenario={age:45, income:60000}
`;

  let spec = {
    name: 'scrScore',
    description: description,
    schema: {
      url: z.string(),
      scenario: z.any()
    },
    required: ['url'],
    handler: async (params) => {
      let {url, scenario,_appContext} = params;
  
      if (url === null) {
        return { status: { statusCode: 2, msg: `SCR model ${url} was not specified` }, results: {} };
      }

      // Normalize simple string scenarios like "x=1, y=2" into an object
      if (typeof scenario === 'string' && scenario.includes('=')) {
        scenario = scenario.split(',').reduce((acc, pair) => {
          const [k, ...rest] = pair.split('=');
          if (!k) return acc;
          acc[k.trim()] = rest.join('=').trim();
          return acc;
        }, {});
      }

      let r = await _scrScore({ url: url, scenario: scenario , _appContext: _appContext});
      return r;
    }
  }

  return spec;
}

export default scrScore;