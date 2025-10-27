'use client'

import { useCallback, useEffect, useMemo, useState, type ComponentType } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Calendar,
  Star,
  AlertTriangle,
  Phone,
  Info,
} from 'lucide-react'
import { Button } from '@mental-health/ui'
import { track } from '../../lib/analytics'
import {
  phq9Questions,
  gad7Questions,
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
} from '../../lib/triage/questionnaires'
import { QuestionTooltip } from './QuestionTooltip'
import { AmpelVisualization } from './AmpelVisualization'
import { CrisisResources } from './CrisisResources'
import { ProgressChart } from './ProgressChart'
import { TherapistCard } from './TherapistCard'
import { TherapistComparison } from './TherapistComparison'
import { TherapistFilters } from './TherapistFilters'

type QuestionSection = {
  id: string
  type: 'phq9' | 'gad7' | 'support' | 'availability'
  title: string
  subtitle: string
  icon: ComponentType<{ className?: string }>
}

const questionSections: QuestionSection[] = [
  {
    id: 'phq9',
    type: 'phq9',
    title: 'PHQ-9: Depressive Symptome',
    subtitle: 'Wie oft wurden Sie in den letzten 2 Wochen durch die folgenden Beschwerden beeinträchtigt?',
    icon: CheckCircle2,
  },
  {
    id: 'gad7',
    type: 'gad7',
    title: 'GAD-7: Angstsymptome',
    subtitle: 'Wie oft wurden Sie in den letzten 2 Wochen durch die folgenden Beschwerden beeinträchtigt?',
    icon: Sparkles,
  },
  {
    id: 'support',
    type: 'support',
    title: 'Gewünschte Unterstützung',
    subtitle: 'Welche Form der Unterstützung könntest du dir vorstellen?',
    icon: BookOpen,
  },
  {
    id: 'availability',
    type: 'availability',
    title: 'Verfügbarkeit & Präferenzen',
    subtitle: 'Welche Optionen passen zu deinem Alltag?',
    icon: Calendar,
  },
]

const riskLabelMap = {
  LOW: 'Niedrig',
  MEDIUM: 'Erhöht',
  HIGH: 'Hoch',
} as const

type Answers = {
  phq9: number[]
  gad7: number[]
  support: string[]
  availability: string[]
}

const initialAnswers: Answers = {
  phq9: [],
  gad7: [],
  support: [],
  availability: [],
}

