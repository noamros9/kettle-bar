// Phase 32 ticket 3: one Export button on the exercise, day, program and random-workout pages opens a sheet: PDF (the
// print view), Text (Share, or Copy) and, on the program page only, Calendar (an .ics file of the days not done).
const fs = require('fs');
const { test, expect } = require('./fixtures.js');

const sheetOf = (page) => page.getByRole('dialog', { name: /^Export / });
// no Share here, and the clipboard is read back from what the page wrote; window.print is counted
const stubs = (page) => page.addInitScript(() => {
  window.__printed = 0; window.print = () => { window.__printed++; };
  Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
  window.__copied = null;
  Object.defineProperty(navigator, 'clipboard', { value: { writeText: (t) => { window.__copied = t; return Promise.resolve(); } }, configurable: true });
});
async function openSheet(app) {
  await app.page.getByRole('button', { name: 'Export', exact: true }).click();
  await expect(sheetOf(app.page)).toBeVisible();
}
const formats = (page) => sheetOf(page).locator('.choices > button').evaluateAll((bs) => bs.map((b) => b.firstChild.textContent.trim()));

test('each page\'s Export opens the sheet with the formats that fit: Calendar on the program page only', async ({ app }) => {
  await stubs(app.page);
  for (const [hash, want] of [['#ex-pushup', ['PDF', 'Text']], ['#p-three-split-60-d3', ['PDF', 'Text']], ['#p-three-split-60', ['PDF', 'Text', 'Calendar']]]) {
    await app.open(hash);
    await openSheet(app);
    expect(await formats(app.page)).toEqual(want);
    await sheetOf(app.page).getByRole('button', { name: 'Close' }).click();
    await expect(sheetOf(app.page)).toHaveCount(0);
  }
  // the random workout page too
  await app.go('#programs');
  await app.page.getByRole('button', { name: /^Random workout/ }).click();
  await app.page.getByRole('dialog', { name: 'Random workout' }).getByRole('button', { name: 'Start' }).click();
  await expect(app.page).toHaveURL(/#random$/);
  await openSheet(app);
  expect(await formats(app.page)).toEqual(['PDF', 'Text']);
  await sheetOf(app.page).getByRole('button', { name: /^Text/ }).click();
  await expect(sheetOf(app.page)).toContainText('Copied');
  expect(await app.data(() => window.__copied)).toMatch(/^Random workout · /);
});

test('Text copies the day\'s text; PDF opens its print view, and Back comes back to the day', async ({ app }, testInfo) => {
  await stubs(app.page);
  await app.open('#p-three-split-60-d3');
  await openSheet(app);
  if (testInfo.project.name === 'phone-light') expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: testInfo.outputPath('export-sheet.png') });
  await sheetOf(app.page).getByRole('button', { name: /^Text/ }).click();
  await expect(sheetOf(app.page)).toContainText('Copied');
  const want = await app.data(() => { const D = days.open('three-split-60', 3), p = prog(); return KBExport.dayText(D.day, p, EX, { title: `${p.name} · Day 3 · ${D.day.name}` }); });
  expect(await app.data(() => window.__copied)).toBe(want);
  await sheetOf(app.page).getByRole('button', { name: /^PDF/ }).click();
  await expect(app.page).toHaveURL(/#print\/p-three-split-60-d3$/);
  await expect.poll(() => app.data(() => window.__printed)).toBe(1);
  await app.page.getByRole('button', { name: '← Back' }).click();
  await expect(app.page).toHaveURL(/#p-three-split-60-d3$/);
  await expect(sheetOf(app.page)).toHaveCount(0);
});

test('Calendar waits for a weekday, then saves a file that reads back as one event per day not done', async ({ app }, testInfo) => {
  await stubs(app.page);
  await app.open('#p-three-split-60');
  await app.page.getByRole('checkbox', { name: 'Mark day 1 done' }).click();
  await expect(app.page.getByRole('checkbox', { name: 'Mark day 1 done' })).toHaveAttribute('aria-checked', 'true');
  await openSheet(app);
  await sheetOf(app.page).getByRole('button', { name: /^Calendar/ }).click();
  const save = sheetOf(app.page).getByRole('button', { name: 'Save calendar file' });
  await expect(save).toBeDisabled();
  await sheetOf(app.page).getByLabel('Start on').fill('2026-10-12');
  for (const d of ['Sun', 'Tue', 'Thu']) await sheetOf(app.page).getByRole('button', { name: d, exact: true }).click();
  await expect(sheetOf(app.page).getByRole('button', { name: 'Tue', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(sheetOf(app.page).getByLabel('Start on')).toHaveValue('2026-10-12');
  if (testInfo.project.name === 'phone-light') expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: testInfo.outputPath('export-calendar.png') });
  const [dl] = await Promise.all([app.page.waitForEvent('download'), save.click()]);
  expect(dl.suggestedFilename()).toBe('three-split-60.ics');
  const ics = fs.readFileSync(await dl.path(), 'utf8');
  const events = await app.data((t) => KBExport.parseIcs(t), ics);
  expect(events).toHaveLength(59); // day 1 is done
  expect(events[0].uid).toBe('three-split-60-d2-2026-10-12@kettle-bar');
  expect(events[0].start).toBe('20261013'); // the Tuesday after a Monday start
  expect(events[1].start).toBe('20261015');
  await expect(sheetOf(app.page)).toContainText('Calendar file saved');
});
