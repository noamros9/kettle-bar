// Builds the app: runs the Program Builder and stitches the modules into one page, index.html, served by GitHub Pages
// (manifest, service worker, Firebase sync). The page carries only the program list (slim summaries); each program's
// days go to data/<id>.json, build your own's book and code to data/recipes.json and data/recipes.js, and the exercise
// index to data/index.json: loaded when first needed and cached for offline (Program Catalogue, fetched adapter; app/lazy.js).
// `render()` returns the files without writing them (used by the tests); `node build.js` writes them.
const fs = require('fs');
const path = require('path');
const { buildAll } = require('./program-builder.js');
const { summarize, slim, usageIndex } = require('./app/programs.js');
const { refresh } = require('./recipe-book.js');
const { programFocus } = require('./app/stats.js');
const { EX } = require('./exercises.js');
// each library program's muscle focus (the Exercises page's muscle map ranks programs by it): shares to 4 places
const focusIndex = (programs) => Object.fromEntries(programs.map((p) => [p.id, Object.fromEntries(Object.entries(programFocus(p.days, EX)).map(([m, x]) => [m, Math.round(x * 1e4) / 1e4]))]));

const read = (f) => fs.readFileSync(path.join(__dirname, f), 'utf8');

// order matters: data and pure modules first, then the page modules that use them
// the pages (architecture review IV: split from views.js), in this order: ui.js and core.js first (their top-level code
// runs as the page loads), then one file per page
const PAGES = ['app/ui.js', 'app/pages/core.js', 'app/pages/programs.js', 'app/pages/random.js', 'app/pages/build.js', 'app/pages/program.js', 'app/pages/day.js', 'app/pages/exercises.js', 'app/pages/settings.js', 'app/pages/stats.js'];
const SCRIPTS = ['figures.js', 'formats.js', 'exercises.js', null, 'program-builder.js', 'app/lazy.js', 'app/progress.js', 'app/docs.js', 'app/store.js', 'app/session.js', 'app/backup.js', 'app/stats.js', 'app/swaps.js', 'app/programs.js', 'app/own.js', 'app/library.js', 'app/short.js', 'app/warmup.js', 'app/day.js', 'app/random.js', 'app/summary.js', 'app/charts.js', ...PAGES, 'app/clock.js', 'app/main.js'];
const HEAD = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#2346D5"><link rel="manifest" href="manifest.webmanifest"><link rel="icon" type="image/png" href="icons/icon-32.png"><link rel="apple-touch-icon" href="icons/apple-touch-icon.png"></head><body>';
const TAIL = '<script type="module" src="firebase-sync.js"></script><script>if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});</script></body></html>';

// the page's copy of a module without its documentation: the file-top comment and whole-line // comments (the
// source files keep them). Behaviour is unchanged; the first download is ~19 KB (gzipped) smaller.
// minified (architecture review IV ticket 3): whitespace, comments and names inside functions; each script's top-level
// names stay (the scripts share them, and the phone tests reach them), and nothing is rewritten (no compress step)
const { minify_sync: minify } = require('terser');
const small = (src) => minify(src, { compress: false, mangle: { toplevel: false }, format: { comments: false } }).code;
function lean(src) {
  const body = src.startsWith('/*') ? src.slice(src.indexOf('*/') + 2) : src;
  return body.split('\n').filter((line) => !/^\s*\/\/(?!.*\*\/)/.test(line)).join('\n');
}

function render(programs = buildAll()) {
  const scripts = SCRIPTS.map((f) => `<script>\n${f ? small(lean(read(f))) : `const PROGRAM_SUMMARIES = ${JSON.stringify(programs.map((p) => slim(summarize(p))))};`}\n</script>`).join('\n');
  const page = read('app/shell.html')
    .replace('/*__STYLES__*/', () => read('app/styles.css'))
    .replace('<!--__SCRIPTS__-->', () => scripts);
  const data = Object.fromEntries(programs.map((p) => [`data/${p.id}.json`, JSON.stringify(p)]));
  // build your own (the recipe book and the code that reads it), the exercise index (the exercise page's "Also in") and
  // the programs' muscle focus (the muscle map):
  // fetched when first needed and kept for offline, not in the page
  // the build's version (Phase 12): a hash of the page, in the page and in version.json, which the page asks to know
  // when a newer build is out
  const version = require('crypto').createHash('sha256').update(page).digest('hex').slice(0, 12);
  return { 'index.html': HEAD + page.replace('<!--__VERSION__-->', () => `<script>window.KB_VERSION=${JSON.stringify(version)};</script>`) + TAIL, 'version.json': JSON.stringify({ v: version }), ...data, 'data/recipes.json': JSON.stringify(refresh()), 'data/recipes.js': read('recipes.js'), 'data/index.json': JSON.stringify(usageIndex(programs)), 'data/muscles.json': JSON.stringify(focusIndex(programs)) };
}

if (require.main === module) {
  const out = render();
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
  Object.entries(out).forEach(([f, body]) => fs.writeFileSync(path.join(__dirname, f), body));
  console.log('bytes', out['index.html'].length);
}

module.exports = { render, lean, PAGES };
