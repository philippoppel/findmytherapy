'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  Info,
  Heart,
  BookOpen,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@mental-health/ui';
import { track } from '../../lib/analytics';
import { useTranslation } from '@/lib/i18n';
import {
  standardResponseOptions,
  supportOptions,
  availabilityOptions,
  calculatePHQ9Severity,
  calculateGAD7Severity,
  assessRiskLevel,
  phq9SeverityLabels,
  phq9SeverityDescriptions,
  gad7SeverityLabels,
  gad7SeverityDescriptions,
} from '../../lib/triage/questionnaires';
import {
  phq2Questions,
  gad2Questions,
  phq9RemainingQuestions,
  gad7RemainingQuestions,
  shouldExpandPHQ9,
  shouldExpandGAD7,
  adaptiveScreeningInfo,
} from '../../lib/triage/adaptive-questionnaires';
import { QuestionTooltip } from './QuestionTooltip';
import { AmpelVisualization } from './AmpelVisualization';
import { CrisisResources } from './CrisisResources';
import { ProgressChart } from './ProgressChart';
import { blogPosts, type BlogPost } from '../../lib/blogData';
import { useUserPreferences } from '@/hooks/useUserPreferences';

// Emotionale Stockbilder für verschiedene Phasen
const PHASE_IMAGES = {
  intro: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&h=800&q=80',
  phq2: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&w=1200&h=800&q=80',
  phq9: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=1200&h=800&q=80',
  gad2: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?auto=format&fit=crop&w=1200&h=800&q=80',
  gad7: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&h=800&q=80',
  preferences: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&h=800&q=80',
  transition: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&h=800&q=80',
  summary: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&h=800&q=80',
};

// Function to get emotional phase text using translations
const getEmotionalPhaseText = (phase: string, t: (key: string) => string) => {
  const phaseTexts: Record<string, { title: string; subtitle: string; encouragement: string }> = {
    phq2: {
      title: t('triageFlow.howAreYouReally'),
      subtitle: t('triageFlow.howAreYouReallyDesc'),
      encouragement: t('triageFlow.howAreYouReallyNote'),
    },
    phq9: {
      title: t('triageFlow.letsLookCloser'),
      subtitle: t('triageFlow.letsLookCloserDesc'),
      encouragement: t('triageFlow.letsLookCloserNote'),
    },
    gad2: {
      title: t('triageFlow.howDoYouFeel'),
      subtitle: t('triageFlow.howDoYouFeelDesc'),
      encouragement: t('triageFlow.howDoYouFeelNote'),
    },
    gad7: {
      title: t('triageFlow.togetherUnderstand'),
      subtitle: t('triageFlow.togetherUnderstandDesc'),
      encouragement: t('triageFlow.togetherUnderstandNote'),
    },
    preferences: {
      title: t('triageFlow.almostDone'),
      subtitle: t('triageFlow.almostDoneDesc'),
      encouragement: t('triageFlow.almostDoneNote'),
    },
  };
  return phaseTexts[phase] || phaseTexts.phq2;
};

// Keywords für Blog-Suche passend zu Themen
const TOPIC_BLOG_KEYWORDS: Record<string, string[]> = {
  depression: ['Depression', 'depressiv', 'Niedergeschlagenheit', 'Antriebslosigkeit', 'Traurigkeit', 'Hoffnungslosigkeit'],
  anxiety: ['Angst', 'Panik', 'Angststörung', 'Panikattacken', 'Sorgen', 'Unruhe', 'GAD'],
  general: ['Selbstfürsorge', 'Wohlbefinden', 'mentale Gesundheit', 'Entspannung', 'Achtsamkeit'],
};

