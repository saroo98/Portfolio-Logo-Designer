// @ts-check
const { test, expect } = require('./fixtures');

const KEY = 'maryam-theme';

test.describe('Theme toggle', () => {
  test('15 default-theme-dark', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('16 toggle-dark-to-light', async ({ page }) => {
    await page.goto('/');
    await page.click('#theme');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('17 toggle-light-to-dark', async ({ page }) => {
    await page.goto('/');
    await page.click('#theme');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.click('#theme');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('18 persistence-across-reload', async ({ page }) => {
    await page.goto('/');
    await page.click('#theme');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    const stored = await page.evaluate((k) => localStorage.getItem(k), KEY);
    expect(stored).toBe('light');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('19 icon-swap', async ({ page }) => {
    await page.goto('/');
    const sunDark = await page.locator('.theme .sun').evaluate((el) => getComputedStyle(el).display);
    const moonDark = await page.locator('.theme .moon').evaluate((el) => getComputedStyle(el).display);
    expect(sunDark).toBe('none');
    expect(moonDark).toBe('block');

    await page.click('#theme');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    const sunLight = await page.locator('.theme .sun').evaluate((el) => getComputedStyle(el).display);
    const moonLight = await page.locator('.theme .moon').evaluate((el) => getComputedStyle(el).display);
    expect(sunLight).toBe('block');
    expect(moonLight).toBe('none');
  });

  test('20 bg-var-changes', async ({ page }) => {
    // Read --bg custom property directly (instant, not animated by transition).
    await page.goto('/');
    const darkBg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
    );
    await page.click('#theme');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    const lightBg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
    );
    expect(darkBg).not.toBe(lightBg);
    expect(darkBg).toBeTruthy();
    expect(lightBg).toBeTruthy();
  });
});
