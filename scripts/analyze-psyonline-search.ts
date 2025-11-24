#!/usr/bin/env tsx

/**
 * Analyze how psyonline.at search works
 */

import { chromium } from 'playwright'

async function main() {
  console.log('🔍 Analyzing psyonline.at search mechanism...\n')

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  try {
    // Try 1: Schnellsuche (quick search)
    console.log('=== Trying Schnellsuche ===')
    await page.goto('https://www.psyonline.at/psychotherapeutinnen-schnellsuche', {
      waitUntil: 'networkidle',
      timeout: 30000
    })
    await page.waitForTimeout(3000)

    // Find all form fields
    const quickSearchFields = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, select, textarea'))
      const buttons = Array.from(document.querySelectorAll('button'))
      return {
        inputs: inputs.map(input => ({
          tag: input.tagName.toLowerCase(),
          type: (input as any).type || '',
          name: (input as any).name || '',
          id: input.id || '',
          placeholder: (input as any).placeholder || '',
          value: (input as any).value || ''
        })),
        buttons: buttons.map(btn => ({
          text: btn.textContent?.trim() || '',
          type: btn.type,
          class: btn.className
        }))
      }
    })

    console.log('\nQuick Search Form Fields:')
    quickSearchFields.inputs.forEach(f => {
      console.log(`  [${f.tag}] type="${f.type}" name="${f.name}" id="${f.id}" placeholder="${f.placeholder}"`)
    })
    console.log('\nButtons:')
    quickSearchFields.buttons.forEach(b => {
      console.log(`  "${b.text}" type="${b.type}" class="${b.class}"`)
    })

    // Try filling quick search
    console.log('\n=== Testing Quick Search with "Müller" ===')

    // Try different selectors for name field
    const nameField = await page.$('input[name="name"]') ||
                      await page.$('input[placeholder*="Name"]') ||
                      await page.$('#name')

    if (nameField) {
      await nameField.fill('Müller')
      console.log('✅ Filled name field')

      // Find and click submit
      const submitBtn = await page.$('button[type="submit"]') ||
                        await page.$('button:has-text("Suchen")') ||
                        await page.$('input[type="submit"]')

      if (submitBtn) {
        console.log('✅ Found submit button, clicking...')
        await submitBtn.click()

        // Wait for results
        await page.waitForTimeout(5000)

        // Check URL
        const currentUrl = page.url()
        console.log(`Current URL: ${currentUrl}`)

        // Check for results
        const pageContent = await page.evaluate(() => {
          const text = document.body.innerText

          // Look for result indicators
          const hasResults = text.includes('Ergebnis') ||
                            text.includes('gefunden') ||
                            text.includes('Therapeut')

          // Try to find profile links
          const profileLinks = Array.from(document.querySelectorAll('a'))
            .filter(a => {
              const href = a.href || ''
              const text = a.textContent || ''
              return href.includes('person') ||
                     href.includes('therapeut') ||
                     (text.length > 10 && text.length < 100 && /[A-Z][a-z]+\s+[A-Z][a-z]+/.test(text))
            })
            .slice(0, 10)
            .map(a => ({
              text: a.textContent?.trim(),
              href: a.href
            }))

          return {
            bodyText: text.slice(0, 1000),
            hasResults,
            profileLinks,
            title: document.title
          }
        })

        console.log(`\nPage title: ${pageContent.title}`)
        console.log(`Has results indicators: ${pageContent.hasResults}`)
        console.log(`\nFound ${pageContent.profileLinks.length} profile-like links:`)
        pageContent.profileLinks.forEach((link, i) => {
          console.log(`  ${i + 1}. ${link.text}`)
          console.log(`     ${link.href}`)
        })

        console.log(`\nPage content (first 1000 chars):`)
        console.log(pageContent.bodyText)

        // Take screenshot
        await page.screenshot({ path: '/tmp/psyonline-quick-results.png', fullPage: true })
        console.log('\n📸 Screenshot saved: /tmp/psyonline-quick-results.png')
      } else {
        console.log('❌ Could not find submit button')
      }
    } else {
      console.log('❌ Could not find name input field')
    }

    // Try 2: Direct URL with parameters (to confirm it doesn't work)
    console.log('\n\n=== Testing Direct URL Parameters ===')
    await page.goto('https://www.psyonline.at/psychotherapeutinnen?name=Müller&ort=Wien', {
      waitUntil: 'networkidle',
      timeout: 30000
    })
    await page.waitForTimeout(3000)

    const directUrlContent = await page.evaluate(() => document.body.innerText.slice(0, 500))
    console.log(`Direct URL content:\n${directUrlContent}`)

    const hasResultsViaUrl = directUrlContent.includes('Müller') || directUrlContent.includes('gefunden')
    console.log(`Has results via direct URL: ${hasResultsViaUrl}`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await browser.close()
  }
}

main().catch(console.error)
