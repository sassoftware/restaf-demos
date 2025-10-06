/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {z} from 'zod';
function deval() {
    let description = `
## deval: returns the value of the specified variable from the environment
This tool returns special  information as a text result.
`;
    let spec = {
        name: 'deval',
        description: description,
        schema: {
            name: z.string()
        },

        handler: async (params) => {
            const varName = params.name;
            return { content: [{ type: 'text', text: process.env[varName]}] }
        }
    }
    return spec;
}
export default deval;
