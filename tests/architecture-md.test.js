const fs = require('fs');
const path = require('path');

const ARCHITECTURE_FILE = path.join(process.cwd(), 'ARCHITECTURE.md');

function testArchitectureFileExists() {
  if (!fs.existsSync(ARCHITECTURE_FILE)) {
    throw new Error('ARCHITECTURE.md does not exist at project root');
  }
}

function testArchitectureFileHasContent() {
  const content = fs.readFileSync(ARCHITECTURE_FILE, 'utf8');
  if (content.length < 100) {
    throw new Error('ARCHITECTURE.md is too short (less than 100 characters)');
  }
}

function testArchitectureFileHasMarkdownStructure() {
  const content = fs.readFileSync(ARCHITECTURE_FILE, 'utf8');
  if (!content.includes('#')) {
    throw new Error('ARCHITECTURE.md does not contain markdown headers');
  }
}

function testArchitectureFileHasArchitecturalContent() {
  const content = fs.readFileSync(ARCHITECTURE_FILE, 'utf8').toLowerCase();
  const hasArchitectureTerms = /module|component|layer|service|dependency|architecture/i.test(content);
  if (!hasArchitectureTerms) {
    throw new Error('ARCHITECTURE.md does not contain architectural terms');
  }
}

testArchitectureFileExists();
testArchitectureFileHasContent();
testArchitectureFileHasMarkdownStructure();
testArchitectureFileHasArchitecturalContent();
console.log('All tests passed');
