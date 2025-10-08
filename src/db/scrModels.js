/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
function scrModels(name) {

    // This function returns the URL of the SCR model based on the name.
    // In a real application the list of scr models would be fetched from a database or configuration file.
    // For this example, we will use a hardcoded list of models.
    let scrModels = {
       "loan": "http://mcphllllll.hggmg3bshufda0et.eastus8080/mcp"
    };

    if (name.indexOf('http') === 0) {
        return name;
    }
    if (scrModels[name]) {
        return scrModels[name];
    }
    return null;
}

export default scrModels;