'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, MapPin, Star, Globe, ChevronRight, RotateCcw, Check, X } from 'lucide-react';
import { PROBLEM_AREAS, FORMAT_OPTIONS } from '@/app/components/matching/types';
import type { MatchingResponse, MatchResult } from '@/lib/matching/types';

// Fragen zu jedem Thema
const TOPIC_QUESTIONS: Record<string, string> = {
  angst: 'Kennst du Angstgefühle oder Panikattacken?',
  depression: 'Fühlst du dich oft niedergeschlagen oder antriebslos?',
  stress: 'Leidest du unter Stress oder Erschöpfung?',
  trauma: 'Hast du belastende Erfahrungen, die dich noch beschäftigen?',
  beziehung: 'Gibt es Schwierigkeiten in deinen Beziehungen?',
  selbstwert: 'Kämpfst du mit deinem Selbstwertgefühl?',
  trauer: 'Verarbeitest du gerade einen Verlust?',
  sucht: 'Hast du mit Suchtverhalten zu kämpfen?',
  essstoerung: 'Beschäftigt dich dein Essverhalten?',
  schlaf: 'Hast du Probleme mit dem Schlafen?',
  zwang: 'Erlebst du Zwangsgedanken oder -handlungen?',
  adhs: 'Hast du Schwierigkeiten mit Konzentration oder Aufmerksamkeit?',
  arbeit: 'Belastet dich deine berufliche Situation?',
};

// Versicherungs-Optionen
const INSURANCE_OPTIONS = [
  { id: 'PUBLIC', label: 'Gesetzlich', desc: 'Kassenplatz' },
  { id: 'PRIVATE', label: 'Privat', desc: 'Privatversichert' },
  { id: 'SELF_PAY', label: 'Selbstzahler', desc: 'Ohne Kasse' },
  { id: 'ANY', label: 'Egal', desc: 'Alle Optionen' },
] as const;

type Phase = 'topics' | 'preferences' | 'loading' | 'therapists' | 'results';
type Format = 'ONLINE' | 'IN_PERSON' | 'BOTH';
type Insurance = 'PUBLIC' | 'PRIVATE' | 'SELF_PAY' | 'ANY';

interface QuizState {
  phase: Phase;
  topicIndex: number;
  therapistIndex: number;
  selectedTopics: string[];
  format: Format | null;
  postalCode: string;
  insurance: Insurance;
  matches: MatchResult[];
  favorites: string[];
}

const initialState: QuizState = {
  phase: 'topics',
  topicIndex: 0,
  therapistIndex: 0,
  selectedTopics: [],
  format: null,
  postalCode: '',
  insurance: 'ANY',
  matches: [],
  favorites: [],
};

