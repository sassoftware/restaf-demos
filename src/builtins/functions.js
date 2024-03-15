/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import restafedit from "@sassoftware/restafedit";
import restaflib from "@sassoftware/restaflib"

import logAsArray from "./lib/logAsArray.js";
import string2Table from "./lib/string2Table.js";
import rows2csv from "./lib/rows2csv.js";
/**
 * @description Function for the assistant
 * @private
 * @function functionSpecs
 * @returns {object} - object containing function specs 
 * @returns {object} - a functions object({f1: function1, f2: function2, ...})
 * 
 */


//const fss = fs.promises;
const { caslRun, computeRun, computeResults } = restaflib;
const { getLibraryList, getTableList, getTableColumns } = restafedit;

function functions() {
  let flist = {
    _getData,
    _listSASObjects,
    _listSASTables,
    _listColumns,
    _listSASDataLib,
    _runSAS,
    _keywords,
    _describeTable,
   // _contextData
  };
  return flist;
}

async function _listSASObjects(params, appEnv) {
  let { resource, limit } = params;
  let store = appEnv.store;
  
  limit = limit == null ? 10 : limit;
  if (
    ["files", "folders", "reports"].includes(resource.toLowerCase()) === false
  ) {
    return `{Error: "resource ${resource} is not supported at this time"}`;
  }
  let r = await store.addServices(resource);
  let s = r[resource];
  let payload = {
    qs: {
      limit: limit,
      start: 0,
    },
  };
  let results = await store.apiCall(s.links(resource), payload);
  let items = results.itemsList().toJS();
  
  return JSON.stringify(items);
}
async function _listSASDataLib(params, appEnv) {
  let { limit, source, start} = params;
  let payload = {
    qs: {
      limit: (limit == null) ? 10 : limit,
      start: (start == null) ? 0 : start
    },
  };
  let r = await getLibraryList(appEnv, payload);
  return JSON.stringify(r);
}
async function _listSASTables(params, appEnv) {
  let { library, limit } = params;
  let p = {
    qs: {
      limit: limit == null ? 10 : limit,
      start: 0,
    },
  };
  let r = await getTableList(library, appEnv, p);
  return JSON.stringify(r);
}
async function _listColumns(params, appEnv) {
  let { table } = params;
  let { source } = appEnv;
  
  let iTable = string2Table(table, source);
  if (iTable === null) {
    return "Table must be specified in the form casuser.cars or sashelp.cars";
  }

  let r =  await getTableList(library, appEnv, p);
  
  return JSON.stringify(r);
}
async function _getData(params, appEnv) {
  let r = await _idescribeTable(params, appEnv);
  return JSON.stringify({table: r.table, data: r.data});
}
async function _runSAS(params, appEnv, gptControl) {
  let { program } = params;
  let { store, session } = appEnv;
  let src = program;//place holder
  if (appEnv.source === "cas") {
    let r = await caslRun(store, session, src, {}, true);
    return JSON.stringify(r.results);
  } else {
    let computeSummary = await computeRun(store, session, src);
    let log = await computeResults(store, computeSummary, "log");
    return logAsArray(log);
  }
}

async function _keywords(params) {
  let { keywords, format } = params;
console.log('keywords', keywords, format);
  switch (format) {
    case "html": {
      let t = "<ul>";
      keywords.split(",").forEach((k) => {
        t += `<li>${k}</li>`;
      });
      t += "</ul>";
      return t;
    }
    case "array":
      return keywords.split(",");
    case "object": {
      let r = {};
      keywords.split(",").forEach((k, i) => {
        r[`key${i}`] = k;
      });
      return r;
    }
    default:
      return params;
  }
}
async function _describeTable(params, appEnv) {
 let r = await _idescribeTable(params, appEnv);
 return JSON.stringify(r);

}
async function _idescribeTable(params, appEnv) {
  //TBD: need to move most of this code to restafedit
  let { table, limit, format, where, csv } = params;
  let { source, sessionID } = appEnv;
  csv = csv == null ? false : csv;
  let iTable = string2Table(table, source);
  if (iTable === null) {
    return "Table must be specified in the form casuser.cars or sashelp.cars";
  }
  // setup call to restafedit.setup
  let appControl = {
    source: source,
    table: iTable,
    casServerName: appEnv.casServerName,
    computeContext: appEnv.computeContext,
    initialFetch: {
      qs: {
        start: 0,
        limit: limit == null ? 2 : limit,
        format: format == null ? false : format,
        where: where == null ? "" : where,
      },
    },
  };

  let tappEnv = await restafedit.setup(
    appEnv.logonPayload,
    appControl,
    sessionID
  );
  
  let describe={};
  try {
    await restafedit.scrollTable("first", tappEnv);
    let tableSummary = await restafedit.getTableSummary(tappEnv);
    
    describe = {
      table: iTable,
      tableSummary: tableSummary,
      columns: tappEnv.state.columns,
      data: (csv === false ) ? tappEnv.state.data : rows2csv(tappEnv.state.data)
    };
  } catch (err) {
    console.log(err);
    describe = {error: err};
  }
  return describe;
}

export default functions;

/*
async function _contextData(params, _appEnv, gptControl) {
  let { file, action } = params;
  let { openai, assistant } = gptControl;

  if (action === 'upload') {
    const fileid = await openai.files.create({
      file: fs.createReadStream(file, 'utf8'),
      purpose: "assistants",
   });
   console.log('.......................', fileid);
    const assistantFileid = await openai.beta.assistants.files.create(
      assistant.id, {file_id: fileid.id});
    console.log(assistantFileid);
    return `File ${file} added to assistant`;
  }
  try {
    let src = await fss.readFile(file, "utf8");
    return src;
  } catch (err) {
    console.log(err);
    return "Error reading file " + file;
  }
}
*/