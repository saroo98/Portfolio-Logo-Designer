// @ts-check
const { test, expect } = require('./fixtures');

const FIG = (n) => `.work:nth-of-type(${n}) > figure`;

test.describe('Lightbox', () => {
  test('27 figures-are-buttons', async ({ page }) => {
    await page.goto('/');
    const figures = page.locator('.work > figure');
    await expect(figures).toHaveCount(11);
    for (let i = 0; i < 11; i++) {
      const f = figures.nth(i);
      await expect(f).toHaveAttribute('role', 'button');
      await expect(f).toHaveAttribute('tabindex', '0');
    }
  });

  test('28 open-on-click', async ({ page }) => {
    await page.goto('/');
    await page.locator(FIG(1)).click();
    await expect(page.locator('#lightbox')).toHaveClass(/is-open/);
    await expect(page.locator('body')).toHaveClass(/lb-open/);
  });

  test('29 image-src-matches', async ({ page }) => {
    await page.goto('/');
    await page.locator(FIG(1)).click();
    await expect(page.locator('#lightbox')).toHaveClass(/is-open/);
    await expect.poll(async () =>
      page.locator('#lb-img').getAttribute('src')
    ).toMatch(/works\/01-jobjooya\.jpg$/);
  });

  test('30 counter-1-of-11', async ({ page }) => {
    await page.goto('/');
    await page.locator(FIG(1)).click();
    await expect(page.locator('#lb-idx')).toHaveText('1');
    await expect(page.locator('#lb-total')).toHaveText('11');
  });

  test('31 next-advances', async ({ page }) => {
    await page.goto('/');
    await page.locator(FIG(1)).click();
    await expect(page.locator('#lb-idx')).toHaveText('1');
    await page.click('#lb-next');
    await expect(page.locator('#lb-idx')).toHaveText('2');
    await expect.poll(async () =>
      page.locator('#lb-img').getAttribute('src')
    ).toMatch(/works\/02-gorosneh\.jpg$/);
  });

  test('32 prev-rewinds', async ({ page }) => {
    await page.goto('/');
    await page.locator(FIG(2)).click();
    await expect(page.locator('#lb-idx')).toHaveText('2');
    await page.click('#lb-prev');
    await expect(page.locator('#lb-idx')).toHaveText('1');
  });

  test('33 loop-wrap', async ({ page }) => {
    await page.goto('/');
    await page.locator(FIG(11)).click();
    await expect(page.locator('#lb-idx')).toHaveText('11');
    await page.click('#lb-next');
    await expect(page.locator('#lb-idx')).toHaveText('1');
  });

  test('34 click-overlay-closes', async ({ page }) => {
    await page.goto('/');
    await page.locator(FIG(1)).click();
    await expect(page.locator('#lightbox')).toHaveClass(/is-open/);
    // click on lightbox padding area, not the stage/image
    await page.locator('#lightbox').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('#lightbox')).not.toHaveClass(/is-open/);
  });

  test('35 escape-closes', async ({ page }) => {
    await page.goto('/');
    await page.locator(FIG(1)).click();
    await expect(page.locator('#lightbox')).toHaveClass(/is-open/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#lightbox')).not.toHaveClass(/is-open/);
    await expect(page.locator('body')).not.toHaveClass(/lb-open/);
  });

  test('36 arrow-keys-navigate', async ({ page }) => {
    await page.goto('/');
    await page.locator(FIG(5)).click();
    await expect(page.locator('#lb-idx')).toHaveText('5');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#lb-idx')).toHaveText('6');
    // Lightbox swap is intentionally debounced (~440ms total).
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('#lb-idx')).toHaveText('5');
  });
});
