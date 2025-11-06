/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { z } from 'zod';
import _jobSubmit from '../toolhelpers/_jobSubmit.js';


function gidb(_appContext) {


    let description = `
    You are an expert at translating natural language filter into SAS PROC SQL SELECT statement for the table Public.gidb_current.
    You will then convert the user's query to a valid SAS PROC SQL SELECT statement  and pass this string 
    as the query. 

    Instructions to LLM: 
     
    The handler will return the data that was queried from the table.
    The table is always Public.gidb_current.
    The select columns are always  'site, opsys, offering, product, rate, quantity, quantype, currency'.
    Users can specify other filters, group by, order by, etc. in the natural language query.
 
    The desired flow:
    Instructions to LLM: Show the progress of how you are thinking about converting the natural language query to SQL.
    Step 1:  User provides the following prompt:
    gidb <natural language query>
    
    Step 2: Convert the user's natural language query into a valid SAS PROC SQL SELECT statement. A good reference for
    the SQL syntax is this [link](https://go.documentation.sas.com/doc/en/pgmsascdc/v_067/sqlproc/n0w2pkrm208upln11i9r4ogwyvow.htm)
    Instructions to LLM: 
   - Do not add a semicolon to the end of the SQL statement.
      - If the user query is ambiguous, ask for clarification instead of guessing.
    
    Step 3:  Pass these as parameters to the handler:
    { table: Public.gidb_current, 
      query: <user's natural language query>,
      sql: <generated SQL query> }
     
    If the user specified a job, include that in the parameters:
    { table: Public.gidb_current, 
      query: <user's natural language query>,
      sql: <generated SQL query>,
      job: <job name> }

    Example 1:
    
    Step 1: User prompt:
    
    User prompt:
    gidb where company = 'IBM'
    
    Step 2: Convert the query to a SQL Select statement 
    
    sql = "
    SELECT site, opsys, offering, product, rate, quantity, quantype, currency from Public.gidb_current
    WHERE company = 'IBM'
    "
  
    
    Step 3: Pass these to the handler
    { table: Public.gidb_current,
      query: "where company = 'IBM'",
      sql: "SELECT site, opsys, offering, product, rate, quantity, quantype, currency from Public.gidb_current
             WHERE company = 'IBM'"
    }
    
    Step 4: Handler returns the results of the query to the user. The output has a json representation of the table.
    
    Example 2:
    Input: gidb where company is 'IBM' and group by  site and total the rate by site  
    
    
    The parameters passed to the handler are:
    {
        table: Public.gidb_current,
        query: "where company is 'IBM' and group by site and total the rate by site",
        sql: "SELECT site, opsys, offering, product, rate, quantity, quantype, currency, SUM(rate) AS total_rate_by_site FROM Public.gidb_current WHERE company = 'IBM' GROUP BY site"
    }

    ## Desired Output Display Format
    If the query is successful and returns rows, display the rows as a markdown table. If the table has more than 20 rows, show the first 20 and ask the user if they want to see the rest of the rows`;
   
    let spec = {
        name: 'gidb',
        description: description,
       
        schema: {
            query: z.string(),
            sql: z.string().optional()
        },
        required: ['query' ],
        handler: async (params) => {
            
          
            let { query, sql, _appContext} = params;
            let sqlinput = (sql == null) ? ' ' : sql.replaceAll(';', ' ').replaceAll('\n', ' ').replaceAll('\r', ' ');
            
            let iparams = { 
                scenario: {
                    table: 'Public.gidb_current',
                    prompt: query,
                    sql: sqlinput
                },
                name: 'run_sql_query',
                type: 'job',
                _appContext: _appContext
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
export default gidb;
