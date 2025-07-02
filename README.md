# mcp-serverjs - A ModelContextProtocolServer(mcp) for Scoring with SAS Viya

MCP servers is one of the popular additions to the agentic-ai world. This repository shows that SAS developers can take advantage of this technology to deliver their solutions via a "chat".

The  mcp server  described here is designed for scoring with SAS Viya.  See below for the capabilities in the starter kit and how you can modify it for your own use.

The source code is the repository <https://github.com/sassoftware/restaf-demos/tree/mcp-serverjs>.
It is provided under the Apache-2.0 license.

---

## Using the default mcp server

---

Follow these basic steps to see how an mcp server can help you.

### Step 1: Start the mcp server

Issue this command from any shell on your desktop

> npx @sassoftware/mcp-serverjs@latest

Make sure that you have a node version >=22


### Step 2: Enable github copilot for the mcp server

Similar methodologies can be used with other mcp enabled copilots.
Go to the vscode settings and search for mcp. Then select Model Server Context Protocol. Edit its config json
Add the following to the list of mcp servers

```js
 "Viya-Models-MCP-Server": {
    "type": "http",
    "url": "http://localhost:8080/mcp"
 }
```
The name can be anything you like.
 
#### Sidebar: Authentication with your Viya Server

This mcp server cli works similar to SAS supplied sas-viya cli commands. Use the following command to create the necessary token and refresh token. You need to do this once every 90 days or whenever the refresh token expires.

`create a default auth Profile`. 
Issue this command and follow instruction: sas-viya profile init

`create token` 
Issue this command and follow the instructions: sas-viya auth loginCode


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

- listLibrary - list available libraries in cas or sas
- listTables - list tables in a specified library in cas or sas
- readTable - read records from a cas or sas table
- searchAsset - an experimental tool using SAS/Catalog

### Scoring with Models in MAS

- listModels - list models published to MAS
- modelInfo  - display the input and output variables for a specified model
- modelScore - score using the seleced model

### Scoring with SCR

- scrInfo - display the input and output variables for a specified SCR instance
- scrScore - score using the specified SCR instance


### Scoring with SAS code
- superstat - an example of accessing custom SAS code


---

## Enhancing or modifying the server

---

- Add a file to the toolSet folder
    - Use one of the files in this folder as a guide
- Add the new file to the index.js file in toolSet folder
- Restart the mcp server

---

## Notes

---

This demo server is "stateless" - it does not cache any values, including any Viya sessions the tools 
might have created.

In a production system the designer has to maka decisions on what needs to be cached and the implications of 
such caching.

The implication of this design choice is felt most when the tool needs to create a compute session - the requests will take longer than when the compute session is cached.

### Useful links

- [Documentation on modelcontextprotocol(mcp)](https://modelcontextprotocol.io/introduction)

- [mcp sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)

