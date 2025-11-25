/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import debug from 'debug';
//import _masDescribe from '../toolhelpers/_masDescribe.js';
const log = debug('tools');

function modelInfo(_appContext) {
  let description = `
## modelInfo — retrieve detailed metadata for a deployed model

LLM Invocation Guidance (When to use)
Use THIS tool when:
- User wants input/output variable information: "What inputs does model X need?"
- User wants to understand model variables: "Describe model myModel"
- User wants data types and roles: "Show me the variables for myModel"
- User wants to prepare data for scoring: "What are the required inputs for model sales_forecast?"

Do NOT use this tool for:
- Checking if a model exists (use findModel)
- Listing available models (use listModels)
- Scoring a model (use modelScore)
- Looking up tables or jobs (use respective find/list tools)

Purpose
Retrieve detailed metadata for a model deployed to MAS (Model Aggregation Service). This includes input variable names, data types, roles/usage, ranges, and output variable information. Use this before scoring to understand what data the model requires.

Parameters
- model (string, required): The name of the model as published to MAS. Must be exact match.

Response Contract
Returns a JSON object containing model metadata, typically including:
- name: The model name
- inputs: Array of input variable objects with:
  - name: Variable name
  - type: Data type (numeric, character, etc.)
  - role: Role in model (input, key, etc.)
  - allowed_values or range: Optional constraints
- outputs: Array of output/prediction objects with:
  - name: Prediction/output variable name
  - type: Data type
  - possible_values: For classification models, the class labels
- model_type: Type of model (regression, classification, etc.)
- description: Optional model description

Disambiguation & Clarification
- If model name is missing: ask "Which model would you like to see information for?"
- If user says "variables" without specifying model: ask "Which model would you like the variables for?"
- Multiple model requests: handle one at a time

Examples (→ mapped params)
- "What inputs does model churnRisk need?" → { model: "churnRisk" }
- "Describe model creditScore" → { model: "creditScore" }
- "Show the variables for myModel" → { model: "myModel" }
- "What are the outputs of model sales_forecast?" → { model: "sales_forecast" }

Negative Examples (should NOT call modelInfo)
- "List all available models" (use listModels instead)
- "Find model cancer" (use findModel instead)
- "Score this customer with model churnRisk" (use modelScore instead)

Related Tools
- listModels → findModel → modelInfo → modelScore (typical workflow)
- findModel — to check if a specific model exists
- modelScore — to score data using the model
`;

  let spec = {
    name: 'modelInfo',
    description: description,
    schema: {
      'model': z.string()
    },
    required: ['model'],
    handler: async (params) => {
      let r = await _masDescribe(params);
      return r;
    }
  }
  return spec;
}

export default modelInfo;
