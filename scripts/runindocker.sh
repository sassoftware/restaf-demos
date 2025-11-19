docker rm -f mcp-serverjs
docker run --name mcp-serverjs  -p 8080:8080 \
  -e AUTHFLOW=token \
  -e VIYA_SERVER=$VIYA_SERVER \
  -e HTTPS=FALSE \
  -e PORT=8080 \
  -e ENVFILE=NONE \
  -e NODE_TLS_REJECT_UNAUTHORIZED=0 \
  mcp-serverjs:latest