import { createWriteStream, readFileSync } from 'fs';
import { resolve } from 'path';
import archiver from 'archiver';

const COMPRESSION_LEVEL = 9; // for best compression

const path = resolve(process.cwd(), 'manifest.json');
const config = JSON.parse(readFileSync(path));

const zipFileName = config.name + ' ' + config.version + '.zip';

const sourceFolder = resolve(process.cwd(), 'out');
const zipFilePath = resolve(process.cwd(), zipFileName);

(function zipFolder() {
  const output = createWriteStream(zipFilePath);
  const archive = archiver('zip', { zlib: { level: COMPRESSION_LEVEL } });

  output.on('close', function () {
    console.log(`Successfully created ${zipFileName}`);
  });

  archive.on('error', function (err) {
    throw err;
  });

  archive.directory(sourceFolder, 'out');

  archive.pipe(output);
  archive.finalize();
})();
