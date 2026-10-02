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
  const root = path.join(__dirname, '..'), ctl = { delay: 0, extra: '' };
  const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml' };
  const srv = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]), file = path.join(root, url === '/' ? 'index.html' : url);
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
  expect(await page.content()).toContain('<!-- v-next -->');
  expect(errors).toEqual([]);
  await context.close(); context.server.close();
});
