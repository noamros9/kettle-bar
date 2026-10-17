// The recipe book from the build cache (decisions 324, 325, 328): a stale book no longer re-runs every trial; each day
// type's trial and each mix part's is read from .build-cache/recipes/ while its inputs are unchanged. A few real configs
// and a folder under test-results/, never the whole library (decision 312).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const B = require('../program-builder.js');
const { EX } = require('../exercises.js');
const { generate, generateCached } = require('../recipe-book.js');
const C = require('../build-cache.js');

const pick = (...ids) => ids.map((id) => B.CONFIGS.find((c) => c.id === id));
const dir = (name) => {
  const d = path.join(__dirname, '..', 'test-results', 'build-cache', name);
  fs.rmSync(d, { recursive: true, force: true });
  return d;
};
const memoIn = (d, code = 'code') => C.recipeMemo({ dir: d, code, EX });
const BASE = pick('yin-deep-stretch', 'heavy-duty');

test('a warm generate runs no trials and gives the same book as one made without the cache', () => {
  const d = dir('book-warm');
  const plain = generate({ configs: BASE });
  const cold = memoIn(d);
  assert.deepEqual(generate({ configs: BASE, memo: cold }), plain);
  assert.ok(cold.stats.misses > 0);
  assert.equal(cold.stats.hits, 0);
  const warm = memoIn(d);
  assert.deepEqual(generate({ configs: BASE, memo: warm }), plain);
  assert.equal(warm.stats.misses, 0);
  assert.equal(warm.stats.hits, cold.stats.misses);
});

test('a new config runs only its own trials', () => {
  const d = dir('book-new');
  generate({ configs: BASE, memo: memoIn(d) });
  const m = memoIn(d);
  const configs = [...BASE, ...pick('morning-25')];
  assert.deepEqual(generate({ configs, memo: m }), generate({ configs }));
  assert.ok(m.stats.hits > 0);
  assert.ok(m.missed.every((inputs) => !JSON.stringify(inputs).includes('heavy-duty')));
});

test("a changed lever set in a subject reruns that subject's trials, not the others'", () => {
  const d = dir('book-levers');
  generate({ configs: BASE, memo: memoIn(d) });
  const m = memoIn(d);
  const configs = [...BASE, ...pick('balance-flow')]; // Yoga gains the variation lever
  assert.deepEqual(generate({ configs, memo: m }), generate({ configs }));
  const trials = m.missed.filter(([kind]) => kind === 'trial');
  assert.ok(trials.some((inputs) => JSON.stringify(inputs).includes('yin-deep-stretch')), 'Yoga reran');
  assert.ok(trials.every((inputs) => !JSON.stringify(inputs).includes('heavy-duty')), 'Strength did not');
});

test('another code hash or catalogue slice misses; the same inputs hit; a corrupt file is made again', () => {
  const d = dir('book-keys');
  const make = (m, cat = 14) => m(['part', 'x', cat], () => ({ n: 1 }));
  const a = memoIn(d);
  assert.deepEqual(make(a), { n: 1 });
  const b = memoIn(d);
  make(b);
  assert.equal(b.stats.hits, 1);
  const c = memoIn(d, 'other code');
  make(c);
  assert.equal(c.stats.misses, 1);
  const e = memoIn(d);
  make(e, 13);
  assert.equal(e.stats.misses, 1);
  fs.readdirSync(path.join(d, 'recipes')).forEach((f) => fs.writeFileSync(path.join(d, 'recipes', f), 'nope'));
  const f = memoIn(d);
  assert.deepEqual(make(f), { n: 1 });
  assert.equal(f.stats.misses, 1);
});

test('the book cache keys on the recipe code: its own files beyond the builder', () => {
  assert.ok(C.RECIPE_CODE.includes('recipes.js') && C.RECIPE_CODE.includes('recipe-book.js') && C.RECIPE_CODE.includes('app/families.js'));
  // the Exercises page's code is not the book's: a tab or chip change never makes the book cold (Phase 35 ticket 2t3)
  assert.ok(!C.RECIPE_CODE.includes('app/library.js'));
  assert.notEqual(C.codeHash(C.RECIPE_CODE), C.codeHash());
  const m = C.recipeMemo({ dir: dir('book-defaults') });
  assert.deepEqual(m(['part', 'y', 0], () => 7), 7);
  assert.equal(m.stats.misses, 1);
});

test('generateCached makes the book through the cache in a given folder, or KB_BUILD_CACHE', () => {
  const d = dir('book-cached');
  assert.deepEqual(generateCached({ configs: BASE, dir: d }), generate({ configs: BASE }));
  assert.ok(fs.readdirSync(path.join(d, 'recipes')).length > 0);
  const e = dir('book-env');
  process.env.KB_BUILD_CACHE = e;
  try { generateCached({ configs: BASE }); } finally { delete process.env.KB_BUILD_CACHE; }
  assert.ok(fs.readdirSync(path.join(e, 'recipes')).length > 0);
});
