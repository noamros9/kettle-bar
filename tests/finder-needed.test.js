// scripts/finder-needed.js (Phase 24 ticket 10, review V A6): the finder smoke step (98 s) runs on main always, and on a
// PR only when the change can touch the finder.
const test = require('node:test');
const assert = require('node:assert/strict');
const { needed, decide } = require('../scripts/finder-needed.js');

test('files that can touch the finder need the smoke; others do not', () => {
  ['app/finder.js', 'app/finder-model.js', 'scripts/vendor-finder.js', 'scripts/finder-smoke.js', 'build.js', 'app/programs.js', 'package.json', 'package-lock.json']
    .forEach((f) => assert.equal(needed([f]), true, f));
  assert.equal(needed(['app/pages/day.js', 'tests/store.test.js', 'docs/plans/x.md', 'configs/strength.js']), false);
  assert.equal(needed([]), false);
});

test('main always runs it; a PR whose files can\'t be read runs it too', async () => {
  assert.equal(await decide({ event: 'push', files: async () => [] }), true);
  assert.equal(await decide({ event: 'pull_request', files: async () => ['app/day.js'] }), false);
  assert.equal(await decide({ event: 'pull_request', files: async () => ['app/finder.js'] }), true);
  assert.equal(await decide({ event: 'pull_request', files: async () => { throw new Error('HTTP 403'); } }), true);
});
