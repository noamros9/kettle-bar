// Phase 35 ticket 1c (351): a threesome cue's placeholder is filled when the cue shows: on a program day with that
// program and day's name, on the exercise page with today's. A stub cue stands in until the threesome exercises land.
const { test, expect } = require('./fixtures.js');

const STUB = 'You kneel behind Mali while {woman} kisses her.';
const stub = (app) => app.data((cue) => { EX.slow_dance.cue = cue; }, STUB);
const nameOn = (app, at) => app.data((a) => KBThird.thirdName(a, 'woman'), at);

test('a program day names the third person for that day; the next day names another', async ({ app }) => {
  await app.open('#programs');
  await stub(app);
  await app.go('#p-sweat-together-d1');
  const d1 = await nameOn(app, { pid: 'sweat-together', day: 1 });
  await expect(app.page.locator('.cue', { hasText: 'You kneel behind Mali' }).first()).toHaveText(`You kneel behind Mali while ${d1} kisses her.`);
  await app.go('#p-sweat-together-d2');
  const d2 = await nameOn(app, { pid: 'sweat-together', day: 2 });
  expect(d2).not.toBe(d1);
  const cue = app.page.locator('.cue', { hasText: 'You kneel behind Mali' });
  await expect(cue.first()).toHaveText(`You kneel behind Mali while ${d2} kisses her.`);
  expect(await app.sidewaysScroll()).toBe(0);
});

test('the exercise page names today\'s third person, never the placeholder', async ({ app }) => {
  await app.open('#programs');
  await stub(app);
  await app.go('#ex-slow_dance');
  const today = await app.data(() => KBThird.thirdName({ date: new Date() }, 'woman'));
  await expect(app.page.locator('.facts dd').first()).toHaveText(`You kneel behind Mali while ${today} kisses her.`);
  await expect(app.page.locator('#app')).not.toContainText('{woman}');
});
