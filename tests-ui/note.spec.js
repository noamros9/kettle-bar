// Phase 33 ticket 4 (#292): a one-line note per time a day was done: typed on the finish card, shown on the day page and
// in History, where it can be edited; a second browser on the same account sees it.
const base = require('@playwright/test');
const { test, expect } = require('./fixtures.js');
const { createMemoryRemote } = require('../app/store.js');
const { device } = require('./devices.js');

async function finishDay(page) {
  const pips = page.locator('[data-pip]'), n = await pips.count();
  for (let i = 0; i < n; i++) await pips.nth(i).click();
  await page.getByRole('region', { name: 'Workout complete' }).getByRole('button', { name: /^Mark day \d+ as done$/ }).click();
}

test('type a note on the finish card: it shows on the day page and in History; edit it in History', async ({ app }, testInfo) => {
  await app.open('#p-three-split-60-d1');
  await finishDay(app.page);
  const card = app.page.getByRole('region', { name: 'Workout complete' });
  const input = card.getByLabel('A note for today');
  await input.fill('x'.repeat(125));
  await expect(card.locator('.notecount')).toHaveText('15 left');
  await input.fill('  Felt strong, last set slow  ');
  await expect(card.locator('.notecount')).toHaveText('');
  if (testInfo.project.name === 'phone-light') expect(await app.sidewaysScroll()).toBe(0);
  await card.locator('.noteform').screenshot({ path: testInfo.outputPath('note-finish.png') });
  await card.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(card.locator('.notecount')).toHaveText('Saved');
  await expect(app.page.getByTestId('day-note')).toHaveText('Your note: “Felt strong, last set slow”');
  await expect(input).toHaveValue('Felt strong, last set slow');

  await app.go('#stats');
  await app.page.getByRole('button', { name: 'History', exact: true }).click();
  await app.page.locator('.hday.today').click();
  await expect(app.page.getByTestId('history-note')).toHaveText('“Felt strong, last set slow”');
  await app.page.getByRole('button', { name: 'Edit note' }).click();
  const edit = app.page.getByLabel('Note for day 1');
  await expect(edit).toBeFocused();
  await edit.fill('Felt strong');
  await edit.press('Enter');
  await expect(app.page.getByTestId('history-note')).toHaveText('“Felt strong”');
  await app.page.locator('.hlist').screenshot({ path: testInfo.outputPath('note-history.png') });
  await app.go('#p-three-split-60-d1');
  await expect(app.page.getByTestId('day-note')).toHaveText('Your note: “Felt strong”');
  // emptied in History: gone everywhere (History still has today open)
  await app.go('#stats');
  await app.page.getByRole('button', { name: 'Edit note' }).click();
  await app.page.getByLabel('Note for day 1').fill('');
  await app.page.getByLabel('Note for day 1').press('Enter');
  await expect(app.page.getByTestId('history-note')).toHaveCount(0);
  await expect(app.page.getByRole('button', { name: 'Add a note' })).toBeVisible();
});

base.test('a second browser on the same account sees the note', async ({ browser }, testInfo) => {
  base.test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  const remote = createMemoryRemote();
  const baseURL = testInfo.project.use.baseURL;
  const one = await device(browser, baseURL, remote, 'one');
  const two = await device(browser, baseURL, remote, 'two');
  await one.page.evaluate(() => { store.toggle('three-split-60', 2); store.setNote('three-split-60', 2, 'from phone one'); });
  await two.page.waitForFunction(() => store.noteOf('three-split-60', 2) === 'from phone one');
  await two.page.evaluate(() => { location.hash = 'p-three-split-60-d2'; });
  await base.expect(two.page.getByTestId('day-note')).toHaveText('Your note: “from phone one”');
  base.expect([...one.errors, ...two.errors]).toEqual([]);
  await one.context.close(); await two.context.close();
});
