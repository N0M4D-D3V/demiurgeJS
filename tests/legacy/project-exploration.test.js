const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
console.log('Testing project root:', projectRoot);

if (!fs.existsSync(projectRoot)) {
  console.error('FAIL: Project root does not exist');
  process.exit(1);
}

const entries = fs.readdirSync(projectRoot);
if (entries.length === 0) {
  console.error('FAIL: Project root is empty');
  process.exit(1);
}

console.log('PASS: Project directory exists with', entries.length, 'entries');
process.exit(0);