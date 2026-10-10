// ci-only: builds or reads the whole program library; the commit hook skips it, CI runs it (decision 312)
// The test helper that builds the library once per run (architecture review IV ticket 5).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { library, hash, sources, cached } = require('./helpers/library.js');

test('the cached library is what buildAll() makes, and each call is a fresh copy', () => {
  const a = library(), b = library();
  assert.notEqual(a, b);
  assert.deepEqual(a.map((p) => p.id), require('../program-builder.js').CONFIGS.map((c) => c.id));
  assert.equal(JSON.stringify(a), JSON.stringify(require('../program-builder.js').buildAll()));
});

test('the cache is named by a hash of every source, so a changed source is never read from a stale copy', () => {
  const files = sources();
  ['program-builder.js', 'exercises.js', path.join('configs', 'strength.js'), path.join('app', 'pages', 'stats.js'), path.join('recipes', 'book.json')].forEach((f) => assert.ok(files.includes(f), f));
  // on a copy in test-results/ (the real files are being read by other test files at the same time)
  const root = path.join(__dirname, '..', 'test-results', '.cache', `hash-${process.pid}`);
  ['configs', 'app/pages', 'recipes'].forEach((d) => fs.mkdirSync(path.join(root, d), { recursive: true }));
  ['a.js', 'configs/b.js', 'app/c.css', 'app/pages/d.js', 'recipes/e.json'].forEach((f) => fs.writeFileSync(path.join(root, f), f));
  try {
    const h = hash(root);
    fs.writeFileSync(path.join(root, 'configs/b.js'), 'changed');
    assert.notEqual(hash(root), h);
    fs.writeFileSync(path.join(root, 'configs/b.js'), 'configs/b.js');
    assert.equal(hash(root), h);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('storing a new cache drops the copies (and crashed writes) left by older sources, so the cache does not grow forever', () => {
  const dir = path.join(__dirname, '..', 'test-results', '.cache', `evict-${process.pid}`);
  fs.mkdirSync(dir, { recursive: true });
  ['library-old.json', 'library-old.json.123.tmp', 'rendered-old.json'].forEach((f) => fs.writeFileSync(path.join(dir, f), '[]'));
  try {
    assert.deepEqual(cached('library', () => [1], dir), [1]);
    assert.deepEqual(fs.readdirSync(dir).sort(), [`library-${hash()}.json`, 'rendered-old.json']);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});