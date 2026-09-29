// The programs page: family tabs (Strength · Cardio & combat · Mind & body) above the subject chips, with counts.
const { test, expect } = require('./fixtures.js');
const { CONFIGS } = require('../program-builder.js');

const family = (app) => app.page.getByRole('group', { name: 'Filter by family' });
const subjects = (app) => app.page.getByRole('group', { name: 'Filter by subject' });
const chipTexts = async (group) => (await group.locator('.ftab, .fchip').allTextContents()).map((t) => t.trim().replace(/\s+\d+$/, '')); // subject chips carry a count: "Yoga 5"

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
  const mind = ['Core & abs', 'Mobility & posture', 'Yoga', 'Pilates', 'Flexibility', 'Balance & stability'].filter((x) => CONFIGS.some((c) => c.subject === x));
  expect(await chipTexts(subjects(app))).toEqual(['All', ...mind]);
  expect((await app.page.locator('.pgroup h2').allTextContents())).toEqual(mind);
  await expect(app.page.locator('.pgroup', { hasText: 'Mobility & posture' }).locator('[data-open-prog="flow-state"]')).toHaveCount(1);
  await expect(app.page.locator('.pgroup', { hasText: 'Core & abs' }).locator('.pcard')).toHaveCount(CONFIGS.filter((c) => c.subject === 'Core & abs').length);
  expect(await app.sidewaysScroll()).toBe(0);
});

test('a subject picked in one family resets when another family is picked', async ({ app }) => {
  await app.open('#programs');
  await family(app).getByRole('button', { name: 'Strength' }).click();
  await subjects(app).getByRole('button', { name: 'Pull-ups' }).click();
  await expect(app.page.locator('.pgroup h2')).toHaveText(['Pull-ups']);
  await family(app).getByRole('button', { name: 'Cardio & combat' }).click();
  await expect(subjects(app).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  const cardio = ['Conditioning', 'HIIT', 'Plyometrics', 'Boxing', 'Kickboxing'].filter((x) => CONFIGS.some((c) => c.subject === x));
  await expect(app.page.locator('.pgroup h2')).toHaveText(cardio);
});

test('the eyebrow counts what the taps select: Mind & body, then Yoga, then a length', async ({ app }) => {
  await app.open('#programs');
  const eyebrow = app.page.locator('.eyebrow').first();
  const inFamily = CONFIGS.filter((c) => ['Core & abs', 'Mobility & posture', 'Yoga', 'Pilates', 'Flexibility', 'Balance & stability'].includes(c.subject)).length;
  const yoga = CONFIGS.filter((c) => c.subject === 'Yoga').length;
  await expect(eyebrow).toHaveText(`${CONFIGS.length} programs`);
  await family(app).getByRole('button', { name: 'Mind & body' }).click();
  await expect(eyebrow).toHaveText(`Mind & body · ${inFamily} programs`);
  await subjects(app).getByRole('button', { name: 'Yoga' }).click();
  await expect(eyebrow).toHaveText(`Yoga · ${yoga} programs`);
  await expect(subjects(app).getByRole('button', { name: 'Yoga' })).toContainText(String(yoga));
  await app.page.getByRole('button', { name: /Length:/ }).click();
  await app.page.getByRole('group', { name: 'Filter by length' }).getByRole('button', { name: 'Up to 25 min' }).click();
  await expect(eyebrow).toHaveText(new RegExp(`^Yoga · \\d+ of ${yoga} programs$`));
  await expect(app.page.getByRole('button', { name: /Length:/ })).toContainText('Up to 25 min');
  expect(await app.sidewaysScroll()).toBe(0);
});
