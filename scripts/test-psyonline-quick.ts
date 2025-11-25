#!/usr/bin/env tsx

/**
 * Quick test to see if psyonline.at works
 */

import { chromium } from 'playwright';

async function main() {
  console.log('🔍 Testing psyonline.at...\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Test search
    const testName = 'Schmidt';
    const url = `https://www.psyonline.at/psychotherapeutinnen?name=${encodeURIComponent(testName)}`;

    console.log(`Searching for: ${testName}`);
    console.log(`URL: ${url}\n`);

    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait longer for JavaScript to load content
    console.log('Waiting for content to load...');
    await page.waitForTimeout(5000);

    // Try to find any text content
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log(`\nPage text (first 500 chars):\n${bodyText.slice(0, 500)}\n`);

    // Try to find links
    const links = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('a'));
      return allLinks
        .filter((a) => a.href && a.textContent)
        .slice(0, 10)
        .map((a) => ({
          text: a.textContent?.trim(),
          href: a.href,
        }));
    });

    console.log(`Found ${links.length} links (showing first 10):`);
    links.forEach((link, i) => {
      console.log(`${i + 1}. ${link.text} -> ${link.href}`);
    });

    // Look for any person-like elements
    const results = await page.evaluate(() => {
      // Try different selectors
      const selectors = [
        'article',
        '.person',
        '.therapist',
        '.result',
        '[class*="person"]',
        '[class*="therapist"]',
        '[class*="card"]',
      ];

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          return {
            selector,
            count: elements.length,
            examples: Array.from(elements)
              .slice(0, 3)
              .map((el) => ({
                text: el.textContent?.slice(0, 200),
                html: el.outerHTML.slice(0, 300),
              })),
          };
        }
      }

      return null;
    });

    if (results) {
      console.log(`\n✅ Found results with selector: ${results.selector}`);
      console.log(`Count: ${results.count}`);
      console.log('\nFirst 3 examples:');
      results.examples.forEach((ex, i) => {
        console.log(`\n${i + 1}. Text: ${ex.text}`);
        console.log(`   HTML: ${ex.html}`);
      });
    } else {
      console.log('\n❌ No results found with common selectors');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
