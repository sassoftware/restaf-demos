/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import {z} from 'zod';
import _jobSubmit from '../toolhelpers/_jobSubmit.js';

function sasQuery() {
 
    let description = `
    You are an expert at translating natural language queries into SAS PROC SQL SELECT statements.
    You will then convert the user's query to a valid SAS PROC SQL SELECT statement and pass this string 
    as the query. 

    Instructions to LLM: 
    The user MUST specify a non-blank query and a table.
    The handler will return the data that was queried from the table.
    User can optionally specify a SAS job to run the query on the SAS Server. 
    If not specified, the default job 'sas_sql_tool' will be used.
    If the number of rows returned is greater than 10, list only the first 10 rows.
    Ask user if they want to see more rows.

    The desired flow:
    Instructions to LLM: Show the progress of how you are thinking about converting the natural language query to SQL.
    Step 1:  User provides the following prompt:
    sasquery table=<table_name>  query=<natural language query>
    
    Step 2: Convert the user's natural language query into a valid SAS PROC SQL SELECT statement. A good reference for
    the SQL syntax is this [link](https://go.documentation.sas.com/doc/en/pgmsascdc/v_067/sqlproc/n0w2pkrm208upln11i9r4ogwyvow.htm)
    Instructions to LLM: 
     - Do not add a semicolon to the end of the SQL statement.
    
    Step 3:  Pass these as parameters to the handler:
    { table: <table_name>, 
      query: <user's natural language query>,
      sql: <generated SQL query> }
    The table is of the form libname.tablename.
    If the user specified a job, include that in the parameters:
    { table: <table_name>, 
      query: <user's natural language query>,
      sql: <generated SQL query>,
      job: <job name> }

    Example 1:
    
    Step 1: User prompt:
    
    User prompt:
    sasquery table=mylib.clm_dental query=Total paid amount, unique patients, and unique claims by procedure code for diagnosis code Z1100, Z10119, Z1020
    
    Step 2: Convert the query to a SQL Select statement 
    
    sql = "
    SELECT prcdr_cd, SUM(pd_amt) AS total_paid_amount, COUNT(DISTINCT mdcd_id) AS unique_patients, COUNT(DISTINCT icn) AS unique_claims
    FROM mylib.clm_dental
    WHERE diag_cd IN ('Z1100', 'Z10119', 'Z1020')
    GROUP BY prcdr_cd
    "
    
    Step 3: Pass these to the handler
    { table: "mylib.clm_dental",
      query: "Total paid amount, unique patients, and unique claims by procedure code for diagnosis code Z1100, Z10119, Z1020",
      sql: "SELECT prcdr_cd, SUM(pd_amt) AS total_paid_amount, COUNT(DISTINCT mdcd_id) AS unique_patients, COUNT(DISTINCT icn) AS unique_claims
           FROM mylib.clm_dental
           WHERE diag_cd IN ('Z1100', 'Z10119', 'Z1020')
           GROUP BY prcdr_cd"
    }
    
    Step 4: Handler returns the results of the query to the user. The output has a json representation of the table.
    
    Example 2:
    Input: sasquery table=mylib.clm_dental query=How many students are in each year and show me in percentage
    
    
    The parameters passed to the handler are:
    {
        table: "mylib.clm_dental",
        query: "How many students are in each year and show me in percentage"
        sql: "SELECT year,
                COUNT(DISTINCT student_id) AS number_of_students,
                COUNT(*) / (SELECT COUNT(DISTINCT student_id) FROM mylib.clm_dental) AS Percent FORMAT=percent8.2
                FROM mylib.clm_dental
                GROUP BY year"
    }
   

`;


    let spec = {
        name: 'sasQuery',
        description: description,
        schema: {
            query: z.string(),
            table: z.string(),
            sql: z.string().optional(),
            job: z.string().default('sas_sql_tool')
        },
        required: ['query', 'table'],
        handler: async (params) => {
            let {table,query, sql, job, _appContext} = params;
            let sqlinput = (sql == null) ? ' ' : sql.replaceAll(';', ' ').replaceAll('\n', ' ').replaceAll('\r', ' ');
            
            let iparams = {
                scenario: {
                    table: table,
                    prompt: query,
                    sql: sqlinput
                },
                name: (job == null) ? 'sas_sql_tool' : job,
                type: 'job',
                query: true,
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
export default sasQuery;
