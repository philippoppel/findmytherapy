#!/usr/bin/env tsx

/**
 * Test psyonline.at search by filling form
 */

import { chromium } from 'playwright'

async function main() {
  console.log('🔍 Testing psyonline.at form search...\n')

  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()

  try {
    const testName = 'Müller'
    const testCity = 'Wien'

    console.log(`Testing search for: ${testName} in ${testCity}\n`)

    // Go to detail search page
    await page.goto('https://www.psyonline.at/psychotherapeutinnen-detailsuche', {
      waitUntil: 'networkidle',
      timeout: 30000
    })

    console.log('Loaded detail search page, waiting...')
    await page.waitForTimeout(3000)

    // Take screenshot
    await page.screenshot({ path: '/tmp/psyonline-form-before.png' })
    console.log('Screenshot saved: /tmp/psyonline-form-before.png')

    // Find and fill name field
    console.log('\nLooking for search form...')

    const formFields = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'))
      return inputs.map(input => ({
        type: input.type,
        name: input.name,
        id: input.id,
        placeholder: input.placeholder
      }))
    })

    console.log('Found form fields:')
    formFields.forEach(f => {
      console.log(`  - ${f.type} name="${f.name}" id="${f.id}" placeholder="${f.placeholder}"`)
    })

    // Try to fill name field
    const nameSelectors = [
      'input[name="name"]',
      'input[name="nachname"]',
      'input[placeholder*="Name"]',
      'input[placeholder*="name"]',
      '#name',
      '#nachname'
    ]

    let filled = false
    for (const selector of nameSelectors) {
      try {
        const element = await page.$(selector)
        if (element) {
          await element.fill(testName)
          console.log(`\n✅ Filled name field: ${selector}`)
          filled = true
          break
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!filled) {
      console.log('\n❌ Could not find name input field')
    }

    // Take screenshot before submit
    await page.screenshot({ path: '/tmp/psyonline-form-filled.png' })
    console.log('Screenshot saved: /tmp/psyonline-form-filled.png')

    // Try to find and click submit button
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Suchen")',
      'button:has-text("suchen")'
    ]

    let submitted = false
    for (const selector of submitSelectors) {
      try {
        const button = await page.$(selector)
        if (button) {
          console.log(`\nClicking submit: ${selector}`)
          await button.click()
          submitted = true
          break
        }
      } catch (e) {
        // Continue
      }
    }

    if (submitted) {
      console.log('Waiting for results...')
      await page.waitForTimeout(5000)

      // Take screenshot of results
      await page.screenshot({ path: '/tmp/psyonline-results.png' })
      console.log('Screenshot saved: /tmp/psyonline-results.png')

      // Check for results
      const resultsText = await page.evaluate(() => document.body.innerText)
      console.log(`\nResults page text (first 800 chars):\n${resultsText.slice(0, 800)}\n`)

      const links = await page.evaluate(() => {
        const allLinks = Array.from(document.querySelectorAll('a'))
        return allLinks
          .filter(a => a.href && a.textContent && a.textContent.length > 10 && a.textContent.length < 100)
          .slice(0, 15)
          .map(a => ({
            text: a.textContent?.trim(),
            href: a.href
          }))
      })

      console.log(`Found ${links.length} links (first 15):`)
      links.forEach((link, i) => {
        console.log(`${i + 1}. ${link.text}`)
      })
    }

    console.log('\n\nBrowser will stay open for 30 seconds...')
    await page.waitForTimeout(30000)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await browser.close()
  }
}

main().catch(console.error)
