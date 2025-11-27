'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
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
  User,
  Video,
  AlertCircle,
  Euro,
  Clock,
  Settings2,
} from 'lucide-react';
import { PROBLEM_AREAS } from '@/app/components/matching/types';
import type { MatchingResponse, MatchResult } from '@/lib/matching/types';
import { blogPosts, type BlogPost } from '@/lib/blogData';
import { useUserPreferences } from '@/hooks/useUserPreferences';

// Fallback Problem Areas für den Fall dass der Import fehlschlägt
const FALLBACK_TOPICS = [
  { id: 'angst', label: 'Angst & Panik', image: '/images/topics/angst.jpg' },
  { id: 'depression', label: 'Niedergeschlagenheit', image: '/images/topics/depression.jpg' },
  { id: 'stress', label: 'Stress & Burnout', image: '/images/topics/stress.jpg' },
  { id: 'trauma', label: 'Trauma & PTBS', image: '/images/topics/trauma.jpg' },
  { id: 'beziehung', label: 'Beziehungen', image: '/images/topics/beziehung.jpg' },
  { id: 'selbstwert', label: 'Selbstwert', image: '/images/topics/selbstwert.jpg' },
];

// Reduzierte Kernthemen (6 wichtigste)
const CORE_TOPIC_IDS = ['angst', 'depression', 'stress', 'beziehung', 'selbstwert', 'trauma'];
const CORE_TOPICS = (PROBLEM_AREAS?.length > 0
  ? PROBLEM_AREAS.filter(topic => CORE_TOPIC_IDS.includes(topic.id))
  : FALLBACK_TOPICS
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

// Kurze Tipps die nach "Ja" angezeigt werden (nur für die 6 CORE_TOPICS)
const TOPIC_TIPS: Record<string, { tip: string; emoji: string }> = {
  angst: {
    tip: 'Tiefes Atmen aktiviert deinen Parasympathikus und kann akute Angst lindern.',
    emoji: '🌬️',
  },
  depression: {
    tip: 'Schon 10 Minuten Bewegung am Tag können die Stimmung messbar verbessern.',
    emoji: '🚶',
  },
  stress: {
    tip: 'Regelmäßige Pausen sind kein Luxus – sie steigern nachweislich die Produktivität.',
    emoji: '☕',
  },
  trauma: {
    tip: 'Heilung braucht Zeit. Sei geduldig mit dir – du machst das gut.',
    emoji: '💚',
  },
  beziehung: {
    tip: 'Gute Kommunikation beginnt mit aktivem Zuhören – ohne sofort zu antworten.',
    emoji: '💬',
  },
  selbstwert: {
    tip: 'Sprich mit dir selbst wie mit einem guten Freund – mit Verständnis statt Kritik.',
    emoji: '🪞',
  },
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

// Helper: Get relevant blog posts based on topics (deterministic for SSR)
function getRelevantBlogPosts(selectedTopics: string[], limit: number = 3): BlogPost[] {
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

    return { post, score };
  });

  // Return top posts sorted by score (deterministic)
  return scoredPosts
    .filter(item => item.score > 0) // Must have at least one match
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

// Helper: Get a single blog post for current topic (deterministic for SSR)
function getBlogPostForTopic(topicId: string): BlogPost | null {
  const keywords = TOPIC_BLOG_KEYWORDS[topicId] || [];
  if (keywords.length === 0) return null;

  const matchingPosts = blogPosts.filter(post => {
    const searchText = `${post.title} ${post.excerpt} ${post.tags.join(' ')} ${post.keywords.join(' ')}`.toLowerCase();
    return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
  });

  if (matchingPosts.length === 0) return null;

  // Return first matching post (deterministic)
  return matchingPosts[0];
}

type Phase = 'intro' | 'topics' | 'location-preferences' | 'loading' | 'therapists' | 'summary';

// Preference Options
type GenderPreference = 'female' | 'male' | 'any';
type FormatPreference = 'ONLINE' | 'IN_PERSON' | 'BOTH';
type InsurancePreference = 'PUBLIC' | 'PRIVATE' | 'SELF_PAY' | 'ANY';

interface QuizState {
  phase: Phase;
  topicIndex: number;
  therapistIndex: number;
  selectedTopics: string[];
  postalCode: string;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  // Neue Präferenzen
  genderPreference: GenderPreference;
  formatPreference: FormatPreference;
  insurancePreference: InsurancePreference;
  maxPrice?: number; // in Euro
  maxWaitWeeks?: number;
  // Ergebnisse
  matches: MatchResult[];
  favorites: string[];
  skipped: string[];
  // Was nicht berücksichtigt werden konnte
  unmetPreferences: string[];
}

const initialState: QuizState = {
  phase: 'topics',
  topicIndex: 0,
  therapistIndex: 0,
  selectedTopics: [],
  postalCode: '',
  genderPreference: 'any',
  formatPreference: 'BOTH',
  insurancePreference: 'ANY',
  matches: [],
  favorites: [],
  skipped: [],
  unmetPreferences: [],
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


const QUIZ_STORAGE_KEY = 'fmt-quiz-state';

// Zentrale Swipe-Konfiguration für bessere Mobile UX
const SWIPE_CONFIG = {
  mobile: {
    threshold: 50,        // ~13% der Bildschirmbreite (statt 37%)
    velocity: 200,        // Niedriger für leichteres Swipen
    hardThreshold: 100,   // Sehr bewusster Swipe funktioniert immer
    minHorizontalRatio: 2, // Muss 2x so horizontal wie vertikal sein
  },
  desktop: {
    threshold: 80,
    velocity: 300,
    hardThreshold: 120,
    minHorizontalRatio: 1.5,
  },
};

export default function QuizPage() {
  const [state, setState] = useState<QuizState>(initialState);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showTip, setShowTip] = useState<string | null>(null); // Topic ID for which to show tip
  const [tipTimeoutId, setTipTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const { saveQuizResults } = useUserPreferences();

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<QuizState>;
        // Only restore if quiz was in progress (not completed)
        if (parsed.phase && parsed.phase !== 'summary') {
          setState((prev) => ({
            ...prev,
            ...parsed,
            // Don't restore matches - they need to be fetched fresh
            matches: [],
          }));
        }
      }
    } catch {
      // Ignore parse errors
    }
    setIsHydrated(true);
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    if (!isHydrated) return;

    // Save relevant state (exclude matches to keep storage small)
    const toSave: Partial<QuizState> = {
      phase: state.phase,
      topicIndex: state.topicIndex,
      selectedTopics: state.selectedTopics,
      postalCode: state.postalCode,
      latitude: state.latitude,
      longitude: state.longitude,
      locationName: state.locationName,
      genderPreference: state.genderPreference,
      formatPreference: state.formatPreference,
      insurancePreference: state.insurancePreference,
      maxPrice: state.maxPrice,
      maxWaitWeeks: state.maxWaitWeeks,
      favorites: state.favorites,
    };

    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(toSave));
  }, [state, isHydrated]);

  // Check if mobile (disable swipe on small screens to prevent accidental triggers)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Swipe gesture state for therapists (angepasst an neue Schwellenwerte)
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 0, 150], [-10, 0, 10]);
  const likeOpacity = useTransform(x, [0, 50], [0, 1]); // Zeigt früher Feedback
  const skipOpacity = useTransform(x, [-50, 0], [1, 0]);

  // Swipe gesture state for topics
  const topicX = useMotionValue(0);
  const topicRotate = useTransform(topicX, [-150, 0, 150], [-10, 0, 10]);
  const topicYesOpacity = useTransform(topicX, [0, 50], [0, 1]);
  const topicNoOpacity = useTransform(topicX, [-50, 0], [1, 0]);

  // Zentrale Swipe-Handler mit Horizontal-Ratio-Check
  const createSwipeHandler = (onRight: () => void, onLeft: () => void) => {
    return (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const config = isMobile ? SWIPE_CONFIG.mobile : SWIPE_CONFIG.desktop;

      // Ignoriere überwiegend vertikale Gesten (Scroll-Bewegungen)
      const horizontalRatio = Math.abs(info.offset.x) / (Math.abs(info.offset.y) + 1);
      if (horizontalRatio < config.minHorizontalRatio) return;

      const hasEnoughVelocity = Math.abs(info.velocity.x) > config.velocity;
      const hasEnoughOffset = Math.abs(info.offset.x) > config.threshold;
      const isHardSwipe = Math.abs(info.offset.x) > config.hardThreshold;

      // Trigger wenn: (offset + velocity) ODER sehr bewusster Swipe
      if ((hasEnoughOffset && hasEnoughVelocity) || isHardSwipe) {
        info.offset.x > 0 ? onRight() : onLeft();
      }
    };
  };

  // Reset swipe position when therapist changes
  useEffect(() => {
    x.set(0);
  }, [state.therapistIndex, x]);

  // Reset swipe position when topic changes
  useEffect(() => {
    topicX.set(0);
  }, [state.topicIndex, topicX]);

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
    if (answer === 'yes' && currentTopic) {
      // Add topic to selected topics immediately
      setState((prev) => ({
        ...prev,
        selectedTopics: [...prev.selectedTopics, currentTopic.id]
      }));

      // Show tip briefly before moving to next question
      setShowTip(currentTopic.id);

      const timeoutId = setTimeout(() => {
        setShowTip(null);
        setTipTimeoutId(null);
        setState((prev) => {
          if (isLastTopic) {
            return { ...prev, phase: 'location-preferences' };
          }
          return { ...prev, topicIndex: prev.topicIndex + 1 };
        });
      }, 1800); // Show tip for 1.8 seconds

      setTipTimeoutId(timeoutId);
    } else {
      // No tip for "no" answers, move immediately
      setState((prev) => {
        if (isLastTopic) {
          return { ...prev, phase: 'location-preferences' };
        }
        return {
          ...prev,
          topicIndex: prev.topicIndex + 1
        };
      });
    }
  };

  // Go to location-preferences step (can be called anytime after first selection)
  const goToLocationPreferences = () => {
    setState((prev) => ({ ...prev, phase: 'location-preferences' }));
  };

  // Auto-detect location (stays on same phase)
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

        // Set location (stay on same phase)
        setState((prev) => ({
          ...prev,
          latitude,
          longitude,
          locationName,
        }));
        setIsLoadingLocation(false);
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

  // Load results with all preferences
  const loadResultsWithLocation = async (lat?: number, lon?: number, topics?: string[]) => {
    setIsLoadingResults(true);

    try {
      const problemAreas = (topics && topics.length > 0) ? topics : state.selectedTopics.length > 0 ? state.selectedTopics : ['stress'];

      const requestBody: Record<string, unknown> = {
        problemAreas,
        format: state.formatPreference,
        insuranceType: state.insurancePreference,
        languages: ['Deutsch'],
        maxDistanceKm: 100,
        // Neue Präferenzen
        therapistGender: state.genderPreference,
      };

      // Preis und Wartezeit wenn gesetzt
      if (state.maxPrice) {
        requestBody.priceMax = state.maxPrice * 100; // Euro zu Cent
      }
      if (state.maxWaitWeeks) {
        requestBody.maxWaitWeeks = state.maxWaitWeeks;
      }

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

      // Berechne was nicht berücksichtigt werden konnte
      const unmetPreferences: string[] = [];

      // Analysiere die Matches auf unerfüllte Kriterien
      if (data.matches && data.matches.length > 0) {
        const firstMatch = data.matches[0];
        const breakdown = firstMatch.scoreBreakdown?.components;

        // Geschlecht-Präferenz prüfen
        if (state.genderPreference !== 'any' && breakdown?.gender?.score < 1) {
          unmetPreferences.push(
            state.genderPreference === 'female'
              ? 'Bevorzugt: Therapeutin'
              : 'Bevorzugt: Therapeut'
          );
        }

        // Format-Präferenz prüfen
        if (state.formatPreference === 'ONLINE' && !firstMatch.therapist.online) {
          unmetPreferences.push('Bevorzugt: Online-Therapie');
        }
        if (state.formatPreference === 'IN_PERSON' && firstMatch.therapist.online && !firstMatch.therapist.city) {
          unmetPreferences.push('Bevorzugt: Vor-Ort-Therapie');
        }

        // Preis prüfen
        if (state.maxPrice && firstMatch.therapist.priceMin && firstMatch.therapist.priceMin > state.maxPrice * 100) {
          unmetPreferences.push(`Budget: max. ${state.maxPrice}€`);
        }

        // Wartezeit prüfen
        if (state.maxWaitWeeks && breakdown?.availability?.waitWeeks && breakdown.availability.waitWeeks > state.maxWaitWeeks) {
          unmetPreferences.push(`Wartezeit: max. ${state.maxWaitWeeks} Wochen`);
        }
      }

      // ZeroResultsAnalysis nutzen wenn vorhanden
      if (data.zeroResultsAnalysis && data.zeroResultsAnalysis.failedFilter !== 'none') {
        const analysis = data.zeroResultsAnalysis;
        if (analysis.failedFilter === 'language') {
          unmetPreferences.push('Sprache nicht verfügbar');
        } else if (analysis.failedFilter === 'format') {
          unmetPreferences.push('Format nicht verfügbar');
        } else if (analysis.failedFilter === 'insurance') {
          unmetPreferences.push('Versicherungsart nicht akzeptiert');
        }
      }

      setState((prev) => ({
        ...prev,
        matches: data.matches || [],
        unmetPreferences,
        phase: data.matches?.length > 0 ? 'therapists' : 'summary',
        therapistIndex: 0,
      }));
    } catch (error) {
      console.error('Matching error:', error);
      setState((prev) => ({ ...prev, phase: 'summary', matches: [], unmetPreferences: [] }));
    } finally {
      setIsLoadingResults(false);
    }
  };

  // Load results (wrapper for manual submission from preferences)
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

  // Therapist swipe handler (muss nach handleLike/handleSkip definiert werden)
  const handleTherapistDragEnd = createSwipeHandler(handleLike, handleSkip);

  const handleViewProfile = () => {
    if (!currentTherapist) return;
    window.open(`/therapists/${currentTherapist.therapist.id}`, '_blank');
  };

  const goToSummary = () => {
    setState((prev) => ({ ...prev, phase: 'summary' }));
  };

  // Restart
  const handleRestart = () => {
    localStorage.removeItem(QUIZ_STORAGE_KEY);
    setState(initialState);
  };

  // Show loading state until hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-2xl lg:max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="p-2 -ml-2 text-slate-600 hover:text-slate-900 flex items-center gap-2">
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Startseite</span>
          </Link>

          {/* Progress indicator */}
          {state.phase === 'topics' && (
            <span className="text-sm text-slate-500">
              {state.topicIndex + 1} / {CORE_TOPICS.length}
            </span>
          )}

          {state.phase === 'therapists' && (
            <span className="text-sm text-slate-500">
              {state.therapistIndex + 1} / {state.matches.length}
            </span>
          )}

          {/* Actions - always visible */}
          <div className="flex items-center gap-1">
            {/* Classic Matching - links to therapists page where wizard is available */}
            <Link
              href="/therapists"
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              title="Klassisches Matching"
            >
              <Settings2 className="w-4 h-4" />
            </Link>

            {/* Restart */}
            <button
              onClick={handleRestart}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              title="Von vorne beginnen"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* End/Summary */}
            {state.phase !== 'summary' && (
              <button
                onClick={goToSummary}
                className="p-2 text-slate-600 hover:text-slate-900 text-sm"
              >
                {state.phase === 'therapists' ? 'Fertig' : 'Beenden'}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
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
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0 }}
              className="space-y-6"
            >
              {/* Swipe Hint */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400 mb-2 sm:mb-3">
                <span className="flex items-center gap-1">
                  <X className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                  ← Nein
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1">
                  Ja →
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-primary-400" />
                </span>
              </div>

              {/* Topic Card - Swipeable mit optimierter Mobile UX */}
              <motion.div
                drag={!showTip ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                dragDirectionLock
                onDragEnd={createSwipeHandler(
                  () => handleTopicAnswer('yes'),
                  () => handleTopicAnswer('no')
                )}
                whileDrag={{ scale: 0.98, opacity: 0.95 }}
                style={{ x: topicX, rotate: topicRotate }}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden relative select-none touch-pan-y">

                {/* Swipe Indicators */}
                <motion.div
                  style={{ opacity: topicYesOpacity }}
                  className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                >
                  <div className="bg-primary-500/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl rotate-[-15deg] border-3 sm:border-4 border-primary-400 shadow-xl">
                    <span className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                      <Heart className="w-5 h-5 sm:w-7 sm:h-7 fill-current" /> Ja
                    </span>
                  </div>
                </motion.div>
                <motion.div
                  style={{ opacity: topicNoOpacity }}
                  className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                >
                  <div className="bg-slate-500/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl rotate-[15deg] border-3 sm:border-4 border-slate-400 shadow-xl">
                    <span className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                      <X className="w-5 h-5 sm:w-7 sm:h-7" /> Nein
                    </span>
                  </div>
                </motion.div>
                <div className="relative aspect-[3/2] sm:aspect-[4/3] md:aspect-[16/9]">
                  <Image
                    src={currentTopic.image}
                    alt={currentTopic.label}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 672px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                    <p className="text-white/80 text-xs sm:text-sm mb-1">Thema</p>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{currentTopic.label}</h2>
                  </div>
                </div>

                <div className="p-4 sm:p-6 md:p-8">
                  <p className="text-lg sm:text-xl md:text-2xl text-slate-700 text-center leading-relaxed">
                    {TOPIC_QUESTIONS[currentTopic.id]}
                  </p>
                </div>

                {/* Tip Overlay */}
                <AnimatePresence mode="wait">
                  {showTip && TOPIC_TIPS[showTip] && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => {
                        // Clear the auto-advance timeout
                        if (tipTimeoutId) {
                          clearTimeout(tipTimeoutId);
                          setTipTimeoutId(null);
                        }
                        // Skip tip and go to next question immediately
                        setShowTip(null);
                        setState((prev) => {
                          if (isLastTopic) {
                            return { ...prev, phase: 'location-preferences' };
                          }
                          return { ...prev, topicIndex: prev.topicIndex + 1 };
                        });
                      }}
                      className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 flex flex-col items-center justify-center p-6 md:p-8 text-center cursor-pointer"
                    >
                      <span className="text-5xl md:text-6xl mb-4">
                        {TOPIC_TIPS[showTip].emoji}
                      </span>
                      <p className="text-white text-lg md:text-xl font-medium leading-relaxed max-w-md">
                        {TOPIC_TIPS[showTip].tip}
                      </p>
                      <p className="text-white/50 text-sm mt-6">
                        Schnell Weiter
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Answer Buttons */}
              <div className="flex gap-3 sm:gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTopicAnswer('no')}
                  disabled={!!showTip}
                  className="flex-1 py-4 sm:py-5 rounded-2xl border-2 border-slate-200 bg-white text-slate-600 font-semibold text-base sm:text-lg hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Nein
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTopicAnswer('yes')}
                  disabled={!!showTip}
                  className="flex-1 py-4 sm:py-5 rounded-2xl bg-primary-500 text-white font-semibold text-base sm:text-lg hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ja, das kenne ich
                </motion.button>
              </div>

              {/* Blog Suggestion for current topic */}
              {currentTopicBlogPost && (
                <Link
                  href={`/blog/${currentTopicBlogPost.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
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
                    onClick={goToLocationPreferences}
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

          {/* LOCATION + PREFERENCES COMBINED */}
          {state.phase === 'location-preferences' && (
            <motion.div
              key="location-preferences"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 py-4"
            >
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Fast geschafft!</h2>
                <p className="text-slate-600">
                  Wo suchst du und was ist dir wichtig?
                </p>
              </div>

              {/* Desktop: 2-column layout, Mobile: single column */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left Column: Location */}
                <div className="space-y-4 p-4 lg:p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-500" />
                    Dein Standort
                  </h3>

                  {/* Auto-detect location button */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={detectLocation}
                    disabled={isLoadingLocation}
                    className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      state.locationName
                        ? 'bg-green-50 border-2 border-green-500 text-green-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isLoadingLocation ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                        Ermittle...
                      </>
                    ) : state.locationName ? (
                      <>
                        <Check className="w-4 h-4" />
                        {state.locationName}
                      </>
                    ) : (
                      <>
                        <Crosshair className="w-4 h-4" />
                        Automatisch ermitteln
                      </>
                    )}
                  </motion.button>

                  {locationError && (
                    <p className="text-sm text-red-500">{locationError}</p>
                  )}

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-slate-500">oder</span>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={state.postalCode}
                    onChange={(e) => setState((prev) => ({
                      ...prev,
                      postalCode: e.target.value,
                      latitude: undefined,
                      longitude: undefined,
                      locationName: undefined,
                    }))}
                    placeholder="PLZ oder Stadt"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-center"
                  />

                  <p className="text-xs text-slate-400 text-center">
                    Leer lassen für bundesweite Suche
                  </p>
                </div>

                {/* Right Column: Preferences */}
                <div className="space-y-4 p-4 lg:p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary-500" />
                    Deine Präferenzen
                  </h3>

                  {/* Geschlecht */}
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="w-4 h-4" />
                      Therapeut:in
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'any', label: 'Egal' },
                        { value: 'female', label: 'Weiblich' },
                        { value: 'male', label: 'Männlich' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setState((prev) => ({ ...prev, genderPreference: option.value as GenderPreference }))}
                          className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                            state.genderPreference === option.value
                              ? 'bg-primary-500 text-white shadow-md'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Format */}
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-sm text-slate-600">
                      <Video className="w-4 h-4" />
                      Format
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'BOTH', label: 'Beides' },
                        { value: 'ONLINE', label: 'Online' },
                        { value: 'IN_PERSON', label: 'Vor Ort' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setState((prev) => ({ ...prev, formatPreference: option.value as FormatPreference }))}
                          className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                            state.formatPreference === option.value
                              ? 'bg-primary-500 text-white shadow-md'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Versicherung */}
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-sm text-slate-600">
                      <Euro className="w-4 h-4" />
                      Kostenübernahme
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'ANY', label: 'Egal' },
                        { value: 'PUBLIC', label: 'Kasse' },
                        { value: 'PRIVATE', label: 'Privat' },
                        { value: 'SELF_PAY', label: 'Selbstzahler' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setState((prev) => ({ ...prev, insurancePreference: option.value as InsurancePreference }))}
                          className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                            state.insurancePreference === option.value
                              ? 'bg-primary-500 text-white shadow-md'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Options - Full Width */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 lg:p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                {/* Max Preis */}
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <Euro className="w-4 h-4" />
                    Max. Preis/Sitzung
                  </p>
                  <div className="flex gap-2">
                    {[null, 100, 150, 200].map((price) => (
                      <button
                        key={price ?? 'any'}
                        onClick={() => setState((prev) => ({ ...prev, maxPrice: price ?? undefined }))}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          state.maxPrice === price || (price === null && !state.maxPrice)
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {price ? `${price}€` : 'Egal'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Wartezeit */}
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    Max. Wartezeit
                  </p>
                  <div className="flex gap-2">
                    {[null, 2, 4, 8].map((weeks) => (
                      <button
                        key={weeks ?? 'any'}
                        onClick={() => setState((prev) => ({ ...prev, maxWaitWeeks: weeks ?? undefined }))}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          state.maxWaitWeeks === weeks || (weeks === null && !state.maxWaitWeeks)
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {weeks ? `${weeks} Wo.` : 'Egal'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={loadResults}
                disabled={isLoadingResults}
                className="w-full py-4 rounded-2xl bg-primary-500 text-white font-semibold text-lg hover:bg-primary-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
              >
                {isLoadingResults ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Suche läuft...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Therapeut:innen finden
                  </>
                )}
              </motion.button>

              {/* Back link */}
              <button
                onClick={() => setState((prev) => ({ ...prev, phase: 'topics', topicIndex: 0 }))}
                className="w-full py-3 text-slate-500 hover:text-slate-700 transition-colors text-sm"
              >
                ← Zurück zu den Themen
              </button>
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

          {/* THERAPISTS - No matches fallback */}
          {state.phase === 'therapists' && !currentTherapist && (
            <motion.div
              key="no-therapists"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 space-y-6"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-slate-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900">
                  Keine passenden Therapeut:innen gefunden
                </h2>
                <p className="text-slate-600 max-w-md mx-auto">
                  Leider konnten wir mit deinen Kriterien keine Matches finden.
                  Versuche es mit anderen Präferenzen oder schau dir alle Therapeut:innen an.
                </p>
              </div>
              <div className="space-y-3 max-w-sm mx-auto">
                <button
                  onClick={() => setState((prev) => ({ ...prev, phase: 'location-preferences' }))}
                  className="w-full py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
                >
                  Präferenzen anpassen
                </button>
                <Link
                  href="/therapists"
                  className="block w-full py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Alle Therapeut:innen ansehen
                </Link>
                <button
                  onClick={handleRestart}
                  className="w-full py-3 text-slate-500 hover:text-slate-700 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Quiz neu starten
                </button>
              </div>
            </motion.div>
          )}

          {/* THERAPISTS - Swipeable Cards */}
          {state.phase === 'therapists' && currentTherapist && (
            <motion.div
              key={`therapist-${state.therapistIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Swipeable Therapist Card - optimierte Mobile UX */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                dragDirectionLock
                onDragEnd={handleTherapistDragEnd}
                whileDrag={{ scale: 0.98, opacity: 0.95 }}
                style={{ x, rotate }}
                className="relative cursor-grab active:cursor-grabbing touch-pan-y"
              >
                {/* Swipe Indicators */}
                <motion.div
                  style={{ opacity: likeOpacity }}
                  className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                >
                  <div className="bg-green-500/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl rotate-[-15deg] border-3 sm:border-4 border-green-400 shadow-xl">
                    <span className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                      <Heart className="w-5 h-5 sm:w-7 sm:h-7 fill-current" /> <span className="hidden sm:inline">Interessiert</span><span className="sm:hidden">Ja</span>
                    </span>
                  </div>
                </motion.div>
                <motion.div
                  style={{ opacity: skipOpacity }}
                  className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                >
                  <div className="bg-slate-500/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl rotate-[15deg] border-3 sm:border-4 border-slate-400 shadow-xl">
                    <span className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                      <X className="w-5 h-5 sm:w-7 sm:h-7" /> <span className="hidden sm:inline">Weiter</span><span className="sm:hidden">Nein</span>
                    </span>
                  </div>
                </motion.div>

                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
                  {/* Profile Image - Mobile-optimized aspect ratio (shorter on mobile) */}
                  <div className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[16/10]">
                  {currentTherapist.therapist.profileImageUrl ? (
                    <Image
                      src={currentTherapist.therapist.profileImageUrl}
                      alt={currentTherapist.therapist.displayName || ''}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 896px"
                      priority
                      quality={85}
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

                  {/* Match Score Badge - Prominent */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
                    <div className="px-4 py-2 text-center">
                      <div className="text-3xl font-bold text-primary-600">
                        {Math.round(currentTherapist.score * 100)}%
                      </div>
                      <div className="text-xs text-slate-500 font-medium">Match</div>
                    </div>
                    {/* Unmet Preferences */}
                    {state.unmetPreferences.length > 0 && (
                      <div className="px-3 py-2 bg-amber-50 border-t border-amber-100">
                        <div className="flex items-start gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-amber-700">
                            {state.unmetPreferences.slice(0, 2).map((pref, i) => (
                              <div key={i}>{pref}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Remaining Count */}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-white text-sm">
                      Noch {remainingTherapists} {remainingTherapists === 1 ? 'Vorschlag' : 'Vorschläge'}
                    </span>
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
                    <h2 className="text-2xl md:text-3xl font-bold mb-1">
                      {currentTherapist.therapist.displayName}
                    </h2>
                    {currentTherapist.therapist.title && (
                      <p className="text-white/80 text-lg">{currentTherapist.therapist.title}</p>
                    )}

                    {/* Quick Info */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-3 text-xs sm:text-sm">
                      {currentTherapist.therapist.city && (
                        <span className="flex items-center gap-1 sm:gap-1.5 bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                          {currentTherapist.therapist.city}
                          {currentTherapist.distanceKm && ` (${Math.round(currentTherapist.distanceKm)} km)`}
                        </span>
                      )}
                      {currentTherapist.therapist.online && (
                        <span className="flex items-center gap-1 sm:gap-1.5 bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                          <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                          Online
                        </span>
                      )}
                      {currentTherapist.therapist.rating && currentTherapist.therapist.rating > 0 && (
                        <span className="flex items-center gap-1 sm:gap-1.5 bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                          {currentTherapist.therapist.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Explanation */}
                <div className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
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
              </motion.div>

              {/* Swipe Hint */}
              <p className="text-center text-xs sm:text-sm text-slate-400">
                ← Wische zum Überspringen oder Merken →
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSkip}
                  className="flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white text-slate-600 font-semibold text-base sm:text-lg hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  Weiter
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  className="flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-base sm:text-lg hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
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

              {/* Skip to Summary - prominent on mobile */}
              <button
                onClick={goToSummary}
                className="w-full py-3 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Direkt zur Übersicht ({state.favorites.length} gemerkt)
              </button>

              {/* Blog Posts - vertikal auf Mobile, horizontal auf Desktop */}
              {relevantBlogPosts.length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-medium text-slate-700">Passende Artikel für dich</span>
                  </div>
                  {/* Mobile: Einfache vertikale Liste (kein Scroll-Konflikt) */}
                  <div className="space-y-2 sm:hidden">
                    {relevantBlogPosts.slice(0, 2).map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={post.featuredImage.src}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 text-sm line-clamp-2">{post.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{post.readingTime}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                  {/* Desktop: Horizontaler Scroll */}
                  <div className="hidden sm:flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                    {relevantBlogPosts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 w-64 bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
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

              {/* Unmet Preferences Info */}
              {state.unmetPreferences.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Folgende Präferenzen konnten nicht vollständig berücksichtigt werden:
                      </p>
                      <ul className="mt-2 text-sm text-amber-700 space-y-1">
                        {state.unmetPreferences.map((pref, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                            {pref}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-xs text-amber-600">
                        Wir haben dir die besten verfügbaren Matches gezeigt.
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                        target="_blank"
                        rel="noopener noreferrer"
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
                        target="_blank"
                        rel="noopener noreferrer"
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

              {/* Alternative Tools */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Intensive Test Link */}
                <div className="bg-slate-50 rounded-2xl p-5 text-center space-y-2">
                  <ClipboardCheck className="w-7 h-7 text-slate-400 mx-auto" />
                  <p className="text-slate-600 text-sm">
                    Ausführlichere Einschätzung?
                  </p>
                  <Link
                    href="/triage"
                    className="inline-flex items-center gap-1 text-primary-600 font-medium hover:underline text-sm"
                  >
                    Zum wissenschaftlichen Test
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Classic Matching Link */}
                <div className="bg-slate-50 rounded-2xl p-5 text-center space-y-2">
                  <Settings2 className="w-7 h-7 text-slate-400 mx-auto" />
                  <p className="text-slate-600 text-sm">
                    Lieber Schritt für Schritt?
                  </p>
                  <Link
                    href="/therapists"
                    className="inline-flex items-center gap-1 text-primary-600 font-medium hover:underline text-sm"
                  >
                    Klassisches Matching
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  href="/therapists"
                  target="_blank"
                  rel="noopener noreferrer"
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
