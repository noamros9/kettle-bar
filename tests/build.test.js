// The build: what files it produces and what goes into the page.
const test = require('node:test');
const assert = require('node:assert');
const { render } = require('../build.js');

const out = require('./helpers/library.js').rendered();

test('the build produces the page and one data file per program', () => {
  const { CONFIGS } = require('../program-builder.js');
  assert.deepStrictEqual(Object.keys(out).sort(), ['index.html', 'version.json', 'data/library.json', 'data/recipes.json', 'data/recipes.js', 'data/index.json', 'data/muscles.json', 'data/finder.json', 'data/finder-model.js', ...CONFIGS.map((c) => `data/${c.id}.json`)].sort());
  const iron = JSON.parse(out['data/iron-ppl.json']);
  assert.equal(iron.days.length, 60);
});

test('the page carries no programs (Phase 16 ticket 1): no days, no program list; only the list\'s versioned address', () => {
  const html = out['index.html'];
  const gz = require('zlib').gzipSync(html).length;
  assert.doesNotMatch(html, /"days":/);
  assert.doesNotMatch(html, /PROGRAM_SUMMARIES|"dayCount":/);
  const hash = require('crypto').createHash('sha256').update(out['data/library.json']).digest('hex').slice(0, 12);
  const lib = JSON.parse(html.match(/window\.KB_LIBRARY=(\{.*?\});/)[1]);
  assert.equal(lib.url, `data/library.json?v=${hash}`, 'the address changes whenever the list does');
  assert.deepStrictEqual(lib.ids, JSON.parse(out['data/library.json']).map((s) => s.id), 'the ids, in list order, for the progress store');
});

test('a program adds only its id to the first download (Phase 16): 100 more programs cost under 1 KB gzipped', () => {
  const real = require('./helpers/library.js').library();
  const more = real.slice(0, 100).map((p) => ({ ...p, id: p.id + '-copy' }));
  const gz = (ps) => require('zlib').gzipSync(render(ps)['index.html']).length;
  assert.ok(gz([...real, ...more]) - gz(real) < 1024, `${gz([...real, ...more]) - gz(real)} bytes for 100 programs`);
});

test('the first download is at most 350 KB gzipped (Phase 22, decision 95; the gate in CLAUDE.md)', () => {
  const gz = require('zlib').gzipSync(out['index.html']).length;
  assert.ok(gz <= 350 * 1024, `index.html is ${(gz / 1024).toFixed(1)} KB gzipped`);
});

test('data/library.json carries only what the pages that do not load the program need', () => {
  const summaries = JSON.parse(out['data/library.json']);
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
function CONFIGS_PROGRAMS() { return require('./helpers/library.js').library(); }

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
  assert.match(html, /createStore/, 'the code is in (its local name may be shortened; the exported one stays)');
});

test('data/muscles.json holds each library program\'s muscle focus (the muscle map ranks programs by it), shares adding up to 1', () => {
  const focus = JSON.parse(out['data/muscles.json']);
  const { CONFIGS } = require('../program-builder.js');
  assert.deepStrictEqual(Object.keys(focus).sort(), CONFIGS.map((c) => c.id).sort());
  Object.values(focus).forEach((f) => assert.ok(Math.abs(Object.values(f).reduce((a, b) => a + b, 0) - 1) < 0.01));
});

test('version.json and the page carry the same build version, which changes with the page (Phase 12)', () => {
  const v = JSON.parse(out['version.json']).v;
  assert.match(v, /^[0-9a-f]{12}$/);
  assert.ok(out['index.html'].includes(`window.KB_VERSION=${JSON.stringify(v)}`));
});

// Architecture review IV ticket 3: the page's scripts are minified (whitespace, comments, local names); top-level names stay
test('the page is minified: its scripts parse, and the names the page and its tests use are kept', () => {
  const zlib = require('zlib'), page = out['index.html'];
  const scripts = [...page.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  scripts.forEach((code) => { new Function(code); }); // each one parses
  const all = scripts.join('\n');
  // the page's top-level names, which the phone tests reach (store, programs, doneEntries, dayOf…), are not renamed
  ['render', 'rerender', 'store', 'programs', 'doneEntries', 'dayOf', 'paintSync', 'KB_ACTIONS'].forEach((n) => assert.match(all, new RegExp(`(function |const |let |window\\.)${n}\\b`), n));
  assert.ok(!/\/\* Stats: what the days marked done add up to/.test(all), 'comments are gone');
});
