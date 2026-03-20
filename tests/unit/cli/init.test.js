import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, test } from 'node:test';

const CLI_PATH = path.resolve('bin/demiurgejs.js');
const tempRoots = [];

function makeTempRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'demiurgejs-init-'));
  tempRoots.push(root);
  return root;
}

function runCli(args, cwd) {
  return spawnSync(process.execPath, [CLI_PATH, ...args], {
    cwd,
    encoding: 'utf8'
  });
}

afterEach(() => {
  while (tempRoots.length > 0) {
    fs.rmSync(tempRoots.pop(), { recursive: true, force: true });
  }
});

test('init generates the legacy pseudo-spa scaffold', () => {
  const workdir = makeTempRoot();
  const projectName = 'demo-site';

  const result = runCli(['init', projectName], workdir);
  assert.equal(result.status, 0);

  const projectRoot = path.join(workdir, projectName);
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const bootstrapPath = path.join(projectRoot, 'js', 'bootstrap.js');
  const configPath = path.join(projectRoot, 'js', 'page-config.js');

  assert.equal(fs.existsSync(packageJsonPath), true);
  assert.equal(fs.existsSync(bootstrapPath), true);
  assert.equal(fs.existsSync(configPath), true);

  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  assert.match(packageJsonContent, /"build:arch"/);
});
