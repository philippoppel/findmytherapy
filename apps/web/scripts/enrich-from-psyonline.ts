#!/usr/bin/env tsx

/**
 * Enrich therapist profiles from psyonline.at
 *
 * This script:
 * 1. Searches for each therapist on psyonline.at by name
 * 2. Matches profiles using fuzzy name matching
 * 3. Extracts additional data (photo, description, prices, website)
 * 4. Updates database with enriched data
 *
 * IMPORTANT: Respects robots.txt crawl-delay of 10 seconds
 *
 * Usage:
 *   tsx scripts/enrich-from-psyonline.ts
 *
 * Options:
 *   --dry-run: Show what would be done without saving
 *   --limit=N: Only process N therapists (for testing)
 *   --force: Re-process therapists that already have psyonline data
 */

import { PrismaClient } from '@prisma/client'
import { chromium } from 'playwright'

const prisma = new PrismaClient()

// Parse CLI arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const force = args.includes('--force')
const limitArg = args.find(arg => arg.startsWith('--limit='))
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined

// IMPORTANT: Respect robots.txt crawl-delay of 10 seconds
const CRAWL_DELAY_MS = 10000

interface EnrichmentResult {
  therapistId: string
  therapistName: string
  websiteUrl?: string
  profileImageUrl?: string
  about?: string
  priceMin?: number
  priceMax?: number
  socialLinkedin?: string
  socialInstagram?: string
  socialFacebook?: string
  psyonlineUrl?: string
  matchConfidence: 'high' | 'medium' | 'low' | 'none'
  error?: string
}

interface EnrichmentStats {
  total: number
  processed: number
  enriched: number
  failed: number
  skipped: number
  highConfidence: number
  mediumConfidence: number
  lowConfidence: number
  timeElapsed: number
}

/**
 * Main function
 */
