/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import getToken from "./getToken.js";
import refreshToken from "./refreshToken.js";

async function getLogonPayload(_appContext) {
  _appContext.logonPayload = await igetLogonPayload(_appContext);
  return _appContext.logonPayload;  
}

async function igetLogonPayload(_appContext, _cache) {

  // Use cached logonPayload if available
  // This will cause timeouts if the token expires
  if (_appContext.logonPayload != null && _appContext.tokenRefresh !== true) {
    console.error("[Note] Using cached logonPayload information");
    return _appContext.logonPayload;
  }

  // Use user supplied bearer token 
  if (_appContext.AUTHFLOW === "bearer") {
    console.error("[Note] Using user suplied bearer token ");
    let logonPayload = {
      host: _appContext.VIYA_SERVER,
      authType: "server",
      token: _appContext.bearerToken,
      tokenType: "Bearer",
    };
    return logonPayload;
  }

  // Use user supplied refresh token-
  if (_appContext.AUTHFLOW === "refresh") {
    console.error("[Note] Using user supplied refresh token"); 
    let token = await refreshToken(_appContext,{token: _appContext.refreshToken, host: _appContext.VIYA_SERVER});
    let logonPayload = {
      host: _appContext.VIYA_SERVER,
      authType: "server",
      token: token,
      tokenType: "Bearer",
    };

    return logonPayload;
  }
  
  if (_appContext.AUTHFLOW === "token") {
    console.error("[Note] Using token supplied by user");
    let logonPayload = {
      host: _appContext.VIYA_SERVER,
      authType: "server",
      token: _appContext.TOKEN,
      tokenType: "Bearer",
    };
    return logonPayload;
  }
 
  if (_appContext.AUTHFLOW === "none") {
    console.error(
      "[Note] No authentication flow selected. Proceeding without authentication."
    );
    let logonPayload = {
      host: _appContext.VIYA_SERVER,
      authType: "none",
    };
    return logonPayload;
  }

  if (_appContext.PASSWORDAUTHFLOW === "password") {
    let logonPayload = {
      host: _appContext.VIYA_SERVER,
      authType: "password",
      user: _appContext.USERNAME,
      password: _appContext.PASSWORD,
      clientID: _appContext.CLIENTIDPW,
      clientSecret: _appContext.CLIENTSECRETPW,
    };

    return logonPayload;
  }

  // sascli auth flow - create from credentials file
  try {
    let { host, token } = await getToken(_appContext)
    console.error("[Note] got refresh token from getToken() for host ", host);
    let logonPayload = {
      host: host,
      authType: "server",
      token: token,
      tokenType: "Bearer",
    };
    return logonPayload;
  } catch (e) {
    console.error("[Error].... Error getting token: ", e);
    process.exit(1);
  }
}
export default getLogonPayload;
