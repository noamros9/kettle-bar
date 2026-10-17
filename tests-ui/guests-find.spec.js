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

// 3g9 (442-445): the filters as group pills that open a sheet
const sheet = (app) => app.page.getByRole('dialog', { name: 'Filters' });
const pick = (app, key, v) => sheet(app).locator(`[data-gf="pick:${key}:${v}"]`);

test('tabs: Men shows only the men; its sheet has no women-only filters and has Cock', async ({ app }) => {
  await app.open('#guests');
  await gf(app, 'kind:man').click();
  const men = Object.keys(GUESTS).filter((n) => GUESTS[n].kind === 'man');
  await expect(cards(app)).toHaveCount(men.length);
  await gf(app, 'sheet:all').click();
  await expect(sheet(app).locator('[data-gf^="pick:breasts:"]')).toHaveCount(0);
  await expect(sheet(app).locator('[data-gf^="pick:cock:"]').first()).toBeVisible();
});

test('a group pill opens the sheet at its group only; Filters opens every group', async ({ app }) => {
  await app.open('#guests');
  await gf(app, 'sheet:look').click();
  await expect(sheet(app).locator('[data-gf^="pick:hair:"]').first()).toBeVisible();
  await expect(sheet(app).locator('[data-gf^="pick:breasts:"]')).toHaveCount(0);
  await sheet(app).locator('[data-gf="sheet:close"]').last().click();
  await expect(sheet(app)).toHaveCount(0);
  await gf(app, 'sheet:all').click();
  for (const k of ['body', 'breasts', 'hair', 'vibe', 'acts']) await expect(sheet(app).locator(`[data-gf^="pick:${k}:"]`).first()).toBeVisible();
  expect(await app.sidewaysScroll()).toBeLessThanOrEqual(0);
});

test('picking: several values, live counts, a chip per pick that removes it; Clear all resets', async ({ app }) => {
  await app.open('#guests');
  await gf(app, 'sheet:body').click();
  const n = (v) => Object.keys(GUESTS).filter((x) => GUESTS[x].breasts === v).length;
  await expect(pick(app, 'breasts', 'very big')).toContainText(String(n('very big')));
  await pick(app, 'breasts', 'very big').click();
  await pick(app, 'breasts', 'small').click();
  await expect(pick(app, 'breasts', 'small')).toHaveAttribute('aria-pressed', 'true');
  await sheet(app).locator('[data-gf="sheet:close"]').last().click();
  await expect(cards(app)).toHaveCount(n('very big') + n('small'));
  await expect(gf(app, 'sheet:all')).toContainText('2');
  await expect(gf(app, 'sheet:body')).toContainText('2');
  const chip = app.page.locator('#gresults .gpicked [data-gf="pick:breasts:small"]');
  await expect(chip).toContainText('small tits');
  await chip.click();
  await expect(cards(app)).toHaveCount(n('very big'));
  await gf(app, 'clear:1').click();
  await expect(cards(app)).toHaveCount(all);
});

test('a value that would give no one is dimmed', async ({ app }) => {
  await app.open('#guests');
  await gf(app, 'kind:man').click();
  await gf(app, 'sheet:all').click();
  const cock = GUESTS[Object.keys(GUESTS).find((x) => GUESTS[x].kind === 'man')].cock;
  await pick(app, 'cock', cock).click();
  const hairs = sheet(app).locator('[data-gf^="pick:hair:"]');
  const dims = await hairs.evaluateAll((l) => l.filter((b) => b.classList.contains('dim')).map((b) => b.textContent));
  for (const d of dims) expect(d).toMatch(/\b0$/);
});

test('sort: Oldest puts the oldest first', async ({ app }) => {
  await app.open('#guests');
  await gf(app, 'menu:sort').click(); // Sort beside Filters (445)
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

// 3g10 (450): From splits the world by region; each value with its count
test('From on the Look sheet: Israeli, American, British and the five regions, each with a count; Asia and the Pacific finds Sakura', async ({ app }) => {
  await app.open('#guests');
  await gf(app, 'sheet:look').click();
  const from = app.page.getByRole('group', { name: 'From' }).locator('.fchip');
  await expect(from).toHaveCount(8);
  const labels = (await from.allTextContents()).map((t) => t.replace(/\s*\d+$/, ''));
  expect(labels).toEqual(['Israeli', 'American', 'British', 'Latin America', 'Europe', 'Asia and the Pacific', 'Middle East', 'Africa']);
  const asia = Object.keys(GUESTS).filter((n) => GUESTS[n].region === 'asia');
  await expect(gf(app, 'pick:from:asia').locator('.fcount')).toHaveText(String(asia.length));
  await gf(app, 'pick:from:asia').click();
  await app.page.locator('.gsbtns [data-gf="sheet:close"]').click(); // Show N
  await expect(cards(app)).toHaveCount(asia.length);
  await expect(app.page.locator('#g-Sakura')).toBeVisible();
});
