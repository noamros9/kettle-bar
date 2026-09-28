// Exercise Catalogue and Figure engine.
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX } = require('../exercises.js');
const { figureSVG } = require('../figures.js');

test('every exercise has a name, cue, main muscles and poses', () => {
  Object.values(EX).forEach((e) => {
    assert.ok(e.name && e.cue, e.id);
    assert.ok(e.muscles.primary.length, e.id);
    assert.ok(e.poses.length >= 1, e.id);
  });
});

test('reps never go down from Level I to Level III', () => {
  Object.values(EX).forEach((e) => { assert.ok(e.r[0] <= e.r[1] && e.r[1] <= e.r[2], `${e.id}: ${e.r}`); });
});

test('every exercise draws a figure', () => {
  Object.values(EX).forEach((e) => { const svg = figureSVG(e); assert.match(svg, /^<svg class="fig"/, e.id); assert.ok(!/NaN/.test(svg), `${e.id} has NaN`); });
});
