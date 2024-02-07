/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import  restafedit from '@sassoftware/restafedit'
import restaflib from '@sassoftware/restaflib';
import fs from 'fs/promises';
import logAsArray  from '../lib/logAsArray.js';
import string2Table from '../lib/string2Table.js';

const  { computeFetchData, casFetchData, caslRun, computeRun, computeResults} = restaflib;
const {getLibraryList, getTableList, getTableColumns} = restafedit; 

function gptFunctions() {
  return {
    getForm,
    getData,
    listSASObjects,
    listSASTables,
    listColumns,
    listFunctions,
    listSASDataLib,
    runSAS
    };
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
    let { resource, count } = params;
    let store = appEnv.store;
    count = count == null ? 10 : count;
    if (['files', 'folders', 'reports'].includes(resource.toLowerCase()) === false) {
      return `{Error: "resource ${resource} is not supported at this time"}`;
    }
    let r = await store.addServices(resource);
    let s = r[resource];
    let payload = {
      qs: {
        limit: count,
        start: 0
      }
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
    let { library} = params;
    let r = await getTableList(library, appEnv);
    return r;
  }
  async function listColumns(params, appEnv) {
    let { table } = params;
    let {source} = appEnv;
    debugger;
    let iTable = string2Table(table, source);
    if (iTable === null) {
      return "Table must be specified in the form casuser.cars or sashelp.cars"
    }

    let r = await getTableColumns(source, iTable, appEnv);
    debugger;
    return r;
  }
  async function getData(params, appEnv) {
    //TBD: need to move most of this code to restafedit
    let { table, count } = params;
    let {store, source, session} = appEnv;
    let iTable = string2Table(table, source);
    if (iTable === null) {
      return "Table must be specified in the form casuser.cars or sashelp.cars"
    }
    let result = ' ';
    if (source === 'cas') {
      let control = {
        table: iTable,
        limit: count == null ? 10 : count,
        start: 0,
        where: "",
        format: true
      };
      let r  = await casFetchData(store, session, control);
      result = r.data.rows;
    } else {
      let control = {
        qs: { limit: count == null ? 10 : count, start: 0, format: true }
      };

      let tableSummary = computeSetupTables(store, session, iTable);
      let r  = await computeFetchData(store, tableSummary, iTable, null,control);
      result = r.rows;
    }
    return result;
  }
  async function runSAS(params, appEnv) {
    let { file } = params;
    let {store, session} = appEnv;
    let src;
    try { 
      src= await fs.readFile(file, 'utf8');
    }
    catch (err) {
      console.log(err);
      return "Error reading file " + file;
    }
  
    if (appEnv.source === "cas") {
      let r = await caslRun(store, session, src,{}, true); 
      return r.results;;
    } else {
      let computeSummary = await computeRun(store, session, src);
      let log = await computeResults(store, computeSummary, "log");
      return logAsArray(log);
    }
    
    
  }
  async function listFunctions (params, appEnv) {

    let functionList =  [ 
        { name: "getForm", description: "create a form for casuser.cars. Set keys to make.model" },
        { name: "listSASObjects", description: "list reports" },
        { name: "listSASDataLib", description: "list caslibs"},
        { name: "listSASTables", description: "list tables in casuser"},
        { name: "listColumns", description: "list columns in casuser.cars" },
        { name: "getData", description: "get data for casuser.cars and set count to 20" },
        { name: "runSAS", description: "run the code in the specified file" },
        { name: "listFunctions", description: "help on prompts designed for Viya" },
      ];
    let r = functionList.map((f) => f.description);
    return r;
  }
}
export default gptFunctions;
