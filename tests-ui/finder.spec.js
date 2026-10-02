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
