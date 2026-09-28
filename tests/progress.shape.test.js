// Only Program Progress knows how progress is stored: the adapters and the nightly script pass documents through it.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const read = (f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');

test('the Firebase adapter and the nightly script never name the document\'s fields', () => {
  ['firebase-sync.js', 'scripts/backup-progress.js'].forEach((f) => assert.doesNotMatch(read(f), /\.done\b|'done'|\.swaps\b|'swaps'/, f));
});

test('the store never builds a document itself', () => {
  assert.doesNotMatch(read('app/store.js'), /updatedAt/);
});
