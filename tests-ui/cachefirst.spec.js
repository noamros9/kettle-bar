// Phase 12 ticket 1: the page opens from the service worker's cache at once and updates behind it; a new version on
// the server shows "A new version is ready · Reload". The other specs block the service worker; this one allows it.
const base = require('@playwright/test');
const { expect } = base;
const http = require('http');
const fs = require('fs');
const path = require('path');

// Requests the service worker makes don't reach Playwright's routes, so each test runs its own little server, whose
// page can be slowed down or changed: { delay: ms for index.html, extra: text added to index.html, version: what
// version.json says }
function server() {
  const root = path.join(__dirname, '..'), ctl = { delay: 0, extra: '', hits: {} };
  const TYPES = { '.woff2': 'font/woff2', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml' };
  const srv = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]), file = path.join(root, url === '/' ? 'index.html' : url);
    ctl.hits[url] = (ctl.hits[url] || 0) + 1;
    if (ctl.files && ctl.files[url] !== undefined) { res.writeHead(200, { 'Content-Type': 'text/javascript' }).end(ctl.files[url]); return; }
    fs.readFile(file, (err, body) => {
      if (err) { res.writeHead(404).end(); return; }
      if (url.endsWith('/version.json') && ctl.version) { res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ v: ctl.version })); return; }
      const page = file.endsWith('index.html');
      const send = () => res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' }).end(page && ctl.extra ? String(body).replace('</body>', ctl.extra + '</body>') : body);
      if (page && ctl.delay) setTimeout(send, ctl.delay); else send();
    });
  });
  return new Promise((ok) => srv.listen(0, () => ok({ ctl, url: `http://localhost:${srv.address().port}`, close: () => srv.close() })));
}

async function sw(browser, testInfo) {
  const s = await server();
  const context = await browser.newContext({ baseURL: s.url, serviceWorkers: 'allow', viewport: { width: 390, height: 844 } });
  context.server = s;
  const errors = [];
  await context.route('**/firebase-sync.js', (r) => r.fulfill({ body: '', contentType: 'text/javascript' }));
  await context.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ body: '', contentType: 'text/css' }));
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/index.html');
  await page.locator('#app h1').first().waitFor();
  await page.waitForFunction(async () => { const r = await navigator.serviceWorker.ready; return !!r.active; });
  await page.reload(); // now controlled by the worker, which caches what it serves
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await page.locator('#app h1').first().waitFor();
  await page.waitForFunction(async () => !!(await caches.match(new URL('index.html', location.href).href)) || !!(await caches.match(location.href)));
  return { context, page, errors };
}

base.test('with a slow network the page draws from the cache at once', async ({ browser }, testInfo) => {
  base.test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  const { context, page, errors } = await sw(browser, testInfo);
  context.server.ctl.delay = 5000;
  const t0 = Date.now();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('#app h1').first().waitFor();
  expect(Date.now() - t0).toBeLessThan(2500); // the network is held for 5 s
  expect(errors).toEqual([]);
  await context.close(); context.server.close();
});

base.test('a new version on the server shows "A new version is ready" and Reload brings it in', async ({ browser }, testInfo) => {
  base.test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  const { context, page, errors } = await sw(browser, testInfo);
  context.server.ctl.extra = '<!-- v-next -->'; context.server.ctl.version = 'next';
  await page.reload();
  await expect(page.getByRole('status').filter({ hasText: 'A new version is ready' })).toBeVisible();
  await page.getByRole('button', { name: 'Reload' }).click();
  await page.locator('#app h1').first().waitFor();
  await expect.poll(() => page.content().catch(() => ''), { message: 'the reloaded page is the new version' }).toContain('<!-- v-next -->'); // the reload may still be settling
  expect(errors).toEqual([]);
  await context.close(); context.server.close();
});

// Phase 12 ticket 3: the fonts and the sync library come with the app, so offline the page looks the same and sync starts
const V = /^const V = '([\d.]+)';/m.exec(fs.readFileSync(path.join(__dirname, '..', 'firebase-sync.js'), 'utf8'))[1];
const STUBS = { // just enough of the library for firebase-sync.js to start: nobody is signed in
  'firebase-app.js': 'window.__fbLoaded = (window.__fbLoaded || 0) + 1; export const initializeApp = () => ({});',
  'firebase-auth.js': 'export const getAuth = () => ({}); export class GoogleAuthProvider { setCustomParameters() {} } export const getRedirectResult = () => Promise.resolve(); export const onAuthStateChanged = (a, cb) => cb(null); export const signOut = () => Promise.resolve();',
  'firebase-firestore.js': 'export const initializeFirestore = () => ({}); export const persistentLocalCache = () => ({}); export const persistentMultipleTabManager = () => ({}); export const getFirestore = () => ({});',
};

base.test('offline after one visit: the page keeps its fonts, and sync starts from the cached library', async ({ browser }, testInfo) => {
  base.test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  const s = await server();
  s.ctl.files = Object.fromEntries(Object.entries(STUBS).map(([f, code]) => [`/vendor/firebasejs/${V}/${f}`, code]));
  const context = await browser.newContext({ baseURL: s.url, serviceWorkers: 'allow', viewport: { width: 390, height: 844 } });
  const page = await context.newPage(), errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/index.html');
  await page.waitForFunction(async () => !!(await navigator.serviceWorker.ready).active);
  await page.reload(); await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await page.waitForFunction(() => window.__fbLoaded >= 1 && document.fonts.status === 'loaded');
  await page.waitForFunction(async () => (await (await caches.open('kettle-bar-v2')).keys()).some((r) => r.url.includes('/fonts/barlow-condensed')));
  await context.setOffline(true);
  await page.reload();
  await page.locator('#app h1').first().waitFor();
  await page.waitForFunction(() => window.__fbLoaded >= 1, null, { timeout: 5000 });
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => [document.fonts.check('800 30px "Barlow Condensed"'), document.fonts.check('400 16px "Barlow"')])).toEqual([true, true]);
  expect(await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')))).toContain('Barlow Condensed');
  expect(errors).toEqual([]);
  await context.close(); s.close();
});

// Phase 15 ticket 5: the finder's files are pinned (scripts/vendor-finder.js), so once cached they are not fetched again
// behind the page (the runtime is 14 MB); the model's own files are cached by the model's library, not twice
base.test('the finder\'s runtime comes from the cache without asking again; its model files are left to the model', async ({ browser }, testInfo) => {
  base.test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  const { context, page, errors } = await sw(browser, testInfo);
  context.server.ctl.files = { '/vendor/finder/transformers.min.js': 'export const x = 1;', '/vendor/finder/models/m/config.json': '{}' };
  const get = (u) => page.evaluate((x) => fetch(x).then((r) => r.text()), u);
  expect(await get('vendor/finder/transformers.min.js')).toBe('export const x = 1;');
  expect(await get('vendor/finder/transformers.min.js')).toBe('export const x = 1;');
  await get('vendor/finder/models/m/config.json');
  await page.waitForTimeout(500); // a refresh behind the page would have reached the server by now
  expect(context.server.ctl.hits['/vendor/finder/transformers.min.js']).toBe(1);
  expect(await page.evaluate(async () => !!(await caches.match(new URL('vendor/finder/models/m/config.json', location.href).href)))).toBe(false);
  expect(errors).toEqual([]);
  await context.close(); context.server.close();
});
