#!/bin/bash
docker rm -f demomcp
docker rmi demomcp
docker build -f ./Dockerfile -t demomcp .
docker run  --env-file .env --name demomcp -p 8080:8080 demomcp

# when running in workbench replace the line below with "{PWD}"/app with the path to storage
