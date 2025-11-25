'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { HeroTopic } from './heroTopicsConfig';

interface HeroTopicCardProps {
  topic: HeroTopic;
  index: number;
  isMobile?: boolean;
}

export function HeroTopicCard({ topic, index, isMobile = false }: HeroTopicCardProps) {
  const prefersReducedMotion = useReducedMotion();

  // Floating animation configuration - elegant, gentle movement
  const floatingAnimation = prefersReducedMotion
    ? {}
    : {
        y: [0, -topic.animation.yOffset * 1.2, 0, topic.animation.yOffset * 0.8, 0],
        x: [0, topic.animation.xOffset * 0.5, 0, -topic.animation.xOffset * 0.3, 0],
        rotate: [0, topic.animation.rotateRange * 1.2, 0, -topic.animation.rotateRange, 0],
        scale: [1, 1.02, 1, 0.99, 1],
      };

  const floatingTransition = {
    duration: topic.animation.duration,
    repeat: Infinity,
    ease: 'easeInOut' as const,
    delay: topic.animation.delay,
    times: [0, 0.25, 0.5, 0.75, 1],
  };

  // Hover animation - interactive and engaging
  const hoverAnimation = prefersReducedMotion
    ? { opacity: 0.95 }
    : {
        scale: 1.08,
        y: -8,
        rotate: 0,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
      };

  // Entrance animation variants
  const entranceVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 25,
        delay: index * 0.08,
      },
    },
  };

  const MotionLink = motion.create(Link);

  // Different rotation for visual interest
  const rotation = index % 2 === 0 ? '-2deg' : '2deg';

  return (
    <MotionLink
      href={topic.targetSection}
      className={`
        group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-2xl block
        ${isMobile ? 'flex-shrink-0 w-32 h-40' : 'w-36 h-44 lg:w-40 lg:h-48 xl:w-44 xl:h-52'}
      `}
      style={{ transform: `rotate(${rotation})` }}
      variants={entranceVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverAnimation}
      whileFocus={hoverAnimation}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      aria-label={`Mehr erfahren: ${topic.label}`}
    >
      {/* Floating wrapper */}
      <motion.div
        className="relative h-full w-full"
        animate={floatingAnimation}
        transition={floatingTransition}
      >
        {/* Glass card container */}
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-lg backdrop-blur-sm transition-shadow duration-300 group-hover:shadow-xl">
          {/* Image section */}
          <div className="relative h-3/4 overflow-hidden">
            <Image
              src={topic.imageSrc}
              alt={topic.imageAlt}
              fill
              sizes={isMobile ? '128px' : '(min-width: 1280px) 176px, (min-width: 1024px) 160px, 144px'}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority={index < 4}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          </div>

          {/* Label section */}
          <div className="absolute bottom-0 inset-x-0 p-2 lg:p-3">
            <span className="inline-flex items-center justify-center w-full rounded-full bg-white/95 px-3 py-1.5 text-xs lg:text-sm font-semibold text-neutral-800 shadow-sm transition-colors duration-200 group-hover:bg-primary-50 group-hover:text-primary-900">
              {topic.label}
            </span>
          </div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary-200/30 via-transparent to-secondary-200/20 pointer-events-none" />
        </div>
      </motion.div>
    </MotionLink>
  );
}
