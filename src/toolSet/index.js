/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import listModels from './listModels.js';
import listTables from './listTables.js';
import modelScore from './modelScore.js';
import modelInfo from './modelInfo.js'; 

import listLibrary from './listLibrary.js'; 
import findLibrary from './findLibrary.js';
import readTable from './readTable.js';
import tableInfo from './tableInfo.js';

import scrInfo from './scrInfo.js';
import scrScore from './scrScore.js';
import searchAssets from './searchAssets.js';
import devaScore from './devaScore.js';
import superstat from './superstat.js';
import findTable from './findTable.js';
import findModel from './findModel.js'

let list = [
    listModels(a),
    listTables(),
  
    findModel(),    
    modelInfo(),
    modelScore(),

    scrInfo(),
    scrScore(),

    listLibrary(),
    findLibrary(),
    findTable(),
    readTable(),
    tableInfo(),

    superstat(),
    devaScore(),

    searchAssets()
 
];


export default list;