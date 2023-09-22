#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
import chalk from 'chalk';
import path from 'path';
import prompts from 'prompts';
import checkForUpdate from 'update-check';
import { createApp, DownloadError } from './createApp';
import { getPkgManager } from './helpers/get-pkg-manager';
import { validateNpmName } from './helpers/validate-pkg';
import packageJson from './package.json';
import inquirer from 'inquirer';

let projectPath: string = '';
let projectType: string = '';

type InputType = {
  type: string;
  name: string;
  message: string;
  choices?: string[];
  default?: number;
  initial?: string;
  validate?: (name: string) => boolean | string;
};

const questions: InputType[] = [
  {
    type: 'input',
    name: 'path',
    message: 'What is your project named?',
    validate: name => {
      if (name.length === 0) {
        return "Project name can't be empty";
      }
      const validation = validateNpmName(path.basename(path.resolve(name)));
      if (validation.valid) {
        return true;
      }
      return 'Invalid project name: ' + validation.problems![0];
    },
  },
  {
    type: 'list',
    name: 'projectType',
    message: 'Select the component type: ',
    choices: ['React Component', 'iFrame'],
    default: 0,
  },
];

async function run(): Promise<void> {
  const res = await inquirer.prompt(questions);

  projectType = res.projectType;
  if (typeof res.path === 'string') {
    projectPath = res.path.trim();
  }

  const resolvedProjectPath = path.resolve(projectPath);
  const projectName = path.basename(resolvedProjectPath);

  const { valid, problems } = validateNpmName(projectName);
  if (!valid) {
    console.error(
      `Could not create a project called ${chalk.red(`"${projectName}"`)} because of npm naming restrictions:`
    );

    problems!.forEach(p => console.error(`    ${chalk.red.bold('*')} ${p}`));
    process.exit(1);
  }

  const packageManager = getPkgManager();

  const example = undefined;
  try {
    await createApp({
      appPath: resolvedProjectPath,
      packageManager,
      appType: projectType,
    });
  } catch (reason) {
    if (!(reason instanceof DownloadError)) {
      throw reason;
    }

    // const res = await prompts({
    //   type: 'confirm',
    //   name: 'builtin',
    //   message:
    //     `Could not download "${example}" because of a connectivity issue between your machine and GitHub.\n` +
    //     `Do you want to use the default template instead?`,
    //   initial: true,
    // });
    // if (!res.builtin) {
    //   throw reason;
    // }

    // await createApp({
    //   appPath: resolvedProjectPath,
    //   packageManager,
    //   appType: projectType,
    // });
  }
}

const update = checkForUpdate(packageJson).catch(() => null);

async function notifyUpdate(): Promise<void> {
  try {
    const res = await update;
    if (res?.latest) {
      const pkgManager = getPkgManager();
      console.log(
        chalk.yellow.bold('A new version of `create-next-app` is available!') +
          '\n' +
          'You can update by running: ' +
          chalk.cyan(
            pkgManager === 'yarn' ? 'yarn global add create-next-app' : `${pkgManager} install --global create-next-app`
          ) +
          '\n'
      );
    }
    process.exit();
  } catch {
    // ignore error
  }
}

run()
  .then(notifyUpdate)
  .catch(async reason => {
    console.log();
    console.log('Aborting installation.');
    if (reason.command) {
      console.log(`  ${chalk.cyan(reason.command)} has failed.`);
    } else {
      console.log(chalk.red('Unexpected error. Please report it as a bug:') + '\n', reason);
    }
    console.log();

    await notifyUpdate();

    process.exit(1);
  });
