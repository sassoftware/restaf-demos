# mcp-serverjs - A demo ModelContextProtocolServer(mcp) for SAS Viya

This is mcp server for SAS Viya written in nodejs. The intended audience is SAS users who want to
take advantage of MCP to deliver IP they have created with SAS or other technologies.

The server comes with a set of sample tools.

## Simple tool

- devascore - calculates a special score given two numbers

## SAS related tools

- readSASData - read SAS or  CAS tables
- superstat - an example of accessing custom SAS code
- searchAsset - an experimental tool using SAS/Catalog
- loanscore - compute a loan score using SCR


With this server you can issue prompts like these:

- Read costchange from samples. Limit the number of records to 10.
- read sashelp.air from sas
- read public.cars from cas where make = toyota
- compute superstat for 1,2

> You can add your own capabilities to this server. See notes at the end of this document.

## Useful links

- [Documentation on modelcontextprotocol(mcp)](https://modelcontextprotocol.io/introduction)

- [mcp sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)


##  Install and run the server

 > Make sure your node version is >= 22.16.0
 
- Clone this repository as follows:
    - https://github.com/sassoftware/restaf-demos mymcp -b mcp-serverjs
    - then cd over to mymcp folder
    - run the 'npm install' command
- Copy .env.sample as .env
- Edit .env file and set the values for authentication with Viya(see below)
- Start the mcp server as described below
- Register with your MCP host(see example for github Copilot below)

And then use your Copilot to read any cas or sas table in your Viya server.

# Viya Authentication

### Tokens created with sas-viya auth loginCode

Once you have created a token and refresh token with **sas-viya auth loginCode**, set the USETOKEN to TRUE in the .env file.
The code will use the refresh token to create a new token for each prompt - which is similar to how sas-cli works.

Currently this option will not work if server is running in Docker. I need some additional code in the setup to make it work.

### Password flow

Create the appropriate clientid and clientsecret for a password flow in  your server
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
 "Viya Models MCP Server": {
    "type": "http",
    "url": "http://localhost:8080/mcp"
 }
```
and then start it.

Now make sure your IDE Copilot is in "Agent Mode" - use the dropdown in the prompt area

> You are now ready to use your copilot to list data from SAS and CAS Tables


Now you can issue prompts like

- Read costchange from samples.
- read sashelp.air from sas
- read public.cars from cas where make eq toyota

Try the other tools in this server


### Test with @modelcontextprotocol/inspector

The inspector is a nice way to debug any new tools you write. If you are
accessing compute service, increase the timeout option.

```sh
npm test
```

## Enhancing the server

- Add a file to the toolSet folder
    - Use one of the files in this folder as a guide
- Add the new file to the index.js file in toolSet folder
- Restart the mcp server

## Notes

This demo server is "stateless" - it does not cache any values, including any Viya sessions the tools 
might have created.

In a production system the designer has to maka decisions on what needs to be cached and the implications of 
such caching.

The implication of this design choice is felt most when the tool needs to create a compute session - the requests will take longer than when the compute session is cached.


## TBD

- create a version that caches selected items for performance.
- switch from express to hapijs - my preferred app server package
- run in a namespace in a Viya server 
- work on futher generaliztion of this server so it can be used for more complex scenarios
- Investigate integratinn A2A from Google with this server
- create custom mcp host.
