# mcp-serverjs - A ModelContextProtocolServer(mcp) for Scoring

- [Target Audience](#target-audience)
- [Introduction](#introduction)
- [Configure mcp server](#configure-mcp-server)
  - [Configuration variables](#configuration-variables)
  - [stdio transport](#stdio-transport)
  - [http transport](#http-transport)
- [Enable Authentication](#enable-authentication)
  - [sas-viya cli](#sas-viya-cli)
  - [Password](#password)
  - [Custom Token](#custom-token)
- [Supported Tools](../sasmcp_tools_guide.md)
- [Modify/Add Tools](../sas_developer_guide.md)
- [Notes](#notes)
- [Useful Links](#useful-links)
- [Other useful tips](#other-useful-tips)

---

## Target Audience

### SAS Developers

SAS developers who want to leverage agentic AI technologies to deliver their SAS based solutions via a "chat" interface.
There are no additional skill sets required to use the mcp server

### Application Developers

The source code is available to application developers to add their own tools or build their own mcp server 

The source code available with Apache-2.0 license.

---

## Introduction

---

MCP servers is one of the popular additions to the agentic-ai world. This repository shows that SAS developers can take advantage of this technology to deliver their solutions via a "chat".

The  mcp server  described here is designed for scoring with SAS Viya. In this document "scoring" is used to describe executing any code that takes some input and returns results.

Some examples are:

- models created with SAS solutions like Model Studio, Intelligent Decisioning etc...
- user written SAS program, SAS Studio Flow, job Definitions etc. using SAS Studio or other interfaces
- functions that call SAS products using REST API to get results

  See below for the capabilities in the starter kit and how you can modify it for your own use.

The source code is the repository [restaf-demos](https://github.com/sassoftware/restaf-demos/tree/mcp-serverjs).
It is provided under the Apache-2.0 license.

> Note: This server is designed to run locally on the client.  A remote server implementation is coming soon.

---

## Configure mcp server

---

Similar methodologies can be used with other mcp enabled clients(ex: Claude Desktop, OpenAI desktop, etc...)
Go to the vscode settings and search for mcp. Then select Model Server Context Protocol. Edit its config json

### Configuration variables

Typically these are set either in the .env file or as environment variables(or both)

```env

# Indicate what type of transport(stdio|http)
# http is useful for remote mcp servers
# If running locally, recommend stdio

MCPTYPE=http

# Port for http transport(default is 8080)
# and is running on localhost
# Set it to your choice of port

PORT=8080
# If transport of http, optionally specify if the server
# is using http or https

HTTPS=FALSE

# VIYA_SERVER

VIYA_SERVER= your Viya server url

# Viya Authentication
# The mcp server support different ways to authenticate(see section on Authentication)

# - sascli - will look for tokens created with sas-viya cli
# - token - a custom token
# - password - userid/password 

TOKENFILE=
SAS_CLI_CONFIG=your-home-directory
SAS_CLI_PROFILE=your-sas-cli-profile


# This is for the mcp server app.
# this is a folder. All files in that folder will be loaded
# and used in the TLS connection
# If not set, it will create a self-signed certificate
SSLCERT=<some folder>
TLS_CREATE="C:US,ST:NC,L:Cary,O:SAS Institute,OU:STO,CN:localhost"


# This is certificate for Viya server connection from MCP server
# Used in restaf (ultimately axios and fetch)
# this is a folder. All files in that folder will be loaded
# and used in the TLS connection
# if not set, no ssl certificates will be used
VIYASSL=<some folder>

# SAS Contexts
# Defaults are:
#   COMPUTECONTEXT=SAS Job Execution compute context
#   CASSERVER=cas-shared-default

COMPUTECONTEXT=
CASSERVER=


```

---

## Enable Authentication

---

The server supports multiple ways to authenticate.


### sas-viya cli

> To use this set AUTHFLOW=sascli

This mcp server cli works similar to SAS supplied sas-viya cli commands. Use the following command to create the necessary token and refresh token.

`create a default auth Profile`.
Issue this command and follow instruction: `sas-viya profile init`

`create token`
Issue this command and follow the instructions: `sas-viya auth loginCode`

You need to do this once every 90 days or whenever the refresh token expires.

At this point the tools can make authenticated calls to SAS Viya


### Custom token

> Set the env TOKENFILE to a file containing the token

There seems to be a pattern of using a long-lived token. If this is your use-case set the TOKENFILE to a file containing this token.


### Password

Ths requires additional setup. 

- Create a clientid and client password for Oauth password flow.
- Set these in the .env file or the mcp configuration file


---

Add the following to the list of mcp servers

### stdio transport

This is ideal for running mcp servers locally. Most clients will autostart the mcp server for you. 

```json
  "sasmcp: {
    "type": "stdio",
    "command": "npx",
    "args": [
      "@sassoftware/mcp-serverjs@latest",
    ],
    "env": {
      "MCPTYPE": "stdio",
      "AUTHFLOW": "sascli",  // sascli|password|token
      "SAS_CLI_PROFILE": "cli profile name or Default",
      "SAS_CLI_CONFIG":"where sas-cli stores authentication information",
      "SSLCERT": "where you have stored the tls information(see below)",
      "VIYA_SERVER": "viya server if AUTHFLOW=password|token|refresh",
      "PASSWORD": "password if AUTHFLOW is password",
      "USERNAME": "username if AUTHFLOW is password",
      "CLIENTIDPW": "client password if AUTHFLOW is password",
      "CLIENTSECRETPW": "client id if AUTHFLOW is password",
      "TOKENFILE": "folder for custom token"
    }
  }

```

### http transport

This is an alternate to using stdio. This requires the .env file. It also requires the mcp server to be running (see step 2)

> Remote mcp servers: This is under development

`Step 1: Configure the mcp client for localhost`

The mcp configuration is show below

```json
 "sasmcp": {
    "type": "http",
    "url": "http(s)//localhost:8080/mcp"``
 }
```

Use https if the environment variables HTTPS=TRUE


`Step 2: Start the mcp server`

```sh
npx @sassoftware/mcp-serverjs@latest
```

Make sure that the .env file is in the current working directory


---

## Notes

---

- This server creates a single mcp server for both stdio and http transport protocol.

- If using http transport protocol, it caches information for each session id(user)
  - However cas and compute sessions are not cached in this release(TBD). The implication of this design choice is felt most when the tool needs is creating compute session - the requests will take longer than when the compute session is cached.

---

## Useful links

---

- [Documentation on modelcontextprotocol(mcp)](https://modelcontextprotocol.io/introduction)

- [mcp sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)

- [restaf](https://sassoftware.github.io/restaf/)

- [mkcert](https://www.npmjs.com/package/mkcert)

- [SAS tokens](https://communities.sas.com/t5/SAS-Communities-Library/SAS-Viya-CLI-Token-Expiry/ta-p/848183)

- Also see <https://communities.sas.com> for articles on using mcp servers with SAS Viya

    


## Other useful tips

### Claude Desktop

Use the stdio transport. Check their documentation for details.

  In my limited experience, the copilot works better if Claude Desktop starts the mcp server. To achieve this I set the following in session.json:  

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
mkcert -key-file key.pem -cert-file crt.pem localhost 127:0.0.1 ::1
```

One last step for windows nodejs users. Add this to the environment variable NODE_EXTRA_CA_CERTS

```text
NODE_EXTRA_CA_CERTS=c:\Users\<your_username>\AppData\Local\mkcert\rootCA.pem
```

---

