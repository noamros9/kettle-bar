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

const read = (f) => fs.readFileSync(path.join(__dirname, f), 'utf8');

// order matters: data and pure modules first, then the page modules that use them
const SCRIPTS = ['figures.js', 'formats.js', 'exercises.js', null, 'program-builder.js', 'app/lazy.js', 'app/progress.js', 'app/docs.js', 'app/store.js', 'app/session.js', 'app/backup.js', 'app/stats.js', 'app/swaps.js', 'app/programs.js', 'app/own.js', 'app/library.js', 'app/short.js', 'app/day.js', 'app/random.js', 'app/summary.js', 'app/views.js', 'app/clock.js', 'app/main.js'];
const HEAD = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#2346D5"><link rel="manifest" href="manifest.webmanifest"><link rel="icon" type="image/png" href="icons/icon-32.png"><link rel="apple-touch-icon" href="icons/apple-touch-icon.png"></head><body>';
const TAIL = '<script type="module" src="firebase-sync.js"></script><script>if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});</script></body></html>';

function render(programs = buildAll()) {
  const scripts = SCRIPTS.map((f) => `<script>\n${f ? read(f) : `const PROGRAM_SUMMARIES = ${JSON.stringify(programs.map((p) => slim(summarize(p))))};`}\n</script>`).join('\n');
  const page = read('app/shell.html')
    .replace('/*__STYLES__*/', () => read('app/styles.css'))
    .replace('<!--__SCRIPTS__-->', () => scripts);
  const data = Object.fromEntries(programs.map((p) => [`data/${p.id}.json`, JSON.stringify(p)]));
  // build your own (the recipe book and the code that reads it) and the exercise index (the exercise page's "Also in"):
  // fetched when first needed and kept for offline, not in the page
  return { 'index.html': HEAD + page + TAIL, ...data, 'data/recipes.json': JSON.stringify(refresh()), 'data/recipes.js': read('recipes.js'), 'data/index.json': JSON.stringify(usageIndex(programs)) };
}

if (require.main === module) {
  const out = render();
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
  Object.entries(out).forEach(([f, body]) => fs.writeFileSync(path.join(__dirname, f), body));
  console.log('bytes', out['index.html'].length);
}

module.exports = { render };
