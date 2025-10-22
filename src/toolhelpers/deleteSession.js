/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import debug from 'debug';

async function deleteSession(appControl) {
  //const log = debug('deletesession');
  let {store, session} = appControl;
  if (store != null && session != null) {
    //log('Deleting session');
    // If the session has a delete link, use it to delete the session
    await store.apiCall(session.links('delete'));
  }
  return;

}
export default deleteSession;
