#!/usr/bin/env node
// Own-program pins (Phase 24 ticket 6, code review C1): writes tests/fixtures/own-days.json once. An own program is
// stored as its config and rebuilt with today's builder on every load, so nothing else would notice a builder change
// that reshuffles one you're halfway through. The fixture holds one stored record per recipe-book subject and a few
// mixes, as the page saves them, and the SHA-256 of the days each builds; tests/own-pins.test.js checks them.
// Run it only to add records; an existing pin is never rewritten (like the library's pins).
const fs = require('fs');
const path = require('path');
const R = require('../recipes.js');
const Own = require('../app/own.js');
const Builder = require('../program-builder.js');
const cat = require('../exercises.js');
const { pinOf } = require('./pins.js');

const FILE = path.join(__dirname, '../tests/fixtures/own-days.json');
const NOW = '2026-10-13T00:00:00.000Z';
const MIXES = [['Strength', 'Yoga'], ['Kettlebell only', 'Pilates'], ['Boxing', 'Flexibility', 'Legs & glutes'], ['HIIT', 'Mobility & posture']];

// the stored records: [id, record], made from today's book with fixed seeds
// the committed book as it is (never made again here: a builder change makes the book stale, and remaking it takes
// minutes; its own test says when it is stale)
function records(recipes = R.of(require('../recipe-book.js').stored().book)) {
  const one = (subjects) => {
    let choices = Own.defaults(recipes, subjects[0]);
    subjects.slice(1).forEach((s) => { choices = Own.toggle(recipes, choices, s); });
    choices = Own.fit(recipes, choices);
    if (Own.problem(recipes, choices)) return null;
    const made = { choices, seed: 'pin-' + subjects.join('+'), catalogue: recipes.book().catalogue };
    return Own.toRecord({ name: subjects.join(' + '), ...made, config: Own.configOf(recipes, made) }, NOW);
  };
  const slug = (subjects) => 'pin-' + subjects.join('-').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return [...Own.subjects(recipes).map((s) => [s.name]), ...MIXES]
    .map((subjects) => [slug(subjects), one(subjects)]).filter(([, r]) => r);
}
const daysOf = (id, record) => Own.programOf({ build: Builder.build, ex: cat }, Own.fromRecord(id, record)).days;

module.exports = { records, daysOf, FILE };

/* node:coverage ignore next 8 */ // run by hand
if (require.main === module) {
  const old = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : {};
  const out = { ...old };
  records().forEach(([id, record]) => { if (!out[id]) out[id] = { record, days: pinOf(daysOf(id, record)) }; });
  fs.writeFileSync(FILE, JSON.stringify(out, null, 1) + '\n');
  console.log(`${Object.keys(out).length - Object.keys(old).length} added, ${Object.keys(out).length} pinned`);
}
