// Resume a workout: ticks are saved on the device, so closing the app or opening another day doesn't lose them.
const { test, expect } = require('./fixtures.js');

const ticked = (app) => app.page.locator('[data-pip][aria-pressed="true"]');
const tick = async (app, n) => {
  const pips = app.page.locator('[data-pip]');
  for (let k = 0; k < n; k++) await pips.nth(k).click();
};

test.beforeEach(async ({}, testInfo) => { test.skip(testInfo.project.name !== 'phone-light', 'theme-independent'); });

test('tick 3 sets, reload the page, reopen the day: the 3 sets are still ticked', async ({ app }) => {
  await app.open('#p-three-split-60-d1');
  await expect(app.page.getByText('Picked up where you left off')).toHaveCount(0);
  await tick(app, 3);
  await expect(ticked(app)).toHaveCount(3);
  await app.page.reload();
  await app.loaded();
  await expect(app.heading()).toBeVisible();
  await expect(ticked(app)).toHaveCount(3);
  await expect(app.page.getByText('Picked up where you left off')).toBeVisible();
});

test('tick day 1, open day 2, back to day 1: still ticked', async ({ app }) => {
  await app.open('#p-three-split-60-d1');
  await tick(app, 2);
  await app.go('#p-three-split-60-d2');
  await expect(ticked(app)).toHaveCount(0);
  await app.go('#p-three-split-60-d1');
  await expect(ticked(app)).toHaveCount(2);
});

test('Mark as done clears the saved workout: a reload starts the day from zero', async ({ app }) => {
  await app.open('#p-three-split-60-d1');
  await tick(app, 2);
  await app.page.getByRole('button', { name: 'Mark as done' }).click();
  await expect(app.page.getByRole('button', { name: 'Do it again' })).toBeVisible(); // Phase 30: done
  await app.page.reload();
  await app.loaded();
  await expect(ticked(app)).toHaveCount(0);
  await expect(app.page.getByText('Picked up where you left off')).toHaveCount(0);
});