async function main() {
  console.log('🌐 Enrichment von psyonline.at\n')
  console.log('='.repeat(80))
  console.log(`Mode: ${isDryRun ? '🔸 DRY RUN' : '🔴 LIVE'}`)
  console.log(`Force re-enrich: ${force ? 'YES' : 'NO'}`)
  console.log(`Crawl-Delay: ${CRAWL_DELAY_MS / 1000}s (respektiert robots.txt)`)
  if (limit) {
    console.log(`Limit: ${limit} profiles`)
  }
  console.log('='.repeat(80) + '\n')

  // Fetch profiles to enrich
  const whereClause = force
    ? {
        isPublic: true,
        status: 'VERIFIED' as const,
        displayName: { not: null }
      }
    : {
        isPublic: true,
        status: 'VERIFIED' as const,
        displayName: { not: null },
        // Only profiles without website or about text
        OR: [
          { websiteUrl: null },
          { about: null },
          { profileImageUrl: null },
        ],
      }

  const profiles = await prisma.therapistProfile.findMany({
    where: whereClause,
    select: {
      id: true,
      displayName: true,
      city: true,
      websiteUrl: true,
      profileImageUrl: true,
      about: true,
      priceMin: true,
      priceMax: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    take: limit,
    orderBy: { displayName: 'asc' },
  })

  if (profiles.length === 0) {
    console.log('✅ Alle Profile sind bereits angereichert!')
    return
  }

  console.log(`Gefunden: ${profiles.length} Profile zum Anreichern`)

  const estimatedTime = (profiles.length * CRAWL_DELAY_MS) / 1000 / 60
  console.log(`Geschätzte Zeit: ${Math.round(estimatedTime)} Minuten\n`)

  const stats: EnrichmentStats = {
    total: profiles.length,
    processed: 0,
    enriched: 0,
    failed: 0,
    skipped: 0,
    highConfidence: 0,
    mediumConfidence: 0,
    lowConfidence: 0,
    timeElapsed: 0,
  }

  const startTime = Date.now()

  // Start browser
  console.log('🚀 Starte Browser...\n')
  const browser = await chromium.launch({ headless: true })

  try {
    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i]
      const progress = `[${i + 1}/${profiles.length}]`

      console.log(
        `${progress} 🔍 Suche: ${profile.displayName}${profile.city ? ` (${profile.city})` : ''}`,
      )

      try {
        const result = await enrichFromPsyonline(browser, profile)

        if (result.error) {
          console.log(`         ❌ FEHLER: ${result.error}`)
          stats.failed++
          continue
        }

        if (result.matchConfidence === 'none') {
          console.log(`         ⏭️  Kein Match auf psyonline.at gefunden`)
          stats.skipped++
          continue
        }

        // Log found data
        console.log(`         📊 Match: ${result.matchConfidence} confidence`)
        if (result.psyonlineUrl) {
          console.log(`         🔗 URL: ${result.psyonlineUrl}`)
        }
        if (result.websiteUrl) {
          console.log(`         🌐 Website: ${result.websiteUrl}`)
        }
        if (result.profileImageUrl) {
          console.log(`         📷 Foto: ${result.profileImageUrl}`)
        }
        if (result.about) {
          console.log(`         📝 Beschreibung: ${result.about.slice(0, 60)}...`)
        }
        if (result.priceMin || result.priceMax) {
          console.log(`         💰 Preis: €${result.priceMin || '?'}-${result.priceMax || '?'}`)
        }

        // Track confidence
        if (result.matchConfidence === 'high') stats.highConfidence++
        if (result.matchConfidence === 'medium') stats.mediumConfidence++
        if (result.matchConfidence === 'low') stats.lowConfidence++

        // Update database (unless dry run or low confidence)
        if (!isDryRun && result.matchConfidence !== 'low') {
          const updateData: any = {}

          if (result.websiteUrl) updateData.websiteUrl = result.websiteUrl
          if (result.profileImageUrl) updateData.profileImageUrl = result.profileImageUrl
          if (result.about) updateData.about = result.about
          if (result.priceMin) updateData.priceMin = result.priceMin
          if (result.priceMax) updateData.priceMax = result.priceMax
          if (result.socialLinkedin) updateData.socialLinkedin = result.socialLinkedin
          if (result.socialInstagram) updateData.socialInstagram = result.socialInstagram
          if (result.socialFacebook) updateData.socialFacebook = result.socialFacebook

          if (Object.keys(updateData).length > 0) {
            await prisma.therapistProfile.update({
              where: { id: profile.id },
              data: updateData,
            })
            console.log(`         💾 In Datenbank gespeichert`)
            stats.enriched++
          }
        } else if (isDryRun) {
          console.log(`         🔸 DRY RUN: Würde in DB speichern`)
          stats.enriched++
        } else {
          console.log(`         ⚠️  Low confidence - übersprungen (manuell prüfen)`)
        }

        stats.processed++
      } catch (error) {
        console.error(
          `         ❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`,
        )
        stats.failed++
      }

      // Respect crawl-delay (except for last item)
      if (i < profiles.length - 1) {
        const remainingTime = ((profiles.length - i - 1) * CRAWL_DELAY_MS) / 1000 / 60
        console.log(
          `         ⏱️  Warte ${CRAWL_DELAY_MS / 1000}s (robots.txt)... [Noch ${Math.round(remainingTime)}min]\n`,
        )
        await new Promise(resolve => setTimeout(resolve, CRAWL_DELAY_MS))
      }
    }
  } finally {
    await browser.close()
  }

  stats.timeElapsed = (Date.now() - startTime) / 1000

  // Print summary
  printSummary(stats)

  if (isDryRun) {
    console.log('\n⚠️  Dies war ein DRY RUN. Keine Änderungen wurden gespeichert.')
    console.log('Führe ohne --dry-run aus um Änderungen zu speichern.')
  }
}

/**
 * Search for therapist on psyonline.at and extract data
 */
