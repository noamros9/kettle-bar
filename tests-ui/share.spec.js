// Share a copy by link (Phase 6 ticket 8): Share on your program's page gives a link; opened in another browser it
// shows the program and adds it, with the same 60 days. Opening it again says you have it.
const base = require('@playwright/test');
const { test, expect } = require('./fixtures.js');

// a browser of its own (its own storage), set up as the app fixture sets up a page; the share sheet stubbed or absent
async function browserOf(browser, testInfo, { share = false, clipboard = true } = {}) {
  const context = await browser.newContext({ ...testInfo.project.use, serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.route('**/firebase-sync.js', (r) => r.fulfill({ body: '', contentType: 'text/javascript' }));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ body: '', contentType: 'text/css' }));
  await page.addInitScript(([share, clipboard]) => {
    window.__shared = []; window.__copied = [];
    if (share) Object.defineProperty(navigator, 'share', { configurable: true, value: (data) => { window.__shared.push(data); return Promise.resolve(); } });
    else Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: (t) => (clipboard ? (window.__copied.push(t), Promise.resolve()) : Promise.reject(new Error('denied'))) } });
  }, [share, clipboard]);
  const open = async (hash) => { await page.goto('/index.html' + hash); await page.locator('#app h1').first().waitFor(); await page.waitForFunction(() => !document.querySelector('#app .loading')); };
  return { page, context, errors, open };
}

async function buildAndSave(page) {
  await page.getByRole('button', { name: 'Build your own' }).click();
  await page.getByRole('group', { name: 'Days in a cycle' }).waitFor();
  await page.getByRole('group', { name: 'Equipment' }).getByRole('button', { name: 'Kettlebell only', exact: true }).click();
  await page.getByLabel('Name').fill('Bells & more');
  await page.getByRole('button', { name: 'Save program' }).click();
  await expect(page.locator('#app h1').first()).toHaveText('Bells & more');
  return page.evaluate(() => route.pid);
}
const daysOf = (page, pid) => page.evaluate((id) => JSON.stringify(programs.get(id).days), pid);

base.test('share a program by link: another browser previews it, adds it with the same 60 days, and knows it has it', async ({ browser }, testInfo) => {
  const one = await browserOf(browser, testInfo);
  await one.open('#programs');
  const pid = await buildAndSave(one.page);
  await one.page.getByRole('button', { name: 'Share' }).click();
  await expect(one.page.locator('.sharenote')).toContainText('Link copied');
  const [link] = await one.page.evaluate(() => window.__copied);
  expect(link).toMatch(/\/index\.html#add=[A-Za-z0-9_-]+$/);
  const days = await daysOf(one.page, pid);

  // the other browser: nothing of the first one's storage
  const two = await browserOf(browser, testInfo);
  await two.open('#programs');
  await expect(two.page.locator('.yours')).toHaveCount(0);
  await two.open(link.slice(link.indexOf('#')));
  await expect(two.page.locator('#app h1').first()).toHaveText('Bells & more');
  await expect(two.page.locator('.eyebrow').first()).toHaveText('Shared with you');
  await expect(two.page.locator('.grid.pv .tile')).toHaveCount(6);
  await expect(two.page.locator('.pvline')).toContainText('kettlebell only');
  expect(await two.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  await two.page.screenshot({ path: testInfo.outputPath('add-page.png') });
  await two.page.getByRole('button', { name: 'Add this program' }).click();

  // its program page, with the very same days, on Your programs
  await expect(two.page.locator('#app h1').first()).toHaveText('Bells & more');
  expect(await two.page.evaluate(() => location.hash)).toBe('#p-' + pid);
  expect(await daysOf(two.page, pid)).toBe(days);
  await two.open('#programs');
  await expect(two.page.locator('.yours .pcard')).toHaveCount(1);

  // the link again: it is already yours, and Open it goes to it
  await two.open(link.slice(link.indexOf('#')));
  await expect(two.page.getByRole('status')).toContainText('already in Your programs');
  await expect(two.page.getByRole('button', { name: 'Add this program' })).toHaveCount(0);
  await two.page.getByRole('button', { name: 'Open it' }).click();
  await expect(two.page.locator('#app h1').first()).toHaveText('Bells & more');
  await two.open('#programs');
  await expect(two.page.locator('.yours .pcard')).toHaveCount(1); // not added twice

  expect(one.errors).toEqual([]); expect(two.errors).toEqual([]);
  await one.context.close(); await two.context.close();
});

base.test('Share uses the phone\'s share sheet where there is one; without a clipboard the link shows to copy', async ({ browser }, testInfo) => {
  base.test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  const sheet = await browserOf(browser, testInfo, { share: true });
  await sheet.open('#programs');
  await buildAndSave(sheet.page);
  await sheet.page.getByRole('button', { name: 'Share' }).click();
  await expect.poll(() => sheet.page.evaluate(() => window.__shared.length)).toBe(1);
  const data = (await sheet.page.evaluate(() => window.__shared))[0];
  expect(data.title).toBe('Bells & more');
  expect(data.url).toMatch(/#add=[A-Za-z0-9_-]+$/);
  await expect(sheet.page.locator('.sharenote')).toHaveCount(0);
  expect(sheet.errors).toEqual([]);
  await sheet.context.close();

  const byHand = await browserOf(browser, testInfo, { clipboard: false });
  await byHand.open('#programs');
  await buildAndSave(byHand.page);
  await byHand.page.getByRole('button', { name: 'Share' }).click();
  const field = byHand.page.getByLabel('Copy this link');
  await expect(field).toBeFocused();
  expect(await field.inputValue()).toMatch(/#add=[A-Za-z0-9_-]+$/);
  expect(byHand.errors).toEqual([]);
  await byHand.context.close();
});

test('a damaged link says so, and the library\'s programs have no Share', async ({ app }) => {
  await app.open('#add=bm90IGEgcHJvZ3JhbQ');
  await expect(app.heading()).toHaveText("This link can't be opened");
  await expect(app.page.getByRole('alert')).toContainText('damaged or cut short');
  await app.open('#programs');
  await app.page.locator('[data-open-prog]').first().click();
  await expect(app.page.getByRole('button', { name: 'Share' })).toHaveCount(0);
});
