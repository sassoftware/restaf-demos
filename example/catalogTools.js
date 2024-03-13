// Tool specification
function catalogTools() {
let tools = [
  {
    type: 'function',
    function: {
      name: 'SASCatalog',
      description: `get specifiied metadata from SAS Catalog Manager Information Catlog`,
      parameters: {
        properties:{
          metadata: {
            type: 'string',
            description: `finds the specified metadata in SAS Catalog`,
            enum: ['tags','catalogStatistics','indices']
          }
        },
        type: 'object',
        required: ['information']
      }
    }
  }
];

//handler for the custom tool SASCatalog
async function SASCatalog(params, appEnv) {
  let {metadata} =  params;
  let {store} = appEnv;
  console.log('-------------', metadata);
  debugger;

  try {
    debugger;
    let {catalog} = await store.addServices('catalog');
    console.log(catalog);
    debugger;
    let raflink = catalog.links(metadata);
    if (!raflink) {
      return JSON.stringify({error: 'metadata rel does not exist'});
    }
    let result = await store.apiCall(catalog.links(metadata));
    console.log('---',result.items().toJS());
    return JSON.stringify(result.items().toJS());
    } 
  catch (err) {
    debugger;
    return JSON.stringify(err);
  }
}

let functionList = {
  SASCatalog: SASCatalog
}

let instructions = 
  `You are an assistant to help users seach thru the SAS Information Catalog for metadata.
  They can then use this information to do futher analysis`;

let toolsSpec = {tools: tools, functionList: functionList, instructions: instructions, replace: true   };
 return toolsSpec;
}
export default catalogTools;