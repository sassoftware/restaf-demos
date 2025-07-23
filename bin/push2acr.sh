cd ./test
az acr login --name viyafseditcr
docker build --no-cache -t mcpviyascoring .
docker tag mcpviyascoring:latest viyafseditcr.azurecr.io/mcpviyascoring:latest
docker push viyafseditcr.azurecr.io/mcpviyascoring:latest

