// Share a copy by link (Phase 6 ticket 8): a program you built travels as `#add=<code>`, and whoever opens it can add
// the same 60 days. The code carries the config the recipes made (not only the choices), so the days never depend on
// the recipe book of the browser that opens it, and the program's id, which the builder draws the exercises from.
const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('../recipes.js');
const Builder = require('../program-builder.js');
const cat = require('../exercises.js');
const Own = require('../app/own.js');

const recipes = R.of(R.book());
const deps = { build: Builder.build, ex: cat };
const newest = Own.newestCatalogue(cat.EX);
const choices = (extra = {}) => ({ subjects: ['Strength', 'Yoga'], split: 3, minutes: 30, equipment: 'all', formats: ['straight', 'superset', 'flow'], levers: ['weight', 'reps', 'holds', 'holds'], ...extra });
function saved(name = 'Strong and bendy', seed = 's1') {
  const c = Own.fit(recipes, choices());
  const made = { choices: c, seed, catalogue: recipes.book().catalogue };
  return Own.toRecord({ name, ...made, config: Own.configOf(recipes, made) }, '2026-09-30T08:00:00.000Z');
}
const programFrom = (id, record) => Own.programOf(deps, Own.fromRecord(id, record));
// a code made by hand, for links a later version of the app (or a broken copy) might make
async function codeOf(payload) {
  const bytes = new Uint8Array(await new Response(new Blob([JSON.stringify(payload)]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer());
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ---- the plan's test first ----
test('encode -> decode round-trips, and the decoded program has the same 60 days', async () => {
  const record = saved();
  const code = await Own.shareCode(Own.fromRecord('a1', record));
  assert.match(code, /^[A-Za-z0-9_-]+$/, 'safe in a URL as it is');
  const shared = await Own.readShare(code, deps);
  assert.deepEqual(shared, { id: 'a1', name: record.name, choices: record.choices, seed: record.seed, catalogue: record.catalogue, config: record.config });
  // added in another browser: a new record from what the link carried, under the same id, builds the same days
  const { id, ...made } = shared;
  const added = Own.toRecord(made, '2026-10-01T09:00:00.000Z');
  assert.equal(JSON.stringify(programFrom(id, added).days), JSON.stringify(programFrom('a1', record).days));
  assert.notEqual(JSON.stringify(programFrom('b2', added).days), JSON.stringify(programFrom('a1', record).days), 'another id draws other exercises');
});

test('a link from an unknown catalogue version is refused with a message', async () => {
  const record = saved();
  const code = await codeOf({ v: 1, i: 'a1', n: record.name, c: record.choices, s: record.seed, k: newest + 1, g: record.config });
  await assert.rejects(Own.readShare(code, deps), { message: /newer version of the app/ });
});

// ---- the rest ----
test('a link from a newer link format is refused the same way', async () => {
  const record = saved();
  const code = await codeOf({ v: Own.SHARE_VERSION + 1, i: 'a1', n: record.name, c: record.choices, s: record.seed, k: record.catalogue, g: record.config });
  await assert.rejects(Own.readShare(code, deps), { message: /newer version of the app/ });
});

test('a damaged or cut-short link is refused', async () => {
  const good = await Own.shareCode(Own.fromRecord('a1', saved()));
  const damaged = /damaged or cut short/;
  await assert.rejects(Own.readShare('', deps), { message: damaged });
  await assert.rejects(Own.readShare('not base64 at all!', deps), { message: damaged });
  await assert.rejects(Own.readShare(good.slice(0, good.length >> 1), deps), { message: damaged });
  await assert.rejects(Own.readShare(await codeOf('just text'), deps), { message: damaged });
  await assert.rejects(Own.readShare(await codeOf(null), deps), { message: damaged });
  await assert.rejects(Own.readShare(await codeOf([1, 2]), deps), { message: damaged });
  const bytes = btoa('{"v":1}').replace(/=+$/, ''); // not compressed
  await assert.rejects(Own.readShare(bytes, deps), { message: damaged });
});

test('what the link carries is checked as a stored program is, and it must have its config', async () => {
  const r = saved();
  const badId = await codeOf({ v: 1, i: '../x', n: r.name, c: r.choices, s: r.seed, k: r.catalogue, g: r.config });
  await assert.rejects(Own.readShare(badId, deps), { message: /damaged or cut short/ });
  const noSeed = await codeOf({ v: 1, i: 'a1', n: r.name, c: r.choices, k: r.catalogue, g: r.config });
  await assert.rejects(Own.readShare(noSeed, deps), { message: 'This program has no seed.' });
  const noConfig = await codeOf({ v: 1, i: 'a1', n: r.name, c: r.choices, s: r.seed, k: r.catalogue });
  await assert.rejects(Own.readShare(noConfig, deps), { message: /damaged or cut short/ });
  const unbuildable = await codeOf({ v: 1, i: 'a1', n: r.name, c: r.choices, s: r.seed, k: r.catalogue, g: { ...r.config, cycle: [] } });
  await assert.rejects(Own.readShare(unbuildable, deps), { message: /damaged or cut short/ });
});

test('someone else\'s link can only carry what the recipes make: no markup, no other fields, a name that fits', async () => {
  const r = saved();
  const code = (over, name = r.name, c = r.choices) => codeOf({ v: 1, i: 'a1', n: name, c, s: r.seed, k: r.catalogue, g: { ...r.config, ...over } });
  const damaged = { message: /damaged or cut short/ };
  await assert.rejects(Own.readShare(await code({ about: 'Nice <img src=x onerror=alert(1)>' }), deps), damaged);
  await assert.rejects(Own.readShare(await code({ dayTypes: { ...r.config.dayTypes, d1: { ...r.config.dayTypes.d1, label: 'a" onclick="x' } } }), deps), damaged);
  await assert.rejects(Own.readShare(await code({ minutes: ['<b>30</b>', '<b>30</b>'] }), deps), damaged);
  await assert.rejects(Own.readShare(await code({ minutes: [30] }), deps), damaged);
  await assert.rejects(Own.readShare(await code({ minutes: 30 }), deps), damaged);
  await assert.rejects(Own.readShare(await code({ equip: 'laser' }), deps), damaged);
  await assert.rejects(Own.readShare(await code({ script: 'x' }), deps), damaged);
  await assert.rejects(Own.readShare(await code({ blurb: { deep: { er: 'back\\slash' } } }), deps), damaged);
  let deep = 1; for (let i = 0; i < 20; i++) deep = { deep };
  await assert.rejects(Own.readShare(await code({ rests: deep }), deps), damaged);
  await assert.rejects(Own.readShare(await code({}, 'x'.repeat(61)), deps), damaged);
  await assert.rejects(Own.readShare(await code({}, r.name, { ...r.choices, subjects: ['<i>'] }), deps), damaged);
  await assert.rejects(Own.readShare('A'.repeat(12001), deps), damaged);
  const ok = await Own.readShare(await code({ mix: null, rests: { ...r.config.rests, flag: true } }, 'Me & you'), deps); // & is fine: it is escaped where shown
  assert.equal(ok.name, 'Me & you');
});

test('the days you did (frozen days) stay yours: the link carries the program as it is made now', async () => {
  const r = saved();
  const edited = { ...r, frozenDays: { 1: { ...programFrom('a1', r).days[0], title: 'Old day' } } };
  delete edited.frozenDays[1].day;
  const shared = await Own.readShare(await Own.shareCode(Own.fromRecord('a1', edited)), deps);
  assert.equal(shared.frozenDays, undefined);
  const { id, ...made } = shared;
  assert.equal(JSON.stringify(programFrom(id, Own.toRecord(made, 'now')).days), JSON.stringify(programFrom('a1', r).days));
});

test('newestCatalogue is the newest exercise batch this app knows', () => {
  assert.equal(Own.newestCatalogue({ a: {}, b: { added: 3 }, c: { added: 5 } }), 5);
  assert.equal(Own.newestCatalogue({}), 0);
  assert.equal(newest, recipes.book().catalogue, 'the recipe book is made with the same number');
});

test('shareLink puts the code after #add= on the page address', async () => {
  const code = await Own.shareCode(Own.fromRecord('a1', saved()));
  assert.equal(Own.shareLink('https://noamros9.github.io/kettle-bar/index.html', code), `https://noamros9.github.io/kettle-bar/index.html#add=${code}`);
  assert.equal(Own.shareLink('https://x.test/app/#p-own-a1', code), `https://x.test/app/#add=${code}`, 'the page address, without its hash');
});
