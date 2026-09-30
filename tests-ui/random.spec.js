// Random workout (Phase 7 ticket 2, #64): chosen on a sheet on the Programs page, previewed and reshuffled, started as a
// day page of its own; marked done it counts in Stats (its own scope too) and in no program; it resumes, and it syncs.
const base = require('@playwright/test');
const { test, expect } = require('./fixtures.js');
const { createMemoryRemote } = require('../app/store.js');
const { device } = require('./devices.js');

const sheetOf = (page) => page.getByRole('dialog', { name: 'Random workout' });
const chip = (page, group, name) => sheetOf(page).getByRole('group', { name: group }).getByRole('button', { name, exact: true });
async function openSheet(page) {
  await page.getByRole('button', { name: /^Random workout/ }).click();
  await chip(page, 'Family', 'Strength').waitFor(); // the recipe book is here
}
async function choose(page, { family, subject, minutes, equipment }) {
  if (family) await chip(page, 'Family', family).click();
  if (subject) await chip(page, 'Subject', subject).click();
  if (equipment) await chip(page, 'Equipment', equipment).click();
  if (minutes) await chip(page, 'Minutes', `${minutes} min`).click();
}
const straightPip = (page) => page.locator('.pip').first();

test('choose on the sheet, reshuffle, start, mark done: Stats counts it, no program does', async ({ app }, testInfo) => {
  await app.open('#programs');
  await openSheet(app.page);
  // Cardio & combat: no 15-minute days in the recipe book, so 15 is off, and says why
  await choose(app.page, { family: 'Cardio & combat', equipment: 'No equipment' });
  await expect(chip(app.page, 'Minutes', '15 min')).toBeDisabled();
  await expect(sheetOf(app.page)).toContainText('No 15-minute Cardio & combat workout with no equipment.');
  await choose(app.page, { minutes: 25 });
  const prev = sheetOf(app.page).locator('.rprev');
  await expect(prev).toContainText('about');
  const seed = await prev.getAttribute('data-seed');
  await sheetOf(app.page).getByRole('button', { name: 'Reshuffle' }).click();
  await expect(prev).not.toHaveAttribute('data-seed', seed);
  const name = (await prev.locator('.rname').textContent()).trim();
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: testInfo.outputPath('random-sheet.png') });
  await sheetOf(app.page).getByRole('button', { name: 'Start' }).click();

  // its own day page
  await expect(app.page).toHaveURL(/#random$/);
  await expect(app.heading()).toHaveText(name);
  await expect(app.page.locator('.eyebrow').first()).toContainText('Random workout');
  const est = await app.data(() => random.open().day.est);
  expect(est).toBeGreaterThanOrEqual(22.5); expect(est).toBeLessThanOrEqual(27.5);
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.getByRole('button', { name: 'Mark as done' }).first().click();

  // back on Programs, with a note; the button starts a new one; every program still at 0
  await expect(app.heading()).toHaveText('Programs');
  await expect(app.page.locator('.rnotice')).toContainText(`${est} min added to this week`);
  await expect(app.page.getByRole('button', { name: 'Random workout', exact: true })).toBeVisible();
  expect(await app.data(() => programs.ids().reduce((n, pid) => n + store.count(pid), 0))).toBe(0);

  await app.go('#stats');
  const tile = (n) => app.page.getByRole('group', { name: n });
  await expect(tile('Workouts')).toContainText('1');
  await expect(tile('Workout minutes')).toContainText(String(est));
  await app.page.locator('#stats-scope').selectOption('random');
  await expect(app.page.locator('.eyebrow').first()).toContainText('random workouts');
  await expect(tile('Workouts')).toContainText('1');
});

