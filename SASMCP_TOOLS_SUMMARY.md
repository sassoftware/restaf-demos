# SAS MCP Tools Summary

## Overview

The SAS MCP (Model Context Protocol) Server provides **23 integrated tools** for interacting with SAS Viya environments. These tools enable natural language queries, data discovery, model scoring, job execution, and SAS code programming through a unified API.

---

## Tool Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SAS MCP Tools Ecosystem                              │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    DATA DISCOVERY & QUERY TOOLS                      │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │  listLibraries  │  findLibrary  │  listTables  │  findTable          │   │
│  │  tableInfo      │  readTable    │  sasQuery    │  gidb               │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                ↓                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                   MODEL & SCORING TOOLS                             │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │  listModels  │  findModel  │  modelInfo  │  modelScore              │   │
│  │  scrInfo     │  scrScore   │                                         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                ↓                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                   JOB EXECUTION TOOLS                               │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │  listJobs  │  findJob  │  job  │  jobDef                            │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                ↓                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                  CODE EXECUTION TOOLS                               │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │  program  │  runMacro                                               │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                ↓                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                   UTILITY TOOLS                                     │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │  deval      │  devaScore  │  searchAssets                           │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│                    ↓                                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │              SAS Viya Backend Services                              │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │  CAS (Cloud Analytic Services)  │  Compute Services                 │   │
│  │  Model Publishing Service       │  Job Execution Service            │   │
│  │  Model Aggregation Service      │  SCR (Score Code Runtime)          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Tool Categories & Detailed Reference

### 1. 📊 DATA DISCOVERY & QUERY TOOLS (8 tools)

#### **Library Management**
| Tool | Purpose | Parameters | Use Case |
|------|---------|-----------|----------|
| `listLibraries` | Enumerate CAS or SAS libraries | server (cas/sas), limit, start, where | "List all CAS libraries" |
| `findLibrary` | Locate a specific library | name, server | "Does SASHELP library exist?" |

#### **Table Management**
| Tool | Purpose | Parameters | Use Case |
|------|---------|-----------|----------|
| `listTables` | Show tables in a library | lib (required), server, limit, start | "List tables in Public" |
| `findTable` | Verify table existence | name (required), lib (required), server | "Check if cars table exists" |
| `tableInfo` | Get table metadata & schema | table (required), lib (required), server | "Describe table structure" |
| `readTable` | Read table data with filters | table, lib, server, where, limit, start, format | "Read 100 rows from cars" |

#### **Query Tools**
| Tool | Purpose | Parameters | Use Case |
|------|---------|-----------|----------|
| `sasQuery` | Execute SAS SQL queries | table (required), query (required), sql, job | "Custom SQL analysis" |
| `gidb` | Global business data queries | query (required), sql | "Analyze licensing/billing data" |

---

### 2. 🤖 MODEL & SCORING TOOLS (5 tools)

#### **Model Discovery & Metadata**
| Tool | Purpose | Parameters | Use Case |
|------|---------|-----------|----------|
| `listModels` | Browse published models | limit, start | "Show available models" |
| `findModel` | Locate specific model | name (required) | "Check if churn model exists" |
| `modelInfo` | Get model schema & variables | model (required) | "What inputs/outputs?" |

#### **Model Scoring**
| Tool | Purpose | Parameters | Use Case |
|------|---------|-----------|----------|
| `modelScore` | Score with MAS-published models | model (required), scenario, uflag | "Score customer for risk" |
| `scrScore` | Score via SCR endpoints | name (required), scenario | "Score via containerized model" |

#### **SCR (Score Code Runtime)**
| Tool | Purpose | Parameters | Use Case |
|------|---------|-----------|----------|
| `scrInfo` | Get SCR model schema | name (required) | "Model input/output structure" |

---

### 3. ⚙️ JOB EXECUTION TOOLS (4 tools)

| Tool | Purpose | Parameters | Use Case |
|------|---------|-----------|----------|
| `listJobs` | List available jobs | limit, start, where | "Browse job definitions" |
| `findJob` | Find specific job | name (required) | "Check if ETL job exists" |
| `job` | Execute a job | name (required), scenario | "Run data pipeline" |
| `jobDef` | Execute a job definition | name (required), scenario | "Run job with parameters" |

---

### 4. 💻 CODE EXECUTION TOOLS (2 tools)

| Tool | Purpose | Parameters | Use Case |
|------|---------|-----------|----------|
| `program` | Execute SAS code directly | src (required), folder, scenario, output, limit | "Run custom SAS program" |
| `runMacro` | Execute SAS macros | macro (required), scenario | "Call pre-defined SAS macro" |

---

### 5. 🛠️ UTILITY TOOLS (3 tools)

| Tool | Purpose | Parameters | Use Case |
|------|---------|-----------|----------|
| `deval` | Get environment variables | name (required) | "Retrieve config values" |
| `devaScore` | Compute Deva Score formula | a (required), b (required) | "(a + b) * 42 calculation" |
| `searchAssets` | Search for assets | query (required) | "Find resources by name" |

---

## Data Flow Patterns

### Pattern 1: Discovery → Read → Analyze
```
listLibraries → findLibrary → listTables → findTable → tableInfo → readTable
```
**Example**: "Find and read the IBM data"

### Pattern 2: Query-Based Analysis
```
sasQuery or gidb → (filter/aggregate/group) → Analysis Results
```
**Example**: "gidb where company begins with 'IBM' and group by site"

