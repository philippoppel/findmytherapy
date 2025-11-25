'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface HeroVideoPlayerProps {
  posterSrc?: string;
}

export function HeroVideoPlayer({ posterSrc }: HeroVideoPlayerProps) {
  const prefersReducedMotion = useReducedMotion();

  const hoverAnimation = prefersReducedMotion
    ? {}
    : {
        scale: 1.02,
        rotate: -0.5,
      };

  return (
    <motion.div
      className="relative mx-auto w-full max-w-sm lg:max-w-md xl:max-w-lg aspect-[9/16] rounded-3xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 20,
        delay: 0.2,
      }}
      whileHover={hoverAnimation}
    >
      {/* Glassmorphism frame */}
      <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl shadow-2xl" />

      {/* Inner border glow */}
      <div className="absolute inset-0 rounded-3xl border-2 border-white/50 shadow-[inset_0_0_30px_rgba(255,255,255,0.3)]" />

      {/* Video container */}
      <div className="relative h-full w-full rounded-3xl overflow-hidden bg-neutral-100">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
          className="h-full w-full object-cover"
          title="Geführter Start: Sag uns, was los ist"
          aria-label="Kurzer Einblick in den geführten Einstieg zur Psychotherapie"
        >
          <source src="/videos/hero-therapy.mp4" type="video/mp4" />
          Dein Browser unterstützt keine Videos.
        </video>

        {/* Bottom gradient overlay with text */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 lg:p-6">
          <p className="text-white/90 text-sm lg:text-base font-medium">
            30 Sekunden bis zur passenden Therapie
          </p>
        </div>
      </div>

      {/* Decorative floating elements */}
      <motion.div
        className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary-200 to-primary-300 opacity-60 blur-sm"
        animate={
          prefersReducedMotion
            ? {}
            : {
                y: [0, -8, 0],
                scale: [1, 1.1, 1],
              }
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-br from-secondary-200 to-secondary-300 opacity-50 blur-sm"
        animate={
          prefersReducedMotion
            ? {}
            : {
                y: [0, 6, 0],
                scale: [1, 0.9, 1],
              }
        }
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
    </motion.div>
  );
}
