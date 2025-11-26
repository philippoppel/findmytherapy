'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, MapPin, Star, Globe, Sparkles, RotateCcw } from 'lucide-react';
import { PROBLEM_AREAS } from '@/app/components/matching/types';
import type { MatchingResponse, MatchResult } from '@/lib/matching/types';

// Einfühlsame Fragen zu jedem Thema
const TOPIC_QUESTIONS: Record<string, string> = {
  angst: 'Begleiten dich manchmal Ängste oder Sorgen?',
  depression: 'Fällt es dir schwer, dich aufzuraffen oder Freude zu empfinden?',
  stress: 'Fühlst du dich oft erschöpft oder ausgebrannt?',
  trauma: 'Trägst du belastende Erfahrungen mit dir?',
  beziehung: 'Wünschst du dir Unterstützung bei Beziehungsthemen?',
  selbstwert: 'Zweifelst du manchmal an dir selbst?',
  trauer: 'Verarbeitest du einen Verlust oder Abschied?',
  sucht: 'Gibt es Gewohnheiten, die dir Sorgen machen?',
  essstoerung: 'Beschäftigt dich dein Verhältnis zum Essen?',
  schlaf: 'Findest du nachts schwer zur Ruhe?',
  zwang: 'Kennst du wiederkehrende Gedanken oder Rituale?',
  adhs: 'Fällt dir Konzentration oder Struktur schwer?',
  arbeit: 'Belastet dich etwas in deinem Beruf?',
};

type Phase = 'intro' | 'topics' | 'loading' | 'results';

interface QuizState {
  phase: Phase;
  topicIndex: number;
  selectedTopics: string[];
  matches: MatchResult[];
  favorites: string[];
}

const initialState: QuizState = {
  phase: 'intro',
  topicIndex: 0,
  selectedTopics: [],
  matches: [],
  favorites: [],
};