type TherapistRecommendation = {
  id: string
  name: string
  title: string
  headline?: string
  focus: string[]
  availability: string
  location: string
  rating: number
  reviews: number
  status: string
  formatTags: Array<'online' | 'praesenz' | 'hybrid'>
  highlights: string[]
  acceptingClients?: boolean
  services?: string[]
  responseTime?: string
  yearsExperience?: number
  languages?: string[]
  image?: string | null
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

type TriageFlowProps = {
  embedded?: boolean
  historicalData?: Array<{
    date: string
    phq9Score: number
    gad7Score: number
  }>
}

type NextStepConfig = {
  badgeLabel: string
  containerClass: string
  icon: ComponentType<{ className?: string }>
  headline: string
  description: string
  actions: string[]
}

export function TriageFlow({ embedded = false, historicalData = [] }: TriageFlowProps = {}) {
  const [sectionIndex, setSectionIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>(initialAnswers)
  const [showSummary, setShowSummary] = useState(false)
  const [recommendations, setRecommendations] = useState<{
    therapists: TherapistRecommendation[]
    courses: CourseRecommendation[]
  }>({ therapists: [], courses: [] })
  const [hasPersisted, setHasPersisted] = useState(false)
  const [showCrisisBanner, setShowCrisisBanner] = useState(false)
  const [selectedTherapists, setSelectedTherapists] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [filters, setFilters] = useState<{
    formats: string[]
    specialties: string[]
    languages: string[]
  }>({
    formats: [],
    specialties: [],
    languages: [],
  })

  const currentSection = questionSections[sectionIndex]

  const toggleTherapistSelection = (therapistId: string) => {
    setSelectedTherapists((prev) => {
      if (prev.includes(therapistId)) {
        return prev.filter((id) => id !== therapistId)
      } else {
        // Max 3 Therapeuten für Vergleich
        if (prev.length >= 3) {
          return prev
        }
        return [...prev, therapistId]
      }
    })
  }

  // Filter Therapists
  const filteredTherapists = useMemo(() => {
    let result = recommendations.therapists

    // Format Filter
    if (filters.formats.length > 0) {
      result = result.filter((t) =>
        t.formatTags.some((tag) => filters.formats.includes(tag))
      )
    }

    // Specialty Filter
    if (filters.specialties.length > 0) {
      result = result.filter((t) =>
        t.focus.some((f) => filters.specialties.includes(f))
      )
    }

    // Language Filter
    if (filters.languages.length > 0) {
      result = result.filter((t) =>
        t.languages?.some((l) => filters.languages.includes(l))
      )
    }

    return result
  }, [recommendations.therapists, filters])

  // Available filter options from all therapists
  const availableSpecialties = useMemo(() => {
    const allSpecialties = recommendations.therapists.flatMap((t) => t.focus)
    return Array.from(new Set(allSpecialties)).sort()
  }, [recommendations.therapists])

  const availableLanguages = useMemo(() => {
    const allLanguages = recommendations.therapists
      .flatMap((t) => t.languages || [])
      .filter(Boolean)
    return Array.from(new Set(allLanguages)).sort()
  }, [recommendations.therapists])

  const selectedTherapistData = filteredTherapists.filter((t) =>
    selectedTherapists.includes(t.id)
  )

  const currentQuestions = useMemo(() => {
    if (currentSection.type === 'phq9') return phq9Questions
    if (currentSection.type === 'gad7') return gad7Questions
    return []
  }, [currentSection.type])

  const totalQuestions = phq9Questions.length + gad7Questions.length + 2 // +2 for support and availability
  const answeredQuestions = answers.phq9.length + answers.gad7.length + (answers.support.length > 0 ? 1 : 0) + (answers.availability.length > 0 ? 1 : 0)
  const progress = Math.round((answeredQuestions / totalQuestions) * 100)
  const progressCopy = useMemo(() => {
    if (progress >= 90) {
      return 'Fast geschafft – nur noch letzte Antworten.'
    }
    if (progress >= 60) {
      return 'Mehr als die Hälfte ist erledigt.'
    }
    if (progress >= 30) {
      return 'Guter Start – bleib kurz dran.'
    }
    return 'Kurzer Check – das dauert nur eine Minute.'
  }, [progress])

  const handleScaleAnswer = useCallback((value: number) => {
    const sectionType = currentSection.type
    if (sectionType !== 'phq9' && sectionType !== 'gad7') return

    setAnswers((prev) => {
      const newAnswers = { ...prev }
      const currentAnswers = [...newAnswers[sectionType]]
      currentAnswers[questionIndex] = value
      newAnswers[sectionType] = currentAnswers
      return newAnswers
    })

    // PHQ-9 Item 9 (Suizidgedanken): Trigger Crisis Banner bei Antwort ≥1
    if (sectionType === 'phq9' && questionIndex === 8 && value >= 1) {
      setShowCrisisBanner(true)
    }

    // Auto-advance to next question
    setTimeout(() => {
      if (questionIndex < currentQuestions.length - 1) {
        setQuestionIndex(questionIndex + 1)
      } else {
        // Move to next section
        if (sectionIndex < questionSections.length - 1) {
          setSectionIndex(sectionIndex + 1)
          setQuestionIndex(0)
        } else {
          setShowSummary(true)
        }
      }
    }, 300)
  }, [currentSection.type, questionIndex, currentQuestions.length, sectionIndex])

  const toggleMultipleSelect = (option: string) => {
    const sectionType = currentSection.type
    if (sectionType !== 'support' && sectionType !== 'availability') return

    setAnswers((prev) => {
      const currentAnswers = prev[sectionType]
      const alreadySelected = currentAnswers.includes(option)

      return {
        ...prev,
        [sectionType]: alreadySelected
          ? currentAnswers.filter((item) => item !== option)
          : [...currentAnswers, option],
      }
    })
  }

  const nextSection = useCallback(() => {
    if (sectionIndex < questionSections.length - 1) {
      setSectionIndex(sectionIndex + 1)
      setQuestionIndex(0)
    } else {
      setShowSummary(true)
    }
  }, [sectionIndex])

  const goNext = useCallback(() => {
    if (currentSection.type === 'phq9' || currentSection.type === 'gad7') {
      // For PHQ/GAD, check if current question is answered
      const currentAnswer = answers[currentSection.type][questionIndex]
      if (currentAnswer === undefined) return

      if (questionIndex < currentQuestions.length - 1) {
        setQuestionIndex(questionIndex + 1)
      } else {
        nextSection()
      }
    } else {
      // For multiple choice
      nextSection()
    }
  }, [answers, currentSection.type, currentQuestions.length, nextSection, questionIndex])

  const goPrevious = useCallback(() => {
    if (currentSection.type === 'phq9' || currentSection.type === 'gad7') {
      if (questionIndex > 0) {
        setQuestionIndex(questionIndex - 1)
      } else if (sectionIndex > 0) {
        setSectionIndex(sectionIndex - 1)
        const prevSection = questionSections[sectionIndex - 1]
        if (prevSection.type === 'phq9') {
          setQuestionIndex(phq9Questions.length - 1)
        } else if (prevSection.type === 'gad7') {
          setQuestionIndex(gad7Questions.length - 1)
        }
      }
    } else {
      if (sectionIndex > 0) {
        setSectionIndex(sectionIndex - 1)
        const prevSection = questionSections[sectionIndex - 1]
        if (prevSection.type === 'phq9') {
          setQuestionIndex(phq9Questions.length - 1)
        } else if (prevSection.type === 'gad7') {
          setQuestionIndex(gad7Questions.length - 1)
        }
      }
    }
  }, [currentSection.type, questionIndex, sectionIndex])

  const resetFlow = () => {
    setAnswers(initialAnswers)
    setSectionIndex(0)
    setQuestionIndex(0)
    setShowSummary(false)
    setRecommendations({ therapists: [], courses: [] })
    setHasPersisted(false)
  }

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
    const phq9Total = answers.phq9.reduce((sum, val) => sum + (val || 0), 0)
    const gad7Total = answers.gad7.reduce((sum, val) => sum + (val || 0), 0)
    const item9Score = answers.phq9[8] ?? 0

    const phq9Sev = calculatePHQ9Severity(phq9Total)
    const gad7Sev = calculateGAD7Severity(gad7Total)
    const risk = assessRiskLevel(phq9Total, gad7Total, { phq9Item9Score: item9Score })

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
    }
  }, [answers.phq9, answers.gad7])

  const nextStepConfig = useMemo<NextStepConfig>(() => {
    if (requiresEmergency) {
      return {
        badgeLabel: 'Akute Unterstützung',
        containerClass: 'border-red-200 bg-red-50 text-red-900',
        icon: AlertTriangle,
        headline: 'Sofortige Hilfe in Anspruch nehmen',
        description: hasSuicidalIdeation
          ? 'Deine Antwort auf Frage 9 weist auf Suizidgedanken hin. Bitte nimm umgehend Krisenhilfe in Anspruch und nutze die Ressourcen unten.'
          : 'Deine Werte liegen im roten Bereich. Hol dir sofort professionelle Unterstützung über Krisendienste oder Notruf.',
        actions: [
          'Notruf 144 (oder 112) wählen, wenn du dich akut gefährdet fühlst.',
          'Telefonseelsorge 142 kontaktieren – rund um die Uhr, anonym und kostenlos.',
          'Eine Vertrauensperson informieren und nicht alleine bleiben.',
        ],
      }
    }

    if (riskLevel === 'HIGH') {
      return {
        badgeLabel: 'Hohe Priorität',
        containerClass: 'border-amber-200 bg-amber-50 text-amber-900',
        icon: Star,
        headline: 'Zeitnah professionelle Begleitung sichern',
        description:
          'Die Kombination deiner PHQ-9 und GAD-7 Werte zeigt eine hohe Belastung. Vereinbare in den nächsten Tagen ein Erstgespräch und kläre weitere Schritte ärztlich ab.',
        actions: [
          'Therapeut:in aus den Empfehlungen auswählen und innerhalb von 14 Tagen ein Erstgespräch fixieren.',
          'Hausärzt:in oder Psychiater:in konsultieren, um eine kombinierte Behandlung zu prüfen.',
          'Digitale Programme nur ergänzend einsetzen, nicht als Ersatz für Therapie.',
        ],
      }
    }

    if (riskLevel === 'MEDIUM') {
      return {
        badgeLabel: 'Empfohlene Schritte',
        containerClass: 'border-sky-200 bg-sky-50 text-sky-900',
        icon: Sparkles,
        headline: 'Professionelle Begleitung planen',
        description:
          'Mittelschwere Symptome profitieren stark von strukturierter Psychotherapie. Kombiniere sie mit alltagstauglichen Selbsthilfe-Tools.',
        actions: [
          'Ein Erstgespräch mit einer empfohlenen Therapeut:in planen.',
          'Zwischen den Terminen ein digitales Programm zur Stabilisierung nutzen.',
          'In 4–6 Wochen einen erneuten Check durchführen, um Veränderungen zu sehen.',
        ],
      }
    }

    return {
      badgeLabel: 'Prävention',
      containerClass: 'border-emerald-200 bg-emerald-50 text-emerald-900',
      icon: CheckCircle2,
      headline: 'Ressourcen stärken & dranbleiben',
      description:
        'Aktuell zeigen sich nur geringe Symptome. Pflege deine Routinen und nutze Prävention, um stabil zu bleiben.',
      actions: [
        'Regelmäßige Bewegung, Schlafhygiene und soziale Kontakte fest einplanen.',
        'Ein niedrigschwelliges Programm testen, um Resilienz weiter auszubauen.',
        'Bei Veränderungen oder erneuter Belastung die Ersteinschätzung wiederholen.',
      ],
    }
  }, [requiresEmergency, hasSuicidalIdeation, riskLevel])

  const scoreBadges = useMemo(
    () => [
      {
        label: 'Risikoniveau',
        value: riskLabelMap[riskLevel],
      },
      {
        label: 'PHQ-9',
        value: `${phq9Score}/27 · ${phq9SeverityLabels[phq9Severity]}`,
      },
      {
        label: 'GAD-7',
        value: `${gad7Score}/21 · ${gad7SeverityLabels[gad7Severity]}`,
      },
    ],
    [riskLevel, phq9Score, phq9Severity, gad7Score, gad7Severity]
  )

  const persistResults = useCallback(
    async ({ force = false }: { force?: boolean } = {}) => {
      if (hasPersisted && !force) return

      // For embedded mode, use mock data
      if (embedded) {
        setTimeout(() => {
          setHasPersisted(true)
          track('triage_completed', {
            phq9Score,
            gad7Score,
            riskLevel,
            source: 'embedded',
            requiresEmergency,
            hasSuicidalIdeation,
          })
        }, 1000)
        return
      }

      try {
        const response = await fetch('/api/triage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phq9Answers: answers.phq9,
            gad7Answers: answers.gad7,
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
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Die Ergebnisse konnten nicht gespeichert werden.')
        }

        setRecommendations({
          therapists: data.recommendations?.therapists || [],
          courses: data.recommendations?.courses || [],
        })

        track('triage_completed', {
          phq9Score,
          gad7Score,
          phq9Severity,
          gad7Severity,
          riskLevel,
          requiresEmergency,
          hasSuicidalIdeation,
        })

      } catch (error) {
        console.error('Failed to persist triage results', error)
        track('triage_save_failed', {
          message: error instanceof Error ? error.message : 'unknown',
        })
      } finally {
        setHasPersisted(true)
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
    ]
  )

  useEffect(() => {
    if (!showSummary) return
    void persistResults()
  }, [showSummary, persistResults])

  // Keyboard Navigation
  useEffect(() => {
    if (showSummary) return // Disable keyboard nav on summary page

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMultipleChoice = currentSection.type === 'support' || currentSection.type === 'availability'

      // Arrow Keys: Navigate between questions
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrevious()
      } else if (e.key === 'ArrowRight' && !isMultipleChoice) {
        e.preventDefault()
        const currentAnswer = answers[currentSection.type as 'phq9' | 'gad7'][questionIndex]
        if (currentAnswer !== undefined) {
          goNext()
        }
      } else if (e.key === 'Enter' && !isMultipleChoice) {
        e.preventDefault()
        const currentAnswer = answers[currentSection.type as 'phq9' | 'gad7'][questionIndex]
        if (currentAnswer !== undefined) {
          goNext()
        }
      }

      // Number keys 0-3: Direct answer selection (only for PHQ/GAD)
      if (!isMultipleChoice && (currentSection.type === 'phq9' || currentSection.type === 'gad7')) {
        const num = parseInt(e.key)
        if (num >= 0 && num <= 3) {
          e.preventDefault()
          handleScaleAnswer(num)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSummary, currentSection, questionIndex, answers, goNext, goPrevious, handleScaleAnswer])

  // Summary view
  if (showSummary) {
    const StepIcon = nextStepConfig.icon

    return (
      <div className="space-y-6 lg:space-y-8">
        {/* Progress History */}
        {historicalData.length > 0 && (
          <ProgressChart
            data={[
              ...historicalData,
              {
                date: new Date().toISOString(),
                phq9Score,
                gad7Score,
              },
            ]}
          />
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <AmpelVisualization
            color={ampelColor}
            phq9Score={phq9Score}
            gad7Score={gad7Score}
            phq9Severity={phq9Severity}
            gad7Severity={gad7Severity}
            className="h-full"
          />

          <section
            className={`flex h-full flex-col justify-between rounded-3xl border p-8 shadow-lg shadow-primary/10 ${nextStepConfig.containerClass}`}
          >
            <header className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-current">
                <StepIcon className="h-3.5 w-3.5 text-current" aria-hidden />
                {nextStepConfig.badgeLabel}
              </div>
              <h3 className="text-2xl font-semibold text-current">{nextStepConfig.headline}</h3>
              <p className="text-sm leading-relaxed text-current">
                {nextStepConfig.description}
              </p>
            </header>

            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-current">
              {nextStepConfig.actions.map((action) => (
                <li key={action} className="flex items-start gap-3">
                  <ArrowRight className="mt-1 h-4 w-4 flex-none text-current" aria-hidden />
                  <span>{action}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {scoreBadges.map((badge) => (
                <span
                  key={badge.label}
                  className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-current shadow-sm backdrop-blur-sm"
                >
                  {badge.label}: {badge.value}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Crisis Resources if HIGH risk */}
        {requiresEmergency && (
          <CrisisResources showCareTeamContact={!embedded} />
        )}

        {/* Detailed Results */}
        <div className="rounded-3xl border border-divider bg-white/90 p-8 shadow-lg shadow-primary/10">
          <header className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Detaillierte Ergebnisse
            </div>
            <h3 className="text-2xl font-semibold text-default">Deine Ersteinschätzung</h3>
          </header>

          {hasSuicidalIdeation && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
              <p className="font-semibold">Wichtige Information zu Frage 9</p>
              <p className="mt-1">
                Du hast angegeben, dass Gedanken an Selbstverletzung oder Tod vorhanden sind. Bitte nutze die oben genannten Krisenangebote und wende dich umgehend an Fachpersonen.
              </p>
            </div>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-divider bg-surface-1/90 p-6">
              <h4 className="text-lg font-semibold text-default">PHQ-9: {phq9SeverityLabels[phq9Severity]}</h4>
              <p className="mt-2 text-sm text-muted">{phq9SeverityDescriptions[phq9Severity]}</p>
            </div>
            <div className="rounded-2xl border border-divider bg-surface-1/90 p-6">
              <h4 className="text-lg font-semibold text-default">GAD-7: {gad7SeverityLabels[gad7Severity]}</h4>
              <p className="mt-2 text-sm text-muted">{gad7SeverityDescriptions[gad7Severity]}</p>
            </div>
          </div>

          {/* Preferences */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-divider bg-surface-1/90 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Gewünschte Unterstützung</p>
              <p className="mt-2 text-sm text-muted">
                {answers.support.length
                  ? answers.support
                      .map((item) => supportOptions.find((opt) => opt.value === item)?.label ?? item)
                      .join(' · ')
                  : 'Keine Auswahl'}
              </p>
            </div>
            <div className="rounded-2xl border border-divider bg-surface-1/90 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Verfügbarkeit</p>
              <p className="mt-2 text-sm text-muted">
                {answers.availability.length
                  ? answers.availability
                      .map((item) => availabilityOptions.find((opt) => opt.value === item)?.label ?? item)
                      .join(' · ')
                  : 'Keine Auswahl'}
              </p>
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.therapists.length > 0 && (
            <section className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-default">Empfohlene Therapeut:innen</h4>
                {selectedTherapists.length > 0 && (
                  <span className="text-xs text-muted">
                    {selectedTherapists.length} von 3 ausgewählt für Vergleich
                  </span>
                )}
              </div>

              {/* Filter */}
              <TherapistFilters
                availableSpecialties={availableSpecialties}
                availableLanguages={availableLanguages}
                onFilterChange={setFilters}
              />

              {/* Filtered Results Count */}
              {filteredTherapists.length !== recommendations.therapists.length && (
                <p className="text-sm text-muted">
                  {filteredTherapists.length} von {recommendations.therapists.length} Therapeut:innen gefunden
                </p>
              )}

              <div className="space-y-4">
                {filteredTherapists.map((therapist, index) => (
                  <TherapistCard
                    key={therapist.id}
                    therapist={therapist}
                    index={index}
                    embedded={embedded}
                    isSelected={selectedTherapists.includes(therapist.id)}
                    onSelect={toggleTherapistSelection}
                  />
                ))}
              </div>

              {/* Vergleichen Button */}
              {selectedTherapists.length >= 2 && (
                <div className="mt-4 flex justify-center">
                  <Button onClick={() => setShowComparison(true)}>
                    {selectedTherapists.length} Therapeut:innen vergleichen
                  </Button>
                </div>
              )}
            </section>
          )}

          {recommendations.courses.length > 0 && (
            <section className="mt-6 space-y-4">
              <h4 className="text-lg font-semibold text-default">Empfohlene Programme</h4>
              <div className="space-y-4">
                {recommendations.courses.map((course) => (
                  <article
                    key={course.slug}
                    className="rounded-2xl border border-divider bg-surface-1/90 p-5 shadow-sm"
                  >
                    <p className="text-base font-semibold text-default">{course.title}</p>
                    <p className="mt-1 text-sm text-muted">{course.shortDescription}</p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
                      <span>{course.duration}</span>
                      <span className="hidden sm:inline">Format: {course.format}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {course.outcomes.map((item) => (
                        <span key={item} className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                          {item}
                        </span>
                      ))}
                    </div>
                    <Button variant="secondary" size="sm" asChild className="mt-4">
                      <a href={`/courses/${course.slug}`} target="_blank" rel="noopener noreferrer">
                        Demo ansehen
                      </a>
                    </Button>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Disclaimer auf Ergebnisseite */}
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <Info className="h-5 w-5 flex-none text-blue-600" aria-hidden />
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                <strong>Hinweis:</strong> Diese Ersteinschätzung ist keine medizinische Diagnose und ersetzt keine professionelle Beratung. Bei Fragen oder zur weiteren Abklärung wende dich bitte an qualifizierte Therapeut:innen oder Ärzt:innen.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <Button variant="ghost" onClick={resetFlow} className="inline-flex items-center gap-2">
              <RotateCcw className="h-4 w-4" aria-hidden />
              Neue Ersteinschätzung
            </Button>
            {!embedded && (
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <a href="/courses">Kurse ansehen</a>
                </Button>
                <Button asChild>
                  <a href="/therapists">Therapeut:innen finden</a>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Therapeuten-Vergleich Modal */}
        {showComparison && (
          <TherapistComparison
            therapists={selectedTherapistData}
            onClose={() => setShowComparison(false)}
          />
        )}
      </div>
    )
  }

  // Question flow
  const currentQuestion = currentQuestions[questionIndex]
  const isMultipleChoice = currentSection.type === 'support' || currentSection.type === 'availability'

  return (
    <div className="space-y-6">
      {/* Disclaimer - Nur am Anfang des Quiz */}
      {sectionIndex === 0 && questionIndex === 0 && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-blue-500 text-white">
              <Info className="h-4 w-4" aria-hidden />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900">Wichtiger Hinweis</h4>
              <p className="mt-1 text-xs text-blue-800">
                Diese Ersteinschätzung ist <strong>keine medizinische Diagnose</strong>, sondern dient zur Orientierung. Die Ergebnisse ersetzen keine professionelle Beratung durch Therapeut:innen oder Ärzt:innen.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Crisis Banner - Sofort sichtbar bei PHQ-9 Item 9 ≥1 */}
      {showCrisisBanner && (
        <div className="rounded-2xl border-2 border-red-400 bg-red-50 p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-red-500 text-white">
              <AlertTriangle className="h-5 w-5" aria-hidden />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-red-900">Wichtig: Sofortige Unterstützung verfügbar</h4>
              <p className="mt-1 text-sm text-red-800">
                Wir nehmen deine Antwort sehr ernst. Wenn du akut Hilfe brauchst, kontaktiere bitte sofort die Telefonseelsorge (142, kostenlos & anonym, 24/7) oder den Notruf (144).
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href="tel:142"
                  className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-red-600"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  Telefonseelsorge 142
                </a>
                <a
                  href="tel:144"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-red-500 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  Notruf 144
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
      className="rounded-3xl border border-divider bg-white/90 p-8 shadow-lg shadow-primary/10 backdrop-blur"
      aria-live="polite"
    >
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          <Sparkles className="h-4 w-4" aria-hidden />
          {currentSection.title}
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-default">
              {isMultipleChoice ? currentSection.title : currentQuestion?.text}
            </h3>
            <p className="mt-1 text-sm text-muted">{currentSection.subtitle}</p>
          </div>
          {!isMultipleChoice && currentQuestion && (
            <QuestionTooltip
              helpText={currentQuestion.helpText}
              scientificContext={currentQuestion.scientificContext}
            />
          )}
        </div>
      </header>

      {/* Progress bar */}
      <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          aria-hidden
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${sectionIndex}-${questionIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          {isMultipleChoice ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(currentSection.type === 'support' ? supportOptions : availabilityOptions).map((option) => {
                  const selected = answers[currentSection.type].includes(option.value)
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleMultipleSelect(option.value)}
                      className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                        selected
                          ? 'border-primary bg-primary/10 shadow-sm shadow-primary/20'
                          : 'border-divider bg-surface-1/95 hover:border-primary/30'
                      }`}
                    >
                      <span className={`text-base font-semibold ${selected ? 'text-primary' : 'text-default'}`}>
                        {option.label}
                      </span>
                      <span className="text-sm text-muted">{option.description}</span>
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center justify-between pt-4">
                <Button variant="ghost" onClick={goPrevious} disabled={sectionIndex === 0 && questionIndex === 0}>
                  <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
                  Zurück
                </Button>
                <Button onClick={goNext}>
                  Weiter
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {standardResponseOptions.map((option) => {
                const isSelected = answers[currentSection.type][questionIndex] === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleScaleAnswer(option.value)}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-sm shadow-primary/20'
                        : 'border-divider bg-surface-1/95 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-primary/10'
                    }`}
                  >
                    <div>
                      <p className={`text-base font-semibold ${isSelected ? 'text-primary' : 'text-default'}`}>
                        {option.label}
                      </p>
                      <p className="text-sm text-muted">{option.description}</p>
                    </div>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-divider bg-white text-primary'
                      }`}
                    >
                      {option.value}
                    </div>
                  </button>
                )
              })}
              <div className="flex items-center justify-between pt-4 text-xs text-subtle">
                <button
                  type="button"
                  onClick={goPrevious}
                  disabled={sectionIndex === 0 && questionIndex === 0}
                  className="rounded-full border border-divider bg-surface-1 px-3 py-1.5 font-medium text-muted transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Zurück
                </button>
                <div className="flex flex-col items-center gap-1">
                  <span>
                    Fortschritt: {progress}% · {progressCopy}
                  </span>
                  <span className="text-[10px] text-subtle opacity-60">
                    Tipp: Tastatur 0-3, ← →, Enter
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
  )
}
