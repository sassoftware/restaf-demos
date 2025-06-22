/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _catalogSearch from '../toolhelpers/_catalogSearch.js';

function searchAssets() {

  let description = `
## searchAssets: Search the SAS Catalog for assets using a flexible search string.

- Supports searching for various asset types (e.g., datasets, dataflows, models).
 - the default asset type is 'datasets'.
- The search string can include keywords, filters, and logical operators.
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
      searchstring: z.string(),
      assetType: z.string(),
      start: z.number().default(0),
      limit: z.number().default(10),

    },
    required: ['assetType'],
    handler: async (params) => {
      console.log('searchAssets params', params);
      return await _catalogSearch(params, 'search');
    }

  };

  return specs;
}
export default searchAssets;