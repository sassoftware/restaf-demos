import { type } from 'os';
import getLogonPayload from './getLogonPayload.js';
import restafedit from '@sassoftware/restafedit';
import deleteSession from './deleteSession.js';
import debug from 'debug';
const log = debug('listlibrary');
async function _listLibrary(params) {
  let { source, library } = params;

  let logonPayload = getLogonPayload();
  let config = {
    source: source,
    table: null
  };
  let appControl = {};
  try {
    let appControl = await restafedit.setup(
      logonPayload,
      config,
      null,/* create a sessiion */
      {},
      'user',
      {}
    );
    log
    let f = `eq(name, '${library}')`;
    log(f);
    let payload = {
      qs: {
        limit: 1000,
        start: 0,
        filter: f
      }
    };
    log(payload);
    let items = await restafedit.getLibraryList(appControl, payload);
    log('items', items);
    let r = items.length === 1 ?  'YES' : 'NO';
    console.log('library exists', r);
    let contents ={
      content: [
        { type: 'text', text: r}
      ]
    };
    return contents;
  } catch (err) {
    log(JSON.stringify(err));
  //  await deleteSession(appControl);
    return { content: [{ type: 'text', text: JSON.stringify(err) }] };
  }

};


export default _listLibrary;