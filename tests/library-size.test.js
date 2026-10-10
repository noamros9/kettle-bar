// Library size (Phase 23 ticket 1): scripts/library-size.js measures what the last build wrote, raw and gzipped.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { measure, FILES } = require('../scripts/library-size.js');

test('measures the files the build wrote, raw and gzipped, and skips the ones it did not', () => {
  const dir = path.join(__dirname, '..', 'test-results', `size-${process.pid}`);
  fs.mkdirSync(path.join(dir, 'data'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), '<p>' + 'a'.repeat(5000) + '</p>');
  fs.writeFileSync(path.join(dir, 'data/library.json'), JSON.stringify([{ id: 'x' }]));
  const rows = measure(dir);
  fs.rmSync(dir, { recursive: true, force: true });
  assert.deepEqual(rows.map((r) => r.file), ['index.html', 'data/library.json']);
  assert.equal(rows[0].raw, 5007);
  assert.ok(rows[0].gzip < rows[0].raw);
  assert.ok(FILES.includes('data/finder.json'));
});
