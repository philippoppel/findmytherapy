'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, ClipboardCheck, Search, Sparkles, ArrowRight } from 'lucide-react';
import { usePrefersReducedMotion } from '@/app/components/usePrefersReducedMotion';
import { useTranslation } from '@/lib/i18n';

type SearchOption = {
  id: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  badgeKey?: string;
  badgeIcon?: typeof Sparkles;
  icon: typeof Compass;
  image: string;
  ctaKey: string;
  color: 'primary' | 'secondary' | 'neutral';
  featureKeys: string[];
};

const searchOptionsConfig: SearchOption[] = [
  {
    id: 'matching',
    titleKey: 'matchingTitle',
    subtitleKey: 'matchingSubtitle',
    descriptionKey: 'matchingDesc',
    badgeKey: 'matchingBadge',
    badgeIcon: Sparkles,
    icon: Compass,
    image: '/images/search/matching-hero.jpg',
    ctaKey: 'matchingCta',
    color: 'primary',
    featureKeys: ['matchingFeature1', 'matchingFeature2', 'matchingFeature3'],
  },
  {
    id: 'triage',
    titleKey: 'triageTitle',
    subtitleKey: 'triageSubtitle',
    descriptionKey: 'triageDesc',
    icon: ClipboardCheck,
    image: '/images/search/triage-hero.jpg',
    ctaKey: 'triageCta',
    color: 'secondary',
    featureKeys: ['triageFeature1', 'triageFeature2', 'triageFeature3'],
  },
  {
    id: 'search',
    titleKey: 'searchTitle',
    subtitleKey: 'searchSubtitle',
    descriptionKey: 'searchDesc',
    icon: Search,
    image: '/images/search/suche-hero.jpg',
    ctaKey: 'searchCta',
    color: 'neutral',
    featureKeys: ['searchFeature1', 'searchFeature2', 'searchFeature3'],
  },
];

export function TherapistSearchChoice() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { t } = useTranslation();

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-2 sm:px-3 lg:px-4">
        {/* Header */}
        <motion.div
          className="mb-10 text-center sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            {t('marketing.searchChoiceHeading')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            {t('marketing.searchChoiceSubheading')}
          </p>
        </motion.div>

        {/* Three Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {searchOptionsConfig.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <SearchCard
                option={option}
                prefersReducedMotion={prefersReducedMotion}
                t={t}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom hint */}
        <motion.p
          className="mt-10 text-center text-sm text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t('marketing.searchChoiceHint')}
        </motion.p>
      </div>
    </section>
  );
}

function SearchCard({
  option,
  prefersReducedMotion,
  t,
}: {
  option: SearchOption;
  prefersReducedMotion: boolean;
  t: (key: string) => string;
}) {
  const Icon = option.icon;
  const BadgeIcon = option.badgeIcon;
  const title = t(`marketing.${option.titleKey}`);
  const subtitle = t(`marketing.${option.subtitleKey}`);
  const description = t(`marketing.${option.descriptionKey}`);
  const badge = option.badgeKey ? t(`marketing.${option.badgeKey}`) : undefined;
  const cta = t(`marketing.${option.ctaKey}`);
  const features = option.featureKeys.map((key) => t(`marketing.${key}`));

  const cardContent = (
    <motion.div
      className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200/60 bg-white shadow-lg transition-shadow duration-300 group-hover:shadow-2xl"
      whileHover={!prefersReducedMotion ? { scale: 1.02, y: -4 } : {}}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={option.image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Badge (only for matching) */}
        {badge && BadgeIcon && (
          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-primary-900 shadow-lg backdrop-blur-sm">
            <BadgeIcon className="h-3.5 w-3.5" />
            {badge}
          </div>
        )}

        {/* Icon on image */}
        <div className="absolute bottom-4 left-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg backdrop-blur-sm ${
              option.color === 'primary'
                ? 'bg-primary-500/90'
                : option.color === 'secondary'
                  ? 'bg-secondary-500/90'
                  : 'bg-neutral-700/90'
            }`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Subtitle */}
        <p
          className={`mb-1 text-sm font-medium ${
            option.color === 'primary'
              ? 'text-primary-900'
              : option.color === 'secondary'
                ? 'text-secondary-800'
                : 'text-neutral-700'
          }`}
        >
          {subtitle}
        </p>

        {/* Title */}
        <h3 className="mb-2 text-xl font-bold text-neutral-900">{title}</h3>

        {/* Description */}
        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted">{description}</p>

        {/* Features */}
        <div className="mb-4 flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <span
              key={index}
              className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-800"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`flex items-center gap-2 font-semibold transition-all group-hover:gap-3 ${
            option.color === 'primary'
              ? 'text-primary-900'
              : option.color === 'secondary'
                ? 'text-secondary-800'
                : 'text-neutral-700'
          }`}
        >
          {cta}
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </motion.div>
  );

  // Different wrappers based on action type
  if (option.id === 'matching') {
    // Quiz statt Matching-Wizard
    return (
      <Link href="/quiz" className="block h-full">
        {cardContent}
      </Link>
    );
  }

  if (option.id === 'triage') {
    return (
      <Link href="/triage" className="block h-full">
        {cardContent}
      </Link>
    );
  }

  // Search - link to therapists page
  return (
    <Link href="/therapists" className="block h-full">
      {cardContent}
    </Link>
  );
}
