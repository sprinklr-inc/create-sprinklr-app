import { readFileSync } from 'fs';
import { resolve } from 'path';

const errors = [];

function errorMessage(field, type) {
  return `Value of field '${field}' should be a non-empty ${type}`;
}

function checkRedundantFields(config, requiredFields, optionalFields) {
  Object.entries(config).forEach(([key]) => {
    if (!requiredFields.includes(key) && !optionalFields.includes(key)) {
      errors.push(`Field '${key}' is not allowed`);
    }
  });
}

function validateRequiredFields(config, requiredFields, isWidget = false) {
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
}

function validateWidget(config) {
  const requiredFields = ['id', 'title', 'url', 'scopes'];
  const optionalFields = ['props'];

  checkRedundantFields(config, requiredFields, optionalFields);
  validateRequiredFields(config, requiredFields, true);

  optionalFields.forEach(field => {
    if (config[field] && !(typeof config[field] === 'object' && Object.keys(config[field]).length)) {
      errors.push(errorMessage(field, 'object'));
    }
  });
}

(function isManifestValid() {
  const requiredFields = ['name', 'version', 'widgets', 'integrationType'];
  const optionalFields = ['basePath'];

  console.log('Validating manifest.json...');
  const path = resolve(process.cwd(), 'manifest.json');
  const config = JSON.parse(readFileSync(path));

  try {
    checkRedundantFields(config, requiredFields, optionalFields);
    validateRequiredFields(config, requiredFields);

    config.widgets?.forEach(widget => {
      validateWidget(widget);
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