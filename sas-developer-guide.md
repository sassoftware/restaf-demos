# Instructions for modifying or adding new tools

## Basics

### src/toolset

This folder contains all the tools defined. The tools must conform to the MCP standards.
The mcp server will add the branding prefix to the tools. By default it is `sas-app-`

### toolHelpers

All code related to handling the prompt request are defined in this folder. This is just a convention of the
author and not a hard and fast rule.

## Parameters to a tool helper

Most of the tools are designed to call some service in SAS Viya. To enable passing runtime configurations to the tool helper, the parameters are enhanced with the _appContext object. The _appContext gives the developer access to all the information the server caches for a particular mcp session.

```js
const appEnvBase= {
 ...
  contexts: {
    sas: (process.env.COMPUTECONTEXT == null) ? 'SAS Job Execution compute context' : process.env.COMPUTECONTEXT,
    cas: (process.env.CASSERVER == null) ? 'cas-shared-default' : process.env.CASSERVER
  }
};
```

This is used by utility functions to logon to Viya, setup calls to Viya using restaf etc...


TBD: Document the details on the _appContext object
