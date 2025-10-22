
import restafedit from '@sassoftware/restafedit';
import getLogonPayload from './getLogonPayload.js';
import deleteSession from './deleteSession.js';




async function _tableColumns(table, server) {
let logonPayload = await getLogonPayload();

let [lib, name] = table.split('.');
let itable = { name: name };
if (server === 'cas') {
  itable.caslib = lib;
} else {
  itable.libref = lib;
}
let config = {
  source: (server === 'sas') ? 'compute' : server,
  table: itable,

  initialFetch: {
    qs: {
      start: 0, // Adjust for 0-based index
      limit: 1,
      format: true,
      where: ''
    }
  }
};


let appControl = {};
try {
  appControl = await restafedit.setup(
    logonPayload,
    config,
    null,/* create a sessiion */
    {},
    'user',
    {}
  );

  //let tableSummary = await restafedit.getTableSummary(appControl);

  await restafedit.scrollTable('first', appControl);
  console.error(`Fetched columns for table ${table} from ${server}`);
  let columns = {...appControl.state.columns};
  delete columns._rowIndex;
  delete columns._modified;
  delete columns._index_;
  console.error(columns);
 // await deleteSession(appControl);
  return JSON.stringify(columns);
} catch (e) {
//  await deleteSession(appControl);
  return outdata = null;
};
}
export default _tableColumns;
