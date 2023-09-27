/* eslint-disable import/no-extraneous-dependencies */
import retry from 'async-retry';
import chalk from 'chalk';
import cpy from 'cpy';
import fs from 'fs';
import os from 'os';
import path from 'path';
import ejs from 'ejs';
// import {
//   downloadAndExtractExample,
//   downloadAndExtractRepo,
//   getRepoInfo,
//   existsInRepo,
//   hasRepo,
//   RepoInfo,
// } from './helpers/examples'
import { makeDir } from './helpers/make-dir';
import { tryGitInit } from './helpers/git';
import { install } from './helpers/install';
import { isFolderEmpty } from './helpers/is-folder-empty';
import { getOnline } from './helpers/is-online';
import { isWriteable } from './helpers/is-writeable';
import type { PackageManager } from './helpers/get-pkg-manager';

export class DownloadError extends Error {}

export async function createApp({
  appPath,
  appType,
  packageManager,
  example,
}: {
  appPath: string;
  appType: string;
  packageManager: PackageManager;
  example?: string;
}): Promise<void> {
  //let repoInfo: RepoInfo | undefined
  const template = appType === 'iFrame' ? 'sprinklr/iframe' : 'sprinklr/react-component';

  // if (example) {
  //   let repoUrl: URL | undefined

  //   try {
  //     repoUrl = new URL(example)
  //   } catch (error: any) {
  //     if (error.code !== 'ERR_INVALID_URL') {
  //       console.error(error)
  //       process.exit(1)
  //     }
  //   }

  //   if (repoUrl) {
  //     if (repoUrl.origin !== 'https://github.com') {
  //       console.error(
  //         `Invalid URL: ${chalk.red(
  //           `"${example}"`
  //         )}. Only GitHub repositories are supported. Please use a GitHub URL and try again.`
  //       )
  //       process.exit(1)
  //     }

  //     repoInfo = await getRepoInfo(repoUrl, examplePath)

  //     if (!repoInfo) {
  //       console.error(
  //         `Found invalid GitHub URL: ${chalk.red(
  //           `"${example}"`
  //         )}. Please fix the URL and try again.`
  //       )
  //       process.exit(1)
  //     }

  //     const found = await hasRepo(repoInfo)

  //     if (!found) {
  //       console.error(
  //         `Could not locate the repository for ${chalk.red(
  //           `"${example}"`
  //         )}. Please check that the repository exists and try again.`
  //       )
  //       process.exit(1)
  //     }
  //   } else if (example !== '__internal-testing-retry') {
  //     const found = await existsInRepo(example)

  //     if (!found) {
  //       console.error(
  //         `Could not locate an example named ${chalk.red(
  //           `"${example}"`
  //         )}. It could be due to the following:\n`,
  //         `1. Your spelling of example ${chalk.red(
  //           `"${example}"`
  //         )} might be incorrect.\n`,
  //         `2. You might not be connected to the internet or you are behind a proxy.`
  //       )
  //       process.exit(1)
  //     }
  //   }
  // }

  const root = path.resolve(appPath);

  if (!(await isWriteable(path.dirname(root)))) {
    console.error('The application path is not writable, please check folder permissions and try again.');
    console.error('It is likely you do not have write permissions for this folder.');
    process.exit(1);
  }

  const appName = path.basename(root);

  await makeDir(root);
  if (!isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  const useYarn = packageManager === 'yarn';
  const isOnline = !useYarn || (await getOnline());
  const originalDirectory = process.cwd();

  console.log(`Creating a new Next.js app in ${chalk.green(root)}.`);
  console.log();

  process.chdir(root);

  let hasPackageJson = false;

  /**
   * Start the template installation part
   */
  console.log(chalk.bold(`Using ${packageManager}.`));

  /**
   * Copy the template files to the target directory.
   */

  console.log('Copying template');
  console.log(path.join(__dirname));
  console.log(path.join(root));

  await cpy('**', root, {
    parents: true,
    cwd: path.join(__dirname, 'templates', template),
    rename: name => {
      switch (name) {
        case 'gitignore':
        case 'eslintrc.json':
        case 'prettierrc':
        case 'yarnrc.yml': {
          return '.'.concat(name);
        }
        // README.md is ignored by webpack-asset-relocator-loader used by ncc:
        // https://github.com/vercel/webpack-asset-relocator-loader/blob/e9308683d47ff507253e37c9bcbb99474603192b/src/asset-relocator.js#L227
        case 'README-template.md': {
          return 'README.md';
        }
        default: {
          return name;
        }
      }
    },
  });

  /**
   * Build the package.json file and write it to the app folder
   */
  console.log('Setting up package.json file');
  const targetPackageFile = path.join(__dirname, 'templates', template, 'package.json');
  const targetJSON = fs.readFileSync(targetPackageFile, { encoding: 'utf-8' });
  const parsedJSON = ejs.render(targetJSON, { appName });

  fs.writeFileSync(path.join(root, 'package.json'), parsedJSON);
  console.log('Done');

  const installFlags = { packageManager, isOnline };
  console.log('Installing Dependencies and devDependencies');
  await install(installFlags);
  console.log('Done');

  //Copy Manifest file
  console.log('Setting up manifest.json file');
  const contents = fs.readFileSync(path.join(root, 'manifest.json'), { encoding: 'utf-8' });
  const parsedContent = ejs.render(contents, { appId: appName.split(' ').join('-'), appName }, {});
  /**
   * Write it to disk.
   */
  fs.writeFileSync(path.join(root, 'manifest.json'), parsedContent);
  console.log('Done');

  if (tryGitInit(root)) {
    console.log('Initialized a git repository.');
    console.log();
  }

  let cdpath: string;
  if (path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  console.log(`${chalk.green('Success!')} Created ${appName} at ${appPath}`);

  if (hasPackageJson) {
    console.log('Inside that directory, you can run several commands:');
    console.log();
    console.log(chalk.cyan(`  ${packageManager} ${useYarn ? '' : 'run '}dev`));
    console.log('    Starts the development server.');
    console.log();
    console.log(chalk.cyan(`  ${packageManager} ${useYarn ? '' : 'run '}build`));
    console.log('    Builds the app for production.');
    console.log();
    console.log(chalk.cyan(`  ${packageManager} start`));
    console.log('    Runs the built app in production mode.');
    console.log();
    console.log('We suggest that you begin by typing:');
    console.log();
    console.log(chalk.cyan('  cd'), cdpath);
    console.log(`  ${chalk.cyan(`${packageManager} ${useYarn ? '' : 'run '}dev`)}`);
  }
  console.log();
}
