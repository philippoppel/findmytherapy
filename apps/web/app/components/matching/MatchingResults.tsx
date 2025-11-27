'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Star, X, RotateCcw, Heart, ArrowRight } from 'lucide-react';
import type { MatchResult } from '@/lib/matching';
import { useMatchingWizard } from './MatchingWizardContext';

// Warme Stockbilder von Unsplash (kostenlos & kommerziell nutzbar)
const STORY_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&q=80', // Person in Sonnenlicht
  divider1: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80', // Zwei Menschen im Gespräch
  divider2: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', // Freundschaft, Zusammenhalt
  footer: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80', // Weg/Pfad in Natur
};

// Score zu Prozent konvertieren
function getScorePercent(score: number) {
  return Math.round(score * 100);
}

// Vereinfachte Match-Card - emotional & clean
function EmotionalMatchCard({ match, rank, isTopMatch = false }: { match: MatchResult; rank: number; isTopMatch?: boolean }) {
  const percent = getScorePercent(match.score);

  // Initiale für Avatar
  const initials =
    match.therapist.displayName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';

  // Personalisierter Satz basierend auf Match-Gründen
  const personalizedReason = match.explanation.primary[0] || 'Passt gut zu deinen Bedürfnissen';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.15, duration: 0.5 }}
      className={`group bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${
        isTopMatch ? 'ring-2 ring-amber-300' : ''
      }`}
    >
      <div className={`p-6 sm:p-8 ${isTopMatch ? 'bg-gradient-to-br from-amber-50/50 to-orange-50/30' : ''}`}>
        {/* Therapeut Info */}
        <div className="flex items-center gap-4 sm:gap-5 mb-5">
          {/* Großes Foto */}
          <div className="relative flex-shrink-0">
            {match.therapist.profileImageUrl ? (
              <div className={`${isTopMatch ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-16 h-16 sm:w-20 sm:h-20'} rounded-full overflow-hidden ring-4 ring-white shadow-lg`}>
                <Image
                  src={match.therapist.profileImageUrl}
                  alt={match.therapist.displayName || 'Therapeut'}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className={`${isTopMatch ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-16 h-16 sm:w-20 sm:h-20'} rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center text-white font-bold ${isTopMatch ? 'text-2xl' : 'text-xl'} ring-4 ring-white shadow-lg`}>
                {initials}
              </div>
            )}
          </div>

          {/* Name & Score Badge */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-gray-900 mb-1 ${isTopMatch ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>
              {match.therapist.displayName || 'Therapeut:in'}
            </h3>
            {match.therapist.title && (
              <p className="text-sm text-gray-500 mb-2">
                {match.therapist.title}
              </p>
            )}
            {/* Match Score als schöner Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-md">
              <Star className="w-4 h-4" fill="white" />
              {percent}% Match
            </div>
          </div>
        </div>

        {/* Personalisierter Satz - nur 1-2 Zeilen */}
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 line-clamp-2">
          {personalizedReason}
        </p>

        {/* Ein Button */}
        <Link
          href={`/therapists/${match.therapist.id}`}
          className={`w-full flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 ${
            isTopMatch
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-200 text-base sm:text-lg'
              : 'bg-gradient-to-r from-gray-800 to-gray-700 shadow-gray-200 text-sm sm:text-base'
          }`}
        >
          <Eye className="w-5 h-5" />
          Profil ansehen
        </Link>
      </div>
    </motion.div>
  );
}

