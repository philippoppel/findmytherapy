'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, RotateCcw, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@mental-health/ui';
import { track } from '../../lib/analytics';
import {
  who5Questions,
  who5ResponseOptions,
  calculateWHO5Score,
  calculateWHO5Severity,
  who5SeverityLabels,
  who5SeverityDescriptions,
  getWHO5Recommendations,
  who5ScientificInfo,
  type WHO5Severity,
} from '../../lib/triage/who5-questionnaire';
import { QuestionTooltip } from './QuestionTooltip';

export function WHO5Flow() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = who5Questions[questionIndex];
  const progress = Math.round(((questionIndex + 1) / who5Questions.length) * 100);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (questionIndex < who5Questions.length - 1) {
        setQuestionIndex(questionIndex + 1);
      } else {
        setShowSummary(true);
        track('who5_completed', {
          score: calculateWHO5Score(newAnswers),
          severity: calculateWHO5Severity(calculateWHO5Score(newAnswers)),
        });
      }
    }, 300);
  };

  const goPrevious = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const resetFlow = () => {
    setAnswers([]);
    setQuestionIndex(0);
    setShowSummary(false);
  };

  // Calculate results
  const { score, severity, recommendations } = useMemo(() => {
    if (answers.length !== 5) {
      return {
        score: 0,
        severity: 'MODERATE' as WHO5Severity,
        recommendations: getWHO5Recommendations('MODERATE'),
      };
    }

    const who5Score = calculateWHO5Score(answers);
    const who5Severity = calculateWHO5Severity(who5Score);
    const who5Recommendations = getWHO5Recommendations(who5Severity);

    return {
      score: who5Score,
      severity: who5Severity,
      recommendations: who5Recommendations,
    };
  }, [answers]);

  // Summary view
  if (showSummary) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-950 via-neutral-900 to-primary-950 py-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl" />
          <div className="absolute -bottom-32 right-4 h-80 w-80 rounded-full bg-primary-1000/25 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl space-y-6 px-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="ghost"
              onClick={resetFlow}
              className="inline-flex items-center justify-center gap-2 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Test wiederholen</span>
            </Button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
              Zurück zur Startseite
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur sm:p-8">
            <header className="mb-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  WHO-5 Ergebnis
                </div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Dein Wohlbefindens-Score
                </h2>
              </div>
            </header>

            {/* Score Visualization */}
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="mb-4">
                <div className="text-6xl font-bold text-white">{score}</div>
                <div className="mt-2 text-sm text-white/70">von 100 Punkten</div>
              </div>
              <div className="mx-auto mt-4 h-3 w-full max-w-md overflow-hidden rounded-full bg-white/20">
                <motion.div
                  className={`h-full rounded-full ${
                    severity === 'GOOD'
                      ? 'bg-green-400'
                      : severity === 'MODERATE'
                        ? 'bg-yellow-400'
                        : severity === 'POOR'
                          ? 'bg-orange-400'
                          : 'bg-red-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>

            {/* Hinweis auf Schnelltest */}
            <div className="mb-6 rounded-2xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-500/15 to-orange-500/15 p-5 shadow-lg sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/25 ring-2 ring-amber-400/30">
                  <Info className="h-6 w-6 text-amber-200" />
                </div>
                <h4 className="text-lg font-bold text-white sm:text-xl">
                  Schnelltest zur ersten Orientierung
                </h4>
                <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">
                  Der WHO-5 ist ein kurzer Screening-Test zur ersten Einschätzung deines allgemeinen
                  Wohlbefindens. Für eine{' '}
                  <strong>detaillierte Analyse deiner psychischen Gesundheit</strong>, insbesondere
                  zu Depressionen und Angststörungen, empfehlen wir die vollständige
                  Ersteinschätzung mit PHQ-9 und GAD-7.
                </p>
                <Button
                  asChild
                  size="default"
                  className="mt-4 bg-amber-500 px-6 font-semibold text-white hover:bg-amber-600"
                >
                  <Link href="/triage">Vollständige Ersteinschätzung durchführen</Link>
                </Button>
              </div>
            </div>

            {/* Severity Info */}
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold text-white">{who5SeverityLabels[severity]}</h3>
              <p className="mt-2 text-sm text-white/70">{who5SeverityDescriptions[severity]}</p>
            </div>

            {/* Recommendations */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-start gap-3">
                {recommendations.shouldSeekHelp ? (
                  <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-amber-400" />
                ) : (
                  <Info className="mt-1 h-6 w-6 flex-shrink-0 text-primary-400" />
                )}
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white">Empfohlene nächste Schritte</h4>
                  <p className="mt-2 text-sm text-white/70">{recommendations.message}</p>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    {recommendations.shouldDoFullScreening && (
                      <Button
                        asChild
                        size="lg"
                        className="w-full bg-primary-900 text-white hover:bg-primary-800 sm:w-auto"
                      >
                        <Link href="/triage">Vollständige Ersteinschätzung</Link>
                      </Button>
                    )}
                    {recommendations.shouldSeekHelp && (
                      <Button
                        asChild
                        size="lg"
                        className="w-full bg-primary-900 text-white hover:bg-primary-800 sm:w-auto"
                      >
                        <Link href="/therapists">Therapeut:innen finden</Link>
                      </Button>
                    )}
                    {!recommendations.shouldSeekHelp && !recommendations.shouldDoFullScreening && (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-white/40 text-white hover:bg-white/10 sm:w-auto"
                      >
                        <Link href="/courses">Selbsthilfe-Programme ansehen</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Scientific Info */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-white/80 hover:text-white">
                  <span>Über den WHO-5 Fragebogen</span>
                  <Info className="h-4 w-4 transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-4 space-y-3 text-xs text-white/70">
                  <p>{who5ScientificInfo.description}</p>
                  <div>
                    <strong className="text-white/90">Vorteile:</strong>
                    <ul className="mt-1 list-inside list-disc space-y-1">
                      {who5ScientificInfo.advantages.map((adv, idx) => (
                        <li key={idx}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong className="text-white/90">Einschränkungen:</strong>
                    <ul className="mt-1 list-inside list-disc space-y-1">
                      {who5ScientificInfo.limitations.map((lim, idx) => (
                        <li key={idx}>{lim}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-[10px] italic">
                    {who5ScientificInfo.citation} | Sensitivität:{' '}
                    {(who5ScientificInfo.validation.sensitivity * 100).toFixed(0)}%, Spezifität:{' '}
                    {(who5ScientificInfo.validation.specificity * 100).toFixed(0)}%
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Question flow
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-950 via-neutral-900 to-primary-950 py-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -bottom-32 right-4 h-80 w-80 rounded-full bg-primary-1000/25 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
            Zurück zur Startseite
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur sm:p-8">
          {/* Header */}
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">WHO-5 Wohlbefindens-Check</h1>
            <p className="mt-2 text-sm text-white/70 sm:text-base">
              5 kurze Fragen zu deinem Wohlbefinden in den letzten zwei Wochen
            </p>
          </header>

          {/* Progress */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-xs text-white/70 sm:text-sm">
              <span className="font-medium text-white">
                Frage {questionIndex + 1} von {who5Questions.length}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
              <motion.div
                className="h-full rounded-full bg-primary-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={questionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white sm:text-xl">
                      In den letzten zwei Wochen...
                    </h3>
                    <p className="mt-2 text-base font-medium text-white sm:text-lg">
                      {currentQuestion.text}
                    </p>
                  </div>
                  {currentQuestion && (
                    <QuestionTooltip
                      helpText={currentQuestion.helpText}
                      scientificContext={currentQuestion.scientificContext}
                    />
                  )}
                </div>
              </div>

              {/* Answer Options */}
              <div className="space-y-2 sm:space-y-3">
                {who5ResponseOptions.map((option) => {
                  const isSelected = answers[questionIndex] === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleAnswer(option.value)}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl border p-3 transition sm:gap-3 sm:p-4 ${
                        isSelected
                          ? 'border-primary-400/60 bg-primary-400/20 shadow-lg shadow-primary-500/20'
                          : 'border-white/20 bg-white/5 hover:-translate-y-0.5 hover:border-primary-400/40 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-left">
                        <p
                          className={`text-sm font-semibold sm:text-base ${isSelected ? 'text-white' : 'text-white/85'}`}
                        >
                          {option.label}
                        </p>
                        <p className="text-xs text-white/70 sm:text-sm">{option.description}</p>
                      </div>
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-sm font-semibold sm:h-10 sm:w-10 ${
                          isSelected
                            ? 'border-primary-700 bg-primary-700 text-white'
                            : 'border-white/30 bg-white/10 text-white'
                        }`}
                      >
                        {option.value}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={goPrevious}
                  disabled={questionIndex === 0}
                  className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/15 disabled:opacity-50 sm:px-6"
                >
                  <ArrowLeft className="mr-2 inline h-4 w-4" />
                  Zurück
                </button>
                <span className="text-xs text-white/70 sm:text-sm">
                  Wähle eine Antwort um fortzufahren
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
