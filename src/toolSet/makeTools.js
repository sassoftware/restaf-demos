/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import wrapToolsHelpers from '../toolhelpers/wrapToolHelpers.js';
import sasQueryTemplate from './sasQueryTemplate.js';
import sasQueryTemplate2 from './sasQueryTemplate2.js';
import listModels from './listModels.js';
import listTables from './listTables.js';
import modelScore from './modelScore.js';
import modelInfo from './modelInfo.js';
import findLibrary from './findLibrary.js';
import readTable from './readTable.js';
import tableInfo from './tableInfo.js';
import listLibraries from './listLibraries.js';

import scrInfo from './scrInfo.js';
import scrScore from './scrScore.js';

import devaScore from './devaScore.js';
// import superstat from './superstat.js';
import findTable from './findTable.js';
import findModel from './findModel.js';
import program from './program.js';
import runMacro from './runMacro.js';
import job from './job.js';
import listJobs from './listJobs.js';
import jobDef from './jobDef.js';
import findJob from './findJob.js';

import sasQuery from './sasQuery.js';
import deval from './deval.js';
import setContext from './setContext.js';



//let customf= {sasQueryTemplate, sasQueryTemplate2};

function makeTools(_appContext) {
  // wrap all tools with 
  let customTools = [];

  // get the tool definitions and handler 
  let list = [
    deval(_appContext),
    listModels(_appContext),
    
    findModel(_appContext),
    modelInfo(_appContext),
    modelScore(_appContext),

    scrInfo(_appContext),
    scrScore(_appContext),

    findLibrary(_appContext),
    listLibraries(_appContext),
    findTable(_appContext),
    tableInfo(_appContext),
    listTables(_appContext),
    readTable(_appContext),
    sasQuery(_appContext),

    program(_appContext),
    runMacro(_appContext),

    findJob(_appContext),
    listJobs(_appContext),
    job(_appContext),
    jobDef(_appContext),


    devaScore(_appContext),
    setContext(_appContext)
    
  ];
  let listWithCustom = list.concat(customTools);
  console.error(`\n[Note] Loaded a total of ${listWithCustom.length} tools.`);
  return listWithCustom;
}
export default makeTools;