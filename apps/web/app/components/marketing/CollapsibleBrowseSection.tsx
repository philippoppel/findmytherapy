'use client';

import { useState } from 'react';
import { ChevronDown, Sparkles, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { TherapistDirectory } from '../../therapists/TherapistDirectorySimplified';
import type { TherapistCard } from '../../therapists/types';

interface CollapsibleBrowseSectionProps {
  therapists: TherapistCard[];
  structuredData: object;
}

export function CollapsibleBrowseSection({
  therapists,
  structuredData,
}: CollapsibleBrowseSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="therapist-list" className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex w-full items-center justify-between rounded-2xl border border-neutral-200/60 bg-white/80 px-6 py-5 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl sm:px-8 sm:py-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-bold text-neutral-900 sm:text-xl">
                Passende Therapeut:innen finden
              </h2>
              <p className="text-sm text-muted sm:text-base">
                Alle {therapists.length} Profile durchsuchen
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </button>

        {/* Expandable Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-6 rounded-3xl border border-neutral-200/60 bg-white/80 p-4 shadow-xl backdrop-blur-sm sm:p-6 lg:p-8">
                {/* Info Banner */}
                <div className="mb-6 flex flex-col items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-muted sm:flex-row sm:items-center sm:gap-4">
                  <Users className="h-5 w-5 flex-shrink-0 text-primary-600" />
                  <span className="leading-relaxed">
                    Alle Profile aus unserem kuratierten Netzwerk. Filter aktualisieren die
                    Ergebnisse in Echtzeit.
                  </span>
                </div>

                {/* Directory Component */}
                <TherapistDirectory therapists={therapists} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Structured Data for Therapist Directory */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </section>
  );
}