export default function QuizPage() {
  const [state, setState] = useState<QuizState>(initialState);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  const currentTopic = PROBLEM_AREAS[state.topicIndex];
  const hasSelections = state.selectedTopics.length > 0;
  const isLastTopic = state.topicIndex >= PROBLEM_AREAS.length - 1;

  // Start Quiz
  const handleStart = () => {
    setState((prev) => ({ ...prev, phase: 'topics' }));
  };

  // Topic answer
  const handleTopicAnswer = (answer: 'yes' | 'no') => {
    setState((prev) => {
      const newTopics = answer === 'yes' && currentTopic
        ? [...prev.selectedTopics, currentTopic.id]
        : prev.selectedTopics;

      // Wenn letztes Thema, direkt zu Ergebnissen
      if (isLastTopic) {
        return { ...prev, selectedTopics: newTopics };
      }

      return {
        ...prev,
        selectedTopics: newTopics,
        topicIndex: prev.topicIndex + 1
      };
    });

    // Auto-load results after last topic
    if (isLastTopic) {
      loadResults();
    }
  };

  // Load results (can be called anytime)
  const loadResults = async () => {
    setIsLoadingResults(true);
    setState((prev) => ({ ...prev, phase: 'loading' }));

    try {
      const topics = state.selectedTopics.length > 0
        ? state.selectedTopics
        : ['stress']; // Fallback

      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemAreas: topics,
          format: 'BOTH',
          insuranceType: 'ANY',
          languages: ['Deutsch'],
          maxDistanceKm: 100,
        }),
      });

      const data: MatchingResponse = await response.json();

      setState((prev) => ({
        ...prev,
        matches: data.matches || [],
        phase: 'results',
      }));
    } catch (error) {
      console.error('Matching error:', error);
      setState((prev) => ({ ...prev, phase: 'results', matches: [] }));
    } finally {
      setIsLoadingResults(false);
    }
  };

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(id)
        ? prev.favorites.filter((f) => f !== id)
        : [...prev.favorites, id],
    }));
  };

  // Restart
  const handleRestart = () => {
    setState(initialState);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/therapists" className="p-2 -ml-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {state.phase === 'topics' && (
            <span className="text-sm text-slate-500">
              {state.topicIndex + 1} / {PROBLEM_AREAS.length}
            </span>
          )}

          <div className="w-9" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">

          {/* INTRO */}
          {state.phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12 space-y-8"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-10 h-10 text-primary-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Lass uns gemeinsam schauen
                </h1>
                <p className="text-slate-600 max-w-sm mx-auto">
                  Ein paar kurze Fragen helfen uns, die richtige Unterstützung für dich zu finden.
                  Du kannst jederzeit abbrechen.
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                className="w-full max-w-xs mx-auto py-4 px-8 rounded-2xl bg-primary-500 text-white font-semibold text-lg hover:bg-primary-600 transition-colors"
              >
                Los geht&apos;s
              </motion.button>

              <p className="text-sm text-slate-400">
                Dauer: ca. 1-2 Minuten
              </p>
            </motion.div>
          )}

          {/* TOPICS */}
          {state.phase === 'topics' && currentTopic && (
            <motion.div
              key={`topic-${state.topicIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Topic Card */}
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={currentTopic.image}
                    alt={currentTopic.label}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white/80 text-sm mb-1">Thema</p>
                    <h2 className="text-2xl font-bold text-white">{currentTopic.label}</h2>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-xl text-slate-700 text-center leading-relaxed">
                    {TOPIC_QUESTIONS[currentTopic.id]}
                  </p>
                </div>
              </div>

              {/* Answer Buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTopicAnswer('no')}
                  className="flex-1 py-5 rounded-2xl border-2 border-slate-200 bg-white text-slate-600 font-semibold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  Nein
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTopicAnswer('yes')}
                  className="flex-1 py-5 rounded-2xl bg-primary-500 text-white font-semibold text-lg hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25"
                >
                  Ja, das kenne ich
                </motion.button>
              </div>

              {/* Show Results Button - appears after first selection */}
              {hasSelections && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4"
                >
                  <button
                    onClick={loadResults}
                    disabled={isLoadingResults}
                    className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isLoadingResults ? 'Lädt...' : `Vorschläge ansehen (${state.selectedTopics.length} Themen)`}
                  </button>
                </motion.div>
              )}

              {/* Progress Dots */}
              <div className="flex justify-center gap-1 pt-2">
                {PROBLEM_AREAS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all ${
                      i < state.topicIndex
                        ? 'w-4 bg-primary-500'
                        : i === state.topicIndex
                        ? 'w-4 bg-primary-300'
                        : 'w-1 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* LOADING */}
          {state.phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-4"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-100 rounded-full" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-slate-600">Finde passende Therapeut:innen...</p>
            </motion.div>
          )}

          {/* RESULTS */}
          {state.phase === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  {state.matches.length > 0
                    ? `${state.matches.length} Vorschläge für dich`
                    : 'Keine Treffer gefunden'}
                </h2>
                {state.selectedTopics.length > 0 && (
                  <p className="text-slate-500 text-sm">
                    Basierend auf: {state.selectedTopics.map(id =>
                      PROBLEM_AREAS.find(p => p.id === id)?.label
                    ).filter(Boolean).join(', ')}
                  </p>
                )}
              </div>

              {/* Results List */}
              {state.matches.length > 0 ? (
                <div className="space-y-4">
                  {state.matches.slice(0, 5).map((match, index) => (
                    <motion.div
                      key={match.therapist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                    >
                      <div className="flex gap-4 p-4">
                        {/* Avatar */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          {match.therapist.profileImageUrl ? (
                            <Image
                              src={match.therapist.profileImageUrl}
                              alt={match.therapist.displayName || ''}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                              <span className="text-2xl font-bold text-primary-400">
                                {(match.therapist.displayName || 'T')[0]}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-slate-900 truncate">
                                {match.therapist.displayName}
                              </h3>
                              {match.therapist.title && (
                                <p className="text-sm text-slate-500 truncate">{match.therapist.title}</p>
                              )}
                            </div>
                            <span className="flex-shrink-0 px-2 py-1 bg-primary-50 text-primary-600 text-sm font-semibold rounded-lg">
                              {Math.round(match.score * 100)}%
                            </span>
                          </div>

                          {/* Quick Info */}
                          <div className="flex flex-wrap gap-2 mt-2 text-xs text-slate-500">
                            {match.therapist.city && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {match.therapist.city}
                              </span>
                            )}
                            {match.therapist.online && (
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                Online
                              </span>
                            )}
                            {match.therapist.rating && match.therapist.rating > 0 && (
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                {match.therapist.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex border-t border-slate-100">
                        <button
                          onClick={() => toggleFavorite(match.therapist.id)}
                          className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                            state.favorites.includes(match.therapist.id)
                              ? 'text-rose-500 bg-rose-50'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${state.favorites.includes(match.therapist.id) ? 'fill-current' : ''}`} />
                          Merken
                        </button>
                        <div className="w-px bg-slate-100" />
                        <Link
                          href={`/therapists/${match.therapist.id}`}
                          className="flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                        >
                          Profil ansehen
                        </Link>
                      </div>
                    </motion.div>
                  ))}

                  {state.matches.length > 5 && (
                    <Link
                      href="/therapists"
                      className="block text-center py-3 text-primary-600 font-medium hover:underline"
                    >
                      Alle {state.matches.length} Ergebnisse ansehen →
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <p className="text-slate-600">
                    Leider haben wir keine passenden Therapeut:innen gefunden.
                  </p>
                  <Link
                    href="/therapists"
                    className="inline-block px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                  >
                    Alle Therapeut:innen ansehen
                  </Link>
                </div>
              )}

              {/* Restart Button */}
              <button
                onClick={handleRestart}
                className="w-full py-3 rounded-xl text-slate-500 font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Nochmal starten
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
