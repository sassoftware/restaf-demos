#!/bin/bash
# placeholder - needs the following changes
# mount authentication info
# mount tls information
docker rm -f sasmcpserverjs
docker rmi sasmcpserverjs
docker build -f ./Dockerfile -t sasmcpserverjs .
docker run  --env-file .env --name sasmcpserverjs -p 8080:8080 sasmcpserverjs

