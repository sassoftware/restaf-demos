/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import getToken from './getToken.js';

async function getLogonPayload(_appContext) {

  if (_appContext.PASSWORDAUTHFLOW === 'password') {
    let logonPayload = {
        host: _appContext.VIYA_SERVER,
        authType: 'password',
        user: _appContext.USERNAME,
        password: _appContext.PASSWORD,
        clientID: _appContext.CLIENTIDPW,
        clientSecret: _appContext.CLIENTSECRETPW
      };
      
    return logonPayload;
  }

  if (_appContext.logonPayload != null) {
    console.error('[Note] Using cached logonPayload');
     return _appContext.logonPayload; 
  }
  
  if (_appContext.AUTHFLOW === 'token') {
    let logonPayload = {
        host: _appContext.VIYA_SERVER,
        authType: 'token',
        token: _appContext.TOKEN,
        tokenType: 'Bearer'
      };
    _appContext.logonPayload = logonPayload;
    return logonPayload;
    }
  // need more configuration and code changes(mounting .sas folder) to make this work in docker
  //AUTHFLOW=sascli
  
  try {
    let {host, token} = await getToken(_appContext);
    console.error('[Note] got refresh token from getToken() for host ', host);
    let logonPayload = {
      host: host,
      authType: 'server',
      token: token,
      tokenType: 'Bearer'
    };
    _appContext.logonPayload = logonPayload;
    return logonPayload;
  } catch (e) {
    console.error('[Error].... Error getting token: ', e);
    process.exit(1);
  }

}
export default getLogonPayload;