async function enrichFromPsyonline(
  browser: any,
  profile: {
    id: string
    displayName: string | null
    city: string | null
    user: {
      firstName: string | null
      lastName: string | null
    }
  },
): Promise<EnrichmentResult> {
  const result: EnrichmentResult = {
    therapistId: profile.id,
    therapistName: profile.displayName || 'Unknown',
    matchConfidence: 'none',
  }

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })

  let page
  try {
    page = await context.newPage()

    // Extract first and last name for search
    const firstName = profile.user.firstName || profile.displayName?.split(' ')[0] || ''
    const lastName = profile.user.lastName || profile.displayName?.split(' ').pop() || ''

    // Navigate to psyonline search
    const searchUrl = `https://www.psyonline.at/psychotherapeutinnen?name=${encodeURIComponent(lastName)}`
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await page.waitForTimeout(2000)

    // Find search results - More flexible approach
    const searchResults = await page.evaluate(() => {
      const results: Array<{
        name: string
        url: string
        city: string
        snippet: string
      }> = []

      // Strategy 1: Look for all links with names in them
      const allLinks = Array.from(document.querySelectorAll('a[href*="therapeut"], a[href*="person"]'))

      allLinks.forEach((link: Element) => {
        const href = link.getAttribute('href') || ''
        const text = link.textContent?.trim() || ''

        // Skip navigation links
        if (text.length < 5 || text.length > 100) return
        if (href.includes('?') && !href.includes('/')) return // Query params only

        // Look for name patterns (capitalized words)
        const hasName = /[A-ZÄÖÜ][a-zäöüß]+\s+[A-ZÄÖÜ][a-zäöüß]+/.test(text)

        if (hasName) {
          // Try to find city in parent element
          const parent = link.parentElement
          const parentText = parent?.textContent || ''
          const cityMatch = parentText.match(/\d{4}\s+([A-ZÄÖÜ][a-zäöüß]+)/)

          results.push({
            name: text,
            url: href,
            city: cityMatch ? cityMatch[1] : '',
            snippet: parentText.slice(0, 200),
          })
        }
      })

      // Strategy 2: If no results, try looking for ANY element with person-like text
      if (results.length === 0) {
        const allElements = Array.from(document.querySelectorAll('h2, h3, h4, .name, [class*="person"], [class*="therapist"]'))

        allElements.forEach((el: Element) => {
          const text = el.textContent?.trim() || ''
          const hasName = /[A-ZÄÖÜ][a-zäöüß]+\s+[A-ZÄÖÜ][a-zäöüß]+/.test(text)

          if (hasName && text.length < 100) {
            // Look for link in same element or parent
            const link = el.querySelector('a') || el.closest('a') || el.parentElement?.querySelector('a')

            if (link) {
              results.push({
                name: text,
                url: link.getAttribute('href') || '',
                city: '',
                snippet: el.parentElement?.textContent?.slice(0, 200) || '',
              })
            }
          }
        })
      }

      return results
    })

    // Find best match
    const bestMatch = findBestMatch(searchResults, {
      firstName,
      lastName,
      city: profile.city || '',
    })

    if (!bestMatch) {
      result.matchConfidence = 'none'
      return result
    }

    result.matchConfidence = bestMatch.confidence
    result.psyonlineUrl = bestMatch.url

    // If confidence is too low, don't fetch profile details
    if (bestMatch.confidence === 'low') {
      return result
    }

    // Navigate to profile page
    const profileUrl = bestMatch.url.startsWith('http')
      ? bestMatch.url
      : `https://www.psyonline.at${bestMatch.url}`

    await page.goto(profileUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await page.waitForTimeout(1500)

    // Extract profile data
    const profileData = await page.evaluate(() => {
      const data: any = {}

      // Photo
      const photoEl = document.querySelector('img.profile-photo, img.therapist-photo, [itemprop="image"]')
      if (photoEl) {
        data.profileImageUrl = photoEl.getAttribute('src')
      }

      // About/Description
      const aboutSelectors = [
        '.about, .description, .bio',
        '[itemprop="description"]',
        'section.about p',
        '.profile-text',
      ]
      for (const selector of aboutSelectors) {
        const aboutEl = document.querySelector(selector)
        if (aboutEl?.textContent) {
          data.about = aboutEl.textContent.trim()
          break
        }
      }

      // Website
      const websiteEl = document.querySelector('a[href*="www"], a.website, [itemprop="url"]')
      if (websiteEl) {
        const href = websiteEl.getAttribute('href')
        if (href && !href.includes('psyonline.at')) {
          data.websiteUrl = href
        }
      }

      // Prices
      const priceText = document.body.innerText
      const priceMatch = priceText.match(/(\d+)\s*[-–]\s*(\d+)\s*€|€\s*(\d+)\s*[-–]\s*(\d+)/)
      if (priceMatch) {
        data.priceMin = parseInt(priceMatch[1] || priceMatch[3], 10) * 100 // Convert to cents
        data.priceMax = parseInt(priceMatch[2] || priceMatch[4], 10) * 100
      }

      // Social media (look for links)
      const links = Array.from(document.querySelectorAll('a'))
      links.forEach((link: any) => {
        const href = link.getAttribute('href') || ''
        if (href.includes('linkedin.com')) data.socialLinkedin = href
        if (href.includes('instagram.com')) data.socialInstagram = href
        if (href.includes('facebook.com')) data.socialFacebook = href
      })

      return data
    })

    // Merge extracted data
    Object.assign(result, profileData)

    // Make photo URL absolute
    if (result.profileImageUrl && !result.profileImageUrl.startsWith('http')) {
      result.profileImageUrl = `https://www.psyonline.at${result.profileImageUrl}`
    }
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error'
  } finally {
    if (page) {
      await page.close()
    }
    await context.close()
  }

  return result
}

