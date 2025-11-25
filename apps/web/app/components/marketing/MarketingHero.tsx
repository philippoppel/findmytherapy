'use client';

import Link from 'next/link';
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
      className="relative h-[90vh] min-h-[700px] max-h-[1000px] overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-25 via-white to-primary-50/70" />

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
            <div className="mt-6 sm:mt-8 flex flex-col items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                {/* Glow effect behind button */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <Button
                  asChild
                  size="lg"
                  className="relative w-full sm:w-auto min-h-[56px] px-10 sm:px-12 justify-center text-lg sm:text-xl font-bold shadow-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-0"
                >
                  <MatchingLink href={content.primaryCta.href}>{content.primaryCta.label}</MatchingLink>
                </Button>
              </motion.div>

              <Link
                href={content.secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary-300 bg-white/80 px-6 py-2.5 text-sm font-semibold text-primary-800 shadow-sm backdrop-blur-sm transition-all hover:border-primary-400 hover:bg-primary-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                {content.secondaryCta.label}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Middle section: Video + Topic Cards - Asymmetric Layout */}
        <div className="flex-1 min-h-0 mt-10 sm:mt-14 lg:mt-16 px-4 lg:px-6 xl:px-8">
          {/* Desktop: Asymmetric staggered grid */}
          <div className="hidden md:flex justify-center items-center gap-4 lg:gap-6 xl:gap-8 h-full max-w-6xl mx-auto">
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

            {/* Center - Video */}
            <div className="flex-shrink-0">
              <div className="w-[240px] lg:w-[280px] xl:w-[320px]">
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
            {/* Video first on mobile */}
            <div className="flex justify-center mb-4">
              <div className="w-[240px] sm:w-[280px]">
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

        {/* Bottom section: Scroll indicator */}
        <div className="flex-shrink-0 pb-4 sm:pb-6 flex justify-center">
          <HeroScrollIndicator />
        </div>
      </div>
    </section>
  );
}
