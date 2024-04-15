
const _listLibrarySpecs = {
  function: {
    name: '_listLibrary',
    description: 'for a source list the libraries. source can be cas or sas',

    parameters: {
      properties: {
        limit: {
          type: 'integer',
          description: 'Limit the number of libraries returned',
        },
    
        start: {
          type: 'integer',
          description: 'Starting point for the list',
        },
        source: {
          type: 'string',
          description: 'cas, sas',
        },
      },
      type: 'object',
    },
  }
}

async function _listLibrary(params, userData, gptControl) {
  let { limit, source, start } = params;
  
  debugger;
  let payload = {
    qs: {
      limit: limit == null ? 10 : limit,
      start: start == null ? 0 : start, 
    },
  };
  if (source === null) {
    source = 'sas';
  }
  let s = source.toLowerCase();
  let tAppEnv = await gptControl.viyaOnDemand(gptControl, s); 
  if (tAppEnv === null) {
    let list = [];
    return JSON.stringify(list);
  }
  console.log('tAppEnv', tAppEnv.sessionID);
  debugger;
  let r = await tAppEnv.restafedit.getLibraryList(tAppEnv, payload);
  console.log(r);
  let items = {cas: r};
  
  return JSON.stringify(items);

}

let listLibrary = {
  tools:[_listLibrarySpecs],
  functionList: {_listLibrary} 
};
export default listLibrary;