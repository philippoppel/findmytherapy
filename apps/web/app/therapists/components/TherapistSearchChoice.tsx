'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, ClipboardCheck, Search, Sparkles, ArrowRight } from 'lucide-react';
import { usePrefersReducedMotion } from '@/app/components/usePrefersReducedMotion';
import { MatchingLink } from '@/app/components/matching/MatchingLink';

const searchOptions = [
  {
    id: 'matching',
    title: 'Sag uns, was los ist',
    subtitle: 'Geführte Suche',
    description: 'Wir helfen dir herauszufinden, welche Therapie zu dir passt',
    badge: 'Empfohlen',
    badgeIcon: Sparkles,
    icon: Compass,
    image: '/images/search/matching-hero.jpg',
    cta: 'Los geht\'s',
    color: 'primary',
    features: ['Bildbasierte Auswahl', 'Personalisierte Empfehlungen', 'Match-Prozente'],
  },
  {
    id: 'triage',
    title: 'Bin ich hier richtig?',
    subtitle: 'Wissenschaftliche Einschätzung',
    description: 'Validierte Fragebögen helfen dir, deine Situation einzuordnen',
    icon: ClipboardCheck,
    image: '/images/search/triage-hero.jpg',
    cta: 'Test starten',
    color: 'secondary',
    features: ['PHQ-9 & GAD-7', 'Ampel-Visualisierung', 'Sofort-Ergebnis'],
  },
  {
    id: 'search',
    title: 'Ich weiß, was ich suche',
    subtitle: 'Direkte Suche',
    description: 'Filter nach deinen Kriterien und finde passende Therapeut:innen',
    icon: Search,
    image: '/images/search/suche-hero.jpg',
    cta: 'Suche öffnen',
    color: 'neutral',
    features: ['Alle Filter', 'Sofortergebnisse', 'Volle Kontrolle'],
  },
];

export function TherapistSearchChoice() {
  const prefersReducedMotion = usePrefersReducedMotion();

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
            Wie möchtest du suchen?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            Finde die richtige Therapie für dich – auf dem Weg, der zu dir passt
          </p>
        </motion.div>

        {/* Three Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {searchOptions.map((option, index) => (
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
          Nicht sicher? Die geführte Suche ist für die meisten der beste Einstieg.
        </motion.p>
      </div>
    </section>
  );
}

function SearchCard({
  option,
  prefersReducedMotion,
}: {
  option: (typeof searchOptions)[0];
  prefersReducedMotion: boolean;
}) {
  const Icon = option.icon;
  const BadgeIcon = option.badgeIcon;

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
          alt={option.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Badge (only for matching) */}
        {option.badge && BadgeIcon && (
          <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-primary-700 shadow-lg backdrop-blur-sm">
            <BadgeIcon className="h-3.5 w-3.5" />
            {option.badge}
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
              ? 'text-primary-600'
              : option.color === 'secondary'
                ? 'text-secondary-600'
                : 'text-neutral-500'
          }`}
        >
          {option.subtitle}
        </p>

        {/* Title */}
        <h3 className="mb-2 text-xl font-bold text-neutral-900">{option.title}</h3>

        {/* Description */}
        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted">{option.description}</p>

        {/* Features */}
        <div className="mb-4 flex flex-wrap gap-2">
          {option.features.map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`flex items-center gap-2 font-semibold transition-all group-hover:gap-3 ${
            option.color === 'primary'
              ? 'text-primary-600'
              : option.color === 'secondary'
                ? 'text-secondary-600'
                : 'text-neutral-700'
          }`}
        >
          {option.cta}
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </motion.div>
  );

  // Different wrappers based on action type
  if (option.id === 'matching') {
    return <MatchingLink className="block h-full">{cardContent}</MatchingLink>;
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
