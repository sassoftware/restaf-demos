/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import functionWithSpecs from './functionWithSpecs/index.js'; 
import instructions from './instructions.js';

  let { keywords, listLibrary, readTable, listTables} = functionWithSpecs;
  
  let specs = [].concat(keywords.tools).concat(listLibrary.tools).concat(readTable.tools).concat(listTables.tools);
  
  let functions = { ...keywords.functionList, ...listLibrary.functionList, ...readTable.functionList, ...listTables.functionList};

  let viya = {tools: specs, functionList:functions, instructions:instructions};
export default viya;