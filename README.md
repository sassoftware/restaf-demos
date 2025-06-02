# mcp-serverjs

This is demo of mcp server in nodejs.

- indexhttp.js - uses http streaming(with no history)
- indexstdio.js - uses stdio streaming


##  Using the server

- Clone this repository
- edit .env file and set the values for authentication with Viya. 
- Start the server either locally(ia node) or in docker desktop or use the inspector ui
    - see below
- Register with your MCP host

### Test with @modelcontextprotocol/inspector

```sh
npm test
```

### Run server on docker Desktop

```sh
npm run deploy
```

### Run without docker desktop
Make sure you have the latest node

```sh
npm start
```

## Using VSCode Copilot

> Note: you can use any mcp enabled host - ex: Claude Desktop, custom apps etc...

Go to the settings and search for mcp and select Model Server Context Protocol 

Add the following to the list of mcp servers

 "mcp-viya-services":{
    "url": "http://localhost:8080/mcp"
}

and then start it.

Now make sure your VSCode copilot is in "Agent Mode" - use the dropdown in the prompt area
You are now ready to use your copilot to list data from SAS and CAS Tables


Now you can issue prompts like

Read costchange from samples. Limit the number of records to 10.

