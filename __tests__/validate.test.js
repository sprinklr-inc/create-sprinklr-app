import { isManifestValid } from '../scripts/helpers';
import { manifestObjects } from '../__fixtures__/validate';

describe('manifest file should be valid', () => {
  test('manifest file should be valid', () => {
    const errors = isManifestValid(manifestObjects[0], 'iFrame');

    expect(errors.length).toBe(0);
  });

  test('integrationType should be present and should be CONTAINERIZED for iFrame', () => {
    const errors = isManifestValid(manifestObjects[1], 'iFrame');

    expect(errors.length).toBe(2);
  });

  test('integrationType should be CONTAINERIZED for iFrame', () => {
    const errors = isManifestValid(manifestObjects[2], 'iFrame');

    expect(errors.length).toBe(1);
  });

  test('scopes should be declared and should be non-empty array in widgets', () => {
    const errors = isManifestValid(manifestObjects[3], 'React Component');

    expect(errors.length).toBe(2);
  });

  test('name should be non-empty string', () => {
    const errors = isManifestValid(manifestObjects[4], 'React Component');

    expect(errors.length).toBe(1);
  });
});
