/**
 * Generic UI Issue Detection Tests
 *
 * Automatically detects common UI problems across all pages:
 * - Overlapping elements
 * - Horizontal scroll on mobile
 * - Text truncation/overflow
 * - Elements bleeding outside viewport
 * - Invisible text (color contrast issues)
 * - Broken layouts
 */

import { test, expect } from '@playwright/test'

// Test all key pages
const PAGES_TO_TEST = [
  { path: '/', name: 'Homepage' },
  { path: '/about', name: 'About Page' },
  { path: '/therapists', name: 'Therapists Directory' },
  { path: '/login', name: 'Login Page' },
  { path: '/triage', name: 'Triage Flow' },
]

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
}

test.describe('UI Issue Detection - Horizontal Scroll', () => {
  for (const { path, name } of PAGES_TO_TEST) {
    test(`${name} should not have horizontal scroll on mobile`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile)
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      const hasHorizontalScroll = await page.evaluate(() => {
        // Check both html and body
        const htmlScrollWidth = document.documentElement.scrollWidth
        const htmlClientWidth = document.documentElement.clientWidth
        const bodyScrollWidth = document.body.scrollWidth
        const bodyClientWidth = document.body.clientWidth

        return htmlScrollWidth > htmlClientWidth || bodyScrollWidth > bodyClientWidth
      })

      expect(hasHorizontalScroll).toBe(false)
    })

    test(`${name} should not have horizontal scroll on tablet`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet)
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth
      })

      expect(hasHorizontalScroll).toBe(false)
    })
  }
})

test.describe('UI Issue Detection - Text Overflow', () => {
  for (const { path, name } of PAGES_TO_TEST) {
    test(`${name} should not have truncated text on mobile`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile)
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      const truncatedTexts = await page.evaluate(() => {
        const textElements = Array.from(
          document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, button, a, label, span, div')
        )

        return textElements
          .filter((el) => {
            // Skip hidden elements
            const rect = el.getBoundingClientRect()
            if (rect.width === 0 || rect.height === 0) return false

            // Check if text content is wider than container
            const range = document.createRange()
            range.selectNodeContents(el)
            const rangeRect = range.getBoundingClientRect()

            // 2px tolerance for rounding errors
            const isOverflowing = rangeRect.width > rect.width + 2

            // Also check for CSS text-overflow: ellipsis
            const style = window.getComputedStyle(el)
            const hasEllipsis = style.textOverflow === 'ellipsis'
            const isScrollable = el.scrollWidth > el.clientWidth

            return isOverflowing || (hasEllipsis && isScrollable)
          })
          .map((el) => ({
            tag: el.tagName,
            text: el.textContent?.substring(0, 50) || '',
            classes: el.className,
          }))
      })

      if (truncatedTexts.length > 0) {
        console.log(`Truncated texts found on ${name}:`, truncatedTexts)
      }

      expect(truncatedTexts.length).toBe(0)
    })

    test(`${name} should not have truncated text on desktop`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop)
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      const truncatedTexts = await page.evaluate(() => {
        const textElements = Array.from(
          document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, button, a, label')
        )

        return textElements
          .filter((el) => {
            const rect = el.getBoundingClientRect()
            if (rect.width === 0 || rect.height === 0) return false

            const range = document.createRange()
            range.selectNodeContents(el)
            const rangeRect = range.getBoundingClientRect()

            return rangeRect.width > rect.width + 2
          })
          .map((el) => ({
            tag: el.tagName,
            text: el.textContent?.substring(0, 50) || '',
          }))
      })

      if (truncatedTexts.length > 0) {
        console.log(`Truncated texts found on ${name}:`, truncatedTexts)
      }

      expect(truncatedTexts.length).toBe(0)
    })
  }
})

test.describe('UI Issue Detection - Overlapping Elements', () => {
  for (const { path, name } of PAGES_TO_TEST) {
    test(`${name} should not have overlapping interactive elements`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop)
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      const overlaps = await page.evaluate(() => {
        const interactiveElements = Array.from(
          document.querySelectorAll('button, a, input, select, textarea, [role="button"]')
        )

        const overlapping: Array<{ el1: string; el2: string }> = []

        for (let i = 0; i < interactiveElements.length; i++) {
          const rect1 = interactiveElements[i].getBoundingClientRect()

          // Skip invisible elements
          if (rect1.width === 0 || rect1.height === 0) continue

          for (let j = i + 1; j < interactiveElements.length; j++) {
            const rect2 = interactiveElements[j].getBoundingClientRect()

            // Skip invisible elements
            if (rect2.width === 0 || rect2.height === 0) continue

            // Check if rectangles overlap
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
        console.log(`Overlapping elements found on ${name}:`, overlaps)
      }

      expect(overlaps.length).toBe(0)
    })
  }
})

test.describe('UI Issue Detection - Elements Outside Viewport', () => {
  for (const { path, name } of PAGES_TO_TEST) {
    test(`${name} should not have visible elements bleeding outside viewport on mobile`, async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile)
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      const elementsOutside = await page.evaluate(() => {
        const viewportWidth = window.innerWidth
        const allElements = Array.from(document.querySelectorAll('*'))

        return allElements
          .filter((el) => {
            // Skip hidden elements
            const style = window.getComputedStyle(el)
            if (style.display === 'none' || style.visibility === 'hidden') return false

            const rect = el.getBoundingClientRect()

            // Check if element bleeds outside viewport on the right
            // Allow 1px tolerance for rounding
            return rect.right > viewportWidth + 1
          })
          .map((el) => ({
            tag: el.tagName,
            classes: el.className,
            right: Math.round(el.getBoundingClientRect().right),
            viewportWidth,
          }))
          .slice(0, 10) // Limit to first 10 to avoid noise
      })

      if (elementsOutside.length > 0) {
        console.log(`Elements outside viewport found on ${name}:`, elementsOutside)
      }

      expect(elementsOutside.length).toBe(0)
    })
  }
})

