// `npm run cache:pull` (scripts/cache-pull.js, decision 326): a fresh session starts warm from main's newest
// build-cache branch (decision 330), else its newest build-cache artifact. Checked with git, the artifact listing,
// the download and unzip stubbed.
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

const noBranch = () => { throw new Error("couldn't find remote ref build-cache"); };

test('pull takes the build-cache branch first and touches no artifact', () => {
  const said = [];
  const out = pull({ dir: 'd', branch: (dir) => { said.push(`branch into ${dir}`); }, list: () => assert.fail(), download: () => assert.fail(), unzip: () => assert.fail(), log: (m) => said.push(m) });
  assert.deepEqual(out, { branch: 'build-cache' });
  assert.equal(said[0], 'branch into d');
  assert.match(said[1], /build-cache branch/);
});

test('without the branch, pull downloads the newest artifact and unpacks it into the folder', () => {
  const calls = [];
  const out = pull({
    branch: noBranch,
    log: () => {},
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
  const out = pull({ dir: 'd', branch: noBranch, list: () => [], download: () => assert.fail(), unzip: () => assert.fail(), log: (m) => said.push(m) });
  assert.equal(out, null);
  assert.match(said[0], /no build-cache branch/);
  assert.match(said[1], /no build-cache artifact/);
});

test('an artifact listing that fails (blob storage blocked, no gh) is not an error either', () => {
  const said = [];
  assert.equal(pull({ dir: 'd', branch: noBranch, list: () => { throw new Error('HTTP 403'); }, log: (m) => said.push(m) }), null);
  assert.match(said[1], /HTTP 403/);
});

test('a download that fails (blob storage blocked) is not an error', () => {
  const said = [];
  const out = pull({ dir: 'd', branch: noBranch, list: () => [A(9, '2026-10-13T10:00:00Z')], download: () => { throw new Error('Forbidden'); }, unzip: () => assert.fail(), log: (m) => said.push(m) });
  assert.equal(out, null);
  assert.match(said[1], /artifact 9 couldn't be fetched \(Forbidden\)/);
});
