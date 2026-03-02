/**
 * Test script to verify project exploration capabilities using Node.js
 * Tests directory structure and file existence
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.env.PROJECT_ROOT || '.';
let errors = 0;

function logPass(message) {
    console.log(`✓ ${message}`);
}

function logFail(message) {
    console.log(`✗ ${message}`);
    errors++;
}

function logInfo(message) {
    console.log(`- ${message}`);
}

console.log('=== Testing Project Exploration (Node.js) ===');
console.log(`Project root: ${PROJECT_ROOT}`);

// Test 1: Check if project root exists
try {
    const stats = fs.statSync(PROJECT_ROOT);
    if (stats.isDirectory()) {
        logPass('Project root exists and is accessible');
    } else {
        logFail('Project root is not a directory');
    }
} catch (err) {
    logFail(`Project root does not exist: ${err.message}`);
}

// Test 2: Read directory contents
try {
    const items = fs.readdirSync(PROJECT_ROOT);
    logPass(`Can list project directories (${items.length} items found)`);
    
    const directories = items.filter(item => {
        try {
            return fs.statSync(path.join(PROJECT_ROOT, item)).isDirectory();
        } catch {
            return false;
        }
    });
    
    logInfo(`Directories: ${directories.join(', ') || 'none'}`);
} catch (err) {
    logFail(`Cannot list project directories: ${err.message}`);
}

// Test 3: Check for common project files
const commonFiles = ['package.json', 'README.md', 'tsconfig.json', '.gitignore'];
commonFiles.forEach(file => {
    const filePath = path.join(PROJECT_ROOT, file);
    if (fs.existsSync(filePath)) {
        logPass(`Found ${file}`);
    } else {
        logInfo(`${file} not found (optional)`);
    }
});

// Test 4: Explore directory tree (limited depth)
function countDirectories(dir, depth = 0, maxDepth = 3) {
    if (depth > maxDepth) return { dirs: 0, files: 0 };
    
    let dirs = 0;
    let files = 0;
    
    try {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
            const fullPath = path.join(dir, item);
            try {
                const stats = fs.statSync(fullPath);
                if (stats.isDirectory()) {
                    dirs++;
                    if (depth < maxDepth) {
                        const sub = countDirectories(fullPath, depth + 1, maxDepth);
                        dirs += sub.dirs;
                        files += sub.files;
                    }
                } else {
                    files++;
                }
            } catch (e) {
                // Skip inaccessible items
            }
        });
    } catch (e) {
        // Skip inaccessible directories
    }
    
    return { dirs, files };
}

const structure = countDirectories(PROJECT_ROOT);
logInfo(`Total directories (up to 3 levels): ${structure.dirs}`);
logInfo(`Total files (up to 3 levels): ${structure.files}`);

// Test 5: Verify read access to key directories
const keyDirs = ['src', 'lib', 'tests', 'docs', 'config'];
keyDirs.forEach(dir => {
    const dirPath = path.join(PROJECT_ROOT, dir);
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        logPass(`Directory '${dir}' exists`);
    } else {
        logInfo(`Directory '${dir}' not found (optional)`);
    }
});

console.log('');
if (errors === 0) {
    console.log('=== All exploration tests passed ===');
    process.exit(0);
} else {
    console.log(`=== ${errors} test(s) failed ===`);
    process.exit(1);
}
