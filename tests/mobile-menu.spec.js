// @ts-check
/**
 * mobile-menu.spec.js — Tests 21–26: hamburger + drawer (mobile-chrome only).
 *   21 burger-visible-mobile        — burger shown, nav-links hidden < 720px
 *   22 open-drawer                  — opacity polls to >0.99, pointer-events:auto
 *   23 drawer-links                 — 3 data-menu anchors with matching hrefs
 *   24 close-on-link-click          — clicking a drawer link removes menu-open
 *   25 escape-closes-drawer         — Esc key while open closes drawer
 *   26 aria-expanded-and-scroll-lock — aria-expanded toggles, body overflow=hidden
 *   (entire suite skips on chromium project)
 */
const { test, expect } = require('./fixtures');

test.describe('Mobile menu', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chrome', 'mobile menu requires <= 720px viewport');
  });

  test('21 burger-visible-mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#burger')).toBeVisible();
    await expect(page.locator('.nav-links')).toBeHidden();
  });

  test('22 open-drawer', async ({ page }) => {
    await page.goto('/');
    await page.click('#burger');
    await expect(page.locator('body')).toHaveClass(/menu-open/);
    // Drawer opacity transitions over 280ms — poll until settled.
    await expect.poll(
      async () =>
        parseFloat(
          await page.locator('#menu-drawer').evaluate((el) => getComputedStyle(el).opacity)
        ),
      { timeout: 2000 }
    ).toBeGreaterThan(0.99);
    const pe = await page.locator('#menu-drawer').evaluate((el) => getComputedStyle(el).pointerEvents);
    expect(pe).toBe('auto');
  });

  test('23 drawer-links', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('#menu-drawer a[data-menu]');
    await expect(links).toHaveCount(3);
    await expect(links.nth(0)).toHaveAttribute('href', '#works');
    await expect(links.nth(1)).toHaveAttribute('href', '#about');
    await expect(links.nth(2)).toHaveAttribute('href', '#contact');
  });

  test('24 close-on-link-click', async ({ page }) => {
    await page.goto('/');
    await page.click('#burger');
    await expect(page.locator('body')).toHaveClass(/menu-open/);
    await page.click('#menu-drawer a[href="#works"]');
    await expect(page.locator('body')).not.toHaveClass(/menu-open/);
  });

  test('25 escape-closes-drawer', async ({ page }) => {
    await page.goto('/');
    await page.click('#burger');
    await expect(page.locator('body')).toHaveClass(/menu-open/);
    await page.keyboard.press('Escape');
    await expect(page.locator('body')).not.toHaveClass(/menu-open/);
  });

  test('26 aria-expanded-and-scroll-lock', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#burger')).toHaveAttribute('aria-expanded', 'false');
    await page.click('#burger');
    await expect(page.locator('#burger')).toHaveAttribute('aria-expanded', 'true');
    const overflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
    expect(overflow).toBe('hidden');
    await page.keyboard.press('Escape');
    await expect(page.locator('#burger')).toHaveAttribute('aria-expanded', 'false');
  });
});
