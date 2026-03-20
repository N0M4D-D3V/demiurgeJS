import path from 'node:path';

import { runLegacyInit } from './init.js';
import { syncSkill } from './skill-sync.js';

function printHelp() {
  console.log('demiurgejs CLI');
  console.log('');
  console.log('Commands:');
  console.log('  demiurgejs skill sync [--project <path>]');
  console.log('  demiurgejs init <project-name>');
}

function parseProjectPath(args) {
  const projectFlagIndex = args.indexOf('--project');
  if (projectFlagIndex === -1) {
    return process.cwd();
  }

  const rawPath = args[projectFlagIndex + 1];
  if (!rawPath) {
    throw new Error('Missing value for --project');
  }

  return path.resolve(rawPath);
}

export async function runCli(args) {
  const [command, subcommand, ...rest] = args;

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return 0;
  }

  if (command === 'skill' && subcommand === 'sync') {
    const projectPath = parseProjectPath(rest);
    const result = syncSkill({ projectPath });

    console.log(`Synced skill ${result.skillName}`);
    console.log(`  Project: ${result.rootPath}`);
    console.log(`  Skill:   ${result.skillPath}`);
    console.log(`  Lock:    ${result.lockPath}`);
    return 0;
  }

  if (command === 'init') {
    try {
      return runLegacyInit(subcommand);
    } catch (error) {
      console.error(error.message);
      return 1;
    }
  }

  console.error(`Unknown command: ${args.join(' ')}`);
  console.error('Run `demiurgejs --help` for usage.');
  return 1;
}
