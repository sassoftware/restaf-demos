/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import debug from 'debug';
import _masDescribe from '../toolhelpers/_masDescribe.js';
const log = debug('tools');

function modelInfo() {
  let description = `
## modelInfo is tool that returns information about a model published to MAS server in SAS Viya.
The input to this tool is:

- model - the name assigned to the model in MAS server.
  - The model name is the name assigned to the model when it was published to MAS server

- Display both the inputs and outputs of the model.
}

### Sample Prompts
- info on cancer1
- what is the model mycoolmodel
`;
  let spec = {
    name: 'modelInfo',
    description: description,
    schema: {
      'model': z.string()
    },
    required: ['model'],
    handler: async (params) => {
      let r = await _masDescribe(params);
      return r;
    }
  }
  return spec;
}

export default modelInfo;
