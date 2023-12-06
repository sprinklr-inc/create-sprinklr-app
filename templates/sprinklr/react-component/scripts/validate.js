import { readFileSync } from 'fs';
import { resolve } from 'path';

function errorMessage(field, type) {
  return `Value of field '${field}' should be a non-empty ${type}`;
}

function checkRedundantFields({ config, requiredFields, optionalFields }) {
  const errors = [];

  Object.entries(config).forEach(([key]) => {
    if (!requiredFields.includes(key) && !optionalFields.includes(key)) {
      errors.push(`Field '${key}' is not allowed`);
    }
  });
  return errors;
}

function validateRequiredFields({ config, requiredFields, isWidget }) {
  const errors = [];

  requiredFields.forEach(field => {
    if (!(field in config)) {
      errors.push(`Field '${field}' is required`);
    }

    const iterableField = isWidget ? 'scopes' : 'widgets';
    if (field === iterableField) {
      if (!(typeof config[field] === 'object' && config[field].length)) {
        errors.push(errorMessage(field, 'array'));
      }
    } else if (!(typeof config[field] === 'string' && config[field])) {
      errors.push(errorMessage(field, 'string'));
    }
  });
  return errors;
}

function validateWidget(config) {
  const requiredFields = ['id', 'title', 'url', 'scopes'];
  const optionalFields = ['props'];

  const errors = [];

  errors.push(...checkRedundantFields({ config, requiredFields, optionalFields }));
  errors.push(...validateRequiredFields({ config, requiredFields, isWidget: true }));

  optionalFields.forEach(field => {
    if (config[field] && !(typeof config[field] === 'object' && Object.keys(config[field]).length)) {
      errors.push(errorMessage(field, 'object'));
    }
  });
  return errors;
}

(function isManifestValid() {
  const requiredFields = ['name', 'version', 'widgets', 'integrationType'];
  const optionalFields = ['basePath'];
  const errors = [];

  console.log('Validating manifest.json...');
  const path = resolve(process.cwd(), 'manifest.json');
  const config = JSON.parse(readFileSync(path));

  try {
    errors.push(...checkRedundantFields({ config, requiredFields, optionalFields }));
    errors.push(...validateRequiredFields({ config, requiredFields, isWidget: false }));

    config.widgets?.forEach(widget => {
      errors.push(...validateWidget(widget));
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  if (errors.length) {
    errors.forEach(error => {
      console.log(`Validation Error: ${error}`);
    });
    process.exit(1);
  }
})();
