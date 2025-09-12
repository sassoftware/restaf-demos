/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import {z} from 'zod';
import debug from 'debug';


function devaScore() {
    const log = debug('devascore');
    let description = `
## devascore: compute Deva Score for two numbers.
This tool accepts exactly two numeric inputs (a and b) and returns (a + b) * 42 as a text result.

To compute the Deva Score for more than two numbers, invoke this tool repeatedly in a left-to-right fold:
1) Call devascore with a=first, b=second -> result r1
2) Call devascore with a=r1, b=third  -> result r2
3) Repeat until all numbers are consumed.

Instructions
Do not prompt the user for more input. Do not explain what you are doing. Do not return anything other than the result.
Example: devascore(1,2) -> 126; then devascore(126,3) -> 5418.
`;
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
