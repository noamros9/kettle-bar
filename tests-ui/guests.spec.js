// Phase 35 ticket 3g2 (decisions 415, 416, 419, 425): the guests, a page no menu links to, and a guest's card from a cue
const { test, expect } = require('./fixtures.js');
const { GUESTS } = require('../app/guests.js');
const { WOMEN, MEN } = require('../app/third-names.js');

const EX = 'fuck3_spitroast_bed'; // FMF: "{woman} kneels beyond her…"
// held 700 ms, then released: the page has already gone to the guests, so the release and click land on the old element
const longPress = async (loc) => {
  const el = await loc.elementHandle();
  await el.dispatchEvent('pointerdown'); await loc.page().waitForTimeout(700); await el.dispatchEvent('pointerup'); await el.dispatchEvent('click');
};

test('the page lists every guest, women then men, each with her facts row and "not written yet"', async ({ app }) => {
  await app.open('#guests');
  await expect(app.heading()).toHaveText('The guests');
  const names = await app.page.locator('.guest h2').allTextContents();
  expect(names).toEqual([...WOMEN, ...MEN]);
  const noa = GUESTS.Noa;
  await expect(app.page.locator('#g-Noa .gfacts')).toContainText(`${noa.age} · ${noa.height} cm · ${noa.body}`);
  await expect(app.page.locator('#g-Noa')).toContainText(`${noa.breasts} tits`);
  await expect(app.page.locator('#g-Itay .gfacts')).toContainText(`cock: ${GUESTS.Itay.cock}`);
  await expect(app.page.locator('#g-Noa')).toContainText('Not written yet');
  expect(await app.sidewaysScroll()).toBeLessThanOrEqual(0);
});

test('no link to the guests anywhere', async ({ app }) => {
  for (const hash of ['#programs', '#exercises', '#settings', `#ex-${EX}`]) {
    await app.open(hash);
    expect(await app.data(() => document.querySelectorAll('a[href*="guests"], [data-go="guests"]').length), hash).toBe(0);
  }
});

test('the Group sex chip: a tap filters, a long-press opens the guests', async ({ app }) => {
  await app.open('#exercises');
  const chip = app.page.locator('[data-exf="family:group"]');
  await chip.click();
  await expect(chip).toHaveAttribute('aria-pressed', 'true');
  expect(new URL(app.page.url()).hash).toBe('#exercises');
  await longPress(chip);
  await expect(app.heading()).toHaveText('The guests');
});

test("a name in a cue: a tap shows her card, a long-press opens the page at her", async ({ app }) => {
  await app.open(`#ex-${EX}`);
  const name = app.page.locator('.facts [data-guest]').first();
  const who = await name.getAttribute('data-guest');
  expect(WOMEN).toContain(who);
  await expect(name).toHaveText(who);
  await name.click();
  const sheet = app.page.getByRole('dialog', { name: who });
  await expect(sheet).toBeVisible();
  await expect(sheet.locator('.gfacts')).toContainText(`${GUESTS[who].age} · ${GUESTS[who].height} cm`);
  await sheet.getByRole('button', { name: 'Close' }).last().click();
  await expect(sheet).toHaveCount(0);
  await longPress(name);
  await expect(app.heading()).toHaveText('The guests');
  expect(decodeURIComponent(new URL(app.page.url()).hash)).toBe(`#guests/${who}`);
  await expect(app.page.locator(`#g-${who}`)).toBeInViewport();
});

test('the print view names her plainly', async ({ app }) => {
  await app.page.addInitScript(() => { window.print = () => {}; }); // the dialog can't open in a test
  await app.open(`#print/ex-${EX}`);
  await expect(app.page.locator('.printview')).toBeVisible();
  await expect(app.page.locator('[data-guest]')).toHaveCount(0);
});
