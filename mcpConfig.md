# MCP Configurations

## stdio

```json
{
  "mcpConfigs": {
    "sasmcp": {
      "type": "stdio",
      "command": "node",
      "args": ["c:\\ai-agents\\mcp-serverjs\\cli.js"],
      "env": {
        "LAB": "TRUE",
        "MCPTYPE": "stdio",
        "AUTHFLOW": "sascli",
        "SAS_CLI_PROFILE": "i58",
        "SAS_CLI_CONFIG": "c:\\Users\\kumar",
        "SSLCERT": "C:\\Users\\kumar\\AppData\\Local\\.tls",
        "VIYA_SERVER": "viya server if AUTHFLOW=password|token",
        "PASSWORD": "password if AUTHFLOW is password",
        "USERNAME": "username if AUTHFLOW is password",
        "CLIENTIDPW": "client password if AUTHFLOW is password",
        "CLIENTSECRETPW": "client id if AUTHFLOW is password",
        "TOKEN": "token if AUTHFLOW is token",
        "ENVFILE": "NONE",
        "AI_KEY": "fe881114b0ae4a0384efe684b1f3d768",
        "AI_MODEL": "assistant-demo-01",
        "AI_ENDPOINT": "https://sas-assistant-us2.openai.azure.com",
        "AI_PROVIDER": "azure"
      }
    }
  }
}
```
