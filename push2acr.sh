#
# syntax: push2acr.sh <tag>
#
docker rmi mcp-serverjs
az acr login --name viyafseditcr
docker build --no-cache -t mcp-serverjs .
docker tag mcp-serverjs:latest viyafseditcr.azurecr.io/mcp-serverjs:$1
docker push viyafseditcr.azurecr.io/mcp-serverjs:$1

