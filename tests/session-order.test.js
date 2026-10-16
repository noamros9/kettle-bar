// ci-only: reads the shared library (every couple program, ~5 min cold); the commit hook skips it
// Phase 36 ticket 2 (296–304): a couple day built at `sessionRules: 1` keeps the order of a session: clothed before
// naked and never back, anal then a shower set before her pussy or mouth, a finish closing its set, a removed prop never
// back, one place per set and only grouped moves. Its own checker, apart from the builder's order step. Every couple
// program is built so (ticket 3, 365).
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX } = require('../exercises.js');
const Builder = require('../program-builder.js');
const { tagAll } = require('../session-tags.js');
const { built } = require('./helpers/library.js');

const T = tagAll(EX);
const NEXT = { home: ['home', 'shower'], shower: ['home', 'shower', 'water'], water: ['water', 'shower'] };

function violations(day) {
  const out = [];
  let prev = null, naked = false, dirty = false, on = [];
  const off = new Set();
  day.blocks.forEach((b, bi) => {
    const couple = b.items.filter((it) => T[it.ex] && T[it.ex].place);
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

const couples = Builder.CONFIGS.filter((c) => c.couple && !c.frozen);
const report = (programs) => programs.flatMap((p) => p.days.flatMap((d) => violations(d).map((v) => `${p.id} day ${d.day}: ${v}`)));

test('every couple program is dealt at sessionRules 1 and keeps the order on every day', () => {
  assert.ok(couples.length >= 534, `${couples.length} couple programs`);
  assert.ok(couples.every((c) => c.sessionRules === 1));
  const lib = built(couples.map((c) => c.id));
  assert.equal(lib.length, couples.length);
  const bad = report(lib);
  assert.deepEqual(bad.slice(0, 20), [], `${bad.length} violations`);
});

test('built fresh (not from the cache), a program of each kind keeps the order: shower, water, kink, rough, tease', () => {
  const fresh = ['shower-set-then-tile', 'pool-wall-then-hold', 'kink-ice-wax', 'rough-long-hold', 'tease-dry-holds', 'beach-set-then-fuck']
    .map((id) => Builder.buildConfig(couples.find((c) => c.id === id)));
  assert.deepEqual(report(fresh), []);
});

test('version 0 deals as before, out of order: the checker sees it', () => {
  const old = ['tease-set-then-zip', 'pool-quick-soak', 'grind-circuit-then-fuck'].map((id) => {
    const { sessionRules, ...c } = couples.find((x) => x.id === id);
    return Builder.buildConfig(c);
  });
  assert.ok(report(old).length > 0);
});
