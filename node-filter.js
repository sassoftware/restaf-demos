
import  fs from 'fs';
import path from 'path';
import { toNamespacedPath } from 'path/posix';

// Read package.json
const packageJsonPath = path.resolve('./package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const topLevelDependencies = Object.keys(packageJson.dependencies || {});
console.log('Top-level dependencies:', topLevelDependencies);
// Read licenses.json

const licensesJsonPath = path.resolve('./license.json');
const licensesJson = JSON.parse(fs.readFileSync(licensesJsonPath, 'utf8'));

let result = {};
topLevelDependencies.map(dep => {
  if (!licensesJson[dep]) {
    console.warn(`Warning: Dependency "${dep}" not found in licenses.json`);
  }
  else {
    result[dep] = licensesJson[dep];
  }
});
console.log('Filtered licenses:', result);

