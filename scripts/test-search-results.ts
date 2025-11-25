#!/usr/bin/env tsx

import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Go to search
  await page.goto('https://www.psyonline.at/psychotherapeutinnen-schnellsuche', {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(2000);

  // Fill and submit
  await page.fill('input[name="familienname"]', 'Schmidt');
  await page.fill('input[name="ort"]', 'Wien');
  await page.click('input[name="search_random"]');
  await page.waitForTimeout(5000);

  console.log(`Results URL: ${page.url()}\n`);

  // Analyze all links on results page
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a'))
      .map((a) => ({
        text: a.textContent?.trim().slice(0, 80),
        href: a.href,
        textLength: (a.textContent?.trim() || '').length,
      }))
      .filter(
        (l) =>
          l.textLength > 5 &&
          l.textLength < 150 &&
          !l.href.includes('/psychotherapeutinnen-') &&
          !l.href.includes('/contents/') &&
          !l.href.includes('/neue-') &&
          !l.href.includes('bestnet') &&
          !l.href.includes('/members'),
      )
      .slice(0, 20);
  });

  console.log(`Found ${links.length} potential profile links:\n`);
  links.forEach((l, i) => {
    console.log(`${i + 1}. "${l.text}"`);
    console.log(`   ${l.href}\n`);
  });

  await browser.close();
}

main().catch(console.error);
