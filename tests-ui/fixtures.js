// Shared setup for the phone UI tests: the app in device-only mode (no Firebase), with every page error
// and console error collected and failing the test.
const base = require('@playwright/test');

const test = base.test.extend({
  app: async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`${m.text()} (${m.location().url})`); });
    await page.route('**/firebase-sync.js', (r) => r.fulfill({ body: '', contentType: 'text/javascript' }));
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ body: '', contentType: 'text/css' }));
    const app = {
      page, errors,
      async open(hash = '') { await page.goto('/index.html' + hash); await page.locator('#app h1').first().waitFor(); },
      // change route in the same page; render is synchronous on hashchange
      async go(hash) {
        await page.evaluate((h) => new Promise((done) => {
          if (location.hash === h) { done(); return; }
          window.addEventListener('hashchange', () => setTimeout(done), { once: true });
          location.hash = h;
        }), hash);
      },
      async sidewaysScroll() { return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); },
      async h1() { return (await page.locator('#app h1').first().textContent()).trim(); },
      data: (fn, arg) => page.evaluate(fn, arg),
    };
    await use(app);
    base.expect(errors, 'page and console errors').toEqual([]);
  },
});

module.exports = { test, expect: base.expect };
