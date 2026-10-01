#!/usr/bin/env node
// Installs the pre-commit hook (runs on `npm install` via "prepare"): no commit unless the unit tests pass
// with 100% coverage on the core modules, the same gate CI uses (ADR 4).
const fs = require('fs');
const path = require('path');

const hooksDir = path.join(__dirname, '..', '.git', 'hooks');
if (!fs.existsSync(hooksDir)) {
  console.log('install-hooks: no .git/hooks found, skipping.');
  process.exit(0);
}

const hook = `#!/bin/sh
if [ -z "$(git diff --cached --name-only | grep -v '\\.md$')" ]; then echo "Pre-commit: only Markdown changed, no tests to run."; exit 0; fi
echo "Pre-commit: unit tests with the coverage gate..."
if ! npm run -s test:coverage > /tmp/kettle-bar-precommit.log 2>&1; then
  grep -E "^not ok|coverage threshold|does not meet" /tmp/kettle-bar-precommit.log | head -20
  echo "BLOCKED: tests failing or core coverage below 100%. Full log: /tmp/kettle-bar-precommit.log"
  exit 1
fi
echo "Tests and coverage OK."
`;
fs.writeFileSync(path.join(hooksDir, 'pre-commit'), hook, { mode: 0o755 });
console.log('install-hooks: pre-commit hook installed.');
