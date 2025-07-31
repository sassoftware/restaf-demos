# mcp-serverjs - A ModelContextProtocolServer(mcp) for Scoring 

- [Introduction](#intro)
- [Using the default mcp server](#defserver)
  - [Start the mcp server](#startserver)
  - [Enable client for mcp server](#enable)
  - [Enable mcp/redis - optional](#redis)


---
---

## Introduction(#intro)

MCP servers is one of the popular additions to the agentic-ai world. This repository shows that SAS developers can take advantage of this technology to deliver their solutions via a "chat".

The  mcp server  described here is designed for scoring with SAS Viya. In this document "scoring" is used to describe executing any code that takes some input and returns results. 

Some examples are:

- models created with SAS solutions like Model Studio, Intelligent Decisioning etc...
- user written SAS programs
- functions that call SAS products using REST API to get results

  See below for the capabilities in the starter kit and how you can modify it for your own use.

The source code is the repository <https://github.com/sassoftware/restaf-demos/tree/mcp-serverjs>.
It is provided under the Apache-2.0 license.



---

## Using the default mcp server<a name="defserver"></a>

---

Follow these basic steps to see how an mcp server can help you.

### Step 1: Start the mcp server<a name="startserver"></a>

Issue this command from any shell on your desktop

> npx @sassoftware/mcp-serverjs@latest

Make sure that you have a node version >=22


### Step 2: Enable github copilot for the mcp server<a name="enable"> </a>

Similar methodologies can be used with other mcp enabled copilots.
Go to the vscode settings and search for mcp. Then select Model Server Context Protocol. Edit its config json
Add the following to the list of mcp servers

```js
 "viya-scoring-mcp-server": {
    "type": "http",
    "url": "http://localhost:8080/mcp"
 }
```
The name can be anything you like.

### Step 3: Enable mcp/redis<a name="redis"> </a>

To enable persistence with redis, a few steps are required.

1. Add mcp/redis settings.json

```json
"redis": {
        "command": "docker",
        "args": [
          "run",
          "--rm",
          "--name",
          "mcp_redis",
          "--network",
          "redisapp_default",
          "-i",
          "-e",
          "REDIS_HOST=redis",
          "-e",
          "REDIS_PORT=6379",
          "-e",
          "REDIS_SSL=false",
          "mcp/redis"
        ]
      }


```

2. Clone the repository [redis-subscriber](ttps://github.com/sassoftware/restaf-demos/tree/redis-subscriber) and cd to that directory and run this command. It will create containers on your docker desktop for redis server and the subscriber application.

```sh
npm start
```


#### Sidebar: Authentication with your Viya Server

This mcp server cli works similar to SAS supplied sas-viya cli commands. Use the following command to create the necessary token and refresh token. You need to do this once every 90 days or whenever the refresh token expires.

`create a default auth Profile`. 
Issue this command and follow instruction: `sas-viya profile init`

`create token` 
Issue this command and follow the instructions: `sas-viya auth loginCode`


### Issuing prompts

Use the copilot prompt area to issue prompts. To learn about each tool
issue this prompt

```txt
how do I use <some tool name>
```

---

## Tools

---

These are sample tools. Use them as a guide for your own tools or use them as is.

### Simple tool

- devascore - calculates a special score given two numbers. This is useful for testing the mcp server

### Data related tools

- findLibrary - check if specified library exists
- listLibrary - list available libraries in cas or sas
- findTable   - check if specified table  exists in specified library in cas or sas
- listTables  - list tables in a specified library in cas or sas
- readTable   - read records from a cas or sas table
- searchAsset - an experimental tool using SAS/Catalog

### Scoring with Models in MAS

- findModel  - check if specified model exists in MAS server
- listModels - list models published to MAS
- modelInfo  - display the input and output variables for a specified model
- modelScore - score using the seleced model

### Scoring with SCR

- scrInfo  - display the input and output variables for a specified SCR instance
- scrScore - score using the specified SCR instance


### Scoring with SAS code
- superstat - an example of accessing custom SAS code

---
## Persisting the scores
---

The default app is setup to publish the results to Viya using mcp/redis. The description below is for the demo application.



### Step 2: Start the redis database and subscriber

See the folder redis. 

Run this command to start redis database and subscriber. Change the CAS_LIB and CAS_TABLE to your master table.

```sh
npm run redissub
```


### Step 3: Create the master table

Run this command to use the default master table. This code will vary based on your application.

```sh
npm run setup

```

---
## Adding new tools
---

- Add a file to the toolSet folder
    - Use one of the files in this folder as a guide
    - Use toolhelpers folder for the function code(recommended)
- Add the new file to the index.js file in toolSet folder
- Restart the mcp server

---

## Notes

---

This demo server is "stateless" - it does not cache any values, including any Viya sessions the tools might have created. In a production system the designer has to make decisions on what needs to be cached and the implications of such caching.

The implication of this design choice is felt most when the tool needs to create a compute session - the requests will take longer than when the compute session is cached.

### Useful links

- [Documentation on modelcontextprotocol(mcp)](https://modelcontextprotocol.io/introduction)

- [mcp sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)

