/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _jobSubmit from '../toolhelpers/_jobSubmit.js';
import _tableColumns from '../toolhelpers/_tableColumns.js';

async function sasQueryTemplate2(uparams) {

    let toolname = uparams.name;
    let uTable = uparams.table;
    let selectColumns = uparams.selectColumns;
    let selectColumns2 = (selectColumns == null) ? '_All_' : selectColumns.replaceAll(',', ' ');
    let uJob = (uparams.job == null) ? 'run_sql_query' : uparams.job;
    
    let allColumns = await _tableColumns(uTable, uparams.server);
    
    let selcols = (selectColumns == null) ? ' ' :  'and the columns ${selectColumns}';
    let instruction1 = 'The valid columns in the table ${uTable} are: ${allColumns}. ';

    let description = `
    You are an expert in SAS Viya PROC SQL syntax.
    You are tasked with creating a SAS PROC SQL SELECT statement  based on the user's natural language filter for the table ${uTable}.
    The Select statement you create will have the following syntax:

    SELECT ${selectColumns} from ${uTable} AS <SQL expressions>

    You will then convert the user's query to a valid SAS PROC SQL SELECT expressions

    The valid non-columns in the table ${uTable} are: ${allColumns}. If others are specified inform the user of the error.
    
    Example:

    User query: Origin ='Asia'
    SQL expressions: WHERE Origin = 'Asia'
    sql:  SELECT ${selectColumns} from ${uTable} AS WHERE Origin = 'Asia'

    as the query to be executed on the server.


    User can optionally specify a SAS job to run the query on the SAS Server. If not specified, the default job 'run_sql_query' will be used.

    The desired flow:
    Instructions to LLM: Show the progress of how you are thinking about converting the natural language query to SQL.
    Step 1:  User provides the following prompt:
    ${toolname} <natural language query>
    
    Step 2: Convert the user's natural language query into a valid SAS PROC SQL SELECT expression to complete the following sql :
    
      SELECT ${selectColumns} from ${uTable} AS <sql expression the LLM generated>
        
    A good reference for
    the SQL syntax is this [link](https://go.documentation.sas.com/doc/en/pgmsascdc/v_067/sqlproc/n0w2pkrm208upln11i9r4ogwyvow.htm)

    Instructions to LLM: 
   - Do not add a semicolon to the end of the SQL statement.
      - Use only the columns from the table ${uTable} in the SELECT and SQL expression.
      - If the user query is ambiguous, ask for clarification instead of guessing.
    
    Step 3:  Pass these as parameters to the handler:
    { table: ${uTable}, 
      query: <user's natural language query>,
      sql: <generated SQL> 
    }
     
    If the user specified a job, include that in the parameters:
    { table: ${uTable}, 
      query: <user's natural language query>,
      sql: <generated SQL query>,
      job: <job name> }

    Example 1:
    
    Step 1: User prompt:
    
    User prompt:
    ${toolname} origin='Asia' and make='Toyota'
    
    Step 2: Convert the query to a SQL Select statement 
    
    sql = "
    SELECT ${selectColumns} from ${uTable} AS WHERE origin='Asia' and make='Toyota'
    "
    
    Step 3: Pass these to the handler
    { table: ${uTable},
      query: "origin='Asia' and make='Toyota",
      sql: "SELECT ${selectColumns} from ${uTable} AS WHERE origin='Asia' and make='Toyota'"
    
    }
    
    Step 4: Handler returns the results of the query to the user. The output has a json representation of the table.
    

    ## Desired Output Display Format
    If the query is successful and returns rows, display the rows as a markdown table.

`;
   
    let spec = {
        name: toolname,
        description: description,
       
        schema: {
            query: z.string(),
            table: z.string().default(uTable),
            sql: z.string().optional(),
          
        },
        required: ['query', 'table'],
        handler: async (params) => {
            
            let { table, query, sql } = params;
            let sqlinput = (sql == null) ? ' ' : sql.replaceAll(';', ' ').replaceAll('\n', ' ').replaceAll('\r', ' ');
            
            let iparams = { 
                scenario: {
                    table: table,
                    prompt: query,
                    sql: sqlinput,
                    selectcolumns: `${selectColumns2}`
                },
                name: `${uJob}`,
                type: 'job'
            };
        
            if (sql == null || sql.trim().length === 0) {
                return { content: [{ type: 'text', text: 'Error: The SQL statement generated is blank. Please provide a valid natural language query that can be converted to SQL.' }] };
            }
            let r = await _jobSubmit(iparams);
            return r;

        }
    };
    return spec;
  
   
}
export default sasQueryTemplate2;
