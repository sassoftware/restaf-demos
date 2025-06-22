/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import debug from 'debug';
import _scrInfo from '../toolhelpers/_scrInfo.js';
const log = debug('scr');

function scrInfo() {
  let description = `
  ## scrInfo is tool that returns information about a SCR model running at specified URL
  Extract the schema of the SCRInput object from the SCR model's API metadata and show the data element in SCRInput.
  Also extract the schema of the SCROutput object from the SCR model's API metadata and show the data element in SCROutput.
  `;
  let spec = {
    name: 'scrInfo',
    description: description,
    schema: {
      url: z.string()
    },
    required: ['url'],
    handler: async (params) => {
      let r = await _scrInfo(params);
      return r;
    }
  }
  return spec;
}

export default scrInfo;
