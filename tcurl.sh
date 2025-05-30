curl -X POST http://localhost:3000/mcp -H "Content-Type: application/json" -H "Accept: application/json,text/event-stream" -d '{"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{"sampling":{},"roots":{"listChanged":true}},"clientInfo":{"name":"mcp-inspector","version":"0.13.0"}},"jsonrpc":"2.0","id":0}'

