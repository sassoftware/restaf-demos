cd push2acr
az acr login --name viyafseditcr
docker build --no-cache -t mcp-serverjs .
docker tag mcp-serverjs:latest viyafseditcr.azurecr.io/mcp-serverjs:alpha
docker push viyafseditcr.azurecr.io/mcp-serverjs:alpha

