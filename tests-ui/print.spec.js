// Phase 32 ticket 2: the print view. #print/ex-<id>, #print/p-<pid>-d<n>, #print/p-<pid> and #print/random draw a light
// page for paper and open the print dialog once; a program ends with a glossary, each exercise once; offline it still draws.
const fs = require('fs');
const base = require('@playwright/test');
const { test, expect } = require('./fixtures.js');

// window.print is counted, not run: the dialog can't open in a test
const counting = (page) => page.addInitScript(() => { window.__printed = 0; window.print = () => { window.__printed++; }; });
const printedCount = (app) => app.data(() => window.__printed);
const pv = (page) => page.locator('.printview');
async function openPrint(app, hash) {
  await counting(app.page);
  await app.open('#' + hash);
  await expect(pv(app.page)).toBeVisible();
  await expect.poll(() => printedCount(app)).toBe(1);
}
const exercisesOfDay = (w) => [...(w.warmup ? w.warmup.items : []), ...w.blocks.flatMap((b) => b.items), ...(w.cooldown ? w.cooldown.items : [])].map((it) => it.ex);
const distinct = (xs) => [...new Set(xs)];

test('an exercise: its card, light, no top bar, the print dialog once', async ({ app }) => {
  await openPrint(app, 'print/ex-pushup');
  await expect(app.heading()).toHaveText(await app.data(() => EX.pushup.name));
  await expect(pv(app.page).locator('.pbig svg')).toHaveCount(1);
  await expect(pv(app.page)).toContainText(await app.data(() => KBExport.exerciseDose(EX.pushup)));
  await expect(app.page.locator('.top')).toBeHidden();
  expect(await app.data(() => document.documentElement.dataset.theme)).toBe('light');
  expect(await app.data(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(255, 255, 255)');
  await app.data(() => rerender()); // a redraw doesn't print again
  await app.page.waitForTimeout(400);
  expect(await printedCount(app)).toBe(1);
  await app.page.getByRole('button', { name: 'Print again' }).click();
  expect(await printedCount(app)).toBe(2);
  // Back: opened fresh, it goes to the exercise's page; the theme follows the phone again
  await app.page.getByRole('button', { name: '← Back' }).click();
  await expect(app.page).toHaveURL(/#ex-pushup$/);
  await expect(app.page.locator('.top')).toBeVisible();
  expect(await app.data(() => document.documentElement.dataset.theme)).toBeUndefined();
});

test('a day: its title and every exercise of the day, each with its drawing', async ({ app }) => {
  await openPrint(app, 'print/p-three-split-60-d31');
  const w = await app.data(() => days.open('three-split-60', 31).day);
  await expect(app.heading()).toHaveText(`Day 31 · ${w.name}`);
  const ids = exercisesOfDay(w);
  await expect(pv(app.page).locator('.pitem')).toHaveCount(ids.length);
  await expect(pv(app.page).locator('.pitem svg')).toHaveCount(ids.length);
  const text = await pv(app.page).textContent();
  for (const id of ids) expect(text).toContain(await app.data((x) => EX[x].name, id));
});

test('a program: its days, every exercise, and one glossary entry per distinct exercise; its PDF is under 40 pages', async ({ app }, testInfo) => {
  test.setTimeout(120000);
  await openPrint(app, 'print/p-three-split-60');
  const p = await app.data(() => ({ name: prog().name, days: prog().days.map((d) => days.resolved('three-split-60', d.day)) }));
  await expect(app.heading()).toHaveText(p.name);
  await expect(pv(app.page).locator('.pday')).toHaveCount(60);
  const all = distinct(p.days.flatMap(exercisesOfDay));
  await expect(pv(app.page).locator('.pgitem')).toHaveCount(all.length);
  await expect(pv(app.page).locator('.pgitem svg')).toHaveCount(all.length);
  const text = await pv(app.page).locator('.pdays').textContent();
  for (const id of all) expect(text).toContain(await app.data((x) => EX[x].name, id));
  test.skip(testInfo.project.name !== 'phone-light', 'one PDF is enough');
  await app.page.emulateMedia({ media: 'print' });
  const pdf = await app.page.pdf({ format: 'A4', printBackground: true });
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  expect(pages).toBeGreaterThan(5);
  expect(pages).toBeLessThan(40);
  fs.writeFileSync(testInfo.outputPath('program-60-days.pdf'), pdf);
  await app.go('#print/p-three-split-60-d1');
  fs.writeFileSync(testInfo.outputPath('day-1.pdf'), await app.page.pdf({ format: 'A4', printBackground: true }));
});

test('the open random workout prints as a day; none open says so and doesn\'t print', async ({ app }) => {
  await counting(app.page);
  await app.open('#print/random');
  await expect(app.heading()).toHaveText('No random workout open');
  await app.go('#programs');
  await app.page.getByRole('button', { name: /^Random workout/ }).click();
  const sheet = app.page.getByRole('dialog', { name: 'Random workout' });
  await sheet.getByRole('button', { name: 'Start' }).click();
  await expect(app.page).toHaveURL(/#random$/);
  const w = await app.data(() => random.open().day);
  await app.go('#print/random');
  await expect(app.heading()).toHaveText(w.name);
  await expect(pv(app.page).locator('.eyebrow').first()).toContainText('Random workout');
  await expect(pv(app.page).locator('.pitem')).toHaveCount(exercisesOfDay(w).length);
  await expect.poll(() => printedCount(app)).toBe(1); // this one only
});

test('an unknown print link says so and doesn\'t print', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await counting(app.page);
  await app.open('#print/ex-no_such_thing');
  await expect(app.heading()).toHaveText('Nothing to print');
  await app.go('#print/p-three-split-60-d999');
  await expect(app.heading()).toHaveText('Nothing to print');
  await app.page.waitForTimeout(400);
  expect(await printedCount(app)).toBe(0);
});

// the other specs block the service worker; this one allows it, in a context of its own
base.test('offline (the service worker only) a print view still draws', async ({ browser }, testInfo) => {
  base.test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  const context = await browser.newContext({ baseURL: testInfo.project.use.baseURL, serviceWorkers: 'allow', viewport: { width: 390, height: 844 } });
  await context.route('**/firebase-sync.js', (r) => r.fulfill({ body: '', contentType: 'text/javascript' }));
  await context.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ body: '', contentType: 'text/css' }));
  const page = await context.newPage();
  await page.addInitScript(() => { window.print = () => {}; });
  await page.goto('/index.html#p-three-split-60');
  await page.waitForFunction(async () => !!(await navigator.serviceWorker.ready).active);
  await page.reload(); await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await page.locator('#app h1').first().waitFor();
  await page.waitForFunction(async () => (await (await caches.open('kettle-bar-v2')).keys()).some((r) => r.url.includes('/data/three-split-60.json')), null, { timeout: 20000 });
  await context.setOffline(true);
  await page.goto('/index.html#print/p-three-split-60-d2');
  const name = await page.evaluate(() => programs.day('three-split-60', 2).name);
  await expect(page.locator('.printview h1')).toHaveText(`Day 2 · ${name}`);
  await expect(page.locator('.printview .pitem svg').first()).toBeVisible();
  await context.close();
});