### Pattern 3: Model Scoring
```
listModels → findModel → modelInfo → modelScore → Results
```
**Example**: "Score customer for churn prediction"

### Pattern 4: Job Execution with Parameters
```
listJobs → findJob → job (with scenario params) → Results
```
**Example**: "Run ETL job with data=xyz"

### Pattern 5: Custom SAS Processing
```
program (direct code) or runMacro (macro invocation) → Results
```
**Example**: "Execute custom analysis program"

---

## Integration Points

### Backend Services
- **CAS (Cloud Analytic Services)**: Data storage, querying, analytics
- **Compute Services**: SAS code execution, PROC SQL
- **Model Publishing Service**: Model registration and management
- **Job Execution Service**: Scheduled and on-demand job runs
- **Model Aggregation Service (MAS)**: Production model scoring
- **SCR (Score Code Runtime)**: Containerized model serving

### Query Translation
- **Natural Language → SQL**: Tools convert user queries to PROC SQL
- **Parameter Binding**: Scenarios support comma-separated key=value or JSON objects
- **Pagination**: List tools support limit/start for large result sets

---

## Quick Reference by Use Case

### "I want to explore data"
→ Use: `listLibraries` → `listTables` → `readTable` → `tableInfo`

### "I want to query data with filters"
→ Use: `sasQuery` or `gidb`

### "I want to find a model"
→ Use: `listModels` → `findModel` → `modelInfo`

### "I want to score data with a model"
→ Use: `modelScore` or `scrScore`

### "I want to run a job"
→ Use: `listJobs` → `findJob` → `job` or `jobDef`

### "I want to execute custom SAS code"
→ Use: `program` or `runMacro`

### "I want to analyze business metrics"
→ Use: `gidb` (Global Integrated Deployment Business)

---

## Tool Statistics

| Category | Count | Key Tools |
|----------|-------|-----------|
| Data Discovery | 8 | sasQuery, gidb, tableInfo, readTable |
| Model & Scoring | 5 | modelScore, modelInfo, scrScore |
| Job Execution | 4 | job, jobDef, findJob, listJobs |
| Code Execution | 2 | program, runMacro |
| Utilities | 3 | deval, devaScore, searchAssets |
| **Total** | **23** | - |

---

## Parameter Types

### Common Parameter Patterns

| Parameter Type | Format | Example |
|----------------|--------|---------|
| String filters | Natural language | "where company begins with 'IBM'" |
| Key-value pairs | Comma-separated | "x=10, y=20" |
| JSON objects | Structured | `{x: 10, y: 20}` |
| Pagination | limit, start (1-based) | `{limit: 50, start: 1}` |
| WHERE clauses | SQL syntax | "age > 30 AND status='active'" |

### Automatic Parameter Conversion

- **Company filter normalization**: "begins with 'IBM'" → `LIKE 'IBM%'`
- **Scenario binding**: "a=1, b=2" → `{a: 1, b: 2}`
- **Query templating**: Users → Natural language → SQL conversion → Execution

---

## Performance Considerations

- **Pagination**: Use `limit` and `start` parameters to avoid large result sets
- **Filtering**: Apply WHERE clauses at query time, not post-processing
- **Aggregation**: Use GROUP BY and SUM/COUNT in queries, not result processing
- **Batch Scoring**: Some tools support array input for batch operations

---

## Security & Best Practices

1. **Parameter Sanitization**: All parameters validated through Zod schema definitions
2. **SQL Injection Prevention**: Parameterized queries used internally
3. **Authentication**: Uses SAS Viya credentials and session management
4. **Error Handling**: Comprehensive error messages with actionable guidance
5. **Logging**: Full audit trail of tool invocations

---

## Example Usage Flows

### Flow 1: Analyze IBM Licensing Data
```
1. gidb where company begins with 'IBM'
   → Returns 125 IBM products

2. gidb where company begins with 'IBM' and for each site create total rate
   → Returns 19 sites with aggregated rates

3. gidb where company begins with 'IBM' and site is 877710
   → Returns 3 products at highest-value site
```

### Flow 2: Model-Based Analysis
```
1. listModels limit=10
   → Browse 10 available models

2. findModel name="cancerRisk"
   → Verify model exists

3. modelInfo model="cancerRisk"
   → Get required input variables

4. modelScore model="cancerRisk" scenario="age=45, sex=M, tumor=stage2"
   → Score the customer
```

### Flow 3: Custom SAS Processing
```
1. program src="proc freq; tables company / missing; run;" output="FREQOUT"
   → Execute frequency analysis

2. readTable table="FREQOUT" lib="WORK" limit=50
   → Read results
```

---

## Troubleshooting Guide

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Table not found" | Typo or wrong library | Use `findTable` to verify existence |
| "Job failed" | Query syntax error | Use natural language query translation |
| "No models found" | Wrong model name | Use `listModels` to browse |
| "Scoring error" | Invalid input format | Check `modelInfo` for required variables |
| "Large result set" | Missing pagination | Use `limit` and `start` parameters |

---

## Related Documentation

- SAS Viya documentation: https://go.documentation.sas.com
- PROC SQL reference: https://go.documentation.sas.com/doc/en/pgmsascdc/v_067/sqlproc/
- MCP Server GitHub: @sassoftware/mcp-serverjs
- GIDB Table: Global Integrated Deployment Business licensing database

---

**Version**: 0.15.4-1  
**Last Updated**: November 6, 2025  
**Total Tools**: 23  
**Supported SAS Viya Versions**: Enterprise Edition
