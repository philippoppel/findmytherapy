'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export function FooterLinks() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
      <Link href="/" className="hover:text-default transition-colors">
        {t('navigation.home')}
      </Link>
      <Link href="/quiz" className="hover:text-default transition-colors">
        {t('searchMode.quickQuiz')}
      </Link>
      <Link href="/therapists?matching=true" className="hover:text-default transition-colors">
        {t('searchMode.guidedSearch')}
      </Link>
      <Link href="/triage" className="hover:text-default transition-colors">
        {t('searchMode.scientificTest')}
      </Link>
    </div>
  );
}
