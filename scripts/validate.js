import { readFileSync } from 'fs';
import { resolve } from 'path';

const appType = '<%=appType%>';

const INTEGRATION_TYPES = { 'React Component': 'VIRTUALIZED', iFrame: 'CONTAINERIZED' };

const reduntantFieldErrorMessage = ({ field, title, isWidget }) => {
  if (isWidget !== undefined) {
    return `Field ${field} not supported in ${isWidget ? 'widget' : 'page'} "${title}"`;
  }
  return `Field ${field} not supported in manifest object`;
};

const manifestErrorMessage = (field, type) => `Value of field '${field}' should be a non-empty ${type}`;

const errorMessage = ({ title, field, type, isWidget }) =>
  `Value of field ${field} should be a non-empty ${type} in ${isWidget ? 'widget' : 'page'} "${title}"`;

const isUrlValid = url => {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(url);
};

const validateProps = ({ props, title, isWidget }) => {
  const errors = [`Value of field props should be an object in ${isWidget ? 'widget' : 'page'} "${title}"`];
  return props && !(typeof props === 'object') ? errors : [];
};

const checkRedundantFields = ({ config, requiredFields, optionalFields, isWidget }) =>
  Object.entries(config).reduce((acc, [key]) => {
    if (!requiredFields.includes(key) && !optionalFields.includes(key)) {
      acc.push(reduntantFieldErrorMessage({ field: key, title: config.title, isWidget }));
    }
    return acc;
  }, []);

const validateRequiredFields = ({ config, requiredFields, isWidget }) =>
  requiredFields.reduce((acc, field) => {
    if (!(field in config)) {
      acc.push(`Field '${field}' is required in ${isWidget ? 'widget' : 'page'} "${config.title}"`);
    } else if (field === 'scopes') {
      if (!(Array.isArray(config[field]) && config[field].length)) {
        acc.push(errorMessage({ title: config.title, field, type: 'array', isWidget }));
      }
    } else if (!(typeof config[field] === 'string' && config[field])) {
      acc.push(errorMessage({ title: config.title, field, type: 'string', isWidget }));
    }

    return acc;
  }, []);

const validateComponent = (config, isWidget) => {
  const requiredFields = ['id', 'title', 'url'];
  const optionalFields = ['props'];

  if (isWidget) {
    requiredFields.push('scopes');
  }

  return [
    ...checkRedundantFields({ config, requiredFields, optionalFields, isWidget }),
    ...validateRequiredFields({ config, requiredFields, isWidget }),
    ...validateProps({ props: config.props, title: config.title, isWidget }),
  ];
};

const validateManifestRequiredFields = (config, requiredFields) =>
  requiredFields.reduce((acc, field) => {
    if (!(field in config)) {
      acc.push(`Field '${field}' is required in manifest object`);
    } else if (field === 'integrationType' && config[field] !== INTEGRATION_TYPES[appType]) {
      acc.push(`Field ${field} must be ${INTEGRATION_TYPES[appType]}`);
    } else if (!(typeof config[field] === 'string' && config[field])) {
      acc.push(manifestErrorMessage(field, 'string'));
    }

    return acc;
  }, []);

const validateManifestOptionalFields = (config, optionalFields) =>
  optionalFields.reduce((acc, field) => {
    if (field === 'basePath') {
      if (field in config && !(typeof config[field] === 'string' && isUrlValid(config[field]))) {
        acc.push(`Field ${field} should be a valid url`);
      }
    } else if (config[field] && !Array.isArray(config[field])) {
      acc.push(manifestErrorMessage(field, 'array'));
    }

    return acc;
  }, []);

const isManifestValid = () => {
  const requiredFields = ['name', 'version', 'integrationType'];
  const optionalFields = ['basePath', 'widgets', 'pages'];

  console.log('Validating manifest.json...');
  const path = resolve(process.cwd(), 'manifest.json');
  const config = JSON.parse(readFileSync(path));

  const errors = [
    ...checkRedundantFields({ config, requiredFields, optionalFields }),
    ...validateManifestRequiredFields(config, requiredFields),
    ...validateManifestOptionalFields(config, optionalFields),
    ...(Array.isArray(config.widgets) ? config.widgets : []).reduce((acc, widget) => {
      acc.push(...validateComponent(widget, true));
      return acc;
    }, []),
    ...(Array.isArray(config.pages) ? config.pages : []).reduce((acc, page) => {
      acc.push(...validateComponent(page, false));
      return acc;
    }, []),
  ];

  if (errors.length) {
    errors.forEach(error => {
      console.log(`Validation Error: ${error}`);
    });
    process.exit(1);
  }

  console.log(`Successfully validated!`);
};

isManifestValid();