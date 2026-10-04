// Architecture review IV ticket 2: every button the pages draw names an action the click table knows (app/main.js
// ACTIONS), so no button is drawn that does nothing.
const { test, expect } = require('./fixtures.js');

// data attributes on buttons that aren't actions: state for the page or for CSS, or handled by their own listener
const NOT_ACTIONS = ['s', 'keep', 'm'];
async function orphans(app) {
  return app.data((skip) => [...document.querySelectorAll('#app button, .top button')].flatMap((b) => {
    const keys = Object.keys(b.dataset).filter((k) => !skip.includes(k));
    if (!keys.length || b.id) return [];
    return keys.some((k) => window.KB_ACTIONS.includes(k)) ? [] : [`${b.outerHTML.slice(0, 80)}`];
  }), NOT_ACTIONS);
}

test('every button on every page has an action', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  const seen = [];
  const visit = async (hash, prep) => { await app.go(hash); if (prep) await prep(); seen.push(...(await orphans(app)).map((o) => `${hash}: ${o}`)); };
  await app.open('#programs');
  await visit('#programs', async () => { await app.page.getByRole('button', { name: /Length:/ }).click(); });
  await visit('#programs', async () => { await app.page.getByRole('button', { name: /^Random workout/ }).click(); await app.page.locator('.sheetwrap').waitFor(); });
  await app.data(() => { randomState = null; render(); }); // the random sheet is still open from the visit above
  await visit('#programs', async () => { await app.page.getByRole('button', { name: 'Help me pick' }).click(); await app.page.getByRole('group', { name: 'Goal' }).getByRole('button', { name: 'Get stronger' }).click(); await app.page.locator('.pickres').first().waitFor(); });
  await app.page.locator('.picksheet [data-pick-close]').click();
  await visit('#p-three-split-60-d1', async () => { await app.page.locator('[data-swap]').first().click(); });
  await app.page.locator('.sheetclose[data-swap-cancel]').click(); // the sheet's own Cancel: a long swap list covers the backdrop's middle
  await visit('#p-three-split-60', async () => { await app.page.getByRole('button', { name: /Start Round/ }).click(); });
  await app.page.locator('[data-round-cancel]').first().click();
  await visit('#exercises');
  await visit('#ex-pushup');
  await visit('#muscles', async () => { await app.page.getByRole('group', { name: 'Muscles' }).getByRole('button', { name: 'Glutes' }).click(); });
  for (const t of ['Overview', 'Muscles', 'Time', 'Exercises', 'History']) await visit('#stats', async () => { const b = app.page.getByRole('group', { name: 'Stats views' }).getByRole('button', { name: t }); if (await b.count()) await b.click(); });
  await visit('#settings');
  await visit('#build');
  expect(seen).toEqual([]);
});
