/*
 * Copyright © 2025, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import express from "express";

import createMcpServer from "./createMcpServer.js";
import https from "https";
import cors from "cors";
//import rateLimit from "express-rate-limit";
import helmet from "helmet";
import bodyParser from "body-parser";
//import { Request, Response, NextFunction } from 'express';
import selfsigned from "selfsigned";
import getOpts from "./toolhelpers/getOpts.js";
import fs from "fs";


// setup express server

async function corehttp(cache) {
  // setup for change to persistence session

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
  app.use(helmet());
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
    let sessionId = req.headers["mcp-session-id"];
    let appEnv = (sessionId == null) ? cache.get('appEnvBase') : cache.get(sessionId);
    // Ensure appEnv is always a valid object


    if (req.header("X-VIYA-SERVER") != null) {
      console.error("[Note] Using user supplied VIYA server");
      appEnv.VIYA_SERVER = req.header("X-VIYA-SERVER");
    }
    const hdr = req.header("Authorization");
    if (hdr != null) {
      appEnv.bearerToken = hdr.slice(7);
      appEnv.AUTHFLOW = "bearer";
    }
    const hdr2 = req.header("X-REFRESH-TOKEN");
    if (hdr2 != null) {
      appEnv.refreshToken = hdr2;
      appEnv.AUTHFLOW = "refresh";
    }
    // save updated appEnv back to cache
    let sesid = (sessionId == null) ? 'AppEnvBase' : sessionId;
    console.error("Storing appEnv for session id in requireBearer:", sesid); 
    cache.set(sesid, appEnv);
    console.error("Updated appEnv:", cache.get(sesid));
    next();
  }

  // Handle requests made to the /mcp endpoint
  const handleRequest = async (req, res) => {
    let _appContext;
    try {
      let sessionId = req.headers["mcp-session-id"];
      console.error("MCP session id:", sessionId);
      if (sessionId && cache[sessionId] != null ) {
        _appContext = cache.get(sessionId);
        console.error("Using existing transport for session ", sessionId);
      } else {
        // create a new transport
        console.error("Creating new transport for session");
        debugger;
        _appContext = await createMcpServer(cache);
        debugger;
      }
    } catch (error) {
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
    if (!_appContext || !_appContext.transport || typeof _appContext.transport.handleRequest !== 'function') {
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: {
            code: -32603,
            message: "MCP server transport is not initialized properly.",
          },
          id: null,
        });
      }
      return;
    }
    console.error("Handling MCP request");
    debugger;
    await _appContext.transport.handleRequest(req, res, req.body);
  };
  app.options("/mcp", (_, res) => res.sendStatus(204));
  app.post("/mcp", requireBearer, handleRequest);
  app.get("/mcp", requireBearer, handleRequest);

  // Start the server
  let appEnvBase =  cache.get("appEnvBase");
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
