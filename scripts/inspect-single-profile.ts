#!/usr/bin/env tsx

/**
 * Inspect a single psyonline.at profile to see available data
 */

import { chromium } from 'playwright'

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  try {
    // Direct link to Adelheid Maria Moser's profile (had a real website)
    const profileUrl = 'https://www.psyonline.at/go.asp?personen_id=163111&sektion=personen&rkarte=infodetails&berufsgruppe=pth&bereich_id=9001&subbereich_id=0'

    console.log(`Opening profile: ${profileUrl}\n`)
    await page.goto(profileUrl, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(3000)

    // Extract all available data
    const profileData = await page.evaluate(() => {
      const data: any = {
        bodyText: document.body.innerText.slice(0, 2000),
        images: [] as any[],
        links: [] as any[],
        hasAbout: false,
        hasPricing: false
      }

      // Check for images
      const images = Array.from(document.querySelectorAll('img'))
      data.images = images
        .filter(img => img.src && !img.src.includes('logo') && !img.src.includes('icon'))
        .map(img => ({
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height
        }))
        .slice(0, 5)

      // Check for links
      const links = Array.from(document.querySelectorAll('a[href^="http"]'))
      data.links = links.map(a => ({
        text: a.textContent?.trim().slice(0, 50),
        href: a.href
      })).slice(0, 20)

      // Check for about/description
      data.hasAbout = document.body.innerText.toLowerCase().includes('über mich') ||
                      document.body.innerText.toLowerCase().includes('beschreibung') ||
                      document.body.innerText.toLowerCase().includes('ausbildung')

      // Check for pricing
      data.hasPricing = document.body.innerText.includes('€') ||
                        document.body.innerText.toLowerCase().includes('preis') ||
                        document.body.innerText.toLowerCase().includes('honorar')

      // Look for specific sections
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, strong, b'))
      data.headings = headings
        .map(h => h.textContent?.trim())
        .filter(t => t && t.length > 3 && t.length < 100)
        .slice(0, 20)

      return data
    })

    console.log('=== PROFILE DATA ===\n')
    console.log(`Images found: ${profileData.images.length}`)
    profileData.images.forEach((img: any, i: number) => {
      console.log(`  ${i + 1}. ${img.src}`)
      console.log(`     alt="${img.alt}" size=${img.width}x${img.height}`)
    })

    console.log(`\nLinks found: ${profileData.links.length}`)
    profileData.links.forEach((link: any, i: number) => {
      console.log(`  ${i + 1}. "${link.text}" -> ${link.href}`)
    })

    console.log(`\nHas about section: ${profileData.hasAbout}`)
    console.log(`Has pricing info: ${profileData.hasPricing}`)

    console.log(`\nHeadings/Sections found:`)
    profileData.headings.forEach((h: string, i: number) => {
      console.log(`  ${i + 1}. ${h}`)
    })

    console.log(`\n=== BODY TEXT (first 2000 chars) ===\n`)
    console.log(profileData.bodyText)

    // Save screenshot
    await page.screenshot({ path: '/tmp/psyonline-profile-detail.png', fullPage: true })
    console.log(`\n📸 Screenshot: /tmp/psyonline-profile-detail.png`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await browser.close()
  }
}

main().catch(console.error)
