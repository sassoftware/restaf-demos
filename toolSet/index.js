/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import listModels from './listModels.js';
import listTables from './listTables.js';
import modelScore from './modelScore.js';
import modelInfo from './modelInfo.js'; 

import libraryExists from './libraryExists.js'; 
import readTable from './readTable.js';
// import searchAssets from './searchAssets.js';

import loanscore from './loanscore.js';

//import devaScore from './devaScore.js';
//import superstat from './superstat.js';


let list = [
    listModels(),
    listTables(),
    modelScore(),
    modelInfo(),

    libraryExists(),
    readTable(),
    // searchAssets(),

    loanscore(),
    
    //devaScore(),
    //superstat(),
 
];
//console.log(`ToolSet: ${JSON.stringify(list)}`);
export default list;