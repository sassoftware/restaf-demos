/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import _listModels from '../toolhelpers/_listModels.js';

function findModel() {
  let description = `
## findModel

Purpose
Locate a model published to the MAS server in SAS Viya.

Inputs
- name (string): The model name to search for. 

Output
An array of matching models (or an empty array when no match).

Usage notes
- Use this tool to discover whether the model existsbefore calling \`modelInfo\` or \`modelScore\`.


Examples
- find model myModel
- find model cancer
`;

  let spec = {
    name: 'findModel',
    description: description,
    schema: {
      'name': z.string()
    },
    required: ['name'],
    handler: async (params) => { 
      // Check if the params.scenario is a string and parse it
      let r = await _listModels(params);
      return r;
    }
  }
  return spec;
}

export default findModel;
