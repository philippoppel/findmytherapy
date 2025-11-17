import { Page } from '@playwright/test'

/**
 * Dismisses the cookie consent banner if it's visible
 * This prevents the banner from blocking other UI elements during tests
 */
export async function dismissCookieBanner(page: Page) {
  const banner = page.getByTestId('cookie-consent-banner')

  // Check if banner is visible
  const isVisible = await banner.isVisible().catch(() => false)

  if (isVisible) {
    // Click the "Nur Essenziell" button (GDPR compliant - minimal consent)
    await page.getByTestId('cookie-reject-all').click()

    // Wait for banner to disappear
    await banner.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {
      // If waiting fails, try clicking the close button as fallback
      return page.getByTestId('cookie-banner-close').click().catch(() => {})
    })
  }
}

/**
 * Common setup for visual tests that should run before each test
 */
export async function setupVisualTest(page: Page) {
  // Dismiss cookie banner to prevent it from blocking UI
  await dismissCookieBanner(page)
}
