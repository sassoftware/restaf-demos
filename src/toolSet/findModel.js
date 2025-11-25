/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import _listModels from '../toolhelpers/_listModels.js';


function findModel(_appContext) {
  let description = `
  ## findModel — locate a specific model deployed to MAS (Model Publish / Scoring service)

  LLM Invocation Guidance (When to use)
  Use THIS tool when the user wants to know whether ONE model exists or is deployed:
  - "find model cancerRisk"
  - "does model churn_tree exist"
  - "is model sales_forecast deployed"
  - "lookup model claimFraud"
  - "verify model credit_score_v2 exists"

  Do NOT use this tool for:
  - Listing many / browsing models (use listModels)
  - Retrieving detailed input/output variable metadata (use modelInfo)
  - Scoring or running a model (use modelScore)
  - Searching model execution containers or SCR endpoints (use scrInfo / scrScore if appropriate)

  Purpose
  Quick existence / lookup check for a MAS‑published model. Returns a list with zero or more matches (typically 0 or 1 for an exact name).

  Parameters
  - name (string, required): Exact model name. If user supplies phrases like "model named X" extract X. If multiple names are given (comma or space separated), prefer the first and (optionally) ask for a single name.

  Matching Rules
  - Attempt exact match first. If backend supports partial search, a substring match MAY return multiple models; preserve order.
  - Do not fabricate models. Empty array means not found.

  Response Contract
  - Always: { models: Array<object|string> }
  - Never return prose when invoked programmatically; only the JSON structure.
  - On error: surface backend error object directly (no rewriting) so the caller can display/log it.

  Disambiguation & Clarification
  - Missing name (e.g., "find model") → ask: "Which model name would you like to find?"
  - Plural intent (e.g., "find models" / "list models") → use listModels instead.
  - If user requests scoring ("score model X") → route to modelScore not findModel.

  Examples (→ mapped params)
  - "find model myModel" → { name: "myModel" }
  - "does model churn_score exist" → { name: "churn_score" }
  - "is model riskModel deployed" → { name: "riskModel" }
  - "lookup model claims_fraud_v1" → { name: "claims_fraud_v1" }

  Negative Examples (should NOT call findModel)
  - "list models" (listModels)
  - "score model myModel" (modelScore)
  - "describe model myModel" (modelInfo)

  Notes
  - Chain usage: findModel → modelInfo → modelScore.
  - For batch existence checks iterate over a list and call findModel per entry.
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
