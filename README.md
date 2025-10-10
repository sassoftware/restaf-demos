# mcp-serverjs - A ModelContextProtocolServer(mcp) for Scoring

- [Introduction](#intro)
- [Supported Tools](#tools)
- [Modify/Add Tools](#add)
- [Enable Authentication](#auth)
- [Enable client for mcp server](#enable)
  - [stdio](#stdio)
  - [http](#http)
- [Persising Scores](#persist)
- [Notes](#notes)
- [Useful Links](#links)

---

## Introduction <a name="intro"> </a>

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

## tools <a name="tools"></a>

---

The tools are designed to address common scenarios. You can clone the repository and modify the toolset.

### Simple tool

- devascore - calculates a special score given two numbers. This is useful for testing the mcp server.

### Data related tools

- findLibrary   - check if specified library exists
- listLibraries - list available libraries in cas or sas
- findTable     - check if specified table  exists in specified library in cas or sas
- listTables  - list tables in a specified library in cas or sas
- readTable   - read records from a cas or sas table

### Scoring with Models in MAS

- findModel  - check if specified model exists in MAS server
- listModels - list models published to MAS
- modelInfo  - display the input and output variables for a specified model
- modelScore - score using the seleced model

### Scoring with SCR

- scrInfo  - display the input and output variables for a specified SCR instance
- scrScore - score using the specified SCR instance

### Scoring with SAS code

- superstat - an example of accessing custom SAS code - mainly for testing
- program - runs the sas code that is supplied by the user
- macro  - runs a macro available to the server. User passes additional macro variables as name, value pairs.
- job - run a job 
- jobdef - use a job definition to run sas code

---

## modify or add tools <a name="add"></a>

---

- Add a file to the toolSet folder
- Use one of the files in this folder as a guide
- Use toolhelpers folder for the function code(recommended)
- Add the new file to the index.js file in toolSet folder
- Restart the mcp server

---

## Enable Authentication <a name="auth"></a>

The server supports multiple ways to authenticate.

---

### Using token created with sas-cli

This mcp server cli works similar to SAS supplied sas-viya cli commands. Use the following command to create the necessary token and refresh token.

`create a default auth Profile`.
Issue this command and follow instruction: `sas-viya profile init`

`create token`
Issue this command and follow the instructions: `sas-viya auth loginCode`

You need to do this once every 90 days or whenever the refresh token expires.

At this point the tools can make authenticated calls to SAS Viya


---

### Passing token
In some cases you might have a token. Set the value in the .env file or in the mcp configuration.

### Password

Ths requires additional setup.

- Create a clientid and clientpassword for Oauth password flow.
- Set these in the .env file or the mcp configuration file.

## Enable client for mcp server <a name="enable"> </a>

---

Similar methodologies can be used with other mcp enabled copilots(ex: Claude Desktopm OpenAI desktop, etc...)
Go to the vscode settings and search for mcp. Then select Model Server Context Protocol. Edit its config json
Add the following to the list of mcp servers


### stdio <a name="stdio"></a>
This is ideal for running mcp servers locally.  

```json
  "sasmcpio": {
    "type": "stdio",
    "command": "npx",
    "args": [
      "@sassoftware/mcp-serverjs@alpha",
    ],
    "env": {
      "MCPTYPE": "stdio",
      "AUTHFLOW": "sascli",
      "SAS_CLI_PROFILE": "cli profile name or default",
      "SAS_CLI_CONFIG":"where sas-cli stores authentication information",
      "SSLCERT": "where you have stored the tls information(see below)",
      "VIYA_SERVER": "viya server if AUTHFLOW=password|token",
      "PASSWORD": "password if AUTHFLOW is password",
      "USERNAME": "username if AUTHFLOW is password",
      "CLIENTIDPW": "client password if AUTHFLOW is password",
      "CLIENTSECRETPW": "client id if AUTHFLOW is password",
      "TOKEN": "token if AUTHFLOW is token",
      "ENVFILE": "NONE"
    }
  }
```

```text
 The SSLCERT should be a folder that has the following files:

 - key.pem
 - crt.pem
 - ca.pem

 ```

### http <a name="http"></a>

This is an alternate to using stdio. This requires a .env file

### Start the mcp server

The mcp configuration is show below

```json
 "sasmcp": {
    "type": "http",
    "url": "http://localhost:8080/mcp"
 }
```

Then create a .env file that looks like this(with place holders replaced with actual values).

```env

This is for the 'http' case. 

The environment variables you can set are:

```env
##
# mcp server environment variables
#

## server specific settings
# By default the server will run in HTTP mode
HTTPS=FALSE

## TLS settings
# SSLCERT=<location of your SSL certificate>
# The directory must contain the files key.pem and crt.pem and optionally ca.pem
# This is used by the mcp server and in calls to SAS Via

## If using self-signed certificate set this to 0
NODE_TLS_REJECT_UNAUTHORIZED=0

## Viya authentication settings

## Valid values for AUTHFLOW are: sascli, password, token
AUTHFLOW=sascli

## sas-viya allows named profiles.
## set this to the profile you want to use or leave it blank to use the default profile.
## this is used to find the tokens for Viya

# replace i58 with your profile name
SAS_CLI_PROFILE=i58
# replace with the location where sas-cli stores authentication information
SAS_CLI_CONFIG=c:\Users\kumar

## Needed for the AUTHFLOW=password|token
VIYA_SERVER=<your Viya Server URL>

## Password authentication settings
PASSWORD=yourpassword
USERNAME=yourusername
CLIENTIDPW=your password clientid
CLIENTSECRETPW=your password clientsecret


## TOKEN authentication settings
# Useful for cases where you want to use a token directly

TOKEN=yourtoken


```

### Start the mcp server

The final step is to start the mcp server

```sh
npx @sassoftware/mcp-serverjs@latest
```

---

## Persisting scores <a name="persist"> </a>

---

You can use many mcp servers to persist the scoring data. 
See this [repository](https://github.com/sassoftware/restaf-demos/tree/redis-subscriber) for an example of using mcp/redis to persist the scores in a CAS table.

---

## Notes <a name="notes"></a>

---

This demo server is "stateless" - it does not cache any values, including any Viya sessions the tools might have created. One advantages is that the session does not timeout.

In a production system the designer has to make decisions on what needs to be cached and the implications of such caching.

The implication of this design choice is felt most when the tool needs is creating compute session - the requests will take longer than when the compute session is cached.

---

## Useful links <a name="links"> </a>

---

- [Documentation on modelcontextprotocol(mcp)](https://modelcontextprotocol.io/introduction)

- [mcp sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)

- [restaf](https://sassoftware.github.io/restaf/)

- [mkcert](https://www.npmjs.com/package/mkcert)

## Other useful tips

### Vscode with Github Copilot

  In my limited experience, the copilot works better if VScode starts the mcp server. To achieve this I set the following in session.json:

MCP: AutoStart to onlyNew.

Warning: This is just my observation. Your mileage may vary.

### mkcert

To create a self-signed certificate for localhost

```sh
mkcert -install
```

The install also stores local root Certificate Authority (CA) on the system
For windows the location is AppData/Local\mkcert

Now go to the location where you want to store the certificates
Then create the certificates

```sh
mkcert --key key.pem --cert crt.pem localhost 127:0.0.1 ::1
```

One last step for windows nodejs users. Add this to the environment variable NODE_EXTRA_CA_CERTS

```text
NODE_EXTRA_CA_CERTS=c:\Users\<your_username>\AppData\Local\mkcert\rootCA.pem
```
