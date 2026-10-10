#!/usr/bin/env node
// Installs the pre-commit hook (runs on `npm install` via "prepare"). Decision 308 (10 Oct 2026): the full unit suite
// with the coverage gate runs in CI on the PR (the merge waits for it), not on every commit: on 2 cores it took 12-15
// minutes. The hook runs only the test files the commit adds or changes, so a broken new test still stops the commit.
const fs = require('fs');
const path = require('path');

const hooksDir = path.join(__dirname, '..', '.git', 'hooks');
if (!fs.existsSync(hooksDir)) {
  console.log('install-hooks: no .git/hooks found, skipping.');
  process.exit(0);
}

const hook = `#!/bin/sh
tests=$(git diff --cached --name-only --diff-filter=AM | grep -E '^tests/.*\\.test\\.js$')
if [ -z "$tests" ]; then echo "Pre-commit: no unit test changed; the full suite runs in CI on the PR (decision 308)."; exit 0; fi
echo "Pre-commit: the changed unit tests: $tests"
if ! node --test $tests > /tmp/kettle-bar-precommit.log 2>&1; then
  grep -E "^not ok" /tmp/kettle-bar-precommit.log | head -20
  echo "BLOCKED: a changed test fails. Full log: /tmp/kettle-bar-precommit.log"
  exit 1
fi
echo "Changed tests OK."
`;
fs.writeFileSync(path.join(hooksDir, 'pre-commit'), hook, { mode: 0o755 });
console.log('install-hooks: pre-commit hook installed.');
