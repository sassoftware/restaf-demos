/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import {z} from 'zod';
import _jobSubmit from '../toolhelpers/_jobSubmit.js';

function chataqb() {
    let description = `
    You are tasked with querying a table and returning the results. 
    The user will provide a natural language query and the table name to query against. 
    You must always convert the user's query into a valid SQL SELECT statement and pass it as the sql parameter to the handler.

    The SQL SELECT statement must:
    - Include the columns specified in the query.
    - Use the table name provided by the user.
    - Apply any filters or conditions specified in the query.

    Example:
    User prompt:
    chataqb table=sashelp.cars query=make,model where origin='USA'

    Generated SQL:
    SELECT make, model FROM sashelp.cars WHERE origin = 'USA';

    The parameters passed to the handler are:
    {
        table: "sashelp.cars",
        query: "make,model where origin='USA'",
        sql: "SELECT make, model FROM sashelp.cars WHERE origin = 'USA'"
    }

    Always ensure the SQL query is valid and follows the SAS PROC SQL syntax.
    `;

    let spec = {
        name: 'chataqb',
        description: description,
        schema: {
            query: z.string(),
            table: z.string(),
            sql: z.string().optional()
        },
        required: ['query', 'table'],
        handler: async (params) => {
            let {table,query, sql} = params;
            debugger;
            let sqlinput = (sql || '').replaceAll(';', ' ').replaceAll('\n', ' ').replaceAll('\r', ' ');
            let iparams = {
                scenario: {
                    table_name: table,
                    question: query,
                    sql: sqlinput,
                    AI_KEY: process.env.AI_KEY,
                    AI_MODEL: process.env.AI_MODEL,
                    ENDPOINT: process.env.AI_ENDPOINT,
                    PROVIDER: process.env.AI_PROVIDER ? process.env.AI_PROVIDER : 'azureai'
                },
                name: 'run_sql_query',
                type: 'job'
            };
            let r =  await _jobSubmit(iparams);
            console.error('chataqb', r.tables);
            return {
                content: [{ type: 'text', text: JSON.stringify(r.tables) }],
                structuredContent: r.tables
            };
            
        }
    }
    return spec;
}
export default chataqb;
