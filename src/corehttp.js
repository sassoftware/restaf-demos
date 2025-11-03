/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import express from "express";

import https from "https";
import cors from "cors";
//import rateLimit from "express-rate-limit";
import helmet from "helmet";
import bodyParser from "body-parser";
import selfsigned from "selfsigned";
import getOpts from "./toolhelpers/getOpts.js";
import fs from "fs";
import createHttpTransport from "./createHttpTransport.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { randomUUID } from "node:crypto";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
// setup express server

async function corehttp(cache, currentAppEnvContext) {
  // setup for change to persistence session
  let headerCache = {};

  const app = express();

  app.use(express.json({ limit: "50mb" }));
  app.use(
    cors({
      origin: "*",
      credentials: false,
      exposedHeaders: ["mcp-session-id"],
      allowedHeaders: [
        "Accept",
        "Authorization",
        "Content-Type",
        "If-None-Match",
        "Accept-language",
        "mcp-session-id",
      ],
    })
  );
  // app.use(helmet());
  app.use(bodyParser.json({ limit: process.env.JSON_LIMIT ?? "50mb" }));

  // setup routes
  app.get("/health", (req, res) => {
    console.error("Received request for health endpoint");

    res.json({
      name: "@sassoftware/mcp-server",
      version: "1.0.0",
      description: "SAS Viya Sample MCP Server",
      endpoints: {
        mcp: "/mcp",
        health: "/health",
      },
      usage:
        "Use with MCP Inspector or compatible MCP clients like vscode or your own MCP client",
    });
  });

  // Root endpoint info

  app.get("/", (req, res) => {
    res.json({
      name: "SAS Viya Sample MCP Server",
      version: "1.0.0",
      description: "SAS Viya Sample MCP Server",
      endpoints: {
        mcp: "/mcp",
        health: "/health",
      },
      usage: "Use with MCP Inspector or compatible MCP clients",
    });
  });

  app.get("/apiMeta", (req, res) => {
    let spec = fs.readFileSync("./openApi.json", "utf8");
    let specJson = JSON.parse(spec);
    res.json(specJson);
  });

  // handle processing of information in header.
  function requireBearer(req, res, next) {
    debugger;

    // Ensure appEnv is always a valid objec

    let headerCache = {};
    if (req.header("X-VIYA-SERVER") != null) {
      console.error("[Note] Using user supplied VIYA server");
      headerCache.VIYA_SERVER = req.header("X-VIYA-SERVER");
    }
    const hdr = req.header("Authorization");
    if (hdr != null) {
      headerCache.bearerToken = hdr.slice(7);
      headerCache.AUTHFLOW = "bearer";
    }
    const hdr2 = req.header("X-REFRESH-TOKEN");
    if (hdr2 != null) {
      headerCache.refreshToken = hdr2;
      headerCache.AUTHFLOW = "refresh";
    }
    console.error("Header cache in requireBearer:", headerCache);
    next();
  }

  //handle get and delete requests
  async function handleGetDelete(req, res) {
    let sessionId = req.headers["mcp-session-id"];
    if (!sessionId || cache.get("transports")[sessionId] == null) {
      res.status(400).send("Invalid or missing session ID");
      return;
    }
    let transport = cache.get("transports")[sessionId];
    await transport.handleRequest(req, res);
  }

  // handle mcp post requests
  const handleRequest = async (req, res) => {
    debugger;
    let _appContext;
    let transports = cache.get("transports");
    let transport;
    try {
      debugger;
      let sessionId = req.headers["mcp-session-id"];
      console.error("MCP session id:", sessionId);

      // protecting against invalid session ids

      if (sessionId != null) {
        if (
          cache.has(sessionId) == null ||
          cache.get("transports")[sessionId] == null ||
          cache.get(sessionId) == null
        ) {
          console.error(
            "[ERROR] Invalid session id. ",
            sessionId
          );
          console.error(`[ERROR] Ignoring the session id`);
          res.status(400).json({
            jsonrpc: "2.0",
            error: {
              code: -32000,
              message: `Bad Request: session ID ${sessionId} not found`,
            },
            id: null,
          });
          return;
        }
      }

      console.log("handleRequest: MCP session id:", sessionId);
      if (sessionId != null) {
        /* existing transport */
        let transport = transports[sessionId];
        _appContext = cache.get(sessionId);
        currentAppEnvContext.current = _appContext; // update current app context
        await transport.handleRequest(req, res, req.body);

        /* New transport */
      } else {
        /* new transport */
        // create a new transport id
        debugger;
        console.error("Creating new transport for session");

        // create transport
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sessionId) => {
            // Store the transport by session ID
            transports[sessionId] = transport;
          },
        });

        // on transport close, clean up cache
        transport.onclose = () => {
          console.error(
            "[Note] Closing transport and cleaning up session data",
            transport.sessionId
          );
          debugger;
          if (transport.sessionId) {
            cache.delete(transport.sessionId);
            let transports = cache.get("transports");
            // delete appenv for this sessoion
            cache.delete(transport.sessionId);
            //remove from transports list
            delete transports[transport.sessionId];

            cache.set("transports", transports);
            console.error(
              `Transport closed and cleaned up for session: ${transport.sessionId}`
            );
          }
        };

        // connect tansport to the mcp server
        let mcpServer = cache.get("mcpServer");
        await mcpServer.connect(transport);

        // clone the template app context and update with header info
        let _appContext = Object.assign({}, cache.get("appEnvTemplate"));
        _appContext = Object.assign(_appContext, headerCache);

        // set the app context for this session
        // used in the toolhelpers
        currentAppEnvContext.current = _appContext; // update current app context

        /*********************************** */
        await transport.handleRequest(req, res, req.body);
        /*********************************** */
        debugger;
        let newSessionId = transport.sessionId;

        //Save the context for this session id
        _appContext.mcpSessionId = newSessionId;
        cache.set(newSessionId, _appContext);
        cache.set("transports", transports);

        // save transport in cache
        /*
        let tranportsList = cache.get("transports");
        tranportsList[newSessionId] = transport;
        cache.set("transports", tranportsList);
        */

        debugger;
        // trying to decide which is better

        // update session cache
      }
    } catch (error) {
      console.error("Error handling MCP request:", error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: {
            code: -32603,
            message: JSON.stringify(error),
          },
          id: null,
        });
      }
      return;
    }

    debugger;
  };

  app.options("/mcp", (_, res) => res.sendStatus(204));
  app.post("/mcp", requireBearer, handleRequest);
  app.get("/mcp", requireBearer, handleRequest);
  app.get("/mcp", requireBearer, handleGetDelete);

  // Start the server
  let appEnvBase = cache.get("appEnvBase");
  debugger;
  const PORT = appEnvBase.PORT;

  // get user specified TLS options
  let appServer;

  // get TLS options
  if (appEnvBase.HTTPS === true) {
    appEnvBase.tls = getOpts(appEnvBase);
    if (appEnvBase.tls == null) {
      appEnvBase.tls = await getTls();
      appEnvBase.tls.requestCert = false;
      appEnvBase.tls.rejectUnauthorized = false;
    }
    cache.set("appEnvBase", appEnvBase);

    console.error(`[Note] MCP Server listening on port ${PORT}`);
    console.error(
      "[Note] Visit https://localhost:8080/health for health check"
    );
    console.error(
      "[Note] Configure your mcp host to use https://localhost:8080/mcp to interact with the MCP server"
    );
    console.error("[Note] Press Ctrl+C to stop the server");

    appServer = https.createServer(appEnvBase.tls, app);
    appServer.listen(PORT, "0.0.0.0", () => {});
  } else {
    console.error(`[Note] MCP Server listening on port ${PORT}`);
    console.error("[Note] Visit http://localhost:8080/health for health check");
    console.error(
      "[Note] Configure your mcp host to use http://localhost:8080/mcp to interact with the MCP server"
    );
    console.error("[Note] Press Ctrl+C to stop the server");

    let appServer = app.listen(PORT, "0.0.0.0", () => {
      console.error(
        `[Note] Express server successfully bound to 0.0.0.0:${PORT}`
      );
      console.error(
        `[Note] Server address: ${appServer.address()?.address}:${
          appServer.address()?.port
        }`
      );
    });
  }
  process.on("SIGTERM", () => {
    console.error("Server closed");
    if (appServer != null) {
      appServer.close(() => {});
    }
    process.exit(0);
  });
  process.on("SIGINT", () => {
    console.error("Server closed");
    if (appServer != null) {
      appServer.close(() => {});
    }
    process.exit(0);
  });

  async function getTls() {
    let tlscreate =
      appEnv.TLS_CREATE == null
        ? "TLS_CREATE=C:US,ST:NC,L:Cary,O:SAS Institute,OU:STO,CN:localhost,ALT:na.sas.com"
        : appEnv.TLS_CREATE;
    let subjt = tlscreate.replaceAll('"', "").trim();
    let subj = subjt.split(",");

    let d = {};
    subj.map((c) => {
      let r = c.split(":");
      d[r[0]] = r[1];
      return { value: r[1] };
    });

    let attr = [
      {
        name: "commonName",
        value: d.CN,
      },
      {
        name: "countryName",
        value: d.C,
      },
      {
        shortName: "ST",
        value: d.ST,
      },
      {
        name: "localityName",
        value: d.L,
      },
      {
        name: "organizationName",
        value: d.O,
      },
      {
        shortName: "OU",
        value: d.OU,
      },
    ];

    let pems = selfsigned.generate(attr);
    // selfsigned generates a new keypair
    let tls = {
      cert: pems.cert,
      key: pems.private,
    };
    console.error("Generated self-signed TLS certificate");
    return tls;
  }
}

export default corehttp;
