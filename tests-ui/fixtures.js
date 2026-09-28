// Shared setup for the phone UI tests: the app in device-only mode (no Firebase), with every page error
// and console error collected and failing the test.
const base = require('@playwright/test');

const test = base.test.extend({
  app: async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const allowed = [];
    page.on('console', (m) => { const t = `${m.text()} (${m.location().url})`; if (m.type() === 'error' && !allowed.some((re) => re.test(t))) errors.push(t); });
    await page.route('**/firebase-sync.js', (r) => r.fulfill({ body: '', contentType: 'text/javascript' }));
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ body: '', contentType: 'text/css' }));
    const app = {
      page, errors,
      // errors a test causes on purpose (e.g. cutting the network), matched on "message (url)"
      allowErrors(re) { allowed.push(re); },
      async open(hash = '') { await page.goto('/index.html' + hash); await page.locator('#app h1').first().waitFor(); await this.loaded(); },
      // programs load when opened: wait until the page isn't showing "Loading…"
      async loaded() { await page.waitForFunction(() => !document.querySelector('#app .loading')); },
      // change route in the same page; render is synchronous on hashchange
      async go(hash) {
        await page.evaluate((h) => new Promise((done) => {
          if (location.hash === h) { done(); return; }
          window.addEventListener('hashchange', () => setTimeout(done), { once: true });
          location.hash = h;
        }), hash);
        await this.loaded();
      },
      async sidewaysScroll() { return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); },
      // the page heading as a locator, for assertions that wait until a new page has drawn
      heading: () => page.locator('#app h1').first(),
      async h1() { return (await page.locator('#app h1').first().textContent()).trim(); },
      data: (fn, arg) => page.evaluate(fn, arg),
    };
    await use(app);
    base.expect(errors, 'page and console errors').toEqual([]);
  },
});

module.exports = { test, expect: base.expect };
