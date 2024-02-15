/*
 * Copyright © 2024, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import gptFunctionSpecs from './gptFunctionSpecs.js';
function toolSpecs() {
  let {listFunctionsSpecs, functionList} = gptFunctionSpecs();

  let tools = listFunctionsSpecs.map((f) => {
    return {
      type:'function',
      function: f
    };
  });
tools.push({type:'retrieval'});
return  {tools, functionList};
}
export default toolSpecs;