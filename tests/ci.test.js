// CI runs the phone tests in Playwright's image: its version must be the one package.json installs.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('the CI image is the Playwright version in package.json', () => {
  const pkg = require('../package.json');
  const yml = fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', 'deploy.yml'), 'utf8');
  const image = /mcr\.microsoft\.com\/playwright:v([\d.]+)-/.exec(yml);
  assert.ok(image, 'deploy.yml names the Playwright image');
  assert.equal(image[1], pkg.devDependencies['@playwright/test']);
});

// Phase 11: no action on a deprecated major (Node 20: checkout / setup-node / upload-artifact v4), every job pins its runner
const workflows = () => fs.readdirSync(path.join(__dirname, '..', '.github', 'workflows')).map((f) => [f, fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', f), 'utf8')]);

test('no workflow uses an action major that runs on Node 20', () => {
  const OLD = { 'actions/checkout': 4, 'actions/setup-node': 4, 'actions/upload-artifact': 4, 'actions/upload-pages-artifact': 3, 'actions/deploy-pages': 4 };
  for (const [f, yml] of workflows()) {
    for (const [, name, major] of yml.matchAll(/uses:\s*([\w-]+\/[\w-]+)@v(\d+)/g)) {
      if (OLD[name] !== undefined) assert.ok(+major > OLD[name], `${f}: ${name}@v${major}`);
    }
  }
});

test('every job pins its runner (not ubuntu-latest, which moves to Ubuntu 26 on 19 Oct 2026)', () => {
  for (const [f, yml] of workflows()) {
    const runs = [...yml.matchAll(/runs-on:\s*(\S+)/g)].map((m) => m[1]);
    assert.ok(runs.length > 0, f);
    runs.forEach((r) => assert.equal(r, 'ubuntu-24.04', `${f}: runs-on ${r}`));
  }
});
