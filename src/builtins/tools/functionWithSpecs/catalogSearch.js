
import itemsData from '../lib/itemsData.js';

async function _catalogSearchInstance(params,appEnv,gptControl){
  params.rel ='instances';
  return _catalogSearch(params,appEnv,gptControl);
}
const _catalogSearchFunctionSpec = {
  type: 'function',
  function: {
    name: '_catalogSearch',
    description: `Search for information in SAS Viya using search terms. Users can alias search with the following terms:
        find,   search,   look for,   search for,   where
        User can specify start and limit to limit the number of items returned.
        The metdata string is created from the user input using these rules:
        a. if the string has no ':' or '=' at the end of the string, then use it as a  search term 
        b. if the string of the format  keystring:string or keystring: string treat it as another search term.
        c. The string AND is treated as a logical AND and a search term when it appears between two search terms.
        d. The string OR is treated as a logical OR and a search term when it appears between two search terms.
        e. if the string is of the format keystring: {string1, string2} then treat it as another search term.
        `,
      
    parameters: {
      properties: {
        metadata: {
          type: 'string',
          description: 'The metadata to return',
        },
        start: {
          type: 'integer',
          description: 'Start at this item',
        },
        limit: {
          type: 'integer',
          description: 'Return only this many items',
        },
      },
      type: 'object',
      required: ['metadata'],
    }
  }
};
const _catalogInstanceFunctionSpec = {
  type: 'function',
  function: {
    name: '_catalogSearchInstance',
    description: `find an  metadata of a  specific type
    User can specify start and limit to limit the number of items returned.If type is not specified default to datasets.The metatdata value cannot be empty
    User can specify start and limit to limit the number of items returned.
    The metdata string is created from the user input using these rules:
    a. if the string has no ':' or '=' at the end of the string, then use it as a  search term 
    b. if the string of the format  keystring:string or keystring: string treat it as another search term.
    c. The string AND is treated as a logical AND and a search term when it appears between two search terms.
    d. The string OR is treated as a logical OR and a search term when it appears between two search terms.
    e. if the string is of the format keystring: {string1, string2} then treat it as another search term.
      `,
    parameters: {
      properties: {
        metadata: {
          type: 'string',
          description: 'The metadata to find',
        },
        start: {
          type: 'integer',
          description: 'Start at this item',
        },
        limit: {
          type: 'integer',
          description: 'Return only this many items',
        },
        
        type: {
          type: 'string',
          description: 'The type of asset to search for',
          enum: ["dataflows",
          "datasets",
          "dataplans",
          "models",
          "modelprojects",
          "modelstudioprojects",
          "reports",
          "rulesets",
          "referencedatadomains",
          "codefiles",
          "decisions",
          "riskdataprojects",
          "riskmodels"
          ]
        },
      },
      type: 'object',
      required: ['asset'],
    }
  }
};

async function _catalogSearch(params, userData, gptControl) {
  let appEnv = gptControl.appEnv;
  let { metadata,start, limit, rel } = params;
  let { store } = appEnv;
  limit =(limit) ? limit : 10;
  start =(start) ? start : 0;
  
  
  if (rel == null) {
    rel = 'search';
  }
  console.log('----------------- ....................', metadata, start, limit, rel);
 
  // https://go.documentation.sas.com/doc/en/infocatcdc/v_034/infocatug/n09x2n3z9t2izln1vtx68oho8t8x.htm?requestorId=84052456-0342-4389-a344-5cc71cbec5cc
  console.log('metadata', metadata);
  console.log(metadata)

  try {
    let {catalog} = await store.addServices('catalog');
    let payload = {
      qs: {q: metadata, limit: limit, start: start},
    };
    let r = await store.apiCall(catalog.links(rel), payload);
    console.log('r=', JSON.stringify(r.itemsList(), null,4));
    let rx = itemsData(r, '_catalogSearch.txt'); 
    let f = await gptControl.uploadFile('catalogSearch.txt', JSON.stringify(rx._details), 'plain/text', 'assistants');
    return rx._message;
  } catch (err) {
    console.log(JSON.stringify(err));
    return 'Error searching catalog';
  }
}
let catalogSearch = { tools:[_catalogSearchFunctionSpec], functionList: {_catalogSearch}}; 

export default catalogSearch;