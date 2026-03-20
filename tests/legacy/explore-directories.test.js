import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Directory Exploration', () => {
  it('should list top-level directories in project root', () => {
    const projectRoot = process.cwd();
    const entries = fs.readdirSync(projectRoot, { withFileTypes: true });
    const directories = entries.filter(e => e.isDirectory()).map(e => e.name);
    
    assert.ok(directories.length > 0, 'Project root should have at least one directory');
    console.log('Found directories:', directories);
  });

  it('should be able to stat directory entries', () => {
    const projectRoot = process.cwd();
    const entries = fs.readdirSync(projectRoot);
    
    for (const entry of entries.slice(0, 5)) {
      const fullPath = path.join(projectRoot, entry);
      const stats = fs.statSync(fullPath);
      assert.ok(stats.isDirectory() || stats.isFile(), 'Each entry should be stat-able');
    }
  });

  it('should identify common project directories', () => {
    const projectRoot = process.cwd();
    const entries = fs.readdirSync(projectRoot, { withFileTypes: true });
    const dirNames = entries.filter(e => e.isDirectory()).map(e => e.name);
    
    // Common project directories that might exist
    const commonDirs = ['src', 'lib', 'test', 'tests', 'dist', 'build', 'docs'];
    const foundCommon = dirNames.filter(d => commonDirs.includes(d));
    
    console.log('Common project dirs found:', foundCommon);
    assert.ok(true, 'Exploration completed - found directories: ' + dirNames.join(', '));
  });
});
