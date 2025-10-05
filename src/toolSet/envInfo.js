/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import {z} from 'zod';
import debug from 'debug';


function envinfo() {
    const log = debug('envinfo');
    let description = `
## envinfo: returns current environment information
This tool return the current environment information as a text result.
`;
    let spec = {
        name: 'envinfo',
        description: description,
        handler: async (params) => {
            log('envinfo', params);
            return { content: [{ type: 'text', text: JSON.stringify(process.env, null, 2) }] }
        }
    }
    return spec;
}
export default envinfo;
