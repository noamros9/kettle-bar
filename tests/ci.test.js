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

// Phase 12: the deploy serves the pinned Firebase library with the app; firebase-sync.js imports it from there first
test('the Firebase library: the deploy copies the version firebase-sync.js pins, pointing its imports at the copies', () => {
  const { version, local, FILES } = require('../scripts/vendor-firebase.js');
  const V = version(), sync = fs.readFileSync(path.join(__dirname, '..', 'firebase-sync.js'), 'utf8');
  assert.match(V, /^\d+\.\d+\.\d+$/);
  assert.ok(sync.includes('./vendor/firebasejs/${V}'), 'firebase-sync.js tries the copies first');
  FILES.forEach((f) => assert.ok(sync.includes(`lib('${f}')`), f));
  assert.equal(local(`import{a}from"https://www.gstatic.com/firebasejs/${V}/firebase-app.js";`, V), 'import{a}from"./firebase-app.js";');
  const yml = fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', 'deploy.yml'), 'utf8');
  assert.ok(yml.includes('node scripts/vendor-firebase.js _site'));
  assert.match(yml, /cp -r [^\n]*\bfonts\b[^\n]*_site\//, 'the fonts are deployed');
});

// 5 Oct 2026: a Markdown-only PR or push runs nothing (Noam: CI is long, and docs ship nothing)
test('Test and deploy skips Markdown-only changes, on PRs and on main', () => {
  const yml = fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', 'deploy.yml'), 'utf8');
  const ignores = [...yml.matchAll(/paths-ignore: \[(.*)\]/g)].map((m) => m[1]);
  assert.deepEqual(ignores, ["'**.md', 'docs/**'", "'**.md', 'docs/**'"]);
});

// Decision 131 (Phase 22 ticket 1e): light and dark phone tests run as two parallel jobs; deploy waits for all
test('the phone UI tests run as a light and a dark job beside the unit tests; deploy needs both', () => {
  const yml = fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', 'deploy.yml'), 'utf8').replace(/\r/g, '');
  const job = (name) => yml.slice(yml.indexOf(`\n  ${name}:\n`)).split(/\n  [a-z]+:\n/)[1] || '';
  const ui = yml.slice(yml.indexOf('\n  ui:\n'), yml.indexOf('\n  deploy:\n'));
  assert.match(ui, /theme: \[light, dark\]/);
  assert.match(ui, /npx playwright test --project=phone-\$\{\{ matrix\.theme \}\}/);
  assert.match(ui, /name: phone-screenshots-\$\{\{ matrix\.theme \}\}/);
  assert.doesNotMatch(yml.slice(0, yml.indexOf('\n  ui:\n')), /test:ui|playwright test/, 'the unit job runs no UI tests');
  assert.match(yml, /needs: \[test, unit, coverage, ui\]/);
  // decision 313: the unit tests run as two shards with coverage, and one job merges them and applies the gate
  const unit = yml.slice(yml.indexOf('\n  unit:\n'), yml.indexOf('\n  coverage:\n'));
  assert.match(unit, /shard: \[1, 2\]/);
  assert.match(unit, /node scripts\/unit-shard\.js \$\{\{ matrix\.shard \}\}\/2/);
  assert.match(yml.slice(yml.indexOf('\n  coverage:\n'), yml.indexOf('\n  ui:\n')), /node scripts\/coverage-gate\.js lcov-1\/lcov\.info lcov-2\/lcov\.info/);
  // decision 307: the site is built in a step of its own, and the test server only serves it
  assert.match(ui, /run: npm run build\n[\s\S]*UI_PREBUILT: '1'/);
});
