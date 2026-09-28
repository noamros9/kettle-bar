// The build: what files it produces and what goes into the page.
const test = require('node:test');
const assert = require('node:assert');
const { render } = require('../build.js');

const out = render();

test('the build produces the GitHub Pages page, nothing else', () => {
  assert.deepStrictEqual(Object.keys(out), ['index.html']);
});

test('the page has no claude.ai sync left in it (ADR 3)', () => {
  assert.doesNotMatch(out['index.html'], /window\.claude|attachClaudeDb|kind: 'claude'/);
});

test('the page is a whole document with the manifest, Firebase sync and service worker', () => {
  const html = out['index.html'];
  assert.match(html, /^<!doctype html>/);
  assert.match(html, /<link rel="manifest" href="manifest.webmanifest">/);
  assert.match(html, /<script type="module" src="firebase-sync.js"><\/script>/);
  assert.match(html, /serviceWorker.register\("sw.js"\)/);
});

test('the installed app has a "Today\'s workout" shortcut to #today', () => {
  const manifest = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '../manifest.webmanifest'), 'utf8'));
  assert.deepEqual(manifest.shortcuts.map((s) => [s.name, s.url]), [["Today's workout", './#today']]);
  assert.ok(manifest.shortcuts[0].icons.length > 0);
});