/**
 * Find best matching profile from search results
 */
function findBestMatch(
  results: Array<{ name: string; url: string; city: string; snippet: string }>,
  target: { firstName: string; lastName: string; city: string },
): { url: string; confidence: 'high' | 'medium' | 'low' } | null {
  if (results.length === 0) return null

  const scored = results.map(result => {
    let score = 0
    const nameLower = result.name.toLowerCase()
    const firstNameLower = target.firstName.toLowerCase()
    const lastNameLower = target.lastName.toLowerCase()
    const cityLower = target.city.toLowerCase()
    const resultCityLower = result.city.toLowerCase()

    // Last name match (most important)
    if (nameLower.includes(lastNameLower)) {
      score += 50
    }

    // First name match
    if (nameLower.includes(firstNameLower)) {
      score += 30
    }

    // City match
    if (cityLower && resultCityLower.includes(cityLower)) {
      score += 20
    }

    // Exact full name match
    const fullName = `${target.firstName} ${target.lastName}`.toLowerCase()
    if (nameLower.includes(fullName)) {
      score += 30
    }

    return { ...result, score }
  })

  // Sort by score
  scored.sort((a, b) => b.score - a.score)

  const best = scored[0]

  // Determine confidence
  if (best.score >= 80) {
    return { url: best.url, confidence: 'high' }
  } else if (best.score >= 50) {
    return { url: best.url, confidence: 'medium' }
  } else if (best.score >= 30) {
    return { url: best.url, confidence: 'low' }
  } else {
    return null
  }
}

/**
 * Print summary statistics
 */
function printSummary(stats: EnrichmentStats) {
  console.log('\n' + '='.repeat(80))
  console.log('📊 ZUSAMMENFASSUNG')
  console.log('='.repeat(80))
  console.log(`Total verarbeitet: ${stats.processed}/${stats.total}`)
  console.log(
    `✅ Erfolgreich angereichert: ${stats.enriched} (${((stats.enriched / stats.total) * 100).toFixed(1)}%)`,
  )
  console.log(`   - High confidence: ${stats.highConfidence}`)
  console.log(`   - Medium confidence: ${stats.mediumConfidence}`)
  console.log(`   - Low confidence: ${stats.lowConfidence}`)
  console.log(
    `❌ Fehlgeschlagen: ${stats.failed} (${((stats.failed / stats.total) * 100).toFixed(1)}%)`,
  )
  console.log(`⏭️  Übersprungen (kein Match): ${stats.skipped}`)
  console.log(
    `⏱️  Zeit: ${Math.round(stats.timeElapsed / 60)} Minuten (${Math.round(stats.timeElapsed / stats.processed)}s pro Therapeut)`,
  )
  console.log('='.repeat(80))
}

main()
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
