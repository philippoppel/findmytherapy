'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MapPin,
  Star,
  Globe,
  Sparkles,
  RotateCcw,
  ChevronRight,
  X,
  BookOpen,
  ClipboardCheck,
  Home,
  Crosshair,
  Check,
} from 'lucide-react';
import { PROBLEM_AREAS } from '@/app/components/matching/types';
import type { MatchingResponse, MatchResult } from '@/lib/matching/types';
import { blogPosts, type BlogPost } from '@/lib/blogData';
import { useUserPreferences } from '@/hooks/useUserPreferences';

// Reduzierte Kernthemen (6 wichtigste)
const CORE_TOPICS = PROBLEM_AREAS.filter(topic =>
  ['angst', 'depression', 'stress', 'beziehung', 'selbstwert', 'trauma'].includes(topic.id)
);

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

// Keywords für Blog-Suche passend zu Themen
const TOPIC_BLOG_KEYWORDS: Record<string, string[]> = {
  angst: ['Angst', 'Panik', 'Angststörung', 'Panikattacken', 'Phobien'],
  depression: ['Depression', 'depressiv', 'Niedergeschlagenheit', 'Antriebslosigkeit'],
  stress: ['Stress', 'Burnout', 'Erschöpfung', 'Überlastung', 'Work-Life'],
  trauma: ['Trauma', 'PTBS', 'traumatisch', 'Belastung'],
  beziehung: ['Beziehung', 'Partnerschaft', 'Paar', 'Kommunikation', 'Trennung'],
  selbstwert: ['Selbstwert', 'Selbstbewusstsein', 'Selbstliebe', 'Selbstfürsorge'],
  trauer: ['Trauer', 'Verlust', 'Tod', 'Abschied'],
  sucht: ['Sucht', 'Abhängigkeit', 'Alkohol', 'Drogen'],
  essstoerung: ['Essstörung', 'Anorexie', 'Bulimie', 'Essen'],
  schlaf: ['Schlaf', 'Insomnie', 'Entspannung', 'Ruhe'],
  zwang: ['Zwang', 'OCD', 'Zwangsgedanken', 'Rituale'],
  adhs: ['ADHS', 'ADS', 'Aufmerksamkeit', 'Konzentration'],
  arbeit: ['Arbeit', 'Beruf', 'Karriere', 'Burnout', 'Mobbing'],
};

