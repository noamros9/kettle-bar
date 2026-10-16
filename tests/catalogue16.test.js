// Phase 35 tickets 2a–4l (catalogue 16, decisions 284–288, 368): the threesome exercises, built from their text rows.
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX } = require('../exercises.js');
const { rows } = require('../scripts/emit-trio.js');

const NEW = Object.values(EX).filter((e) => e.added === 16);
// each ticket adds its act kinds here (284)
const COUNTS = { fuck: 36 };

test('catalogue 16 holds each act kind\'s count of threesomes, about two thirds FMF', () => {
  const by = {};
  for (const e of NEW) by[e.sub] = (by[e.sub] || 0) + 1;
  assert.deepEqual(by, COUNTS);
  for (const sub in COUNTS) {
    const fmf = NEW.filter((e) => e.sub === sub && e.trio === 'FMF').length;
    assert.equal(fmf, Math.round(COUNTS[sub] * 2 / 3), `${sub}: FMF`);
  }
});

test('every threesome is a couple exercise with its tag, its placeholder and three figures in every pose', () => {
  for (const e of NEW) {
    assert.equal(e.cat, 'couple', e.id);
    assert.ok(['FMF', 'MMF'].includes(e.trio), e.id);
    assert.ok(e.cue.includes(e.trio === 'FMF' ? '{woman}' : '{man}'), `${e.id}: its placeholder`);
    assert.ok(!e.cue.includes(e.trio === 'FMF' ? '{man}' : '{woman}'), `${e.id}: the other placeholder`);
    assert.ok(!/\{(woman|man)\}/.test(e.name), `${e.id}: names say "another woman / man"`);
    assert.ok(e.poses.length && e.poses.every((p) => p.two && p.three), `${e.id}: three figures`);
    assert.ok(e.muscles.primary.length, e.id);
  }
});

test('in an MMF threesome the men never act on each other (288)', () => {
  const VERB = '(kiss|lick|suck|stroke|touch|grab|rub|hold|jerk|finger|fuck)\\w*';
  const between = new RegExp(`\\{man\\}('s)? (\\w+ ){0,2}${VERB} (you|your)\\b|\\byou(r \\w+)? (\\w+ ){0,2}${VERB} \\{man\\}`, 'i');
  const hits = NEW.filter((e) => e.trio === 'MMF' && between.test(e.cue)).map((e) => e.id);
  assert.deepEqual(hits, []);
});

test('the emit script turns a text line into a row and stops on a line it can\'t use', () => {
  const good = '1. fuck3_test | Missionary, another woman at Mali\'s lips | FMF | fuck_ankles_locked | kneel@over | Mali under you; {woman} kneels at her head.';
  const at = { fuck3_test: 'kneel 40 -6 1', fuck_ankles_locked: 'kneel 40 -6 1' };
  assert.match(rows(good, at), /\['fuck3_test', 'Missionary, another woman at Mali\\'s lips', 'FMF', 'fuck_ankles_locked', 'kneel 40 -6 1', /);
  assert.throws(() => rows(good.replace('{woman}', '{man}'), at), /placeholder/);
  assert.throws(() => rows(good.replace('fuck3_test', 'fuck_ankles_locked'), at), /id taken/);
  assert.throws(() => rows(good + '\n' + good, at), /id taken/);
  assert.throws(() => rows(good, { fuck3_test: 'float 40 -6 1' }), /third/);
  assert.throws(() => rows(good, {}), /third/);
  assert.throws(() => rows(good.replace('| FMF |', '| FFM |'), at), /trio/);
  assert.throws(() => rows(good.replace('fuck_ankles_locked |', 'nope |'), at), /base/);
});
