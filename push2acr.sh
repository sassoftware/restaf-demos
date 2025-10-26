
docker rm -f mcp-serverjs
docke  rmi mcp-serverjs
docker rm viyafseditcr.azurecr.io/mcp-serverjs:dev
docker rmi viyafseditcr.azurecr.io/mcp-serverjs:dev
docker rmi appbuilder
az acr login --name viyafseditcr
docker build --no-cache -t mcp-serverjs .
docker tag mcp-serverjs:latest viyafseditcr.azurecr.io/mcp-serverjs:dev
docker push viyafseditcr.azurecr.io/mcp-serverjs:dev

