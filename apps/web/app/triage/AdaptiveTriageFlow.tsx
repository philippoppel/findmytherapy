'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react'
import { Button } from '@mental-health/ui'
import { track } from '../../lib/analytics'
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
  phq9Questions,
  gad7Questions,
} from '../../lib/triage/questionnaires'
import {
  phq2Questions,
  gad2Questions,
  phq9RemainingQuestions,
  gad7RemainingQuestions,
  shouldExpandPHQ9,
  shouldExpandGAD7,
  adaptiveScreeningInfo,
} from '../../lib/triage/adaptive-questionnaires'
import { QuestionTooltip } from './QuestionTooltip'
import { AmpelVisualization } from './AmpelVisualization'
import { CrisisResources } from './CrisisResources'
import { ProgressChart } from './ProgressChart'

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

type AdaptiveTriageFlowProps = {
  embedded?: boolean
  historicalData?: Array<{
    date: string
    phq9Score: number
    gad7Score: number
  }>
}

type Phase = 'phq2' | 'phq9-expanded' | 'phq2-to-gad2' | 'gad2' | 'gad7-expanded' | 'gad2-to-preferences' | 'preferences'

export function AdaptiveTriageFlow({ embedded = false, historicalData = [] }: AdaptiveTriageFlowProps = {}) {
  const [currentPhase, setCurrentPhase] = useState<Phase>('phq2')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>(initialAnswers)
  const [showSummary, setShowSummary] = useState(false)
  const [recommendations, setRecommendations] = useState<{
    therapists: TherapistRecommendation[]
    courses: CourseRecommendation[]
  }>({ therapists: [], courses: [] })
  const [hasPersisted, setHasPersisted] = useState(false)
  const [showTransition, setShowTransition] = useState(false)

  // Get current questions based on phase
  const currentQuestions = useMemo(() => {
    if (currentPhase === 'phq2') return phq2Questions
    if (currentPhase === 'phq9-expanded') return phq9RemainingQuestions
    if (currentPhase === 'gad2') return gad2Questions
    if (currentPhase === 'gad7-expanded') return gad7RemainingQuestions
    return []
  }, [currentPhase])

  // Calculate progress dynamically based on adaptive flow
  const { expectedTotalQuestions, answeredQuestions } = useMemo(() => {
    const phq2Score = answers.phq9.slice(0, 2).reduce((sum, val) => sum + (val ?? 0), 0)
    const gad2Score = answers.gad7.slice(0, 2).reduce((sum, val) => sum + (val ?? 0), 0)

    const needsFullPHQ9 = shouldExpandPHQ9(phq2Score)
    const needsFullGAD7 = shouldExpandGAD7(gad2Score)

    // Calculate expected total based on screening results
    let expected = 2 + 2 + 2 // PHQ-2 + GAD-2 + preferences (minimum)
    if (needsFullPHQ9 || currentPhase === 'phq9-expanded' || answers.phq9.length > 2) {
      expected += 7 // Add remaining PHQ-9 questions
    }
    if (needsFullGAD7 || currentPhase === 'gad7-expanded' || answers.gad7.length > 2) {
      expected += 5 // Add remaining GAD-7 questions
    }

    const answered =
      answers.phq9.length +
      answers.gad7.length +
      (answers.support.length > 0 ? 1 : 0) +
      (answers.availability.length > 0 ? 1 : 0)

    return { expectedTotalQuestions: expected, answeredQuestions: answered }
  }, [answers, currentPhase])

  const progress = Math.round((answeredQuestions / expectedTotalQuestions) * 100)

  const handleScaleAnswer = (value: number) => {
    // Determine which answer array to update based on phase
    const isPhqPhase = currentPhase === 'phq2' || currentPhase === 'phq9-expanded'
    const key = isPhqPhase ? 'phq9' : 'gad7'

    // Calculate the correct index in the full questionnaire array
    let actualIndex = questionIndex
    if (currentPhase === 'phq9-expanded') {
      actualIndex = questionIndex + 2 // Offset by PHQ-2 questions
    } else if (currentPhase === 'gad7-expanded') {
      actualIndex = questionIndex + 2 // Offset by GAD-2 questions
    }

    setAnswers((prev) => {
      const newAnswers = { ...prev }
      const currentAnswers = [...newAnswers[key]]
      currentAnswers[actualIndex] = value
      newAnswers[key] = currentAnswers
      return newAnswers
    })

    setTimeout(() => {
      if (questionIndex < currentQuestions.length - 1) {
        // Move to next question in current section
        setQuestionIndex(questionIndex + 1)
      } else {
        // Finished current section, determine next phase
        setQuestionIndex(0)

        if (currentPhase === 'phq2') {
          // Check if we need to expand to full PHQ-9
          const phq2Answers = answers.phq9.slice(0, 2)
          phq2Answers[questionIndex] = value // Include the answer we just gave
          const phq2Score = phq2Answers.reduce((sum, val) => sum + (val ?? 0), 0)

          if (shouldExpandPHQ9(phq2Score)) {
            // Show transition message, then expand
            setCurrentPhase('phq2-to-gad2')
            setShowTransition(true)
            setTimeout(() => {
              setShowTransition(false)
              setCurrentPhase('phq9-expanded')
            }, 2500)
          } else {
            // PHQ-2 score is low, move to GAD-2
            setCurrentPhase('phq2-to-gad2')
            setShowTransition(true)
            setTimeout(() => {
              setShowTransition(false)
              setCurrentPhase('gad2')
            }, 2500)
          }
        } else if (currentPhase === 'phq9-expanded') {
          // Finished expanded PHQ-9, move to GAD-2
          setCurrentPhase('phq2-to-gad2')
          setShowTransition(true)
          setTimeout(() => {
            setShowTransition(false)
            setCurrentPhase('gad2')
          }, 2500)
        } else if (currentPhase === 'gad2') {
          // Check if we need to expand to full GAD-7
          const gad2Answers = answers.gad7.slice(0, 2)
          gad2Answers[questionIndex] = value // Include the answer we just gave
          const gad2Score = gad2Answers.reduce((sum, val) => sum + (val ?? 0), 0)

          if (shouldExpandGAD7(gad2Score)) {
            // Show transition message, then expand
            setCurrentPhase('gad2-to-preferences')
            setShowTransition(true)
            setTimeout(() => {
              setShowTransition(false)
              setCurrentPhase('gad7-expanded')
            }, 2500)
          } else {
            // GAD-2 score is low, move to preferences
            setCurrentPhase('gad2-to-preferences')
            setShowTransition(true)
            setTimeout(() => {
              setShowTransition(false)
              setCurrentPhase('preferences')
            }, 2500)
          }
        } else if (currentPhase === 'gad7-expanded') {
          // Finished expanded GAD-7, move to preferences
          setCurrentPhase('gad2-to-preferences')
          setShowTransition(true)
          setTimeout(() => {
            setShowTransition(false)
            setCurrentPhase('preferences')
          }, 2500)
        }
      }
    }, 300)
  }

  const toggleMultipleSelect = (option: string, type: 'support' | 'availability') => {
    setAnswers((prev) => {
      const currentAnswers = prev[type]
      const alreadySelected = currentAnswers.includes(option)

      return {
        ...prev,
        [type]: alreadySelected
          ? currentAnswers.filter((item) => item !== option)
          : [...currentAnswers, option],
      }
    })
  }

  const goNext = () => {
    if (currentPhase === 'preferences') {
      setShowSummary(true)
    }
  }

  const goPrevious = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1)
    } else {
      // At first question of current phase, go to previous phase
      if (currentPhase === 'phq9-expanded') {
        setCurrentPhase('phq2')
        setQuestionIndex(phq2Questions.length - 1)
      } else if (currentPhase === 'gad2') {
        // Go back based on whether PHQ-9 was expanded
        if (answers.phq9.length > 2) {
          setCurrentPhase('phq9-expanded')
          setQuestionIndex(phq9RemainingQuestions.length - 1)
        } else {
          setCurrentPhase('phq2')
          setQuestionIndex(phq2Questions.length - 1)
        }
      } else if (currentPhase === 'gad7-expanded') {
        setCurrentPhase('gad2')
        setQuestionIndex(gad2Questions.length - 1)
      } else if (currentPhase === 'preferences') {
        // Go back based on whether GAD-7 was expanded
        if (answers.gad7.length > 2) {
          setCurrentPhase('gad7-expanded')
          setQuestionIndex(gad7RemainingQuestions.length - 1)
        } else {
          setCurrentPhase('gad2')
          setQuestionIndex(gad2Questions.length - 1)
        }
      }
    }
  }

  const resetFlow = () => {
    setAnswers(initialAnswers)
    setCurrentPhase('phq2')
    setQuestionIndex(0)
    setShowSummary(false)
    setShowTransition(false)
    setRecommendations({ therapists: [], courses: [] })
    setHasPersisted(false)
    sessionStorage.removeItem('triage-session')
  }

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
    const phq9Total = answers.phq9.reduce((sum, val) => sum + (val ?? 0), 0)
    const gad7Total = answers.gad7.reduce((sum, val) => sum + (val ?? 0), 0)
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
  }, [answers])

  const persistResults = useCallback(
    async ({ force = false }: { force?: boolean } = {}) => {
      if (hasPersisted && !force) return

      if (embedded) {
        setTimeout(() => {
          setHasPersisted(true)
          track('triage_completed', {
            assessmentType: 'full',
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assessmentType: 'full',
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
          throw new Error(data.message || 'Fehler beim Speichern')
        }

        setRecommendations({
          therapists: data.recommendations?.therapists || [],
          courses: data.recommendations?.courses || [],
        })

        track('triage_completed', {
          assessmentType: 'full',
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

  // Save session state when showing summary
  useEffect(() => {
    if (!showSummary) return

    const sessionState = {
      answers,
      recommendations,
      timestamp: Date.now(),
    }

    sessionStorage.setItem('triage-session', JSON.stringify(sessionState))
  }, [showSummary, answers, recommendations])

  // Restore session state on mount
  useEffect(() => {
    const savedSession = sessionStorage.getItem('triage-session')
    if (!savedSession) return

    try {
      const sessionState = JSON.parse(savedSession)

      // Check if session is less than 24 hours old
      const age = Date.now() - sessionState.timestamp
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours

      if (age > maxAge) {
        sessionStorage.removeItem('triage-session')
        return
      }

      // Restore state
      setAnswers(sessionState.answers)
      setRecommendations(sessionState.recommendations)
      setShowSummary(true)
      setHasPersisted(true)
    } catch (error) {
      console.error('Failed to restore triage session', error)
      sessionStorage.removeItem('triage-session')
    }
  }, [])

  // Summary view
  if (showSummary) {
    // Full assessment summary
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-teal-950 via-cyan-950 to-blue-950 py-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="absolute -bottom-32 right-4 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl space-y-6 px-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="ghost"
              onClick={resetFlow}
              className="inline-flex items-center justify-center gap-2 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Ersteinschätzung wiederholen</span>
              <span className="sm:hidden">Test wiederholen</span>
            </Button>
            <Link
              href="/"
              className="text-center text-sm font-medium text-white/70 transition hover:text-white sm:text-left"
            >
              Zur Startseite
            </Link>
          </div>
          {historicalData.length > 0 && (
            <ProgressChart
              data={[
                ...historicalData,
                { date: new Date().toISOString(), phq9Score, gad7Score },
              ]}
            />
          )}

          <AmpelVisualization
            color={ampelColor}
            phq9Score={phq9Score}
            gad7Score={gad7Score}
            phq9Severity={phq9Severity}
            gad7Severity={gad7Severity}
          />

          {requiresEmergency && <CrisisResources showCareTeamContact={!embedded} />}

          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur sm:p-8">
            <header className="mb-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  Deine Ersteinschätzung
                </div>
                <h3 className="text-2xl font-bold text-white sm:text-3xl">Empfohlene nächste Schritte</h3>
              </div>
            </header>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h4 className="text-lg font-semibold text-white">PHQ-9: {phq9SeverityLabels[phq9Severity]}</h4>
                <p className="mt-2 text-sm text-white/70">{phq9SeverityDescriptions[phq9Severity]}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h4 className="text-lg font-semibold text-white">GAD-7: {gad7SeverityLabels[gad7Severity]}</h4>
                <p className="mt-2 text-sm text-white/70">{gad7SeverityDescriptions[gad7Severity]}</p>
              </div>
            </div>

            {/* Konkrete Therapeuten-Empfehlungen */}
            {riskLevel !== 'LOW' && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-teal-400" />
                  <div>
                    <h4 className="text-lg font-bold text-white">Empfehlung: Professionelle Unterstützung</h4>
                    <p className="mt-2 text-sm text-white/70">
                      Basierend auf deiner Einschätzung empfehlen wir dir, mit einem/einer Therapeut:in zu sprechen.
                      Wir können dich dabei unterstützen, schnell einen Termin zu finden.
                    </p>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <Button asChild size="lg" className="w-full bg-teal-900 text-white hover:bg-teal-800 sm:w-auto">
                        <Link href="/therapists">Therapeut:innen ansehen</Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full border-white/40 text-white hover:bg-white/10 sm:w-auto">
                        <Link href="/contact">Hilfe beim Finden</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {recommendations.therapists.length > 0 && (
              <section className="mt-8">
                <h4 className="mb-4 text-lg font-bold text-white sm:text-xl">Passende Therapeut:innen</h4>
                <div className="space-y-4">
                  {recommendations.therapists.map((therapist) => (
                    <article
                      key={therapist.id}
                      className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-sm backdrop-blur transition hover:bg-white/15 sm:p-6"
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
                                className="h-16 w-16 rounded-lg object-cover object-center sm:h-24 sm:w-24 sm:rounded-xl"
                                sizes="(max-width: 640px) 64px, 96px"
                                quality={90}
                              />
                            </div>
                          )}
                          <div className="flex-1 space-y-2 sm:space-y-3">
                            <div>
                              <h5 className="text-base font-bold text-white sm:text-lg">{therapist.name}</h5>
                              <p className="text-xs text-white/70 sm:text-sm">{therapist.title}</p>
                              {therapist.headline ? (
                                <p className="mt-1 text-xs text-white/80 sm:text-sm">{therapist.headline}</p>
                              ) : null}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
                              <span>{therapist.focus.slice(0, 3).join(' • ')}</span>
                              <span aria-hidden>•</span>
                              <span>{therapist.location}</span>
                              {therapist.languages && therapist.languages.length > 0 ? (
                                <>
                                  <span aria-hidden>•</span>
                                  <span>{therapist.languages.slice(0, 2).join(', ')}</span>
                                </>
                              ) : null}
                            </div>
                            {therapist.services && therapist.services.length > 0 ? (
                              <div className="mt-1 flex flex-wrap gap-2">
                                {therapist.services.slice(0, 3).map((service) => (
                                  <span
                                    key={service}
                                    className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white"
                                  >
                                    {service}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-white/65">
                              <span className="font-medium text-white">{therapist.availability}</span>
                              {therapist.responseTime ? (
                                <>
                                  <span aria-hidden>•</span>
                                  <span>{therapist.responseTime}</span>
                                </>
                              ) : null}
                              <span aria-hidden>•</span>
                              <span>
                                {therapist.rating.toFixed(1)} ({therapist.reviews} Bewertungen)
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                              {therapist.formatTags.map((tag) => (
                                <span key={tag} className="rounded-full bg-white/15 px-3 py-1 font-medium text-white/75">
                                  {tag === 'online' ? 'Online' : tag === 'praesenz' ? 'Vor Ort' : 'Hybrid'}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 sm:items-end">
                          <Button asChild className="w-full bg-teal-900 text-white hover:bg-teal-800 sm:w-auto">
                            <Link href={`/therapists/${therapist.id}?from=triage`}>
                              Profil ansehen
                            </Link>
                          </Button>
                          {therapist.acceptingClients === false ? (
                            <span className="text-xs font-medium text-amber-200">Aktuell Warteliste</span>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {recommendations.courses.length > 0 && (
              <section className="mt-8">
                <h4 className="mb-4 text-lg font-bold text-white sm:text-xl">Empfohlene Programme</h4>
                <div className="space-y-4">
                  {recommendations.courses.map((course) => (
                    <article
                      key={course.slug}
                      className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur sm:p-6"
                    >
                      <h5 className="text-base font-bold text-white sm:text-lg">{course.title}</h5>
                      <p className="mt-1 text-xs text-white/70 sm:text-sm">{course.shortDescription}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/65 sm:gap-3">
                        <span>{course.duration}</span>
                        <span aria-hidden>•</span>
                        <span>{course.format}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {course.outcomes.map((item) => (
                          <span key={item} className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-medium text-white sm:px-3 sm:text-[11px]">
                            {item}
                          </span>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" asChild className="mt-4 w-full border-white/30 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
                        <Link href={`/courses/${course.slug}`}>
                          Demo ansehen
                        </Link>
                      </Button>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Question flow
  const currentQuestion = currentQuestions[questionIndex]
  const isPreferences = currentPhase === 'preferences'
  const isTransition = currentPhase === 'phq2-to-gad2' || currentPhase === 'gad2-to-preferences'

  // Get phase info
  const phaseInfo = useMemo(() => {
    if (currentPhase === 'phq2') {
      return {
        title: adaptiveScreeningInfo.initial.title,
        description: 'Wir beginnen mit 2 kurzen Fragen zu deiner Stimmung in den letzten zwei Wochen.'
      }
    }
    if (currentPhase === 'phq9-expanded') {
      return {
        title: 'Detaillierte Depressions-Einschätzung',
        description: adaptiveScreeningInfo.expanding.description
      }
    }
    if (currentPhase === 'gad2') {
      return {
        title: 'Angst Screening',
        description: 'Jetzt 2 kurze Fragen zu Angst und Sorgen in den letzten zwei Wochen.'
      }
    }
    if (currentPhase === 'gad7-expanded') {
      return {
        title: 'Detaillierte Angst-Einschätzung',
        description: adaptiveScreeningInfo.expanding.description
      }
    }
    if (currentPhase === 'preferences') {
      return {
        title: 'Deine Präferenzen',
        description: 'Zum Abschluss noch ein paar Fragen zu deinen Wünschen.'
      }
    }
    return { title: '', description: '' }
  }, [currentPhase])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-teal-950 via-cyan-950 to-blue-950 py-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-32 right-4 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4">
        <div className="mb-6 flex justify-end">
          <Link
            href="/"
            className="text-sm font-medium text-white/70 transition hover:text-white"
          >
            Zur Startseite
          </Link>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur sm:p-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-xs text-white/70 sm:text-sm">
              <span className="font-medium text-white">{phaseInfo.title}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
              <motion.div
                className="h-full rounded-full bg-teal-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isTransition ? (
              <motion.div
                key="transition"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex min-h-[300px] items-center justify-center py-12"
              >
                <div className="text-center">
                  {currentPhase === 'phq2-to-gad2' ? (
                    <>
                      {!shouldExpandPHQ9(answers.phq9.slice(0, 2).reduce((sum, val) => sum + (val ?? 0), 0)) ? (
                        <>
                          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-teal-400" />
                          <h3 className="text-xl font-bold text-white sm:text-2xl">
                            {adaptiveScreeningInfo.minimal.title}
                          </h3>
                          <p className="mt-2 text-sm text-white/70 sm:text-base">
                            Deine Antworten deuten auf minimale Depressionssymptome hin.
                          </p>
                          <p className="mt-4 text-sm font-medium text-teal-400">
                            Weiter zum Angst-Screening...
                          </p>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-amber-400" />
                          <h3 className="text-xl font-bold text-white sm:text-2xl">
                            {adaptiveScreeningInfo.expanding.title}
                          </h3>
                          <p className="mt-2 text-sm text-white/70 sm:text-base">
                            {adaptiveScreeningInfo.expanding.description}
                          </p>
                          <p className="mt-4 text-sm font-medium text-amber-400">
                            Zusätzliche Fragen werden gestellt...
                          </p>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {!shouldExpandGAD7(answers.gad7.slice(0, 2).reduce((sum, val) => sum + (val ?? 0), 0)) ? (
                        <>
                          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-teal-400" />
                          <h3 className="text-xl font-bold text-white sm:text-2xl">
                            {adaptiveScreeningInfo.minimal.title}
                          </h3>
                          <p className="mt-2 text-sm text-white/70 sm:text-base">
                            Deine Antworten deuten auf minimale Angstsymptome hin.
                          </p>
                          <p className="mt-4 text-sm font-medium text-teal-400">
                            Fast geschafft!
                          </p>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-amber-400" />
                          <h3 className="text-xl font-bold text-white sm:text-2xl">
                            {adaptiveScreeningInfo.expanding.title}
                          </h3>
                          <p className="mt-2 text-sm text-white/70 sm:text-base">
                            {adaptiveScreeningInfo.expanding.description}
                          </p>
                          <p className="mt-4 text-sm font-medium text-amber-400">
                            Zusätzliche Fragen werden gestellt...
                          </p>
                        </>
                      )}
                    </>
                  )}
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
                  <header>
                    <h3 className="text-xl font-bold text-white sm:text-2xl">Fast geschafft!</h3>
                    <p className="mt-2 text-sm text-white/70 sm:text-base">{phaseInfo.description}</p>
                  </header>

                  <div>
                    <p className="mb-3 text-sm font-semibold text-white">
                      Welche Unterstützung wünschst du dir?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {supportOptions.map((option) => {
                        const selected = answers.support.includes(option.value)
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => toggleMultipleSelect(option.value, 'support')}
                            className={`rounded-xl border p-3 text-left transition sm:p-4 ${
                              selected
                                ? 'border-teal-400/60 bg-teal-400/20 shadow-lg shadow-teal-500/20'
                                : 'border-white/20 bg-white/5 hover:border-teal-400/40 hover:bg-white/10'
                            }`}
                          >
                            <p className={`text-sm font-semibold sm:text-base ${selected ? 'text-white' : 'text-white/85'}`}>
                              {option.label}
                            </p>
                            <p className="mt-1 text-xs text-white/70 sm:text-sm">{option.description}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold text-white">
                      Wann passt es dir am besten?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {availabilityOptions.map((option) => {
                        const selected = answers.availability.includes(option.value)
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => toggleMultipleSelect(option.value, 'availability')}
                            className={`rounded-xl border p-3 text-left transition sm:p-4 ${
                              selected
                                ? 'border-teal-400/60 bg-teal-400/20 shadow-lg shadow-teal-500/20'
                                : 'border-white/20 bg-white/5 hover:border-teal-400/40 hover:bg-white/10'
                            }`}
                          >
                            <p className={`text-sm font-semibold sm:text-base ${selected ? 'text-white' : 'text-white/85'}`}>
                              {option.label}
                            </p>
                            <p className="mt-1 text-xs text-white/70 sm:text-sm">{option.description}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="ghost" onClick={goPrevious} className="w-full text-white hover:bg-white/10 sm:w-auto">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Zurück
                    </Button>
                    <Button onClick={goNext} size="lg" className="w-full bg-teal-900 text-white hover:bg-teal-800 sm:w-auto">
                      Ergebnis anzeigen
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <header>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white sm:text-2xl">{currentQuestion?.text}</h3>
                        <p className="mt-2 text-xs text-white/70 sm:text-sm">{phaseInfo.description}</p>
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
                      const answerKey = currentPhase as 'phq9' | 'gad7'
                      const isSelected = answers[answerKey]?.[questionIndex] === option.value

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleScaleAnswer(option.value)}
                          className={`flex w-full items-center justify-between gap-2 rounded-xl border p-3 transition sm:gap-3 sm:p-4 ${
                            isSelected
                              ? 'border-teal-400/60 bg-teal-400/20 shadow-lg shadow-teal-500/20'
                              : 'border-white/20 bg-white/5 hover:-translate-y-0.5 hover:border-teal-400/40 hover:bg-white/10'
                          }`}
                        >
                          <div className="text-left">
                            <p className={`text-sm font-semibold sm:text-base ${isSelected ? 'text-white' : 'text-white/85'}`}>
                              {option.label}
                            </p>
                            <p className="text-xs text-white/70 sm:text-sm">{option.description}</p>
                          </div>
                          <div
                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-sm font-semibold sm:h-10 sm:w-10 ${
                              isSelected
                                ? 'border-teal-700 bg-teal-700 text-white'
                                : 'border-white/30 bg-white/10 text-white'
                            }`}
                          >
                            {option.value}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 text-xs text-white/70 sm:text-sm">
                    <button
                      type="button"
                      onClick={goPrevious}
                      disabled={currentPhase === 'phq2' && questionIndex === 0}
                      className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/15 disabled:opacity-50 sm:px-6"
                    >
                      Zurück
                    </button>
                    <span className="text-center">
                      {(currentPhase === 'phq2' || currentPhase === 'phq9-expanded') && (
                        <>
                          <span className="hidden sm:inline">Depression: Frage {questionIndex + 1 + (currentPhase === 'phq9-expanded' ? 2 : 0)} von {currentPhase === 'phq9-expanded' ? 9 : 2}</span>
                          <span className="sm:hidden">Depression: {questionIndex + 1 + (currentPhase === 'phq9-expanded' ? 2 : 0)}/{currentPhase === 'phq9-expanded' ? 9 : 2}</span>
                        </>
                      )}
                      {(currentPhase === 'gad2' || currentPhase === 'gad7-expanded') && (
                        <>
                          <span className="hidden sm:inline">Angst: Frage {questionIndex + 1 + (currentPhase === 'gad7-expanded' ? 2 : 0)} von {currentPhase === 'gad7-expanded' ? 7 : 2}</span>
                          <span className="sm:hidden">Angst: {questionIndex + 1 + (currentPhase === 'gad7-expanded' ? 2 : 0)}/{currentPhase === 'gad7-expanded' ? 7 : 2}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
