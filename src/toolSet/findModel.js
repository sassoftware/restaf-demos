/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import _listModels from '../toolhelpers/_listModels.js';
import { de } from 'zod/v4/locales';

function findModel() {
  let llmDescription = {
    "purpose": "Map natural-language requests to findModel parameters and return a compact, machine-readable response.",
    "param_mapping": {
      "name": "required - model name or substring to search for"
    },
    "response_schema": "{ models: Array<object|string> }",
    "behavior": "Return only a JSON object matching response_schema. Use defaults when params missing. If ambiguous, ask one short clarifying question. If no results, return { models: [] }.",
    "examples": [
      { "input": "find model myModel", "mapped_params": { "name": "myModel" } },
      { "input": "find model cancer", "mapped_params": { "name": "cancer" } }
    ],
    "clarification_rules": "If name missing: 'Which model name would you like to find?'.",
    "safety": "Do not call external services beyond the tool; surface tool errors as structured error objects."
  };

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
