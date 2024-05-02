# Accessing Viya from the tools

## Step 1: Define your logonPayload

If you have access to the authentication token, then define logonPayload as follows:

```javascript
let logonPayload = {
  authType: 'server',
  host: <your Viya URL>,
  token: <SAS Viya token>
  tokenType: 'bearer'
}
```

If you are using this in a browser environment with authorization_code flow,
then define logonPayload as follows:

```javascript
let logonPayload = {
  authType: 'server,
  host: <your Viya URL>
}
```

Now set the value of logonPayload in the config object as follows:

```javascript

let config = {
  ...
  viyaConfig: {
    logonPayload: logonPayload
  }
  ..
}
```

## Step 2:  getViyaSession function: Accessing Viya session in tools

In the code for your tool, you can access information to make REST API calls as follows:
  
```javascript
let source = <'cas' or 'sas'>
let appEnv = await appControl.getViyaSession(source);)
```

The [appEnv object](https://sassoftware.github.io/restaf-demos/global.html#appEnv)
has information to access Viya.

```javascript
let appEnv = {
  host: <your Viya URL>,
  logonPayload: <your logonPayload>,
  source: <'cas' or 'sas' that was passed in the call to getViyaSession>
  sessionID: <cas or sas(compute) sessionID>
  // the following are for restaf users
  servers: <server object is source is cas>
  serverName: <compute context for sas or cas server name>,
  store: <restaf store object>
  restaflib: <restaflib library methods for convenience>
  restafedit: <restafedit library methods for convenience>
}


```

The sessionID is created on first call and reused in subsequent calls.
So in effect you can have one cas session and one sas session active during
an assistant session

## Using your own Viya session management

In step 1 set logonPayload to null. It is now upto the developer to manage Viya session.

Hint: Use the userData object in the config object to store your
 session id and other global information.
