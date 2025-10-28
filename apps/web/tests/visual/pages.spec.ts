/**
 * Visual Regression Tests for Pages
 *
 * Takes screenshots of key pages and compares them against baselines
 * to detect unwanted layout changes
 */

import { test, expect } from '@playwright/test'

// Common viewports to test
const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  wide: { width: 1920, height: 1080 }
}

const SCREENSHOT_OPTIONS = {
  maxDiffPixels: 100, // Allow small differences for antialiasing
  animations: 'disabled' as const,
  fullPage: true
}

test.describe('Visual Regression - Marketing Pages', () => {
  test('homepage renders correctly on desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('homepage-desktop.png', SCREENSHOT_OPTIONS)
  })

  test('homepage renders correctly on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('homepage-mobile.png', SCREENSHOT_OPTIONS)
  })

  test('about page renders correctly', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await page.goto('/about')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('about-desktop.png', SCREENSHOT_OPTIONS)
  })

  test('therapists directory renders correctly', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await page.goto('/therapists')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('therapists-directory-desktop.png', SCREENSHOT_OPTIONS)
  })

  test('how it works page renders correctly', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await page.goto('/how-it-works')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('how-it-works-desktop.png', SCREENSHOT_OPTIONS)
  })
})

test.describe('Visual Regression - Auth Pages', () => {
  test('login page renders correctly', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('login-desktop.png', SCREENSHOT_OPTIONS)
  })

  test('signup page renders correctly', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await page.goto('/signup')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('signup-desktop.png', SCREENSHOT_OPTIONS)
  })

  test('register page renders correctly', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await page.goto('/register')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('register-desktop.png', SCREENSHOT_OPTIONS)
  })
})

test.describe('Visual Regression - Triage Flow', () => {
  test('triage start page renders correctly', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await page.goto('/triage')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('triage-start-desktop.png', SCREENSHOT_OPTIONS)
  })

  test('triage renders correctly on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/triage')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('triage-start-mobile.png', SCREENSHOT_OPTIONS)
  })
})

test.describe('Visual Regression - Responsive Behavior', () => {
  test('homepage adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet)
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('homepage-tablet.png', SCREENSHOT_OPTIONS)
  })

  test('homepage adapts to wide viewport', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.wide)
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('homepage-wide.png', SCREENSHOT_OPTIONS)
  })
})

test.describe('Visual Regression - Text Overflow Detection', () => {
  test('no text overflow in navigation menu', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const nav = page.locator('nav')
    const box = await nav.boundingBox()

    if (box) {
      const scrollWidth = await nav.evaluate(el => el.scrollWidth)
      const clientWidth = await nav.evaluate(el => el.clientWidth)

      // Allow 1px tolerance for rounding
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    }
  })

  test('therapist cards do not overflow on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/therapists')
    await page.waitForLoadState('networkidle')

    // Wait for cards to load
    await page.waitForSelector('[data-testid="therapist-card"], .therapist-card', {
      timeout: 5000
    }).catch(() => {
      // Cards might not have test IDs yet, that's okay
    })

    const cards = page.locator('[data-testid="therapist-card"], .therapist-card')
    const count = await cards.count()

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const card = cards.nth(i)
        const box = await card.boundingBox()

        if (box) {
          const scrollWidth = await card.evaluate(el => el.scrollWidth)
          const clientWidth = await card.evaluate(el => el.clientWidth)

          expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
        }
      }
    }
  })

  test('form labels do not overflow on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const labels = page.locator('label')
    const count = await labels.count()

    for (let i = 0; i < count; i++) {
      const label = labels.nth(i)
      const box = await label.boundingBox()

      if (box && box.width > 0) {
        const scrollWidth = await label.evaluate(el => el.scrollWidth)
        const clientWidth = await label.evaluate(el => el.clientWidth)

        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
      }
    }
  })
})

test.describe('Visual Regression - Component States', () => {
  test('button hover states render correctly', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const primaryButton = page.getByRole('button').first()
    await primaryButton.hover()

    // Wait for hover animations
    await page.waitForTimeout(300)

    await expect(page).toHaveScreenshot('button-hover-state.png', {
      ...SCREENSHOT_OPTIONS,
      clip: await primaryButton.boundingBox() || undefined
    })
  })

  test('form validation errors render correctly', async ({ page }) => {
    await page.goto('/login')

    // Try to submit empty form
    await page.getByRole('button', { name: /anmelden|login/i }).click()

    // Wait for validation
    await page.waitForTimeout(300)

    await expect(page).toHaveScreenshot('form-validation-errors.png', SCREENSHOT_OPTIONS)
  })
})

test.describe('Visual Regression - Dark Mode (if implemented)', () => {
  test.skip('homepage renders correctly in dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('homepage-dark-mode.png', SCREENSHOT_OPTIONS)
  })
})

test.describe('Visual Regression - Localization', () => {
  test('homepage renders correctly with English locale', async ({ page }) => {
    await page.goto('/', {
      headers: {
        'Accept-Language': 'en'
      }
    })
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('homepage-en.png', SCREENSHOT_OPTIONS)
  })
})
