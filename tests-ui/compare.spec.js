// Phase 33 ticket 5 (#294): Compare from a program's page: pick a second, see both names, both muscle maps and what they
// share; an own program can be compared.
const { test, expect } = require('./fixtures.js');

async function compare(app, from, query, pick) {
  await app.open(`#p-${from}`);
  await app.page.getByRole('button', { name: 'Compare', exact: true }).click();
  const sheet = app.page.getByRole('dialog', { name: /^Compare .* with…$/ });
  await expect(sheet.getByRole('searchbox')).toBeFocused();
  await sheet.getByRole('searchbox').fill(query);
  await sheet.locator(`[data-compare-to="${pick}"]`).click();
  await expect(app.page).toHaveURL(new RegExp(`#compare/${from}/${pick}$`));
}

test('compare two library programs: both names, both maps, the table and the exercises in common', async ({ app }, testInfo) => {
  await compare(app, 'three-split-60', 'iron', 'iron-ppl');
  const want = await app.data(() => KBCompare.of(programs.get('three-split-60'), programs.get('iron-ppl'), EX));
  await expect(app.heading()).toHaveText('Three-Split 60 and Iron PPL');
  await expect(app.page.getByRole('img', { name: 'Muscles worked by Three-Split 60' })).toBeVisible();
  await expect(app.page.getByRole('img', { name: 'Muscles worked by Iron PPL' })).toBeVisible();
  await expect(app.page.locator('.cmptable tbody tr').first()).toContainText(`${want.a.days} days`);
  await expect(app.page.getByRole('heading', { name: `In common: ${want.common.length} exercises` })).toBeVisible();
  await expect(app.page.locator('.cmpcommon li')).toHaveCount(Math.min(12, want.common.length));
  if (want.common.length > 12) {
    await app.page.getByRole('button', { name: `Show all ${want.common.length}` }).click();
    await expect(app.page.locator('.cmpcommon li')).toHaveCount(want.common.length);
  }
  if (testInfo.project.name === 'phone-light') expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: testInfo.outputPath('compare.png'), fullPage: true });
  // a shared exercise opens its page; the program's name goes back
  await app.page.locator('.cmpcommon button').first().click();
  await expect(app.heading()).toHaveText(await app.data((id) => EX[id].name, want.common[0].ex));
  await app.go('#compare/three-split-60/iron-ppl');
  await app.page.getByRole('button', { name: '← Three-Split 60' }).click();
  await expect(app.heading()).toHaveText('Three-Split 60');
});

test('an own program can be compared; the picker leaves out the program itself', async ({ app }) => {
  await app.open('#programs');
  await app.page.getByRole('button', { name: 'Build your own' }).click();
  await app.page.getByRole('group', { name: 'Days in a cycle' }).waitFor();
  await app.page.getByRole('button', { name: 'Save program' }).click();
  await expect(app.heading()).toHaveText(/^My /);
  const pid = await app.data(() => prog().id), name = await app.heading().textContent();
  await app.page.getByRole('button', { name: 'Compare', exact: true }).click();
  const sheet = app.page.getByRole('dialog', { name: /^Compare .* with…$/ });
  await sheet.getByRole('searchbox').fill(name);
  await expect(sheet.locator(`[data-compare-to="${pid}"]`)).toHaveCount(0);
  await sheet.getByRole('searchbox').fill('three-split');
  await sheet.locator('[data-compare-to="three-split-60"]').click();
  await expect(app.heading()).toHaveText(`${name} and Three-Split 60`);
  await expect(app.page.locator('.cmptable thead')).toContainText(name);
  await expect(app.page.getByRole('img', { name: `Muscles worked by ${name}` })).toBeVisible();
});
