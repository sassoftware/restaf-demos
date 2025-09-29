#!/bin/bash
# placeholder - needs the following changes
# mount authentication info
# mount tls information
docker rm -f mcp-serverjs
docker rmi mcp-serverjs
docker build -f ./Dockerfile -t mcp-serverjs .
docker run  --env-file .env --name mcp-serverjs -p 8080:8080 mcp-serverjs

