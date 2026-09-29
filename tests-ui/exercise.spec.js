// Exercise pages: the big drawing loops between the positions; still under reduce motion; nothing else moves.
const { test, expect } = require('./fixtures.js');

const drawing = (app) => app.page.locator('.bigfig');
const snapshot = (app) => drawing(app).innerHTML();

test('the exercise page drawing moves, and stops when you leave the page', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await app.page.clock.install();
  await app.open('#ex-pushup');
  const seen = new Set();
  for (let i = 0; i < 6; i++) { seen.add(await snapshot(app)); await app.page.clock.runFor(120); }
  expect(seen.size).toBeGreaterThan(3);
  await expect(drawing(app).locator('svg')).toHaveAttribute('aria-label', 'Push-ups illustration');
  await app.go('#p-three-split-60-d1');
  const cards = await app.page.locator('#app').innerHTML();
  await app.page.clock.runFor(2000);
  expect(await app.page.locator('#app').innerHTML()).toBe(cards);
});

test('with reduce motion on, the drawing stays still', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await app.page.emulateMedia({ reducedMotion: 'reduce' });
  await app.page.clock.install();
  await app.open('#ex-pushup');
  const first = await snapshot(app);
  await app.page.clock.runFor(1000);
  expect(await snapshot(app)).toBe(first);
  expect(first).toContain('translate(126,0)'); // the still drawing: every position side by side
});

test('every exercise added in Phase 5 draws its figure on its page, and moves when it has several positions', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  const { EX } = require('../exercises.js');
  await app.page.clock.install();
  await app.open('#exercises');
  for (const e of Object.values(EX).filter((x) => x.added)) {
    await app.go(`#ex-${e.id}`);
    await expect(drawing(app).locator('svg.fig'), e.id).toHaveAttribute('aria-label', `${e.name} illustration`);
    const first = await snapshot(app);
    expect(first, e.id).not.toContain('NaN');
    if (e.poses.length > 1) { await app.page.clock.runFor(300); expect(await snapshot(app), `${e.id} moves`).not.toBe(first); }
  }
});

test('"Also in" lists the other programs that use the exercise, once the exercise index has loaded', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await app.open('#ex-pushup');
  const chips = app.page.locator('.progchip');
  await expect(app.page.getByRole('heading', { name: 'Also in' })).toBeVisible();
  const names = await chips.allTextContents();
  const expected = await app.data(() => programs.programsUsing('pushup').filter((id) => id !== route.pid).map((id) => programs.summary(id).name));
  expect(names).toEqual(expected);
  expect(names.length).toBeGreaterThan(3);
  await chips.first().click();
  await expect(app.heading()).toHaveText(names[0]);
});
