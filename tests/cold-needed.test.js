// scripts/cold-needed.js (Phase 35, decision 409): main's cold build check (decision 327, ~5 min) runs only when the
// build cache's code hash changed. The keys hash the data (exercises, configs), so a stale cache can only come from code.
const test = require('node:test');
const assert = require('node:assert/strict');
const { needed, FILES } = require('../scripts/cold-needed.js');

const EX = (head, code) => `${head}\n  const LOAD = {\n${code}`;
const tree = (over = {}) => (f) => ({ 'exercises.js': EX('names', 'code'), ...over })[f] ?? `${f} v1`;

test('the cold check runs when the cache\'s code or build.js changed, not for data', () => {
  assert.ok(FILES.includes('program-builder.js') && FILES.includes('recipes.js') && FILES.includes('build.js'));
  assert.equal(needed(tree(), tree()), false);
  assert.equal(needed(tree(), tree({ 'program-builder.js': 'v2' })), true);
  assert.equal(needed(tree(), tree({ 'build.js': 'v2' })), true);
  assert.equal(needed(tree(), tree({ 'exercises.js': EX('new names and cues', 'code') })), false, 'text before LOAD is data');
  assert.equal(needed(tree(), tree({ 'exercises.js': EX('names', 'new code') })), true);
  assert.equal(needed(tree(), tree({ 'configs/strength.js': 'v2' })), false);
});

test('anything unclear runs it: a file that can\'t be read at either commit', () => {
  const broken = () => { throw new Error('no HEAD^'); };
  assert.equal(needed(broken, tree()), true);
  assert.equal(needed(tree(), (f) => (f === 'recipes.js' ? broken() : tree()(f))), true);
});
