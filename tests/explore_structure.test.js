import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

describe('Project Structure Exploration', () => {
  it('should have a package.json file', () => {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    assert.ok(fs.existsSync(packageJsonPath), 'package.json should exist');
  });

  it('should have a src directory', () => {
    const srcPath = path.join(projectRoot, 'src');
    assert.ok(fs.existsSync(srcPath), 'src directory should exist');
    assert.ok(fs.statSync(srcPath).isDirectory(), 'src should be a directory');
  });

  it('should be able to list root directory contents', () => {
    const contents = fs.readdirSync(projectRoot);
    assert.ok(contents.length > 0, 'root directory should have contents');
  });
});
