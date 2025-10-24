'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Calendar,
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

type QuestionSection = {
  id: string
  type: 'phq9' | 'gad7' | 'support' | 'availability'
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
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

  const currentSection = questionSections[sectionIndex]

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

  const handleScaleAnswer = (value: number) => {
    const sectionType = currentSection.type
    if (sectionType !== 'phq9' && sectionType !== 'gad7') return

    setAnswers((prev) => {
      const newAnswers = { ...prev }
      const currentAnswers = [...newAnswers[sectionType]]
      currentAnswers[questionIndex] = value
      newAnswers[sectionType] = currentAnswers
      return newAnswers
    })

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
  }

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

  const goNext = () => {
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
  }

  const nextSection = () => {
    if (sectionIndex < questionSections.length - 1) {
      setSectionIndex(sectionIndex + 1)
      setQuestionIndex(0)
    } else {
      setShowSummary(true)
    }
  }

  const goPrevious = () => {
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
  }

  const resetFlow = () => {
    setAnswers(initialAnswers)
    setSectionIndex(0)
    setQuestionIndex(0)
    setShowSummary(false)
    setRecommendations({ therapists: [], courses: [] })
    setPersistState('idle')
    setPersistError(null)
    setHasPersisted(false)
  }

  const { phq9Score, gad7Score, phq9Severity, gad7Severity, riskLevel, ampelColor, requiresEmergency } = useMemo(() => {
    const phq9Total = answers.phq9.reduce((sum, val) => sum + (val || 0), 0)
    const gad7Total = answers.gad7.reduce((sum, val) => sum + (val || 0), 0)

    const phq9Sev = calculatePHQ9Severity(phq9Total)
    const gad7Sev = calculateGAD7Severity(gad7Total)
    const risk = assessRiskLevel(phq9Total, gad7Total)

    return {
      phq9Score: phq9Total,
      gad7Score: gad7Total,
      phq9Severity: phq9Sev,
      gad7Severity: gad7Sev,
      riskLevel: risk.level,
      ampelColor: risk.ampelColor,
      requiresEmergency: risk.requiresEmergency,
    }
  }, [answers.phq9, answers.gad7])

  const persistResults = useCallback(
    async ({ force = false }: { force?: boolean } = {}) => {
      if (hasPersisted && !force) return

      // For embedded mode, use mock data
      if (embedded) {
        setTimeout(() => {
          setPersistState('success')
          setHasPersisted(true)
          track('triage_completed', {
            phq9Score,
            gad7Score,
            riskLevel,
            source: 'embedded',
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
    ]
  )

  useEffect(() => {
    if (!showSummary) return
    void persistResults()
  }, [showSummary, persistResults])

  // Summary view
  if (showSummary) {
    return (
      <div className="space-y-6">
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

        {/* Ampel Visualization */}
        <AmpelVisualization
          color={ampelColor}
          phq9Score={phq9Score}
          gad7Score={gad7Score}
          phq9Severity={phq9Severity}
          gad7Severity={gad7Severity}
        />

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

          {/* PHQ-9 Details */}
          <div className="mt-6 rounded-2xl border border-divider bg-surface-1/90 p-6">
            <h4 className="text-lg font-semibold text-default">PHQ-9: {phq9SeverityLabels[phq9Severity]}</h4>
            <p className="mt-2 text-sm text-muted">{phq9SeverityDescriptions[phq9Severity]}</p>
          </div>

          {/* GAD-7 Details */}
          <div className="mt-4 rounded-2xl border border-divider bg-surface-1/90 p-6">
            <h4 className="text-lg font-semibold text-default">GAD-7: {gad7SeverityLabels[gad7Severity]}</h4>
            <p className="mt-2 text-sm text-muted">{gad7SeverityDescriptions[gad7Severity]}</p>
          </div>

          {/* Preferences */}
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
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
              <h4 className="text-lg font-semibold text-default">Empfohlene Therapeut:innen</h4>
              <div className="space-y-4">
                {recommendations.therapists.map((therapist) => (
                  <article
                    key={therapist.id}
                    className="rounded-2xl border border-divider bg-white/90 p-5 shadow-sm"
                  >
                    <div className="space-y-2">
                      <div>
                        <p className="text-base font-semibold text-default">{therapist.name}</p>
                        <p className="text-xs text-muted">{therapist.title}</p>
                        {therapist.headline ? (
                          <p className="mt-1 text-xs text-default">{therapist.headline}</p>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-wide text-muted">
                        <span>{therapist.focus.slice(0, 3).join(' • ')}</span>
                        <span aria-hidden>•</span>
                        <span>{therapist.location}</span>
                      </div>
                      {therapist.services && therapist.services.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {therapist.services.slice(0, 2).map((service) => (
                            <span key={service} className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary">
                              {service}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <div className="text-[11px] text-muted">
                        <span className="font-semibold text-primary">{therapist.availability}</span>
                        {therapist.responseTime ? ` · ${therapist.responseTime}` : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
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
                  </article>
                ))}
              </div>
            </section>
          )}

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
      </div>
    )
  }

  // Question flow
  const currentQuestion = currentQuestions[questionIndex]
  const isMultipleChoice = currentSection.type === 'support' || currentSection.type === 'availability'

  return (
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
                <span>
                  Fortschritt: {progress}% · {progressCopy}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
