'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export function BackToBlogLink() {
  const { t } = useTranslation();
  return (
    <Link href="/blog" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors">
      <span>← {t('blogPages.backToBlog')}</span>
    </Link>
  );
}

export function AtAGlanceHeading() {
  const { t } = useTranslation();
  return (
    <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-4">
      {t('blogPages.atAGlance')}
    </h2>
  );
}

export function FAQHeading() {
  const { t } = useTranslation();
  return (
    <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-6">
      {t('blogPages.faq')}
    </h2>
  );
}

export function SourcesHeading() {
  const { t } = useTranslation();
  return (
    <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-6">
      {t('blogPages.sourcesAndLiterature')}
    </h2>
  );
}

export function BlogCTASection() {
  const { t } = useTranslation();
  return (
    <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
      <Link
        href="/therapists"
        className="p-4 sm:p-6 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition min-h-[44px]"
      >
        <p className="font-semibold mb-1">{t('blogPages.findTherapist')}</p>
        <p className="text-sm text-neutral-400">
          {t('blogPages.specialistsForYourTopics')}
        </p>
      </Link>
      <Link
        href="/quiz"
        className="p-4 sm:p-6 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition min-h-[44px]"
      >
        <p className="font-semibold text-neutral-900 mb-1">{t('blogPages.quickQuiz')}</p>
        <p className="text-sm text-neutral-500">
          {t('blogPages.orientationIn2Min')}
        </p>
      </Link>
    </div>
  );
}

export function RelatedArticlesHeader() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">{t('blogPages.moreArticles')}</h2>
      <Link
        href="/blog"
        className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition flex items-center gap-1 min-h-[44px] px-2"
      >
        {t('blogPages.allArticles')}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export function FinalCTABanner() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 mb-3 sm:mb-4">
        {t('blogPages.readyForNextStep')}
      </h2>
      <p className="text-sm sm:text-base text-neutral-600 mb-6 sm:mb-8">
        {t('blogPages.findProfessionalSupport')}
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <Link
          href="/therapists"
          className="px-6 py-3 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition min-h-[44px] flex items-center justify-center"
        >
          {t('blogPages.browseTherapists')}
        </Link>
        <Link
          href="/triage"
          className="px-6 py-3 rounded-lg border border-neutral-200 text-neutral-700 font-medium hover:bg-neutral-50 transition min-h-[44px] flex items-center justify-center"
        >
          {t('blogPages.startAssessment')}
        </Link>
      </div>
    </div>
  );
}
