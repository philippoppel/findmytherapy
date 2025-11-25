#!/usr/bin/env tsx

/**
 * Analyze psyonline.at structure
 *
 * This script explores the psyonline.at website to understand:
 * - Search functionality
 * - Therapist profile URL patterns
 * - Available data fields
 */

import { chromium } from 'playwright';

async function main() {
  console.log('🔍 Analyzing psyonline.at structure...\n');

  const browser = await chromium.launch({ headless: false }); // Show browser
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to main therapist directory
    console.log('1. Loading main directory...');
    await page.goto('https://www.psyonline.at/psychotherapeutinnen', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({ path: '/tmp/psyonline-main.png' });
    console.log('   Screenshot saved to /tmp/psyonline-main.png\n');

    // Analyze search form
    console.log('2. Analyzing search form...');
    const searchForm = await page.evaluate(() => {
      const forms = Array.from(document.querySelectorAll('form'));
      const inputs = Array.from(document.querySelectorAll('input, select'));

      return {
        formCount: forms.length,
        inputNames: inputs.map((i) => ({
          type: i.tagName,
          name: i.getAttribute('name'),
          id: i.getAttribute('id'),
          placeholder: i.getAttribute('placeholder'),
        })),
      };
    });
    console.log('   Forms:', searchForm.formCount);
    console.log('   Inputs:', JSON.stringify(searchForm.inputNames, null, 2));

    // Try to find therapist links
    console.log('\n3. Looking for therapist profile links...');
    const therapistLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="therapeut"]'));
      return links.slice(0, 10).map((link) => ({
        href: link.getAttribute('href'),
        text: link.textContent?.trim().slice(0, 50),
      }));
    });
    console.log('   Found links:', JSON.stringify(therapistLinks, null, 2));

    // Try searching for a therapist
    console.log('\n4. Trying a test search...');
    const nameInput = (await page.$('input[name="name"]')) || (await page.$('input[type="text"]'));

    if (nameInput) {
      await nameInput.fill('Schmidt');
      await page.waitForTimeout(1000);

      // Look for submit button
      const submitButton =
        (await page.$('button[type="submit"]')) || (await page.$('input[type="submit"]'));
      if (submitButton) {
        await submitButton.click();
        await page.waitForTimeout(3000);

        await page.screenshot({ path: '/tmp/psyonline-search-results.png' });
        console.log('   Search results screenshot: /tmp/psyonline-search-results.png');

        // Extract results
        const results = await page.evaluate(() => {
          const resultElements = Array.from(
            document.querySelectorAll('.result, .therapist, .person, [class*="card"]'),
          );
          return resultElements.slice(0, 5).map((el) => ({
            classes: el.className,
            html: el.outerHTML.slice(0, 200),
          }));
        });
        console.log('   Results found:', results.length);
      }
    }

    // Keep browser open for manual inspection
    console.log(
      '\n✅ Analysis complete. Browser will stay open for 30 seconds for manual inspection...',
    );
    await page.waitForTimeout(30000);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
