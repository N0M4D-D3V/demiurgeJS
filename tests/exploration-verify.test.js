const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const dirs = fs.readdirSync(projectRoot).filter(f => {
  try { return fs.statSync(path.join(projectRoot, f)).isDirectory(); }
  catch { return false; }
});

console.log('Explored directories:', dirs.join(', '));
console.log('Test result:', dirs.length > 0 ? 'PASS' : 'FAIL');
