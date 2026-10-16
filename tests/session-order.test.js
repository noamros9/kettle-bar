// ci-only: builds every couple program at sessionRules 1 (~5 min cold) and reads the shared library; the commit hook skips it
// Phase 36 ticket 2 (296–304): a couple day built at `sessionRules: 1` keeps the order of a session: clothed before
// naked and never back, anal then a shower set before her pussy or mouth, a finish closing its set, a removed prop never
// back, one place per set and only grouped moves. Its own checker, apart from the builder's order step. Version 0 (no
// `sessionRules`) builds exactly as before: every couple program's pin holds.
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX } = require('../exercises.js');
const Builder = require('../program-builder.js');
const { tagAll } = require('../session-tags.js');
const { pinOf } = require('../scripts/pins.js');
const PINS = require('./fixtures/program-days.json');
const path = require('path');
const { cachedBuild } = require('../build-cache.js');
const { built } = require('./helpers/library.js');

const T = tagAll(EX);
const NEXT = { home: ['home', 'shower'], shower: ['home', 'shower', 'water'], water: ['water', 'shower'] };

function violations(day) {
  const out = [];
  let prev = null, naked = false, dirty = false, on = [];
  const off = new Set();
  day.blocks.forEach((b, bi) => {
    const couple = b.items.filter((it) => T[it.ex]);
    if (!couple.length) return;
    const places = new Set(couple.map((it) => T[it.ex].place));
    if (places.size > 1) out.push(`block ${bi}: ${[...places].join(' and ')}`);
    const place = T[couple[0].ex].place;
    if (prev && !NEXT[prev].includes(place)) out.push(`block ${bi}: ${prev} to ${place}`);
    prev = place;
    if (place === 'shower') dirty = false;
    b.items.forEach((it, i) => {
      const t = T[it.ex];
      if (!t) return;
      if (naked && ['clothed', 'undress'].includes(t.dress)) out.push(`${it.ex}: dressed after naked`);
      if (dirty && (t.pussy || t.herMouth)) out.push(`${it.ex}: after anal with no shower`);
      t.props.filter((p) => off.has(p)).forEach((p) => out.push(`${it.ex}: ${p} again`));
      if (t.finish && i !== b.items.length - 1) out.push(`${it.ex}: a finish before the set's end`);
      if (['undress', 'naked'].includes(t.dress)) naked = true;
      if (t.anal) dirty = true;
      on.filter((p) => !t.props.includes(p)).forEach((p) => off.add(p));
      on = t.props;
    });
  });
  return out;
}

// Recipes the order step can't mend (ticket 3 changes them): Strip and tease days are all tease sets, each starting
// dressed; Pool and Hot tub open with a warm-up set only home can hold, then the water with no shower between.
const RECIPES_LATER = ['Strip and tease', 'Pool', 'Hot tub'];
const couples = Builder.CONFIGS.filter((c) => c.couple && !c.frozen);
const report = (programs) => programs.flatMap((p) => p.days.flatMap((d) => violations(d).map((v) => `${p.id} day ${d.day}: ${v}`)));

test('every couple program built at sessionRules 1 keeps the order on every day', () => {
  assert.ok(couples.length >= 534, `${couples.length} couple programs`);
  // their own cache folder: the cache names a program's file by its id, and main's version-0 days live under it
  const { programs } = cachedBuild({ configs: couples.map((c) => ({ ...c, sessionRules: 1 })), dir: path.join(__dirname, '..', '.build-cache', 'session-rules') });
  const bad = report(programs.filter((p) => !RECIPES_LATER.includes(p.subject)));
  assert.deepEqual(bad.slice(0, 20), [], `${bad.length} violations`);
  // what their recipes can't help yet: only these two kinds
  const later = report(programs.filter((p) => RECIPES_LATER.includes(p.subject)));
  assert.deepEqual(later.filter((v) => !/dressed after naked|home to water/.test(v)), []);
});

test('at version 0 the couple programs build as before: the checker finds the old disorder, and every pin holds', () => {
  const lib = built(couples.map((c) => c.id));
  assert.equal(lib.length, couples.length);
  assert.ok(report(lib).length > 0);
  const changed = lib.filter((p) => PINS[p.id] && pinOf(p.days) !== PINS[p.id]).map((p) => p.id);
  assert.deepEqual(changed, []);
  assert.ok(lib.filter((p) => PINS[p.id]).length >= 500);
});
