/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _catalogSearch from '../toolhelpers/_catalogSearch.js';

function searchAssets() {

  let description = `
Search the SAS Catalog for assets using a flexible search string.

- Supports searching for various asset types (e.g., datasets, dataflows, models).
- You can specify start and limit to control pagination of results.
- The searchstring can include:
  - Simple terms (e.g., customer).
  - Key-value pairs (e.g., type:dataset or owner:john).
  - Logical operators AND and OR between terms.
  - Sets (e.g., status:{active,archived}).
- The search string is parsed according to these rules:
  1. Terms without ':' or '=' are treated as search keywords.
  2. Key-value pairs (with ':') are treated as filters.
  3. AND/OR are treated as logical operators when between terms.
  4. Sets in the form key:{value1,value2} are supported as filters.
`;

  let specs = {
    name: 'searchAssets',
    description: description,
    schema: {
      searchstring: z.string().default(''),
      // asset: z.enum(['dataflows', 'datasets', 'dataplans', 'models', 'modelprojects', 'modelstudioprojects', 'report', 'rulesets', 'referencedatadomains', 'codefiles', 'decisions', 'riskdataprojects', 'riskmodels']).default('dataflows'),
      assetType: z.string().default('datasets'),
      start: z.number().default(0),
      limit: z.number().default(10),

    },
    required: ['asset'],
    handler: async (params) => {
      console.log('searchAssets params', params);
      return await _catalogSearch(params, 'search');
    }

  };

  return specs;
}
export default searchAssets;