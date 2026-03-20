import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, test } from 'node:test';

const CLI_PATH = path.resolve('bin/demiurgejs.js');
const tempRoots = [];

function makeTempRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'demiurgejs-cli-'));
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

test('skill sync creates skill file and lockfile in cwd', () => {
  const projectRoot = makeTempRoot();
  const result = runCli(['skill', 'sync'], projectRoot);

  assert.equal(result.status, 0);

  const skillPath = path.join(projectRoot, '.agents', 'skills', 'demiurgejs-architect', 'SKILL.md');
  const lockPath = path.join(projectRoot, 'skills-lock.json');

  assert.equal(fs.existsSync(skillPath), true);
  assert.equal(fs.existsSync(lockPath), true);

  const skillContent = fs.readFileSync(skillPath, 'utf8');
  assert.match(skillContent, /^---\n/);
  assert.match(skillContent, /\nname: demiurgejs-architect\n/);
  assert.match(skillContent, /\ntype: local\n/);
  assert.match(skillContent, /\nsource: \.agents\/skills\/demiurgejs-architect\/SKILL\.md\n/);

  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  assert.equal(lock.version, 1);
  assert.equal(typeof lock.skills['demiurgejs-architect'].computedHash, 'string');
  assert.match(lock.skills['demiurgejs-architect'].computedHash, /^[a-f0-9]{64}$/);
});

test('skill sync overwrites existing skill and preserves other lock entries', () => {
  const projectRoot = makeTempRoot();
  const skillPath = path.join(projectRoot, '.agents', 'skills', 'demiurgejs-architect', 'SKILL.md');
  const lockPath = path.join(projectRoot, 'skills-lock.json');

  fs.mkdirSync(path.dirname(skillPath), { recursive: true });
  fs.writeFileSync(skillPath, 'legacy-skill-content', 'utf8');

  fs.writeFileSync(
    lockPath,
    JSON.stringify(
      {
        version: 1,
        skills: {
          another: {
            source: 'custom',
            sourceType: 'local',
            computedHash: 'abc'
          }
        }
      },
      null,
      2
    ),
    'utf8'
  );

  const result = runCli(['skill', 'sync'], projectRoot);
  assert.equal(result.status, 0);

  const skillContent = fs.readFileSync(skillPath, 'utf8');
  assert.equal(skillContent.includes('legacy-skill-content'), false);

  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  assert.deepEqual(lock.skills.another, {
    source: 'custom',
    sourceType: 'local',
    computedHash: 'abc'
  });
  assert.match(lock.skills['demiurgejs-architect'].computedHash, /^[a-f0-9]{64}$/);
});

test('skill sync supports --project path override', () => {
  const workspaceRoot = makeTempRoot();
  const targetProjectRoot = path.join(workspaceRoot, 'target-project');
  fs.mkdirSync(targetProjectRoot, { recursive: true });

  const result = runCli(['skill', 'sync', '--project', targetProjectRoot], workspaceRoot);
  assert.equal(result.status, 0);

  const skillPath = path.join(targetProjectRoot, '.agents', 'skills', 'demiurgejs-architect', 'SKILL.md');
  const lockPath = path.join(targetProjectRoot, 'skills-lock.json');

  assert.equal(fs.existsSync(skillPath), true);
  assert.equal(fs.existsSync(lockPath), true);
});
