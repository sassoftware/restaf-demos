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
    You will then convert the user's query to a valid SAS PROC SQL SELECT statement and pass this string 
    as the sql parameter to the handler.
    
    The handler will return the data that was queried from the table.
    
    The desired flow:
    Instructions to LLM: Show the progress of how you are thinking about converting the natural language query to SQL.
    Step 1:  User provides the following prompt:
    chataqdb table=<table_name>  query=<natural language query>
    
    Step 2: Convert the user's natural language query into a valid SAS PROC SQL SELECT statement. A good reference for
    the SQL syntax is this [link](https://go.documentation.sas.com/doc/en/pgmsascdc/v_067/sqlproc/n0w2pkrm208upln11i9r4ogwyvow.htm)
    
    Step 3:  Pass these as parameters to the handler:
    { table: <table_name>, 
      query: <user's natural language query>,
      sql: <generated SQL query> }
    
    Example 1:
    
    Step 1: User prompt:
    
    User prompt:
    chataqdb table=clm_dental query=Total paid amount, unique patients, and unique claims by procedure code for diagnosis code Z1100, Z10119, Z1020
    
    Step 2: Convert the query to a SQL Select statement 
    
    sql = "
    SELECT prcdr_cd, SUM(pd_amt) AS total_paid_amount, COUNT(DISTINCT mdcd_id) AS unique_patients, COUNT(DISTINCT icn) AS unique_claims
    FROM clm_dental
    WHERE diag_cd IN ('Z1100', 'Z10119', 'Z1020')
    GROUP BY prcdr_cd
    "
    
    Step 3: Pass these to the handler
    { table: "clm_dental",
      query: "Total paid amount, unique patients, and unique claims by procedure code for diagnosis code Z1100, Z10119, Z1020",
      sql: "SELECT prcdr_cd, SUM(pd_amt) AS total_paid_amount, COUNT(DISTINCT mdcd_id) AS unique_patients, COUNT(DISTINCT icn) AS unique_claims
           FROM clm_dental
           WHERE diag_cd IN ('Z1100', 'Z10119', 'Z1020')
           GROUP BY prcdr_cd"
    }
    
    Step 4: Handler returns the results of the query to the user. The output has a json representation of the table.
    
    Example 2:
    Input: chataqb table=clm_dental query=How many students are in each year and show me in percentage
    
    
    The parameters passed to the handler are:
    {
        table: "clm_dental",
        query: "How many students are in each year and show me in percentage"
        sql: "SELECT year,
                COUNT(DISTINCT student_id) AS number_of_students,
                COUNT(*) / (SELECT COUNT(DISTINCT student_id) FROM clm_dental) AS Percent FORMAT=percent8.2
                FROM clm_dental
                GROUP BY year"
    }
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
            let iparams = {
                scenario: {
                    table_name: table,
                    question: query,
                    sql: sql
                },
                name: 'chataqb',
                type: 'job'
            };
            let r =  await _jobSubmit(iparams);
            return r;
        }
    }
    return spec;
}
export default chataqb;
