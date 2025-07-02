/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import listModels from './listModels.js';
import listTables from './listTables.js';
import modelScore from './modelScore.js';
import modelInfo from './modelInfo.js'; 

import listLibrary from './listLibrary.js'; 
import readTable from './readTable.js';

import scrInfo from './scrInfo.js';
import scrScore from './scrScore.js';
import searchAssets from './searchAssets.js';
import devaScore from './devaScore.js';
import superstat from './superstat.js';

let list = [
    listModels(),
    listTables(),
    modelInfo(),
    modelScore(),

    scrInfo(),
    scrScore(),

    listLibrary(),
    readTable(),

    superstat(),
    devaScore(),

    searchAssets()
 
];
//console.log(`ToolSet: ${JSON.stringify(list)}`);
export default list;