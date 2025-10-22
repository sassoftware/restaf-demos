/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
//import _listModels from '../toolhelpers/_listModels.js';

function listModels(_appCon) {
  let description = `
  ## listModels — enumerate models published to MAS (Model Publish / Scoring service)

  LLM Invocation Guidance (When to use)
  Use THIS tool when the user wants a collection of models, e.g.:
  - "list models"
  - "show models"
  - "list available models"
  - "browse models"
  - "list 25 models" / "list models limit 25"
  - "next models" (after a previous page)

  Do NOT use this tool for:
  - Checking a single model's existence (use findModel)
  - Getting model metadata / variables (use modelInfo)
  - Scoring a model (use modelScore)
  - Looking up jobs, libraries, tables, or SCR endpoints (route to respective tools)

  Purpose
  Provide a paginated view of MAS-registered models so the caller can then drill into one via modelInfo or score it.

  Parameters
  - limit (number, default 10): Number of models to return for this page.
  - start (number, default 1): 1-based offset. For paging: start = start + limit.

  Response Contract
  - Returns an array of model entries (names or metadata objects). Empty array if no models.
  - If returned length === limit, caller may request the next page.

  Pagination Examples
  - First page: { start:1, limit:10 }
  - Next page: { start:11, limit:10 }

  Disambiguation & Clarification
  - Input only "list" → ask: "List models? (Say 'list models' to proceed)" unless prior context strongly indicates models.
  - "find model X" → use findModel instead.
  - "score model X" → use modelScore.
  - "describe model X" → use modelInfo.

  Negative Examples (should NOT call listModels)
  - "find model churn" (findModel)
  - "model info customerRisk" (modelInfo)
  - "score model sales_pred" (modelScore)
  - "list jobs" (listJobs)

  Usage Tips
  - Combine with findModel for narrowing down after a broad list.
  - Increase limit judiciously; very large pages can impact latency.

  Examples (→ mapped params)
  - "list models" → { start:1, limit:10 }
  - "list 25 models" → { start:1, limit:25 }
  - "next models" (after prior {start:1,limit:10}) → { start:11, limit:10 }
  `;

  let _listModels = _appCon.toolsHelper._listModels;
  let spec = {
    name: 'listModels',
    description: description,
    schema: {
  'limit': z.number().default(10),
  'start': z.number().default(1) 
    },
    handler: async (params) => { 
      // Call underlying helper
      let r  = await _listModels(params);
      return r;
    }
  }
  
  return spec;
}

export default listModels;
