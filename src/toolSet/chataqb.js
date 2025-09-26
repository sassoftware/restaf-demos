/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import {z} from 'zod';
import debug from 'debug';


function chataqb() {
    const log = debug('chataqb');
    let description = `
    ## chataqb: SAS PROC SQL query generator.
    
    Given:
	Table name:{table_name}
	Column Definitions List: {column_definition}	
	
	Instructions:
	Validate: Ensure all user-requested columns exist in the Column Definitions List. If not, return: 'Column <column_name> not found in the Column Definitions List.'
	Generate SQL: Create a valid PROC SQL SELECT statement based on the user's request.
	Restrictions:
	No Data Modification: Disallow DROP, DELETE, UPDATE, INSERT, or TRUNCATE. Return: "DROP/INSERT/UPDATE/DELETE/TRUNCATE options are disabled."
	No System Tables: Do not use system tables (e.g., sys.users).
	SAS PROC SQL Specific: Only handle SAS PROC SQL related requests.
	No Subqueries: Do not generate subqueries.
	Focus on accurately translating user requests into simple, valid PROC SQL SELECT statements within these constraints.
    
    Examples:
    Example 1:
    Input: Total paid amount, unique patients, and unique claims by procedure code for diagnosis code Z1100, Z10119, Z1020
    Output: SELECT prcdr_cd, SUM(pd_amt) AS total_paid_amount, COUNT(DISTINCT mdcd_id) AS unique_patients, COUNT(DISTINCT icn) AS unique_claims
    FROM clm_dental
    WHERE diag_cd IN ('Z1100', 'Z10119', 'Z1020')
    GROUP BY prcdr_cd;
    Example 2:
    Input: How many sudents are in each year and show me in percentage
    Output: Select
        year,
        count(distinct student_id) as number_of_students
        count(*)/(select count(distinct student_id) from clm_dental) as Percent format=percent8.2
        From clm_dental
        group by year;
    Example 3:
    Input: Show me paid amount by procedure code for procedure codes D1020, D1021, D1022
    Output:SELECT prcdr_cd, SUM(pd_amt) AS total_paid_amount
    FROM clm_dental
    WHERE prcdr_cd IN ('D1020', 'D1021', 'D1022')
    GROUP BY prcdr_cd;
    Example 4:
    Input: Total paid amount by procedure code for procedure codes D1020, D1021, D1022 for paid date between 01 jan 2023 to 31 dec 2024
    Output:
    SELECT prcdr_cd, SUM(pd_amt) AS total_paid_amount
    FROM clm_dental
    WHERE prcdr_cd IN ('D1020', 'D1021', 'D1022') AND pd_dt BETWEEN '01jan2023'd AND
    '31dec2024'd
    GROUP BY prcdr_cd;
    Example 5:
    Input: total paid amount by diagnosis codes for diagnosis codes Z1011, Z1122, Z2345 for paid date on or after 01 jan 2024
    Output: SELECT diag_cd, SUM(pd_amt) AS total_paid_amount
    FROM clm_dental
    WHERE diag_cd IN ('Z1011', 'Z1122', 'Z2345') AND pd_dt >= '01jan2024'd
    GROUP BY diag_cd;
	Example 6:	
	Input:Total paid amount by Service date and procedure code  for Service date on or after 01jan2024
	Output:SELECT service_date, prcdr_cd, SUM(pd_amt) AS total_paid_amount FROM clm_dental WHERE service_date >= '01jan2024'd GROUP BY service_date, prcdr_cd
    Example 7:
    Input: Average prcdr_cd by mdcd_id for origin has value USA
    Output: Error: Calculating the average of a non-numeric column like 'prcdr_cd' doesn't make sense.
    Example 8:
    Input: XYZ by procedure code
    Output: do not create output if xyz column does not existing
    Example 9:
    Input: Capital of USA
    Output: I can not answer generic questions, I can only answer questions releated to proc sql.
	Example 10:
	Input:Claims with service date in the last 2 years
	Output: 
	SELECT *
 	FROM clm_dental
 	where service_date >= INTNX('YEAR', TODAY(), -2, 'SAME');"""
    },
    `;

    let spec = {
        name: 'chataqb',
        description: description,
        schema: {
            sql: z.string(),
            table_name: z.string(),
            column_definition: z.string()
        },
        handler: async (params) => {
            let { sql, table_name, column_definition } = params;
            log('chataqb', sql, table_name, column_definition);
            return { content: [{ type: 'text', text: `You asked for SQL: ${sql} on table: ${table_name} with columns: ${column_definition}` }] }
        }
    }
    return spec;
}
export default chataqb;
