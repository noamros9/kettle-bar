// `npm run cache:pull` (scripts/cache-pull.js, decision 326): a fresh session starts warm from main's newest
// build-cache artifact. Checked on canned artifact listings with the download and unzip stubbed.
const test = require('node:test');
const assert = require('node:assert/strict');
const { newest, pull } = require('../scripts/cache-pull.js');

const A = (id, created, more = {}) => ({ id, name: 'build-cache', expired: false, created_at: created, workflow_run: { head_branch: 'main' }, ...more });

test("newest picks main's latest build-cache artifact that hasn't expired", () => {
  const list = [
    A(1, '2026-10-10T10:00:00Z'),
    A(2, '2026-10-12T10:00:00Z', { expired: true }),
    A(3, '2026-10-11T10:00:00Z'),
    A(4, '2026-10-13T10:00:00Z', { name: 'phone-screenshots-light' }),
    A(5, '2026-10-13T11:00:00Z', { workflow_run: { head_branch: 'build/x' } }),
  ];
  assert.equal(newest(list).id, 3);
  assert.equal(newest([]), null);
});

test('pull downloads the newest one and unpacks it into the folder', () => {
  const calls = [];
  const out = pull({
    dir: '/tmp/x/.build-cache',
    list: () => [A(7, '2026-10-12T10:00:00Z'), A(8, '2026-10-13T10:00:00Z')],
    download: (id, file) => calls.push(['download', id, file]),
    unzip: (file, dir) => calls.push(['unzip', file, dir]),
  });
  assert.equal(out.id, 8);
  assert.deepEqual(calls.map((c) => c[0]), ['download', 'unzip']);
  assert.equal(calls[0][1], 8);
  assert.equal(calls[1][2], '/tmp/x/.build-cache');
});

test('with no artifact it says so and pulls nothing', () => {
  const said = [];
  const out = pull({ dir: 'd', list: () => [], download: () => assert.fail(), unzip: () => assert.fail(), log: (m) => said.push(m) });
  assert.equal(out, null);
  assert.match(said[0], /no build-cache artifact/);
});
