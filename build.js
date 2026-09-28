// Builds the app: runs the Program Builder and stitches the modules into one self-contained page,
// index.html, served by GitHub Pages (manifest, service worker, Firebase sync).
// `render()` returns the files without writing them (used by the tests); `node build.js` writes them.
const fs = require('fs');
const path = require('path');
const { buildAll } = require('./program-builder.js');

const read = (f) => fs.readFileSync(path.join(__dirname, f), 'utf8');

// order matters: data and pure modules first, then the page modules that use them
const SCRIPTS = ['figures.js', 'exercises.js', null, 'app/progress.js', 'app/store.js', 'app/session.js', 'app/backup.js', 'app/stats.js', 'app/swaps.js', 'app/programs.js', 'app/day.js', 'app/views.js', 'app/clock.js', 'app/main.js'];
const HEAD = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#2346D5"><link rel="manifest" href="manifest.webmanifest"><link rel="icon" type="image/png" href="icons/icon-32.png"><link rel="apple-touch-icon" href="icons/apple-touch-icon.png"></head><body>';
const TAIL = '<script type="module" src="firebase-sync.js"></script><script>if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});</script></body></html>';

function render(programs = buildAll()) {
  const scripts = SCRIPTS.map((f) => `<script>\n${f ? read(f) : `const PROGRAMS = ${JSON.stringify(programs)};`}\n</script>`).join('\n');
  const page = read('app/shell.html')
    .replace('/*__STYLES__*/', () => read('app/styles.css'))
    .replace('<!--__SCRIPTS__-->', () => scripts);
  return { 'index.html': HEAD + page + TAIL };
}

if (require.main === module) {
  const out = render();
  Object.entries(out).forEach(([f, body]) => fs.writeFileSync(path.join(__dirname, f), body));
  console.log('bytes', out['index.html'].length);
}

module.exports = { render };
