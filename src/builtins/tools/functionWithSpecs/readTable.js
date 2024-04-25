
import string2Table from '../lib/string2Table.js';
import rows2csv from '../lib/rows2csv.js';

const _readSASTableFunctionSpec = {
  type: 'function',
  function: {
    name: '_readSASTable',
    description: 'Read the specified SAS Table. table is specified in the form libary.name. The source is either CAS or SAS',
    parameters: {
      properties: {
        table: {
          type: 'string',
          description: 'A comma-separated list of keywords like a,b,c',
        },
        source: {
          type: 'string',
          description: 'The source is either CAS or SAS',
        }
      },
      type: 'object',
      required: ['table']
    }
  }
}

async function _readSASTable(params, userData, appControl) {
  let tappEnv = await appControl.getViyaSession(params.source);
  params.source = tappEnv.source;
  let r = await _idescribeTable(params, tappEnv, appControl);
  return r.data;
}

async function _idescribeTable(params, appEnv, appControl) {
  //TBD: need to move most of this code to restafedit
  let { table, limit, format, source, where, csv } = params;
  let { sessionID, restafedit } = appEnv;

  csv = csv == null ? false : csv;
  let iTable = string2Table(table, source);
  if (iTable === null) {
    return 'Table must be specified in the form casuser.cars or sashelp.cars';
  }
  // setup call to restafedit.setup
  
  let config= {
    source: source,
    table: iTable,
    casServerName: appEnv.casServerName,
    computeContext: appEnv.computeContext,
    initialFetch: {
      qs: {
        start: 0,
        limit: limit == null ? 5 : limit,
        format: format == null ? true : format,
        where: where == null ? '' : where,
      },
    },
  };

  let tappEnv = await restafedit.setup(
    appEnv.logonPayload,
    config,
    sessionID
  );

  let describe = {};
  try {
    await restafedit.scrollTable('first', tappEnv);
    let tableSummary = await restafedit.getTableSummary(tappEnv);
    //let dataAsCsv = rows2csv(tappEnv.state.data);
    let f = await appControl.uploadFile(`${table}.json`,JSON.stringify(tappEnv.state.data), 'text/json', 'assistants');
    describe = {
      table: iTable,
      tableSummary: tableSummary,
      columns: tappEnv.state.columns,
      data: csv === false ? JSON.stringify(tappEnv.state.data) : dataAsCsv,
    };
  } catch (err) {
    console.log(err);
    describe = { error: err };
  }
  return describe;
}

let readTable = {
  tools:[_readSASTableFunctionSpec], 
  functionList: {_readSASTable}
};
export default readTable;