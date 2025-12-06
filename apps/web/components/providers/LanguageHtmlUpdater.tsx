'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';

/**
 * Updates the HTML lang attribute when language changes.
 * This is important for:
 * - Screen readers and accessibility
 * - Google's language detection
 * - Browser translation features
 */
export function LanguageHtmlUpdater() {
  const { language } = useLanguage();

  useEffect(() => {
    // Update the html lang attribute
    const htmlElement = document.documentElement;
    const newLang = language === 'de' ? 'de-AT' : 'en';

    if (htmlElement.lang !== newLang) {
      htmlElement.lang = newLang;
    }

    // Update the hreflang meta tag dynamically
    // This helps Google understand there are alternate language versions
    let hreflangDe = document.querySelector('link[hreflang="de-AT"]');
    let hreflangEn = document.querySelector('link[hreflang="en"]');
    let hreflangDefault = document.querySelector('link[hreflang="x-default"]');

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    if (!hreflangDe) {
      hreflangDe = document.createElement('link');
      hreflangDe.setAttribute('rel', 'alternate');
      hreflangDe.setAttribute('hreflang', 'de-AT');
      document.head.appendChild(hreflangDe);
    }
    hreflangDe.setAttribute('href', currentUrl);

    if (!hreflangEn) {
      hreflangEn = document.createElement('link');
      hreflangEn.setAttribute('rel', 'alternate');
      hreflangEn.setAttribute('hreflang', 'en');
      document.head.appendChild(hreflangEn);
    }
    hreflangEn.setAttribute('href', currentUrl);

    if (!hreflangDefault) {
      hreflangDefault = document.createElement('link');
      hreflangDefault.setAttribute('rel', 'alternate');
      hreflangDefault.setAttribute('hreflang', 'x-default');
      document.head.appendChild(hreflangDefault);
    }
    hreflangDefault.setAttribute('href', currentUrl);

  }, [language]);

  return null;
}
