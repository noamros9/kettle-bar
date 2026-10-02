// 30-day programs (Phase 14 tickets 1 and 8): the card says "30 days", the page counts to 30 with levels at 1 / 11 / 21,
// a day says its level, and the Stats level note gives both lengths.
const { test, expect } = require('./fixtures.js');

test('a 30-day program: "30 days" on its card, levels of ten days on its page, Level II from day 11', async ({ app }) => {
  await app.open('#programs');
  await app.page.getByRole('group', { name: 'Filter by subject' }).getByRole('button', { name: /^HIIT/ }).click();
  await expect(app.page.locator('[data-open-prog="hiit-30"] .pc-tags')).toContainText('30 days');
  await expect(app.page.locator('[data-open-prog="hiit-30"] .pc-prog')).toContainText('0/30');
  await app.go('#p-hiit-30');
  await expect(app.heading()).toHaveText('HIIT 30');
  await expect(app.page.locator('.progress .big')).toContainText('/ 30 days');
  await expect(app.page.locator('section.level header p')).toHaveText([/^Days 1–10/, /^Days 11–20/, /^Days 21–30/]);
  expect(await app.sidewaysScroll()).toBe(0);
  await app.go('#p-hiit-30-d11');
  await expect(app.page.locator('.eyebrow').first()).toContainText('Day 11 · Level II');
  await expect(app.page.getByRole('button', { name: 'Next day' })).toBeEnabled();
  await app.go('#p-hiit-30-d30');
  await expect(app.page.getByRole('button', { name: 'Next day' })).toBeDisabled();
});

test('Stats: the level note gives the days of each level for 60- and 30-day programs', async ({ app }) => {
  await app.open('#p-hiit-30');
  await app.data(() => store.toggle('hiit-30', 1));
  await app.go('#stats');
  await app.page.getByRole('group', { name: 'Stats views' }).getByRole('button', { name: 'Exercises' }).click();
  await expect(app.page.locator('.note', { hasText: 'highest level' })).toContainText('I days 1–20, II days 21–40, III days 41–60 in a 60-day program; I days 1–10, II days 11–20, III days 21–30 in a 30-day program');
});
