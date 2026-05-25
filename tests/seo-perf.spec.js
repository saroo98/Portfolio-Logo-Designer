// @ts-check
const { test, expect } = require('./fixtures');

test.describe('SEO / Performance / Console hygiene', () => {
  test('47 favicon-link', async ({ page }) => {
    const response = await page.goto('/');
    expect(response.status()).toBe(200);
    const icon = page.locator('link[rel~="icon"]').first();
    await expect(icon).toHaveCount(1);
    const href = await icon.getAttribute('href');
    expect(href, 'favicon href').toBeTruthy();
    const url = new URL(href, page.url()).toString();
    const r = await page.request.get(url);
    expect(r.status(), `favicon at ${url}`).toBe(200);
  });

  test('48 theme-color-meta', async ({ page }) => {
    await page.goto('/');
    const metas = page.locator('meta[name="theme-color"]');
    await expect(metas.first()).toHaveCount(1);
    const count = await metas.count();
    expect(count).toBeGreaterThanOrEqual(1);
    for (let i = 0; i < count; i++) {
      const content = await metas.nth(i).getAttribute('content');
      expect(content, 'theme-color valid').toMatch(/^(#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|[a-zA-Z]+)/);
    }
  });

  test('49 first-work-priority', async ({ page }) => {
    await page.goto('/');
    const first = page.locator('img[src*="01-jobjooya.jpg"]');
    await expect(first).toHaveCount(1);
    await expect(first).toHaveAttribute('fetchpriority', 'high');
    await expect(first).toHaveAttribute('loading', 'lazy');
  });

  test('50 no-console-errors-full-flow', async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => pageErrors.push(String(err && err.message)));
    page.on('requestfailed', (req) => failedRequests.push(`${req.method()} ${req.url()} :: ${req.failure() && req.failure().errorText}`));
    page.on('response', async (resp) => {
      if (resp.status() >= 400 && !resp.url().includes('favicon')) {
        failedRequests.push(`HTTP ${resp.status()} ${resp.url()}`);
      }
    });

    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    await page.click('#theme');
    await page.click('#theme');

    await page.locator('.work:nth-of-type(1) > figure').click();
    await expect(page.locator('#lightbox')).toHaveClass(/is-open/);
    await page.click('#lb-next');
    await page.click('#lb-next');
    await page.click('#lb-next');
    await page.click('#lb-prev');
    await page.keyboard.press('Escape');
    await expect(page.locator('#lightbox')).not.toHaveClass(/is-open/);

    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    expect(consoleErrors, 'no console errors').toEqual([]);
    expect(pageErrors, 'no page errors').toEqual([]);
    expect(failedRequests, 'no failed requests').toEqual([]);
  });
});
