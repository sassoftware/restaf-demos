/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _catalogSearch from '../toolhelpers/_catalogSearch.js';

function searchAssets() {

  let description = `
# Search SAS Cataalog for a specific asset with a search string

- User can specify start and limit to limit the number of items returned.

### Hints are formatting the searchstring. A search string has one or more search terms separated by spaces.
The searchstring string is created from the user input using these rules:

a. if the string has no ':' or '=' at the end of the string, then use it as a  search term 
b. if the string looks like  keystring:string or keystring: string treat it as another search term.
c. The string AND is treated as a logical AND and a search term when it appears between two search terms.
d. The string OR is treated as a logical OR and a search term when it appears between two search terms.
e. if the string is of the format keystring: {string1, string2} then treat it as another search term.
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