// Phase 35 ticket 3g7 (decisions 434-440): the guests page: cards that unfold, search, tabs, filter menus, sort
const { test, expect } = require('./fixtures.js');
const { GUESTS } = require('../app/guests.js');

const all = Object.keys(GUESTS).length;
const cards = (app) => app.page.locator('#gresults .guest');
const gf = (app, v) => app.page.locator(`[data-gf="${v}"]`);

test('a card is a summary: a tap unfolds her description, a second folds it, the others stay as they are', async ({ app }) => {
  await app.open('#guests');
  const [a, b] = [cards(app).nth(0), cards(app).nth(1)];
  await expect(a.locator('.gsum')).toHaveAttribute('aria-expanded', 'false');
  await expect(a.locator('.gtext')).toBeHidden();
  await a.locator('.gsum').click();
  await expect(a.locator('.gsum')).toHaveAttribute('aria-expanded', 'true');
  await expect(a.locator('.gtext')).toBeVisible();
  await expect(b.locator('.gsum')).toHaveAttribute('aria-expanded', 'false');
  await b.locator('.gsum').click();
  await expect(a.locator('.gtext')).toBeVisible();
  await a.locator('.gsum').click();
  await expect(a.locator('.gtext')).toBeHidden();
});

test('the search narrows by anything on her card, keeps the focus, and the count follows', async ({ app }) => {
  await app.open('#guests');
  await expect(app.page.locator('#gcount')).toHaveText(`${all} guests`);
  const field = app.page.getByRole('searchbox', { name: 'Search guests' });
  await field.fill(GUESTS.Noa.job);
  await expect(cards(app)).toHaveCount(1);
  await expect(cards(app).locator('.gname')).toHaveText('Noa');
  await expect(app.page.locator('#gcount')).toHaveText(`1 of ${all} guests`);
  await expect(field).toBeFocused();
  // kept while the app is open (440)
  await app.go('#exercises');
  await app.go('#guests');
  await expect(app.page.getByRole('searchbox', { name: 'Search guests' })).toHaveValue(GUESTS.Noa.job);
  await expect(cards(app)).toHaveCount(1);
});

test('tabs: Men shows only the men, its menus without the women-only ones and with Cock', async ({ app }) => {
  await app.open('#guests');
  await gf(app, 'kind:man').click();
  const men = Object.keys(GUESTS).filter((n) => GUESTS[n].kind === 'man');
  await expect(cards(app)).toHaveCount(men.length);
  await expect(gf(app, 'menu:breasts')).toHaveCount(0);
  await expect(gf(app, 'menu:cock')).toHaveCount(1);
  await gf(app, 'kind:woman').click();
  await expect(gf(app, 'menu:cock')).toHaveCount(0);
});

test('a menu: one open at a time, several values, the line names them; Clear all resets', async ({ app }) => {
  await app.open('#guests');
  await gf(app, 'menu:breasts').click();
  await gf(app, 'pick:breasts:very big').click();
  await gf(app, 'pick:breasts:small').click();
  const want = Object.keys(GUESTS).filter((n) => ['very big', 'small'].includes(GUESTS[n].breasts));
  await expect(cards(app)).toHaveCount(want.length);
  await expect(gf(app, 'menu:breasts')).toContainText('small, very big');
  await gf(app, 'menu:body').click();
  await expect(gf(app, 'pick:breasts:small')).toHaveCount(0);
  await gf(app, 'clear:1').click();
  await expect(cards(app)).toHaveCount(all);
  await expect(gf(app, 'menu:breasts')).toContainText('Any');
});

test('sort: Oldest puts the oldest first', async ({ app }) => {
  await app.open('#guests');
  await gf(app, 'menu:sort').click();
  await gf(app, 'sort:old').click();
  const oldest = Math.max(...Object.values(GUESTS).map((g) => g.age));
  await expect(cards(app).first().locator('.gfacts')).toContainText(`${oldest} ·`);
});

test('#guests/<name> opens at her, unfolded, even with a search that hid her', async ({ app }) => {
  await app.open('#guests');
  await app.page.getByRole('searchbox', { name: 'Search guests' }).fill('Itay');
  await app.go('#guests/Noa');
  await expect(app.page.locator('#g-Noa .gsum')).toHaveAttribute('aria-expanded', 'true');
  await expect(app.page.locator('#g-Noa .gtext')).toBeVisible();
  expect(await app.sidewaysScroll()).toBeLessThanOrEqual(0);
});