// Helper: Get relevant blog posts based on current phase
function getRelevantBlogPosts(phase: string, limit: number = 2): BlogPost[] {
  let keywords: string[] = [];

  if (phase.includes('phq')) {
    keywords = TOPIC_BLOG_KEYWORDS.depression;
  } else if (phase.includes('gad')) {
    keywords = TOPIC_BLOG_KEYWORDS.anxiety;
  } else {
    keywords = TOPIC_BLOG_KEYWORDS.general;
  }

  // Score each blog post by how many keywords match
  const scoredPosts = blogPosts.map(post => {
    let score = 0;
    const searchText = `${post.title} ${post.excerpt} ${post.tags.join(' ')} ${post.keywords.join(' ')}`.toLowerCase();

    keywords.forEach(keyword => {
      if (searchText.includes(keyword.toLowerCase())) {
        score += 1;
      }
    });

    // Add random factor for variety (so not always same posts)
    const randomFactor = Math.random() * 0.5;
    return { post, score: score + randomFactor };
  });

  // Return top posts sorted by score
  return scoredPosts
    .filter(item => item.score > 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

// Helper: Get a random encouraging message (kept for potential future use)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _getEncouragingMessage(phase: string): string {
  const messages = {
    phq: [
      'Du machst das toll.',
      'Jede Antwort bringt dich weiter.',
      'Nimm dir die Zeit, die du brauchst.',
      'Deine Gefühle sind wichtig.',
    ],
    gad: [
      'Es ist okay, Ängste zu haben.',
      'Du bist stärker, als du denkst.',
      'Ein Schritt nach dem anderen.',
      'Wir sind hier für dich.',
    ],
  };

  const key = phase.includes('phq') ? 'phq' : 'gad';
  const list = messages[key];
  return list[Math.floor(Math.random() * list.length)];
}

type Answers = {
  phq9: number[];
  gad7: number[];
  support: string[];
  availability: string[];
};

const initialAnswers: Answers = {
  phq9: [],
  gad7: [],
  support: [],
  availability: [],
};

type TherapistRecommendation = {
  id: string;
  name: string;
  title: string;
  headline?: string;
  focus: string[];
  availability: string;
  location: string;
  rating: number;
  reviews: number;
  status: string;
  formatTags: Array<'online' | 'praesenz' | 'hybrid'>;
  highlights: string[];
  acceptingClients?: boolean;
  services?: string[];
  responseTime?: string;
  yearsExperience?: number;
  languages?: string[];
  image?: string | null;
};

type CourseRecommendation = {
  slug: string;
  title: string;
  shortDescription: string;
  focus: string;
  duration: string;
  format: string;
  outcomes: string[];
  highlights: string[];
};

type AdaptiveTriageFlowProps = {
  embedded?: boolean;
  historicalData?: Array<{
    date: string;
    phq9Score: number;
    gad7Score: number;
  }>;
};

type Phase =
  | 'phq2'
  | 'phq9-expanded'
  | 'phq2-to-gad2'
  | 'gad2'
  | 'gad7-expanded'
  | 'gad2-to-preferences'
  | 'preferences';

export function AdaptiveTriageFlow({
  embedded = false,
  historicalData = [],
}: AdaptiveTriageFlowProps = {}) {
  const { t } = useTranslation();
  const [currentPhase, setCurrentPhase] = useState<Phase>('phq2');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [showSummary, setShowSummary] = useState(false);
  const [recommendations, setRecommendations] = useState<{
    therapists: TherapistRecommendation[];
    courses: CourseRecommendation[];
  }>({ therapists: [], courses: [] });
  const [hasPersisted, setHasPersisted] = useState(false);
  const [forceFullTest, setForceFullTest] = useState(false);
  const { saveTriageResults } = useUserPreferences();

  // Get current questions based on phase
  const currentQuestions = useMemo(() => {
    if (currentPhase === 'phq2') return phq2Questions;
    if (currentPhase === 'phq9-expanded') return phq9RemainingQuestions;
    if (currentPhase === 'gad2') return gad2Questions;
    if (currentPhase === 'gad7-expanded') return gad7RemainingQuestions;
    return [];
  }, [currentPhase]);

  // Calculate progress dynamically based on adaptive flow
  const { expectedTotalQuestions, answeredQuestions } = useMemo(() => {
    const phq2Score = answers.phq9.slice(0, 2).reduce((sum, val) => sum + (val ?? 0), 0);
    const gad2Score = answers.gad7.slice(0, 2).reduce((sum, val) => sum + (val ?? 0), 0);

    const needsFullPHQ9 = shouldExpandPHQ9(phq2Score);
    const needsFullGAD7 = shouldExpandGAD7(gad2Score);

    // Calculate expected total based on screening results
    let expected = 2 + 2 + 2; // PHQ-2 + GAD-2 + preferences (minimum)
    if (needsFullPHQ9 || currentPhase === 'phq9-expanded' || answers.phq9.length > 2) {
      expected += 7; // Add remaining PHQ-9 questions
    }
    if (needsFullGAD7 || currentPhase === 'gad7-expanded' || answers.gad7.length > 2) {
      expected += 5; // Add remaining GAD-7 questions
    }

    const answered =
      answers.phq9.length +
      answers.gad7.length +
      (answers.support.length > 0 ? 1 : 0) +
      (answers.availability.length > 0 ? 1 : 0);

    return { expectedTotalQuestions: expected, answeredQuestions: answered };
  }, [answers, currentPhase]);

  const progress = Math.round((answeredQuestions / expectedTotalQuestions) * 100);

  const handleScaleAnswer = (value: number) => {
    // Determine which answer array to update based on phase
    const isPhqPhase = currentPhase === 'phq2' || currentPhase === 'phq9-expanded';
    const key = isPhqPhase ? 'phq9' : 'gad7';

    // Calculate the correct index in the full questionnaire array
    let actualIndex = questionIndex;
    if (currentPhase === 'phq9-expanded') {
      actualIndex = questionIndex + 2; // Offset by PHQ-2 questions
    } else if (currentPhase === 'gad7-expanded') {
      actualIndex = questionIndex + 2; // Offset by GAD-2 questions
    }

    setAnswers((prev) => {
      const newAnswers = { ...prev };
      const currentAnswers = [...newAnswers[key]];
      currentAnswers[actualIndex] = value;
      newAnswers[key] = currentAnswers;
      return newAnswers;
    });

    setTimeout(() => {
      if (questionIndex < currentQuestions.length - 1) {
        // Move to next question in current section
        setQuestionIndex(questionIndex + 1);
      } else {
        // Finished current section, determine next phase
        setQuestionIndex(0);

        if (currentPhase === 'phq2') {
          // Check if we need to expand to full PHQ-9
          const phq2Answers = answers.phq9.slice(0, 2);
          phq2Answers[questionIndex] = value; // Include the answer we just gave
          const phq2Score = phq2Answers.reduce((sum, val) => sum + (val ?? 0), 0);

          if (forceFullTest || shouldExpandPHQ9(phq2Score)) {
            // Show transition message, then expand
            setCurrentPhase('phq2-to-gad2');
            setTimeout(() => {
              setCurrentPhase('phq9-expanded');
            }, 1000);
          } else {
            // PHQ-2 score is low, move to GAD-2
            setCurrentPhase('phq2-to-gad2');
            setTimeout(() => {
              setCurrentPhase('gad2');
            }, 1000);
          }
        } else if (currentPhase === 'phq9-expanded') {
          // Finished expanded PHQ-9, move to GAD-2
          setCurrentPhase('phq2-to-gad2');
          setTimeout(() => {
            setCurrentPhase('gad2');
          }, 1000);
        } else if (currentPhase === 'gad2') {
          // Check if we need to expand to full GAD-7
          const gad2Answers = answers.gad7.slice(0, 2);
          gad2Answers[questionIndex] = value; // Include the answer we just gave
          const gad2Score = gad2Answers.reduce((sum, val) => sum + (val ?? 0), 0);

          if (forceFullTest || shouldExpandGAD7(gad2Score)) {
            // Show transition message, then expand
            setCurrentPhase('gad2-to-preferences');
            setTimeout(() => {
              setCurrentPhase('gad7-expanded');
            }, 1000);
          } else {
            // GAD-2 score is low, move to preferences
            setCurrentPhase('gad2-to-preferences');
            setTimeout(() => {
              setCurrentPhase('preferences');
            }, 1000);
          }
        } else if (currentPhase === 'gad7-expanded') {
          // Finished expanded GAD-7, move to preferences
          setCurrentPhase('gad2-to-preferences');
          setTimeout(() => {
            setCurrentPhase('preferences');
          }, 1000);
        }
      }
    }, 200);
  };

  const toggleMultipleSelect = (option: string, type: 'support' | 'availability') => {
    setAnswers((prev) => {
      const currentAnswers = prev[type];
      const alreadySelected = currentAnswers.includes(option);

      return {
        ...prev,
        [type]: alreadySelected
          ? currentAnswers.filter((item) => item !== option)
          : [...currentAnswers, option],
      };
    });
  };

  const goNext = () => {
    if (currentPhase === 'preferences') {
      setShowSummary(true);
    }
  };

  const goPrevious = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    } else {
      // At first question of current phase, go to previous phase
      if (currentPhase === 'phq9-expanded') {
        setCurrentPhase('phq2');
        setQuestionIndex(phq2Questions.length - 1);
      } else if (currentPhase === 'gad2') {
        // Go back based on whether PHQ-9 was expanded
        if (answers.phq9.length > 2) {
          setCurrentPhase('phq9-expanded');
          setQuestionIndex(phq9RemainingQuestions.length - 1);
        } else {
          setCurrentPhase('phq2');
          setQuestionIndex(phq2Questions.length - 1);
        }
      } else if (currentPhase === 'gad7-expanded') {
        setCurrentPhase('gad2');
        setQuestionIndex(gad2Questions.length - 1);
      } else if (currentPhase === 'preferences') {
        // Go back based on whether GAD-7 was expanded
        if (answers.gad7.length > 2) {
          setCurrentPhase('gad7-expanded');
          setQuestionIndex(gad7RemainingQuestions.length - 1);
        } else {
          setCurrentPhase('gad2');
          setQuestionIndex(gad2Questions.length - 1);
        }
      }
    }
  };

  const resetFlow = (fullTest = false) => {
    setAnswers(initialAnswers);
    setCurrentPhase('phq2');
    setQuestionIndex(0);
    setShowSummary(false);
    setRecommendations({ therapists: [], courses: [] });
    setHasPersisted(false);
    setForceFullTest(fullTest);
    sessionStorage.removeItem('triage-session');
  };

  // Calculate final scores
  const {
    phq9Score,
    gad7Score,
    phq9Severity,
    gad7Severity,
    riskLevel,
    ampelColor,
    requiresEmergency,
    phq9Item9Score,
    hasSuicidalIdeation,
  } = useMemo(() => {
    const phq9Total = answers.phq9.reduce((sum, val) => sum + (val ?? 0), 0);
    const gad7Total = answers.gad7.reduce((sum, val) => sum + (val ?? 0), 0);
    const item9Score = answers.phq9[8] ?? 0;

    const phq9Sev = calculatePHQ9Severity(phq9Total);
    const gad7Sev = calculateGAD7Severity(gad7Total);
    const risk = assessRiskLevel(phq9Total, gad7Total, { phq9Item9Score: item9Score });

    return {
      phq9Score: phq9Total,
      gad7Score: gad7Total,
      phq9Severity: phq9Sev,
      gad7Severity: gad7Sev,
      riskLevel: risk.level,
      ampelColor: risk.ampelColor,
      requiresEmergency: risk.requiresEmergency,
      phq9Item9Score: item9Score,
      hasSuicidalIdeation: risk.hasSuicidalIdeation,
    };
  }, [answers]);

  const persistResults = useCallback(
    async ({ force = false }: { force?: boolean } = {}) => {
      if (hasPersisted && !force) return;

      if (embedded) {
        setTimeout(() => {
          setHasPersisted(true);
          track('triage_completed', {
            assessmentType: 'full',
            phq9Score,
            gad7Score,
            riskLevel,
            source: 'embedded',
            requiresEmergency,
            hasSuicidalIdeation,
          });
        }, 1000);
        return;
      }

      try {
        // Ensure arrays are padded to correct length for API validation
        const paddedPhq9 = [...answers.phq9];
        while (paddedPhq9.length < 9) {
          paddedPhq9.push(0);
        }

        const paddedGad7 = [...answers.gad7];
        while (paddedGad7.length < 7) {
          paddedGad7.push(0);
        }

        const response = await fetch('/api/triage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assessmentType: 'full',
            phq9Answers: paddedPhq9,
            gad7Answers: paddedGad7,
            phq9Score,
            gad7Score,
            phq9Severity,
            gad7Severity,
            supportPreferences: answers.support,
            availability: answers.availability,
            riskLevel,
            requiresEmergency,
            phq9Item9Score,
            hasSuicidalIdeation,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Fehler beim Speichern');
        }

        setRecommendations({
          therapists: data.recommendations?.therapists || [],
          courses: data.recommendations?.courses || [],
        });

        track('triage_completed', {
          assessmentType: 'full',
          phq9Score,
          gad7Score,
          phq9Severity,
          gad7Severity,
          riskLevel,
          requiresEmergency,
          hasSuicidalIdeation,
        });
      } catch (error) {
        console.error('Failed to persist triage results', error);
        track('triage_save_failed', {
          message: error instanceof Error ? error.message : 'unknown',
        });
      } finally {
        setHasPersisted(true);
      }
    },
    [
      answers,
      phq9Score,
      gad7Score,
      phq9Severity,
      gad7Severity,
      riskLevel,
      requiresEmergency,
      embedded,
      hasPersisted,
      phq9Item9Score,
      hasSuicidalIdeation,
    ],
  );

  useEffect(() => {
    if (!showSummary) return;
    void persistResults();

    // Speichere Triage-Ergebnisse in localStorage für personalisierte Blog-Empfehlungen
    const topics: string[] = [];
    if (phq9Score >= 5) topics.push('depression');
    if (gad7Score >= 5) topics.push('angst');
    if (phq9Score >= 10 || gad7Score >= 10) topics.push('stress');

    saveTriageResults({
      topics,
      severity: phq9Severity as 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe',
      phq9Score,
      gad7Score,
    });
  }, [showSummary, persistResults, phq9Score, gad7Score, phq9Severity, saveTriageResults]);

  // Save session state when showing summary
  useEffect(() => {
    if (!showSummary) return;

    const sessionState = {
      answers,
      recommendations,
      timestamp: Date.now(),
    };

    sessionStorage.setItem('triage-session', JSON.stringify(sessionState));
  }, [showSummary, answers, recommendations]);

  // Restore session state on mount
  useEffect(() => {
    const savedSession = sessionStorage.getItem('triage-session');
    if (!savedSession) return;

    try {
      const sessionState = JSON.parse(savedSession);

      // Check if session is less than 24 hours old
      const age = Date.now() - sessionState.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (age > maxAge) {
        sessionStorage.removeItem('triage-session');
        return;
      }

      // Restore state
      setAnswers(sessionState.answers);
      setRecommendations(sessionState.recommendations);
      setShowSummary(true);
      setHasPersisted(true);
    } catch (error) {
      console.error('Failed to restore triage session', error);
      sessionStorage.removeItem('triage-session');
    }
  }, []);

  // Get phase info (must be before early return for React Hooks rules)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const phaseInfo = useMemo(() => {
    if (currentPhase === 'phq2') {
      return {
        title: adaptiveScreeningInfo.initial.title,
        description:
          'Wir beginnen mit 2 kurzen Fragen zu deiner Stimmung in den letzten zwei Wochen.',
      };
    }
    if (currentPhase === 'phq9-expanded') {
      return {
        title: 'Detaillierte Depressions-Einschätzung',
        description: adaptiveScreeningInfo.expanding.description,
      };
    }
    if (currentPhase === 'gad2') {
      return {
        title: 'Angst Screening',
        description: 'Jetzt 2 kurze Fragen zu Angst und Sorgen in den letzten zwei Wochen.',
      };
    }
    if (currentPhase === 'gad7-expanded') {
      return {
        title: 'Detaillierte Angst-Einschätzung',
        description: adaptiveScreeningInfo.expanding.description,
      };
    }
    if (currentPhase === 'preferences') {
      return {
        title: 'Deine Präferenzen',
        description: 'Zum Abschluss noch ein paar Fragen zu deinen Wünschen.',
      };
    }
    return { title: '', description: '' };
  }, [currentPhase]);

  // Get summary blog posts based on both PHQ and GAD results
  const summaryBlogPosts = useMemo(() => {
    const allKeywords = [...TOPIC_BLOG_KEYWORDS.depression, ...TOPIC_BLOG_KEYWORDS.anxiety, ...TOPIC_BLOG_KEYWORDS.general];

    const scoredPosts = blogPosts.map(post => {
      let score = 0;
      const searchText = `${post.title} ${post.excerpt} ${post.tags.join(' ')} ${post.keywords.join(' ')}`.toLowerCase();

      allKeywords.forEach(keyword => {
        if (searchText.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });

      const randomFactor = Math.random() * 0.5;
      return { post, score: score + randomFactor };
    });

    return scoredPosts
      .filter(item => item.score > 0.5)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.post);
  }, []);

  // Get relevant blog posts for current phase (must be before early return for React Hooks rules)
  const currentBlogPosts = useMemo(() => getRelevantBlogPosts(currentPhase, 2), [currentPhase]);

  // Summary view
  if (showSummary) {
    // Full assessment summary
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section with Image */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <Image
            src={PHASE_IMAGES.summary}
            alt={t('triageFlow.yourResults')}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-slate-50" />
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => resetFlow(false)}
              className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/30"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t('triage.repeatTest')}</span>
              <span className="sm:hidden">{t('common.new')}</span>
            </Button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
              <span>{t('triage.backToHome')}</span>
            </Link>
          </div>
          <div className="absolute bottom-8 left-0 right-0 text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-slate-700">{t('triage.assessmentCompleted')}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
                {t('triage.yourPersonalResults')}
              </h1>
            </motion.div>
          </div>
        </div>

        <div className="relative mx-auto max-w-4xl space-y-6 px-4 -mt-6 pb-12">
          {historicalData.length > 0 && (
            <ProgressChart
              data={[...historicalData, { date: new Date().toISOString(), phq9Score, gad7Score }]}
            />
          )}

          <AmpelVisualization
            color={ampelColor}
            phq9Score={phq9Score}
            gad7Score={gad7Score}
            phq9Severity={phq9Severity}
            gad7Severity={gad7Severity}
          />

          {requiresEmergency && <CrisisResources />}

          <div className="rounded-3xl bg-white shadow-xl border border-slate-100 p-6 sm:p-8">
            <header className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                {t('triage.recommendedNextSteps')}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {t('triage.whatYouCanDoNow')}
              </h3>
              <p className="mt-2 text-slate-600 max-w-xl mx-auto">
                {t('triage.basedOnYourAnswers')}
              </p>
            </header>

            {/* Hinweis auf verkürzten Test */}
            {(answers.phq9.length === 2 || answers.gad7.length === 2) && (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <Info className="h-6 w-6 text-amber-600" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 sm:text-xl">
                    {t('triage.shortenedAssessment')}
                  </h4>
                  <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-base">
                    {answers.phq9.length === 2 && answers.gad7.length === 2 ? (
                      t('triage.shortenedBoth')
                    ) : answers.phq9.length === 2 ? (
                      t('triage.shortenedMood')
                    ) : (
                      t('triage.shortenedWellbeing')
                    )}
                  </p>
                  <Button
                    onClick={() => resetFlow(true)}
                    size="md"
                    className="mt-4 bg-amber-500 px-6 font-semibold text-white hover:bg-amber-600 shadow-md"
                  >
                    {t('triage.fullTestCta')}
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    Stimmung: {phq9SeverityLabels[phq9Severity]}
                  </h4>
                </div>
                <p className="text-sm text-slate-600">
                  {phq9SeverityDescriptions[phq9Severity]}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    Wohlbefinden: {gad7SeverityLabels[gad7Severity]}
                  </h4>
                </div>
                <p className="text-sm text-slate-600">
                  {gad7SeverityDescriptions[gad7Severity]}
                </p>
              </div>
            </div>

            {/* Konkrete Therapeuten-Empfehlungen */}
            {riskLevel !== 'LOW' && (
              <div className="mt-8 rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-slate-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900">
                      {t('triage.weRecommendProfessional')}
                    </h4>
                    <p className="mt-2 text-slate-600">
                      {t('triage.conversationMightHelp')}
                    </p>
                    <div className="mt-4">
                      <Button
                        asChild
                        size="lg"
                        className="w-full bg-primary-500 text-white hover:bg-primary-600 shadow-lg sm:w-auto"
                      >
                        <Link href="/therapists">{t('triage.findTherapist')}</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Präventive Unterstützung für LOW risk */}
            {riskLevel === 'LOW' && (
              <div className="mt-8 rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-slate-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900">{t('triage.looksGood')}</h4>
                    <p className="mt-2 text-slate-600">
                      {t('triage.stableWellbeing')}
                    </p>
                    <div className="mt-4">
                      <Button
                        asChild
                        size="lg"
                        className="w-full bg-green-500 text-white hover:bg-green-600 shadow-lg sm:w-auto"
                      >
                        <Link href="/therapists">{t('triage.discoverTherapists')}</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Show therapist recommendations or helpful message */}
            <section className="mt-8">
              {recommendations.therapists.length > 0 ? (
                <>
                  <h4 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">
                    {riskLevel === 'LOW'
                      ? t('triageFlow.therapistsPreventive')
                      : t('triageFlow.therapistsForYou')}
                  </h4>
                  <div className="space-y-4">
                    {recommendations.therapists.map((therapist) => (
                      <article
                        key={therapist.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6"
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-1 gap-3 sm:gap-4">
                            {therapist.image && (
                              <div className="flex-shrink-0">
                                <Image
                                  src={therapist.image}
                                  alt={therapist.name}
                                  width={120}
                                  height={120}
                                  className="h-16 w-16 rounded-xl object-cover object-center sm:h-24 sm:w-24 shadow-sm"
                                  sizes="(max-width: 640px) 64px, 96px"
                                  quality={90}
                                />
                              </div>
                            )}
                            <div className="flex-1 space-y-2 sm:space-y-3">
                              <div>
                                <h5 className="text-base font-bold text-slate-900 sm:text-lg">
                                  {therapist.name}
                                </h5>
                                <p className="text-xs text-slate-500 sm:text-sm">
                                  {therapist.title}
                                </p>
                                {therapist.headline ? (
                                  <p className="mt-1 text-xs text-slate-600 sm:text-sm italic">
                                    &ldquo;{therapist.headline}&rdquo;
                                  </p>
                                ) : null}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span>{therapist.focus.slice(0, 3).join(' • ')}</span>
                                <span aria-hidden>•</span>
                                <span>{therapist.location}</span>
                              </div>
                              {therapist.services && therapist.services.length > 0 ? (
                                <div className="mt-1 flex flex-wrap gap-2">
                                  {therapist.services.slice(0, 3).map((service) => (
                                    <span
                                      key={service}
                                      className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                                    >
                                      {service}
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                              <div className="flex flex-wrap gap-2 text-xs">
                                {therapist.formatTags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600"
                                  >
                                    {tag === 'online'
                                      ? t('triageFlow.formatOnline')
                                      : tag === 'praesenz'
                                        ? t('triageFlow.formatOnSite')
                                        : t('triageFlow.formatHybrid')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 sm:items-end">
                            <Button
                              asChild
                              className="w-full bg-primary-500 text-white hover:bg-primary-600 shadow-md sm:w-auto"
                            >
                              <Link href={`/therapists/${therapist.id}?from=triage`}>
                                {t('triageFlow.viewProfile')}
                              </Link>
                            </Button>
                            {therapist.acceptingClients === false ? (
                              <span className="text-xs font-medium text-amber-600">
                                {t('triageFlow.currentlyWaitlist')}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h4 className="text-lg font-bold text-slate-900">{t('triageFlow.findYourSupport')}</h4>
                  <p className="mt-2 text-sm text-slate-600">
                    {t('triageFlow.findSupportDesc')}
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 sm:w-auto"
                    >
                      <Link href="/therapists">{t('triageFlow.discoverTherapistsBtn')}</Link>
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 sm:w-auto"
                    >
                      <Link href="/contact">{t('triageFlow.contactUs')}</Link>
                    </Button>
                  </div>
                </div>
              )}
            </section>

            {recommendations.courses.length > 0 && (
              <section className="mt-8">
                <h4 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">
                  {t('triageFlow.recommendedPrograms')}
                </h4>
                <div className="space-y-4">
                  {recommendations.courses.map((course) => (
                    <article
                      key={course.slug}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
                    >
                      <h5 className="text-base font-bold text-slate-900 sm:text-lg">{course.title}</h5>
                      <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                        {course.shortDescription}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:gap-3">
                        <span>{course.duration}</span>
                        <span aria-hidden>•</span>
                        <span>{course.format}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {course.outcomes.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-primary-50 px-2.5 py-1 text-[10px] font-medium text-primary-700 sm:px-3 sm:text-[11px]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="mt-4 w-full border-slate-300 text-slate-700 hover:bg-slate-100 sm:w-auto"
                      >
                        <Link href={`/courses/${course.slug}`}>{t('triageFlow.viewDemo')}</Link>
                      </Button>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Blog Carousel - Passende Artikel */}
            {summaryBlogPosts.length > 0 && (
              <section className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-slate-900 sm:text-xl flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary-500" />
                    {t('triageFlow.matchingArticles')}
                  </h4>
                  <Link href="/blog" className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1">
                    {t('triageFlow.allArticles')}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
                  {summaryBlogPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="flex-shrink-0 w-72 bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow snap-start"
                    >
                      <div className="relative h-40">
                        <Image
                          src={post.featuredImage.src}
                          alt={post.featuredImage.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                        <h5 className="font-bold text-slate-900 mt-2 line-clamp-2">{post.title}</h5>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{post.excerpt}</p>
                        <p className="text-xs text-slate-400 mt-2">{post.readingTime}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Question flow
  const currentQuestion = currentQuestions[questionIndex];
  const isPreferences = currentPhase === 'preferences';
  const isTransition = currentPhase === 'phq2-to-gad2' || currentPhase === 'gad2-to-preferences';

  // Get current phase image
  const getCurrentPhaseImage = () => {
    if (currentPhase === 'phq2') return PHASE_IMAGES.phq2;
    if (currentPhase === 'phq9-expanded') return PHASE_IMAGES.phq9;
    if (currentPhase === 'gad2') return PHASE_IMAGES.gad2;
    if (currentPhase === 'gad7-expanded') return PHASE_IMAGES.gad7;
    if (currentPhase === 'preferences') return PHASE_IMAGES.preferences;
    return PHASE_IMAGES.transition;
  };

  // Get emotional text for current phase
  const getEmotionalText = () => {
    if (currentPhase === 'phq2') return getEmotionalPhaseText('phq2', t);
    if (currentPhase === 'phq9-expanded') return getEmotionalPhaseText('phq9', t);
    if (currentPhase === 'gad2') return getEmotionalPhaseText('gad2', t);
    if (currentPhase === 'gad7-expanded') return getEmotionalPhaseText('gad7', t);
    if (currentPhase === 'preferences') return getEmotionalPhaseText('preferences', t);
    return getEmotionalPhaseText('phq2', t);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Image Section */}
      <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
        <Image
          src={getCurrentPhaseImage()}
          alt={t('triageFlow.emotionalImage')}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-slate-50" />
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
            <span>{t('triageFlow.backToHome')}</span>
          </Link>
          <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
            {t('triageFlow.progressPercent', { progress })}
          </div>
        </div>
        <div className="absolute bottom-6 left-0 right-0 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-slate-700">
              {getEmotionalText().encouragement}
            </span>
          </motion.div>
        </div>
      </div>

      <div className="relative mx-auto max-w-2xl px-4 -mt-6">
        {/* Main Card */}
        <div className="rounded-3xl bg-white shadow-xl border border-slate-100 overflow-hidden">
          {/* Progress Bar */}
          <div className="px-6 pt-6">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {isTransition ? (
                <motion.div
                  key="transition"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="py-8"
                >
                  {/* Transition with Image and Blog Recommendation */}
                  <div className="text-center space-y-6">
                    <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg">
                      <Image
                        src={currentPhase === 'phq2-to-gad2' ? PHASE_IMAGES.gad2 : PHASE_IMAGES.preferences}
                        alt={t('triageFlow.progressInTriage')}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {currentPhase === 'phq2-to-gad2' ? (
                      <>
                        {!shouldExpandPHQ9(
                          answers.phq9.slice(0, 2).reduce((sum, val) => sum + (val ?? 0), 0),
                        ) ? (
                          <>
                            <div>
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 mb-4">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-medium">{t('triageFlow.wellDone')}</span>
                              </div>
                              <h3 className="text-2xl font-bold text-slate-900">
                                {t('triageFlow.looksGoodTitle')}
                              </h3>
                              <p className="mt-2 text-slate-600 max-w-md mx-auto">
                                {t('triageFlow.looksGoodDesc')}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 mb-4">
                                <Heart className="w-5 h-5" />
                                <span className="font-medium">{t('triageFlow.weListenToYou')}</span>
                              </div>
                              <h3 className="text-2xl font-bold text-slate-900">
                                {t('triageFlow.thankYouOpenness')}
                              </h3>
                              <p className="mt-2 text-slate-600 max-w-md mx-auto">
                                {t('triageFlow.opennessDesc')}
                              </p>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {!shouldExpandGAD7(
                          answers.gad7.slice(0, 2).reduce((sum, val) => sum + (val ?? 0), 0),
                        ) ? (
                          <>
                            <div>
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 mb-4">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-medium">{t('triageFlow.almostDoneTitle')}</span>
                              </div>
                              <h3 className="text-2xl font-bold text-slate-900">
                                {t('triageFlow.oneMoreStep')}
                              </h3>
                              <p className="mt-2 text-slate-600 max-w-md mx-auto">
                                {t('triageFlow.oneMoreStepDesc')}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 mb-4">
                                <Heart className="w-5 h-5" />
                                <span className="font-medium">{t('triageFlow.youAreNotAlone')}</span>
                              </div>
                              <h3 className="text-2xl font-bold text-slate-900">
                                {t('triageFlow.weUnderstandYou')}
                              </h3>
                              <p className="mt-2 text-slate-600 max-w-md mx-auto">
                                {t('triageFlow.anxietyDesc')}
                              </p>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* Blog Recommendation during Transition */}
                    {currentBlogPosts.length > 0 && (
                      <div className="pt-4">
                        <Link
                          href={`/blog/${currentBlogPosts[0].slug}`}
                          className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left max-w-md mx-auto"
                        >
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={currentBlogPosts[0].featuredImage.src}
                              alt={currentBlogPosts[0].featuredImage.alt || currentBlogPosts[0].title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-primary-600 font-medium flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {t('triageFlow.readingTip')}
                            </p>
                            <p className="text-sm font-medium text-slate-700 line-clamp-1">{currentBlogPosts[0].title}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        </Link>
                      </div>
                    )}

                    <div className="pt-2">
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                        <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                        {t('triageFlow.continueInMoment')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`${currentPhase}-${questionIndex}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {isPreferences ? (
                    <div className="space-y-6">
                      {/* Preferences Header with Image */}
                      <header className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden shadow-md">
                          <Image
                            src={PHASE_IMAGES.preferences}
                            alt={t('triageFlow.selectPreferences')}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">{getEmotionalText().title}</h1>
                        <p className="mt-2 text-slate-600">
                          {getEmotionalText().subtitle}
                        </p>
                      </header>

                    <div>
                      <p className="mb-3 text-sm font-semibold text-slate-700">
                        {t('triageFlow.whatSupportWish')}
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {supportOptions.map((option) => {
                          const selected = answers.support.includes(option.value);
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => toggleMultipleSelect(option.value, 'support')}
                              className={`rounded-xl border p-3 text-left transition sm:p-4 ${
                                selected
                                  ? 'border-primary-500 bg-primary-50 shadow-md'
                                  : 'border-slate-200 bg-white hover:border-primary-300 hover:bg-slate-50'
                              }`}
                            >
                              <p
                                className={`text-sm font-semibold sm:text-base ${selected ? 'text-primary-700' : 'text-slate-700'}`}
                              >
                                {option.label}
                              </p>
                              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                {option.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 text-sm font-semibold text-slate-700">
                        {t('triageFlow.whenFitsYou')}
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {availabilityOptions.map((option) => {
                          const selected = answers.availability.includes(option.value);
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => toggleMultipleSelect(option.value, 'availability')}
                              className={`rounded-xl border p-3 text-left transition sm:p-4 ${
                                selected
                                  ? 'border-primary-500 bg-primary-50 shadow-md'
                                  : 'border-slate-200 bg-white hover:border-primary-300 hover:bg-slate-50'
                              }`}
                            >
                              <p
                                className={`text-sm font-semibold sm:text-base ${selected ? 'text-primary-700' : 'text-slate-700'}`}
                              >
                                {option.label}
                              </p>
                              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                {option.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Blog Tip for Preferences */}
                    {currentBlogPosts.length > 0 && (
                      <div className="pt-2">
                        <Link
                          href={`/blog/${currentBlogPosts[0].slug}`}
                          className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={currentBlogPosts[0].featuredImage.src}
                              alt={currentBlogPosts[0].featuredImage.alt || currentBlogPosts[0].title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-primary-600 font-medium flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {t('triageFlow.whileYouWait')}
                            </p>
                            <p className="text-sm font-medium text-slate-700 line-clamp-1">{currentBlogPosts[0].title}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        </Link>
                      </div>
                    )}

                    <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <Button
                        variant="ghost"
                        onClick={goPrevious}
                        className="w-full text-slate-600 hover:bg-slate-100 sm:w-auto"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('triageFlow.back')}
                      </Button>
                      <Button
                        onClick={goNext}
                        size="lg"
                        className="w-full bg-primary-500 text-white hover:bg-primary-600 shadow-lg sm:w-auto"
                      >
                        {t('triageFlow.showResults')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Emotional Question Header */}
                    <header className="text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-4">
                        <Heart className="w-4 h-4" />
                        {getEmotionalText().title}
                      </div>
                      <div className="flex items-start justify-center gap-4">
                        <div className="flex-1">
                          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                            {currentQuestion?.text}
                          </h1>
                          <p className="mt-2 text-sm text-slate-500">
                            {getEmotionalText().subtitle}
                          </p>
                        </div>
                        {currentQuestion && (
                          <QuestionTooltip
                            helpText={currentQuestion.helpText}
                            scientificContext={currentQuestion.scientificContext}
                          />
                        )}
                      </div>
                    </header>

                    <div className="space-y-2 sm:space-y-3">
                      {standardResponseOptions.map((option) => {
                        const answerKey = currentPhase as 'phq9' | 'gad7';
                        const isSelected = answers[answerKey]?.[questionIndex] === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleScaleAnswer(option.value)}
                            className={`flex w-full items-center justify-between gap-2 rounded-xl border p-3 transition sm:gap-3 sm:p-4 ${
                              isSelected
                                ? 'border-primary-500 bg-primary-50 shadow-md ring-2 ring-primary-200'
                                : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-primary-300 hover:bg-slate-50 hover:shadow-md'
                            }`}
                          >
                            <div className="text-left">
                              <p
                                className={`text-sm font-semibold sm:text-base ${isSelected ? 'text-primary-700' : 'text-slate-700'}`}
                              >
                                {option.label}
                              </p>
                              <p className="text-xs text-slate-500 sm:text-sm">
                                {option.description}
                              </p>
                            </div>
                            <div
                              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-sm font-semibold sm:h-10 sm:w-10 ${
                                isSelected
                                  ? 'border-primary-500 bg-primary-500 text-white'
                                  : 'border-slate-300 bg-slate-50 text-slate-600'
                              }`}
                            >
                              {option.value}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Encouraging message + progress */}
                    <div className="flex items-center justify-between pt-4 text-sm">
                      <button
                        type="button"
                        onClick={goPrevious}
                        disabled={currentPhase === 'phq2' && questionIndex === 0}
                        className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 sm:px-6"
                      >
                        {t('triage.back')}
                      </button>
                      <span className="text-center text-slate-500">
                        {(currentPhase === 'phq2' || currentPhase === 'phq9-expanded') && (
                          <>
                            <span className="hidden sm:inline">
                              {t('triageFlow.moodQuestion', {
                                current: questionIndex + 1 + (currentPhase === 'phq9-expanded' ? 2 : 0),
                                total: currentPhase === 'phq9-expanded' ? 9 : 2,
                              })}
                            </span>
                            <span className="sm:hidden">
                              {t('triageFlow.moodQuestionShort', {
                                current: questionIndex + 1 + (currentPhase === 'phq9-expanded' ? 2 : 0),
                                total: currentPhase === 'phq9-expanded' ? 9 : 2,
                              })}
                            </span>
                          </>
                        )}
                        {(currentPhase === 'gad2' || currentPhase === 'gad7-expanded') && (
                          <>
                            <span className="hidden sm:inline">
                              {t('triageFlow.wellbeingQuestion', {
                                current: questionIndex + 1 + (currentPhase === 'gad7-expanded' ? 2 : 0),
                                total: currentPhase === 'gad7-expanded' ? 7 : 2,
                              })}
                            </span>
                            <span className="sm:hidden">
                              {t('triageFlow.wellbeingQuestionShort', {
                                current: questionIndex + 1 + (currentPhase === 'gad7-expanded' ? 2 : 0),
                                total: currentPhase === 'gad7-expanded' ? 7 : 2,
                              })}
                            </span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Blog Suggestion after first question */}
                    {questionIndex === 0 && currentBlogPosts.length > 1 && (
                      <div className="pt-4 border-t border-slate-100">
                        <Link
                          href={`/blog/${currentBlogPosts[1].slug}`}
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary-50 to-slate-50 rounded-xl hover:from-primary-100 hover:to-slate-100 transition-colors"
                        >
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                            <Image
                              src={currentBlogPosts[1].featuredImage.src}
                              alt={currentBlogPosts[1].featuredImage.alt || currentBlogPosts[1].title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-primary-600 font-medium flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {t('triageFlow.mightInterestYou')}
                            </p>
                            <p className="text-sm font-medium text-slate-700 line-clamp-1">{currentBlogPosts[1].title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{currentBlogPosts[1].readingTime}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>
      </div>
    </div>
  );
}
