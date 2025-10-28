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
} from '../../lib/triage/questionnaires'
import {
  phq2Questions,
  gad2Questions,
  phq9RemainingQuestions,
  gad7RemainingQuestions,
  getAdaptiveQuestions,
  adaptiveScreeningInfo,
} from '../../lib/triage/adaptive-questionnaires'
import { QuestionTooltip } from './QuestionTooltip'
import { AmpelVisualization } from './AmpelVisualization'
import { CrisisResources } from './CrisisResources'
import { ProgressChart } from './ProgressChart'

type Answers = {
  phq2: number[]
  gad2: number[]
  phq9Expanded: number[]
  gad7Expanded: number[]
  support: string[]
  availability: string[]
}

const initialAnswers: Answers = {
  phq2: [],
  gad2: [],
  phq9Expanded: [],
  gad7Expanded: [],
  support: [],
  availability: [],
}

type AssessmentType = 'screening' | 'full'

type ScreeningResult = {
  phq2Score: number
  gad2Score: number
  message: string
  interpretation: string
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

export function AdaptiveTriageFlow({ embedded = false, historicalData = [] }: AdaptiveTriageFlowProps = {}) {
  const [currentPhase, setCurrentPhase] = useState<'screening' | 'expanded' | 'preferences' | 'summary'>('screening')
  const [screeningStep, setScreeningStep] = useState<'phq2' | 'gad2'>('phq2')
  const [expandedSections, setExpandedSections] = useState<{
    phq9: boolean
    gad7: boolean
  }>({ phq9: false, gad7: false })
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>(initialAnswers)
  const [showSummary, setShowSummary] = useState(false)
  const [recommendations, setRecommendations] = useState<{
    therapists: TherapistRecommendation[]
    courses: CourseRecommendation[]
  }>({ therapists: [], courses: [] })
  const [hasPersisted, setHasPersisted] = useState(false)
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('screening')
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null)

  // Calculate adaptive flow
  const adaptiveFlow = useMemo(() => {
    return getAdaptiveQuestions(answers.phq2, answers.gad2)
  }, [answers.phq2, answers.gad2])

  // Get current questions based on phase
  const currentQuestions = useMemo(() => {
    if (currentPhase === 'screening') {
      return screeningStep === 'phq2' ? phq2Questions : gad2Questions
    }
    if (currentPhase === 'expanded') {
      if (expandedSections.phq9 && !expandedSections.gad7) {
        return phq9RemainingQuestions
      }
      if (expandedSections.gad7) {
        return gad7RemainingQuestions
      }
    }
    return []
  }, [currentPhase, screeningStep, expandedSections])

  const totalPossibleQuestions = 4 + 7 + 5 + 2 // PHQ-2 + GAD-2 + expanded + preferences
  const answeredQuestions =
    answers.phq2.length +
    answers.gad2.length +
    answers.phq9Expanded.length +
    answers.gad7Expanded.length +
    (answers.support.length > 0 ? 1 : 0) +
    (answers.availability.length > 0 ? 1 : 0)
  const progress = Math.round((answeredQuestions / totalPossibleQuestions) * 100)

  const handleScaleAnswer = (value: number) => {
    if (currentPhase === 'screening') {
      const key = screeningStep === 'phq2' ? 'phq2' : 'gad2'
      setAnswers((prev) => {
        const newAnswers = { ...prev }
        const currentAnswers = [...newAnswers[key]]
        currentAnswers[questionIndex] = value
        newAnswers[key] = currentAnswers
        return newAnswers
      })

      setTimeout(() => {
        if (questionIndex < currentQuestions.length - 1) {
          setQuestionIndex(questionIndex + 1)
        } else {
          // Finished current screening section
          if (screeningStep === 'phq2') {
            setScreeningStep('gad2')
            setQuestionIndex(0)
          } else {
            // Finished GAD-2, check if expansion needed
            checkExpansionNeeded()
          }
        }
      }, 300)
    } else if (currentPhase === 'expanded') {
      const key = expandedSections.phq9 && !expandedSections.gad7 ? 'phq9Expanded' : 'gad7Expanded'
      setAnswers((prev) => {
        const newAnswers = { ...prev }
        const currentAnswers = [...newAnswers[key]]
        currentAnswers[questionIndex] = value
        newAnswers[key] = currentAnswers
        return newAnswers
      })

      setTimeout(() => {
        if (questionIndex < currentQuestions.length - 1) {
          setQuestionIndex(questionIndex + 1)
        } else {
          // Finished current expanded section
          moveToNextExpandedSection()
        }
      }, 300)
    }
  }

  const checkExpansionNeeded = () => {
    const { needsFullPHQ9, needsFullGAD7, phq2Score, gad2Score } = adaptiveFlow

    if (needsFullPHQ9 || needsFullGAD7) {
      // Scores are ≥3, need full assessment
      setAssessmentType('full')
      setCurrentPhase('expanded')
      setExpandedSections({ phq9: needsFullPHQ9, gad7: needsFullGAD7 })
      setQuestionIndex(0)
    } else {
      // Scores are <3, screening is negative
      // DO NOT pad with zeros - this is scientifically incorrect
      // Show screening-only result
      setAssessmentType('screening')
      setScreeningResult({
        phq2Score,
        gad2Score,
        message: 'Screening unauffällig',
        interpretation: 'Basierend auf dem validierten Kurzscreening (PHQ-2/GAD-2) zeigen sich aktuell minimale Symptome.',
      })
      setCurrentPhase('preferences')
      setQuestionIndex(0)
    }
  }

  const moveToNextExpandedSection = () => {
    if (expandedSections.phq9 && expandedSections.gad7) {
      // Just finished PHQ-9, now do GAD-7
      setExpandedSections((prev) => ({ ...prev, phq9: false }))
      setQuestionIndex(0)
    } else {
      // Finished all expanded sections
      setCurrentPhase('preferences')
      setQuestionIndex(0)
    }
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
    if (currentPhase === 'screening') {
      if (screeningStep === 'gad2' && questionIndex > 0) {
        setQuestionIndex(questionIndex - 1)
      } else if (screeningStep === 'gad2' && questionIndex === 0) {
        setScreeningStep('phq2')
        setQuestionIndex(phq2Questions.length - 1)
      } else if (questionIndex > 0) {
        setQuestionIndex(questionIndex - 1)
      }
    } else if (currentPhase === 'expanded') {
      if (questionIndex > 0) {
        setQuestionIndex(questionIndex - 1)
      }
    } else if (currentPhase === 'preferences') {
      // Go back to last expanded section or screening
      if (expandedSections.phq9 || expandedSections.gad7) {
        setCurrentPhase('expanded')
        setQuestionIndex(currentQuestions.length - 1)
      } else {
        setCurrentPhase('screening')
        setScreeningStep('gad2')
        setQuestionIndex(gad2Questions.length - 1)
      }
    }
  }

  const resetFlow = () => {
    setAnswers(initialAnswers)
    setCurrentPhase('screening')
    setScreeningStep('phq2')
    setQuestionIndex(0)
    setExpandedSections({ phq9: false, gad7: false })
    setShowSummary(false)
    setRecommendations({ therapists: [], courses: [] })
    setHasPersisted(false)
    setAssessmentType('screening')
    setScreeningResult(null)
    sessionStorage.removeItem('triage-session')
  }

  // Calculate final scores ONLY for full assessment
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
    // Only calculate full scores if we have full data
    // For partial expansion: pad the non-expanded side with zeros (scientifically acceptable for negative screening)
    const fullPHQ9Answers = [...answers.phq2, ...answers.phq9Expanded]
    const fullGAD7Answers = [...answers.gad2, ...answers.gad7Expanded]

    // If this is a screening-only result (no expansion), don't calculate severity
    // Use minimal values as placeholder (will not be displayed for screening-only)
    if (assessmentType === 'screening') {
      return {
        phq9Score: 0,
        gad7Score: 0,
        phq9Severity: 'minimal' as const,
        gad7Severity: 'minimal' as const,
        riskLevel: 'LOW' as const,
        ampelColor: 'green' as const,
        requiresEmergency: false,
        phq9Item9Score: 0,
        hasSuicidalIdeation: false,
      }
    }

    const phq9Total = fullPHQ9Answers.reduce((sum, val) => sum + (val ?? 0), 0)
    const gad7Total = fullGAD7Answers.reduce((sum, val) => sum + (val ?? 0), 0)
    const item9Score = fullPHQ9Answers[8] ?? 0

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
  }, [answers, assessmentType])

  const persistResults = useCallback(
    async ({ force = false }: { force?: boolean } = {}) => {
      if (hasPersisted && !force) return

      if (embedded) {
        setTimeout(() => {
          setHasPersisted(true)
          track('triage_completed', {
            assessmentType,
            phq9Score: assessmentType === 'full' ? phq9Score : undefined,
            gad7Score: assessmentType === 'full' ? gad7Score : undefined,
            phq2Score: screeningResult?.phq2Score,
            gad2Score: screeningResult?.gad2Score,
            riskLevel: assessmentType === 'full' ? riskLevel : undefined,
            source: 'embedded',
            requiresEmergency: assessmentType === 'full' ? requiresEmergency : false,
            hasSuicidalIdeation: assessmentType === 'full' ? hasSuicidalIdeation : false,
          })
        }, 1000)
        return
      }

      try {
        if (assessmentType === 'screening') {
          // For screening-only: send minimal data
          const response = await fetch('/api/triage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              assessmentType: 'screening',
              phq2Answers: answers.phq2,
              gad2Answers: answers.gad2,
              phq2Score: screeningResult!.phq2Score,
              gad2Score: screeningResult!.gad2Score,
              supportPreferences: answers.support,
              availability: answers.availability,
            }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message || 'Fehler beim Speichern')
          }

          // Screening-only: no therapist/course recommendations
          setRecommendations({
            therapists: [],
            courses: [],
          })

          track('triage_completed', {
            assessmentType: 'screening',
            phq2Score: screeningResult!.phq2Score,
            gad2Score: screeningResult!.gad2Score,
            adaptive: true,
          })
        } else {
          // Full assessment: send complete data
          const fullPHQ9Answers = [...answers.phq2, ...answers.phq9Expanded]
          const fullGAD7Answers = [...answers.gad2, ...answers.gad7Expanded]

          // Handle partial expansion: pad with zeros where screening was negative
          // This is scientifically acceptable because:
          // - If PHQ-2 <3: screening was negative → padding remaining 7 items with 0 is valid
          // - If GAD-2 <3: screening was negative → padding remaining 5 items with 0 is valid
          while (fullPHQ9Answers.length < 9) fullPHQ9Answers.push(0)
          while (fullGAD7Answers.length < 7) fullGAD7Answers.push(0)

          const response = await fetch('/api/triage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              assessmentType: 'full',
              phq9Answers: fullPHQ9Answers,
              gad7Answers: fullGAD7Answers,
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
            adaptive: true,
          })
        }
      } catch (error) {
        console.error('Failed to persist triage results', error)
        track('triage_save_failed', {
          message: error instanceof Error ? error.message : 'unknown',
          adaptive: true,
          assessmentType,
        })
      } finally {
        setHasPersisted(true)
      }
    },
    [
      answers,
      assessmentType,
      screeningResult,
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
    // Screening-only summary
    if (assessmentType === 'screening' && screeningResult) {
      return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-teal-950 via-cyan-950 to-blue-950 py-16">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-teal-500/20 blur-3xl" />
            <div className="absolute -bottom-32 right-4 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-3xl space-y-6 px-4">
            <div className="mb-4 flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                onClick={resetFlow}
                className="inline-flex items-center gap-2 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
                Neue Einschätzung
              </Button>
              <Link
                href="/"
                className="text-sm font-medium text-white/70 transition hover:text-white"
              >
                Zur Startseite
              </Link>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
              <header className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  {screeningResult.message}
                </div>
                <h3 className="mt-4 text-3xl font-bold text-white">Dein Screening-Ergebnis</h3>
                <p className="mt-2 text-white/80">{screeningResult.interpretation}</p>
              </header>

              <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-blue-300" />
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white">Wissenschaftlicher Hinweis</h4>
                    <p className="mt-2 text-sm text-white/80">
                      PHQ-2 und GAD-2 sind <strong>validierte Screening-Instrumente</strong> mit hoher Sensitivität (PHQ-2: 83%, GAD-2: 86%).
                      Da deine Scores unter dem Schwellenwert von 3 liegen, wurde das vollständige Assessment nicht durchgeführt.
                    </p>
                    <p className="mt-2 text-sm text-white/80">
                      <strong>Wichtig:</strong> Ein unauffälliges Screening bedeutet nicht zwingend, dass keine Symptome vorliegen.
                      Falls du trotzdem Unterstützung suchst oder bestimmte Symptome hast, kannst du das vollständige Assessment durchführen.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-white/70">PHQ-2 Score</h4>
                  <p className="mt-2 text-3xl font-bold text-white">{screeningResult.phq2Score}/6</p>
                  <p className="mt-1 text-sm text-white/60">Unter Schwellenwert (&lt; 3)</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-white/70">GAD-2 Score</h4>
                  <p className="mt-2 text-3xl font-bold text-white">{screeningResult.gad2Score}/6</p>
                  <p className="mt-1 text-sm text-white/60">Unter Schwellenwert (&lt; 3)</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <h4 className="text-lg font-bold text-white">Empfohlene nächste Schritte</h4>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <ul className="space-y-3 text-sm text-white/80">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
                      <span>Pflege deine mentale Gesundheit präventiv durch Bewegung, soziale Kontakte und Schlafhygiene</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
                      <span>Bei Veränderungen oder erhöhter Belastung: Wiederhole das Screening oder mache das vollständige Assessment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
                      <span>Nutze Ressourcen wie Psychoedukation oder digitale Programme zur Resilienzstärkung</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Reset and force full assessment
                    setAnswers(initialAnswers)
                    setCurrentPhase('screening')
                    setScreeningStep('phq2')
                    setQuestionIndex(0)
                    setExpandedSections({ phq9: true, gad7: true })
                    setShowSummary(false)
                    setAssessmentType('full')
                    setScreeningResult(null)
                    setHasPersisted(false)
                  }}
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  Vollständiges Assessment durchführen
                </Button>
                {!embedded && (
                  <Button asChild className="bg-teal-400 text-white hover:bg-teal-300">
                    <Link href="/courses">Präventive Programme ansehen</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Full assessment summary
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-teal-950 via-cyan-950 to-blue-950 py-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="absolute -bottom-32 right-4 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl space-y-6 px-4">
          <div className="mb-4 flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={resetFlow}
              className="inline-flex items-center gap-2 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Ersteinschätzung wiederholen
            </Button>
            <Link
              href="/"
              className="text-sm font-medium text-white/70 transition hover:text-white"
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

          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
            <header className="mb-6 flex items-center justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  Deine Ersteinschätzung
                </div>
                <h3 className="text-3xl font-bold text-white">Empfohlene nächste Schritte</h3>
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
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button asChild size="lg" className="bg-teal-400 text-white hover:bg-teal-300">
                        <Link href="/therapists">Therapeut:innen ansehen</Link>
                      </Button>
                      <Button variant="outline" asChild className="border-white/40 text-white hover:bg-white/10">
                        <Link href="/contact">Hilfe beim Finden</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {recommendations.therapists.length > 0 && (
              <section className="mt-8">
                <h4 className="mb-4 text-xl font-bold text-white">Passende Therapeut:innen</h4>
                <div className="space-y-4">
                  {recommendations.therapists.map((therapist) => (
                    <article
                      key={therapist.id}
                      className="rounded-2xl border border-white/10 bg-white/10 p-6 shadow-sm backdrop-blur transition hover:bg-white/15"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex flex-1 gap-4">
                          {therapist.image && (
                            <div className="flex-shrink-0">
                              <Image
                                src={therapist.image}
                                alt={therapist.name}
                                width={120}
                                height={120}
                                className="h-24 w-24 rounded-xl object-cover object-center"
                                sizes="(max-width: 768px) 96px, 120px"
                                quality={90}
                              />
                            </div>
                          )}
                          <div className="flex-1 space-y-3">
                            <div>
                              <h5 className="text-lg font-bold text-white">{therapist.name}</h5>
                              <p className="text-sm text-white/70">{therapist.title}</p>
                              {therapist.headline ? (
                                <p className="mt-1 text-sm text-white/80">{therapist.headline}</p>
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
                        <div className="flex flex-col items-end gap-2">
                          <Button asChild className="bg-teal-400 text-white hover:bg-teal-300">
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
                <h4 className="mb-4 text-xl font-bold text-white">Empfohlene Programme</h4>
                <div className="space-y-4">
                  {recommendations.courses.map((course) => (
                    <article
                      key={course.slug}
                      className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur"
                    >
                      <h5 className="text-lg font-bold text-white">{course.title}</h5>
                      <p className="mt-1 text-sm text-white/70">{course.shortDescription}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/65">
                        <span>{course.duration}</span>
                        <span aria-hidden>•</span>
                        <span>{course.format}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {course.outcomes.map((item) => (
                          <span key={item} className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white">
                            {item}
                          </span>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" asChild className="mt-4 border-white/30 bg-white/10 text-white hover:bg-white/20">
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

  // Get phase info
  const phaseInfo = currentPhase === 'screening'
    ? adaptiveScreeningInfo.initial
    : currentPhase === 'expanded'
    ? adaptiveScreeningInfo.expanding
    : { title: 'Deine Präferenzen', description: 'Zum Abschluss noch ein paar Fragen zu deinen Wünschen.' }

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
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
          {/* Progress */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm text-white/70">
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
                    <h3 className="text-2xl font-bold text-white">Fast geschafft!</h3>
                    <p className="mt-2 text-white/70">{phaseInfo.description}</p>
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
                            className={`rounded-xl border p-4 text-left transition ${
                              selected
                                ? 'border-teal-400/60 bg-teal-400/20 shadow-lg shadow-teal-500/20'
                                : 'border-white/20 bg-white/5 hover:border-teal-400/40 hover:bg-white/10'
                            }`}
                          >
                            <p className={`font-semibold ${selected ? 'text-white' : 'text-white/85'}`}>
                              {option.label}
                            </p>
                            <p className="mt-1 text-sm text-white/70">{option.description}</p>
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
                            className={`rounded-xl border p-4 text-left transition ${
                              selected
                                ? 'border-teal-400/60 bg-teal-400/20 shadow-lg shadow-teal-500/20'
                                : 'border-white/20 bg-white/5 hover:border-teal-400/40 hover:bg-white/10'
                            }`}
                          >
                            <p className={`font-semibold ${selected ? 'text-white' : 'text-white/85'}`}>
                              {option.label}
                            </p>
                            <p className="mt-1 text-sm text-white/70">{option.description}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Button variant="ghost" onClick={goPrevious} className="text-white hover:bg-white/10">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Zurück
                    </Button>
                    <Button onClick={goNext} size="lg" className="bg-teal-400 text-white hover:bg-teal-300">
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
                        <h3 className="text-2xl font-bold text-white">{currentQuestion?.text}</h3>
                        <p className="mt-2 text-sm text-white/70">{phaseInfo.description}</p>
                      </div>
                      {currentQuestion && (
                        <QuestionTooltip
                          helpText={currentQuestion.helpText}
                          scientificContext={currentQuestion.scientificContext}
                        />
                      )}
                    </div>
                  </header>

                  <div className="space-y-3">
                    {standardResponseOptions.map((option) => {
                      const answerKey = currentPhase === 'screening'
                        ? (screeningStep === 'phq2' ? 'phq2' : 'gad2')
                        : (expandedSections.phq9 && !expandedSections.gad7 ? 'phq9Expanded' : 'gad7Expanded')
                      const isSelected = answers[answerKey][questionIndex] === option.value

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleScaleAnswer(option.value)}
                          className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 transition ${
                            isSelected
                              ? 'border-teal-400/60 bg-teal-400/20 shadow-lg shadow-teal-500/20'
                              : 'border-white/20 bg-white/5 hover:-translate-y-0.5 hover:border-teal-400/40 hover:bg-white/10'
                          }`}
                        >
                          <div className="text-left">
                            <p className={`font-semibold ${isSelected ? 'text-white' : 'text-white/85'}`}>
                              {option.label}
                            </p>
                            <p className="text-sm text-white/70">{option.description}</p>
                          </div>
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full border font-semibold ${
                              isSelected
                                ? 'border-teal-400 bg-teal-400 text-white'
                                : 'border-white/30 bg-white/10 text-white'
                            }`}
                          >
                            {option.value}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 text-sm text-white/70">
                    <button
                      type="button"
                      onClick={goPrevious}
                      disabled={currentPhase === 'screening' && screeningStep === 'phq2' && questionIndex === 0}
                      className="rounded-full border border-white/25 bg-white/10 px-4 py-2 font-medium text-white transition hover:bg-white/15 disabled:opacity-50"
                    >
                      Zurück
                    </button>
                    <span>
                      Frage {questionIndex + 1} von {currentQuestions.length}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
