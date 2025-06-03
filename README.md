# mcp-serverjs - A demo ModelContextProtocolServer(mcp) for SAS Viya

This is demo of mcp server for SAS Viya written in nodejs. The key capability(tool in mcp terminology) of this server is to read cas and sas tables and return the results

With this server you can issue prompts like these:

- Read costchange from samples. Limit the number of records to 10.
- read sashelp.air from sas
- read public.cars from cas where make = toyota

> You can add your own capabilities to this server. See notes at the end of this document.

## Useful links

- [Documentation on modelcontextprotocol(mcp)](https://modelcontextprotocol.io/introduction)

- [mcp sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)


##  Install and run the server

- Clone this repository
- Copy .env.sample as .env
- Edit .env file and set the values for authentication with Viya(see below)
- Start the mcp server as described below
- Register with your MCP host(see example for github Copilot below)

And then use your Copilot to read any cas or sas table in your Viya server.

# Viya Authentication

### Password flow

Create the appropriate clientid and clientsecret for a password flow in  your server

### Tokens created with sas-viya auth loginCode

Once you have created a token with sas-viya auth loginCode, set the USETOKEN to TRUE in the .env file.

Currently this option will not work if server is running in Docker. I need some additional code in the setup to make it work.

### TBD
Support for client-credentials.


## Start the mcp server

### Run server on docker Desktop

```sh
npm run deploy
```

### Run without docker desktop
Make sure your node version is >= 22.16.0

```sh
npm start
```

## Using the mcp server

### With vscode Copilot

> Note: you can use any mcp enabled host - ex: Claude Desktop, custom apps etc...

Go to the vscode settings and search for mcp. Then select Model Server Context Protocol. Edit its config json

Add the following to the list of mcp servers

```js
 "mcp-viya-services":{
    "url": "http://localhost:8080/mcp"
}
```
and then start it.

Now make sure your vscode Copilot is in "Agent Mode" - use the dropdown in the prompt area

> You are now ready to use your copilot to list data from SAS and CAS Tables


Now you can issue prompts like

- Read costchange from samples. Limit the number of records to 10.
- read sashelp.air from sas
- read public.cars from cas where make = toyota


### Test with @modelcontextprotocol/inspector

The inspector is a nice way to debug any new tools you write. If you are
accessing compute service, increase the timeout option.

```sh
npm test
```

## Enhancing the server

- Add new tool definitions to the tools.js file
- Currently supporting functions are in toolhelpers folder. Use your own conventions

## Notes

This demo server is "stateless" - it does not cache any values, including any Viya sessions the tools 
might have created.

In a production system the designer has to maka decisions on what needs to be cached and the implications of 
such caching.

The implication of this design choice is felt most when the tool needs to create a compute session - the requests will take longer than when the compute session is cached.

