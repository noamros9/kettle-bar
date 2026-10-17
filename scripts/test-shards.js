#!/usr/bin/env node
/* The unit tests in two CI jobs (Phase 35 ticket 2t5, decision 399): node scripts/test-shards.js covered|alone
   alone    files that run in a job of their own: whole-library checks that take as long as the rest put together and
            are no line's only test, so the coverage gate holds without them (floor: 108 s of 488 s, 17 Oct 2026);
   covered  every other test file, run under the coverage gate (KB_TESTS for npm run test:coverage).
   Locally test:coverage still runs every file. */
const fs = require('fs');

const ALONE = ['tests/floor.test.js'];
const all = () => fs.readdirSync('tests').filter((f) => f.endsWith('.test.js')).map((f) => `tests/${f}`).sort();
function shard(name) {
  if (name === 'alone') return ALONE;
  if (name === 'covered') return all().filter((f) => !ALONE.includes(f));
  throw new Error(`test-shards: covered or alone, not ${name}`);
}

module.exports = { ALONE, all, shard };
if (require.main === module) console.log(shard(process.argv[2]).join(' '));
