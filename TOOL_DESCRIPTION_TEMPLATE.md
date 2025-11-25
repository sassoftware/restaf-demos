# Tool Description Template

This template standardizes how all tool descriptions should be written in the MCP Server project. Every tool should follow this structure.

## Template Format

```javascript
function toolName(_appContext) {
  let description = `
## toolName — brief one-line description

LLM Invocation Guidance (When to use)
Use THIS tool when:
- User request example 1
- User request example 2
- User request example 3

Do NOT use this tool for:
- When to use tool X instead
- When to use tool Y instead
- Common misconceptions

Purpose
Clear explanation of what this tool does and why someone would use it. Can be 1-3 sentences.

Parameters
[If tool has no required parameters, state "This tool requires no parameters."]
- paramName (type, default value): Description of what this parameter does and any constraints.
- anotherParam (type): Required parameter. Description of what it does.

Response Contract
Describe the format and structure of the response. Include:
- The top-level structure (object, array, etc.)
- Key fields in the response
- Possible error conditions
- Example response structure

Disambiguation & Clarification
- If user says "X" but might mean "Y" → clarify with: "Did you mean...?"
- If parameter is ambiguous → explain how to handle missing/unclear values
- List common confusion points with other similar tools

Examples (→ mapped params)
Real-world examples showing user input and how parameters map:
- "user request example 1" → { param1: "value", param2: 10 }
- "user request example 2" → { param1: "value" }

Negative Examples (should NOT call toolName)
- "user request that should use tool X" (use toolX instead)
- "another incorrect usage" (use toolY instead)

Related Tools
Link to other tools in the workflow:
- First step: listSomething or findSomething
- Get details: infoTool or detailTool
- Take action: actionTool or executeTool
`;

  let spec = {
    name: 'toolName',
    description: description,
    schema: {
      'paramName': z.string(),
      'anotherParam': z.number().default(10)
    },
    required: ['paramName'],
    handler: async (params) => {
      let r = await _helperFunction(params);
      return r;
    }
  }

  return spec;
}

export default toolName;
```

## Section Guidelines

### LLM Invocation Guidance
- List 3-5 specific user request patterns that would trigger this tool
- Use quotes for actual user phrases: `"find model X"`, `"list models"`
- List 2-4 common misconceptions or tools to use instead
- Be explicit: "Use THIS tool when..." and "Do NOT use this tool for..."

### Purpose
- 1-3 sentences maximum
- Explain the business value, not just the mechanics
- Can reference other tools if relevant

### Parameters
- **Format**: `paramName (type, default): description`
- Include all parameters (required and optional)
- Specify defaults clearly
- Add constraints if applicable: `(1-100)`, `(required)`, `(optional)`, `(read-only)`
- Be specific about what values are valid

### Response Contract
- Describe JSON structure the LLM will receive
- Include key field names and their types
- Mention empty/null cases
- If applicable, show example response

### Disambiguation & Clarification
- Format as bullet points with possible user input and clarification
- Include exact clarification question to ask (in quotes)
- Mention edge cases

### Examples
- Format as: `"user phrase" → { param: "value" }`
- Show 3-5 real-world examples
- Include examples with different parameter combinations
- Must demonstrate parameter mapping clearly

### Negative Examples
- Format as: `"incorrect user request" (use toolX instead)`
- Show 2-3 common mistakes
- Always specify which tool to use instead

### Related Tools
- Show workflow chains: listThing → findThing → infoThing → actionThing
- Mention which tools come before/after in typical usage

## Tone & Style Guidelines

1. **Be specific**: Use actual examples and parameter values, not abstractions
2. **Be explicit**: Say "Use THIS tool when" not "Can be used when"
3. **Be practical**: Focus on when/how LLMs should invoke the tool
4. **Be complete**: Include all parameters and all guidance sections
5. **Be concise**: Keep descriptions focused and avoid redundancy

## Validation Checklist

Before marking a tool as conforming to the template:

- [ ] Has "LLM Invocation Guidance" section with "Use THIS" and "Do NOT"
- [ ] Has "Purpose" section explaining what the tool does
- [ ] Has "Parameters" section documenting all params with types and defaults
- [ ] Has "Response Contract" describing the response format
- [ ] Has "Disambiguation & Clarification" section
- [ ] Has "Examples" section with 3+ real-world examples showing param mapping
- [ ] Has "Negative Examples" section with 2+ examples of what NOT to do
- [ ] Has "Related Tools" section showing workflow context (if applicable)
- [ ] Uses markdown formatting properly (## headers, - bullets, `code`)
- [ ] Consistent formatting across all sections

## Tools Updated to Template

- [x] listModels.js - ✅ Already conforms
- [x] findModel.js - 🔧 Needs cleanup (remove redundancy)
- [ ] deval.js - 🔧 Needs major expansion
- [ ] devaScore.js - 🔧 Needs expansion
- [ ] setContext.js - 🔧 Needs expansion
- [ ] modelInfo.js - 🔧 Needs expansion
- [ ] readTable.js - ✅ Mostly conforms (minor tweaks)
- [ ] ... (other tools)
