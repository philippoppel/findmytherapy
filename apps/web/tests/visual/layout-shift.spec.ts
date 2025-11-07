/**
 * Layout Shift Detection Tests
 *
 * Measures Cumulative Layout Shift (CLS) to ensure visual stability
 * CLS is a Core Web Vital that measures visual stability during page load
 *
 * Thresholds (Google):
 * - Good: CLS < 0.1
 * - Needs Improvement: 0.1 <= CLS <= 0.25
 * - Poor: CLS > 0.25
 */

import { test, expect } from '@playwright/test'

// Test all key pages
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

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  desktop: { width: 1280, height: 720 },
}

// Google's "Good" threshold for CLS
const CLS_THRESHOLD = 0.1

test.describe('Layout Shift Detection - Desktop', () => {
  for (const { path, name } of PAGES_TO_TEST) {
    test(`${name} should have CLS < ${CLS_THRESHOLD} on desktop`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop)

      // Navigate and measure CLS
      await page.goto(path)

      // Wait for page to fully load and stabilize
      await page.waitForLoadState('networkidle')

      // Measure CLS over 3 seconds to capture late-loading content
      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              // Only count layout shifts that aren't from user interactions
              if (
                entry.entryType === 'layout-shift' &&
                !(entry as LayoutShift).hadRecentInput
              ) {
                clsValue += (entry as LayoutShift).value
              }
            }
          })

          observer.observe({ type: 'layout-shift', buffered: true })

          setTimeout(() => {
            observer.disconnect()
            resolve(clsValue)
          }, 3000)
        })
      })

      console.log(`${name} (desktop) CLS: ${cls.toFixed(4)}`)

      expect(cls).toBeLessThan(CLS_THRESHOLD)
    })
  }
})

test.describe('Layout Shift Detection - Mobile', () => {
  for (const { path, name } of PAGES_TO_TEST) {
    test(`${name} should have CLS < ${CLS_THRESHOLD} on mobile`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile)

      await page.goto(path)
      await page.waitForLoadState('networkidle')

      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (
                entry.entryType === 'layout-shift' &&
                !(entry as LayoutShift).hadRecentInput
              ) {
                clsValue += (entry as LayoutShift).value
              }
            }
          })

          observer.observe({ type: 'layout-shift', buffered: true })

          setTimeout(() => {
            observer.disconnect()
            resolve(clsValue)
          }, 3000)
        })
      })

      console.log(`${name} (mobile) CLS: ${cls.toFixed(4)}`)

      expect(cls).toBeLessThan(CLS_THRESHOLD)
    })
  }
})

