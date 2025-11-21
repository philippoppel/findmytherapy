import { Page, expect } from '@playwright/test'

/**
 * Dismisses the cookie consent banner if it's visible
 * This prevents the banner from blocking other UI elements during tests
 */
export async function dismissCookieBanner(page: Page) {
  try {
    // Wait a bit for the banner to appear (it might be lazy-loaded)
    await page.waitForTimeout(500)

    const banner = page.getByTestId('cookie-consent-banner')
    const isVisible = await banner.isVisible().catch(() => false)

    if (isVisible) {
      // Try to click the reject button with force option
      const rejectButton = page.getByTestId('cookie-reject-all')
      if (await rejectButton.isVisible().catch(() => false)) {
        await rejectButton.click({ force: true, timeout: 2000 }).catch(() => {})
      }

      // Try close button as fallback
      const closeButton = page.getByTestId('cookie-banner-close')
      if (await closeButton.isVisible().catch(() => false)) {
        await closeButton.click({ force: true, timeout: 2000 }).catch(() => {})
      }

      // Wait for banner to disappear
      await banner.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {})

      // Additional wait to ensure DOM has settled
      await page.waitForTimeout(500)
    }
  } catch (error) {
    // Silently ignore errors - banner might not be present
  }
}

/**
 * Common setup for visual tests that should run before each test
 */
export async function setupVisualTest(page: Page) {
  // Dismiss cookie banner to prevent it from blocking UI
  await dismissCookieBanner(page)
}

/**
 * Generate unique test email with timestamp
 */
export function generateTestEmail(prefix: string = 'test'): string {
  const timestamp = Date.now()
  return `${prefix}-${timestamp}@test.local`
}

/**
 * Generate unique slug with timestamp
 */
export function generateTestSlug(prefix: string = 'test'): string {
  const timestamp = Date.now()
  return `${prefix}-${timestamp}`
}

/**
 * Wait for network to be idle
 */
export async function waitForNetworkIdle(page: Page, timeout: number = 5000) {
  await page.waitForLoadState('networkidle', { timeout }).catch(() => {
    // Ignore timeout - best effort
  })
}

/**
 * Login as a user via /login page
 */
export async function loginAsUser(
  page: Page,
  email: string,
  password: string
) {
  await page.goto('/login')

  // Fill credentials - use ID selectors as they're more stable
  await page.locator('#email').fill(email)
  await page.locator('#password').fill(password)

  // Submit form
  await page.getByRole('button', { name: /anmelden/i }).click()

  // Wait for redirect to dashboard
  await page.waitForURL('/dashboard', { timeout: 15000 })
  await waitForNetworkIdle(page)
}

/**
 * Fill a form field by label
 */
export async function fillField(page: Page, label: string | RegExp, value: string) {
  await page.getByLabel(label).fill(value)
}

/**
 * Select from a dropdown/select field
 */
export async function selectOption(page: Page, label: string | RegExp, value: string) {
  await page.getByLabel(label).selectOption(value)
}

/**
 * Click a checkbox by label
 */
export async function toggleCheckbox(page: Page, label: string | RegExp) {
  await page.getByLabel(label).click()
}

/**
 * Wait for toast/notification message
 */
export async function waitForToast(page: Page, message: string | RegExp) {
  await expect(page.getByText(message)).toBeVisible({ timeout: 5000 })
}
