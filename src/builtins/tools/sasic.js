/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import functionWithSpecs from './functionWithSpecs/index.js'; 
import instructions from './instructions.js';

  let { catalogSearch, keywords, listLibrary, readTable, listTables,odsSASTable} = functionWithSpecs;
  
  let specs = [].concat(catalogSearch.tools).concat(keywords.tools).concat(listLibrary.tools).concat(readTable.tools).concat(listTables.tools)
  .concat(odsSASTable.tools);
  
  let functions = {...catalogSearch.functionList, ...keywords.functionList, ...listLibrary.functionList, ...readTable.functionList, ...listTables.functionList,
  ...odsSASTable.functionList};

  let viya = {tools: specs, functionList:functions, instructions:instructions};
export default viya;