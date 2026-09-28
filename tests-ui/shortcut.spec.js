// The home-screen shortcut opens #today: the next day not done in the program you opened last.
const { test, expect } = require('./fixtures.js');

test.beforeEach(({}, testInfo) => test.skip(testInfo.project.name !== 'phone-light', 'theme-independent'));

test('#today opens the next day not done of the program opened last', async ({ app }) => {
  await app.open('#p-iron-ppl');
  for (const n of [1, 2]) await app.page.getByRole('checkbox', { name: `Mark day ${n} done` }).click();
  await app.go('#today');
  await expect(app.page).toHaveURL(/#p-iron-ppl-d3$/);
  await expect(app.heading()).toHaveText(await app.data(() => programs.day('iron-ppl', 3).name));
});

test('with no program opened yet, #today opens day 1 of the first program; with every day done, the program page', async ({ app }) => {
  await app.open('#today');
  await expect(app.page).toHaveURL(/#p-three-split-60-d1$/);
  await app.data(() => { for (let d = 1; d <= 60; d++) store.toggle('three-split-60', d); });
  await app.go('#today');
  await expect(app.page).toHaveURL(/#p-three-split-60$/);
  await expect(app.heading()).toHaveText('Three-Split 60');
});
