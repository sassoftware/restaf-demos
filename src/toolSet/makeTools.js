/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

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
import superstat from './superstat.js';
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
import _tableColumns from '../toolhelpers/_tableColumns.js';
let customf= {sasQueryTemplate, sasQueryTemplate2};

async function makeTools(_appContext) {
  // wrap all tools with 

  let customTools = [];
  for (let i = 0; i < _appContext.subclassJson.length; i++) {
    let r = _appContext.subclassJson[i];
    console.error(`\n[Note] Loading custom tool: ${JSON.stringify(r, null, 2)}`);
    let t = await customf[r.template](r);
    customTools.push(t);
  }

  let list = [
    listModels(),
    listTables(),

    findModel(),
    modelInfo(),
    modelScore(),

    scrInfo(),
    scrScore(),
    program(),
    runMacro(),
    findJob(),
    listJobs(),
    job(),
    jobDef(),

    listLibraries(),

    findLibrary(),
    findTable(),
    readTable(),
    tableInfo(),

    superstat(),
    devaScore(),
    deval(),
    sasQuery()

  ];
  let listWithCustom = list.concat(customTools);
  console.log(`\n[Note] Loaded a total of ${listWithCustom.length} tools.`);
  return listWithCustom;
}
export default makeTools;