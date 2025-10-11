/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import listModels from './listModels.js';
import listTables from './listTables.js';
import modelScore from './modelScore.js';
import modelInfo from './modelInfo.js'; 


//import listLibraryAlias from './listLibraryAlias.js';
import toolManifest from './toolManifest.js';
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
import chataqb from './chataqb.js';
import procSQL from './procSQL.js';
import deval from './deval.js';

let lab = [
  chataqb(),
  deval(),
  procSQL(),

];
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
  
 
];

if (process.env.LAB === 'TRUE') {
  list = list.concat(lab);
}


export default list;