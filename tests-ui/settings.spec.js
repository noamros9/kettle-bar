// Settings: reached from the header; Backup exports every program's done days as one file.
const fs = require('fs');
const { test, expect } = require('./fixtures.js');

test('the gear in the header opens Settings, which fits the phone', async ({ app }, testInfo) => {
  await app.open('#programs');
  await app.page.getByRole('button', { name: 'Settings' }).click();
  await expect(app.page).toHaveURL(/#settings$/);
  await expect(app.heading()).toHaveText('Settings');
  await expect(app.page.getByRole('heading', { name: 'Backup' })).toBeVisible();
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/settings.png` });
});

test('Export downloads a file with the days marked done', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await app.open('#p-three-split-60');
  await app.page.getByRole('checkbox', { name: 'Mark day 1 done' }).click();
  await app.page.getByRole('checkbox', { name: 'Mark day 2 done' }).click();
  await app.go('#settings');
  await expect(app.page.getByText('2 days done across 1 program')).toBeVisible();
  const [download] = await Promise.all([app.page.waitForEvent('download'), app.page.getByRole('button', { name: 'Export progress' }).click()]);
  expect(download.suggestedFilename()).toMatch(/^kettle-bar-progress-\d{4}-\d\d-\d\d\.json$/);
  const file = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
  expect(file.format).toBe('kettle-bar-progress');
  expect(Object.keys(file.programs['three-split-60'])).toEqual(['1', '2']);
  expect(Object.keys(file.programs)).toHaveLength(29);
});

// ---------- Import: show the diff, then merge, replace or cancel ----------
const backupFile = (programs, extra = {}) => ({
  name: 'kettle-bar-progress-2026-09-01.json', mimeType: 'application/json',
  buffer: Buffer.from(JSON.stringify({ format: 'kettle-bar-progress', version: 1, exportedAt: '2026-09-01T10:00:00.000Z', programs, ...extra })),
});
const T = '2026-09-01T10:00:00.000Z';
const fromFile = { 'three-split-60': { 2: T, 3: T, 4: T }, 'retired-program': { 1: T } };

async function setup(app) {
  await app.open('#p-three-split-60');
  for (const n of [1, 2]) await app.page.getByRole('checkbox', { name: `Mark day ${n} done` }).click();
  await app.go('#settings');
}
const chooseFile = (app, file) => app.page.locator('#import-file').setInputFiles(file);
const checked = (app) => app.data(() => [1, 2, 3, 4, 5].filter((n) => store.isDone('three-split-60', n)));

test('choosing a file shows what would change, per program, before anything changes', async ({ app }, testInfo) => {
  await setup(app);
  await chooseFile(app, backupFile(fromFile));
  const review = app.page.locator('#import-review');
  await expect(review).toContainText('kettle-bar-progress-2026-09-01.json');
  await expect(review).toContainText('Three-Split 60: +2 days (3–4) · −1 day (1)');
  await expect(review).toContainText("Skipped 1 program this app doesn't have: retired-program");
  await expect(app.page.getByRole('button', { name: 'Merge: add 2 days' })).toBeVisible();
  await expect(app.page.getByRole('button', { name: 'Replace: add 2, remove 1' })).toBeVisible();
  expect(await checked(app)).toEqual([1, 2]);
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/settings-import.png` });
});

test('Merge keeps days from both', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await setup(app);
  await chooseFile(app, backupFile(fromFile));
  await app.page.getByRole('button', { name: 'Merge: add 2 days' }).click();
  await expect(app.page.getByRole('status')).toHaveText('Merged: 2 days added.');
  await expect(app.page.locator('#import-review')).toHaveCount(0);
  expect(await checked(app)).toEqual([1, 2, 3, 4]);
  await app.page.reload(); await app.page.locator('#app h1').waitFor();
  expect(await checked(app)).toEqual([1, 2, 3, 4]);
});

test('Replace makes the program match the file', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await setup(app);
  await chooseFile(app, backupFile(fromFile));
  await app.page.getByRole('button', { name: 'Replace: add 2, remove 1' }).click();
  await expect(app.page.getByRole('status')).toHaveText('Replaced: 2 days added, 1 removed.');
  expect(await checked(app)).toEqual([2, 3, 4]);
});

test('Cancel changes nothing', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await setup(app);
  await chooseFile(app, backupFile(fromFile));
  await app.page.getByRole('button', { name: 'Cancel' }).click();
  await expect(app.page.locator('#import-review')).toHaveCount(0);
  expect(await checked(app)).toEqual([1, 2]);
});

test('a file that is not a backup changes nothing and says why; a matching one has nothing to import', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await setup(app);
  await chooseFile(app, { name: 'notes.json', mimeType: 'application/json', buffer: Buffer.from('{"hello":1}') });
  await expect(app.page.getByRole('alert')).toHaveText("This file isn't a Kettle & Bar backup.");
  expect(await checked(app)).toEqual([1, 2]);
  await chooseFile(app, backupFile({ 'three-split-60': { 1: T, 2: T } }));
  await expect(app.page.getByRole('alert')).toHaveCount(0);
  await expect(app.page.locator('#import-review')).toContainText('This backup matches your progress. Nothing to import.');
  await expect(app.page.getByRole('button', { name: /^Merge/ })).toHaveCount(0);
});

test('an import survives the page redrawing while the file is being chosen (e.g. a sync update)', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await setup(app);
  const input = await app.page.locator('#import-file').elementHandle();
  await app.data(() => new Promise((r) => { rerender(); requestAnimationFrame(() => setTimeout(r)); }));
  await input.setInputFiles(backupFile(fromFile));
  await expect(app.page.locator('#import-review')).toContainText('Three-Split 60: +2 days (3–4)');
});

// ---------- swaps travel with backups ----------
test('Export includes swaps; importing them on a fresh device shows the swapped exercise', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await app.open('#p-three-split-60-d1');
  const s = await app.data(() => { const b = PROGRAMS[0].days[0].blocks[0]; return { ex: b.items[0].ex, to: KBSwaps.alternatives(b.items[0].ex, b, PROGRAMS[0], KBEx)[0] }; });
  await app.data((sw) => store.setSwaps('three-split-60', [{ day: 1, ex: sw.ex, to: sw.to }]), s);
  await app.go('#settings');
  const [download] = await Promise.all([app.page.waitForEvent('download'), app.page.getByRole('button', { name: 'Export progress' }).click()]);
  const text = fs.readFileSync(await download.path(), 'utf8');
  expect(JSON.parse(text).swaps).toEqual({ 'three-split-60': [{ day: 1, ex: s.ex, to: s.to }] });

  await app.data(() => { store.setSwaps('three-split-60', []); }); // as if on a fresh device
  await app.page.locator('#import-file').setInputFiles({ name: 'mine.json', mimeType: 'application/json', buffer: Buffer.from(text) });
  const review = app.page.locator('#import-review');
  await expect(review).toContainText('Swaps: Three-Split 60 has 1 in the file (you have 0).');
  await app.page.getByRole('button', { name: /^Replace/ }).click();
  await app.go('#p-three-split-60-d1');
  const toName = await app.data((id) => KBEx.EX[id].name, s.to);
  await expect(app.page.locator('article.ex').filter({ hasText: 'Swapped from' }).locator('.nm')).toHaveText(toName);
});
