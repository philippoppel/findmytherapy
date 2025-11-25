#!/usr/bin/env tsx

/**
 * Analyze real therapist websites to see what data is available
 */

import { chromium } from 'playwright';

async function analyzeWebsite(url: string, name: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`\n${'='.repeat(80)}`);
  console.log(`Analyzing: ${name}`);
  console.log(`URL: ${url}`);
  console.log('='.repeat(80));

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const data = await page.evaluate(() => {
      const text = document.body.innerText;
      const html = document.body.innerHTML;

      return {
        // Profile Image
        hasProfileImage: !!document.querySelector(
          'img[src*="profil"], img[src*="portrait"], img[src*="photo"], img[alt*="Foto"]',
        ),
        profileImages: Array.from(document.querySelectorAll('img'))
          .filter((img) => {
            const src = img.src.toLowerCase();
            const alt = img.alt.toLowerCase();
            return (
              (src.includes('profil') ||
                src.includes('portrait') ||
                src.includes('photo') ||
                alt.includes('foto') ||
                alt.includes('portrait')) &&
              img.width > 100
            );
          })
          .map((img) => img.src)
          .slice(0, 3),

        // Pricing Information
        hasPricing:
          text.includes('€') ||
          text.toLowerCase().includes('honorar') ||
          text.toLowerCase().includes('tarif') ||
          text.toLowerCase().includes('preis'),
        priceMatches:
          text
            .match(/(\d+)\s*[-–]\s*(\d+)\s*€|€\s*(\d+)\s*[-–]\s*(\d+)|(\d+)\s*Euro/gi)
            ?.slice(0, 5) || [],

        // Contact Information
        hasEmail: text.includes('@') || html.includes('mailto:'),
        emailMatches:
          text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)?.slice(0, 3) || [],
        hasPhone: text.match(/\+?\d{2,4}[-\s]?\d{3,4}[-\s]?\d{3,4}/g) !== null,
        phoneMatches: text.match(/\+?\d{2,4}[-\s]?\d{3,4}[-\s]?\d{3,4}/g)?.slice(0, 3) || [],

        // Social Media
        hasSocialMedia:
          html.includes('facebook.com') ||
          html.includes('instagram.com') ||
          html.includes('linkedin.com') ||
          html.includes('xing.com'),
        socialLinks: {
          facebook: Array.from(document.querySelectorAll('a[href*="facebook.com"]')).map(
            (a) => (a as HTMLAnchorElement).href,
          )[0],
          instagram: Array.from(document.querySelectorAll('a[href*="instagram.com"]')).map(
            (a) => (a as HTMLAnchorElement).href,
          )[0],
          linkedin: Array.from(document.querySelectorAll('a[href*="linkedin.com"]')).map(
            (a) => (a as HTMLAnchorElement).href,
          )[0],
          xing: Array.from(document.querySelectorAll('a[href*="xing.com"]')).map(
            (a) => (a as HTMLAnchorElement).href,
          )[0],
        },

        // About/Bio
        hasAboutSection:
          text.toLowerCase().includes('über mich') ||
          text.toLowerCase().includes('zu meiner person') ||
          text.toLowerCase().includes('meine philosophie'),
        aboutLength: text.length,

        // Specializations
        hasSpecializations:
          text.toLowerCase().includes('schwerpunkt') ||
          text.toLowerCase().includes('spezialisierung') ||
          text.toLowerCase().includes('angebot'),

        // Methods/Approaches
        hasMethodsListed:
          text.toLowerCase().includes('methode') ||
          text.toLowerCase().includes('ansatz') ||
          text.toLowerCase().includes('therapieform'),

        // Languages
        hasLanguages:
          text.toLowerCase().includes('sprache') ||
          text.toLowerCase().includes('english') ||
          text.toLowerCase().includes('français'),
        languageMatches:
          text.match(/Deutsch|English|Französisch|Italienisch|Spanisch/gi)?.slice(0, 5) || [],

        // Office Hours / Availability
        hasOfficeHours:
          text.toLowerCase().includes('öffnungszeit') ||
          text.toLowerCase().includes('sprechstunde') ||
          text.toLowerCase().includes('termine'),

        // Location/Address
        hasAddress: text.match(/\d{4}\s+[A-ZÄÖÜ][a-zäöüß]+/) !== null,
        addressMatches: text.match(/\d{4}\s+[A-ZÄÖÜ][a-zäöüß]+[,\s]+.{0,50}/g)?.slice(0, 2) || [],

        // Booking/Appointment
        hasOnlineBooking:
          html.toLowerCase().includes('termin') &&
          (html.toLowerCase().includes('buchen') || html.toLowerCase().includes('vereinbaren')),
        bookingLinks: Array.from(
          document.querySelectorAll('a[href*="termin"], a[href*="booking"], a[href*="calendar"]'),
        )
          .map((a) => (a as HTMLAnchorElement).href)
          .slice(0, 2),

        // Credentials/Qualifications
        hasQualifications:
          text.toLowerCase().includes('ausbildung') ||
          text.toLowerCase().includes('qualifikation') ||
          text.toLowerCase().includes('zertifikat'),

        // Insurance
        hasInsuranceInfo:
          text.toLowerCase().includes('kasse') ||
          text.toLowerCase().includes('krankenkasse') ||
          text.toLowerCase().includes('versicherung'),
        insuranceMatches: text.match(/ÖGK|SVS|BVAEB|KFA|Krankenkasse/gi)?.slice(0, 5) || [],

        // Video/Media
        hasVideo:
          html.includes('youtube.com') || html.includes('vimeo.com') || html.includes('<video'),
        videoLinks: Array.from(
          document.querySelectorAll(
            'a[href*="youtube.com"], a[href*="vimeo.com"], iframe[src*="youtube"], iframe[src*="vimeo"]',
          ),
        )
          .map((el) => el.getAttribute('href') || el.getAttribute('src'))
          .filter(Boolean)
          .slice(0, 2),

        // Downloads (PDFs, etc.)
        hasDownloads: html.includes('.pdf') || html.toLowerCase().includes('download'),
        downloadLinks: Array.from(document.querySelectorAll('a[href$=".pdf"]'))
          .map((a) => (a as HTMLAnchorElement).href)
          .slice(0, 3),

        // Gallery
        hasGallery: document.querySelectorAll('img').length > 5,
        imageCount: document.querySelectorAll('img').length,

        // Overall content length
        textLength: text.length,
        wordCount: text.split(/\s+/).length,
      };
    });

    // Print results
    console.log('\n📋 AVAILABLE DATA:\n');

    console.log('🖼️  Profile Images:');
    console.log(`   Found: ${data.hasProfileImage ? 'YES' : 'NO'}`);
    if (data.profileImages.length > 0) {
      data.profileImages.forEach((img, i) => console.log(`   ${i + 1}. ${img}`));
    }

    console.log('\n💰 Pricing:');
    console.log(`   Has pricing: ${data.hasPricing ? 'YES' : 'NO'}`);
    if (data.priceMatches.length > 0) {
      console.log(`   Found: ${data.priceMatches.join(', ')}`);
    }

    console.log('\n📧 Contact:');
    console.log(`   Email: ${data.hasEmail ? 'YES' : 'NO'}`);
    if (data.emailMatches.length > 0) {
      console.log(`   ${data.emailMatches.join(', ')}`);
    }
    console.log(`   Phone: ${data.hasPhone ? 'YES' : 'NO'}`);
    if (data.phoneMatches.length > 0) {
      console.log(`   ${data.phoneMatches.join(', ')}`);
    }

    console.log('\n🔗 Social Media:');
    console.log(`   Has social: ${data.hasSocialMedia ? 'YES' : 'NO'}`);
    if (data.socialLinks.facebook) console.log(`   Facebook: ${data.socialLinks.facebook}`);
    if (data.socialLinks.instagram) console.log(`   Instagram: ${data.socialLinks.instagram}`);
    if (data.socialLinks.linkedin) console.log(`   LinkedIn: ${data.socialLinks.linkedin}`);
    if (data.socialLinks.xing) console.log(`   Xing: ${data.socialLinks.xing}`);

    console.log('\n📝 Content:');
    console.log(`   About section: ${data.hasAboutSection ? 'YES' : 'NO'}`);
    console.log(`   Specializations: ${data.hasSpecializations ? 'YES' : 'NO'}`);
    console.log(`   Methods listed: ${data.hasMethodsListed ? 'YES' : 'NO'}`);
    console.log(`   Qualifications: ${data.hasQualifications ? 'YES' : 'NO'}`);
    console.log(`   Text length: ${data.textLength} chars (${data.wordCount} words)`);

    console.log('\n🌍 Languages:');
    console.log(`   Has languages: ${data.hasLanguages ? 'YES' : 'NO'}`);
    if (data.languageMatches.length > 0) {
      console.log(`   Found: ${data.languageMatches.join(', ')}`);
    }

    console.log('\n📍 Location:');
    console.log(`   Has address: ${data.hasAddress ? 'YES' : 'NO'}`);
    if (data.addressMatches.length > 0) {
      data.addressMatches.forEach((addr) => console.log(`   ${addr}`));
    }

    console.log('\n📅 Booking:');
    console.log(`   Online booking: ${data.hasOnlineBooking ? 'YES' : 'NO'}`);
    console.log(`   Office hours: ${data.hasOfficeHours ? 'YES' : 'NO'}`);

    console.log('\n🏥 Insurance:');
    console.log(`   Insurance info: ${data.hasInsuranceInfo ? 'YES' : 'NO'}`);
    if (data.insuranceMatches.length > 0) {
      console.log(`   Found: ${data.insuranceMatches.join(', ')}`);
    }

    console.log('\n🎥 Media:');
    console.log(`   Has video: ${data.hasVideo ? 'YES' : 'NO'}`);
    if (data.videoLinks.length > 0) {
      data.videoLinks.forEach((link) => console.log(`   ${link}`));
    }
    console.log(`   Has downloads: ${data.hasDownloads ? 'YES' : 'NO'}`);
    console.log(`   Image gallery: ${data.hasGallery ? 'YES' : 'NO'} (${data.imageCount} images)`);

    return data;
  } catch (error) {
    console.error(`\n❌ Error analyzing ${url}:`, error);
    return null;
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('🔍 Analyzing Therapist Websites for Available Data\n');

  // Real websites found from psyonline
  const websites = [
    { url: 'http://psychotherapeutin-moser.at', name: 'Claudia Moser' },
    { url: 'http://www.hubertaplieschnig.at/', name: 'Huberta Plieschnig' },
    { url: 'https://psypraxishuber.at/', name: 'Praxis Huber' },
  ];

  for (const site of websites) {
    const data = await analyzeWebsite(site.url, site.name);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait between requests
  }

  console.log('\n\n' + '='.repeat(80));
  console.log('✅ Analysis complete!');
  console.log('='.repeat(80));
}

main().catch(console.error);