// Story Divider - Bild mit emotionalem Text
function StoryDivider({ image, text, delay = 0 }: { image: string; text: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="relative my-10 sm:my-16 rounded-3xl overflow-hidden"
    >
      <div className="relative h-48 sm:h-64">
        <Image
          src={image}
          alt={text}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-end justify-center pb-6 sm:pb-10 px-4">
          <p className="text-white text-center text-lg sm:text-2xl font-medium max-w-xl leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function MatchingResults() {
  const { results, showResults, closeWizard, openWizard } = useMatchingWizard();

  if (!showResults || !results) return null;

  const handleNewSearch = () => {
    openWizard();
  };

  const handleClose = () => {
    closeWizard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Therapeuten in Gruppen aufteilen für Story-Flow
  const topMatch = results.matches[0];
  const secondaryMatches = results.matches.slice(1, 3);
  const remainingMatches = results.matches.slice(3);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
        id="matching-results"
      >
        {/* Hero Section */}
        <div className="relative">
          <div className="relative h-[50vh] sm:h-[60vh] min-h-[400px]">
            <Image
              src={STORY_IMAGES.hero}
              alt="Hoffnung und Neubeginn"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-gray-900 hover:bg-white transition-all shadow-lg"
              aria-label="Schließen"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Hero Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-amber-600 font-medium text-sm sm:text-base mb-4 shadow-lg">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                  {results.total === 0
                    ? 'Wir suchen weiter für dich'
                    : `${results.total} ${results.total === 1 ? 'Therapeut:in' : 'Therapeut:innen'} gefunden`}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  {results.total === 0
                    ? 'Lass uns gemeinsam suchen'
                    : 'Deine Reise beginnt hier'}
                </h1>
                <p className="text-lg sm:text-xl text-white/90 max-w-lg mx-auto drop-shadow">
                  {results.total === 0
                    ? 'Wir helfen dir, die richtige Unterstützung zu finden'
                    : 'Menschen, die dir helfen können'}
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-gradient-to-b from-white via-amber-50/20 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

            {/* Keine Matches */}
            {results.matches.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="py-16 text-center"
              >
                <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12">
                  <p className="text-gray-600 text-lg mb-8">
                    Aktuell haben wir keine exakten Treffer, aber das bedeutet nicht,
                    dass es keine Hilfe gibt. Lass uns die Suche anpassen.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleNewSearch}
                      className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Suche anpassen
                    </button>
                    <Link
                      href="/therapists"
                      className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-amber-300 hover:bg-amber-50 transition-all"
                    >
                      Alle Therapeuten ansehen
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Story Flow mit Matches */}
            {results.matches.length > 0 && (
              <div className="py-8 sm:py-12">

                {/* Top Match - Groß und prominent */}
                {topMatch && (
                  <div className="mb-8 sm:mb-12">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-center text-amber-600 font-medium text-sm sm:text-base mb-4"
                    >
                      Deine beste Übereinstimmung
                    </motion.p>
                    <EmotionalMatchCard match={topMatch} rank={0} isTopMatch={true} />
                  </div>
                )}

                {/* Story Divider 1 */}
                {secondaryMatches.length > 0 && (
                  <StoryDivider
                    image={STORY_IMAGES.divider1}
                    text="Der erste Schritt ist oft der schwerste – du hast ihn gemacht"
                    delay={0.5}
                  />
                )}

                {/* Secondary Matches (2-3) */}
                {secondaryMatches.length > 0 && (
                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 mb-8 sm:mb-12">
                    {secondaryMatches.map((match, index) => (
                      <EmotionalMatchCard key={match.therapist.id} match={match} rank={index + 1} />
                    ))}
                  </div>
                )}

                {/* Story Divider 2 */}
                {remainingMatches.length > 0 && (
                  <StoryDivider
                    image={STORY_IMAGES.divider2}
                    text="Jeder dieser Menschen kann dir helfen, dein Leben zu verändern"
                    delay={0.6}
                  />
                )}

                {/* Remaining Matches */}
                {remainingMatches.length > 0 && (
                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                    {remainingMatches.map((match, index) => (
                      <EmotionalMatchCard key={match.therapist.id} match={match} rank={index + 3} />
                    ))}
                  </div>
                )}

                {/* Footer Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="relative mt-12 sm:mt-20 rounded-3xl overflow-hidden"
                >
                  <div className="relative h-64 sm:h-80">
                    <Image
                      src={STORY_IMAGES.footer}
                      alt="Dein Weg"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 sm:pb-12 px-4">
                      <h2 className="text-white text-2xl sm:text-3xl font-bold mb-3 text-center">
                        Bereit für den nächsten Schritt?
                      </h2>
                      <p className="text-white/80 text-center mb-6 max-w-md">
                        Du musst das nicht alleine durchstehen
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleNewSearch}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/40 text-white font-medium rounded-full hover:bg-white/30 transition-all"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Suche anpassen
                        </button>
                        <Link
                          href="/therapists"
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 font-medium rounded-full hover:bg-amber-50 transition-all"
                        >
                          Alle ansehen
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>

              </div>
            )}

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
