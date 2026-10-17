// Phase 35 tickets 2a–4l (catalogue 16, decisions 284–288, 368): the threesome exercises, built from their text rows.
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX } = require('../exercises.js');
const { rows } = require('../scripts/emit-trio.js');

const NEW = Object.values(EX).filter((e) => e.added === 16);
// each ticket adds its act kinds here (284)
const COUNTS = { fuck: 72, oral: 54, hands: 36, anal: 54, toys: 36, rough: 36, kink: 36, body: 36, rim: 36, edging: 18, massage: 18, tease: 18, threesome: 36 };
// the other pairing (383, 385): half of each act from 2d on, about two thirds FMF
const OTHER = { fuck: 36, oral: 27, anal: 27, rough: 18, kink: 18, body: 18, rim: 18, edging: 9, massage: 9, tease: 9, hands: 18, toys: 18, threesome: 18 };

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

test('the other pairing: half of each act from 2d, two thirds FMF; a colour is the person, the guest man teal (398)', () => {
  for (const sub in OTHER) {
    const other = NEW.filter((e) => e.sub === sub && e.pair === 'other');
    assert.equal(other.length, OTHER[sub], sub);
    assert.equal(other.filter((e) => e.trio === 'FMF').length, Math.round(OTHER[sub] * 2 / 3), `${sub}: FMF`);
  }
  assert.ok(NEW.every((e) => e.pair === undefined || e.pair === 'other'));
  const cols = (e) => e.poses.map((p) => (p.cols || []).join(' '));
  const want = { FMF: '', 'FMF other': 'fig fig3 fig2', MMF: 'fig fig2 figm', 'MMF other': 'figm fig2 fig' };
  NEW.forEach((e) => assert.deepEqual(new Set(cols(e)), new Set([want[e.trio + (e.pair ? ' other' : '')]]), e.id));
  const { figureSVG } = require('../figures.js');
  NEW.filter((e) => e.trio === 'MMF').forEach((e) => assert.ok(!figureSVG(e).includes('--fig3'), `${e.id}: no purple in MMF`));
  const mmf = NEW.find((e) => e.pair === 'other' && e.trio === 'MMF');
  assert.match(figureSVG(mmf), /<circle[^>]+r="7" fill="var\(--fig\)"\/>(?![\s\S]*fill="var\(--fig\)")/); // you, drawn last as the third, in your own colour
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
  // from 2d on a pair column comes after FMF|MMF (383): 'other' becomes the row's seventh field, 'us' adds nothing
  const paired = (pair) => good.replace('| FMF |', `| FMF | ${pair} |`);
  assert.match(rows(paired('other'), at), /'kneel 40 -6 1', '[^']+', 'other'\],$/);
  assert.equal(rows(paired('us'), at), rows(good, at));
  assert.throws(() => rows(paired('them'), at), /pair/);
  // the Threesome kind (390) keeps its base's drawing under its own sub: an eighth field, after the pair (null for us)
  assert.match(rows(paired('us'), at, 'threesome'), /'kneel 40 -6 1', '[^']+', null, 'threesome'],$/);
  assert.match(rows(paired('other'), at, 'threesome'), /'other', 'threesome'],$/);
  assert.ok(NEW.filter((e) => e.sub === 'threesome').every((e) => EX[e.id] && e.poses.every((p) => p.three)));
});
