// Decision 128: a push to main skips the unit and UI tests when its tree is the tree a green PR run tested.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { decide, tested } = require('../scripts/tested-tree.js');

test('decide: only the same tree with a green PR run counts as tested', () => {
  assert.equal(decide({ tree: 't1', prTree: 't1', prRunGreen: true }), true);
  assert.equal(decide({ tree: 't1', prTree: 't2', prRunGreen: true }), false, 'another tree');
  assert.equal(decide({ tree: 't1', prTree: 't1', prRunGreen: false }), false, 'red or missing run');
  assert.equal(decide({ tree: 't1', prTree: null, prRunGreen: true }), false, 'no PR');
});

// a fake GitHub API: main's squash commit 'm' of PR 7 (head 'h'); trees and runs set per case
const api = ({ prs = [{ number: 7, head: { sha: 'h' } }], mainTree = 'T', headTree = 'T', runs = [{ name: 'Test and deploy', conclusion: 'success' }] } = {}) => async (p) => {
  if (p === 'commits/m/pulls') return prs;
  if (p === 'commits/m') return { commit: { tree: { sha: mainTree } } };
  if (p === 'commits/h') return { commit: { tree: { sha: headTree } } };
  if (p === 'actions/runs?head_sha=h&event=pull_request') return { workflow_runs: runs };
  throw new Error(`unexpected ${p}`);
};

test('tested: a squash merge of a PR whose run passed on the same tree', async () => {
  assert.equal(await tested(api(), 'm'), true);
});

test('tested: not when the trees differ, the run failed or is another workflow, or there is no PR', async () => {
  assert.equal(await tested(api({ headTree: 'U' }), 'm'), false);
  assert.equal(await tested(api({ runs: [{ name: 'Test and deploy', conclusion: 'failure' }] }), 'm'), false);
  assert.equal(await tested(api({ runs: [{ name: 'Nightly backup', conclusion: 'success' }] }), 'm'), false);
  assert.equal(await tested(api({ prs: [] }), 'm'), false);
});

test('tested: any API error means test as usual', async () => {
  assert.equal(await tested(async () => { throw new Error('rate limited'); }, 'm'), false);
});

test('deploy.yml: on pushes, the unit and UI steps run only when the tree was not tested; the deploy steps always run', () => {
  const yml = fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', 'deploy.yml'), 'utf8').replace(/\r/g, '');
  assert.match(yml, /id: tested\n\s+if: github\.event_name == 'push'\n\s+run: node scripts\/tested-tree\.js/);
  const step = (name) => yml.slice(yml.indexOf(`- name: ${name}`)).split('\n      - ')[0];
  const SKIP = "if: steps.tested.outputs.tested != 'true'";
  ['Unit tests', 'Phone UI tests'].forEach((n) => assert.ok(step(n).includes(SKIP), n));
  ['Build', 'Collect the site'].forEach((n) => assert.ok(!step(n).includes(SKIP), n));
  assert.match(yml, /actions: read/);
  assert.match(yml, /pull-requests: read/);
});
