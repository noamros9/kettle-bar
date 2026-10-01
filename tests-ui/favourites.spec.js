// Favourites and hidden subjects (Phase 8 ticket 1): a star on program cards and pages, a Favourites shelf at the top,
// and Settings → Hidden subjects. Both live in the synced prefs.
const { test, expect } = require('./fixtures.js');
const { CONFIGS } = require('../program-builder.js');

const favShelf = (app) => app.page.locator('.pgroup.favs');
const subjects = (app) => app.page.getByRole('group', { name: 'Filter by subject' });

test('star a program on its card: it shows in Favourites at the top, stays after a reload, and unstars from its page', async ({ app }) => {
  await app.open('#programs');
  await expect(favShelf(app)).toHaveCount(0);
  const star = app.page.getByRole('button', { name: 'Add Flow State to favourites' }).first();
  await star.click();
  await expect(favShelf(app).locator('[data-open-prog="flow-state"]')).toHaveCount(1);
  await expect(app.page.locator('.pgroup h2').first()).toHaveText('Favourites');
  await expect(app.page.getByRole('button', { name: 'Remove Flow State from favourites' })).toHaveCount(2); // the shelf and its subject's shelf
  expect(await app.data(() => store.doc('prefs', 'main').favourites)).toEqual(['flow-state']);
  expect(await app.sidewaysScroll()).toBe(0);

  await app.page.reload(); await app.heading().waitFor(); await app.loaded();
  await expect(favShelf(app).locator('.pcard')).toHaveCount(1);
  await favShelf(app).locator('[data-open-prog="flow-state"]').click();
  await expect(app.heading()).toHaveText('Flow State');
  const pageStar = app.page.locator('.ptitle .star');
  await expect(pageStar).toHaveAttribute('aria-pressed', 'true');
  await pageStar.click();
  await expect(pageStar).toHaveAttribute('aria-pressed', 'false');
  expect(await app.data(() => 'favourites' in store.doc('prefs', 'main'))).toBe(false); // an empty list leaves no field
  await app.go('#programs');
  await expect(favShelf(app)).toHaveCount(0);
});

test('hide a subject in Settings: no chip, no shelf, not counted; showing it again brings it back', async ({ app }) => {
  const yoga = CONFIGS.filter((c) => c.subject === 'Yoga').length;
  await app.open('#settings');
  const group = app.page.getByRole('group', { name: 'Hide Mind & body subjects' });
  await group.getByRole('button', { name: 'Yoga' }).click();
  await expect(group.getByRole('button', { name: 'Yoga' })).toHaveAttribute('aria-pressed', 'true');
  expect(await app.sidewaysScroll()).toBe(0);

  await app.go('#programs');
  await expect(app.page.locator('.eyebrow').first()).toHaveText(`${CONFIGS.length - yoga} programs`);
  await expect(subjects(app).getByRole('button', { name: /^Yoga/ })).toHaveCount(0);
  await expect(app.page.locator('.pgroup h2', { hasText: /^Yoga$/ })).toHaveCount(0);

  await app.go('#settings');
  await app.page.getByRole('group', { name: 'Hide Mind & body subjects' }).getByRole('button', { name: 'Yoga' }).click();
  await app.go('#programs');
  await expect(app.page.locator('.eyebrow').first()).toHaveText(`${CONFIGS.length} programs`);
});

test('a starred program whose subject is hidden stays in Favourites', async ({ app }) => {
  await app.open('#programs');
  await app.data(() => store.setDoc('prefs', 'main', { favourites: ['flow-state'], hidden: ['Mobility & posture'] }));
  await expect(favShelf(app).locator('[data-open-prog="flow-state"]')).toHaveCount(1);
  await expect(app.page.locator('[data-open-prog="flow-state"]')).toHaveCount(1);
});
