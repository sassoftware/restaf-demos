
const _listLibrarySpecs = {
  type: 'function',
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
          description: ' the source is either cas, sas',
        },
      },
      type: 'object',
    },
  }
}

async function _listLibrary(params, userData, appControl) {
  let { limit, source, start } = params;
  let payload = {
    qs: {
      limit: limit == null ? 10 : limit,
      start: start == null ? 0 : start, 
    },
  };

  let s = (source == null) ? 'cas' : source.toLowerCase();
  let items = {};
  let appEnv = await appControl.getViyaSession(s); 
  if (appEnv === null) {
    items[s]   = [];
    return JSON.stringify(items);
  }
  
  let r = await appEnv.restafedit.getLibraryList(appEnv, payload);
  
  items[s] = r;
  
  return JSON.stringify(items);

}

let listLibrary = {
  tools:[_listLibrarySpecs],
  functionList: {_listLibrary} 
};
export default listLibrary;