
/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import {z} from 'zod';
import _chatgpt from '../toolhelpers/_chatgpt.js';



function chataqb() {
 
    
    let description = `
    You are tasked with querying a table and returning the results. 
    The user will provide a natural language query and the table name to query against. 
    You will then convert the user's query to a valid SAS PROC SQL SELECT statement,
    pass this new query to the handler, and return the results to the user.

    The desired flow:

    1. User provides the following prompt:
    chataqdb table=<table_name>  query=<natural language query>

    2. Convert the user's natural language query into a valid SAS PROC SQL SELECT statement

    3. Pass these as parameters to the handler:
    { table: <table_name>, 
      query: <generated SQL query> }

    
    Example 1:

    Step 1: User prompt:
    
    User prompt:
    chataqdb table=clm_dental query=Total paid amount, unique patients, and unique claims by procedure code for diagnosis code Z1100, Z10119, Z1020

    Step 2: LLM converts the query to SQL statement:

    query = "
    SELECT prcdr_cd, SUM(pd_amt) AS total_paid_amount, COUNT(DISTINCT mdcd_id) AS unique_patients, COUNT(DISTINCT icn) AS unique_claims
    FROM clm_dental
    WHERE diag_cd IN ('Z1100', 'Z10119', 'Z1020')
    GROUP BY prcdr_cd;
    "

    Step 3: Pass these to the handler
    { table: "clm_dental",
      query: "SELECT prcdr_cd, SUM(pd_amt) AS total_paid_amount, COUNT(DISTINCT mdcd_id) AS unique_patients, COUNT(DISTINCT icn) AS unique_claims
              FROM clm_dental
              WHERE diag_cd IN ('Z1100', 'Z10119', 'Z1020')
              GROUP BY prcdr_cd;"
    }

    Step 4: Handler returns the results of the query to the user. The output has a json representation of the table.

    Example 2:
    Input: chataqb table=clm_dental query=How many students are in each year and show me in percentage
    
    The convered SQL query is:
    SELECT year,
           COUNT(DISTINCT student_id) AS number_of_students

    The parameters passed to the handler are:
    {
        table: "clm_dental",
        query: "SELECT year,
                COUNT(DISTINCT student_id) AS number_of_students,
                COUNT(*) / (SELECT COUNT(DISTINCT student_id) FROM clm_dental) AS Percent FORMAT=percent8.2
                FROM clm_dental
                GROUP BY year;"
    }
`; 

    let spec = {
        name: 'chataqb',
        description: description,
        schema: {
            query: z.string(),
            table: z.string(),
        },
        handler: async (params) => {
            let {table,query} = params;
            let iparams = {
                table: table,
                query: query,
                name: 'chataqb'
            };
            return await _chatgpt(iparams);
        }
    }
    return spec;
}
export default chataqb;
