/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import {z} from 'zod';
import


function chataqb() {
    let description = `
    ## chataqb: A tool that returns data based on user questions for a specified table

    Given:
	Table: {table}
	Question: A string containing a user question about the data.	
	
    Examples:
    Example 1:
    Input: chatqb table sashelp.cars question Average horsepower, unique makes, and unique models by type for types Sedan, SUV, and Truck
    Output: {table: 'sashelp.cars', question:"Average horsepower, unique makes, and unique models by type for types Sedan, SUV, and Truck" }
  

    `;

    let spec = {
        name: 'chatqb',
        description: description,
        schema: {
            question: z.string(),
            table: z.string()
        },
        handler: async (params) => {
            let scenario= {
                table_name: params.table,
                question: params.question,
            }
            let iparms = {
                type: 'job', 
                name: 'chataqb',
                scenario: scenario
            }
           let r = await _jobSubmit(iparams);
           return r;  
        }
    }
    return spec;
}
export default chataqb;
