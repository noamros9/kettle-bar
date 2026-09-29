// The programs page: families (Strength · Cardio & combat · Mind & body) above the subject chips.
const { test, expect } = require('./fixtures.js');
const { CONFIGS } = require('../program-builder.js');

const family = (app) => app.page.getByRole('group', { name: 'Filter by family' });
const subjects = (app) => app.page.getByRole('group', { name: 'Filter by subject' });
const chipTexts = async (group) => (await group.locator('.fchip').allTextContents()).map((t) => t.trim());

test('every program shows under All, and the families are in their order', async ({ app }) => {
  await app.open('#programs');
  await expect(app.page.locator('.pcard')).toHaveCount(CONFIGS.length);
  expect(await chipTexts(family(app))).toEqual(['All', 'Strength', 'Cardio & combat', 'Mind & body']);
  await expect(family(app).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
});

test('tap Mind & body: only its subjects\' chips and shelves show; Flow State sits under Mobility & posture', async ({ app }) => {
  await app.open('#programs');
  await family(app).getByRole('button', { name: 'Mind & body' }).click();
  await expect(family(app).getByRole('button', { name: 'Mind & body' })).toHaveAttribute('aria-pressed', 'true');
  expect(await chipTexts(subjects(app))).toEqual(['All', 'Core & abs', 'Mobility & posture']);
  expect((await app.page.locator('.pgroup h2').allTextContents())).toEqual(['Core & abs', 'Mobility & posture']);
  await expect(app.page.locator('.pgroup', { hasText: 'Mobility & posture' }).locator('[data-open-prog="flow-state"]')).toHaveCount(1);
  await expect(app.page.locator('.pgroup', { hasText: 'Core & abs' }).locator('.pcard')).toHaveCount(2);
  expect(await app.sidewaysScroll()).toBe(0);
});

test('a subject picked in one family resets when another family is picked', async ({ app }) => {
  await app.open('#programs');
  await family(app).getByRole('button', { name: 'Strength' }).click();
  await subjects(app).getByRole('button', { name: 'Pull-ups' }).click();
  await expect(app.page.locator('.pgroup h2')).toHaveText(['Pull-ups']);
  await family(app).getByRole('button', { name: 'Cardio & combat' }).click();
  await expect(subjects(app).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  await expect(app.page.locator('.pgroup h2')).toHaveText(['Conditioning']);
});
