'use client';

import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../usePrefersReducedMotion';

export function TherapistAmbientGlow() {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-white via-teal-50/40 to-surface"
      />
    );
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-20 top-[-10%] h-72 w-72 rounded-full bg-teal-300/25 blur-3xl"
        animate={{ x: [-10, 20, -10], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-5%] bottom-[-10%] h-80 w-80 rounded-full bg-primary-400/25 blur-3xl"
        animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
