// Pages render on a phone, light and dark: the right heading, no errors, no sideways scroll.
// One program per subject is drawn here (the first of each, so new subjects join by themselves); that every
// program's days can be drawn is a unit check (tests/renderable.test.js).
const { test, expect } = require('./fixtures.js');
const { CONFIGS } = require('../program-builder.js');
const { EX } = require('../exercises.js');

const shot = (app, testInfo, name) => app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/${name}.png`, fullPage: false });

test('programs list and exercises list', async ({ app }, testInfo) => {
  await app.open('#programs');
  expect(await app.h1()).toBe('Programs');
  await expect(app.page.locator('.pgroup h2')).toHaveCount(new Set(CONFIGS.map((c) => c.subject)).size);
  const first = CONFIGS[0].about.match(/^[^.!?]+[.!?]/)[0];
  await expect(app.page.locator(`[data-open-prog="${CONFIGS[0].id}"] .pc-main p`)).toHaveText(first);
  expect(await app.sidewaysScroll()).toBe(0);
  await shot(app, testInfo, 'programs');
  await app.go('#exercises');
  expect(await app.h1()).toBe('Exercises');
  expect(await app.sidewaysScroll()).toBe(0);
  await shot(app, testInfo, 'exercises');
});

const sample = [...new Map([...CONFIGS].reverse().map((c) => [c.subject, c])).values()].reverse(); // the first of each subject
const daysOf = (cfg) => { const n = cfg.days || 60; return [1, n / 2 + 1, n]; }; // first, Level II, last

for (const cfg of sample) {
  test(`${cfg.name}: program page and days ${daysOf(cfg).join(', ')}`, async ({ app }, testInfo) => {
    await app.open(`#p-${cfg.id}`);
    expect(await app.h1()).toBe(cfg.name);
    await expect(app.page.locator('.phead .lede')).toHaveText(cfg.about);
    expect(await app.sidewaysScroll(), 'program page').toBe(0);
    if (cfg.id === 'three-split-60' || cfg.id === 'tabata-ten') await shot(app, testInfo, `${cfg.id}`);
    for (const n of daysOf(cfg)) {
      await app.go(`#p-${cfg.id}-d${n}`);
      const name = await app.data(([pid, d]) => programs.get(pid).days[d - 1].name, [cfg.id, n]);
      expect(await app.h1(), `day ${n}`).toBe(name);
      expect(await app.page.locator('#app svg.fig').count(), `day ${n} figures`).toBeGreaterThan(0);
      const lines = await app.data(([pid, d]) => KBSummary.daySummary(dayOf(pid, d), programs.get(pid), KBEx), [cfg.id, n]);
      await expect(app.page.locator('.daysum span'), `day ${n} summary`).toHaveText(lines);
      expect(await app.sidewaysScroll(), `day ${n}`).toBe(0);
      if (n === 1) await shot(app, testInfo, `${cfg.id}-d1`);
    }
  });
}

test('every exercise page', async ({ app }, testInfo) => {
  const list = Object.values(EX).map((e) => ({ id: e.id, name: e.name }));
  test.setTimeout(30000 + list.length * 30); // the catalogue grows each phase
  await app.open('#exercises');
  // Decision 131: every page checked inside the browser in one go (render is synchronous on hashchange)
  const bad = await app.page.evaluate(async (all) => {
    const out = [], de = document.documentElement;
    for (const e of all) {
      await new Promise((done) => { addEventListener('hashchange', () => setTimeout(done), { once: true }); location.hash = `#ex-${e.id}`; });
      const h1 = document.querySelector('#app h1');
      if (!h1 || h1.textContent.trim() !== e.name) out.push(`${e.id}: heading`);
      if (document.querySelectorAll('#app svg.mm').length !== 1) out.push(`${e.id}: muscle map`);
      if (de.scrollWidth - de.clientWidth !== 0) out.push(`${e.id}: sideways scroll`);
    }
    return out;
  }, list);
  expect(bad).toEqual([]);
  await shot(app, testInfo, 'exercise-last');
});

test('the header fits on a phone signed out too (Sign in button showing)', async ({ app }) => {
  await app.open('#programs');
  await app.data(() => paintSync('signin'));
  await expect(app.page.locator('#sync')).toHaveText('Sign in');
  expect(await app.sidewaysScroll()).toBe(0);
});
