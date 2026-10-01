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
