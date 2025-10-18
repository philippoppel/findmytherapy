'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowRight, BookOpen, Brain, CheckCircle2, HeartPulse, Loader2, RotateCcw, Sparkles } from 'lucide-react'
import { Button } from '@mental-health/ui'
import { track } from '../../lib/analytics'

type ScaleOption = {
  value: number
  label: string
  description: string
}

type MultipleOption = {
  value: string
  label: string
}

type Question =
  | {
      id: 'mood' | 'motivation' | 'anxiety'
      type: 'scale'
      title: string
      subtitle: string
      options: ScaleOption[]
      icon: React.ComponentType<{ className?: string }>
    }
  | {
      id: 'support'
      type: 'multiple'
      title: string
      subtitle: string
      options: MultipleOption[]
      icon: React.ComponentType<{ className?: string }>
    }
  | {
      id: 'availability'
      type: 'multiple'
      title: string
      subtitle: string
      options: MultipleOption[]
      icon: React.ComponentType<{ className?: string }>
    }

const questions: Question[] = [
  {
    id: 'mood',
    type: 'scale',
    title: 'Stimmung & Antrieb',
    subtitle: 'Wie oft hast du dich in den letzten zwei Wochen niedergeschlagen gefühlt?',
    icon: HeartPulse,
    options: [
      { value: 0, label: 'Selten oder nie', description: 'Stimmung überwiegend stabil' },
      { value: 1, label: 'An einzelnen Tagen', description: 'Manchmal bedrückt oder antriebslos' },
      { value: 2, label: 'Mehr als die Hälfte der Tage', description: 'Häufig belastet' },
      { value: 3, label: 'Beinahe täglich', description: 'Dauert an und erschwert deinen Alltag' },
    ],
  },
  {
    id: 'motivation',
    type: 'scale',
    title: 'Energie & Fokus',
    subtitle: 'Wie stark beeinflussen Stress oder Müdigkeit deine Routinen?',
    icon: Brain,
    options: [
      { value: 0, label: 'Kaum', description: 'Alltag läuft weitgehend normal' },
      { value: 1, label: 'Etwas', description: 'Ab und zu fehlen Kraft oder Fokus' },
      { value: 2, label: 'Stark', description: 'Du brauchst häufiger Pausen oder Unterstützung' },
      { value: 3, label: 'Sehr stark', description: 'Du kommst ohne Hilfe kaum voran' },
    ],
  },
  {
    id: 'anxiety',
    type: 'scale',
    title: 'Innere Anspannung',
    subtitle: 'Wie oft fühlst du dich nervös oder ängstlich?',
    icon: AlertTriangle,
    options: [
      { value: 0, label: 'Selten', description: 'Gelassenheit überwiegt' },
      { value: 1, label: 'Manchmal', description: 'Innere Unruhe ist spürbar, aber gut händelbar' },
      { value: 2, label: 'Häufig', description: 'Anspannung begleitet dich oft' },
      { value: 3, label: 'Fast durchgehend', description: 'Ständige Anspannung, Ruhe schwer möglich' },
    ],
  },
  {
    id: 'support',
    type: 'multiple',
    title: 'Was hilft dir gerade am meisten?',
    subtitle: 'Wähle alle Formate aus, die dich unterstützen könnten.',
    icon: BookOpen,
    options: [
      { value: 'therapist', label: '1:1 Therapie oder Beratung' },
      { value: 'course', label: 'Digitale Programme & Übungen' },
      { value: 'group', label: 'Gruppenangebot oder Peer-Support' },
      { value: 'checkin', label: 'Regelmäßige Check-ins mit Care-Team' },
    ],
  },
  {
    id: 'availability',
    type: 'multiple',
    title: 'Wie flexibel bist du terminlich?',
    subtitle: 'Wähle alle Optionen, die für dich passen.',
    icon: Sparkles,
    options: [
      { value: 'online', label: 'Online & Abends' },
      { value: 'hybrid', label: 'Hybrid (vor Ort + online)' },
      { value: 'mornings', label: 'Morgens unter der Woche' },
      { value: 'weekend', label: 'Wochenende / Kurzfristige Slots' },
    ],
  },
]

type Answers = {
  mood?: number
  motivation?: number
  anxiety?: number
  support: string[]
  availability: string[]
}

const initialAnswers: Answers = {
  support: [],
  availability: [],
}

type TherapistRecommendation = {
  id: string
  name: string
  title: string
  focus: string[]
  availability: string
  location: string
  rating: number
  reviews: number
  status: string
  formatTags: Array<'online' | 'praesenz' | 'hybrid'>
  highlights: string[]
}

type CourseRecommendation = {
  slug: string
  title: string
  shortDescription: string
  focus: string
  duration: string
  format: string
  outcomes: string[]
  highlights: string[]
}

