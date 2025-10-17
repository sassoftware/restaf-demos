#!/bin/bash
docker rm -f mcp-serverjs
docker rmi mcp-serverjs
docker build -f ./Dockerfile -t mcp-serverjs .
docker run  --name mcp-serverjs -p 8080:8080 --mount type=bind,source="${PWD}"/tls,destination=/usr/src/app/tls mcp-serverjs
# docker run  --name mcp-serverjs -p 8080:8080  mcp-serverjs

