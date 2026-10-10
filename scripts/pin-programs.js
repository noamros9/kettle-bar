#!/usr/bin/env node
// `npm run pin`: builds only this phase's programs (added: 23 and later), never the whole library. Adds a pin for each
// that has none and checks the pins they have; an existing pin is never changed. The build's own gate checks the rest.
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

if (require.main === module) {
  const { CONFIGS, buildConfig } = require('../program-builder.js');
  const pins = JSON.parse(fs.readFileSync(file, 'utf8'));
  const out = pinEntries(CONFIGS, pins, buildConfig);
  if (out.problems.length) { console.error(out.problems.join('\n')); process.exit(1); }
  fs.writeFileSync(file, JSON.stringify(out.pins, null, 2) + '\n');
  console.log(out.added.length ? `pinned: ${out.added.join(', ')}` : 'every phase program was already pinned');
}

module.exports = { pinEntries };
