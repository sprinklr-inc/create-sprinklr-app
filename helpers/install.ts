/* eslint-disable import/no-extraneous-dependencies */
import chalk from 'chalk';
import spawn from 'cross-spawn';
import type { PackageManager } from './get-pkg-manager';

interface InstallArgs {
  /**
   * Indicate whether to install packages using npm, pnpm or Yarn.
   */
  packageManager: PackageManager;
  /**
   * Indicate whether there is an active Internet connection.
   */
  isOnline: boolean;
}

/**
 * Spawn a package manager installation with either Yarn or NPM.
 *
 * @returns A Promise that resolves once the installation is finished.
 */
export function install({ packageManager, isOnline }: InstallArgs): Promise<void> {
  /**
   * Return a Promise that resolves once the installation is finished.
   */
  return new Promise((resolve, reject) => {
    let args: string[];
    let command = packageManager;
    const useYarn = packageManager === 'yarn';

    /**
     * The package.json file is already there.
     * So just run a variation of `{packageManager} install`.
     */
    args = ['install'];

    if (!isOnline) {
      console.log(chalk.yellow('You appear to be offline.'));
      if (useYarn) {
        console.log(chalk.yellow('Falling back to the local Yarn cache.'));
        console.log();
        args.push('--offline');
      } else {
        console.log();
      }
    }

    /**
     * Spawn the installation process.
     */
    const child = spawn(command, args, {
      stdio: 'inherit',
      env: {
        ...process.env,
        ADBLOCK: '1',
        // we set NODE_ENV to development as pnpm skips dev
        // dependencies when production
        NODE_ENV: 'development',
        DISABLE_OPENCOLLECTIVE: '1',
      },
    });
    child.on('close', code => {
      if (code !== 0) {
        reject({ command: `${command} ${args.join(' ')}` });
        return;
      }
      resolve();
    });
  });
}
