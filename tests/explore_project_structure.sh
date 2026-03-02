#!/bin/bash
# Test script to verify project exploration capabilities
# Tests that the project can be explored and its structure is accessible

set -e

PROJECT_ROOT="${PROJECT_ROOT:-.}"
ERRORS=0

echo "=== Testing Project Exploration ==="
echo "Project root: $PROJECT_ROOT"

# Test 1: Check if project root exists and is accessible
if [ -d "$PROJECT_ROOT" ]; then
    echo "✓ Project root exists and is accessible"
else
    echo "✗ Project root does not exist or is not accessible"
    ERRORS=$((ERRORS + 1))
fi

# Test 2: Check if directories can be listed
if ls "$PROJECT_ROOT" > /dev/null 2>&1; then
    echo "✓ Can list project directories"
else
    echo "✗ Cannot list project directories"
    ERRORS=$((ERRORS + 1))
fi

# Test 3: Count and report subdirectories
SUBDIR_COUNT=$(find "$PROJECT_ROOT" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l)
echo "Found $SUBDIR_COUNT subdirectories in project root"

# Test 4: Check for common project files
COMMON_FILES=("package.json" "README.md" "tsconfig.json" ".gitignore")
for file in "${COMMON_FILES[@]}"; do
    if [ -f "$PROJECT_ROOT/$file" ]; then
        echo "✓ Found $file"
    else
        echo "- $file not found (optional)"
    fi
done

# Test 5: Verify directory structure depth
MAX_DEPTH=$(find "$PROJECT_ROOT" -type d 2>/dev/null | awk -F/ '{print NF}' | sort -rn | head -1)
echo "Maximum directory depth: $MAX_DEPTH"

# Test 6: List top-level directories
echo ""
echo "=== Top-level structure ==="
ls -la "$PROJECT_ROOT" 2>/dev/null || echo "Cannot list directory contents"

echo ""
if [ $ERRORS -eq 0 ]; then
    echo "=== All exploration tests passed ==="
    exit 0
else
    echo "=== $ERRORS test(s) failed ==="
    exit 1
fi
