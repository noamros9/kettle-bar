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
  const added = Object.values(EX).filter((x) => x.added).map((e) => ({ id: e.id, label: `${e.name} illustration`, moves: e.poses.length > 1 }));
  test.setTimeout(30000 + added.length * 30); // the catalogue grows each phase
  await app.open('#exercises');
  // Decision 131: every page checked inside the browser in one go (render is synchronous on hashchange). Moving =
  // the page's animation is running over at least two different frames; the first test watches one actually move.
  const bad = await app.page.evaluate(async (list) => {
    const out = [];
    for (const e of list) {
      await new Promise((done) => { addEventListener('hashchange', () => setTimeout(done), { once: true }); location.hash = `#ex-${e.id}`; });
      const fig = document.querySelector('.bigfig svg.fig');
      if (!fig || fig.getAttribute('aria-label') !== e.label) out.push(`${e.id}: no figure`);
      else if (document.querySelector('.bigfig').innerHTML.includes('NaN')) out.push(`${e.id}: NaN`);
      if (e.moves && (!anim.iv || new Set(anim.cache[e.id] || []).size < 2)) out.push(`${e.id}: doesn't move`);
    }
    return out;
  }, added);
  expect(bad).toEqual([]);
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