const moodCopy = ['Stabile Verfassung', 'Leichte Belastung', 'Erhöhte Belastung', 'Akuter Handlungsbedarf'] as const

const supportRecommendations: Record<'low' | 'medium' | 'high', string> = {
  low: 'Unsere digitalen Programme und Micro-Interventionen stärken dich im Alltag. Ergänzend können optionale Check-ins mit dem Care-Team vereinbart werden.',
  medium:
    'Wir empfehlen ein Erstgespräch mit einer*m Klarthera-Therapeut:in, kombiniert mit einem strukturierten Kursmodul. So bekommst du professionelle Begleitung und Werkzeuge für dazwischen.',
  high:
    'Wir priorisieren ein schnelles Gespräch mit unserem Care-Team und verbinden dich mit spezialisierten Therapeut:innen. Parallel stellen wir Akutressourcen und engmaschige Check-ins bereit.',
}

const nextStepsCopy = [
  '3 passende Therapeut:innen mit freien Slots (innerhalb von 7 Tagen startklar).',
  'Individuelles Klarthera-Programm mit Übungen für Fokus & Alltag.',
  'Optionaler Check-in mit dem Care-Team nach 48 Stunden, um Fortschritte zu reflektieren.',
]

const therapistStatusLabel: Record<string, string> = {
  VERIFIED: 'Pilot (verifiziert)',
  PENDING: 'Pilot (in Prüfung)',
  REJECTED: 'Nicht gelistet',
}

const formatTagLabel: Record<'online' | 'praesenz' | 'hybrid', string> = {
  online: 'Online',
  praesenz: 'Vor Ort',
  hybrid: 'Hybrid',
}

