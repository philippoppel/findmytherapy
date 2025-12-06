'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Globe,
  Search,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Users,
  Shield,
} from 'lucide-react';
import { Reveal } from '../components/marketing/Reveal';
import { teamContent } from '../components/marketing-content';
import { BackLink } from '../components/BackLink';
import { useTranslation } from '@/lib/i18n';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ForTherapistsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Back Link */}
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <BackLink />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Text Content */}
            <Reveal>
              <div className="text-center lg:text-left">
                <motion.div
                  className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-800"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles className="h-4 w-4" />
                  {t('forTherapists.badge')}
                </motion.div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                  {t('forTherapists.heading')}
                </h1>

                <p className="mb-8 text-lg text-muted sm:text-xl lg:max-w-xl">
                  {t('forTherapists.tagline')}
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                  <Link href="/register">
                    <motion.span
                      className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary-600/30 transition-colors hover:bg-primary-700"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t('forTherapists.startFreeCta')}
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Hero Image */}
            <Reveal delay={200}>
              <motion.div
                className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/images/for-therapists/hero.jpg"
                  alt={t('forTherapists.modernPractice')}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Science Callout */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <motion.div
              className="rounded-3xl border border-primary-200/60 bg-gradient-to-br from-primary-50 via-white to-primary-100/30 p-8 shadow-xl sm:p-12"
              whileHover={{ scale: 1.01 }}
            >
              <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
                {/* 75% Stat */}
                <div className="text-center">
                  <motion.div
                    className="mb-4 text-6xl font-bold text-primary-600 sm:text-7xl"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    75%
                  </motion.div>
                  <p className="text-lg font-medium text-neutral-800">
                    {t('forTherapists.judgeCredibility')}
                  </p>
                  <a
                    href="https://credibility.stanford.edu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-primary-600 hover:underline"
                  >
                    Stanford Web Credibility Study →
                  </a>
                </div>

                {/* 50ms Stat */}
                <div className="text-center">
                  <motion.div
                    className="mb-4 text-6xl font-bold text-primary-600 sm:text-7xl"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  >
                    50ms
                  </motion.div>
                  <p className="text-lg font-medium text-neutral-800">
                    {t('forTherapists.firstImpression')}
                  </p>
                  <span className="mt-2 inline-block text-sm text-muted">
                    Lindgaard et al., 2006
                  </span>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 sm:text-4xl">
              {t('forTherapists.whyFindMyTherapy')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              {t('forTherapists.threeReasons')}
            </p>
          </Reveal>

          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Benefit 1: Microsite */}
            <motion.div variants={fadeInUp}>
              <div className="group h-full overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/for-therapists/microsite.jpg"
                    alt={t('forTherapists.professionalWebsite')}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 shadow-lg">
                      <Globe className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-neutral-900">{t('forTherapists.ownMicrosite')}</h3>
                  <p className="text-muted">findmytherapy.net/t/[ihr-name]</p>
                </div>
              </div>
            </motion.div>

            {/* Benefit 2: SEO */}
            <motion.div variants={fadeInUp}>
              <div className="group h-full overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/for-therapists/seo.jpg"
                    alt={t('forTherapists.seoVisibility')}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 shadow-lg">
                      <Search className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-neutral-900">{t('forTherapists.seoOptimized')}</h3>
                  <p className="text-muted">{t('forTherapists.foundOnGoogle')}</p>
                </div>
              </div>
            </motion.div>

            {/* Benefit 3: Knowledge Platform */}
            <motion.div variants={fadeInUp}>
              <div className="group h-full overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/for-therapists/knowledge.jpg"
                    alt={t('forTherapists.knowledgePlatform')}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 shadow-lg">
                      <BookOpen className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-neutral-900">{t('forTherapists.knowledgePlatform')}</h3>
                  <p className="text-muted">{t('forTherapists.clientsInformed')}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Microsite Showcase */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Mockup */}
            <Reveal>
              <motion.div
                className="relative rounded-3xl border border-neutral-200/60 bg-white/80 p-4 shadow-2xl backdrop-blur-sm sm:p-6"
                whileHover={{ scale: 1.02, rotate: -1 }}
              >
                {/* Browser Chrome */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 rounded-lg bg-neutral-100 px-4 py-2 text-sm text-neutral-600">
                    findmytherapy.net/t/<span className="text-primary-600">[ihr-name]</span>
                  </div>
                </div>
                {/* Website Preview */}
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50">
                  <div className="h-full p-6">
                    <div className="mb-4 h-16 w-16 rounded-full bg-primary-200" />
                    <div className="mb-2 h-6 w-48 rounded bg-neutral-300" />
                    <div className="mb-4 h-4 w-32 rounded bg-neutral-200" />
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-neutral-200" />
                      <div className="h-3 w-3/4 rounded bg-neutral-200" />
                      <div className="h-3 w-5/6 rounded bg-neutral-200" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reveal>

            {/* Features */}
            <Reveal delay={200}>
              <div>
                <h2 className="mb-6 text-3xl font-bold text-neutral-900 sm:text-4xl">
                  {t('forTherapists.yourPersonalMicrosite')}
                </h2>
                <p className="mb-8 text-lg text-muted">
                  {t('forTherapists.micrositeDesc')}
                </p>

                <motion.div
                  className="space-y-4"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    { icon: TrendingUp, text: t('forTherapists.seoMaxVisibility') },
                    { icon: Users, text: t('forTherapists.professionalPresentation') },
                    { icon: Shield, text: t('forTherapists.gdprSecure') },
                    { icon: Sparkles, text: t('forTherapists.fullyCustomizable') },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className="flex items-center gap-4 rounded-xl bg-white/60 p-4 backdrop-blur-sm"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                        <item.icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <span className="font-medium text-neutral-800">{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 sm:text-4xl">
              {t('forTherapists.byTherapistsForTherapists')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted">
              {t('forTherapists.teamDescription')}
            </p>
          </Reveal>

          <motion.div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {teamContent.members.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeInUp}
                className="group text-center"
              >
                <motion.div
                  className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
                <h3 className="mb-1 font-semibold text-neutral-900">{member.name}</h3>
                <p className="text-sm text-primary-600">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Knowledge Platform Differentiator */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <motion.div
              className="rounded-3xl border border-secondary-200/60 bg-gradient-to-br from-secondary-50 via-white to-secondary-100/30 p-8 shadow-xl sm:p-12"
              whileHover={{ scale: 1.01 }}
            >
              <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary-100 px-4 py-2 text-sm font-medium text-secondary-800">
                    <BookOpen className="h-4 w-4" />
                    {t('forTherapists.moreThanDirectory')}
                  </div>
                  <h2 className="mb-4 text-3xl font-bold text-neutral-900">
                    {t('forTherapists.peerReviewPlatform')}
                  </h2>
                  <p className="mb-6 text-muted">
                    {t('forTherapists.clientsComeInformed')}
                  </p>
                  <ul className="space-y-3">
                    {[
                      t('forTherapists.peerReviewedContent'),
                      t('forTherapists.clientsBetterPrepared'),
                      t('forTherapists.shareExpertise'),
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-secondary-600" />
                        <span className="text-neutral-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src="/images/for-therapists/knowledge.jpg"
                    alt="Wissensplattform"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <motion.div
              className="rounded-3xl border border-primary-200/60 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-8 text-center shadow-2xl sm:p-12"
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                {t('forTherapists.startFreeToday')}
              </h2>
              <p className="mb-8 text-lg text-white/90">
                {t('forTherapists.noCreditCard')}
              </p>
              <Link href="/register">
                <motion.span
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-primary-700 shadow-lg transition-colors hover:bg-primary-50"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('forTherapists.registerNow')}
                  <ArrowRight className="h-5 w-5" />
                </motion.span>
              </Link>
              <div className="mt-6">
                <Link
                  href="/"
                  className="text-white/80 transition-colors hover:text-white hover:underline"
                >
                  {t('forTherapists.backToHome')}
                </Link>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
