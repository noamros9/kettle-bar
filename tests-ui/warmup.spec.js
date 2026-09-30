// Warm-up that matches the format (Phase 7 ticket 6): a boxing day warms up on its feet, a yoga day gently; the
// warm-up is the same length, and it runs as before.
const { test, expect } = require('./fixtures.js');

const warmNames = (app) => app.page.locator('section.stretch').first().locator('.nm').allTextContents();

test('a boxing day warms up with shadow footwork and moves; a yoga day with gentle ones', async ({ app }, testInfo) => {
  await app.open('#p-fight-camp-d1');
  const box = await warmNames(app);
  expect(box[0]).toBe(await app.data(() => KBEx.EX.shadow_footwork.name));
  const dynamic = await app.data(() => KBWarmup.DYNAMIC.map((id) => KBEx.EX[id].name));
  box.forEach((n) => expect(dynamic).toContain(n));
  await expect(app.page.locator('section.stretch').first()).toContainText('1:00');
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.locator('section.stretch').first().scrollIntoViewIfNeeded();
  await app.page.screenshot({ path: testInfo.outputPath('warmup-boxing.png') });

  await app.go('#p-core-yoga-d1');
  const gentle = await app.data(() => KBWarmup.GENTLE.map((id) => KBEx.EX[id].name));
  (await warmNames(app)).forEach((n) => expect(gentle).toContain(n));
});
