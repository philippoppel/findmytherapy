#!/usr/bin/env tsx

/**
 * Find the correct selector for profile links
 */

import { chromium } from 'playwright';

async function main() {
  console.log('🔍 Finding profile link selector...\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Go to quick search
    await page.goto('https://www.psyonline.at/psychotherapeutinnen-schnellsuche', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    await page.waitForTimeout(2000);

    // Fill and submit
    await page.fill('input[name="familienname"]', 'Schmidt');
    await page.fill('input[name="ort"]', 'Wien');

    console.log('Submitting search...');
    await page.click('input[type="submit"]');
    await page.waitForTimeout(5000);

    console.log(`URL: ${page.url()}\n`);

    // Deep analysis of all links
    const linkAnalysis = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('a'));

      const categorized = {
        personDetail: [] as any[],
        containsPerson: [] as any[],
        longText: [] as any[],
        hasNamePattern: [] as any[],
        all: [] as any[],
      };

      allLinks.forEach((link) => {
        const href = link.href || '';
        const text = link.textContent?.trim() || '';
        const innerHTML = link.innerHTML;

        const linkInfo = {
          text,
          href,
          textLength: text.length,
          hasNamePattern: /[A-ZÄÖÜ][a-zäöüß]+\s+[A-ZÄÖÜ][a-zäöüß]+/.test(text),
          innerHTML: innerHTML?.slice(0, 200),
          classes: link.className,
          parent: link.parentElement?.tagName,
        };

        // Categorize
        if (href.includes('/person')) {
          categorized.personDetail.push(linkInfo);
        }
        if (href.toLowerCase().includes('person') || text.toLowerCase().includes('person')) {
          categorized.containsPerson.push(linkInfo);
        }
        if (text.length > 10 && text.length < 100) {
          categorized.longText.push(linkInfo);
        }
        if (linkInfo.hasNamePattern) {
          categorized.hasNamePattern.push(linkInfo);
        }

        categorized.all.push(linkInfo);
      });

      return categorized;
    });

    console.log('=== Link Analysis ===\n');
    console.log(`Total links: ${linkAnalysis.all.length}`);
    console.log(`Links with "/person" in URL: ${linkAnalysis.personDetail.length}`);
    console.log(`Links containing "person": ${linkAnalysis.containsPerson.length}`);
    console.log(`Links with name pattern: ${linkAnalysis.hasNamePattern.length}`);
    console.log(`Links with 10-100 chars: ${linkAnalysis.longText.length}`);

    if (linkAnalysis.personDetail.length > 0) {
      console.log(`\n✅ Found ${linkAnalysis.personDetail.length} person detail links:`);
      linkAnalysis.personDetail.slice(0, 10).forEach((link, i) => {
        console.log(`\n${i + 1}. "${link.text}"`);
        console.log(`   URL: ${link.href}`);
        console.log(`   Class: ${link.classes}`);
        console.log(`   Parent: ${link.parent}`);
      });
    }

    if (linkAnalysis.hasNamePattern.length > 0) {
      console.log(`\n\n📝 Links with name pattern (first 10):`);
      linkAnalysis.hasNamePattern.slice(0, 10).forEach((link, i) => {
        console.log(`\n${i + 1}. "${link.text}"`);
        console.log(`   URL: ${link.href}`);
        console.log(`   Class: ${link.classes}`);
      });
    }

    // Try to find the results container
    const containerAnalysis = await page.evaluate(() => {
      // Look for common result container patterns
      const selectors = [
        '.results',
        '.search-results',
        '#results',
        '.person-list',
        '.therapist-list',
        'table',
        '.list',
        '[class*="result"]',
        '[class*="person"]',
        '[class*="list"]',
      ];

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0 && elements.length < 50) {
          const el = elements[0];
          const links = el.querySelectorAll('a');
          if (links.length > 0) {
            return {
              selector,
              count: elements.length,
              linkCount: links.length,
              html: el.outerHTML.slice(0, 500),
              firstLinkText: links[0]?.textContent?.trim(),
              firstLinkHref: links[0]?.getAttribute('href'),
            };
          }
        }
      }

      // If nothing found, look at body structure
      const bodyChildren = Array.from(document.body.children).map((child) => ({
        tag: child.tagName,
        id: child.id,
        class: child.className,
        childCount: child.children.length,
      }));

      return {
        bodyStructure: bodyChildren.slice(0, 20),
      };
    });

    console.log(`\n\n=== Container Analysis ===`);
    if (containerAnalysis.selector) {
      console.log(`Found results container: ${containerAnalysis.selector}`);
      console.log(`Elements: ${containerAnalysis.count}`);
      console.log(`Links inside: ${containerAnalysis.linkCount}`);
      console.log(`First link: "${containerAnalysis.firstLinkText}"`);
      console.log(`First link href: ${containerAnalysis.firstLinkHref}`);
      console.log(`HTML preview: ${containerAnalysis.html}`);
    } else if (containerAnalysis.bodyStructure) {
      console.log(`Body structure:`);
      containerAnalysis.bodyStructure.forEach((child: any) => {
        console.log(
          `  <${child.tag}> id="${child.id}" class="${child.class}" children=${child.childCount}`,
        );
      });
    }

    // Save page HTML for manual inspection
    const html = await page.content();
    const fs = await import('fs');
    fs.writeFileSync('/tmp/psyonline-results.html', html);
    console.log(`\n📄 Full HTML saved: /tmp/psyonline-results.html`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
