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

test('"Programs that use this" lists the others, most days first with "on N days"; 10, then Show all', async ({ app }, testInfo) => {
  await app.open('#ex-pushup');
  const rows = app.page.locator('.usesrow');
  await expect(app.page.getByRole('heading', { name: 'Programs that use this' })).toBeVisible();
  const want = await app.data(() => programs.usesOf('pushup').filter((u) => u.pid !== route.pid).map((u) => ({ name: programs.summary(u.pid).name, days: u.days })));
  expect(want.length).toBeGreaterThan(10);
  for (let i = 1; i < want.length; i++) expect(want[i - 1].days).toBeGreaterThanOrEqual(want[i].days);
  await expect(rows).toHaveCount(10);
  await expect(rows.first()).toContainText(want[0].name);
  await expect(rows.first()).toContainText(`on ${want[0].days} days`);
  if (testInfo.project.name === 'phone-light') expect(await app.sidewaysScroll()).toBe(0);
  await app.page.locator('.usesof').screenshot({ path: testInfo.outputPath('uses.png') });
  await app.page.getByRole('button', { name: `Show all ${want.length}` }).click();
  await expect(rows).toHaveCount(want.length);
  await rows.first().click();
  await expect(app.heading()).toHaveText(want[0].name);
});

test('your own program that uses the exercise is in the list, counted on the device', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await app.open('#programs');
  await app.page.getByRole('button', { name: 'Build your own' }).click();
  await app.page.getByRole('group', { name: 'Days in a cycle' }).waitFor();
  await app.page.getByRole('button', { name: 'Save program' }).click();
  await expect(app.heading()).toHaveText(/^My /);
  const { pid, ex, days } = await app.data(() => { const p = prog(), ex = p.days[0].blocks[0].items[0].ex; return { pid: p.id, ex, days: p.days.filter((d) => d.blocks.some((b) => b.items.some((it) => it.ex === ex)) || [...(d.warmup ? d.warmup.items : []), ...(d.cooldown ? d.cooldown.items : [])].some((it) => it.ex === ex)).length }; });
  await app.go('#p-three-split-60'); // the exercise page lists the programs other than the one it was opened from
  await app.go(`#ex-${ex}`);
  await app.page.getByRole('heading', { name: 'Programs that use this' }).waitFor();
  const all = app.page.getByRole('button', { name: /^Show all/ });
  if (await all.count()) await all.click();
  const mine = app.page.locator(`.usesrow[data-open-prog="${pid}"]`);
  await expect(mine).toContainText('Your program');
  await expect(mine).toContainText(`on ${days} day${days === 1 ? '' : 's'}`);
});

