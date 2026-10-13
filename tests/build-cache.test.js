// The build cache (build-cache.js, decisions 324, 325, 328): a program's days come from .build-cache/ while its key (the
// builder code, its config and its catalogue slice) is unchanged. Checked on a handful of real configs and a folder under
// test-results/, never on the whole library (decision 312).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const B = require('../program-builder.js');
const { EX } = require('../exercises.js');
const C = require('../build-cache.js');

const dir = (name) => {
  const d = path.join(__dirname, '..', 'test-results', 'build-cache', name);
  fs.rmSync(d, { recursive: true, force: true });
  return d;
};
// one program per catalogue the library uses, and the frozen one
const PICK = (() => {
  const seen = new Set();
  return B.CONFIGS.filter((c) => {
    const k = c.frozen ? 'frozen' : c.catalogue || 0;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
})();
const counting = () => {
  const built = [];
  return { built, build: (cfg) => { built.push(cfg.id); return B.buildConfig(cfg); } };
};
const keyFor = (over = {}) => C.makeKey({ code: 'code', EX, root: path.join(__dirname, '..'), ...over });

test('the sample covers several catalogues and the frozen program', () => {
  assert.ok(PICK.length >= 5);
  assert.ok(PICK.some((c) => c.frozen));
});

test('a cold run builds every program and writes it; a warm run builds none and gives the same JSON', () => {
  const d = dir('warm');
  const a = counting();
  const cold = C.cached(PICK, a.build, { dir: d, key: keyFor() });
  assert.deepEqual(a.built, PICK.map((c) => c.id));
  assert.deepEqual(cold.stats, { hits: 0, misses: PICK.length });
  PICK.forEach((c) => assert.ok(fs.existsSync(path.join(d, 'days', `${c.id}.json`))));
  const b = counting();
  const warm = C.cached(PICK, b.build, { dir: d, key: keyFor() });
  assert.deepEqual(b.built, []);
  assert.deepEqual(warm.stats, { hits: PICK.length, misses: 0 });
  assert.equal(JSON.stringify(warm.programs), JSON.stringify(cold.programs));
});

test('a program read from the cache is what a fresh build gives (JSON-clean: nothing lost on the way)', () => {
  PICK.forEach((c) => {
    const p = B.buildConfig(c);
    assert.deepEqual(JSON.parse(JSON.stringify(p)), p, c.id);
  });
});

test('editing one config rebuilds only that one', () => {
  const d = dir('edit');
  C.cached(PICK, B.buildConfig, { dir: d, key: keyFor() });
  const edited = PICK.map((c, i) => (i === 1 ? { ...c, blurb: `${c.blurb} (edited)` } : c));
  const a = counting();
  const out = C.cached(edited, a.build, { dir: d, key: keyFor() });
  assert.deepEqual(a.built, [PICK[1].id]);
  assert.equal(out.programs[1].blurb, `${PICK[1].blurb} (edited)`);
});

test('a catalogue slice holds the exercises up to that catalogue, in catalogue order', () => {
  const s13 = C.sliceOf(EX, 13);
  assert.ok(s13.every((e) => (e.added || 0) <= 13));
  assert.ok(C.sliceOf(EX, 14).length > s13.length);
  assert.deepEqual(C.sliceOf(EX, undefined), C.sliceOf(EX, 0));
});

test('an exercise only catalogue 14 can draw leaves a catalogue-13 key the same; one in its pools changes it', () => {
  const c13 = B.CONFIGS.find((c) => c.catalogue === 13 && !c.frozen);
  const id14 = Object.keys(EX).find((k) => EX[k].added === 14);
  const id0 = Object.keys(EX).find((k) => !EX[k].added);
  const before = keyFor()(c13);
  assert.equal(keyFor({ EX: { ...EX, [id14]: { ...EX[id14], name: 'Changed' } } })(c13), before);
  assert.equal(keyFor({ EX: { ...EX, zz_new14: { id: 'zz_new14', added: 14 } } })(c13), before);
  assert.notEqual(keyFor({ EX: { ...EX, [id0]: { ...EX[id0], name: 'Changed' } } })(c13), before);
});

test('a changed code hash rebuilds every program', () => {
  const d = dir('code');
  C.cached(PICK, B.buildConfig, { dir: d, key: keyFor() });
  const a = counting();
  C.cached(PICK, a.build, { dir: d, key: keyFor({ code: 'other code' }) });
  assert.equal(a.built.length, PICK.length);
});

test('the frozen program keys on its saved days file too', () => {
  const frozen = PICK.find((c) => c.frozen);
  assert.notEqual(keyFor()(frozen), keyFor()({ ...frozen, frozen: 'programs/../package.json' }));
});

test('cold builds every program but still writes, so the next run is warm', () => {
  const d = dir('cold');
  C.cached(PICK, B.buildConfig, { dir: d, key: keyFor() });
  const a = counting();
  C.cached(PICK, a.build, { dir: d, key: keyFor(), cold: true });
  assert.equal(a.built.length, PICK.length);
  const b = counting();
  C.cached(PICK, b.build, { dir: d, key: keyFor() });
  assert.deepEqual(b.built, []);
});

test('a corrupt cache file is rebuilt, not thrown', () => {
  const d = dir('corrupt');
  C.cached(PICK, B.buildConfig, { dir: d, key: keyFor() });
  fs.writeFileSync(path.join(d, 'days', `${PICK[0].id}.json`), '{ not json');
  const a = counting();
  C.cached(PICK, a.build, { dir: d, key: keyFor() });
  assert.deepEqual(a.built, [PICK[0].id]);
});

test('the code hash covers the builder files and exercises.js from its LOAD block on, not its exercise data', () => {
  const h = C.codeHash();
  assert.match(h, /^[0-9a-f]{64}$/);
  assert.equal(C.codeHash(), h);
  assert.notEqual(C.codeHash(['formats.js']), h);
  assert.ok(C.exercisesCode('a\n  const LOAD = {\n b').startsWith('  const LOAD'));
  assert.throws(() => C.exercisesCode('no block here'), /LOAD/);
});

test('cachedBuild takes the library defaults and a folder and a cold flag', () => {
  const d = dir('defaults');
  const out = C.cachedBuild({ configs: PICK.slice(0, 2), dir: d });
  assert.deepEqual(out.stats, { hits: 0, misses: 2 });
  assert.deepEqual(C.cachedBuild({ configs: PICK.slice(0, 2), dir: d }).stats, { hits: 2, misses: 0 });
  assert.deepEqual(C.cachedBuild({ configs: PICK.slice(0, 2), dir: d, cold: true }).stats, { hits: 0, misses: 2 });
});
