# A nodejs starter library to help SAS users build ASSISTANTS

> Works with openai Assistant api and azureai Assistant api

## What is the ASSISTANT?

The explanation is from
<https://platform.openai.com/docs/assistants/overview?context=with-streaming>

The Assistants API allows you to build AI assistants within your own
applications.

An Assistant has instructions and can leverage models, tools,
and knowledge to respond to user queries. The Assistants API currently supports
three types of tools: Code Interpreter, Retrieval, and Function calling.

You can explore the capabilities of the Assistants API using the
Assistants playground or by building a step-by-step integration application

*Overview*
A typical integration of the Assistants API has the following flow:

Create an Assistant by defining its custom instructions and picking a model.
If helpful, add files and enable tools like Code Interpreter, Retrieval, and
Function calling.

1. Create a Thread when a user starts a conversation.
2. Add Messages to the Thread as the user asks questions.
3. Run the Assistant on the Thread to generate a response by calling the model
 and the tools.

## Why use Assistant API?

1. The conversation thread is maintained by the system.
2. The code interpreter tool can generate and run python code
3. The retrieval tool works with files that have been uploaded
   and attached to an instance of the assistant.
   I think of it as an easy way to create a RAG.

  a. Note: Unfortunately I have not been able to find a version on azureai
  that supports retrieval. Hopefully this will be resolved soon.(https://github.com/Azure/azure-sdk-for-js/issues/28550)

## @sassoftware/viya-assistantjs

@sassoftware/viya-assistantjs is a JavaScript library(esm) with the following
key features

1. Write your first assistant in a few minutes.
2. Supports both openai Assistant and azureai Assistant.
3. Uses the azureai API pattern to support openai Assistant.
This allows switching between the two with simple configuration changes.
4. It comes with a builtin tools for integration with Viya
    - listing reports, librefs
    - listing tables in a specified library
    - retrieving data from a specified table
5. Append to/or replace the builtin tools with your own tools
6. Run the library in nodejs or browser enviroment - usually a react application
7. Comes with documentation to make the journey less painful

## Usage Notes

Please refer to the documentation and tutorials
for details on using this library
See the gettingStarted tutorial to begin programming.
