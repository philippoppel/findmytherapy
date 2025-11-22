#!/usr/bin/env tsx

/**
 * Debug script to analyze psyonline.at HTML structure
 */

import { chromium } from 'playwright'

async function main() {
  console.log('🔍 Analyzing psyonline.at search results...\n')

  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // Test with a common Austrian surname
    const testName = 'Müller'
    const searchUrl = `https://www.psyonline.at/psychotherapeutinnen?name=${encodeURIComponent(testName)}`

    console.log(`Searching for: ${testName}`)
    console.log(`URL: ${searchUrl}\n`)

    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await page.waitForTimeout(3000)

    // Take screenshot
    await page.screenshot({ path: '/tmp/psyonline-debug.png', fullPage: true })
    console.log('Screenshot saved to: /tmp/psyonline-debug.png\n')

    // Analyze page structure
    const analysis = await page.evaluate(() => {
      const results = {
        title: document.title,
        allSelectors: [] as string[],
        possibleResults: [] as any[],
      }

      // Check for common class names
      const classes = Array.from(document.querySelectorAll('[class]'))
        .map(el => el.className)
        .filter(c => c)
        .slice(0, 50)

      results.allSelectors = Array.from(new Set(classes))

      // Look for anything that looks like a result
      const possibleSelectors = [
        'article',
        '.result',
        '.card',
        '.therapist',
        '.person',
        '[itemtype]',
        '.list-item',
        'li',
      ]

      for (const selector of possibleSelectors) {
        const elements = document.querySelectorAll(selector)
        if (elements.length > 0 && elements.length < 100) {
          elements.forEach((el: Element, i: number) => {
            if (i < 3) {
              // Only first 3
              results.possibleResults.push({
                selector: selector,
                html: el.outerHTML.slice(0, 500),
                text: el.textContent?.slice(0, 200),
              })
            }
          })
        }
      }

      return results
    })

    console.log('Page Analysis:')
    console.log('='.repeat(80))
    console.log(`Title: ${analysis.title}`)
    console.log(`\nCommon classes found:`)
    analysis.allSelectors.slice(0, 20).forEach(c => console.log(`  - ${c}`))

    console.log(`\nPossible result elements:`)
    analysis.possibleResults.forEach((r, i) => {
      console.log(`\n${i + 1}. Selector: ${r.selector}`)
      console.log(`   Text: ${r.text}`)
      console.log(`   HTML: ${r.html}`)
    })

    console.log('\n\nBrowser will stay open for 60 seconds for manual inspection...')
    await page.waitForTimeout(60000)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await browser.close()
  }
}

main().catch(console.error)
