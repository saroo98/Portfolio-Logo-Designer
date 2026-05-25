// @ts-check
const { test, expect } = require('./fixtures');

test.describe('Navigation', () => {
  test('09 brand-href-top', async ({ page }) => {
    await page.goto('/');
    const brand = page.locator('a.brand');
    await expect(brand).toHaveCount(1);
    await expect(brand).toHaveAttribute('href', '#top');
    await expect(brand).toHaveText('Maryam Ansari');
  });

  test('10 nav-links-count-and-targets', async ({ page }) => {
    test.skip(test.info().project.name === 'mobile-chrome', 'nav-links hidden < 720px');
    await page.goto('/');
    const links = page.locator('.nav-links a');
    await expect(links).toHaveCount(3);
    await expect(links.nth(0)).toHaveAttribute('href', '#works');
    await expect(links.nth(1)).toHaveAttribute('href', '#about');
    await expect(links.nth(2)).toHaveAttribute('href', '#contact');
  });

  test('11 nav-is-scrolled-class', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('header.nav');
    await expect(nav).not.toHaveClass(/is-scrolled/);
    await page.evaluate(() => window.scrollTo(0, 200));
    await expect(nav).toHaveClass(/is-scrolled/);
  });

  test('12 nav-active-on-works', async ({ page }) => {
    test.skip(test.info().project.name === 'mobile-chrome', 'nav-links hidden < 720px');
    await page.goto('/');
    await page.evaluate(() => {
      const works = document.getElementById('works');
      if (works) window.scrollTo(0, works.offsetTop + 20);
    });
    await expect(page.locator('.nav-links a[href="#works"]')).toHaveClass(/active/);
  });

  test('13 smooth-scroll-anchor', async ({ page }) => {
    test.skip(test.info().project.name === 'mobile-chrome', 'nav-links hidden < 720px');
    await page.goto('/');
    const before = await page.evaluate(() => window.scrollY);
    await page.click('.nav-links a[href="#works"]');
    await page.waitForFunction(() => {
      const w = document.getElementById('works');
      return w && Math.abs(window.scrollY - w.offsetTop) < 200;
    }, null, { timeout: 5000 });
    const after = await page.evaluate(() => window.scrollY);
    expect(after).toBeGreaterThan(before);
  });

  test('14 anchor-ids-exist', async ({ page }) => {
    test.skip(test.info().project.name === 'mobile-chrome', 'nav-links hidden < 720px');
    await page.goto('/');
    const hrefs = await page.locator('.nav-links a').evaluateAll((nodes) =>
      nodes.map((n) => n.getAttribute('href'))
    );
    for (const href of hrefs) {
      expect(href).toMatch(/^#\w+/);
      const id = href.slice(1);
      const exists = await page.evaluate((i) => !!document.getElementById(i), id);
      expect(exists, `anchor target #${id}`).toBe(true);
    }
  });
});
