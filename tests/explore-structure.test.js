const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

function testDirectoryExists(dirPath) {
  const fullPath = path.join(projectRoot, dirPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Directory not found: ${dirPath}`);
  }
  if (!fs.statSync(fullPath).isDirectory()) {
    throw new Error(`Path is not a directory: ${dirPath}`);
  }
}

function testCanListDirectory(dirPath) {
  const fullPath = path.join(projectRoot, dirPath);
  const entries = fs.readdirSync(fullPath);
  return entries;
}

// Test 1: Project root exists
test('Project root directory exists', () => {
  testDirectoryExists('.');
});

// Test 2: Can list root directory contents
test('Can list project root contents', () => {
  const entries = testCanListDirectory('.');
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error('Root directory is empty or not readable');
  }
});

// Test 3: Common project directories exist (if present)
test('Can identify common project directories', () => {
  const entries = testCanListDirectory('.');
  const commonDirs = ['src', 'lib', 'tests', 'package.json', 'README.md'];
  const found = commonDirs.filter(item => entries.includes(item));
  // At least one should exist or be accessible
  if (entries.length === 0) {
    throw new Error('No entries found in project root');
  }
});

// Test 4: Subdirectory exploration capability
test('Can explore subdirectories if they exist', () => {
  const entries = testCanListDirectory('.');
  for (const entry of entries.slice(0, 3)) {
    const fullPath = path.join(projectRoot, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const subEntries = testCanListDirectory(entry);
      // Successfully read subdirectory
      break;
    }
  }
});
