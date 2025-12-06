'use client';

import { useLanguage } from '@/lib/i18n';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex h-9 items-center gap-1.5 rounded-full border border-divider bg-surface-1 px-3 text-sm font-medium text-default shadow-soft transition hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
      aria-label={language === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln'}
    >
      <span
        className={`transition-opacity ${language === 'de' ? 'opacity-100' : 'opacity-50'}`}
      >
        DE
      </span>
      <span className="text-muted">/</span>
      <span
        className={`transition-opacity ${language === 'en' ? 'opacity-100' : 'opacity-50'}`}
      >
        EN
      </span>
    </button>
  );
}
