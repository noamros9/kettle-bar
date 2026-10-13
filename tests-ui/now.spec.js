// Do now (Phase 25, #200): one quiet, no-equipment exercise for dead time, from a card on the Programs page or the
// home-screen shortcut (#now). Start runs it (a silent get-ready, one beep, no voice); Done counts it in Stats and
// History, but it is not a trained day.
const { test, expect } = require('./fixtures.js');
const { POOL } = require('../app/now.js');
const { EX } = require('../exercises.js');

const names = POOL.map((id) => EX[id].name);

test('the card offers Random and What I missed; Random opens #now with one exercise of 20 to 30 seconds', async ({ app }, testInfo) => {
  await app.open('#programs');
  const card = app.page.locator('.nowcard');
  await expect(card.getByRole('button', { name: 'Random', exact: true })).toBeVisible();
  await expect(card.getByRole('button', { name: 'What I missed' })).toBeVisible();
  await card.scrollIntoViewIfNeeded();
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/now-card.png` });
  await card.getByRole('button', { name: 'Random', exact: true }).click();
  await expect(app.page).toHaveURL(/#now$/);
  expect(names).toContain(await app.h1());
  await expect(app.page.locator('.nowex svg.fig')).toBeVisible();
  const secs = +(await app.page.locator('.nowex dd').nth(1).textContent()).match(/^(\d+) s/)[1];
  expect(secs).toBeGreaterThanOrEqual(20);
  expect(secs).toBeLessThanOrEqual(30);
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/now-page.png` });
  const first = await app.h1();
  let other = first;
  for (let i = 0; i < 5 && other === first; i++) { await app.page.getByRole('button', { name: 'Another' }).click(); other = await app.h1(); }
  expect(other).not.toBe(first);
});

test('Start runs a silent get-ready, the time, one beep at the end and no voice', async ({ app }) => {
  const { page } = app;
  await page.addInitScript(() => {
    window.kbSaid = []; window.kbBeeps = 0;
    window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
    Object.defineProperty(window, 'speechSynthesis', { value: { speak(u) { window.kbSaid.push(u.text); }, cancel() {} } });
    Object.defineProperty(navigator, 'vibrate', { value: () => { window.kbBeeps++; return true; } });
  });
  await page.clock.install();
  await app.open('#now');
  await page.getByRole('button', { name: 'Random', exact: true }).click();
  const name = await app.h1(), secs = +(await page.locator('.nowex dd').nth(1).textContent()).match(/^(\d+) s/)[1];
  await page.getByRole('button', { name: `Start · ${secs} s` }).click();
  await expect(page.locator('#tlabel')).toHaveText(`Get ready · ${name}`);
  await page.clock.runFor(3500);
  await expect(page.locator('#tlabel')).toHaveText(name);
  expect(await page.evaluate(() => window.kbBeeps)).toBe(0); // the get-ready ends silently
  await page.clock.runFor(secs * 1000 + 500);
  await expect(page.locator('#tlabel')).toHaveText("Time's up");
  expect(await page.evaluate(() => window.kbBeeps)).toBe(1);
  expect(await page.evaluate(() => window.kbSaid)).toEqual([]);
});

test('Done counts it in Stats and History with its own mark, but it is not a trained day', async ({ app }) => {
  await app.open('#now');
  await app.page.getByRole('button', { name: 'What I missed' }).click();
  const name = await app.h1();
  await app.page.getByRole('button', { name: 'Done' }).click();
  await expect(app.page).toHaveURL(/#programs$/);
  await expect(app.page.locator('.rnotice')).toContainText(`Do now done: ${name}`);
  await expect(app.page.locator('.restcard')).toBeVisible(); // still a rest day: nothing trained today
  expect(await app.data(() => random.levels().length)).toBe(0); // the next random workout's level is untouched
  expect(await app.data(() => random.entries().filter((e) => e.now).length)).toBe(1);
  await app.go('#stats');
  await app.page.getByRole('group', { name: 'Stats views' }).getByRole('button', { name: 'History' }).click();
  await app.page.locator('.hday.today').click();
  const mark = app.page.locator('.hlist .hnow');
  await expect(mark).toHaveCount(1);
  await expect(mark).toContainText('Do now');
  await expect(mark).toContainText(name);
  await app.page.getByRole('group', { name: 'Stats views' }).getByRole('button', { name: 'Time' }).click();
  await expect(app.page.locator('#app')).toContainText('Do now');
});

test('the shortcut opens #now with both buttons and nothing picked yet', async ({ app }) => {
  await app.open('#now');
  await expect(app.heading()).toHaveText('Do now');
  await expect(app.page.getByRole('button', { name: 'Random', exact: true })).toBeVisible();
  await expect(app.page.getByRole('button', { name: 'What I missed' })).toBeVisible();
  await expect(app.page.locator('.nowex')).toHaveCount(0);
  const manifest = await app.data(async () => (await fetch('manifest.webmanifest')).json());
  expect(manifest.shortcuts.map((s) => s.url)).toContain('./#now');
});
