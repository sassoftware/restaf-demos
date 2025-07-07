/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import {z} from 'zod';
import debug from 'debug';
const log = debug('devascore');

function devaScore() {
    let description = `
## devascore: compute Deva Score for two numbers.
- if more than 2 numbers are provided, process the numbers from the left as follows:
- compute score for the first two numbers
- use the result of the previous step and the next number to compute the next score
- repeat until all numbers are processed`;
    let spec = {
        name: 'devaScore',
        description: description,
        schema: {
            a: z.number(),
            b: z.number()
        },
        handler: async ({ a, b }) => {
            log('devascore', a, b);
            return { content: [{ type: 'text', text: String((a + b) * 42) }] }
        }
    }
    return spec;
}
export default devaScore;
