import { readFileSync } from 'fs';
import { resolve } from 'path';
import { isManifestValid } from './helpers.js';

const appType = '<%=appType%>';

const path = resolve(process.cwd(), 'manifest.json');
const config = JSON.parse(readFileSync(path));

console.log('Validating manifest.json...');
const errors = isManifestValid(config, appType);

if (errors.length) {
  errors.forEach(error => {
    console.log(`Validation Error: ${error}`);
  });
  process.exit(1);
}

console.log(`Successfully validated!`);
