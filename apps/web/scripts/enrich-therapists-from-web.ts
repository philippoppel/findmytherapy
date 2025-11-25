#!/usr/bin/env tsx

/**
 * Web-Enrichment Script für Therapeuten-Profile
 *
 * Dieses Script reichert Therapeuten-Daten automatisch an durch:
 * - Google-Suche nach dem Therapeuten
 * - Extraktion von Website-URL
 * - Extraktion von Social Media Links (LinkedIn, Instagram, Facebook)
 * - Optional: Profilbild-URL
 *
 * Usage:
 *   tsx scripts/enrich-therapists-from-web.ts
 *
 * Options:
 *   --dry-run: Zeigt was gemacht würde ohne zu speichern
 *   --limit=N: Nur N Therapeuten verarbeiten (für Tests)
 *   --force: Auch Therapeuten mit bereits vorhandenen Daten neu verarbeiten
 */

import { PrismaClient } from '@prisma/client';
import { chromium } from 'playwright';

const prisma = new PrismaClient();

// Parse CLI arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const force = args.includes('--force');
const debug = args.includes('--debug');
const limitArg = args.find((arg) => arg.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;

interface EnrichmentResult {
  therapistId: string;
  therapistName: string;
  websiteUrl?: string;
  socialLinkedin?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  confidence: 'high' | 'medium' | 'low';
  source: string;
  error?: string;
}

interface EnrichmentStats {
  total: number;
  processed: number;
  enriched: number;
  failed: number;
  skipped: number;
  websiteFound: number;
  linkedinFound: number;
  instagramFound: number;
  facebookFound: number;
}

/**
 * Hauptfunktion
 */
async function main() {
  console.log('🌐 Web-Enrichment für Therapeuten-Profile\n');
  console.log('='.repeat(80));
  console.log(`Mode: ${isDryRun ? '🔸 DRY RUN' : '🔴 LIVE'}`);
  console.log(`Force re-enrich: ${force ? 'YES' : 'NO'}`);
  if (limit) {
    console.log(`Limit: ${limit} profiles`);
  }
  console.log('='.repeat(80) + '\n');

  // Fetch profiles to enrich
  const whereClause = force
    ? { isPublic: true, status: 'VERIFIED' as const }
    : {
        isPublic: true,
        status: 'VERIFIED' as const,
        AND: [
          { websiteUrl: null },
          { socialLinkedin: null },
          { socialInstagram: null },
          { socialFacebook: null },
        ],
      };

  const profiles = await prisma.therapistProfile.findMany({
    where: whereClause,
    select: {
      id: true,
      displayName: true,
      city: true,
      websiteUrl: true,
      socialLinkedin: true,
      socialInstagram: true,
      socialFacebook: true,
    },
    take: limit,
    orderBy: { displayName: 'asc' },
  });

  if (profiles.length === 0) {
    console.log('✅ Alle Profile sind bereits angereichert!');
    return;
  }

  console.log(`Gefunden: ${profiles.length} Profile zum Anreichern\n`);

  const stats: EnrichmentStats = {
    total: profiles.length,
    processed: 0,
    enriched: 0,
    failed: 0,
    skipped: 0,
    websiteFound: 0,
    linkedinFound: 0,
    instagramFound: 0,
    facebookFound: 0,
  };

  // Start browser
  console.log('🚀 Starte Browser...\n');
  const browser = await chromium.launch({ headless: true });

  try {
    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i];
      const progress = `[${i + 1}/${profiles.length}]`;

      if (!profile.displayName) {
        console.log(`${progress} ⏭️  SKIPPED: Kein Name für ${profile.id}`);
        stats.skipped++;
        continue;
      }

      console.log(
        `${progress} 🔍 Verarbeite: ${profile.displayName}${profile.city ? ` (${profile.city})` : ''}`,
      );

      try {
        const result = await enrichTherapistFromWeb(browser, profile);

        if (result.error) {
          console.log(`         ❌ FEHLER: ${result.error}`);
          stats.failed++;
          continue;
        }

        const hasNewData =
          result.websiteUrl ||
          result.socialLinkedin ||
          result.socialInstagram ||
          result.socialFacebook;

        if (!hasNewData) {
          console.log(`         ⏭️  Keine neuen Daten gefunden`);
          stats.skipped++;
          continue;
        }

        // Log found data
        if (result.websiteUrl) {
          console.log(`         🌐 Website: ${result.websiteUrl}`);
          stats.websiteFound++;
        }
        if (result.socialLinkedin) {
          console.log(`         💼 LinkedIn: ${result.socialLinkedin}`);
          stats.linkedinFound++;
        }
        if (result.socialInstagram) {
          console.log(`         📷 Instagram: ${result.socialInstagram}`);
          stats.instagramFound++;
        }
        if (result.socialFacebook) {
          console.log(`         👥 Facebook: ${result.socialFacebook}`);
          stats.facebookFound++;
        }
        console.log(`         📊 Confidence: ${result.confidence}`);

        // Update database (unless dry run)
        if (!isDryRun) {
          await prisma.therapistProfile.update({
            where: { id: profile.id },
            data: {
              websiteUrl: result.websiteUrl || profile.websiteUrl,
              socialLinkedin: result.socialLinkedin || profile.socialLinkedin,
              socialInstagram: result.socialInstagram || profile.socialInstagram,
              socialFacebook: result.socialFacebook || profile.socialFacebook,
            },
          });
          console.log(`         💾 In Datenbank gespeichert`);
        } else {
          console.log(`         🔸 DRY RUN: Würde in DB speichern`);
        }

        stats.enriched++;
      } catch (error) {
        console.error(
          `         ❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        stats.failed++;
      }

      stats.processed++;

      // Rate limiting: Wait 2-3 seconds between requests to be respectful
      if (i < profiles.length - 1) {
        const delay = 2000 + Math.random() * 1000;
        console.log(`         ⏱️  Warte ${Math.round(delay / 1000)}s...\n`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  } finally {
    await browser.close();
  }

  // Print summary
  printSummary(stats);

  if (isDryRun) {
    console.log('\n⚠️  Dies war ein DRY RUN. Keine Änderungen wurden gespeichert.');
    console.log('Führe ohne --dry-run aus um Änderungen zu speichern.');
  }
}

/**
 * Enriches a therapist profile from web search
 */
async function enrichTherapistFromWeb(
  browser: any,
  profile: {
    id: string;
    displayName: string | null;
    city: string | null;
  },
): Promise<EnrichmentResult> {
  const result: EnrichmentResult = {
    therapistId: profile.id,
    therapistName: profile.displayName || 'Unknown',
    confidence: 'low',
    source: 'google-search',
  };

  let page;
  try {
    // Create context with user agent to avoid bot detection
    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    page = await context.newPage();

    // Construct search query (using DuckDuckGo instead of Google to avoid CAPTCHA)
    const searchQuery = `${profile.displayName} Psychotherapeut${profile.city ? ` ${profile.city}` : ''} Österreich`;
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`;

    // Navigate to DuckDuckGo search
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Wait a bit for results to load
    await page.waitForTimeout(1000);

    // Debug: Take screenshot if debug mode
    if (debug) {
      await page.screenshot({ path: `/tmp/duckduckgo-search-${profile.id}.png` });
      console.log(
        `         🔍 Debug: Screenshot saved to /tmp/duckduckgo-search-${profile.id}.png`,
      );
    }

    // Extract search results (DuckDuckGo HTML version has different selectors)
    const searchResults = await page.evaluate(() => {
      const results: Array<{ url: string; title: string; snippet: string }> = [];
      const resultElements = document.querySelectorAll('.result');

      resultElements.forEach((element: Element) => {
        const linkElement = element.querySelector('.result__a');
        const snippetElement = element.querySelector('.result__snippet');

        if (linkElement) {
          const url = linkElement.getAttribute('href') || '';

          results.push({
            url: url,
            title: linkElement.textContent || '',
            snippet: snippetElement?.textContent || '',
          });
        }
      });

      return results.slice(0, 10); // Top 10 results
    });

    if (debug) {
      console.log(`         🔍 Debug: Found ${searchResults.length} search results`);
      searchResults.forEach((r, i) => {
        console.log(`         ${i + 1}. ${r.title}`);
        console.log(`            ${r.url}`);
      });
    }

    // Analyze results
    const analysis = analyzeSearchResults(searchResults, profile.displayName || '');

    result.websiteUrl = analysis.websiteUrl;
    result.socialLinkedin = analysis.socialLinkedin;
    result.socialInstagram = analysis.socialInstagram;
    result.socialFacebook = analysis.socialFacebook;
    result.confidence = analysis.confidence;
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error';
  } finally {
    if (page) {
      await page.close();
    }
  }

  return result;
}

/**
 * Analyzes search results to extract relevant URLs
 */
function analyzeSearchResults(
  results: Array<{ url: string; title: string; snippet: string }>,
  therapistName: string,
): {
  websiteUrl?: string;
  socialLinkedin?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  confidence: 'high' | 'medium' | 'low';
} {
  const analysis = {
    websiteUrl: undefined as string | undefined,
    socialLinkedin: undefined as string | undefined,
    socialInstagram: undefined as string | undefined,
    socialFacebook: undefined as string | undefined,
    confidence: 'low' as 'high' | 'medium' | 'low',
  };

  // Extract name parts for matching
  const nameParts = therapistName.toLowerCase().split(/\s+/);
  const lastName = nameParts[nameParts.length - 1];

  for (const result of results) {
    const url = result.url.toLowerCase();
    const title = result.title.toLowerCase();
    const snippet = result.snippet.toLowerCase();

    // Skip unwanted domains
    if (
      url.includes('google.com') ||
      url.includes('youtube.com') ||
      url.includes('facebook.com/pages') ||
      url.includes('wikipedia.org') ||
      url.includes('gesundheit.gv.at') ||
      url.includes('psychotherapie.ehealth.gv.at')
    ) {
      continue;
    }

    // LinkedIn
    if (url.includes('linkedin.com/in/') && !analysis.socialLinkedin) {
      analysis.socialLinkedin = result.url;
      continue;
    }

    // Instagram
    if (url.includes('instagram.com/') && !analysis.socialInstagram) {
      analysis.socialInstagram = result.url;
      continue;
    }

    // Facebook
    if (url.includes('facebook.com/') && !url.includes('/pages') && !analysis.socialFacebook) {
      analysis.socialFacebook = result.url;
      continue;
    }

    // Personal website - look for therapist name in URL or title
    if (!analysis.websiteUrl) {
      const containsName = url.includes(lastName) || title.includes(therapistName.toLowerCase());

      const isProfessionalSite =
        url.includes('therapie') ||
        url.includes('psychotherap') ||
        url.includes('praxis') ||
        title.includes('psychotherap') ||
        snippet.includes('psychotherap');

      if (containsName || isProfessionalSite) {
        // Exclude directory sites
        if (
          !url.includes('psyonline.at') &&
          !url.includes('besthelp.at') &&
          !url.includes('therapeuten.at') &&
          !url.includes('therapie.de')
        ) {
          analysis.websiteUrl = result.url;

          // Higher confidence if name is in URL
          if (containsName && isProfessionalSite) {
            analysis.confidence = 'high';
          } else if (containsName || isProfessionalSite) {
            analysis.confidence = 'medium';
          }
        }
      }
    }
  }

  return analysis;
}

/**
 * Print summary statistics
 */
function printSummary(stats: EnrichmentStats) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 ZUSAMMENFASSUNG');
  console.log('='.repeat(80));
  console.log(`Total verarbeitet: ${stats.processed}/${stats.total}`);
  console.log(
    `✅ Erfolgreich angereichert: ${stats.enriched} (${((stats.enriched / stats.total) * 100).toFixed(1)}%)`,
  );
  console.log(`   - Websites gefunden: ${stats.websiteFound}`);
  console.log(`   - LinkedIn gefunden: ${stats.linkedinFound}`);
  console.log(`   - Instagram gefunden: ${stats.instagramFound}`);
  console.log(`   - Facebook gefunden: ${stats.facebookFound}`);
  console.log(
    `❌ Fehlgeschlagen: ${stats.failed} (${((stats.failed / stats.total) * 100).toFixed(1)}%)`,
  );
  console.log(`⏭️  Übersprungen: ${stats.skipped}`);
  console.log('='.repeat(80));
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
