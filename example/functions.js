/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @description Function for the assistant
 * @function functionSpecs
 * @returns {object} - object containing function specs 
 * @returns {object} - a functions object({f1: function1, f2: function2, ...})
 * 
 */

import restafedit from "@sassoftware/restafedit";
import restaflib from "@sassoftware/restaflib";
import fs from "fs";

import logAsArray from "./lib/logAsArray.js";
import string2Table from "./lib/string2Table.js";
import rows2csv from "./lib/rows2csv.js";
const fss = fs.promises;
const { caslRun, computeRun, computeResults } = restaflib;
const { getLibraryList, getTableList, getTableColumns } = restafedit;

function functions(functionSpecs) {
  let flist = {
    sampleTool
  };
  // create a wrapper for listFunctions
  function wrapper(functionSpecs) {
    return async () => {
      /*
      let r = functionSpecs.map((f) => {
        return { functionName: f.name, description: f.description };
      });
      */
     let r = JSON.stringify
     console.log(r);
      return r;
    };
  }
  // add the wrapped function to flist

  flist.activeFunctions = wrapper(functionSpecs);
  return flist;
}

async function keywords(params) {
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
 let r = await idescribeTable(params, appEnv);
 return JSON.stringify(r);

}
async function idescribeTable(params, appEnv) {
  //TBD: need to move most of this code to restafedit
  let { table, limit, format, where, csv } = params;
  let { source, sessionID } = appEnv;
  csv = csv == null ? false : csv;
  console.log(params);
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
  debugger;
  let describe={};
  try {
    await restafedit.scrollTable("first", tappEnv);
    let tableSummary = await restafedit.getTableSummary(tappEnv);
    debugger;
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
async function resume(params) {
  return params.person + " resume is " + params.resume;
}

export default functions;