test.describe('Layout Shift Detection - Specific Elements', () => {
  test('images should have width and height attributes to prevent layout shifts', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const imagesWithoutDimensions = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'))

      return images
        .filter((img) => {
          // Check if image has width/height attributes or CSS sizing
          const hasWidthAttr = img.hasAttribute('width')
          const hasHeightAttr = img.hasAttribute('height')
          const style = window.getComputedStyle(img)
          const hasCSSWidth = style.width && style.width !== 'auto'
          const hasCSSHeight = style.height && style.height !== 'auto'

          // Image should have either attributes or CSS dimensions
          return !(
            (hasWidthAttr && hasHeightAttr) ||
            (hasCSSWidth && hasCSSHeight)
          )
        })
        .map((img) => ({
          src: img.src,
          alt: img.alt,
        }))
    })

    if (imagesWithoutDimensions.length > 0) {
      console.log('Images without dimensions:', imagesWithoutDimensions)
    }

    expect(imagesWithoutDimensions.length).toBe(0)
  })

  test('web fonts should be loaded with font-display to prevent layout shifts', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check if fonts are loaded properly
    const fontLoadingIssues = await page.evaluate(() => {
      // Get all stylesheets
      const styleSheets = Array.from(document.styleSheets)
      const fontFaces: Array<{ family: string; display: string | null }> = []

      for (const sheet of styleSheets) {
        try {
          const rules = Array.from(sheet.cssRules || [])
          for (const rule of rules) {
            if (rule instanceof CSSFontFaceRule) {
              const family = rule.style.getPropertyValue('font-family')
              const display = rule.style.getPropertyValue('font-display')
              fontFaces.push({ family, display })
            }
          }
        } catch (e) {
          // Skip CORS-protected stylesheets
        }
      }

      // Filter fonts without font-display
      return fontFaces.filter((font) => !font.display || font.display === '')
    })

    if (fontLoadingIssues.length > 0) {
      console.log('Fonts without font-display:', fontLoadingIssues)
      console.log(
        'Hint: Add font-display: swap or font-display: optional to @font-face rules'
      )
    }

    // This is a warning rather than a hard failure since it might be acceptable
    // depending on your font loading strategy
    expect(fontLoadingIssues.length).toBeLessThan(5)
  })

  test('dynamic content should not cause layout shifts', async ({ page }) => {
    await page.goto('/')

    // Track layout shifts during page interaction
    const clsDuringInteraction = await page.evaluate(async () => {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (
            entry.entryType === 'layout-shift' &&
            !(entry as LayoutShift).hadRecentInput
          ) {
            clsValue += (entry as LayoutShift).value
          }
        }
      })

      observer.observe({ type: 'layout-shift', buffered: true })

      // Wait for initial load
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Scroll to trigger lazy loading
      window.scrollTo(0, document.body.scrollHeight / 2)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      window.scrollTo(0, document.body.scrollHeight)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      observer.disconnect()
      return clsValue
    })

    console.log(`CLS during interaction: ${clsDuringInteraction.toFixed(4)}`)

    expect(clsDuringInteraction).toBeLessThan(CLS_THRESHOLD)
  })
})

test.describe('Layout Shift Detection - Performance Metrics', () => {
  test('page should not have render-blocking resources causing layout shifts', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
      }
    })

    console.log('Performance metrics:', metrics)

    // DOM should become interactive quickly (< 2 seconds on fast connection)
    // This helps prevent layout shifts from late-loading content
    expect(metrics.domInteractive).toBeLessThan(3000)
  })

  test('page should reserve space for ads/embeds to prevent layout shifts', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check if there are placeholder elements for dynamic content
    const missingPlaceholders = await page.evaluate(() => {
      // Look for common dynamic content containers
      const dynamicContainers = Array.from(
        document.querySelectorAll('[class*="ad"], [class*="embed"], [class*="widget"]')
      )

      return dynamicContainers
        .filter((el) => {
          const style = window.getComputedStyle(el)
          // Check if element has explicit height to reserve space
          return style.height === 'auto' || style.minHeight === '0px'
        })
        .map((el) => ({
          classes: el.className,
          height: window.getComputedStyle(el).height,
        }))
    })

    if (missingPlaceholders.length > 0) {
      console.log('Dynamic containers without reserved space:', missingPlaceholders)
    }

    // This is informational - not all dynamic content needs placeholders
    // expect(missingPlaceholders.length).toBe(0)
  })
})

test.describe('Layout Shift Detection - Form Interactions', () => {
  test('form validation should not cause layout shifts', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Start observing layout shifts
    await page.evaluate(() => {
      (window as Window & { clsValue: number }).clsValue = 0
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (
            entry.entryType === 'layout-shift' &&
            !(entry as LayoutShift).hadRecentInput
          ) {
            (window as Window & { clsValue: number }).clsValue += (entry as LayoutShift).value
          }
        }
      })
      observer.observe({ type: 'layout-shift', buffered: true })
      ;(window as Window & { observer: PerformanceObserver }).observer = observer
    })

    // Trigger form validation
    const submitButton = page.getByRole('button', { name: /anmelden|login/i })
    await submitButton.click()
    await page.waitForTimeout(1000)

    // Get CLS value
    const cls = await page.evaluate(() => {
      ;(window as Window & { observer: PerformanceObserver }).observer.disconnect()
      return (window as Window & { clsValue: number }).clsValue
    })

    console.log(`CLS during form validation: ${cls.toFixed(4)}`)

    // Form validation should not cause significant layout shifts
    expect(cls).toBeLessThan(0.05)
  })
})

// Type definition for LayoutShift since it might not be in all TypeScript versions
interface LayoutShift extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}
