/*
 * toolManifest - returns a structured catalog of available tools, grouped by domain.
 * This aids LLM routing and provides clients with a discoverable capability map.
 */

function toolManifest() {
  const version = '1.1.0';
  const domains = {
    models: ['listModels','findModel','modelInfo','modelScore'],
    jobs: ['listJobs','findJob','job','jobDef'],
  libraries: ['listLibraries','findLibrary','listTables','findTable','tableInfo','readTable'],
    tables: ['listTables','findTable','tableInfo','readTable'],
    scoring: ['modelScore','scrScore','superstat','devaScore'],
    scr: ['scrInfo','scrScore'],
    macros_code: ['program','runMacro'],
    sql_generation: ['chataqb'],
    utilities: ['devaScore','superstat','deval','toolManifest']
  };

  // Short one-line purposes (manual curation to avoid dynamic imports & circular refs)
  const purposes = {
    listModels: 'List MAS models (paginated)',
    findModel: 'Locate a specific MAS model',
    modelInfo: 'Describe model inputs/outputs',
    modelScore: 'Score a published model',
    scrInfo: 'Describe SCR container',
    scrScore: 'Score via SCR container',
    program: 'Run arbitrary SAS code',
    runMacro: 'Execute SAS macro with parameters',
    findJob: 'Locate a single job',
    listJobs: 'List available Viya jobs',
    job: 'Execute a job',
    jobDef: 'Execute a job definition',
  listLibraries: 'List CAS/SAS libraries',
    findLibrary: 'Locate a specific library',
    listTables: 'List tables in a library',
    findTable: 'Locate a specific table',
    readTable: 'Read table rows',
    tableInfo: 'Describe table structure',
    superstat: 'Demo scoring (superstat)',
    devaScore: 'Demo numeric scoring utility',
    chataqb: 'Natural language to PROC SQL SELECT generator',
    deval: 'Diagnostic/evaluation utility',
    toolManifest: 'Return grouped tool capability manifest'
  };

  // Build flat tool list with domains (first domain in which they appear is primary)
  const seen = new Set();
  const tools = [];
  Object.entries(domains).forEach(([domain, names]) => {
    names.forEach(name => {
      if (!seen.has(name)) {
        seen.add(name);
        tools.push({
          name,
            primaryDomain: domain,
            purposes: purposes[name] || '—',
            version: '1.0.0'
        });
      }
    });
  });

  const spec = {
    name: 'toolManifest',
    description: `toolManifest — returns grouped catalog of tools (version ${version}). Use to discover capabilities; not for data operations.`,
    schema: {},
    required: [],
    handler: async () => ({
      version,
      domains,
      tools,
      aliasMapping: {},
      generatedAt: new Date().toISOString()
    })
  };
  return spec;
}

export default toolManifest;
