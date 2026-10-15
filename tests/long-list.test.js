// Who moves (Phase 26 ticket 2, decisions 53, 153–156): scripts/long-list.js on a made-up library and backup.
const test = require('node:test');
const assert = require('node:assert/strict');
const { longList, startedIn, bucketOf, mapText } = require('../scripts/long-list.js');

const blocks = (...fs) => ({ a: { blocks: fs.map((f) => ({ f })) } });
const P = (id, subject, minutes, extra) => ({ id, subject, minutes, split: 'Full body', dayTypes: blocks('straight'), ...extra });

test('buckets by mid-range: 30.5 short, 35 mid, 35.5 long', () => {
  assert.deepEqual([[30, 31], [34, 36], [35, 36], [22, 26]].map(bucketOf), ['short', 'mid', 'long', 'short']);
});

test('a started program is one with a day done now or in a past round, in an export or any account of a nightly file', () => {
  const exp = { format: 'kettle-bar-progress', programs: { a: { 1: 't' }, b: {} }, rounds: { c: [{ round: 1 }], d: [] } };
  assert.deepEqual([...startedIn(exp)].sort(), ['a', 'c']);
  const nightly = { format: 'kettle-bar-backup', users: { u1: { programs: { a: {} } }, u2: { programs: { e: { 3: 't' } } } } };
  assert.deepEqual([...startedIn(nightly)], ['e']);
});

test('started, frozen and Phase 23 programs never move but count; kept and After dark subjects are left alone', () => {
  const lib = [
    P('done', 'S', [24, 28]), P('frozen', 'S', [24, 28], { frozen: 'x.json' }), P('ii', 'S', [35, 38], { added: 23 }),
    P('m1', 'S', [24, 28]), P('m2', 'S', [20, 24], { split: 'Upper / lower' }), P('m3', 'S', [22, 26], { split: 'Push / pull' }),
    P('busy', 'Busy week', [20, 24]), P('dark', 'Couples', [20, 24]),
  ];
  const out = longList(lib, { started: new Set(['done']) });
  ['done', 'frozen', 'ii', 'busy', 'dark'].forEach((id) => assert.equal(out.map[id], undefined, id));
  assert.deepEqual(Object.keys(out.subjects), ['S']);
  // 6 programs: 3 long (the II and two movers), then 2 at 31–35 (round(6 / 4) = 2, one mover left)
  const S = out.subjects.S;
  assert.deepEqual([S.total, S.long, S.mid], [6, 3, 1]);
  assert.equal(Object.values(out.map).filter((b) => b[0] === 35).length, 2);
  assert.equal(Object.values(out.map).filter((b) => b[0] === 31).length, 1);
  assert.deepEqual(S.shortOf, { long: 0, mid: 1 }, 'one short at 31–35: nothing left to move');
});

test('each subject ends at the spread when it can: half at 35–38, a quarter at 31–35, counting what is there', () => {
  const lib = Array.from({ length: 12 }, (_, i) => P('p' + i, 'S', i < 2 ? [35, 38] : i < 3 ? [31, 34] : [20 + i, 24 + i], { split: 'Split ' + (i % 4) }));
  const S = longList(lib, { started: new Set() }).subjects.S;
  assert.deepEqual([S.long, S.mid, S.short], [6, 3, 3]);
  assert.deepEqual(S.shortOf, { long: 0, mid: 0 });
});

test('movers spread over splits and formats first: no two of one kind while another split has none, then the smaller change', () => {
  const lib = [
    P('ppl-a', 'S', [30, 34], { split: 'Push / pull / legs' }), P('ppl-b', 'S', [29, 33], { split: 'Push / pull / legs' }),
    P('ul', 'S', [20, 24], { split: 'Upper / lower' }), P('ppl-emom', 'S', [21, 25], { split: 'Push / pull / legs', dayTypes: blocks('emom') }),
  ];
  // 4 programs, 2 long: the closer push / pull / legs one, then upper / lower, though ppl-b is the smaller change
  const out = longList(lib, { started: new Set() });
  assert.deepEqual(Object.keys(out.map).filter((id) => out.map[id][0] === 35).sort(), ['ppl-a', 'ul']);
});

test('the map prints as configs/long.js lines, grouped by family', () => {
  const text = mapText({ a: [35, 38], b: [31, 35], c: [35, 38] }, { a: 'strength', b: 'mixed', c: 'strength' });
  assert.equal(text, "  // strength\n  'a': [35, 38],\n  'c': [35, 38],\n  // mixed\n  'b': [31, 35],\n");
});
