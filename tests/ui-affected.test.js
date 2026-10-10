// Which phone UI specs a branch runs locally (scripts/ui-affected.js); CI still runs them all.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { choose, MAP, SMOKE } = require('../scripts/ui-affected.js');

test('the smoke check always runs, even when nothing changed', () => {
  assert.deepEqual(choose([]), SMOKE);
});

test('a changed spec runs itself; a changed module runs its specs; names given run too', () => {
  assert.deepEqual(choose(['tests-ui/travel.spec.js', 'app/library.js', 'app/pages/stats.js'], ['settings']), ['again', 'exercises', 'favourites', 'finder', 'library', 'muscles', 'renders', 'settings', 'stats', 'travel']);
  assert.deepEqual(choose(['app/stats.js']), ['finish', 'renders', 'rounds', 'stats']);
  assert.deepEqual(choose([], ['tests-ui/stats.spec.js']), ['renders', 'stats']);
});

test('every spec MAP names exists', () => {
  const names = [...new Set([...SMOKE, ...MAP.flatMap(([, s]) => s)])];
  assert.deepEqual(names.filter((s) => !fs.existsSync(path.join(__dirname, '..', 'tests-ui', `${s}.spec.js`))), []);
});
