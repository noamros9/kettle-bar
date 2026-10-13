/* The build cache (Node only; decisions 324, 325, 328): .build-cache/ keeps each program the build made under a key, and
   a build reads a program whose key is unchanged instead of building it again. Same bytes out as a cold build; the pin
   gate (scripts/pins.js) still checks every program, read or built.
     codeHash(files) -> SHA-256 of the builder's code: the files below and exercises.js from its LOAD block on (the gear
       rules and rep scaling), not its exercise data. A code change drops the whole cache (325).
     sliceOf(EX, catalogue) -> the exercises a program at that catalogue can see (added <= catalogue), in file order: a
       new catalogue-14 exercise leaves a catalogue-13 program's key alone, an edit to one it can draw changes it (328).
     makeKey({ code, EX, root }) -> cfg => key: the code hash, the config as JSON and its catalogue slice (a frozen
       program also its saved days file).
     cached(configs, build, { dir, key, cold }) -> { programs, stats: { hits, misses } }: reads <dir>/days/<id>.json
       ({ key, program }) on a matching key, else builds and writes it. `cold` reads nothing but still writes.
     cachedBuild({ configs, build, dir, cold }) -> the same with the library's configs, builder and key. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const CODE = ['program-builder.js', 'formats.js', 'app/length.js', 'build-cache.js'];

const sha = (...parts) => {
  const h = crypto.createHash('sha256');
  parts.forEach((p) => h.update(p).update('\0'));
  return h.digest('hex');
};
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

function exercisesCode(src) {
  const at = src.indexOf('  const LOAD = {');
  if (at < 0) throw new Error('build-cache: exercises.js has no LOAD block to start its code hash from');
  return src.slice(at);
}
const codeHash = (files = CODE) => sha(...files.map((f) => `${f}\n${read(f)}`), exercisesCode(read('exercises.js')));

const sliceOf = (EX, catalogue) => Object.values(EX).filter((e) => (e.added || 0) <= (catalogue || 0));

function makeKey({ code, EX, root = ROOT }) {
  const slices = new Map();
  const slice = (cat) => {
    if (!slices.has(cat)) slices.set(cat, sha(JSON.stringify(sliceOf(EX, cat))));
    return slices.get(cat);
  };
  return (cfg) => sha(code, JSON.stringify(cfg), slice(cfg.catalogue || 0), cfg.frozen ? fs.readFileSync(path.join(root, cfg.frozen), 'utf8') : '');
}

function readHit(file, key) {
  try {
    const saved = JSON.parse(fs.readFileSync(file, 'utf8'));
    return saved.key === key ? saved.program : null;
  } catch {
    return null; // missing or corrupt: build it again
  }
}

function cached(configs, build, { dir, key, cold = false }) {
  const stats = { hits: 0, misses: 0 };
  fs.mkdirSync(path.join(dir, 'days'), { recursive: true });
  const programs = configs.map((cfg) => {
    const k = key(cfg);
    const file = path.join(dir, 'days', `${cfg.id}.json`);
    const hit = cold ? null : readHit(file, k);
    if (hit) { stats.hits++; return hit; }
    const program = build(cfg);
    stats.misses++;
    fs.writeFileSync(file, JSON.stringify({ key: k, program }));
    return program;
  });
  return { programs, stats };
}

function cachedBuild({ configs, build, dir = path.join(ROOT, '.build-cache'), cold = false } = {}) {
  const B = require('./program-builder.js');
  const key = makeKey({ code: codeHash(), EX: require('./exercises.js').EX });
  return cached(configs || B.CONFIGS, build || B.buildConfig, { dir, key, cold });
}

module.exports = { codeHash, exercisesCode, sliceOf, makeKey, cached, cachedBuild };
