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
async someFunction(params, userData, appEnv) {
}
```

params is the same as in the standard implementation.

userData is an object that was set in the configuration object
when calling setupAssistant.

appEnv is an object with the following keys(among others).

> Note on sessionID: If sessionID is non-null, you
can use it to make api calls to compute or
cas servers using your own techiques(sorry to hear you are not using restaf)
