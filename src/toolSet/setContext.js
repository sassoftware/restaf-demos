/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {z} from 'zod';

function setContext(_appContext) {
    let description = `
## setContext — set the CAS and SAS server contexts for subsequent tool calls

LLM Invocation Guidance (When to use)
Use THIS tool when:
- User wants to switch to a different CAS server: "Use the finance-cas-server"
- User wants to change the compute context: "Switch to 'SAS Studio Compute Context'"
- User wants to check current context: "What context am I using?"
- User wants to set both: "Use finance-cas-server for CAS and my-compute for SAS"

Do NOT use this tool for:
- Retrieving variable values (use deval)
- Reading table data (use readTable)
- Running programs or queries (use program or sasQuery)
- Listing available servers or contexts (no tool for this; would require backend support)

Purpose
Set the active CAS server and/or SAS compute context for all subsequent tool calls in this session. This allows switching between different server environments. If neither parameter is provided, the tool returns the current context values.

Parameters
- cas (string, optional): The name of the CAS server to use for subsequent CAS operations. Examples: 'cas-shared-default', 'finance-cas-server', 'analytics-cas'
- sas (string, optional): The name of the SAS compute context to use for subsequent SAS operations. Examples: 'SAS Studio Compute Context', 'my-compute', 'batch-compute'

Response Contract
Returns a JSON object containing:
- cas: The current/new CAS server name (string or null)
- sas: The current/new SAS compute context name (string or null)
- If no parameters provided, returns the current context values
- If parameters provided, updates and returns the new context values

Disambiguation & Clarification
- If user says "switch servers" without specifying which: ask "Which server would you like to use: CAS, SAS, or both?"
- If user provides a server name that may not exist: proceed with setting it (the backend will validate)
- If user says "reset context": ask "Should I reset the CAS context, SAS context, or both?"

Examples (→ mapped params)
- "Use the finance-cas-server" → { cas: "finance-cas-server" }
- "Switch to SAS Studio Compute Context" → { sas: "SAS Studio Compute Context" }
- "Set CAS to prod-cas and SAS to batch-compute" → { cas: "prod-cas", sas: "batch-compute" }
- "What's my current context?" → { } (no parameters returns current context)

Negative Examples (should NOT call setContext)
- "Read 10 rows from the customers table" (use readTable instead)
- "What's the value of myVariable?" (use deval instead)
- "Run this SAS program" (use program instead)

Related Tools
- deval — to retrieve individual environment variable values
- readTable — to read data using the current context
- program — to execute SAS programs in the current context
- sasQuery — to execute SQL queries in the current context
`;
  
    let spec = {
        name: 'setContext',
        description: description,
        schema: {
            cas: z.string().optional(),
            sas: z.string().optional()
        },
       
        handler: async (params) => {
            // Ensure contexts object exists
            if (_appContext.contexts == null || typeof _appContext.contexts !== 'object') {
                _appContext.contexts = {
                    cas: _appContext.DEFAULT_CAS_SERVER || null,
                    sas: null
                };
            }
            let {cas, sas} = params;
            if (typeof cas === 'string' && cas.trim().length > 0) {
                _appContext.contexts.cas = cas.trim();
            }
            if (typeof sas === 'string' && sas.trim().length > 0) {
                _appContext.contexts.sas = sas.trim();
            }
            // Return a structured response without extraneous keys
            return {
                content: [{ type: 'text', text: JSON.stringify(_appContext.contexts) }],
                structuredContent: _appContext.contexts
            };
        }
    }
    return spec;
}
export default setContext;
