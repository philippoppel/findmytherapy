'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Reveal } from './Reveal';
import { usePrefersReducedMotion } from '../usePrefersReducedMotion';
import { getTeamContent } from '../../marketing-content';
import { useTranslation } from '@/lib/i18n';

export function AboutSection() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { language } = useTranslation();
  const teamContent = getTeamContent(language);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Verifizierte Expert:innen',
      description: 'Alle Therapeut:innen werden sorgfältig geprüft und verifiziert.',
      color: 'primary',
    },
    {
      icon: HeartIcon,
      title: 'Mit Empathie entwickelt',
      description: 'Von Menschen für Menschen - mit echtem Verständnis für mentale Gesundheit.',
      color: 'secondary',
    },
    {
      icon: LockIcon,
      title: 'DSGVO-konform',
      description: 'Deine Daten bleiben in der EU. Volle Transparenz und Kontrolle.',
      color: 'primary',
    },
    {
      icon: SparklesIcon,
      title: 'Wissenschaftlich fundiert',
      description: 'Basierend auf evidenzbasierten Methoden und aktueller Forschung.',
      color: 'secondary',
    },
  ];
  const missionHighlights = [
    'Psychotherapeutische Expertise & klinische Erfahrung',
    'Digitale Produktentwicklung & Forschung verbunden',
    'Partnerschaften mit Praxen, Kliniken & Selbsthilfegruppen',
  ];
  const trustBadges = [
    { label: 'PHQ-9 & GAD-7 validiert', description: 'Evidenzbasierte Ersteinschätzung' },
    { label: 'DSGVO-Konform (EU)', description: 'Transparenter Umgang mit Daten' },
    { label: 'Partner:innen aus Praxis & Forschung', description: 'Gemeinsam mit der Community' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 sm:py-24 lg:py-32"
    >
      {/* Background decorations */}
      {!prefersReducedMotion ? (
        <>
          <motion.div
            aria-hidden
            style={{ y, opacity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.05),_transparent_60%)]"
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/3 top-20 h-72 w-72 rounded-full bg-gradient-to-r from-primary-200/30 to-secondary-200/30 blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.05),_transparent_60%)]"
        />
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="mb-16 text-center">
          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 px-5 py-2.5 text-sm font-medium text-default shadow-sm">
              <UsersIcon className="h-4 w-4 text-primary-600" />
              <span>Über uns</span>
            </div>
          </div>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-default sm:text-5xl">
            {teamContent.heading}
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">
            {teamContent.description}
          </p>
        </Reveal>

        {/* Team Members */}
        <div className="mb-20 space-y-16">
          <Reveal delay={100}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {teamContent.members.map((member, index) => (
                <motion.article
                  key={member.name}
                  className="group overflow-hidden rounded-[32px] border border-white/40 bg-surface-1 shadow-2xl shadow-primary-700/5"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  whileHover={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: 1.02,
                          y: -6,
                        }
                  }
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={`Portrait von ${member.name}, ${member.role[language] ?? member.role.de} bei FindMyTherapy`}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                  <div className="border-t border-divider bg-surface-1 p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-primary-600">
                      Founder Team
                    </p>
                    <p className="mt-2 text-xl font-semibold text-default">{member.name}</p>
                    <p className="text-sm font-medium text-muted">
                      {member.role[language] ?? member.role.de}
                    </p>
                    <p
                      className="mt-2 text-sm leading-relaxed text-muted"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {member.focus[language] ?? member.focus.de}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal delay={150}>
              <div className="h-full rounded-3xl border border-primary-100/70 bg-surface-1/95 p-8 shadow-xl">
                <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1 text-sm font-medium text-primary-700">
                  <SparklesIcon className="h-4 w-4 text-primary-500" /> Unsere Mission
                </p>
                <h3 className="mb-4 text-2xl font-bold text-default sm:text-3xl">
                  Jede:r soll Zugang zu qualifizierter Unterstützung bekommen.
                </h3>
                <p className="mb-6 text-base leading-relaxed text-muted sm:text-lg">
                  Wir verbinden evidenzbasiertes Wissen mit verifizierten Therapeut:innen und einer
                  Plattform, die Orientierung schafft – vom ersten Symptom bis zum Termin.
                </p>
                <ul className="space-y-3">
                  {missionHighlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3 text-sm text-muted">
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                        ✓
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="h-full rounded-3xl border border-primary-100/70 bg-gradient-to-br from-secondary-50 via-surface-1 to-primary-50 p-8 shadow-xl shadow-secondary-200/40">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-secondary-600">
                  Vertrauen
                </p>
                <div className="space-y-5">
                  {trustBadges.map((badge, index) => (
                    <motion.div
                      key={badge.label}
                      className="rounded-2xl border border-white/70 bg-surface-1/70 p-4"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                    >
                      <p className="text-base font-semibold text-default">{badge.label}</p>
                      <p className="text-sm text-muted">{badge.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={250}>
              <div className="h-full rounded-3xl border border-neutral-700/80 bg-neutral-800 p-8 text-white shadow-2xl shadow-neutral-800/40">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
                  Lass uns verbinden
                </p>
                <p className="mb-6 text-2xl font-bold">
                  Wir tauschen uns regelmäßig mit Partner:innen aus Praxis & Forschung aus.
                </p>
                <p className="mb-6 text-sm text-white/80">
                  Schreibe uns, wenn du mitgestalten möchtest – egal ob Therapeut:in,
                  Kooperationspartner oder Institution.
                </p>
                <div className="flex flex-wrap gap-3">
                  {teamContent.ctas?.map((cta) => (
                    <a
                      key={cta.href}
                      href={cta.href}
                      className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:border-white hover:bg-white/10"
                    >
                      <span>{cta.label}</span>
                      <ArrowUpRightIcon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Values Grid */}
        <Reveal delay={300}>
          <h3 className="mb-12 text-center text-3xl font-bold text-default">Unsere Werte</h3>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="group rounded-2xl border border-primary-100/60 bg-surface-1/80 p-6 backdrop-blur-sm transition-all hover:border-primary-200 hover:shadow-xl hover:shadow-primary-100/50"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={!prefersReducedMotion ? { y: -8, scale: 1.02 } : {}}
            >
              <motion.div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                  value.color === 'primary' ? 'bg-primary-100' : 'bg-secondary-100'
                } group-hover:${value.color === 'primary' ? 'bg-primary-200' : 'bg-secondary-200'}`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <value.icon
                  className={`h-6 w-6 ${
                    value.color === 'primary' ? 'text-primary-600' : 'text-secondary-600'
                  }`}
                />
              </motion.div>
              <h4 className="mb-2 text-lg font-semibold text-default">{value.title}</h4>
              <p className="text-sm leading-relaxed text-muted">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 7l-10 10m0-10h10v10"
      />
    </svg>
  );
}
