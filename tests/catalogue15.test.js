// Phase 34 ticket 1 (catalogue 15, decision 263): five new breathing drills beside the six cool-down ones. They join
// the pools only at catalogue 15, so nothing built before moves; random workouts and the rest-day flow reach them at
// ticket 3 (266).
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const cat = require('../exercises.js');
const { figureSVG } = require('../figures.js');
const { poolsAt } = require('../program-builder.js');
const { familyOf } = require('../app/library.js');

const hash = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
const all = Object.values(cat.EX);
const added15 = all.filter((e) => e.added === 15);
const breath = (e) => e.cat === 'cooldown' && e.sub === 'breath';

test('five new breathing drills, all cool-downs, none sharing a name or cue with the six before them', () => {
  assert.equal(added15.length, 5);
  assert.ok(added15.every(breath));
  const old = all.filter((e) => breath(e) && e.added !== 15);
  assert.equal(old.length, 6);
  added15.forEach((e) => old.forEach((o) => {
    assert.notEqual(e.name, o.name, e.id);
    assert.notEqual(e.cue, o.cue, e.id);
  }));
});

test('every new one: added 15, a figure that draws, muscles, a cue, holds in seconds for three levels, Breathing', () => {
  added15.forEach((e) => {
    assert.ok(e.poses.length >= 1, e.id);
    const svg = figureSVG(e, e.name);
    assert.ok(svg.startsWith('<svg') && !/NaN|undefined/.test(svg), `${e.id} draws`);
    assert.ok(e.muscles.primary.length, `${e.id} muscles`);
    assert.ok(e.cue.length > 30, `${e.id} cue`);
    assert.equal(e.u, 'sec', e.id);
    assert.equal(e.r.length, 3, `${e.id} levels`);
    assert.deepEqual(familyOf(e), { family: 'stretch', subject: 'breath' }, e.id);
  });
});

test('they join the pools only at catalogue 15: catalogue 14 is exactly as before, and every new one is a cool-down at 15', () => {
  const { breath, ...older } = poolsAt(14); // Phase 34 ticket 2 adds the breath pool, a new name; the rest as before
  assert.equal(hash(older), 'fe2f727e146ecb4a');
  added15.forEach((e) => {
    assert.ok(!Object.values(poolsAt(14)).flat().includes(e.id), `${e.id} is not drawn before 15`);
    assert.ok(poolsAt(15).cooldowns.includes(e.id), `${e.id} is a cool-down at 15`);
  });
  Object.entries(poolsAt(14)).forEach(([name, list]) => assert.deepEqual(poolsAt(15)[name].slice(0, list.length), list, `${name} keeps its order`));
});
