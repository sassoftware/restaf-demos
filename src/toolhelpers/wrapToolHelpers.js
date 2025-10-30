/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { fi } from 'zod/v4/locales';
import _casScoring from './_casScoring.js';
import _catalogSearch from './_catalogSearch.js';
import _itemsData from './_itemsData.js';
import _jobSubmit from './_jobSubmit.js';
import _listJobs from './_listJobs.js';
import _listLibrary from './_listLibrary.js';
import _listModels from './_listModels.js';
import _listTables from './_listTables.js';
import _masDescribe from './_masDescribe.js';
import _masScoring from './_masScoring.js';
import _readTable from './_readTable.js';
import _scrInfo from './_scrInfo.js';
import _scrScore from './_scrScore.js';
import _submitCasl from './_submitCasl.js';
import _submitCode from './_submitCode.js';
import _submitMacro from './_submitMacro.js';
import _tableColumns from './_tableColumns.js';
import _tableInfo from './_tableInfo.js';
import deleteSession from './deleteSession.js';
import getLogonPayload from './getLogonPayload.js';
import getOpts from './getOpts.js';
import getStoreOpts from './getStoreOpts.js'; 
import getToken from './getToken.js';
//import refreshToken from './refreshToken.js';

function wrapToolsHelpers (_appContext, cache) {

const wrapf = (appEnv, builtin) => async (...args) => {
    let r = await builtin(appEnv, ...args); 
    return r;
  };
  const wrapt = (appEnv, cache, builtin) => async (...args) => {
    let r = await builtin(appEnv, ...args); 
    return r;
  };


// Export all imported toolhelpers
let flist = {
     _casScoring, 
     _catalogSearch,
     _itemsData,    
    _jobSubmit,
    _listJobs,
    _listLibrary,
    _listModels,
    _listTables,
    _masDescribe,
    _masScoring,
    _readTable,
    _scrInfo,
    _scrScore,
    _submitCasl,
    _submitCode,
    _submitMacro,
    _tableColumns,
    _tableInfo,
    deleteSession
};
let utils = {
  getLogonPayload,
  getOpts,
  getStoreOpts,
  getToken
}
let wrappedFlist = {};
for (let key of Object.keys(flist)) {
    wrappedFlist[key] = wrapf(_appContext, flist[key]);
}
let wrappedUtils = {};
for (let key of Object.keys(utils)) {
    wrappedUtils[key] = wrapt(_appContext, cache, utils[key]);
} 
let finalList= {...flist, ...wrappedUtils};
return finalList;
}
export default wrapToolsHelpers;