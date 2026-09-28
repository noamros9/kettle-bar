// The finish card: appears when every set of the day is ticked; shows what the day added up to; marks it done.
const { test, expect } = require('./fixtures.js');

async function tickEverySet(app) {
  const pips = app.page.locator('[data-pip]');
  const n = await pips.count();
  for (let i = 0; i < n; i++) await pips.nth(i).click();
}

test('ticking every set shows the finish card with sets, workout and stretching minutes', async ({ app }, testInfo) => {
  await app.open('#p-three-split-60-d1');
  const card = app.page.getByRole('region', { name: 'Workout complete' });
  await expect(card).toHaveCount(0);
  await tickEverySet(app);
  await expect(card).toBeVisible();
  const v = await app.data(() => KBStats.dayVolume(PROGRAMS[0].days[0], KBEx.EX));
  await expect(card.getByTestId('sets')).toHaveText(String(v.sets));
  await expect(card.getByTestId('workout-min')).toHaveText(`${v.workoutMin} min`);
  await expect(card.getByTestId('stretch-min')).toHaveText(`${v.stretchMin} min`);
  await card.scrollIntoViewIfNeeded();
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/finish-card.png` });
});

test('Mark as done on the card marks the day; tapping again un-marks it', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await app.open('#p-three-split-60-d1');
  await tickEverySet(app);
  const card = app.page.getByRole('region', { name: 'Workout complete' });
  await card.getByRole('button', { name: 'Mark day 1 as done' }).click();
  await expect(app.page.locator('.whead [data-toggle="1"]')).toHaveText('✓ Done');
  const done = card.getByRole('button', { name: '✓ Day 1 done' });
  await expect(done).toHaveAttribute('aria-pressed', 'true');
  await done.click();
  await expect(app.page.locator('.whead [data-toggle="1"]')).toHaveText('Mark as done');
});
