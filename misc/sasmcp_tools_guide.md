# SAS Viya SASMCP Server Tools Guide

**Date:** October 17, 2025  

**Server:** SAS Viya with Model Publish/Scoring Service, Job Execution, and CAS

---

## Table of Contents

1. [Model Management Tools](#model-management-tools)
2. [Scoring & ML Tools](#scoring--ml-tools)
3. [Code Execution Tools](#code-execution-tools)
4. [Job Management Tools](#job-management-tools)
5. [Library Management Tools](#library-management-tools)
6. [Table Management Tools](#table-management-tools)
7. [Query Tools](#query-tools)
8. [Utility Tools](#utility-tools)

---

## Model Management Tools

### 1. **listModels**

List all published models in the MAS (Model Aggregation Service).

**Parameters:**

- `limit` (number, default: 10) - Number of models per page
- `start` (number, default: 1) - Starting position for pagination

**Use Cases:**

- Browse available models
- Discover deployed models
- Explore model inventory

**Example:**

```javascript
listModels with limit=25, start=1
```

---

### 2. **findModel**

Locate a specific model by exact name.

**Parameters:**

- `name` (string, required) - Exact model name

**Use Cases:**

- Check if a model exists
- Verify model deployment
- Quick model lookup

**Example:**

```javascript
findModel name="churn_score"
```

---

### 3. **modelInfo**

Retrieve detailed metadata about a published model.

**Parameters:**

- `model` (string, required) - Model name

**Returns:**

- Input variables (names, types, data roles, valid ranges)
- Output variables (predictions, probabilities, scores)
- Model metadata

**Use Cases:**

- Discover required scoring inputs
- Understand model outputs
- Pre-scoring validation

**Example:**

```javascript
modelInfo model="credit_risk_v2"
```

---

### 4. **modelScore**

Score scenario data using a published model.

**Parameters:**

- `model` (string, required) - Model name
- `scenario` (string/object/array, required) - Data to score
- `uflag` (boolean, optional) - Prefix field names with underscore

**Input Formats:**

- Comma-separated: `"age=45, income=60000"`
- JSON object: `{age: 45, income: 60000}`
- Array: `[{...}, {...}]` for batch scoring

**Use Cases:**

- Score individual records
- Batch scoring
- Real-time predictions
- Model validation

**Example:**

```javascript
modelScore model="cancer_risk", scenario={age: 50, sex: "M", tumor: "stage2"}
```

---

## Scoring & ML Tools

### 5. **scrInfo**

Get input/output schema for an SCR (Score Code Runtime) model.

**Parameters:**

- `name` (string, required) - SCR model identifier (URL or local reference)

**Use Cases:**

- Discover SCR model interface
- Understand remote scoring endpoints
- Validate input requirements

**Example:**

```javascript
scrInfo name="https://scr-host/models/loan_approval"
```

---

### 6. **scrScore**

Score using a containerized SCR model.

**Parameters:**

- `name` (string, required) - SCR model identifier (URL)
- `scenario` (string/object/array, optional) - Input data

**Use Cases:**

- Score with remote containerized models
- Azure or external host models
- Microservices-based scoring

**Example:**

```javascript
scrScore name="https://scr-host/models/fraud_detection", scenario={amount: 5000, vendor_id: 123}
```

---

## Code Execution Tools

### 7. **program**

Execute SAS code on the server.

**Parameters:**

- `src` (string, required) - SAS code or filename
- `folder` (string, optional) - Folder path for stored programs
- `scenario` (string/object, optional) - Input parameters
- `output` (string, optional) - Output table name
- `limit` (number, default: 100) - Max rows to return

**Use Cases:**

- Execute data steps
- Run PROC procedures
- Data manipulation and transformation
- Complex analytics

**Example:**

```javascript
program src="data work.analysis; set public.sales; if region='East' then high_value=1; run;" output="analysis" limit=50
```

---

### 8. **runMacro**

Execute a SAS macro with parameters.

**Parameters:**

- `macro` (string, required) - Macro name (without %)
- `scenario` (string, optional) - Parameters or SAS setup code

**Input Formats:**

- Comma-separated: `"x=1, y=abc"`
- Raw SAS code: `"%let x=1; %let y=abc;"`

**Use Cases:**

- Run predefined macros
- Parameterized analysis
- Reusable SAS workflows

**Example:**

```txt
runMacro macro="summarize", scenario="region=East, year=2025"
```

---

## Job Management Tools

### 9. **listJobs**

Browse SAS Viya job assets.

**Parameters:**

- `limit` (number, default: 10) - Jobs per page
- `start` (number, default: 1) - Starting position
- `where` (string, optional) - Filter expression

**Use Cases:**

- Explore available jobs
- Browse job inventory
- Discover automated workflows

**Example:**

```txt
listJobs limit=20, start=1
```

---

### 10. **findJob**

Locate a specific job by name.

**Parameters:**

- `name` (string, required) - Exact job name

**Use Cases:**

- Verify job existence
- Check job availability
- Quick job lookup

**Example:**

```txt
findJob name="daily_etl_job"
```

---

### 11. **job**

Execute a deployed job asset.

**Parameters:**

- `name` (string, required) - Job name
- `scenario` (string/object, optional) - Input parameters

**Use Cases:**

- Run scheduled jobs manually
- Execute ETL processes
- Trigger data pipelines

**Example:**

```txt
job name="refresh_dashboard", scenario="date=2025-10-17, environment=prod"
```

---

### 12. **jobdef**

Execute a job definition on the server.

**Parameters:**

- `name` (string, required) - Job definition name
- `scenario` (string/object, optional) - Input parameters

**Use Cases:**

- Run job definitions
- Execute parameterized workflows
- Job execution with parameters

**Example:**

```txt
jobdef name="monthly_report", scenario="month=10, year=2025"
```

---

## Library Management Tools

### 13. **listLibraries**

Enumerate CAS or SAS libraries.

**Parameters:**

- `server` (cas|sas, default: cas) - Target environment
- `limit` (number, default: 10) - Libraries per page
- `start` (number, default: 1) - Starting position
- `where` (string, optional) - Filter expression

**Use Cases:**

- Browse available libraries
- Discover data locations
- Inventory CAS caslibs or SAS librefs

**Example:**

```txt
listLibraries server="cas", limit=25
```

---

### 14. **findLibrary**

Locate a specific library.

**Parameters:**

- `name` (string, required) - Library name
- `server` (cas|sas, default: cas) - Target environment

**Use Cases:**

- Verify library existence
- Check library availability
- Quick library lookup

**Example:**

```txt
findLibrary name="Public", server="cas"
```

---

## Table Management Tools

### 15. **listTables**

Enumerate tables within a library.

**Parameters:**

- `lib` (string, required) - Library/caslib name
- `server` (cas|sas, default: cas) - Target environment
- `limit` (number, default: 10) - Tables per page
- `start` (number, default: 1) - Starting position
- `where` (string, optional) - Filter expression

**Use Cases:**

- Browse tables in a library
- Discover available datasets
- Inventory table contents

**Example:**

```txt
listTables lib="Public", limit=20, server="cas"
```

---

### 16. **findTable**

Locate a table in a specific library.

**Parameters:**

- `lib` (string, required) - Library name
- `name` (string, required) - Table name
- `server` (cas|sas, default: cas) - Target environment

**Use Cases:**

- Verify table existence
- Check before operations
- Quick table lookup

**Example:**

```txt
findTable lib="Public", name="cars", server="cas"
```

---

### 17. **readTable**

Read rows from a table.

**Parameters:**

- `table` (string, required) - Table name
- `lib` (string, required) - Library name
- `server` (cas|sas, default: cas) - Target environment
- `start` (number, default: 1) - Starting row (1-based)
- `limit` (number, default: 10) - Max rows to return
- `where` (string, optional) - WHERE clause filter
- `format` (boolean, default: true) - Return formatted values
- `row` (number, optional) - Read single row

**Use Cases:**

- Sample table data
- Read specific rows
- Preview datasets
- Filtered data retrieval

**Example:**

```txt
readTable table="cars", lib="Public", limit=25, where="origin='USA' AND msrp > 50000"
```

---

### 18. **tableInfo**

Get metadata about a table.

**Parameters:**

- `table` (string, required) - Table name
- `lib` (string, required) - Library name
- `server` (cas|sas, optional) - Target environment

**Returns:**

- Column metadata (names, types, labels, formats)
- Table statistics (row count, size, timestamps)

**Use Cases:**

- Inspect table schema
- Discover column structure
- Understand data types
- Pre-scoring validation

**Example:**

```txt
tableInfo table="sales", lib="Public", server="cas"
```

---

## Query Tools

### 19. **sasQuery**

Execute natural language queries using PROC SQL against any table.

**Parameters:**

- `table` (string, required) - Table name
- `query` (string, required) - Natural language query
- `sql` (string, optional) - Generated SQL statement
- `job` (string, optional, default: run_sql_query) - Job to execute

**Use Cases:**

- Natural language data querying
- SQL generation from descriptions
- Flexible data exploration
- Aggregations and analytics

**Example:**

```txt
sasQuery table="sales", query="Total revenue by region for the last quarter"
```

---

### 20. **queryStudent**

Query the Public.enrollment table with natural language.

**Parameters:**

- `query` (string, required) - Natural language query
- `sql` (string, optional) - Generated SQL
- `table` (string, default: Public.enrollment) - Target table

**Valid Columns:** Program, EnrollmentStatus, Race, Gender, Dropout, StudentID, EnrollmentYear, CreditsEnrolled

**Use Cases:**

- Student enrollment analysis
- Dropout prediction
- Enrollment trends
- Demographic analysis

**Example:**

```txt
queryStudent query="How many students are enrolled by program and year?"
```

---

### 21. **queryCars**

Query the Public.cars table with predefined columns. This assumes Public is compute library.

**Parameters:**

- `query` (string, required) - Natural language filter
- `sql` (string, optional) - Generated SQL
- `table` (string, default: Public.cars) - Target table

**Available Columns:** Make, Model, Type, Origin, DriveTrain, MSRP, Invoice, EngineSize, Cylinders, Horsepower, MPG_City, MPG_Highway, Weight, Wheelbase, Length

**Use Cases:**

- Vehicle analysis
- MSRP comparisons
- Origin and make analysis
- Performance metrics

**Example:**

```txt
queryCars query="origin='USA' AND msrp > 50000"
```

---

## Utility Tools

### 22. **devaScore**

Compute a Deva Score for two numbers. A 'are-you-there" test for the mcp server

**Parameters:**

- `a` (number, required) - First value
- `b` (number, required) - Second value

**Formula:** (a + b) × 42

**Use Cases:**

- Custom scoring function
- Multi-value scoring (chained calls)

**Example:**

```txt
devaScore a=1, b=2  // Returns 126
devaScore a=126, b=3  // Returns 5418
```

---

## Summary Table

| Category | Tool | Purpose |
|----------|------|---------|
| Models | listModels | Browse models |
| Models | findModel | Locate model |
| Models | modelInfo | Model metadata |
| Models | modelScore | Score with model |
| Scoring | scrInfo | SCR schema |
| Scoring | scrScore | Score with SCR |
| Code | program | Execute SAS |
| Code | runMacro | Run macro |
| Jobs | listJobs | Browse jobs |
| Jobs | findJob | Locate job |
| Jobs | job | Execute job |
| Jobs | jobdef | Execute jobdef |
| Libraries | listLibraries | Browse libraries |
| Libraries | findLibrary | Locate library |
| Tables | listTables | Browse tables |
| Tables | findTable | Locate table |
| Tables | readTable | Read data |
| Tables | tableInfo | Table metadata |
| Queries | sasQuery | SQL query |
| Queries | queryStudent | Student query |
| Queries | queryCars | Cars query |
| Utility | devaScore | Calculate score |

---

## Best Practices

### For Production Workflows

1. Use **modelInfo** before **modelScore** to validate inputs
2. Use **findTable** and **tableInfo** before **readTable**
3. Chain tools logically: find → info → read/score
4. Always specify appropriate limits for pagination

### For Data Analysis

1. Start with **listLibraries** and **listTables** to explore
2. Use **tableInfo** to understand schema
3. Use **readTable** with WHERE clauses to filter early
4. Use query tools for complex aggregations

### For Model Operations

1. Use **findModel** to verify existence
2. Use **modelInfo** to understand inputs/outputs
3. Use **modelScore** for predictions
4. For batch operations, pass arrays to **modelScore**

### For Code Execution

1. Prefer **runMacro** for predefined workflows
2. Use **program** for ad-hoc analysis
3. Always specify output table if you need results
4. Use scenario parameters for dynamic execution

---

## Error Handling

Most tools return errors as structured JSON with message fields. Common issues:

- **Model not found:** Use **findModel** first
- **Library not available:** Use **listLibraries** to verify
- **Table doesn't exist:** Use **findTable** before operations
- **Invalid parameters:** Check tool parameter requirements
- **Authentication issues:** Verify server connectivity

---

## Related Resources

- SAS Viya Documentation: <https://documentation.sas.com/>
- Model Publish/Scoring Service: Check SAS Viya admin docs
- CAS (Cloud Analytic Services): Parallel in-memory analytics
- PROC SQL Reference: SAS SQL Language reference

---

- Document generated: October 17, 2025
