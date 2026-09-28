// Every page renders on a phone, light and dark: the right heading, no errors, no sideways scroll.
const { test, expect } = require('./fixtures.js');
const { CONFIGS } = require('../program-builder.js');
const { EX } = require('../exercises.js');

const shot = (app, testInfo, name) => app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/${name}.png`, fullPage: false });

test('programs list and exercises list', async ({ app }, testInfo) => {
  await app.open('#programs');
  expect(await app.h1()).toBe('Programs');
  await expect(app.page.locator('.pgroup h2')).toHaveCount(9);
  expect(await app.sidewaysScroll()).toBe(0);
  await shot(app, testInfo, 'programs');
  await app.go('#exercises');
  expect(await app.h1()).toBe('Exercises');
  expect(await app.sidewaysScroll()).toBe(0);
  await shot(app, testInfo, 'exercises');
});

for (const cfg of CONFIGS) {
  test(`${cfg.name}: program page and days 1, 31 and 60`, async ({ app }, testInfo) => {
    await app.open(`#p-${cfg.id}`);
    expect(await app.h1()).toBe(cfg.name);
    expect(await app.sidewaysScroll(), 'program page').toBe(0);
    if (cfg.id === 'three-split-60' || cfg.id === 'tabata-ten') await shot(app, testInfo, `${cfg.id}`);
    for (const n of [1, 31, 60]) {
      await app.go(`#p-${cfg.id}-d${n}`);
      const name = await app.data(([pid, d]) => PROGRAMS.find((p) => p.id === pid).days[d - 1].name, [cfg.id, n]);
      expect(await app.h1(), `day ${n}`).toBe(name);
      expect(await app.page.locator('#app svg.fig').count(), `day ${n} figures`).toBeGreaterThan(0);
      expect(await app.sidewaysScroll(), `day ${n}`).toBe(0);
      if (n === 1) await shot(app, testInfo, `${cfg.id}-d1`);
    }
  });
}

test('every exercise page', async ({ app }, testInfo) => {
  await app.open('#exercises');
  for (const e of Object.values(EX)) {
    await app.go(`#ex-${e.id}`);
    expect(await app.h1(), e.id).toBe(e.name);
    await expect(app.page.locator('#app svg.mm'), e.id).toHaveCount(1);
    expect(await app.sidewaysScroll(), e.id).toBe(0);
  }
  await shot(app, testInfo, 'exercise-last');
});