// Animation variants
const cardVariants = {
  enter: { x: 100, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
};

export default function QuizPage() {
  const [state, setState] = useState<QuizState>(initialState);

  const currentTopic = PROBLEM_AREAS[state.topicIndex];
  const currentTherapist = state.matches[state.therapistIndex];
  const progress = ((state.topicIndex + 1) / PROBLEM_AREAS.length) * 100;

  // Topic handlers
  const handleTopicAnswer = useCallback((answer: 'yes' | 'no') => {
    setState((prev) => {
      const newTopics = answer === 'yes'
        ? [...prev.selectedTopics, currentTopic.id]
        : prev.selectedTopics;

      const nextIndex = prev.topicIndex + 1;

      if (nextIndex >= PROBLEM_AREAS.length) {
        return { ...prev, selectedTopics: newTopics, phase: 'preferences', topicIndex: nextIndex };
      }

      return { ...prev, selectedTopics: newTopics, topicIndex: nextIndex };
    });
  }, [currentTopic?.id]);

  // Format handler
  const handleFormatSelect = (format: Format) => {
    setState((prev) => ({ ...prev, format }));
  };

  // Insurance handler
  const handleInsuranceSelect = (insurance: Insurance) => {
    setState((prev) => ({ ...prev, insurance }));
  };

  // Submit preferences and get matches
  const handleSubmitPreferences = async () => {
    setState((prev) => ({ ...prev, phase: 'loading' }));

    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemAreas: state.selectedTopics.length > 0 ? state.selectedTopics : ['stress'],
          format: state.format || 'BOTH',
          postalCode: state.postalCode || undefined,
          insuranceType: state.insurance,
          languages: ['Deutsch'],
          maxDistanceKm: 50,
        }),
      });

      const data: MatchingResponse = await response.json();

      setState((prev) => ({
        ...prev,
        matches: data.matches || [],
        phase: data.matches?.length > 0 ? 'therapists' : 'results',
      }));
    } catch (error) {
      console.error('Matching error:', error);
      setState((prev) => ({ ...prev, phase: 'results', matches: [] }));
    }
  };

  // Therapist handlers
  const handleInterested = () => {
    if (!currentTherapist) return;

    setState((prev) => ({
      ...prev,
      favorites: [...prev.favorites, currentTherapist.therapist.id],
    }));

    // Open profile in new tab
    window.open(`/therapists/${currentTherapist.therapist.id}`, '_blank');

    // Move to next
    handleNextTherapist();
  };

  const handleNextTherapist = () => {
    setState((prev) => {
      const nextIndex = prev.therapistIndex + 1;
      if (nextIndex >= prev.matches.length) {
        return { ...prev, phase: 'results' };
      }
      return { ...prev, therapistIndex: nextIndex };
    });
  };

  const handleFinish = () => {
    setState((prev) => ({ ...prev, phase: 'results' }));
  };

  const handleRestart = () => {
    setState(initialState);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/therapists" className="p-2 -ml-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-sm font-medium text-slate-600">
            {state.phase === 'topics' && `${state.topicIndex + 1} von ${PROBLEM_AREAS.length}`}
            {state.phase === 'preferences' && 'Fast geschafft'}
            {state.phase === 'therapists' && `${state.therapistIndex + 1} von ${state.matches.length}`}
            {state.phase === 'results' && 'Fertig'}
          </span>
          <div className="w-9" /> {/* Spacer */}
        </div>

        {/* Progress bar */}
        {state.phase === 'topics' && (
          <div className="h-1 bg-slate-100">
            <motion.div
              className="h-full bg-primary-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* PHASE: Topics */}
          {state.phase === 'topics' && currentTopic && (
            <motion.div
              key={`topic-${state.topicIndex}`}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Topic Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={currentTopic.image}
                    alt={currentTopic.label}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl font-bold text-white">{currentTopic.label}</h2>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-lg text-slate-700 text-center">
                    {TOPIC_QUESTIONS[currentTopic.id]}
                  </p>
                </div>
              </div>

              {/* Answer Buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTopicAnswer('no')}
                  className="flex-1 py-4 px-6 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold text-lg hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Nein
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTopicAnswer('yes')}
                  className="flex-1 py-4 px-6 rounded-xl bg-primary-500 text-white font-semibold text-lg hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Ja
                </motion.button>
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center gap-1.5 pt-4">
                {PROBLEM_AREAS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i < state.topicIndex
                        ? 'bg-primary-500'
                        : i === state.topicIndex
                        ? 'bg-primary-300'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* PHASE: Preferences */}
          {state.phase === 'preferences' && (
            <motion.div
              key="preferences"
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Selected Topics Summary */}
              {state.selectedTopics.length > 0 && (
                <div className="bg-primary-50 rounded-xl p-4">
                  <p className="text-sm text-primary-700 font-medium mb-2">Deine Themen:</p>
                  <div className="flex flex-wrap gap-2">
                    {state.selectedTopics.map((id) => {
                      const topic = PROBLEM_AREAS.find((t) => t.id === id);
                      return topic ? (
                        <span key={id} className="px-3 py-1 bg-white rounded-full text-sm text-primary-700 border border-primary-200">
                          {topic.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Format Selection */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Wie möchtest du Therapie machen?</h2>
                <div className="grid grid-cols-3 gap-3">
                  {FORMAT_OPTIONS.map((option) => (
                    <motion.button
                      key={option.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFormatSelect(option.id as Format)}
                      className={`relative rounded-xl overflow-hidden aspect-square ${
                        state.format === option.id
                          ? 'ring-2 ring-primary-500 ring-offset-2'
                          : ''
                      }`}
                    >
                      <Image
                        src={option.image}
                        alt={option.label}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <span className="font-semibold">{option.label}</span>
                        <span className="text-xs opacity-80">{option.desc}</span>
                      </div>
                      {state.format === option.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Postal Code (only for IN_PERSON or BOTH) */}
              {(state.format === 'IN_PERSON' || state.format === 'BOTH') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Deine Postleitzahl
                  </label>
                  <input
                    type="text"
                    value={state.postalCode}
                    onChange={(e) => setState((prev) => ({ ...prev, postalCode: e.target.value }))}
                    placeholder="z.B. 1010"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  />
                </div>
              )}

              {/* Insurance Selection */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Wie bist du versichert?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {INSURANCE_OPTIONS.map((option) => (
                    <motion.button
                      key={option.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleInsuranceSelect(option.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        state.insurance === option.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="font-semibold text-slate-900">{option.label}</span>
                      <span className="block text-sm text-slate-500">{option.desc}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitPreferences}
                disabled={!state.format}
                className="w-full py-4 rounded-xl bg-primary-500 text-white font-semibold text-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                Therapeut:innen finden
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {/* PHASE: Loading */}
          {state.phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
              <p className="mt-4 text-slate-600">Suche passende Therapeut:innen...</p>
            </motion.div>
          )}

          {/* PHASE: Therapists */}
          {state.phase === 'therapists' && currentTherapist && (
            <motion.div
              key={`therapist-${state.therapistIndex}`}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Therapist Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Profile Image */}
                <div className="relative aspect-square">
                  {currentTherapist.therapist.profileImageUrl ? (
                    <Image
                      src={currentTherapist.therapist.profileImageUrl}
                      alt={currentTherapist.therapist.displayName || 'Therapeut:in'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <span className="text-6xl font-bold text-primary-400">
                        {(currentTherapist.therapist.displayName || 'T')[0]}
                      </span>
                    </div>
                  )}

                  {/* Match Score Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-primary-600 font-bold">
                      {Math.round(currentTherapist.score * 100)}% Match
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {currentTherapist.therapist.displayName}
                    </h2>
                    {currentTherapist.therapist.title && (
                      <p className="text-slate-600">{currentTherapist.therapist.title}</p>
                    )}
                  </div>

                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-3 text-sm">
                    {currentTherapist.therapist.city && (
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-4 h-4" />
                        {currentTherapist.therapist.city}
                      </span>
                    )}
                    {currentTherapist.therapist.online && (
                      <span className="flex items-center gap-1 text-slate-600">
                        <Globe className="w-4 h-4" />
                        Online
                      </span>
                    )}
                    {currentTherapist.therapist.rating && currentTherapist.therapist.rating > 0 && (
                      <span className="flex items-center gap-1 text-slate-600">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {currentTherapist.therapist.rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* Specialties */}
                  {currentTherapist.therapist.specialties && currentTherapist.therapist.specialties.length > 0 && (
                    <div>
                      <p className="text-sm text-slate-500 mb-2">Spezialisiert auf:</p>
                      <div className="flex flex-wrap gap-2">
                        {currentTherapist.therapist.specialties.slice(0, 4).map((spec, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-700"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Headline */}
                  {currentTherapist.therapist.headline && (
                    <p className="text-slate-600 italic">
                      &ldquo;{currentTherapist.therapist.headline}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleInterested}
                  className="w-full py-4 rounded-xl bg-primary-500 text-white font-semibold text-lg hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Interessiert - Profil ansehen
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextTherapist}
                  className="w-full py-4 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  Weiter
                  <ChevronRight className="w-5 h-5" />
                </motion.button>

                <button
                  onClick={handleFinish}
                  className="w-full py-2 text-slate-500 text-sm hover:text-slate-700"
                >
                  Fertig - zur Übersicht
                </button>
              </div>

              {/* Progress */}
              <p className="text-center text-sm text-slate-500">
                {state.therapistIndex + 1} von {state.matches.length} Vorschlägen
              </p>
            </motion.div>
          )}

          {/* PHASE: Results */}
          {state.phase === 'results' && (
            <motion.div
              key="results"
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Geschafft!</h2>
                <p className="text-slate-600">
                  {state.favorites.length > 0
                    ? `Du hast ${state.favorites.length} Therapeut:in${state.favorites.length > 1 ? 'nen' : ''} markiert.`
                    : 'Du hast das Quiz abgeschlossen.'}
                </p>
              </div>

              {/* Favorites List */}
              {state.favorites.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-100">
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900">Deine Favoriten</h3>
                  </div>
                  {state.favorites.map((id) => {
                    const match = state.matches.find((m) => m.therapist.id === id);
                    if (!match) return null;
                    return (
                      <Link
                        key={id}
                        href={`/therapists/${id}`}
                        className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                          {match.therapist.profileImageUrl ? (
                            <Image
                              src={match.therapist.profileImageUrl}
                              alt=""
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          ) : (
                            <span className="font-bold text-primary-400">
                              {(match.therapist.displayName || 'T')[0]}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {match.therapist.displayName}
                          </p>
                          <p className="text-sm text-slate-500 truncate">
                            {match.therapist.city || 'Online'}
                          </p>
                        </div>
                        <span className="text-primary-600 font-semibold">
                          {Math.round(match.score * 100)}%
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  href="/therapists"
                  className="block w-full py-4 rounded-xl bg-primary-500 text-white font-semibold text-lg text-center hover:bg-primary-600 transition-colors"
                >
                  Alle Therapeut:innen ansehen
                </Link>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRestart}
                  className="w-full py-4 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Nochmal starten
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
