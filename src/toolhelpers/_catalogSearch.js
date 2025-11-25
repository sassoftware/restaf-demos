/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// An initial pass at using catalog search
// not sure of its usefulness yet since the search string
// syntax is designed for nerdy users.
// Maybe one can instruct LLM to format a user friend search into
// required syntax
// But then I am an expert on SAS Catalog
import restaf from '@sassoftware/restaf';
import getLogonPayload from '../toolhelpers/getLogonPayload.js';
import _itemsData from '../toolhelpers/_itemsData.js';
import debug from 'debug';
import getStoreOpts from '../toolhelpers/getStoreOpts.js';



async function _catalogSearch(params, rel) {
  let { searchstring, start, limit , _appContext} = params;
  let splitsearchstring = searchstring.trimStart().split(' ');
  let assetType = ' ';
  if (!splitsearchstring[0].includes(':')) {
    if (['dataflows',
      'datasets',
      'dataplans',
      'models',
      'modelprojects',
      'modelstudioprojects',
      'report',
      'rulesets',
      'referencedatadomains',
      'codefiles',
      'decisions',
      'riskdataprojects',
      'riskmodels'
    ].includes(splitsearchstring[0])) {
      assetType = `${splitsearchstring[0]}`;
      splitsearchstring[0] = 'AssetType:' + splitsearchstring[0];
      searchstring = splitsearchstring.join(' ');
    } else {
      assetType = `${splitsearchstring[0]}`;
    }
  }

  limit = (limit) ? limit : 10;
  start = (start) ? start : 0;



  // https://go.documentation.sas.com/doc/en/infocatcdc/v_034/infocatug/n09x2n3z9t2izln1vtx68oho8t8x.htm?requestorId=84052456-0342-4389-a344-5cc71cbec5cc

  try {

     let store = restaf.initStore({
      casProxy: true,
      options: {
        proxyServer: null,
        httpOptions: getStoreOpts(_appContext)
      }
  });
    let logonPayload = await getLogonPayload(_appContext);
    let msg = await store.logon(logonPayload);

    if (rel == null) {
      rel = 'search';
    }
   
    let { catalog } = await store.addServices('catalog');
    let payload = {
      qs: { q: searchstring, limit: limit, start: start },
    };
  

    let r = await store.apiCall(catalog.links(rel), payload);
 
    let rx = _itemsData(r);
    return {
      content: [
        {
        type: 'text', text: JSON.stringify(rx)
        }
      ],
      structuredContent: rx,
    }
  } catch (err) {
    console.error('Error in searchAssets:', JSON.stringify(err, null, 4));
    return {
      isError: true,
      content:[{
        type: 'text', text: JSON.stringify(err)
      }]
    }
  }
}
export default _catalogSearch;
