import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/docs/colors', '/docs/components'] as const;
const themeClasses = ['theme-light', 'theme-dark', 'theme-simple'] as const;

const runAxe = (page: Parameters<typeof test>[0]['page']) =>
  new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .disableRules(['color-contrast']) // bereits durch Jest abgedeckt, verhindert Doppelmeldungen
    .include('main');

test.describe('Design System Docs Accessibility', () => {
  for (const route of routes) {
    test(`page ${route} passes axe without serious violations`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const results = await runAxe(page).analyze();
      const serious = results.violations.filter((violation) =>
        ['serious', 'critical'].includes(violation.impact ?? 'minor'),
      );
      expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
    });
  }

  test('theme toggle keeps accessibility intact', async ({ page }) => {
    await page.goto('/docs/components');
    await page.waitForLoadState('networkidle');

    for (const theme of themeClasses) {
      await page.evaluate((nextTheme) => {
        document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-simple');
        document.documentElement.classList.add(nextTheme);
      }, theme);

      const results = await runAxe(page).analyze();
      const serious = results.violations.filter((violation) =>
        ['serious', 'critical'].includes(violation.impact ?? 'minor'),
      );
      expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
    }
  });
});
