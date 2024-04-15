/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import functionWithSpecs from '../functionwWithSpscs/index.js'; 
import instructions from '../instructions.js';
/**
 * @description Function specs for the assistant
 * @private
 * @function functionSpecs
 * @returns {object} - object containing specs, tools, functionList
 * 
 */

function functionSpecs() {
  let { catalogSearch, keywords } = functionWithSpecs;
  
  let specs = [].concat(catalogSearch.spec).concat(keywords.spec);
  console.log('specs', specs);
  
  let functions = {...catalogSearch.func, ...keywords.func};
  console.log('functions', functions);

  return {specs, functions, instructions};
}
export default functionSpecs;