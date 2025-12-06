'use client';

import { useTranslation } from '@/lib/i18n';
import type { FeatureIconKey } from '../marketing-content';

export function useMarketingContent() {
  const { t } = useTranslation();

  const marketingNavigation = [
    { label: t('marketing.guide'), href: '/blog' },
    { label: t('marketing.firstAssessment'), href: '/triage' },
    { label: t('marketing.benefits'), href: '#benefits' },
    { label: t('marketing.therapists'), href: '#therapist-directory' },
    { label: t('marketing.aboutUs'), href: '/about' },
    { label: t('marketing.faq'), href: '#faq' },
  ] as const;

  const heroContent = {
    eyebrow: t('marketing.calmStart'),
    title: t('marketing.heroTitle'),
    highlight: t('marketing.heroHighlight'),
    description: t('marketing.heroDescription'),
    primaryCta: {
      label: t('marketing.letsGo'),
      href: '#matching-wizard',
    },
    secondaryCta: {
      label: t('marketing.iKnowWhatISearch'),
      href: '/therapists',
    },
    tertiaryCta: {
      label: t('marketing.forTherapistsLink'),
      href: '/for-therapists',
    },
    emergencyCta: {
      label: t('marketing.emergencyHelp'),
      href: '/blog/akuthilfe-panikattacken',
    },
    metrics: [
      { value: t('marketing.free'), label: t('marketing.expertKnowledge') },
      { value: t('marketing.seoOptimized'), label: t('marketing.therapistProfiles') },
      { value: t('marketing.gdpr100'), label: t('marketing.euPrivacy') },
    ],
    image: {
      src: '/images/therapists/therapy-2.jpg',
      alt: t('marketing.heroImageAlt'),
    },
  };

  const impactStats = [
    {
      value: 'PHQ-9 & GAD-7',
      emphasis: t('marketing.validatedQuestionnaires'),
      description: t('marketing.validatedQuestionnairesDesc'),
    },
    {
      value: t('marketing.gdprCompliant'),
      emphasis: t('marketing.euPrivacyLabel'),
      description: t('marketing.gdprCompliantDesc'),
    },
    {
      value: t('marketing.lessThan5Min'),
      emphasis: t('marketing.toClarity'),
      description: t('marketing.toClarityDesc'),
    },
  ] as const;

  const whyContent = {
    id: 'why',
    title: t('marketing.whyOrientationMatters'),
    description: t('marketing.whyOrientationDesc'),
    bullets: [
      t('marketing.bullet1'),
      t('marketing.bullet2'),
      t('marketing.bullet3'),
    ],
    cta: {
      label: t('marketing.freeAssessmentCta'),
      href: '/triage',
    },
    image: {
      src: '/images/therapists/therapy-1.jpg',
      alt: t('marketing.whyImageAlt'),
    },
  };

  return {
    marketingNavigation,
    heroContent,
    impactStats,
    whyContent,
  };
}
