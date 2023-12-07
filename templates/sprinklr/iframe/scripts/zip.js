const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const COMPRESSION_LEVEL = 9; // for best compression

const filePath = path.resolve(process.cwd(), 'manifest.json');
const config = JSON.parse(fs.readFileSync(filePath));

const zipFileName = config.name + ' ' + config.version + '.zip';

const sourceFolder = path.resolve(process.cwd(), 'out');
const zipFilePath = path.resolve(process.cwd(), zipFileName);

(function zipFolder() {
  const output = fs.createWriteStream(zipFilePath);
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