export function TriageFlow() {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>(initialAnswers)
  const [showSummary, setShowSummary] = useState(false)
  const [recommendations, setRecommendations] = useState<{
    therapists: TherapistRecommendation[]
    courses: CourseRecommendation[]
  }>({ therapists: [], courses: [] })
  const [persistState, setPersistState] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [persistError, setPersistError] = useState<string | null>(null)
  const [hasPersisted, setHasPersisted] = useState(false)

  const currentQuestion = questions[stepIndex]

  const progress = Math.round(((stepIndex) / questions.length) * 100)

  const handleScaleSelect = (value: number) => {
    if (currentQuestion.type !== 'scale') {
      return
    }

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))

    const nextStep = stepIndex + 1
    if (nextStep < questions.length) {
      setStepIndex(nextStep)
    } else {
      setShowSummary(true)
    }
  }

  const toggleMultipleSelect = (option: string) => {
    if (currentQuestion.type !== 'multiple') {
      return
    }

    setAnswers((prev) => {
      const prevValues = prev[currentQuestion.id]
      const alreadySelected = prevValues.includes(option)

      return {
        ...prev,
        [currentQuestion.id]: alreadySelected
          ? prevValues.filter((item) => item !== option)
          : [...prevValues, option],
      }
    })
  }

  const goNextFromMultiple = () => {
    const nextStep = stepIndex + 1
    if (nextStep < questions.length) {
      setStepIndex(nextStep)
    } else {
      setShowSummary(true)
    }
  }

  const goPrevious = () => {
    if (stepIndex === 0) {
      return
    }

    setStepIndex(stepIndex - 1)
  }

  const resetFlow = () => {
    setAnswers(initialAnswers)
    setStepIndex(0)
    setShowSummary(false)
    setRecommendations({ therapists: [], courses: [] })
    setPersistState('idle')
    setPersistError(null)
    setHasPersisted(false)
  }

  const { score, level, recommendation } = useMemo(() => {
    const numericScore =
      (answers.mood ?? 0) + (answers.motivation ?? 0) + (answers.anxiety ?? 0)

    let level: 'low' | 'medium' | 'high' = 'low'

    if (numericScore >= 6 && numericScore < 9) {
      level = 'medium'
    } else if (numericScore >= 9) {
      level = 'high'
    }

    return {
      score: numericScore,
      level,
      recommendation: supportRecommendations[level],
    }
  }, [answers.mood, answers.motivation, answers.anxiety])

  const persistResults = useCallback(
    async ({ force = false }: { force?: boolean } = {}) => {
      if (hasPersisted && !force) {
        return
      }

      setPersistState('saving')
      setPersistError(null)

      try {
        const response = await fetch('/api/triage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mood: answers.mood ?? null,
            motivation: answers.motivation ?? null,
            anxiety: answers.anxiety ?? null,
            support: answers.support,
            availability: answers.availability,
            score,
            level,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Die Ergebnisse konnten nicht gespeichert werden.')
        }

        const therapistRecommendations = Array.isArray(data?.recommendations?.therapists)
          ? (data.recommendations.therapists as TherapistRecommendation[])
          : []
        const courseRecommendations = Array.isArray(data?.recommendations?.courses)
          ? (data.recommendations.courses as CourseRecommendation[])
          : []

        setRecommendations({
          therapists: therapistRecommendations,
          courses: courseRecommendations,
        })
        track('triage_completed', {
          level,
          score,
          support: answers.support,
          availability: answers.availability,
          recommendedTherapists: therapistRecommendations.map((item) => item.id),
          recommendedCourses: courseRecommendations.map((item) => item.slug),
        })
        setPersistState('success')
      } catch (error) {
        console.error('Failed to persist triage results', error)
        setPersistState('error')
        setPersistError(error instanceof Error ? error.message : 'Unbekannter Fehler beim Speichern')
        track('triage_recommendations_failed', {
          message: error instanceof Error ? error.message : 'unknown',
        })
      } finally {
        setHasPersisted(true)
      }
    },
    [
      answers.anxiety,
      answers.availability,
      answers.mood,
      answers.motivation,
      answers.support,
      hasPersisted,
      level,
      score,
    ]
  )

  useEffect(() => {
    if (!showSummary) {
      return
    }

    void persistResults()
  }, [showSummary, persistResults])

  const retryPersist = () => {
    setHasPersisted(false)
    track('triage_recommendations_retry', {
      level,
      support: answers.support,
    })
    void persistResults({ force: true })
  }

  const levelLabel =
    level === 'low' ? moodCopy[0] : level === 'medium' ? moodCopy[2] : moodCopy[3]

  if (showSummary) {
    return (
      <div className="rounded-3xl border border-divider bg-white/90 p-8 shadow-lg shadow-primary/10 backdrop-blur">
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            Ergebnisse bereit
          </div>
          <h3 className="text-2xl font-semibold text-default">Deine Klarthera Empfehlung</h3>
          <p className="text-sm text-muted">
            Auf Basis deiner Angaben schlagen wir das folgende Paket vor. Der vollständige Ablauf zeigt, wie Matches und Kurszugänge freigeschaltet werden.
          </p>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-divider bg-surface-1/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Belastungslevel</p>
            <p className="mt-2 text-lg font-semibold text-default">{levelLabel}</p>
            <p className="text-sm text-muted">Score {score} von 18 möglichen Punkten</p>
          </div>
          <div className="rounded-2xl border border-divider bg-surface-1/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Wichtigste Wunschformate</p>
            <p className="mt-2 text-sm text-muted">
              {answers.support.length
                ? answers.support
                    .map((item) => {
                      const option = questions
                        .filter((q): q is Extract<Question, { type: 'multiple' }> => q.type === 'multiple')
                        .flatMap((q) => q.options)
                        .find((opt) => opt.value === item)
                      return option?.label ?? item
                    })
                    .join(' · ')
                : 'Keine Auswahl – wir schlagen einen Mix vor'}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-6 text-sm leading-relaxed text-primary dark:border-primary/50 dark:bg-primary/20">
          {recommendation}
        </div>

        {persistState === 'saving' && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-divider bg-surface-1/95 p-4 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
            <span>Wir bereiten individuelle Empfehlungen vor …</span>
          </div>
        )}

        {persistState === 'error' && (
          <div className="mt-6 space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <div>
              <p className="font-semibold">Empfehlungen konnten nicht geladen werden</p>
              <p>{persistError ?? 'Bitte versuche es in Kürze erneut.'}</p>
            </div>
            <Button variant="outline" size="sm" onClick={retryPersist}>
              Erneut versuchen
            </Button>
          </div>
        )}

        {recommendations.therapists.length > 0 && (
          <section className="mt-6 space-y-4">
            <h4 className="text-lg font-semibold text-default">Empfohlene Pilot-Therapeut:innen</h4>
            <div className="space-y-4">
              {recommendations.therapists.map((therapist) => (
                <article
                  key={therapist.id}
                  className="rounded-2xl border border-divider bg-white/90 p-5 shadow-sm shadow-primary/5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-base font-semibold text-default">{therapist.name}</p>
                      <p className="text-xs text-muted">{therapist.title}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                        therapist.status === 'VERIFIED'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          : therapist.status === 'PENDING'
                          ? 'border-amber-200 bg-amber-50 text-amber-800'
                          : 'border-divider bg-surface-1 text-muted'
                      }`}
                    >
                      {therapistStatusLabel[therapist.status] ?? 'Pilot'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {therapist.location} • {therapist.availability}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Schwerpunkte: {therapist.focus.slice(0, 3).join(', ')}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {therapist.formatTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full border border-divider bg-surface-1 px-3 py-1 text-xs font-semibold text-muted"
                      >
                        {formatTagLabel[tag]}
                      </span>
                    ))}
                  </div>
                  {therapist.highlights.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {therapist.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {recommendations.courses.length > 0 && (
          <section className="mt-6 space-y-4">
            <h4 className="text-lg font-semibold text-default">Passende Programme & Kurse</h4>
            <div className="space-y-4">
              {recommendations.courses.map((course) => (
                <article
                  key={course.slug}
                  className="rounded-2xl border border-divider bg-surface-1/90 p-5 shadow-sm shadow-secondary/10"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-base font-semibold text-default">{course.title}</p>
                      <p className="text-xs text-muted">{course.focus}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-divider bg-white px-3 py-1 text-xs font-semibold text-muted">
                      {course.duration}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{course.shortDescription}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {course.outcomes.map((outcome) => (
                      <span
                        key={outcome}
                        className="inline-flex items-center rounded-full border border-divider bg-white px-3 py-1 text-xs text-muted"
                      >
                        {outcome}
                      </span>
                    ))}
                  </div>
                  {course.highlights.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {course.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary-700"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-divider bg-surface-1/95 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Nächste Schritte</p>
            <ul className="mt-3 space-y-3 text-sm text-muted">
              {nextStepsCopy.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <ArrowRight className="mt-1 h-4 w-4 flex-none text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between rounded-2xl border border-divider bg-white/85 p-6 shadow-sm shadow-primary/5">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Empfohlene Optionen</p>
              <p className="text-sm text-muted">
                Starte mit einer*m verifizierten Pilot-Therapeut:in oder aktiviere das passende Kursmodul. Termine lassen sich direkt buchen.
              </p>
            </div>
            <div className="mt-4 space-y-3">
              <Button asChild className="w-full">
                <a href="/therapists">
                  Therapeut:innen ansehen
                </a>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <a href="/courses">Kurse vergleichen</a>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <Button variant="ghost" onClick={resetFlow} className="inline-flex items-center gap-2">
            <RotateCcw className="h-4 w-4" aria-hidden />
            Neue Ersteinschätzung
          </Button>
          <p className="text-xs text-subtle">
            Hinweis: Die Ergebnisse dienen als Orientierung. Im Produkt werden medizinische Schwellenwerte geprüft und Notfallroutinen ausgelöst.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-3xl border border-divider bg-white/90 p-8 shadow-lg shadow-primary/10 backdrop-blur"
      aria-live="polite"
    >
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          <Sparkles className="h-4 w-4" aria-hidden />
          Schritt {stepIndex + 1} von {questions.length}
        </div>
        <h3 className="text-2xl font-semibold text-default">{currentQuestion.title}</h3>
        <p className="text-sm text-muted">{currentQuestion.subtitle}</p>
      </header>

      <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
          aria-hidden
        />
      </div>

      <div className="mt-6 space-y-4">
        {currentQuestion.type === 'scale' ? (
          currentQuestion.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleScaleSelect(option.value)}
              className="flex w-full items-start justify-between gap-3 rounded-2xl border border-divider bg-surface-1/95 p-4 text-left shadow-sm shadow-primary/5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <div className="flex items-start gap-3">
                <currentQuestion.icon className="mt-1 h-5 w-5 flex-none text-primary" aria-hidden />
                <div>
                  <p className="text-base font-semibold text-default">{option.label}</p>
                  <p className="text-sm text-muted">{option.description}</p>
                </div>
              </div>
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-divider bg-white text-sm font-semibold text-primary">
                {option.value}
              </div>
            </button>
          ))
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option) => {
                const selected = answers[currentQuestion.id].includes(option.value)
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleMultipleSelect(option.value)}
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                      selected
                        ? 'border-primary bg-primary/10 text-primary shadow-sm shadow-primary/10'
                        : 'border-divider bg-surface-1/95 text-muted hover:border-primary/30 hover:text-primary'
                    }`}
                  >
                    <currentQuestion.icon className="h-5 w-5 flex-none" aria-hidden />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                )
              })}
            </div>
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={goPrevious} disabled={stepIndex === 0}>
                Zurück
              </Button>
              <Button onClick={goNextFromMultiple} disabled={answers[currentQuestion.id].length === 0}>
                Weiter
              </Button>
            </div>
          </>
        )}
      </div>

      {currentQuestion.type === 'scale' && (
        <div className="mt-6 flex items-center justify-between text-xs text-subtle">
          <button
            type="button"
            onClick={goPrevious}
            disabled={stepIndex === 0}
            className="rounded-full border border-divider bg-surface-1 px-3 py-1.5 font-medium text-muted transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50"
          >
            Zurück
          </button>
          <span>{questions.length - stepIndex - 1} Fragen verbleiben</span>
        </div>
      )}
    </div>
  )
}
