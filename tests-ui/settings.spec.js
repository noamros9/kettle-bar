// Settings: reached from the header; Backup exports every program's done days as one file.
const fs = require('fs');
const { test, expect } = require('./fixtures.js');

test('the gear in the header opens Settings, which fits the phone', async ({ app }, testInfo) => {
  await app.open('#programs');
  await app.page.getByRole('button', { name: 'Settings' }).click();
  await expect(app.page).toHaveURL(/#settings$/);
  expect(await app.h1()).toBe('Settings');
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
