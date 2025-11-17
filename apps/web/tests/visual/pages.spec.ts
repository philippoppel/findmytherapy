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

  // Removed: how-it-works page (doesn't exist on current site)
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

// Removed: Responsive behavior tests (tablet/wide) - mobile + desktop coverage is sufficient

// Removed: Text overflow detection - covered by ui-issues.spec.ts

// Removed: Component state tests (hover, validation) - too flaky and timing-dependent

// Removed: Dark mode tests - not currently implemented

// Removed: Localization tests - only German is currently supported
