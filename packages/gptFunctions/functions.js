/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * setup specification and functions for GPT
 * 
 */

import restafedit from "@sassoftware/restafedit";
import restaflib from "@sassoftware/restaflib";
import fs from "fs";

import logAsArray from "../lib/logAsArray.js";
import string2Table from "../lib/string2Table.js";
import rows2csv from "../lib/rows2csv.js";
const fss = fs.promises;
const { caslRun, computeRun, computeResults } = restaflib;
const { getLibraryList, getTableList, getTableColumns } = restafedit;

function functions(functionSpecs) {
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
    readFile,
    welcome,
    appManager
  };
  // create a wrapper for listFunctions
  function wrapper(functionSpecs) {
    return async () => {
      let r = functionSpecs.map((f) => {
        return { functionName: f.name, description: f.description };
      });
      return r;
    };
  }
  // add the wrapped function to flist
  flist.activeFunctions = wrapper(functionSpecs);
  return flist;
}

async function appManager(params, _appEnv, gptControl) {
  let { analysis} = params;
  let { openai, assistant } = gptControl;

  const fileid = await openai.files.create({
    file: fs.createReadStream(analysis, 'utf8'),
    purpose: "assistants",
  })
  const assistantFileid = await openai.beta.assistants.files.create(
    assistant.id, {file_id: fileid});
  console.log(assistantFileid);
  return `File ${path} added to assistant`;
}
async function welcome(params, appEnv) {
  return 'Welcome back'
}
async function getForm(params, appEnv) {
  let { table, keys, columns } = params;
  let { source } = appEnv;
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
  };
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
  let r = await describeTable(params, appEnv);
  return {table: r.table, data: r.data};
}
async function runSAS(params, appEnv) {
  let { file } = params;
  let { store, session } = appEnv;
  let src;
  try {
    src = await fss.readFile(file, "utf8");
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
async function readFile(params, _appEnv, gptControl) {
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

async function basic(params) {
  let { keywords, format } = params;

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
async function describeTable(params, appEnv) {
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
  await restafedit.scrollTable("first", tappEnv);
  let tableSummary = await restafedit.getTableSummary(tappEnv);

  // Move to scrolltable with an raw option
  let rows = tappEnv.state.data.map((row) => {
    delete row._rowIndex;
    delete row._modified;
    return row;
  });
  let describe = {
    table: iTable,
    tableSummary: tableSummary,
    columns: tappEnv.state.columns,
    data: (csv === false ) ? rows : rows2csv(rows)
  };
  return describe;
}
async function resume(params) {
  return params.person + " resume is " + params.resume;
}

export default functions;
