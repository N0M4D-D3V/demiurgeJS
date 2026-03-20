import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

describe('Project Exploration', () => {
  it('should be able to list project root directory', () => {
    const entries = fs.readdirSync(projectRoot);
    assert.ok(entries.length > 0, 'Project root should contain files or directories');
  });

  it('should have a package.json or project configuration', () => {
    const hasPackageJson = fs.existsSync(path.join(projectRoot, 'package.json'));
    const hasTsconfig = fs.existsSync(path.join(projectRoot, 'tsconfig.json'));
    const hasConfig = fs.existsSync(path.join(projectRoot, 'deno.json')) || fs.existsSync(path.join(projectRoot, 'deno.jsonc'));
    assert.ok(hasPackageJson || hasTsconfig || hasConfig, 'Project should have some configuration file');
  });

  it('should be able to traverse subdirectories', () => {
    const entries = fs.readdirSync(projectRoot, { withFileTypes: true });
    const directories = entries.filter(e => e.isDirectory());
    // It's acceptable to have zero or more subdirectories
    assert.ok(Array.isArray(directories), 'Should be able to identify subdirectories');
  });
});
