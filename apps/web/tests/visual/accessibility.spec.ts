/**
 * Accessibility Tests
 *
 * Automated accessibility testing using axe-core to ensure WCAG 2.1 AA compliance
 * Tests run on all key pages to catch accessibility issues early
 */

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Test all key pages for accessibility
const PAGES_TO_TEST = [
  { path: '/', name: 'Homepage' },
  { path: '/about', name: 'About Page' },
  { path: '/therapists', name: 'Therapists Directory' },
  { path: '/how-it-works', name: 'How It Works' },
  { path: '/login', name: 'Login Page' },
  { path: '/signup', name: 'Signup Page' },
  { path: '/register', name: 'Register Page' },
  { path: '/triage', name: 'Triage Flow' },
]

// Common viewports to test
const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  desktop: { width: 1280, height: 720 },
}

test.describe('Accessibility - WCAG 2.1 AA Compliance', () => {
  for (const { path, name } of PAGES_TO_TEST) {
    test(`${name} should not have accessibility violations (desktop)`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop)
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('nextjs-portal')  // Exclude Next.js development error overlay
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test(`${name} should not have accessibility violations (mobile)`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile)
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('nextjs-portal')  // Exclude Next.js development error overlay
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })
  }
})

test.describe('Accessibility - Specific Checks', () => {
  test('color contrast meets WCAG AA standards', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .disableRules(['duplicate-id']) // Focus on contrast only
      .analyze()

    const contrastViolations = results.violations.filter((v) => v.id === 'color-contrast')
    expect(contrastViolations).toEqual([])
  })

  test('all interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .include('button, a, input, select, textarea')
      .analyze()

    const keyboardViolations = results.violations.filter((v) =>
      ['button-name', 'link-name', 'label'].includes(v.id)
    )
    expect(keyboardViolations).toEqual([])
  })

  test('images have appropriate alt text', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .include('img')
      .analyze()

    const imageViolations = results.violations.filter((v) => v.id === 'image-alt')
    expect(imageViolations).toEqual([])
  })

  test('form inputs have associated labels', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .include('input, select, textarea')
      .analyze()

    const labelViolations = results.violations.filter((v) => v.id === 'label')
    expect(labelViolations).toEqual([])
  })

  test('heading hierarchy is correct', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withRules(['heading-order'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('page has a proper document title', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withRules(['document-title'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('page has a language attribute', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withRules(['html-has-lang'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('links have discernible text', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withRules(['link-name'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('ARIA attributes are used correctly', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .include('[aria-label], [aria-labelledby], [aria-describedby], [role]')
      .analyze()

    const ariaViolations = results.violations.filter((v) =>
      v.id.startsWith('aria-')
    )
    expect(ariaViolations).toEqual([])
  })
})

test.describe('Accessibility - Touch Target Size (Mobile)', () => {
  test('all interactive elements meet minimum touch target size (44x44px)', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const smallTargets = await page.evaluate(() => {
      const interactiveElements = Array.from(
        document.querySelectorAll('button, a, input, select, textarea, [role="button"]')
      )

      return interactiveElements
        .filter((el) => {
          const rect = el.getBoundingClientRect()
          const isVisible = rect.width > 0 && rect.height > 0
          // WCAG 2.1 AA requires 44x44px minimum for touch targets
          const isTooSmall = rect.width < 44 || rect.height < 44
          return isVisible && isTooSmall
        })
        .map((el) => {
          const rect = el.getBoundingClientRect()
          return {
            tag: el.tagName,
            text: el.textContent?.substring(0, 30) || '',
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          }
        })
    })

    if (smallTargets.length > 0) {
      console.log('Small touch targets found:', smallTargets)
    }

    expect(smallTargets).toEqual([])
  })
})

test.describe('Accessibility - Focus Indicators', () => {
  test('interactive elements have visible focus indicators', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Get the first interactive element
    const firstButton = page.locator('button, a').first()
    await firstButton.focus()

    // Check if there's a visible focus indicator
    const hasFocusIndicator = await firstButton.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      const outlineStyle = styles.outlineStyle
      const outlineWidth = parseFloat(styles.outlineWidth || '0')
      const boxShadow = styles.boxShadow

      // Consider a focus indicator present if outline or box shadow is visible
      return (
        (outlineStyle && outlineStyle !== 'none' && outlineWidth > 0) ||
        (boxShadow && boxShadow !== 'none')
      )
    })

    expect(hasFocusIndicator).toBe(true)
  })
})
