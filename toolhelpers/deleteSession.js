/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
async function deleteSession(appControl) {
let {store, session} = appControl;
if (store != null && session != null) {
  console.log('Deleting session');;
  // If the session has a delete link, use it to delete the session
  await store.apiCall(session.links('delete'));
}
return;

}
export default deleteSession;
