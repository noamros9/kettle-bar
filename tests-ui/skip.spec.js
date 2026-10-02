// Exercises I skip (Phase 13 ticket 1): "Skip this exercise" on the exercise page, Settings → Exercises I skip lists
// them with Unskip. Kept as `skip: [exercise id]` in the synced prefs, only while not empty.
const { test, expect } = require('./fixtures.js');

const skipBtn = (app) => app.page.locator('.expage-skip [data-skip]');
const section = (app) => app.page.locator('section.setting', { has: app.page.getByRole('heading', { name: 'Exercises I skip' }) });

test('skip an exercise on its page: it lists in Settings, stays after a reload, and Unskip takes it off', async ({ app }) => {
  await app.open('#ex-pushup');
  await expect(skipBtn(app)).toHaveText('Skip this exercise');
  await expect(skipBtn(app)).toHaveAttribute('aria-pressed', 'false');
  await skipBtn(app).click();
  await expect(skipBtn(app)).toHaveText("Don't skip");
  await expect(skipBtn(app)).toHaveAttribute('aria-pressed', 'true');
  await expect(app.page.locator('.expage-skip .note')).toContainText('You skip this exercise');
  expect(await app.data(() => store.doc('prefs', 'main').skip)).toEqual(['pushup']);
  await app.go('#ex-kb_swing');
  await skipBtn(app).click();
  expect(await app.data(() => store.doc('prefs', 'main').skip)).toEqual(['pushup', 'kb_swing']);
  expect(await app.sidewaysScroll()).toBe(0);

  await app.page.reload(); await app.heading().waitFor(); await app.loaded();
  await app.go('#settings');
  const rows = section(app).locator('.skiprow');
  await expect(rows).toHaveCount(2);
  await expect(rows.first()).toContainText('Push-up');
  expect(await app.sidewaysScroll()).toBe(0);
  await section(app).getByRole('button', { name: /Unskip Push-up/ }).click();
  await expect(rows).toHaveCount(1);
  await section(app).getByRole('button', { name: /Unskip/ }).click();
  await expect(rows).toHaveCount(0);
  await expect(section(app)).toContainText('No exercises skipped');
  expect(await app.data(() => 'skip' in (store.doc('prefs', 'main') || {}))).toBe(false); // an empty list leaves no field
});

test('a skipped exercise in Settings opens its page; an id this app does not know is left out', async ({ app }) => {
  await app.open('#settings');
  await app.data(() => store.setDoc('prefs', 'main', { skip: ['gone_exercise', 'kb_swing'] }));
  const rows = section(app).locator('.skiprow');
  await expect(rows).toHaveCount(1);
  await rows.first().getByRole('button', { name: /Kettlebell swing/i }).first().click();
  await expect(app.heading()).toHaveText(/swing/i);
  await expect(skipBtn(app)).toHaveAttribute('aria-pressed', 'true');
});
