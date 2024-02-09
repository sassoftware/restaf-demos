/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import restafedit from "@sassoftware/restafedit";
import restaflib from "@sassoftware/restaflib";
import fs from "fs/promises";
import logAsArray from "../lib/logAsArray.js";
import string2Table from "../lib/string2Table.js";

const { computeFetchData, casFetchData, caslRun, computeRun, computeResults } =
  restaflib;
const { getLibraryList, getTableList, getTableColumns } = restafedit;

function gptFunctions(functionSpecs) {
  let flist = {
    getForm,
    getData,
    listSASObjects,
    listSASTables,
    listColumns,
    //listFunctions,
    listSASDataLib,
    runSAS,
    basic,
    resume,
    describeTable,
  };
  // create a wrapper for listFunctions
  function wrapper(functionSpecs) {
    return async (params, appEnv) => {
      let r = functionSpecs.map((f) => f.description);
      return r;
    };
  }
  // add the wrapped function to flist
  flist.listFunctions = wrapper(functionSpecs);
  return flist;
}

async function getForm(params, appEnv) {
  let { source, table, keys, columns } = params;
  // Return the incoming parameters to give user a chance to review

  return {
    source: source == null ? "cas" : source,
    table: table,
    keys: keys == null ? [] : keys.split(","),
    columns: columns == null ? [] : columns.split(","),
  };
}

async function listSASObjects(params, appEnv) {
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
  return items;
}
async function listSASDataLib(params, appEnv) {
  let r = await getLibraryList(appEnv);
  return r;
}
async function listSASTables(params, appEnv) {
  let { library, limit } = params;
  let p = {
    qs: {
      limit: limit == null ? 10 : limit,
      start: 0,
    },  
  }
  let r = await getTableList(library, appEnv, p);
  return r;
}
async function listColumns(params, appEnv) {
  let { table } = params;
  let { source } = appEnv;
  debugger;
  let iTable = string2Table(table, source);
  if (iTable === null) {
    return "Table must be specified in the form casuser.cars or sashelp.cars";
  }

  let r = await getTableColumns(source, iTable, appEnv);
  debugger;
  return r;
}
async function getData(params, appEnv) {
  //TBD: need to move most of this code to restafedit
  let { table, limit } = params;
  let { store, source, session } = appEnv;
  let iTable = string2Table(table, source);
  if (iTable === null) {
    return "Table must be specified in the form casuser.cars or sashelp.cars";
  }
  let result = " ";
  if (source === "cas") {
    let control = {
      table: iTable,
      limit: limit == null ? 10 : limit,
      start: 0,
      where: "",
      format: true,
    };
    let r = await casFetchData(store, session, control);
    result = r.data.rows;
  } else {
    let control = {
      qs: { limit: limit == null ? 10 : limit, start: 0, format: true },
    };

    let tableSummary = computeSetupTables(store, session, iTable);
    let r = await computeFetchData(store, tableSummary, iTable, null, control);
    result = r.rows;
  }
  return result;
}
async function runSAS(params, appEnv) {
  let { file } = params;
  let { store, session } = appEnv;
  let src;
  try {
    src = await fs.readFile(file, "utf8");
  } catch (err) {
    console.log(err);
    return "Error reading file " + file;
  }

  if (appEnv.source === "cas") {
    let r = await caslRun(store, session, src, {}, true);
    return r.results;
  } else {
    let computeSummary = await computeRun(store, session, src);
    let log = await computeResults(store, computeSummary, "log");
    return logAsArray(log);
  }
}

async function basic(params) {
  let { keywords, format } = params;

  switch (format) {
    case "html":
      let t = "<ul>";
      keywords.split(",").forEach((k) => {
        t += `<li>${k}</li>`;
      });
      t += "</ul>";
      return t;
    case "array":
      return keywords.split(",");
    case "object":
      let r = {};
      keywords.split(",").forEach((k, i) => {
        r[`key${i}`] = k;
      });
      return r;
    default:
      return params;
  }
}
async function describeTable(params, appEnv) {
  //TBD: need to move most of this code to restafedit
  let { table, limit } = params;
  let { source, sessionID } = appEnv;
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
        format: true,
        where: " ",
      },
    },
  };
  console.log("appControl", appControl);
  console.log(sessionID);
  debugger;
  let tappEnv = await restafedit.setup(appEnv.logonPayload, appControl, sessionID);
  let r = await restafedit.scrollTable("first", tappEnv);
  console.log(r);
  let describe = {
    table: iTable,
    summary: restafedit.getTableSummary(tappEnv),
    columns: tappEnv.state.columns,
    data: tappEnv.state.data,
  };
  return describe;
}
async function resume(params) {
  return params.person + ' resume is ' +  params.resume;
}

export default gptFunctions;