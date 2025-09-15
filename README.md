# mcp-serverjs - A ModelContextProtocolServer(mcp) for Scoring 

- [Introduction](#intro)
- [Supported Tools](#tools)
- [Modify/Add Tools](#add)
- [Enable Authentication](#auth)
- [Setting up the  mcp server](#defserver)
- [Enable client for mcp server](#enable)
- [Persising Scores](#persist)
- [Notes](#notes)
- [Useful Links](#links)


---

## Introduction<a name="intro"> </a>

---

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

## Tools<a name="tools"></a>

---

The tools are designed to address common scenarios. You can clone the repository and modify the toolset.


### Simple tool

- devascore - calculates a special score given two numbers. This is useful for testing the mcp server.

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
- runSAS - runs the sas code that is supplied by the user
- runMacro - runs a macro available to the server. User passes additional macro variables as name, value pairs.

---

## Adding/Modifying tools<a name="add"></a>

---

- Add a file to the toolSet folder
- Use one of the files in this folder as a guide
- Use toolhelpers folder for the function code(recommended)
- Add the new file to the index.js file in toolSet folder
- Restart the mcp server


---

## Enable authentication<a name="auth"></a>

---

This mcp server cli works similar to SAS supplied sas-viya cli commands. Use the following command to create the necessary token and refresh token.


`create a default auth Profile`. 
Issue this command and follow instruction: `sas-viya profile init`

`create token` 
Issue this command and follow the instructions: `sas-viya auth loginCode`

You need to do this once every 90 days or whenever the refresh token expires.

At this point the tools can make authenticated calls to SAS Viya

---

## Setting up the mcp server<a name="defserver"></a>

---

Follow these basic steps to see how an mcp server can help you.

Issue this command from any shell on your desktop

> npx @sassoftware/mcp-serverjs@latest envfile

Make sure that you have a node version >=22

`envfile`
If this is not specified, the server will try to read from .env file. 

The environment variables you can set are:

```text
##
# mcp server environment variables
#

## server specific settings
# By default the server will run in HTTP mode
HTTPS=FALSE

## TLS settings
# SSLCERT=<location of your SSL certificate>
# If not set, the cli will create a self-signed cerficate
# The directory must contain the files
# key.pem, crt.pem and optionally ca.pem

## if using self-signed certificate set this to 0
NODE_TLS_REJECT_UNAUTHORIZED=0

## Viya authentication settings
# sas-viya allows named profiles.
# set this to the profile you want to use or leave it blank to use the default profile.
# this is used to find the tokens for Viya
SAS_CLI_PROFILE=<profilename>


```

---

## Enable github copilot for the mcp server<a name="enable"> </a>

---

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




---
## Persisting the scores<a name="persist"> </a>
---

You can use many mcp servers to persist the scoring data. 
See this [repository](https://github.com/sassoftware/restaf-demos/tree/redis-subscriber) for an example of using mcp/redis to persist the scores in a CAS table.


---

## Notes

---

This demo server is "stateless" - it does not cache any values, including any Viya sessions the tools might have created. One advantages is that the session does not timeout.

In a production system the designer has to make decisions on what needs to be cached and the implications of such caching.

The implication of this design choice is felt most when the tool needs is creating compute session - the requests will take longer than when the compute session is cached.

---

### Useful links<a name="links"> </a>

---

- [Documentation on modelcontextprotocol(mcp)](https://modelcontextprotocol.io/introduction)

- [mcp sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)

- [restaf](https://sassoftware.github.io/restaf/)

- [mkcert](https://www.npmjs.com/package/mkcert)

