#!/bin/bash
docker rm -f mcpviyascoring
docker rmi mcpviyascoring
docker build -f ./Dockerfile -t mcpviyascoring .
# docker run  --name mcpviyascoring -p 8080:8080 --mount type=bind,source="${PWD}"/tls,destination=/usr/src/app/tls mcpviyascoring
docker run  --name mcpviyascoring -p 8080:8080  mcpviyascoring
# when running in workbench replace the line below with "{PWD}"/app with the path to storage
