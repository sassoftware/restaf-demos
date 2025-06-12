/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import libraryExists from './libraryExists.js'; 
import readSASData from './readSASData.js';
import devaScore from './devaScore.js';
import searchAssets from './searchAssets.js';
import loanscore from './loanscore.js';
import superstat from './superstat.js';

let list = [
    libraryExists(),
    readSASData(),
    searchAssets(),
    loanscore(),
    devaScore(),
    superstat()
];
//console.log(`ToolSet: ${JSON.stringify(list)}`);
export default list;