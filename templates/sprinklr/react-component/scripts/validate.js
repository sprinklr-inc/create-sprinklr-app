import { readFileSync } from 'fs';
import { resolve } from 'path';

const errors = [];

function errorMessage(field, type){
  return `Value of field '${field}' should be a non-empty ${type}`;
}

function validateWidget(config) {
  const requiredFields = ['id', 'title', 'url', 'scopes'];
  const optionalFields = ['props'];

  Object.entries(config).forEach(([key]) => {
    if (!requiredFields.includes(key) && !optionalFields.includes(key)) {
      errors.push(`Field '${key}' is not allowed in widget config`);
    }
  });

  requiredFields.forEach(field => {
    if (!(field in config)) {
      errors.push(`Field '${field}' is required in widget config`);
    }

    if (field === 'scopes') {
      if (!(typeof config[field] === 'object' && config[field].length)) {
        errors.push(errorMessage(field, 'array'));
      }
    } else if (!(typeof config[field] === 'string' && config[field])) {
      errors.push(errorMessage(field, 'string'));
    }
  });

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
    Object.entries(config).forEach(([key]) => {
      if (!requiredFields.includes(key) && !optionalFields.includes(key)) {
        errors.push(`Field '${key}' is not allowed in manifest.json`);
      }
    });

    requiredFields.forEach(field => {
      if (!(field in config)) {
        errors.push(`Field '${field}' is required in manifest.json`);
      }

      if (field === 'widgets') {
        if (!(typeof config[field] === 'object' && config[field].length)) {
          errors.push(errorMessage(field, 'array'));
        }
        config.widgets.forEach(widget => {
          validateWidget(widget);
        });
      } else if (!(typeof config[field] === 'string' && config[field])) {
        errors.push(errorMessage(field, 'string'));
      }
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  if(errors.length){
    errors.forEach(error => {
      console.log(`Validation Error: ${error}`);
    })
    process.exit(1);
  }
})();
