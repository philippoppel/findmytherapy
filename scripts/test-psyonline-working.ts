#!/usr/bin/env tsx

/**
 * Test psyonline.at search with correct field names
 */

import { chromium } from 'playwright';

async function main() {
  console.log('🔍 Testing psyonline.at with correct form fields...\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const testLastName = 'Müller';
    const testCity = 'Wien';

    console.log(`Searching for: ${testLastName} in ${testCity}\n`);

    // Go to quick search
    await page.goto('https://www.psyonline.at/psychotherapeutinnen-schnellsuche', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    await page.waitForTimeout(2000);

    console.log('Filling form fields...');

    // Fill family name (Nachname)
    const familyNameField = await page.$('input[name="familienname"]');
    if (familyNameField) {
      await familyNameField.fill(testLastName);
      console.log(`✅ Filled familienname: ${testLastName}`);
    } else {
      console.log('❌ Could not find familienname field');
      return;
    }

    // Fill city (Ort)
    const ortField = await page.$('input[name="ort"]');
    if (ortField) {
      await ortField.fill(testCity);
      console.log(`✅ Filled ort: ${testCity}`);
    }

    // Find submit button
    const submitBtn =
      (await page.$('input[name="search_available"]')) || (await page.$('input[type="submit"]'));

    if (submitBtn) {
      console.log('\n🔍 Submitting search...');
      await submitBtn.click();

      // Wait for navigation and results
      await page.waitForTimeout(5000);

      const currentUrl = page.url();
      console.log(`Current URL: ${currentUrl}`);

      // Analyze results
      const results = await page.evaluate(() => {
        const bodyText = document.body.innerText;

        // Look for profile links
        const allLinks = Array.from(document.querySelectorAll('a'));
        const profileLinks = allLinks
          .filter((a) => {
            const href = a.href || '';
            const text = a.textContent?.trim() || '';

            // Look for person profile URLs or name-like links
            return (
              href.includes('/person-detail/') ||
              href.includes('/therapeut') ||
              (text.length > 5 && text.length < 100 && /[A-ZÄÖÜ][a-zäöüß]+/.test(text))
            );
          })
          .slice(0, 10)
          .map((a) => ({
            text: a.textContent?.trim(),
            href: a.href,
            classes: a.className,
          }));

        // Count results
        const resultCount = bodyText.match(/(\d+)\s+(Ergebnis|Treffer|Person)/i)?.[1] || '?';

        return {
          bodyText: bodyText.slice(0, 1500),
          profileLinks,
          resultCount,
          hasResults:
            bodyText.toLowerCase().includes('ergebnis') ||
            bodyText.toLowerCase().includes('person') ||
            profileLinks.length > 0,
        };
      });

      console.log(`\n📊 Results:`);
      console.log(`Found: ${results.resultCount} results`);
      console.log(`Has results: ${results.hasResults}`);
      console.log(`Profile links found: ${results.profileLinks.length}`);

      if (results.profileLinks.length > 0) {
        console.log(`\n✅ First ${Math.min(5, results.profileLinks.length)} profile links:`);
        results.profileLinks.slice(0, 5).forEach((link, i) => {
          console.log(`  ${i + 1}. ${link.text}`);
          console.log(`     ${link.href}`);
          console.log(`     class: ${link.classes}`);
        });

        // Try to open first profile
        if (results.profileLinks[0]) {
          console.log(`\n🔍 Opening first profile to see data structure...`);
          await page.goto(results.profileLinks[0].href, { waitUntil: 'networkidle' });
          await page.waitForTimeout(3000);

          const profileData = await page.evaluate(() => {
            const text = document.body.innerText;

            // Look for common data fields
            const data: any = {
              hasPhoto: !!document.querySelector('img[src*="photo"], img[src*="bild"]'),
              hasAbout: text.includes('Über mich') || text.includes('Beschreibung'),
              hasWebsite: text.includes('Website') || text.includes('Homepage'),
              hasSocial:
                text.includes('LinkedIn') ||
                text.includes('Instagram') ||
                text.includes('Facebook'),
              hasPrice: text.includes('€') || text.includes('Euro') || text.includes('Preis'),
            };

            // Try to find specific elements
            const photoEl = document.querySelector(
              'img.profile-photo, img.person-photo, img[alt*="Foto"]',
            );
            if (photoEl) {
              data.photoSrc = (photoEl as HTMLImageElement).src;
            }

            // Look for website links
            const links = Array.from(document.querySelectorAll('a[href^="http"]'))
              .filter((a) => {
                const href = a.href;
                return !href.includes('psyonline.at');
              })
              .slice(0, 5)
              .map((a) => a.href);

            data.externalLinks = links;

            return data;
          });

          console.log(`\n📋 Profile page analysis:`);
          console.log(`  Has photo: ${profileData.hasPhoto}`);
          if (profileData.photoSrc) {
            console.log(`  Photo src: ${profileData.photoSrc}`);
          }
          console.log(`  Has about section: ${profileData.hasAbout}`);
          console.log(`  Has website: ${profileData.hasWebsite}`);
          console.log(`  Has social media: ${profileData.hasSocial}`);
          console.log(`  Has pricing: ${profileData.hasPrice}`);
          console.log(`  External links: ${profileData.externalLinks.length}`);
          if (profileData.externalLinks.length > 0) {
            profileData.externalLinks.forEach((link: string, i: number) => {
              console.log(`    ${i + 1}. ${link}`);
            });
          }

          // Screenshot
          await page.screenshot({ path: '/tmp/psyonline-profile.png', fullPage: true });
          console.log(`\n📸 Profile screenshot: /tmp/psyonline-profile.png`);
        }
      } else {
        console.log(`\n❌ No profile links found`);
        console.log(`\nPage content (first 1500 chars):`);
        console.log(results.bodyText);
      }

      // Screenshot of results
      await page.screenshot({ path: '/tmp/psyonline-search-results.png', fullPage: true });
      console.log(`\n📸 Search results screenshot: /tmp/psyonline-search-results.png`);
    } else {
      console.log('❌ Could not find submit button');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
