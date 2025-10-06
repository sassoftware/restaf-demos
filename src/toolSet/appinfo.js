/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */


function propvalue() {
    let description = `
## propvalue: returns current application information
This tool return the current application information as a text result.
`;
    let spec = {
        name: 'propvalue',
        description: description,
        handler: async (params) => {
            return { content: [{ type: 'text', text: JSON.stringify(process.env, null, 2) }] }
        }
    }
    return spec;
}
export default propvalue;
