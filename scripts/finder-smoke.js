// The real model, end to end, in CI (Phase 15 ticket 4): `node scripts/finder-smoke.js _site` serves the collected
// site, opens it in Chromium, loads the served model with app/finder-model.js and checks that it understands a
// workout question: a back-care text is closer to "easy for my sore back" than a heavy-lifting one is.
// Needs the vendored files (scripts/vendor-finder.js) and the browser, so it runs in the deploy job, not in npm test.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.onnx': 'application/octet-stream' };
async function main(root) {
  const server = http.createServer((req, res) => {
    const base = path.resolve(root), file = path.join(base, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
    if (!file.startsWith(base) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.statusCode = 404; return res.end(); }
    res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  }).listen(0);
  const port = server.address().port, browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const outside = [], logs = [];
    page.on('console', (m) => logs.push(`${m.type()}: ${m.text()}`.slice(0, 300)));
    page.on('pageerror', (e) => logs.push(`pageerror: ${e.message}`.slice(0, 300)));
    page.on('request', (r) => { if (!r.url().startsWith(`http://localhost:${port}/`) && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) outside.push(r.url()); });
    await page.goto(`http://localhost:${port}/version.json`);
    const r = await page.evaluate(async (base) => { try {
      const { loadEmbedder } = await import(new URL('data/finder-model.js', base).href);
      const t0 = Date.now(), embed = await loadEmbedder(base), t1 = Date.now();
      const [q, back, lift] = await embed(['something easy for my sore back', 'Back care: gentle movement and core work for a back that likes to complain.', 'Heavy barbell deadlifts and squats for maximum strength.']);
      const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
      return { dims: q.length, back: dot(q, back), lift: dot(q, lift), loadMs: t1 - t0, embedMs: Date.now() - t1 };
    } catch (e) { return { error: String(e && e.stack || e).slice(0, 600) }; } }, `http://localhost:${port}/`);
    if (r.error) throw new Error(`${r.error} | console: ${logs.slice(-6).join(' || ')}`);
    console.log(`::notice title=finder smoke::finder model: ${r.dims} dims, loaded in ${r.loadMs} ms, 3 texts in ${r.embedMs} ms; back ${r.back.toFixed(3)} vs lifting ${r.lift.toFixed(3)}`);
    if (r.dims !== 384) throw new Error(`expected 384 dimensions, got ${r.dims}`);
    if (!(r.back > r.lift)) throw new Error('the model ranks heavy lifting above back care for a sore back');
    if (outside.length) throw new Error(`fetched from outside the site: ${outside.join(', ')}`);
  } finally { await browser.close(); server.close(); }
}
/* node:coverage ignore next */
if (require.main === module) main(process.argv[2] || '_site').catch((e) => { console.error(`::error title=finder smoke::${e.message.replace(/\n/g, ' ')}`); process.exit(1); });
