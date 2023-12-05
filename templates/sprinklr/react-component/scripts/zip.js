import { createWriteStream } from 'fs';
import { resolve } from 'path';
import archiver from 'archiver';

const COMPRESSION_LEVEL = 9; // for best compression

const sourceFolder = resolve(process.cwd(), 'out/');
const zipFilePath = resolve(process.cwd(), 'out.zip/');

(function zipFolder() {
  const output = createWriteStream(zipFilePath);
  const archive = archiver('zip', { zlib: { level: COMPRESSION_LEVEL } });

  output.on('close', function () {
    console.log(`Successfully zipped out folder to out.zip`);
  });

  archive.on('error', function (err) {
    throw err;
  });

  archive.directory(sourceFolder, 'out');

  archive.pipe(output);
  archive.finalize();
})();