test('an open random workout resumes after a reload, the button says continue, and Discard forgets it', async ({ app }, testInfo) => {
  test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  await app.open('#programs');
  await openSheet(app.page);
  await choose(app.page, { family: 'Strength', minutes: 25, equipment: 'Kettlebell only' });
  await sheetOf(app.page).getByRole('button', { name: 'Start' }).click();
  await expect(app.page).toHaveURL(/#random$/);
  const name = await app.h1();
  await straightPip(app.page).click();
  await expect(straightPip(app.page)).toHaveAttribute('aria-pressed', 'true');
  await app.page.reload(); await app.heading().waitFor(); await app.loaded();
  await expect(app.heading()).toHaveText(name);
  await expect(app.page.getByRole('status').filter({ hasText: 'Picked up where you left off' })).toBeVisible();
  await expect(straightPip(app.page)).toHaveAttribute('aria-pressed', 'true');
  await app.go('#programs');
  await app.page.getByRole('button', { name: 'Random workout · continue' }).click();
  await expect(app.heading()).toHaveText(name);
  await app.page.getByRole('button', { name: 'Discard' }).click();
  await expect(app.heading()).toHaveText('Programs');
  await expect(app.page.getByRole('button', { name: 'Random workout', exact: true })).toBeVisible();
  await app.go('#random');
  await expect(app.heading()).toHaveText('No random workout open');
  await app.go('#stats');
  await expect(app.page.getByText('No workouts marked done this week yet.')).toBeVisible();
});

test('a swap in a random workout is for today only; a 15-minute Mind & body one builds', async ({ app }, testInfo) => {
  test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  await app.open('#programs');
  await openSheet(app.page);
  await choose(app.page, { family: 'Strength', minutes: 25, equipment: 'All equipment' });
  await sheetOf(app.page).getByRole('button', { name: 'Start' }).click();
  const swap = app.page.locator('.swapbtn').first();
  const from = (await swap.getAttribute('aria-label')).replace(/^Swap /, '');
  const times = await app.page.locator('article.ex .nm', { hasText: new RegExp(`^${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }).count(); // it may be on the day twice
  await swap.click();
  const sheet = app.page.locator('.sheet[role="dialog"]');
  await sheet.locator('[data-swap-to]').first().click();
  await expect(sheet.getByRole('button', { name: 'Today only' })).toBeVisible();
  await expect(sheet.getByText('Rest of the program')).toHaveCount(0);
  await sheet.getByRole('button', { name: 'Today only' }).click();
  await expect(app.page.locator('article.ex').filter({ hasText: `Swapped from ${from}` })).toHaveCount(times);
  await app.page.getByRole('button', { name: 'Discard' }).click();

  await openSheet(app.page);
  await choose(app.page, { family: 'Mind & body', minutes: 15, equipment: 'No equipment' });
  await sheetOf(app.page).getByRole('button', { name: 'Start' }).click();
  const est = await app.data(() => random.open().day.est);
  expect(Math.abs(est - 15)).toBeLessThanOrEqual(2.5);
});

base.test('a random workout marked done reaches a second browser through the account', async ({ browser }, testInfo) => {
  base.test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  base.test.slow();
  const remote = createMemoryRemote();
  const baseURL = testInfo.project.use.baseURL;
  const one = await device(browser, baseURL, remote, 'one');
  const two = await device(browser, baseURL, remote, 'two');
  await one.page.evaluate(() => { location.hash = 'programs'; });
  await openSheet(one.page);
  await choose(one.page, { family: 'Mind & body', minutes: 25, equipment: 'No equipment' });
  await sheetOf(one.page).getByRole('button', { name: 'Start' }).click();
  await one.page.getByRole('button', { name: 'Mark as done' }).first().click();
  await expect(one.page.locator('.rnotice')).toBeVisible();
  const id = await one.page.evaluate(() => Object.keys(store.docs('random'))[0]);
  await two.page.evaluate(() => { location.hash = 'stats'; });
  await expect(two.page.getByRole('group', { name: 'Workouts' })).toContainText('1');
  expect(await two.page.evaluate((x) => !!store.doc('random', x), id)).toBe(true);
  expect(one.errors).toEqual([]); expect(two.errors).toEqual([]);
  await one.context.close(); await two.context.close();
});

// Rest-day flow (Phase 7 ticket 3)
test('rest day: the card opens the sheet with a 15-minute mobility or flexibility flow; Not today hides it until tomorrow', async ({ app }, testInfo) => {
  await app.open('#programs');
  const card = app.page.locator('.restcard');
  await expect(card).toContainText('Rest day?');
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: testInfo.outputPath('rest-card.png') });
  await card.getByRole('button', { name: 'Show me' }).click();
  await expect(chip(app.page, 'Family', 'Mind & body')).toHaveAttribute('aria-pressed', 'true');
  for (const s of ['Mobility & posture', 'Flexibility']) await expect(chip(app.page, 'Subject', s)).toHaveAttribute('aria-pressed', 'true');
  await expect(chip(app.page, 'Subject', 'Any mind & body')).toHaveAttribute('aria-pressed', 'false');
  await expect(chip(app.page, 'Minutes', '15 min')).toHaveAttribute('aria-pressed', 'true');
  await expect(chip(app.page, 'Equipment', 'No equipment')).toHaveAttribute('aria-pressed', 'true');
  await expect(sheetOf(app.page).locator('.rprev')).toContainText(/Mobility & posture|Flexibility/);
  await sheetOf(app.page).getByRole('button', { name: 'Cancel' }).click();
  await card.getByRole('button', { name: 'Not today' }).click();
  await expect(card).toHaveCount(0);
  await app.page.reload(); await app.heading().waitFor(); await app.loaded();
  await expect(app.page.locator('.restcard')).toHaveCount(0);
});

test('rest day: no card once a day is marked done today', async ({ app }, testInfo) => {
  test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  await app.open('#p-three-split-60');
  await app.page.getByRole('checkbox', { name: 'Mark day 1 done' }).click();
  await app.go('#programs');
  await expect(app.heading()).toHaveText('Programs');
  await expect(app.page.locator('.restcard')).toHaveCount(0);
});
