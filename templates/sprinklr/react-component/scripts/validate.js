import { readFileSync } from 'fs';
import { resolve } from 'path';

const errorMessage = (field, type) => `Value of field '${field}' should be a non-empty ${type}`;

const checkRedundantFields = ({ config, requiredFields, optionalFields }) =>
  Object.entries(config).reduce((acc, [key]) => {
    if (!requiredFields.includes(key) && !optionalFields.includes(key)) {
      acc.push(`Field '${key}' is not allowed`);
    }
    return acc;
  }, []);

const validateRequiredFields = ({ config, requiredFields, isWidget }) =>
  requiredFields.reduce((acc, field) => {
    if (!(field in config)) {
      acc.push(`Field '${field}' is required`);
    }

    const iterableField = isWidget ? 'scopes' : 'widgets';
    if (field === iterableField) {
      if (!(typeof config[field] === 'object' && config[field].length)) {
        acc.push(errorMessage(field, 'array'));
      }
    } else if (!(typeof config[field] === 'string' && config[field])) {
      acc.push(errorMessage(field, 'string'));
    }

    return acc;
  }, []);

const validateWidget = config => {
  const requiredFields = ['id', 'title', 'url', 'scopes'];
  const optionalFields = ['props'];

  return [
    ...checkRedundantFields({ config, requiredFields, optionalFields }),
    ...validateRequiredFields({ config, requiredFields, isWidget: true }),
    ...optionalFields.reduce((acc, field) => {
      if (config[field] && !(typeof config[field] === 'object' && Object.keys(config[field]).length)) {
        acc.push(errorMessage(field, 'object'));
      }
      return acc;
    }, []),
  ];
};

const isManifestValid = () => {
  const requiredFields = ['name', 'version', 'widgets', 'integrationType'];
  const optionalFields = ['basePath'];

  console.log('Validating manifest.json...');
  const path = resolve(process.cwd(), 'manifest.json');
  const config = JSON.parse(readFileSync(path));

  const errors = [
    ...checkRedundantFields({ config, requiredFields, optionalFields }),
    ...validateRequiredFields({ config, requiredFields, isWidget: false }),
    ...(config.widgets || []).reduce((acc, widget) => {
      acc.push(...validateWidget(widget));
      return acc;
    }, []),
  ];

  if (errors.length) {
    errors.forEach(error => {
      console.log(`Validation Error: ${error}`);
    });
    process.exit(1);
  } else {
    console.log(`Successfully validated!`);
  }
};

isManifestValid();
