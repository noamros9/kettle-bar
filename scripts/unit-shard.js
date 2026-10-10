#!/usr/bin/env node
/* One shard of the unit tests with coverage, for CI's parallel unit jobs (decision 313): node scripts/unit-shard.js 1/2.
   Runs `test:coverage`'s own files and --test-coverage-include list (package.json stays the one source), without its
   thresholds: a shard covers only part of the code. Each shard writes lcov.info; scripts/coverage-gate.js merges the
   shards and applies the gate. */
const { spawnSync } = require('child_process');
const os = require('os');
const pkg = require('../package.json');

const shard = process.argv[2];
if (!/^\d+\/\d+$/.test(shard || '')) { console.error('usage: node scripts/unit-shard.js <n>/<total>'); process.exit(2); }
const script = pkg.scripts['test:coverage'];
const includes = script.match(/--test-coverage-include=\S+/g);
const warm = spawnSync(process.execPath, ['scripts/warm-test-cache.js'], { stdio: 'inherit' });
if (warm.status) process.exit(warm.status);
const args = ['--test', `--test-concurrency=${os.cpus().length}`, '--experimental-test-coverage', ...includes,
  `--test-shard=${shard}`, '--test-reporter=spec', '--test-reporter-destination=stdout',
  '--test-reporter=lcov', '--test-reporter-destination=lcov.info', 'tests/'];
// node --test takes a directory only with a glob; the shell expands tests/*.test.js for test:coverage, so do the same
const fs = require('fs');
args.pop(); fs.readdirSync('tests').filter((f) => f.endsWith('.test.js')).sort().forEach((f) => args.push(`tests/${f}`));
const run = spawnSync(process.execPath, args, { stdio: 'inherit' });
process.exit(run.status === null ? 1 : run.status);
