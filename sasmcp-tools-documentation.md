# SASMCP Server Tools Documentation

The SAS Model Context Protocol (SASMCP) server provides a variety of tools to interact with SAS Viya services. These tools enable users to manage jobs, models, libraries, tables, and execute queries or programs efficiently.

## 1. Job Execution Tools

### `job`

- **Purpose**: Execute a job on the SAS Viya server.

- **Inputs**: Job name, optional parameters.

- **Outputs**: Job execution results, logs, and tables.

### `jobdef`

- **Purpose**: Execute a job definition on the SAS Viya server.

- **Inputs**: Job definition name, optional parameters.

- **Outputs**: Execution results, logs, and tables.

## 2. Model Management Tools

### `findModel`

- **Purpose**: Locate a specific model deployed to MAS (Model Publish/Scoring service).

- **Inputs**: Model name.

- **Outputs**: Model metadata or confirmation of existence.

### `listModels`

- **Purpose**: Enumerate models published to MAS.

- **Inputs**: Pagination parameters (optional).

- **Outputs**: List of models.

### `modelInfo`

- **Purpose**: Retrieve metadata for a specific model.

- **Inputs**: Model name.

- **Outputs**: Model inputs, outputs, and other metadata.

### `modelScore`

- **Purpose**: Score user-supplied data using a published model.

- **Inputs**: Model name, scenario data.

- **Outputs**: Scoring results.

## 3. Library and Table Management Tools

### `findLibrary`

- **Purpose**: Locate a specific CAS or SAS library.

- **Inputs**: Library name, server type (CAS/SAS).

- **Outputs**: Library metadata or confirmation of existence.

### `listLibraries`

- **Purpose**: List all CAS or SAS libraries.

- **Inputs**: Server type (CAS/SAS), pagination parameters (optional).

- **Outputs**: List of libraries.

### `findTable`

- **Purpose**: Locate a specific table in a library.

- **Inputs**: Library name, table name, server type (CAS/SAS).

- **Outputs**: Table metadata or confirmation of existence.

### `listTables`

- **Purpose**: List tables within a specific library.

- **Inputs**: Library name, server type (CAS/SAS), pagination parameters (optional).

- **Outputs**: List of tables.

### `tableInfo`

- **Purpose**: Retrieve metadata about a specific table.

- **Inputs**: Library name, table name, server type (CAS/SAS).

- **Outputs**: Table schema, column details, and statistics.

### `readTable`

- **Purpose**: Read rows from a table.

- **Inputs**: Library name, table name, server type (CAS/SAS), optional filters.

- **Outputs**: Table rows.

## 4. SAS Code Execution Tools

### `program`

- **Purpose**: Execute a SAS program.

- **Inputs**: SAS code, optional parameters.

- **Outputs**: Program execution results, logs, and tables.

### `runMacro`

- **Purpose**: Submit and execute a SAS macro.

- **Inputs**: Macro name, optional parameters.

- **Outputs**: Macro execution results.

## 5. Query Execution Tool

### `sasQuery`

- **Purpose**: Convert natural language queries into SQL and execute them.

- **Inputs**: Table name, natural language query, optional SQL query.

- **Outputs**: Query results in tabular format.

## 6. SCR (Score Code Runtime) Tools

### `scrInfo`

- **Purpose**: Retrieve input/output schema and metadata for an SCR model.

- **Inputs**: SCR model identifier.

- **Outputs**: Model schema and metadata.

### `scrScore`

- **Purpose**: Score data using an SCR-deployed model.

- **Inputs**: SCR model identifier, scenario data.

- **Outputs**: Scoring results.

## 7. Job and Asset Management Tools

### `findJob`

- **Purpose**: Locate a specific job asset.

- **Inputs**: Job name.

- **Outputs**: Job metadata or confirmation of existence.

### `listJobs`

- **Purpose**: Enumerate job assets deployed in SAS Viya.

- **Inputs**: Pagination parameters (optional).

- **Outputs**: List of jobs.

## 8. Custom Tools

### `superstat`

- **Purpose**: Compute a custom statistic using SAS programming.

- **Inputs**: Two numbers.

- **Outputs**: Computed statistic.

### `devaScore`

- **Purpose**: Compute a custom score for two numbers.

- **Inputs**: Two numbers.

- **Outputs**: Computed score.

### `deval`

- **Purpose**: Retrieve the value of a specific variable.

- **Inputs**: Variable name.

- **Outputs**: Variable value.

---

This document provides an overview of the tools available in the SASMCP server. For detailed usage instructions, refer to the specific tool documentation or contact your SAS administrator
