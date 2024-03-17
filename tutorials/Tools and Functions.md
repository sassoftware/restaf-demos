# Notes on Tools and Functions

Visit the provider site for information on functions and tools.

## Local rules

The library sends a modified arguments to the functions 
associated with the tools.

In a standard implementation the implementation for a function
 will look like this:

```javascript
async someFunction(params) {
  The parms has keys based on the function specification.
}
```

In @sassoftware/viya-appenvjs the function should look like this.

```javascript
async someFunction(params, appEnv) {
}
```

appEnv is an object with the following keys(among others).

Depending on what was set in the configuration object
when calling setupAssistant there are keys in appEnv that
will be of interest to the function writer.

### General

```text
let appEnv=  {
  host: <Viya url>
  logonPayload: passed in to setupConfig,
  source: passed in to setupConfig> 
  userData: passed in to the setupConfig

  /* for restaf users - non-null if source is cas|compute*/
  store: restaf object for restaf users 
  session: viya session(cas or compute) object
  servers: viya server object(cas - null for compute)
  serverName: cas servername or compute context 
  restaf: restaf,
  restaflib: restaflib,
  restafedit: restafedit, 
  /* end of restaf section */
  sessionID: sessionID associated with the session(see note below)
}
```

> Note on sessionID: If sessionID is non-null, you
can use it to make api calls to compute or
cas servers using your own techiques(sorry to hear you are not using restaf)
