import { readFileSync } from 'fs';
import { resolve } from 'path';

function validateWidget(config) {
  const requiredFields = ['id', 'title', 'url', 'scopes'];
  const optionalFields = ['props'];

  Object.entries(config).forEach(([key]) => {
    if (!requiredFields.includes(key) && !optionalFields.includes(key)) {
      throw new Error(`field '${key}' is not allowed in widget config`);
    }
  });

  requiredFields.forEach(field => {
    if (!(field in config)) {
      throw new Error(`field '${field}' is required in widget config`);
    }

    if (field === 'scopes') {
      if (!(typeof config[field] === 'object' && config[field].length)) {
        throw new Error(`value of field '${field}' should be a non-empty array`);
      }
    } else if (!(typeof config[field] === 'string' && config[field])) {
      throw new Error(`value of field '${field}' should be a non-empty string`);
    }
  });

  optionalFields.forEach(field => {
    if (config[field] && !(typeof config[field] === 'object')) {
      throw new Error(`value of field '${field}' should be an object`);
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
        throw new Error(`field '${key}' is not allowed in manifest.json`);
      }
    });

    requiredFields.forEach(field => {
      if (!(field in config)) {
        throw new Error(`field '${field}' is required in manifest.json`);
      }

      if (field === 'widgets') {
        if (!(typeof config[field] === 'object' && config[field].length)) {
          throw new Error(`value of field '${field}' should be a non-empty array`);
        }
        config.widgets.forEach(widget => {
          validateWidget(widget);
        });
      } else if (!(typeof config[field] === 'string' && config[field])) {
        throw new Error(`value of field '${field}' should be a non-empty string`);
      }
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
