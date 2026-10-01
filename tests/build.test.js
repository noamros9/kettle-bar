// The build: what files it produces and what goes into the page.
const test = require('node:test');
const assert = require('node:assert');
const { render } = require('../build.js');

const out = render();

test('the build produces the page and one data file per program', () => {
  const { CONFIGS } = require('../program-builder.js');
  assert.deepStrictEqual(Object.keys(out).sort(), ['index.html', 'data/recipes.json', 'data/recipes.js', 'data/index.json', 'data/muscles.json', ...CONFIGS.map((c) => `data/${c.id}.json`)].sort());
  const iron = JSON.parse(out['data/iron-ppl.json']);
  assert.equal(iron.days.length, 60);
});

test('the page carries only the program list: small to download (gzipped, as Pages serves it), no days inside', () => {
  const html = out['index.html'];
  const gz = require('zlib').gzipSync(html).length;
  assert.ok(gz < 150 * 1024, `index.html is ${Math.round(gz / 1024)} KB gzipped`);
  assert.doesNotMatch(html, /"days":/);
  assert.match(html, /const PROGRAM_SUMMARIES = \[/);
});

test('the first download is at most 125 KB gzipped (ticket 7b); the gate above stays at 150', () => {
  const gz = require('zlib').gzipSync(out['index.html']).length;
  assert.ok(gz <= 125 * 1024, `index.html is ${(gz / 1024).toFixed(1)} KB gzipped`);
});

test('the summaries in the page carry only what the pages that do not load the program need', () => {
  const summaries = JSON.parse(out['index.html'].match(/const PROGRAM_SUMMARIES = (\[.*?\]);\n/)[1]);
  const { CONFIGS } = require('../program-builder.js');
  assert.equal(summaries.length, CONFIGS.length);
  const allowed = ['id', 'name', 'subject', 'split', 'minutes', 'formats', 'equip', 'dayCount', 'about'];
  summaries.forEach((s) => {
    assert.deepStrictEqual(Object.keys(s).filter((k) => !allowed.includes(k)), [], `${s.id} carries more than it needs`);
    assert.ok(s.id && s.name && s.subject && s.split && s.minutes && s.dayCount && s.about, s.id);
    const full = JSON.parse(out[`data/${s.id}.json`]);
    assert.equal(s.dayCount, full.days.length);
    assert.ok((full.about || full.blurb).startsWith(s.about), `${s.id}: the card's sentence is the start of the paragraph`);
    assert.ok(s.about.length < 250, `${s.id}: only the first sentence`);
  });
});

test('data/index.json says which programs use each exercise (the exercise page\'s "Also in"), loaded on demand', () => {
  const index = JSON.parse(out['data/index.json']);
  const { summarize } = require('../app/programs.js');
  const expected = {};
  CONFIGS_PROGRAMS().forEach((p) => summarize(p).exercises.forEach((ex) => { (expected[ex] = expected[ex] || []).push(p.id); }));
  assert.deepStrictEqual(index, expected);
  assert.doesNotMatch(out['index.html'], /"exercises":/, 'no per-program exercise lists in the page');
});
function CONFIGS_PROGRAMS() { return require('../program-builder.js').buildAll(); }

test('build your own is not in the page: its code is data/recipes.js, loaded when #build first opens', () => {
  assert.doesNotMatch(out['index.html'], /function recipeFor|const GRID|root\.KBRecipes/);
  assert.equal(out['data/recipes.js'], require('fs').readFileSync(require('path').join(__dirname, '../recipes.js'), 'utf8'));
  assert.match(out['index.html'], /data\/recipes\.js/);
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

test('the page carries each module without its documentation: no file-top comment, no whole-line // comments', () => {
  const { lean } = require('../build.js');
  assert.equal(lean('/* doc\n   more */\n(function () {\n  // a note\n  const a = 1; // kept: code on the line\n  const url = "https://x"; \n})();'),
    '\n(function () {\n  const a = 1; // kept: code on the line\n  const url = "https://x"; \n})();');
  assert.equal(lean('const a = 1;\n// x */ y\n'), 'const a = 1;\n// x */ y\n', 'a line that closes a block comment stays');
  const html = out['index.html'];
  assert.doesNotMatch(html, /Program Progress: one program's done days/, 'the modules\' doc blocks are out');
  assert.match(html, /function createStore\(/, 'the code is in');
});

test('data/muscles.json holds each library program\'s muscle focus (the muscle map ranks programs by it), shares adding up to 1', () => {
  const focus = JSON.parse(out['data/muscles.json']);
  const { CONFIGS } = require('../program-builder.js');
  assert.deepStrictEqual(Object.keys(focus).sort(), CONFIGS.map((c) => c.id).sort());
  Object.values(focus).forEach((f) => assert.ok(Math.abs(Object.values(f).reduce((a, b) => a + b, 0) - 1) < 0.01));
});
