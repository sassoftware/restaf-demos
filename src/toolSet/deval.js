/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {z} from 'zod';
function deval(_appContext) {
    let description = `
## deval: returns the value of the specified variable from the environment
This tool returns special  information as a text result.
`;
    let _deval = _appContext.toolsHelper._deval;
    let spec = {
        name: 'deval',
        description: description,
        schema: {
            name: z.string()
        },
       
        handler: async (params) => {
            return await _deval(params);
        }
    }
    return spec;
}
export default deval;
