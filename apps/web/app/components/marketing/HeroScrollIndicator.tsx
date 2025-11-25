'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function HeroScrollIndicator() {
  const prefersReducedMotion = useReducedMotion();

  const handleClick = () => {
    const nextSection = document.querySelector('[data-section-after-hero]');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: scroll to first section with an id
      const firstSection = document.querySelector('section[id]');
      if (firstSection) {
        firstSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className="flex flex-col items-center gap-1.5 text-neutral-500 hover:text-primary-700 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg px-4 py-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      aria-label="Nach unten scrollen"
    >
      <span className="text-sm font-medium">Mehr entdecken</span>
      <motion.div
        animate={
          prefersReducedMotion
            ? {}
            : {
                y: [0, 6, 0],
              }
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </motion.button>
  );
}
