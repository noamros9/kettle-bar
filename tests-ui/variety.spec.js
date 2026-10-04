// Phase 16: a Variety program. Every day is different, so the program page says so in one line instead of listing
// sixty day types, and each day is labelled with its kind and format.
const { test, expect } = require('./fixtures.js');

test('a Variety program page says every day is different instead of a sixty-line key; a day shows its kind and format', async ({ app }) => {
  await app.open('#p-every-day-different');
  await expect(app.heading()).toHaveText('Every Day Different');
  const key = app.page.locator('.cycle > div');
  await expect(key).toHaveCount(1);
  await expect(key).toContainText('Every day is different');
  expect(await app.sidewaysScroll()).toBe(0);
  const label = await app.data(() => programs.get('every-day-different').dayTypes[programs.day('every-day-different', 1).type].label);
  expect(label).toMatch(/ · /);
  await expect(app.page.locator('.nextup')).toContainText(label);
  await app.go('#p-every-day-different-d1');
  await expect(app.heading()).toHaveText(await app.data(() => programs.day('every-day-different', 1).name));
  // an ordinary program keeps its key
  await app.go('#p-chest-day');
  await expect(app.page.locator('.cycle > div')).toHaveCount(3);
});
