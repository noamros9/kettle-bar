#!/usr/bin/env node
// `npm run pin`: builds only this phase's programs (added: 23 and later), never the whole library. Adds a pin for each
// that has none and checks the pins they have; an existing pin is never changed (but by `--long`, Phase 26's re-timed
// programs). The build's own gate checks the rest.
const fs = require('fs');
const path = require('path');
const { pinOf } = require('./pins.js');

const file = path.join(__dirname, '../tests/fixtures/program-days.json');
const PHASE = 23;

// Pure: `build(config)` gives a program; returns the new pins, the ids added and the problems found.
function pinEntries(configs, pins, build, from = PHASE) {
  const out = { ...pins }, added = [], problems = [];
  configs.filter((c) => (c.added || 0) >= from).forEach((c) => {
    const p = build(c);
    const now = pinOf(p.days);
    if (!out[c.id]) { out[c.id] = now; added.push(c.id); return; }
    if (out[c.id] !== now) problems.push(`${c.id}: its days changed (pinned ${out[c.id].slice(0, 8)}, built ${now.slice(0, 8)})`);
  });
  return { pins: out, added, problems };
}

// Phase 26 (decision 55): the one exception to never re-pinning. Every config with `long` (configs/long.js) is re-pinned
// to its lengthened days; the ids it changed come back in `repinned`, and their pins before in `was` (kept in
// tests/fixtures/long-was.json, so a test can show the days before the pass are the ones that were pinned). Run in the
// ticket that lists them, never after.
function longEntries(configs, pins, build, was = {}) {
  const out = { ...pins }, before = { ...was }, repinned = [];
  configs.filter((c) => c.long).forEach((c) => {
    const now = pinOf(build(c).days);
    if (out[c.id] === now) return;
    if (!before[c.id]) before[c.id] = out[c.id];
    out[c.id] = now; repinned.push(c.id);
  });
  return { pins: out, repinned, was: before };
}

if (require.main === module) {
  const { CONFIGS, buildConfig } = require('../program-builder.js');
  const pins = JSON.parse(fs.readFileSync(file, 'utf8'));
  // `--long`: re-pin the re-timed programs (Phase 26 tickets 3–6)
  if (process.argv.includes('--long')) {
    const wasFile = path.join(__dirname, '../tests/fixtures/long-was.json');
    const out = longEntries(CONFIGS, pins, buildConfig, fs.existsSync(wasFile) ? JSON.parse(fs.readFileSync(wasFile, 'utf8')) : {});
    fs.writeFileSync(file, JSON.stringify(out.pins, null, 2) + '\n');
    fs.writeFileSync(wasFile, JSON.stringify(out.was, null, 2) + '\n');
    console.log(out.repinned.length ? `re-pinned: ${out.repinned.join(', ')}` : 'no re-timed program changed');
    process.exit(0);
  }
  // `--phase 20`: an earlier phase's new programs (Phase 20 resumed after 23, decision 338)
  const at = process.argv.indexOf('--phase');
  const out = pinEntries(CONFIGS, pins, buildConfig, at > 0 ? +process.argv[at + 1] : PHASE);
  if (out.problems.length) { console.error(out.problems.join('\n')); process.exit(1); }
  fs.writeFileSync(file, JSON.stringify(out.pins, null, 2) + '\n');
  console.log(out.added.length ? `pinned: ${out.added.join(', ')}` : 'every phase program was already pinned');
}

module.exports = { pinEntries, longEntries };
