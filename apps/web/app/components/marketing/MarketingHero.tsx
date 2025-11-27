'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@mental-health/ui';
import type { heroContent } from '../../marketing-content';
import { Reveal } from './Reveal';
import { MatchingLink } from '../matching/MatchingLink';
import { HeroTopicCard } from './HeroTopicCard';
import { HeroVideoPlayer } from './HeroVideoPlayer';
import { HeroScrollIndicator } from './HeroScrollIndicator';
import { heroTopics } from './heroTopicsConfig';

// Partner/Unterstützer Logos
const partnerLogos = [
  { src: '/images/oebvp.png', alt: 'ÖBVP - Österreichischer Bundesverband für Psychotherapie', name: 'ÖBVP' },
  { src: '/images/sfu.svg', alt: 'SFU - Sigmund Freud Privatuniversität', name: 'SFU' },
  { src: '/images/voepp.png', alt: 'VÖPP - Vereinigung Österreichischer Psychotherapeut:innen', name: 'VÖPP' },
  { src: '/images/2min2mil.png', alt: '2 Minuten 2 Millionen', name: '2 Minuten 2 Millionen' },
];

interface HeroProps {
  content: typeof heroContent;
}

export function MarketingHero({ content }: HeroProps) {
  return (
    <section
      className="relative min-h-[800px] pb-8"
      aria-labelledby="hero-heading"
    >
      {/* Ambient blur effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          aria-hidden
          className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-secondary-200/30 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute left-1/4 bottom-20 h-64 w-64 rounded-full bg-primary-100/50 blur-3xl"
        />
      </div>

      {/* Main content container */}
      <div className="relative h-full flex flex-col">
        {/* Top section: Headline + CTAs (ÜBER den Bildern) */}
        <div className="flex-shrink-0 pt-6 sm:pt-8 lg:pt-10 px-4 text-center z-10">
          <Reveal delay={80}>
            <h1
              id="hero-heading"
              className="text-balance text-3xl font-semibold leading-tight tracking-tight text-default sm:text-4xl lg:text-5xl xl:text-6xl"
            >
              {content.title}
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed text-muted">
              {content.highlight}
            </p>
          </Reveal>

          {/* CTAs - ÜBER den Bildern */}
          <Reveal delay={260}>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
              {/* Primary CTA - Los geht's */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="relative"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
                <Button
                  asChild
                  size="lg"
                  className="relative min-h-[56px] lg:min-h-[64px] px-10 lg:px-14 justify-center text-lg lg:text-xl font-extrabold shadow-2xl transition-all duration-200 hover:-translate-y-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600"
                >
                  <MatchingLink href={content.primaryCta.href}>{content.primaryCta.label}</MatchingLink>
                </Button>
              </motion.div>

              {/* Secondary CTA - Ich weiß schon was ich suche */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={content.secondaryCta.href}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-primary-200 bg-white px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base font-bold text-primary-700 shadow-lg backdrop-blur-sm transition-all hover:bg-primary-50 hover:border-primary-300 hover:shadow-xl"
                >
                  {content.secondaryCta.label}
                  <svg className="h-4 w-4 lg:h-5 lg:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </Reveal>
        </div>

        {/* Middle section: Video + Topic Cards - Asymmetric Layout */}
        <div className="flex-1 min-h-0 mt-10 sm:mt-14 lg:mt-16 px-2">
          {/* Desktop: Asymmetric staggered grid */}
          <div className="hidden md:flex justify-center items-center gap-6 lg:gap-10 xl:gap-12 h-full max-w-[1600px] mx-auto">
            {/* Left side - 2x2 staggered grid */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <div className="pt-8">
                <HeroTopicCard topic={heroTopics[0]} index={0} />
              </div>
              <div className="pt-0">
                <HeroTopicCard topic={heroTopics[1]} index={1} />
              </div>
              <div className="pt-0">
                <HeroTopicCard topic={heroTopics[2]} index={2} />
              </div>
              <div className="-mt-8">
                <HeroTopicCard topic={heroTopics[3]} index={3} />
              </div>
            </div>

            {/* Center - Video (ohne CTAs - die sind jetzt oben) */}
            <div className="flex-shrink-0">
              <div className="w-[300px] lg:w-[380px] xl:w-[440px]">
                <HeroVideoPlayer posterSrc={content.image.src} />
              </div>
            </div>

            {/* Right side - 2x2 staggered grid */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <div className="pt-0">
                <HeroTopicCard topic={heroTopics[4]} index={4} />
              </div>
              <div className="pt-12">
                <HeroTopicCard topic={heroTopics[5]} index={5} />
              </div>
              <div className="-mt-8">
                <HeroTopicCard topic={heroTopics[6]} index={6} />
              </div>
              <div className="pt-0">
                <HeroTopicCard topic={heroTopics[7]} index={7} />
              </div>
            </div>
          </div>

          {/* Mobile: Horizontal scroll carousel */}
          <div className="md:hidden">
            {/* Video (ohne CTAs - die sind jetzt oben) */}
            <div className="flex justify-center mb-4">
              <div className="w-[260px] sm:w-[300px]">
                <HeroVideoPlayer posterSrc={content.image.src} />
              </div>
            </div>

            {/* Scrollable cards */}
            <motion.div
              className="overflow-x-auto scrollbar-hide -mx-4 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex gap-3 pb-4" style={{ width: 'max-content' }}>
                {heroTopics.map((topic, index) => (
                  <HeroTopicCard key={topic.id} topic={topic} index={index} isMobile />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Partner/Unterstützer Slider - UNTER den Bildern */}
        <div className="mt-10 sm:mt-14 px-4">
          <Reveal delay={400}>
            <div className="max-w-6xl mx-auto">
              <p className="text-center text-base sm:text-lg text-muted font-medium mb-8">
                Empfohlen & unterstützt von
              </p>
              {/* Logo Slider */}
              <div className="relative overflow-hidden py-2">
                <motion.div
                  className="flex items-center gap-10 sm:gap-16"
                  animate={{
                    x: ['0%', '-50%'],
                  }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: 'loop',
                      duration: 20,
                      ease: 'linear',
                    },
                  }}
                >
                  {/* Duplicate logos for seamless loop */}
                  {[...partnerLogos, ...partnerLogos].map((logo, index) => (
                    <div
                      key={`${logo.name}-${index}`}
                      className="flex-shrink-0 flex items-center justify-center px-6 py-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-primary-100/50 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={160}
                        height={70}
                        className="h-14 sm:h-16 lg:h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
                      />
                    </div>
                  ))}
                </motion.div>
                {/* Fade edges */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bottom section: Scroll indicator */}
        <div className="flex-shrink-0 pt-8 pb-4 sm:pb-6 flex justify-center">
          <HeroScrollIndicator />
        </div>
      </div>
    </section>
  );
}
