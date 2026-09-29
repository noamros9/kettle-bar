// The Firestore rules and the Firebase adapter: text checks (they run in the console and in the browser, not in node).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const read = (f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const code = (f) => read(f).replace(/\/\/.*$/gm, '');

test('the rules are one match on users/{uid}/{collection}/{doc}, for the four named collections and only the signed-in owner', () => {
  const rules = code('firestore.rules');
  assert.equal((rules.match(/\bmatch\b/g) || []).length, 2, 'the databases match and one for the data');
  assert.match(rules, /match \/users\/\{uid\}\/\{collection\}\/\{doc\}/);
  assert.match(rules, /collection in \['progress', 'programs', 'random', 'prefs'\]/);
  assert.match(rules, /request\.auth != null\s*&& request\.auth\.uid == uid/);
  assert.equal((rules.match(/allow /g) || []).length, 1);
  assert.doesNotMatch(rules, /if true|\*\*/, 'nothing open to everyone or to every path');
});

test('the Firebase adapter reads and writes users/{uid}/<collection>/<id>; progress passes its own collection name', () => {
  const sync = read('firebase-sync.js');
  assert.match(sync, /fs\.doc\(db, 'users', user\.uid, collection, id\)/);
  assert.match(sync, /fs\.collection\(db, 'users', user\.uid, collection\)/);
  const store = read('app/store.js');
  assert.match(store, /r\.subscribe\('progress', pid,/);
  assert.match(store, /r\.write\('progress', pid, doc\)/);
});

test('the nightly script reads progress and the three account collections, and only reads', () => {
  const script = read('scripts/backup-progress.js');
  assert.match(script, /collectionGroup\('progress'\)/);
  assert.match(script, /Docs\.COLLECTIONS/);
  assert.doesNotMatch(script, /\.set\(|\.update\(|\.delete\(|\.add\(|\.create\(|batch\(/, 'ADR 5: no write credentials');
});
