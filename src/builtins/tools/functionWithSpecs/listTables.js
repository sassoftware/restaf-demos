
const _listTablesFunctionSpec = {
  type: 'function',
  function: {
    name: '_listTables',
    description:
      `for a given library for  either sas or cas source, get the list of available tables.
      (ex: list tables in cas library samples, list tables in sas library sashelp)
      Optionally let user specify the source as cas or compute.`,
    parameters: {
      properties: {
        library: {
          type: 'string',
          description: 'A SAS library like casuser, sashelp, samples',
        },
        limit: {
          type: 'integer',
          description:
            'Return only this many tables. If not specified, then return 10 tables.',
        },
        source: {
          type: 'string',
          description: 'The source of the data. cas or compute',
          enum: ['cas', 'compute'],
        }
      },
      type: 'object',
      required: ['library'], 
    },
  }
};

async function _listTables(params, userData, gptControl) {
  let { library, source, limit } = params;
  let appEnv = await gptControl.viyaOnDemand(gptControl, source);
  let p = {
    qs: {
      limit: limit == null ? 10 : limit,
      start: 0,
    },
  };
  console.log('++++', appEnv.restafedit.getTableList);
  let r = await appEnv.restafedit.getTableList(library, appEnv, p);
  console.log(r);
  return JSON.stringify(r, null,4);
}

let listTables = {
  tools: [_listTablesFunctionSpec],
  functionList: {_listTables},
};
export default listTables;