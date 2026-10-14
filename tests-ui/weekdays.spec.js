// Phase 33 ticket 3 (#291): training weekdays on a program's page, "Next workout" on the day Today's workout opens,
// and the calendar export's weekdays pre-filled from them.
const { test, expect } = require('./fixtures.js');

const MONDAY = new Date(2026, 9, 12, 9, 0); // a Monday, local time
const chip = (app, name) => app.page.getByRole('group', { name: 'Training days' }).getByRole('button', { name, exact: true });

test('Sun/Tue/Thu on a Monday: the day Today\'s workout opens says "Next workout tomorrow, Tuesday"', async ({ app }, testInfo) => {
  await app.page.clock.setFixedTime(MONDAY);
  await app.open('#p-three-split-60');
  for (const d of ['Sunday', 'Tuesday', 'Thursday']) await chip(app, d).click();
  await expect(chip(app, 'Tuesday')).toHaveAttribute('aria-pressed', 'true');
  await expect(chip(app, 'Monday')).toHaveAttribute('aria-pressed', 'false');
  expect(await app.data(() => store.weekdays('three-split-60'))).toEqual([0, 2, 4]);
  if (testInfo.project.name === 'phone-light') expect(await app.sidewaysScroll()).toBe(0);
  await app.page.locator('.trainrow').screenshot({ path: testInfo.outputPath('weekday-chips.png') });
  // the calendar export starts from them
  await app.page.getByRole('button', { name: 'Export', exact: true }).click();
  await app.page.getByRole('button', { name: /^Calendar/ }).click();
  const sheet = app.page.getByRole('dialog', { name: /^Export / });
  for (const d of ['Sun', 'Tue', 'Thu']) await expect(sheet.getByRole('button', { name: d, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(sheet.getByRole('button', { name: 'Mon', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await sheet.getByRole('button', { name: 'Close' }).click();

  await app.go('#today');
  await expect(app.page).toHaveURL(/#p-three-split-60-d1$/);
  await expect(app.page.getByTestId('next-workout')).toHaveText('Next workout tomorrow, Tuesday');
  await app.page.getByTestId('next-workout').screenshot({ path: testInfo.outputPath('next-workout.png') });
  // the same day opened any other way says nothing
  await app.go('#p-three-split-60');
  await app.go('#p-three-split-60-d1');
  await expect(app.page.getByTestId('next-workout')).toHaveCount(0);
});

test('a training day not done yet says today; done today, the next one; no weekdays, nothing', async ({ app }) => {
  await app.page.clock.setFixedTime(MONDAY);
  await app.open('#p-three-split-60');
  await chip(app, 'Monday').click(); await chip(app, 'Thursday').click();
  await app.go('#today');
  await expect(app.page.getByTestId('next-workout')).toHaveText('Next workout today');
  await app.data(() => store.toggle('three-split-60', 1)); // a tick today
  await app.go('#today');
  await expect(app.page).toHaveURL(/#p-three-split-60-d2$/);
  await expect(app.page.getByTestId('next-workout')).toHaveText('Next workout Thursday');
  await app.data(() => store.setWeekdays('three-split-60', []));
  await app.go('#today');
  await expect(app.page.getByTestId('next-workout')).toHaveCount(0);
});
