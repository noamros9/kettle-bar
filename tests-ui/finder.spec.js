// The Program finder (Phase 15): the name search on Programs (ticket 1).
const { test, expect } = require('./fixtures.js');
const { CONFIGS } = require('../program-builder.js');

const field = (app) => app.page.getByRole('searchbox', { name: 'Search programs' });

test('name search: typing narrows the shelves and the counter, keeps focus, shows whole shelves; clearing brings all back', async ({ app }) => {
  await app.open('#programs');
  const kettle = CONFIGS.filter((c) => /kettle/i.test([c.name, c.subject, c.split, (c.about || c.blurb).match(/^[^.!?]+[.!?]/)[0]].join(' ')));
  await field(app).click();
  await app.page.keyboard.type('kettle');
  await expect(field(app)).toBeFocused();
  await expect(app.page.locator('.eyebrow').first()).toHaveText(`${kettle.length} programs`);
  await expect(app.page.locator('.pcard')).toHaveCount(kettle.length); // no shelf is cut while searching
  await expect(app.page.locator('.shelfmore')).toHaveCount(0);
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.keyboard.type(' swing press');
  await expect(app.page.locator('[data-open-prog="kettlebell-30"]')).toHaveCount(1);
  await field(app).fill('zzz nothing');
  await expect(app.page.locator('.lede', { hasText: 'No programs match “zzz nothing”' })).toBeVisible();
  await field(app).fill('');
  await expect(app.page.locator('.eyebrow').first()).toHaveText(`${CONFIGS.length} programs`);
});

test('name search works with the family and subject filters', async ({ app }) => {
  await app.open('#programs');
  await app.page.getByRole('group', { name: 'Filter by family' }).getByRole('button', { name: 'Mind & body' }).click();
  await field(app).fill('back');
  const shown = await app.page.locator('.pcard').evaluateAll((els) => els.map((e) => e.dataset.openProg));
  expect(shown.length).toBeGreaterThan(0);
  const mind = ['Core & abs', 'Mobility & posture', 'Yoga', 'Pilates', 'Flexibility', 'Balance & stability', 'Gentle / low impact', 'Back care'];
  shown.forEach((id) => expect(mind).toContain(CONFIGS.find((c) => c.id === id).subject));
});

// ---- ticket 2: Help me pick ----
const sheet = (app) => app.page.getByRole('dialog', { name: 'Help me pick' });
test('Help me pick: three taps, up to five programs with why lines, open one', async ({ app }) => {
  await app.open('#programs');
  await app.page.getByRole('button', { name: 'Help me pick' }).click();
  await expect(sheet(app)).toBeVisible();
  await expect(sheet(app)).toContainText('Pick a goal to see programs.');
  await sheet(app).getByRole('group', { name: 'Goal' }).getByRole('button', { name: 'Gentle, or a sore back' }).click();
  await sheet(app).getByRole('group', { name: 'Minutes' }).getByRole('button', { name: '20–25 min' }).click();
  await sheet(app).getByRole('group', { name: 'Gear' }).getByRole('button', { name: 'No equipment' }).click();
  const results = sheet(app).locator('.pickres');
  const n = await results.count();
  expect(n).toBeGreaterThan(0); expect(n).toBeLessThanOrEqual(5);
  await expect(results.first().locator('span')).toContainText('no equipment');
  expect(await app.sidewaysScroll()).toBe(0);
  const name = (await results.first().locator('b').textContent()).trim();
  await results.first().click();
  await expect(app.heading()).toHaveText(name);
  await app.go('#programs');
  await expect(sheet(app)).toHaveCount(0);
});

test('Help me pick says when it loosened the minutes, and closes', async ({ app }) => {
  await app.open('#programs');
  await app.page.getByRole('button', { name: 'Help me pick' }).click();
  await sheet(app).getByRole('group', { name: 'Goal' }).getByRole('button', { name: 'Fighting skills' }).click();
  await sheet(app).getByRole('group', { name: 'Minutes' }).getByRole('button', { name: 'About 15 min' }).click();
  await expect(sheet(app).locator('.hint')).toContainText('Nothing fits those minutes');
  await sheet(app).getByRole('button', { name: 'Close' }).last().click();
  await expect(sheet(app)).toHaveCount(0);
});
