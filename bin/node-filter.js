#!/usr/bin/env node
import fs from 'fs';
import path from 'path';


// Read package.json
const packageJsonPath = path.resolve('./package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
let dependencies = packageJson.dependencies;


// Read licenses.json

const licensesJsonPath = path.resolve('./allLicenses.json');
const licensesJson = JSON.parse(fs.readFileSync(licensesJsonPath, 'utf8'));
let parsedLicenses = {};
let report = {};
for (const [key, details] of Object.entries(licensesJson)) {
  console.log(`Found license entry: ${key}`);
    let r = key.split('@');
    console.log(`Split key into parts: ${r}`);
    let pkgName;
    let version;
    if (r.length == 3) {
        pkgName = '@' + r[1];
        version = r[2];
    } else {
        pkgName = r[0];
        version = r[1];   
    }
    parsedLicenses[key] = {pkgName, details, version};
    console.log(`Processing package: ${pkgName}, version: ${version}`); 
    if (dependencies[pkgName] != null) {
        console.log(`Package ${pkgName} found in package.json`);
        let pversion = dependencies[pkgName];
        console.log(`Checking version ${version} against ${pversion}`);
        if (pversion.includes(version)) {
            console.log(`Version matched for ${pkgName}: ${pversion}`);
            let detailso = {version: version, ...details};
            delete detailso.licenseFile;
            delete detailso.path; 
            report[pkgName] = detailso;

        }
    }
}

/*

console.log('Filtered license report:', report);
console.log('Parsed license report:', parsedLicenses['express@5.1.0']);
console.log('report express:', report['express']);
*/
//console.log('Parsed license report:', parsedLicenses['express@5.1.0']);
fs.writeFileSync('LICENSES.json', JSON.stringify(report, null, 2), 'utf8');



