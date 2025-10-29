
# docker rm -f mcp-serverjs
docker  rmi mcp-serverjs
# docker rm viyafseditcr.azurecr.io/mcp-serverjs:$1
docker rmi viyafseditcr.azurecr.io/mcp-serverjs:$1
docker rmi appbuilder
az acr login --name viyafseditcr
docker build --no-cache -t mcp-serverjs .
docker tag mcp-serverjs:latest viyafseditcr.azurecr.io/mcp-serverjs:$1
docker push viyafseditcr.azurecr.io/mcp-serverjs:$1