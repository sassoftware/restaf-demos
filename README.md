# Samples of tools for@sassoftware/viya-assistantjs

These are sample AI assistants built with @sassoftware/viya-assistantjs.

## Examples

1. simpleTool.js - A tool that demonstrates the basic structure of a tool.
The tool
 is designed to respond with course information
 for some university named MyUniversity

2. listTables.js - This tool demonstrates calling SAS Viya using REST Api.
It also demonstrates how such applications can be written
with a few lines of code using 
[@sassoftware/restaf](https://sassoftware.github.io/restaf)

   - Key points
     - Builtin support to logon to Viya(thru configuration object)
     - Builtin support to create cas and compute sessions using ViyaOnDemand
     builtin function
     - The tool uses the restaflib to get a list of tables (cas or sas).
