'use client';

import { useLanguage } from './LanguageContext';
import { translations } from './translations';

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}` | K
          : K
        : never;
    }[keyof T]
  : never;

type TranslationKeys = NestedKeyOf<typeof translations.de>;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Return the key if path not found
    }
  }

  return typeof current === 'string' ? current : path;
}

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = getNestedValue(
      translations[language] as unknown as Record<string, unknown>,
      key
    );

    if (!params) return translation;

    // Replace placeholders like {{name}} with actual values
    return translation.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
      return params[paramKey]?.toString() ?? `{{${paramKey}}}`;
    });
  };

  // Get an entire section of translations
  const getSection = <K extends keyof typeof translations.de>(
    section: K
  ): typeof translations.de[K] => {
    return translations[language][section];
  };

  return { t, getSection, language };
}

// Type-safe translation hook for specific sections
export function useTranslationSection<K extends keyof typeof translations.de>(section: K) {
  const { language } = useLanguage();
  return translations[language][section];
}
