/*
 * ------------------------------------------------------------------------------------
 *   Copyright (c) SAS Institute Inc.
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 * ---------------------------------------------------------------------------------------
 *
 */
 'use strict';
 module.exports = function getCodeTable (caslib, name, dataStepSrc) {
    
    let carray = dataStepSrc.split(/\r?\n/);
    let clen = carray.length;

    let code = `
        data ${caslib}.${name};
        length modelName varchar(128) dataStepSrc varchar(*);
        keep modelName dataStepSrc;
        modelName = 'DATA step';
        `;
    code = code + `array c {${clen}} $ 120. c1 - c${clen};`;
    let t1 = '';
    for ( let i = 0 ; i < clen; i++ ) {
        let j = i + 1;
        t1 = t1 + ' ' + `c${j}="${carray[i]}";`;
    }
    code = code + t1;
    code = code + ` 
       dataStepSrc = '   ';
        do i = 1 to ${clen};
            dataStepSrc = dataStepSrc||c{i};
        end;   
        put dataStepSrc=;
    run;

    `;
    console.log(code);
    return code;
}


