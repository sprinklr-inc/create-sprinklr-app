import { APP_TYPE, INTEGRATION_TYPE } from './constants.js';

const APP_TYPE_VS_INT_TYPE = {
  [APP_TYPE.REACT_COMPONENT]: INTEGRATION_TYPE.VIRTUALIZED,
  [APP_TYPE.IFRAME]: INTEGRATION_TYPE.CONTAINERIZED,
};

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
  Object.keys(config).reduce((acc, key) => {
    if (!requiredFields.includes(key) && !optionalFields.includes(key)) {
      acc.push(reduntantFieldErrorMessage({ field: key, title: config.title, isWidget }));
    }
    return acc;
  }, []);

const validateRequiredFields = ({ config, requiredFields, isWidget }) =>
  requiredFields.reduce((acc, field) => {
    if (!(field in config)) {
      acc.push(`Field '${field}' is required in ${isWidget ? 'widget' : 'page'} "${config.title}"`);
    }

    switch (field) {
      case 'id':
      case 'title':
      case 'url':
        if (!(typeof config[field] === 'string' && config[field])) {
          acc.push(errorMessage({ title: config.title, field, type: 'string', isWidget }));
        }
        break;
      case 'scopes':
        if (!(Array.isArray(config[field]) && config[field].length)) {
          acc.push(errorMessage({ title: config.title, field, type: 'array', isWidget }));
        }
        break;
      default:
        break;
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

const validateManifestRequiredFields = (config, appType, requiredFields) =>
  requiredFields.reduce((acc, field) => {
    if (!(field in config)) {
      acc.push(`Field '${field}' is required in manifest object`);
    }

    switch (field) {
      case 'name':
      case 'version':
        if (!(typeof config[field] === 'string' && config[field])) {
          acc.push(manifestErrorMessage(field, 'string'));
        }
        break;
      case 'integrationType':
        if (config[field] !== APP_TYPE_VS_INT_TYPE[appType]) {
          acc.push(`Field ${field} must be ${APP_TYPE_VS_INT_TYPE[appType]}`);
        }
        break;
      default:
        break;
    }

    return acc;
  }, []);

const validateManifestOptionalFields = config =>
  Object.entries(config).reduce((acc, [key, value]) => {
    switch (key) {
      case 'basePath':
        if (!isUrlValid(value)) {
          acc.push(`Field ${key} should be a valid url`);
        }
        break;
      case 'widgets':
      case 'pages':
        if (!Array.isArray(value)) {
          acc.push(manifestErrorMessage(key, 'array'));
        }
        break;
      default:
        break;
    }

    return acc;
  }, []);

export const isManifestValid = (config, appType) => {
  const requiredFields = ['name', 'version', 'integrationType'];
  const optionalFields = ['basePath', 'widgets', 'pages'];

  return [
    ...checkRedundantFields({ config, requiredFields, optionalFields }),
    ...validateManifestRequiredFields(config, appType, requiredFields),
    ...validateManifestOptionalFields(config),
    ...(Array.isArray(config.widgets) ? config.widgets : []).reduce((acc, widget) => {
      acc.push(...validateComponent(widget, true));
      return acc;
    }, []),
    ...(Array.isArray(config.pages) ? config.pages : []).reduce((acc, page) => {
      acc.push(...validateComponent(page, false));
      return acc;
    }, []),
  ];
};
