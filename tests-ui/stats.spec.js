// Stats: a header tab showing what the days marked done add up to.
const { test, expect } = require('./fixtures.js');

test('Stats shows this week across all programs: workouts, minutes kept apart, sets and reps', async ({ app }, testInfo) => {
  await app.open('#p-three-split-60');
  for (const n of [1, 2]) await app.page.getByRole('checkbox', { name: `Mark day ${n} done` }).click();
  await app.page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Stats' }).click();
  await expect(app.page).toHaveURL(/#stats$/);
  await expect(app.heading()).toHaveText('Stats');
  const [a, b] = await app.data(() => [0, 1].map((i) => KBStats.dayVolume(PROGRAMS[0].days[i], KBEx.EX)));
  const tile = (name) => app.page.getByRole('group', { name });
  await expect(tile('Workouts')).toContainText('2');
  await expect(tile('Workout minutes')).toContainText(String(a.workoutMin + b.workoutMin));
  await expect(tile('Stretching minutes')).toContainText(String(a.stretchMin + b.stretchMin));
  await expect(tile('Sets')).toContainText(String(a.sets + b.sets));
  await expect(tile('Reps')).toContainText(String(a.reps + b.reps));
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/stats.png` });
});

test('Stats with nothing done yet says so, and the header still fits', async ({ app }, testInfo) => {
  await app.open('#stats');
  await expect(app.page.getByText('No workouts marked done this week yet.')).toBeVisible();
  await expect(app.page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Stats' })).toHaveAttribute('aria-current', 'page');
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/stats-empty.png` });
});
