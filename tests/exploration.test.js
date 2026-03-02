const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

console.log('Testing project exploration...');

// Test 1: Verify project root exists
const rootExists = fs.existsSync(projectRoot);
console.log('Test 1 - Project root exists:', rootExists);
if (!rootExists) process.exit(1);

// Test 2: Read directory contents
const items = fs.readdirSync(projectRoot);
console.log('Test 2 - Directory contents:', items);
if (!Array.isArray(items) || items.length === 0) process.exit(1);

// Test 3: Verify we can stat each item
let statCount = 0;
for (const item of items) {
  const itemPath = path.join(projectRoot, item);
  try {
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory() || stat.isFile()) statCount++;
  } catch (e) {}
}
console.log('Test 3 - Successfully stat items:', statCount);
if (statCount === 0) process.exit(1);

console.log('All exploration tests passed!');
