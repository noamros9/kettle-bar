// Exercises I skip (Phase 13 ticket 1): "Skip this exercise" on the exercise page, Settings → Exercises I skip lists
// them with Unskip. Kept as `skip: [exercise id]` in the synced prefs, only while not empty.
const { test, expect } = require('./fixtures.js');
const { library } = require('../tests/helpers/library.js');

const skipBtn = (app) => app.page.locator('.expage-skip [data-skip]');
const section = (app) => app.page.locator('section.setting', { has: app.page.getByRole('heading', { name: 'Exercises I skip' }) });

test('skip an exercise on its page: it lists in Settings, stays after a reload, and Unskip takes it off', async ({ app }) => {
  await app.open('#ex-pushup');
  await expect(skipBtn(app)).toHaveText('Skip this exercise');
  await expect(skipBtn(app)).toHaveAttribute('aria-pressed', 'false');
  await skipBtn(app).click();
  await expect(skipBtn(app)).toHaveText("Don't skip");
  await expect(skipBtn(app)).toHaveAttribute('aria-pressed', 'true');
  await expect(app.page.locator('.expage-skip .note')).toContainText('You skip this exercise');
  expect(await app.data(() => store.doc('prefs', 'main').skip)).toEqual(['pushup']);
  await app.go('#ex-kb_swing');
  await skipBtn(app).click();
  expect(await app.data(() => store.doc('prefs', 'main').skip)).toEqual(['pushup', 'kb_swing']);
  expect(await app.sidewaysScroll()).toBe(0);

  await app.page.reload(); await app.heading().waitFor(); await app.loaded();
  await app.go('#settings');
  const rows = section(app).locator('.skiprow');
  await expect(rows).toHaveCount(2);
  await expect(rows.first()).toContainText('Push-up');
  expect(await app.sidewaysScroll()).toBe(0);
  await section(app).getByRole('button', { name: /Unskip Push-up/ }).click();
  await expect(rows).toHaveCount(1);
  await section(app).getByRole('button', { name: /Unskip/ }).click();
  await expect(rows).toHaveCount(0);
  await expect(section(app)).toContainText('No exercises skipped');
  expect(await app.data(() => 'skip' in (store.doc('prefs', 'main') || {}))).toBe(false); // an empty list leaves no field
});

test('a skipped exercise in Settings opens its page; an id this app does not know is left out', async ({ app }) => {
  await app.open('#settings');
  await app.data(() => store.setDoc('prefs', 'main', { skip: ['gone_exercise', 'kb_swing'] }));
  const rows = section(app).locator('.skiprow');
  await expect(rows).toHaveCount(1);
  await rows.first().getByRole('button', { name: /Kettlebell swing/i }).first().click();
  await expect(app.heading()).toHaveText(/swing/i);
  await expect(skipBtn(app)).toHaveAttribute('aria-pressed', 'true');
});

// ---- Phase 13 ticket 2: skipped exercises swap out everywhere ----
test('a day swaps an exercise I skip for a stand-in, says so, and its Swap list leaves skipped ones out; unskip brings it back', async ({ app }, testInfo) => {
  await app.open('#p-three-split-60-d1');
  const x = await app.data(() => { const it = programs.day('three-split-60', 1).blocks[0].items[0]; return { id: it.ex, name: KBEx.EX[it.ex].name }; });
  await app.data((id) => store.setDoc('prefs', 'main', { skip: [id] }), x.id);
  const card = app.page.locator('article.ex').filter({ hasText: `Swapped: you skip ${x.name}` });
  await expect(card).toHaveCount(1);
  await expect(card.locator('.nm')).not.toHaveText(x.name);
  await expect(app.page.locator('.skipnote')).toContainText('1 exercise you skip is swapped for today');
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: testInfo.outputPath('skip-day.png') });
  const standIn = (await card.locator('.nm').textContent()).trim();
  await app.page.getByRole('button', { name: `Swap ${standIn}` }).click();
  const sheet = app.page.getByRole('dialog', { name: `Swap ${standIn}` });
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole('button', { name: new RegExp(`^${x.name}`) })).toHaveCount(0);
  await sheet.getByRole('button', { name: 'Cancel', exact: true }).click(); // exact: "Close-grip …" exercises are in the list too
  // the stats count the day as planned
  expect(await app.data((id) => days.resolved('three-split-60', 1).blocks[0].items[0].ex === id, x.id)).toBe(true);

  await app.page.locator('.skipnote').getByRole('button', { name: 'Change' }).click();
  await section(app).getByRole('button', { name: `Unskip ${x.name}` }).click();
  await app.go('#p-three-split-60-d1');
  await expect(app.page.locator('.skipnote')).toHaveCount(0);
  await expect(app.page.locator('article.ex .nm', { hasText: new RegExp(`^${x.name}$`) })).toHaveCount(1);
  await expect(app.page.locator('article.ex', { hasText: 'Swapped: you skip' })).toHaveCount(0);
});

test('a random workout swaps what I skip too', async ({ app }) => {
  await app.open('#programs');
  await app.page.getByRole('button', { name: /^Random workout/ }).click();
  const sheet = app.page.getByRole('dialog', { name: 'Random workout' });
  await sheet.getByRole('group', { name: 'Family' }).getByRole('button', { name: 'Strength', exact: true }).click(); // the recipe book is here
  await sheet.getByRole('button', { name: 'Start' }).click();
  await expect(app.page).toHaveURL(/#random$/);
  const x = await app.data(() => { const it = random.open().day.blocks[0].items[0]; return { id: it.ex, name: KBEx.EX[it.ex].name }; });
  await app.data((id) => store.setDoc('prefs', 'main', { skip: [id] }), x.id);
  // the workout is random: the skipped exercise may be in it more than once, and each one is swapped
  await expect(app.page.locator('article.ex').filter({ hasText: `Swapped: you skip ${x.name}` }).first()).toBeVisible();
  expect(await app.page.locator('article.ex .nm', { hasText: new RegExp(`^${x.name}$`) }).count()).toBe(0);
  await expect(app.page.locator('.skipnote')).toBeVisible();
});

test('an exercise I skip with no stand-in stays on its day, marked', async ({ app }) => {
  // heel raises have no stand-in (nothing else is led by the calves)
  const p = library().find((q) => q.days.some((d) => d.blocks.some((b) => b.items.some((it) => it.ex === 'heel_raise'))));
  const n = p.days.find((d) => d.blocks.some((b) => b.items.some((it) => it.ex === 'heel_raise'))).day;
  await app.open(`#p-${p.id}-d${n}`);
  await app.data(() => store.setDoc('prefs', 'main', { skip: ['heel_raise'] }));
  await expect(app.page.locator('article.ex').filter({ hasText: 'You skip this, no stand-in' }).first()).toBeVisible();
  await expect(app.page.locator('.skipnote')).toContainText('stay');
  expect(await app.sidewaysScroll()).toBe(0);
});
