// Program Catalogue: which programs exist, one program's days, and who uses an exercise.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { createProgramCatalogue, inlined } = require('../app/programs.js');
const { buildAll } = require('../program-builder.js');

const day = (n, exs, warm = []) => ({ day: n, blocks: [{ items: exs.map((ex) => ({ ex, n: 5 })) }], warmup: { items: warm.map((ex) => ({ ex, n: 30 })) } });
const programs = [
  { id: 'a', name: 'Alpha', subject: 'Strength', days: [day(1, ['pushup', 'squat'], ['arm_circle']), day(2, ['row'])] },
  { id: 'b', name: 'Bravo', subject: 'Core', days: [{ day: 1, blocks: [{ items: [{ ex: 'plank', n: 30 }] }], cooldown: { items: [{ ex: 'child_pose', n: 60 }] } }] },
];
const cat = createProgramCatalogue(inlined(programs));

test('lists every program without its days, with how many days and which exercises it uses', () => {
  assert.deepEqual(cat.ids(), ['a', 'b']);
  assert.deepEqual(cat.list()[0], { id: 'a', name: 'Alpha', subject: 'Strength', dayCount: 2, exercises: ['arm_circle', 'pushup', 'row', 'squat'] });
  assert.equal(cat.summary('b').name, 'Bravo');
  assert.equal(cat.summary('zzz'), undefined);
  assert.ok(cat.has('a'));
  assert.equal(cat.has('zzz'), false);
});

test('a loaded program and its days; unknown programs and days give nothing', async () => {
  assert.equal(cat.get('a').days.length, 2);
  assert.equal(cat.day('a', 2).blocks[0].items[0].ex, 'row');
  assert.equal(cat.day('a', 3), undefined);
  assert.equal(cat.get('zzz'), undefined);
  assert.equal(cat.day('zzz', 1), undefined);
  assert.equal((await cat.load('b')).name, 'Bravo');
  assert.equal(await cat.load('zzz'), undefined);
});

test('a program not loaded yet: get says nothing until load resolves', async () => {
  let resolveLoad;
  const lazy = createProgramCatalogue({ summaries: [{ id: 'c', name: 'Charlie', dayCount: 1, exercises: ['row'] }], load: () => new Promise((r) => { resolveLoad = r; }) });
  assert.equal(lazy.get('c'), undefined);
  const loading = lazy.load('c');
  assert.equal(lazy.load('c'), loading, 'one load at a time');
  resolveLoad({ id: 'c', name: 'Charlie', days: [day(1, ['row'])] });
  await loading;
  assert.equal(lazy.day('c', 1).blocks[0].items[0].ex, 'row');
  assert.deepEqual(lazy.programsUsing('row'), ['c']);
});

test('programsUsing agrees with scanning every day of every real program', () => {
  const real = buildAll(), all = createProgramCatalogue(inlined(real));
  const uses = (p, id) => p.days.some((w) => [...w.blocks.flatMap((b) => b.items), ...(w.warmup ? w.warmup.items : []), ...(w.cooldown ? w.cooldown.items : [])].some((it) => it.ex === id));
  ['pushup', 'kb_swing', 'plank', 'pullup'].forEach((id) => assert.deepEqual(all.programsUsing(id), real.filter((p) => uses(p, id)).map((p) => p.id), id));
});

test('the page modules read programs only through the catalogue', () => {
  const src = ['app/views.js', 'app/main.js'].map((f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).join('\n');
  assert.equal((src.match(/\bPROGRAMS\b/g) || []).length, 1, 'only where the catalogue is created');
  assert.doesNotMatch(src, /\bPBYID\b/);
});

test('warm-up and cool-down exercises count as used; a day may have neither', () => {
  assert.deepEqual(cat.summary('b').exercises, ['child_pose', 'plank']);
  assert.deepEqual(cat.programsUsing('child_pose'), ['b']);
});