// Helper: Get relevant blog posts based on topics (with randomization)
function getRelevantBlogPosts(selectedTopics: string[], limit: number = 3, randomize: boolean = true): BlogPost[] {
  if (selectedTopics.length === 0) return [];

  // Collect all keywords for selected topics
  const keywords = selectedTopics.flatMap(topic => TOPIC_BLOG_KEYWORDS[topic] || []);
  if (keywords.length === 0) return [];

  // Score each blog post by how many keywords match
  const scoredPosts = blogPosts.map(post => {
    let score = 0;
    const searchText = `${post.title} ${post.excerpt} ${post.tags.join(' ')} ${post.keywords.join(' ')}`.toLowerCase();

    keywords.forEach(keyword => {
      if (searchText.includes(keyword.toLowerCase())) {
        score += 1;
      }
    });

    // Add random factor for variety
    const randomFactor = randomize ? Math.random() * 0.5 : 0;
    return { post, score: score + randomFactor };
  });

  // Return top posts sorted by score (with randomization built in)
  return scoredPosts
    .filter(item => item.score > 0.5) // Must have at least one real match
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

// Helper: Get a single blog post for current topic
function getBlogPostForTopic(topicId: string): BlogPost | null {
  const keywords = TOPIC_BLOG_KEYWORDS[topicId] || [];
  if (keywords.length === 0) return null;

  const matchingPosts = blogPosts.filter(post => {
    const searchText = `${post.title} ${post.excerpt} ${post.tags.join(' ')} ${post.keywords.join(' ')}`.toLowerCase();
    return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
  });

  if (matchingPosts.length === 0) return null;

  // Random selection for variety
  return matchingPosts[Math.floor(Math.random() * matchingPosts.length)];
}

type Phase = 'intro' | 'topics' | 'location' | 'loading' | 'therapists' | 'summary';

interface QuizState {
  phase: Phase;
  topicIndex: number;
  therapistIndex: number;
  selectedTopics: string[];
  postalCode: string;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  matches: MatchResult[];
  favorites: string[];
  skipped: string[];
}

const initialState: QuizState = {
  phase: 'topics',
  topicIndex: 0,
  therapistIndex: 0,
  selectedTopics: [],
  postalCode: '',
  matches: [],
  favorites: [],
  skipped: [],
};

// Helper: Get initials (2 letters)
function getInitials(name: string | null | undefined): string {
  if (!name) return 'TH';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}


export default function QuizPage() {
  const [state, setState] = useState<QuizState>(initialState);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { saveQuizResults } = useUserPreferences();

  const currentTopic = CORE_TOPICS[state.topicIndex];
  const currentTherapist = state.matches[state.therapistIndex];
  const hasSelections = state.selectedTopics.length > 0;
  const isLastTopic = state.topicIndex >= CORE_TOPICS.length - 1;
  const currentTopicBlogPost = currentTopic ? getBlogPostForTopic(currentTopic.id) : null;
  const remainingTherapists = state.matches.length - state.therapistIndex;
  const relevantBlogPosts = getRelevantBlogPosts(state.selectedTopics, 3);

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

      if (isLastTopic) {
        return { ...prev, selectedTopics: newTopics, phase: 'location' };
      }

      return {
        ...prev,
        selectedTopics: newTopics,
        topicIndex: prev.topicIndex + 1
      };
    });
  };

  // Go to location step (can be called anytime after first selection)
  const goToLocation = () => {
    setState((prev) => ({ ...prev, phase: 'location' }));
  };

  // Auto-detect location and proceed directly
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Standorterkennung wird von deinem Browser nicht unterstützt.');
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let locationName = 'Dein Standort';

        // Try to get city name from coordinates using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            { headers: { 'Accept-Language': 'de' } }
          );
          const data = await response.json();
          locationName = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || 'Dein Standort';
        } catch {
          // Continue with default location name
        }

        // Speichere Quiz-Ergebnisse in localStorage für personalisierte Empfehlungen
        if (state.selectedTopics.length > 0) {
          saveQuizResults(state.selectedTopics);
        }

        // Set location and immediately proceed to loading
        setState((prev) => ({
          ...prev,
          latitude,
          longitude,
          locationName,
          phase: 'loading',
        }));
        setIsLoadingLocation(false);

        // Load results directly with the detected coordinates
        loadResultsWithLocation(latitude, longitude, state.selectedTopics);
      },
      (error) => {
        setIsLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Standortzugriff wurde verweigert. Bitte gib manuell einen Ort ein.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Standort konnte nicht ermittelt werden.');
            break;
          case error.TIMEOUT:
            setLocationError('Zeitüberschreitung bei der Standortermittlung.');
            break;
          default:
            setLocationError('Ein Fehler ist aufgetreten.');
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  // Load results with specific location (used by auto-detect)
  const loadResultsWithLocation = async (lat?: number, lon?: number, topics?: string[]) => {
    setIsLoadingResults(true);

    try {
      const problemAreas = (topics && topics.length > 0) ? topics : state.selectedTopics.length > 0 ? state.selectedTopics : ['stress'];

      const requestBody: Record<string, unknown> = {
        problemAreas,
        format: 'BOTH',
        insuranceType: 'ANY',
        languages: ['Deutsch'],
        maxDistanceKm: 100,
      };

      // Use provided coordinates or fall back to state
      if (lat && lon) {
        requestBody.latitude = lat;
        requestBody.longitude = lon;
      } else if (state.latitude && state.longitude) {
        requestBody.latitude = state.latitude;
        requestBody.longitude = state.longitude;
      } else if (state.postalCode) {
        requestBody.postalCode = state.postalCode;
      }

      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data: MatchingResponse = await response.json();

      setState((prev) => ({
        ...prev,
        matches: data.matches || [],
        phase: data.matches?.length > 0 ? 'therapists' : 'summary',
        therapistIndex: 0,
      }));
    } catch (error) {
      console.error('Matching error:', error);
      setState((prev) => ({ ...prev, phase: 'summary', matches: [] }));
    } finally {
      setIsLoadingResults(false);
    }
  };

  // Load results (wrapper for manual submission)
  const loadResults = async () => {
    // Speichere Quiz-Ergebnisse in localStorage für personalisierte Empfehlungen
    if (state.selectedTopics.length > 0) {
      saveQuizResults(state.selectedTopics);
    }
    setState((prev) => ({ ...prev, phase: 'loading' }));
    await loadResultsWithLocation();
  };

  // Therapist actions
  const handleLike = () => {
    if (!currentTherapist) return;
    setState((prev) => ({
      ...prev,
      favorites: [...prev.favorites, currentTherapist.therapist.id],
      therapistIndex: prev.therapistIndex + 1,
      phase: prev.therapistIndex + 1 >= prev.matches.length ? 'summary' : 'therapists',
    }));
  };

  const handleSkip = () => {
    if (!currentTherapist) return;
    setState((prev) => ({
      ...prev,
      skipped: [...prev.skipped, currentTherapist.therapist.id],
      therapistIndex: prev.therapistIndex + 1,
      phase: prev.therapistIndex + 1 >= prev.matches.length ? 'summary' : 'therapists',
    }));
  };

  const handleViewProfile = () => {
    if (!currentTherapist) return;
    window.open(`/therapists/${currentTherapist.therapist.id}`, '_blank');
  };

  const goToSummary = () => {
    setState((prev) => ({ ...prev, phase: 'summary' }));
  };

  // Restart
  const handleRestart = () => {
    setState(initialState);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="p-2 -ml-2 text-slate-600 hover:text-slate-900 flex items-center gap-2">
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Startseite</span>
          </Link>

          {state.phase === 'topics' && (
            <span className="text-sm text-slate-500">
              {state.topicIndex + 1} / {PROBLEM_AREAS.length}
            </span>
          )}

          {state.phase === 'therapists' && (
            <span className="text-sm text-slate-500">
              {state.therapistIndex + 1} / {state.matches.length}
            </span>
          )}

          <button
            onClick={goToSummary}
            className="p-2 -mr-2 text-slate-600 hover:text-slate-900 text-sm"
          >
            {state.phase === 'therapists' || state.phase === 'summary' ? 'Übersicht' : 'Beenden'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">

          {/* INTRO */}
          {state.phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8 md:py-12 space-y-8"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-primary-500" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Lass uns gemeinsam schauen
                </h1>
                <p className="text-slate-600 max-w-md mx-auto text-base md:text-lg">
                  Ein paar kurze Fragen helfen uns, die richtige Unterstützung für dich zu finden.
                  Du kannst jederzeit abbrechen.
                </p>
              </div>

              <div className="space-y-4 max-w-sm mx-auto">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStart}
                  className="w-full py-4 px-8 rounded-2xl bg-primary-500 text-white font-semibold text-lg hover:bg-primary-600 transition-colors"
                >
                  Los geht&apos;s
                </motion.button>

                <Link
                  href="/triage"
                  className="flex items-center justify-center gap-2 py-3 text-slate-600 hover:text-primary-600 transition-colors"
                >
                  <ClipboardCheck className="w-5 h-5" />
                  <span>Lieber einen ausführlichen Test machen</span>
                </Link>
              </div>

              <p className="text-sm text-slate-400">
                Schnell-Quiz: ca. 1-2 Minuten
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
                <div className="relative aspect-[4/3] md:aspect-[16/9]">
                  <Image
                    src={currentTopic.image}
                    alt={currentTopic.label}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 672px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-white/80 text-sm mb-1">Thema</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{currentTopic.label}</h2>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <p className="text-xl md:text-2xl text-slate-700 text-center leading-relaxed">
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

              {/* Blog Suggestion for current topic */}
              {currentTopicBlogPost && (
                <Link
                  href={`/blog/${currentTopicBlogPost.slug}`}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={currentTopicBlogPost.featuredImage.src}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-primary-600 font-medium flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Lesetipp
                    </p>
                    <p className="text-sm font-medium text-slate-700 line-clamp-2">{currentTopicBlogPost.title}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </Link>
              )}

              {/* Show Results Button */}
              {hasSelections && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-2"
                >
                  <button
                    onClick={goToLocation}
                    className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Vorschläge ansehen ({state.selectedTopics.length} Themen)
                  </button>
                </motion.div>
              )}

              {/* Progress Dots */}
              <div className="flex justify-center gap-1 pt-2">
                {CORE_TOPICS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i < state.topicIndex
                        ? 'w-4 bg-primary-500'
                        : i === state.topicIndex
                        ? 'w-4 bg-primary-300'
                        : 'w-1.5 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* LOCATION */}
          {state.phase === 'location' && (
            <motion.div
              key="location"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 py-4"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Wo bist du?</h2>
                <p className="text-slate-600">
                  So können wir dir Therapeut:innen in deiner Nähe zeigen.
                </p>
              </div>

              <div className="max-w-sm mx-auto space-y-4">
                {/* Auto-detect location button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={detectLocation}
                  disabled={isLoadingLocation}
                  className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
                    state.locationName
                      ? 'bg-green-50 border-2 border-green-500 text-green-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isLoadingLocation ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      Ermittle Standort...
                    </>
                  ) : state.locationName ? (
                    <>
                      <Check className="w-5 h-5" />
                      {state.locationName}
                    </>
                  ) : (
                    <>
                      <Crosshair className="w-5 h-5" />
                      Standort automatisch ermitteln
                    </>
                  )}
                </motion.button>

                {locationError && (
                  <p className="text-sm text-red-500 text-center">{locationError}</p>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-gradient-to-b from-primary-50/50 to-white text-slate-500">oder</span>
                  </div>
                </div>

                <input
                  type="text"
                  value={state.postalCode}
                  onChange={(e) => setState((prev) => ({
                    ...prev,
                    postalCode: e.target.value,
                    // Clear auto-detected location when typing
                    latitude: undefined,
                    longitude: undefined,
                    locationName: undefined,
                  }))}
                  placeholder="Postleitzahl oder Stadt eingeben"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-lg text-center"
                />

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={loadResults}
                  disabled={isLoadingResults}
                  className="w-full py-4 rounded-2xl bg-primary-500 text-white font-semibold text-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
                >
                  {isLoadingResults ? 'Suche läuft...' : 'Therapeut:innen finden'}
                </motion.button>

                <button
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      postalCode: '',
                      latitude: undefined,
                      longitude: undefined,
                      locationName: undefined,
                    }));
                    loadResults();
                  }}
                  className="w-full py-3 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Überspringen (bundesweit suchen)
                </button>
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

          {/* THERAPISTS - Tinder Style */}
          {state.phase === 'therapists' && currentTherapist && (
            <motion.div
              key={`therapist-${state.therapistIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Therapist Card */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Profile Image - Large */}
                <div className="relative aspect-[4/5] md:aspect-[3/2]">
                  {currentTherapist.therapist.profileImageUrl ? (
                    <Image
                      src={currentTherapist.therapist.profileImageUrl}
                      alt={currentTherapist.therapist.displayName || ''}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 672px"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
                      <span className="text-7xl md:text-9xl font-bold text-white/80">
                        {getInitials(currentTherapist.therapist.displayName)}
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Match Score Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <span className="text-primary-600 font-bold text-lg">
                      {Math.round(currentTherapist.score * 100)}% Match
                    </span>
                  </div>

                  {/* Remaining Count */}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-white text-sm">
                      Noch {remainingTherapists} {remainingTherapists === 1 ? 'Vorschlag' : 'Vorschläge'}
                    </span>
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                    <h2 className="text-2xl md:text-3xl font-bold mb-1">
                      {currentTherapist.therapist.displayName}
                    </h2>
                    {currentTherapist.therapist.title && (
                      <p className="text-white/80 text-lg">{currentTherapist.therapist.title}</p>
                    )}

                    {/* Quick Info */}
                    <div className="flex flex-wrap gap-3 mt-3 text-sm">
                      {currentTherapist.therapist.city && (
                        <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <MapPin className="w-4 h-4" />
                          {currentTherapist.therapist.city}
                          {currentTherapist.distanceKm && ` (${Math.round(currentTherapist.distanceKm)} km)`}
                        </span>
                      )}
                      {currentTherapist.therapist.online && (
                        <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <Globe className="w-4 h-4" />
                          Online verfügbar
                        </span>
                      )}
                      {currentTherapist.therapist.rating && currentTherapist.therapist.rating > 0 && (
                        <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          {currentTherapist.therapist.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Explanation */}
                <div className="p-6 md:p-8 space-y-4">
                  {/* Why this match */}
                  {currentTherapist.explanation?.primary && currentTherapist.explanation.primary.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-2">Warum dieses Match?</p>
                      <div className="flex flex-wrap gap-2">
                        {currentTherapist.explanation.primary.map((reason, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Specialties */}
                  {currentTherapist.therapist.specialties && currentTherapist.therapist.specialties.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-2">Spezialisierungen</p>
                      <div className="flex flex-wrap gap-2">
                        {currentTherapist.therapist.specialties.slice(0, 5).map((spec, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Headline */}
                  {currentTherapist.therapist.headline && (
                    <p className="text-slate-600 italic text-lg leading-relaxed">
                      &ldquo;{currentTherapist.therapist.headline}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSkip}
                  className="flex-1 py-4 rounded-2xl border-2 border-slate-200 bg-white text-slate-600 font-semibold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Weiter
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-lg hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Interessiert
                </motion.button>
              </div>

              {/* View Profile Button */}
              <button
                onClick={handleViewProfile}
                className="w-full py-3 text-primary-600 font-medium hover:bg-primary-50 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Profil ansehen
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Blog Posts - shown during therapist browsing */}
              {relevantBlogPosts.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-medium text-slate-700">Passende Artikel für dich</span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
                    {relevantBlogPosts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="flex-shrink-0 w-64 bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow snap-start"
                      >
                        <div className="relative h-32">
                          <Image
                            src={post.featuredImage.src}
                            alt={post.featuredImage.alt}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-slate-900 text-sm line-clamp-2">{post.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{post.readingTime}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* SUMMARY */}
          {state.phase === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 py-4"
            >
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {state.favorites.length > 0
                    ? `${state.favorites.length} Therapeut:in${state.favorites.length > 1 ? 'nen' : ''} gemerkt`
                    : 'Deine Übersicht'}
                </h2>
                {state.selectedTopics.length > 0 && (
                  <p className="text-slate-500 text-sm">
                    Themen: {state.selectedTopics.map(id =>
                      PROBLEM_AREAS.find(p => p.id === id)?.label
                    ).filter(Boolean).join(', ')}
                  </p>
                )}
              </div>

              {/* Favorites List */}
              {state.favorites.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900">Deine Favoriten</h3>
                  {state.favorites.map((id) => {
                    const match = state.matches.find((m) => m.therapist.id === id);
                    if (!match) return null;
                    return (
                      <Link
                        key={id}
                        href={`/therapists/${id}`}
                        className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                      >
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0">
                          {match.therapist.profileImageUrl ? (
                            <Image
                              src={match.therapist.profileImageUrl}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
                              <span className="text-xl font-bold text-white">
                                {getInitials(match.therapist.displayName)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {match.therapist.displayName}
                          </p>
                          <p className="text-sm text-slate-500 truncate">
                            {match.therapist.city || 'Online'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-primary-600 font-bold">
                            {Math.round(match.score * 100)}%
                          </span>
                          <ChevronRight className="w-5 h-5 text-slate-400 mt-1" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Blog Posts */}
              {relevantBlogPosts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary-500" />
                    Passende Artikel für dich
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
                    {relevantBlogPosts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="flex-shrink-0 w-64 bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow snap-start"
                      >
                        <div className="relative h-32">
                          <Image
                            src={post.featuredImage.src}
                            alt={post.featuredImage.alt}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-slate-900 text-sm line-clamp-2">{post.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{post.readingTime}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Intensive Test Link */}
              <div className="bg-slate-50 rounded-2xl p-6 text-center space-y-3">
                <ClipboardCheck className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-slate-600">
                  Möchtest du eine ausführlichere Einschätzung?
                </p>
                <Link
                  href="/triage"
                  className="inline-flex items-center gap-2 text-primary-600 font-medium hover:underline"
                >
                  Zum wissenschaftlichen Test
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  href="/therapists"
                  className="block w-full py-4 rounded-2xl bg-primary-500 text-white font-semibold text-lg text-center hover:bg-primary-600 transition-colors"
                >
                  Alle Therapeut:innen ansehen
                </Link>

                <button
                  onClick={handleRestart}
                  className="w-full py-3 rounded-xl text-slate-500 font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Quiz neu starten
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
