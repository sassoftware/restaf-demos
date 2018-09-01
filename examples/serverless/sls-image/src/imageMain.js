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

/*
 * Simple echo action example
 */
'use strict';
let parseEvent  = require('./parseEvent'); 

 module.exports = async function imageMain (store, event, context) {

    let reportName = parseEvent(event);
    console.log(reportName);
    if ( reportName === null || reportName.length === 0 ) {
        throw {Error: 'Missing reportName' }
    }
    
    let {reports, reportImages} = await store.addServices('reports', 'reportImages');

    let payload = {
        qs: {
            filter: `eq(name,'${reportName}')`
        }
    }
    let reportsList = await store.apiCall(reports.links('reports'), payload);
    console.log('back');
    if ( reportsList.itemsList().size === 0 ) {
        throw {Error: `${reportName} not found`}
    }
    
    let data = {
        reportUri   : reportsList.itemsCmd(reportsList.itemsList(0), 'self', 'link', 'uri'),
        sectionIndex: 0,
        layoutType  : 'entireSection',
        size        : "400x400"
    };
    let p = { data: data };

    let job = await store.apiCall(reportImages.links('createJob'), p);
    let status = await store.jobState(job, { qs: { wait: 2} } , 10);

    if (status.data !== 'completed') {
        throw { Error: `Job failed ${status.data}`};
    }
    let image = await store.apiCall(status.job.itemsCmd(status.job.itemsList(0), 'image'));
    return {
        image: image.items()
    }
}
