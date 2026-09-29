#!/usr/bin/env node
// Pins new programs: adds a sha256 of each program's days to tests/fixtures/program-days.json for every program
// that isn't pinned yet (`npm run pin`). Never changes an existing pin: days people have started must not move, so
// changing a pinned program means deleting its line on purpose.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { buildAll } = require('../program-builder.js');

const file = path.join(__dirname, '../tests/fixtures/program-days.json');
const pins = JSON.parse(fs.readFileSync(file, 'utf8'));
const added = [];
buildAll().forEach((p) => {
  if (pins[p.id]) return;
  pins[p.id] = crypto.createHash('sha256').update(JSON.stringify(p.days)).digest('hex');
  added.push(p.id);
});
fs.writeFileSync(file, JSON.stringify(pins, null, 2) + '\n');
console.log(added.length ? `pinned: ${added.join(', ')}` : 'every program was already pinned');