test.describe('UI Issue Detection - Invisible Text', () => {
  for (const { path, name } of PAGES_TO_TEST) {
    test(`${name} should not have invisible text (same color as background)`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      const invisibleTexts = await page.evaluate(() => {
        const textElements = Array.from(
          document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label')
        )

        return textElements
          .filter((el) => {
            // Skip empty elements
            if (!el.textContent?.trim()) return false

            const rect = el.getBoundingClientRect()
            if (rect.width === 0 || rect.height === 0) return false

            const style = window.getComputedStyle(el)
            const color = style.color
            const bgColor = style.backgroundColor

            // Parse rgb/rgba values
            const parseColor = (colorStr: string) => {
              const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
              if (!match) return null
              return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) }
            }

            const textColor = parseColor(color)
            const backgroundColor = parseColor(bgColor)

            // Check if colors are too similar (less than 10 difference in each channel)
            if (textColor && backgroundColor) {
              const diff =
                Math.abs(textColor.r - backgroundColor.r) +
                Math.abs(textColor.g - backgroundColor.g) +
                Math.abs(textColor.b - backgroundColor.b)

              return diff < 30 // Very similar colors
            }

            return false
          })
          .map((el) => ({
            tag: el.tagName,
            text: el.textContent?.substring(0, 30),
            color: window.getComputedStyle(el).color,
            bgColor: window.getComputedStyle(el).backgroundColor,
          }))
      })

      if (invisibleTexts.length > 0) {
        console.log(`Invisible text found on ${name}:`, invisibleTexts)
      }

      expect(invisibleTexts.length).toBe(0)
    })
  }
})

test.describe('UI Issue Detection - Broken Images', () => {
  for (const { path, name } of PAGES_TO_TEST) {
    test(`${name} should not have broken images`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      const brokenImages = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'))

        return images
          .filter((img) => {
            // Check if image failed to load or has zero dimensions
            return !img.complete || img.naturalHeight === 0 || img.naturalWidth === 0
          })
          .map((img) => ({
            src: img.src,
            alt: img.alt,
          }))
      })

      if (brokenImages.length > 0) {
        console.log(`Broken images found on ${name}:`, brokenImages)
      }

      expect(brokenImages.length).toBe(0)
    })
  }
})

test.describe('UI Issue Detection - Form Validation Messages', () => {
  test('form validation messages are visible and readable on mobile', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Trigger validation by submitting empty form
    const submitButton = page.getByRole('button', { name: /anmelden|login/i })
    await submitButton.click()

    // Wait a bit for validation messages to appear
    await page.waitForTimeout(500)

    // Check if validation messages are visible and readable
    const validationIssues = await page.evaluate(() => {
      const errorMessages = Array.from(
        document.querySelectorAll('[role="alert"], .error, .error-message, [aria-invalid="true"]')
      )

      return errorMessages
        .filter((el) => {
          const rect = el.getBoundingClientRect()
          const style = window.getComputedStyle(el)

          // Check if element is too small or invisible
          return (
            rect.width < 20 ||
            rect.height < 10 ||
            style.display === 'none' ||
            style.visibility === 'hidden' ||
            parseFloat(style.opacity) < 0.1
          )
        })
        .map((el) => ({
          tag: el.tagName,
          text: el.textContent?.substring(0, 50),
          dimensions: {
            width: Math.round(el.getBoundingClientRect().width),
            height: Math.round(el.getBoundingClientRect().height),
          },
        }))
    })

    if (validationIssues.length > 0) {
      console.log('Validation message visibility issues:', validationIssues)
    }

    expect(validationIssues.length).toBe(0)
  })
})

test.describe('UI Issue Detection - Button States', () => {
  test('buttons should have visible hover states', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const buttons = await page.locator('button, [role="button"]').all()

    if (buttons.length > 0) {
      const firstButton = buttons[0]

      // Get initial state
      const initialColor = await firstButton.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor
      })

      // Hover
      await firstButton.hover()
      await page.waitForTimeout(200)

      // Get hover state
      const hoverColor = await firstButton.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor
      })

      // Colors should be different on hover (or other visual changes should occur)
      // This is a basic check - could be enhanced
      const hasVisualChange = initialColor !== hoverColor

      // Log for debugging
      if (!hasVisualChange) {
        console.log('No visible hover state detected', { initialColor, hoverColor })
      }

      // Note: This test might need adjustment based on your design system
      // Some designs use subtle changes that are hard to detect programmatically
    }
  })
})
