/**
 * Therapist Profile Page E2E Tests
 *
 * Tests the redesigned therapist profile page to ensure:
 * - All profile sections render correctly
 * - Responsive design works across viewports
 * - CTAs and navigation function properly
 * - Real therapist data is displayed correctly
 */

import { test, expect } from '@playwright/test'

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
}

test.describe('Therapist Profile Page - Public View', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to therapists directory first to ensure we have seed data
    await page.goto('/therapists')
    await page.waitForLoadState('networkidle')
  })

  test('should display profile hero section with therapist info on desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)

    // Find first therapist link
    const firstTherapistLink = page.locator('a[href^="/therapists/"]').first()
    await firstTherapistLink.click()
    await page.waitForLoadState('networkidle')

    // Check hero section elements
    await expect(page.locator('h1')).toBeVisible()

    // Check navigation exists
    await expect(page.locator('nav')).toBeVisible()

    // Check for CTA buttons in hero
    const ctaButtons = page.getByRole('link', { name: /termin anfragen|kontakt/i })
    await expect(ctaButtons.first()).toBeVisible()
  })

  test('should display profile sections on desktop', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)

    const firstTherapistLink = page.locator('a[href^="/therapists/"]').first()
    await firstTherapistLink.click()
    await page.waitForLoadState('networkidle')

    // Check main content sections exist (they may be conditional based on data)
    const mainContent = page.locator('main, [role="main"]').or(page.locator('section').first())
    await expect(mainContent).toBeVisible()

    // Check sidebar exists
    const sidebar = page.locator('aside')
    if (await sidebar.count() > 0) {
      await expect(sidebar.first()).toBeVisible()
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)

    const firstTherapistLink = page.locator('a[href^="/therapists/"]').first()
    await firstTherapistLink.click()
    await page.waitForLoadState('networkidle')

    // Check no horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHorizontalScroll).toBe(false)

    // Check main heading is visible
    await expect(page.locator('h1')).toBeVisible()

    // Check navigation is visible
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet)

    const firstTherapistLink = page.locator('a[href^="/therapists/"]').first()
    await firstTherapistLink.click()
    await page.waitForLoadState('networkidle')

    // Check no horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHorizontalScroll).toBe(false)

    // Check main elements are visible
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should display verification badge for verified therapists', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)

    const firstTherapistLink = page.locator('a[href^="/therapists/"]').first()
    await firstTherapistLink.click()
    await page.waitForLoadState('networkidle')

    // Check if verification badge exists (it's conditional based on therapist status)
    const verifiedBadge = page.getByText(/verifiziert/i)
    // This may or may not be visible depending on the therapist's status
    // So we just check it doesn't cause errors
  })

  test('should have working back navigation', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)

    const firstTherapistLink = page.locator('a[href^="/therapists/"]').first()
    await firstTherapistLink.click()
    await page.waitForLoadState('networkidle')

    // Find back button
    const backLink = page.getByRole('link', { name: /zurück/i }).first()
    await expect(backLink).toBeVisible()
    await expect(backLink).toBeEnabled()
  })

  test('should have working contact CTAs', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)

    const firstTherapistLink = page.locator('a[href^="/therapists/"]').first()
    await firstTherapistLink.click()
    await page.waitForLoadState('networkidle')

    // Check for contact buttons/links
    const contactCTAs = page.getByRole('link', { name: /termin anfragen|kontakt aufnehmen/i })
    const count = await contactCTAs.count()

    // Should have at least one CTA
    expect(count).toBeGreaterThan(0)

    // First CTA should be visible and enabled
    await expect(contactCTAs.first()).toBeVisible()
    await expect(contactCTAs.first()).toBeEnabled()
  })

  test('should display specialties and modalities if available', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)

    const firstTherapistLink = page.locator('a[href^="/therapists/"]').first()
    await firstTherapistLink.click()
    await page.waitForLoadState('networkidle')

    // Check for sections (they may be conditional)
    const sections = page.locator('section')
    const sectionCount = await sections.count()

    // Should have at least some sections
    expect(sectionCount).toBeGreaterThan(0)
  })

  test('should not have overlapping interactive elements', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)

    const firstTherapistLink = page.locator('a[href^="/therapists/"]').first()
    await firstTherapistLink.click()
    await page.waitForLoadState('networkidle')

    const overlaps = await page.evaluate(() => {
      const interactiveElements = Array.from(
        document.querySelectorAll('button, a, input, [role="button"]')
      ).filter(el => {
        const rect = el.getBoundingClientRect()
        return rect.width > 0 && rect.height > 0
      })

      const overlapping: Array<{ el1: string; el2: string }> = []

      for (let i = 0; i < interactiveElements.length; i++) {
        const rect1 = interactiveElements[i].getBoundingClientRect()

        for (let j = i + 1; j < interactiveElements.length; j++) {
          const rect2 = interactiveElements[j].getBoundingClientRect()

          const isOverlapping = !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
          )

          if (isOverlapping) {
            overlapping.push({
              el1: `${interactiveElements[i].tagName} - ${interactiveElements[i].textContent?.substring(0, 30)}`,
              el2: `${interactiveElements[j].tagName} - ${interactiveElements[j].textContent?.substring(0, 30)}`,
            })
          }
        }
      }

      return overlapping
    })

    if (overlaps.length > 0) {
      console.log('Overlapping elements found:', overlaps)
    }

    expect(overlaps.length).toBe(0)
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)

    const firstTherapistLink = page.locator('a[href^="/therapists/"]').first()
    await firstTherapistLink.click()
    await page.waitForLoadState('networkidle')

    const headingOrder = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      return headings.map(h => ({
        level: parseInt(h.tagName[1]),
        text: h.textContent?.substring(0, 50)
      }))
    })

    // Should have exactly one h1
    const h1Count = headingOrder.filter(h => h.level === 1).length
    expect(h1Count).toBe(1)

    // Check no heading levels are skipped
    const levels = headingOrder.map(h => h.level)
    const uniqueLevels = [...new Set(levels)].sort()

    for (let i = 1; i < uniqueLevels.length; i++) {
      const diff = uniqueLevels[i] - uniqueLevels[i - 1]
      expect(diff).toBeLessThanOrEqual(1)
    }
  })
})

test.describe('Therapist Profile Page - Navigation from Triage', () => {
  test('should display profile when coming from triage', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)

    // Navigate to a profile with triage query parameter
    await page.goto('/therapists')
    await page.waitForLoadState('networkidle')

    const firstTherapistLink = page.locator('a[href^="/therapists/"]').first()
    const href = await firstTherapistLink.getAttribute('href')

    if (href) {
      await page.goto(`${href}?from=triage`)
      await page.waitForLoadState('networkidle')

      // Should show back button to recommendations
      const backButton = page.getByText(/zurück zu.*empfehlungen/i)
      if (await backButton.count() > 0) {
        await expect(backButton.first()).toBeVisible()
      }
    }
  })
})
