// Back keeps your place (Phase 31 ticket 1, #214): the phone's or browser's Back returns to the same scroll position on
// five pages (Programs ← a program, Exercises ← an exercise, a program ← its day, Stats/History ← a day, a day ← an
// exercise opened from it); what you opened and typed stays; a top tab still starts at the top.
const { test, expect } = require('./fixtures.js');

// scroll so `el` sits at the top of the screen, and return where it is
async function scrollTo(app, el) {
  // just below the sticky header: a card under it gets scrolled by the tap itself, which then saves that place
  await el.evaluate((n) => { n.scrollIntoView({ block: 'start' }); window.scrollBy(0, -(document.querySelector('.top') || { offsetHeight: 0 }).offsetHeight - 16); });
  await app.page.waitForTimeout(400); // the scroll save settles (200 ms) before leaving; leaving saves too
  return app.page.evaluate(() => window.scrollY);
}
const top = (el) => el.evaluate((n) => n.getBoundingClientRect().top);
async function back(app) {
  await app.page.goBack();
  await app.loaded();
}
async function samePlace(app, el, y, t) {
  await expect.poll(() => app.page.evaluate(() => window.scrollY)).toBeGreaterThan(y - 5);
  expect(Math.abs((await app.page.evaluate(() => window.scrollY)) - y)).toBeLessThanOrEqual(4);
  expect(Math.abs((await top(el)) - t)).toBeLessThanOrEqual(4);
}

test('Programs ← a program: the same card in view, an opened "Show all" still open; the Programs tab starts at the top', async ({ app }) => {
  await app.open('#programs');
  const more = app.page.locator('.shelfmore[aria-expanded="false"]').first();
  const subject = await more.getAttribute('data-shelf');
  await more.click();
  await expect(app.page.locator(`.shelfmore[data-shelf="${subject}"]`)).toHaveAttribute('aria-expanded', 'true');
  const card = app.page.locator('.pgroup').nth(3).locator('.pcard').first();
  const id = await card.getAttribute('data-open-prog');
  const y = await scrollTo(app, card);
  expect(y).toBeGreaterThan(300);
  const t = await top(card);
  await card.click();
  await expect(app.page).toHaveURL(new RegExp(`#p-${id}$`));
  await app.loaded();
  await back(app);
  await expect(app.page).toHaveURL(/#programs$/);
  await samePlace(app, app.page.locator(`.pcard[data-open-prog="${id}"]`).first(), y, t);
  await expect(app.page.locator(`.shelfmore[data-shelf="${subject}"]`)).toHaveAttribute('aria-expanded', 'true');
  // a top tab is a new start: the top
  await app.page.locator(`.pcard[data-open-prog="${id}"]`).first().click();
  await app.loaded();
  await app.page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Programs' }).click();
  await expect(app.page).toHaveURL(/#programs$/);
  await expect.poll(() => app.page.evaluate(() => window.scrollY)).toBe(0);
});

test('Exercises ← an exercise: the same card in view, the search still typed', async ({ app }) => {
  await app.open('#exercises');
  await app.page.locator('#ex-search').fill('squat');
  const card = app.page.locator('.exlink').nth(8);
  const y = await scrollTo(app, card);
  expect(y).toBeGreaterThan(300);
  const t = await top(card);
  const id = await card.getAttribute('data-ex');
  await card.click();
  await expect(app.page).toHaveURL(new RegExp(`#ex-${id}$`));
  await back(app);
  await expect(app.page.locator('#ex-search')).toHaveValue('squat');
  await samePlace(app, app.page.locator(`.exlink[data-ex="${id}"]`).first(), y, t);
});

test('a program ← day 37, also for a program first opened through #today', async ({ app }) => {
  await app.open('#p-three-split-60');
  const row = app.page.locator('button.open[data-day="37"]');
  const y = await scrollTo(app, row);
  expect(y).toBeGreaterThan(300);
  const t = await top(row);
  await row.click();
  await expect(app.page).toHaveURL(/#p-three-split-60-d37$/);
  await app.loaded();
  await back(app);
  await expect(app.page).toHaveURL(/#p-three-split-60$/);
  await samePlace(app, row, y, t);
  // #today rewrites its own entry into the day it opens; Back from an exercise of it still lands where you were
  await app.go('#today');
  const ex = app.page.locator('.exlink').nth(3);
  const y2 = await scrollTo(app, ex), t2 = await top(ex);
  await ex.click();
  await back(app);
  await samePlace(app, ex, y2, t2);
});

test('Stats/History ← a day: the same place, the picked day still open', async ({ app }) => {
  const at = (m, d) => new Date(2026, m - 1, d, 9).toISOString();
  await app.page.clock.setFixedTime(new Date(2026, 8, 30, 12));
  await app.open('#settings');
  await app.page.locator('#import-file').setInputFiles({ name: 'h.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ format: 'kettle-bar-progress', version: 1, exportedAt: 'x', programs: { 'three-split-60': { 1: at(9, 28) } } })) });
  await app.page.getByRole('button', { name: /^Merge/ }).click();
  await app.go('#stats');
  await app.page.getByRole('group', { name: 'Stats views' }).getByRole('button', { name: 'History' }).click();
  await app.page.getByRole('button', { name: /^Monday 28 September/ }).click();
  const work = app.page.locator('.hlist .hwork').first();
  const y = await scrollTo(app, work);
  const t = await top(work);
  await work.click();
  await expect(app.page).toHaveURL(/#p-three-split-60-d1$/);
  await app.loaded();
  await back(app);
  await expect(app.page.locator('#hday-h')).toHaveText('Monday 28 September');
  await samePlace(app, work, y, t);
});

test('a long day ← an exercise opened from its block', async ({ app }) => {
  await app.open('#p-three-split-60-d1');
  const ex = app.page.locator('.exlink').nth(5);
  const y = await scrollTo(app, ex);
  expect(y).toBeGreaterThan(300);
  const t = await top(ex);
  const id = await ex.getAttribute('data-ex');
  await ex.click();
  await expect(app.page).toHaveURL(new RegExp(`#ex-${id}$`));
  await back(app);
  await expect(app.page).toHaveURL(/#p-three-split-60-d1$/);
  await samePlace(app, ex, y, t);
});
