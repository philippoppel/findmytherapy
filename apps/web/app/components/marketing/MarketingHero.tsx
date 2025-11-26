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
        {/* Top section: Headline + CTA */}
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

          <Reveal delay={260}>
            {/* ÖBVP Trust Badge - stays above video */}
            <div className="mt-6 sm:mt-8 flex justify-center">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-primary-100 shadow-sm">
                <Image
                  src="/images/oebvp.png"
                  alt="ÖBVP"
                  width={80}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
                <span className="text-xs sm:text-sm text-muted font-medium">
                  Empfohlen vom ÖBVP
                </span>
              </div>
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

            {/* Center - Video with CTAs overlay */}
            <div className="flex-shrink-0 relative">
              <div className="w-[300px] lg:w-[380px] xl:w-[440px] opacity-80">
                <HeroVideoPlayer posterSrc={content.image.src} />
              </div>
              {/* CTAs on video - PROMINENT */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10">
                {/* Primary CTA - Big and Bold with entrance animation */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative"
                  initial={{ scale: 0, opacity: 0, y: 50 }}
                  animate={{
                    scale: [0, 1.2, 0.95, 1.05, 1],
                    opacity: 1,
                    y: 0,
                    boxShadow: [
                      '0 0 20px rgba(139, 92, 246, 0.3)',
                      '0 0 50px rgba(139, 92, 246, 0.6)',
                      '0 0 20px rgba(139, 92, 246, 0.3)',
                    ]
                  }}
                  transition={{
                    scale: { duration: 0.8, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] },
                    opacity: { duration: 0.3, delay: 0.5 },
                    y: { duration: 0.5, delay: 0.5 },
                    boxShadow: { duration: 2, repeat: Infinity, delay: 1.3 }
                  }}
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-3xl blur-xl opacity-60 animate-pulse" />
                  <Button
                    asChild
                    size="lg"
                    className="relative min-h-[64px] lg:min-h-[72px] px-12 lg:px-16 justify-center text-xl lg:text-2xl font-extrabold shadow-2xl transition-all duration-200 hover:-translate-y-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600"
                  >
                    <MatchingLink href={content.primaryCta.href}>{content.primaryCta.label}</MatchingLink>
                  </Button>
                </motion.div>

                {/* Secondary CTA - Also prominent */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={content.secondaryCta.href}
                    className="inline-flex items-center gap-3 rounded-full border-3 border-white bg-white px-8 py-4 text-base lg:text-lg font-bold text-primary-700 shadow-2xl backdrop-blur-sm transition-all hover:bg-primary-50 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)]"
                  >
                    {content.secondaryCta.label}
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
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
            {/* Video with CTAs overlay on mobile */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-[260px] sm:w-[300px] opacity-80">
                  <HeroVideoPlayer posterSrc={content.image.src} />
                </div>
                {/* CTAs on video - mobile - PROMINENT */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                  {/* Primary CTA with entrance animation */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative"
                    initial={{ scale: 0, opacity: 0, y: 40 }}
                    animate={{
                      scale: [0, 1.2, 0.95, 1.05, 1],
                      opacity: 1,
                      y: 0,
                      boxShadow: [
                        '0 0 15px rgba(139, 92, 246, 0.3)',
                        '0 0 40px rgba(139, 92, 246, 0.6)',
                        '0 0 15px rgba(139, 92, 246, 0.3)',
                      ]
                    }}
                    transition={{
                      scale: { duration: 0.8, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] },
                      opacity: { duration: 0.3, delay: 0.5 },
                      y: { duration: 0.5, delay: 0.5 },
                      boxShadow: { duration: 2, repeat: Infinity, delay: 1.3 }
                    }}
                  >
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-2xl blur-xl opacity-60 animate-pulse" />
                    <Button
                      asChild
                      size="lg"
                      className="relative min-h-[56px] px-10 justify-center text-lg font-extrabold shadow-2xl bg-gradient-to-r from-primary-600 to-primary-700"
                    >
                      <MatchingLink href={content.primaryCta.href}>{content.primaryCta.label}</MatchingLink>
                    </Button>
                  </motion.div>

                  {/* Secondary CTA */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={content.secondaryCta.href}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-6 py-3 text-sm font-bold text-primary-700 shadow-2xl"
                    >
                      {content.secondaryCta.label}
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
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

        {/* Bottom section: Scroll indicator */}
        <div className="flex-shrink-0 pb-4 sm:pb-6 flex justify-center">
          <HeroScrollIndicator />
        </div>
      </div>
    </section>
  );
}
