import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const legacyInitScriptPath = path.join(packageRoot, 'tools', 'demiurge-pseudo-spa.cli.js');

export function runLegacyInit(projectName, { cwd = process.cwd() } = {}) {
  if (!projectName) {
    throw new Error('Missing project name. Usage: demiurgejs init <project-name>');
  }

  const result = spawnSync(process.execPath, [legacyInitScriptPath, projectName], {
    cwd,
    stdio: 'inherit'
  });

  if (typeof result.status === 'number') {
    return result.status;
  }

  return 1;
}
