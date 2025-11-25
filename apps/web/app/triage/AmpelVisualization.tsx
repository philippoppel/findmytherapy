'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { ScoringExplainer } from './ScoringExplainer';
import { populationBenchmarks, findClosestBenchmark } from '../../lib/triage/scientific-benchmarks';

type AmpelColor = 'green' | 'yellow' | 'red';

type AmpelVisualizationProps = {
  color: AmpelColor;
  phq9Score: number;
  gad7Score: number;
  phq9Severity: string;
  gad7Severity: string;
  className?: string;
};

const ampelConfig: Record<
  AmpelColor,
  {
    label: string;
    description: string;
    bgColor: string;
    borderColor: string;
    lightColor: string;
    textColor: string;
  }
> = {
  green: {
    label: 'Grün – Geringe Belastung',
    description:
      'Minimale bis leichte Symptome. Präventive Maßnahmen und Selbsthilfe-Programme werden empfohlen.',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    lightColor: 'bg-emerald-500',
    textColor: 'text-emerald-900',
  },
  yellow: {
    label: 'Gelb – Mittlere Belastung',
    description:
      'Mittelschwere Symptome mit spürbarer Beeinträchtigung. Professionelle Unterstützung wird empfohlen.',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    lightColor: 'bg-amber-500',
    textColor: 'text-amber-900',
  },
  red: {
    label: 'Rot – Hohe Belastung',
    description:
      'Schwere Symptome mit erheblicher Beeinträchtigung. Dringende professionelle Hilfe erforderlich.',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    lightColor: 'bg-red-500',
    textColor: 'text-red-900',
  },
};

const ampelDetailsContent: Record<
  AmpelColor,
  {
    meaning: string;
    nextSteps: string[];
    resources: string[];
  }
> = {
  green: {
    meaning:
      'Deine Einschätzung zeigt minimale bis keine Symptome. Das ist ein gutes Zeichen für dein aktuelles Wohlbefinden.',
    nextSteps: [
      'Präventive Maßnahmen: Achte weiterhin auf dein Wohlbefinden',
      'Selbstfürsorge: Integriere regelmäßige Entspannung in deinen Alltag',
      'Weiterbildung: Nutze Psychoedukation zur Stärkung deiner Resilienz',
    ],
    resources: [
      'Selbsthilfe-Kurse zur Stressbewältigung',
      'Achtsamkeits- und Entspannungsübungen',
      'Informationsressourcen zu mentaler Gesundheit',
    ],
  },
  yellow: {
    meaning:
      'Deine Einschätzung zeigt mittelschwere Symptome, die im Alltag spürbar sind. Professionelle Unterstützung kann hilfreich sein.',
    nextSteps: [
      'Therapeutische Unterstützung: Erwäge eine professionelle Beratung oder Psychotherapie',
      'Strukturierte Programme: Nutze angeleitete Selbsthilfe-Programme',
      'Regelmäßige Selbstbeobachtung: Führe ein Stimmungstagebuch',
    ],
    resources: [
      'Vermittlung zu qualifizierten Therapeut:innen',
      'Strukturierte Online-Kurse mit therapeutischer Begleitung',
      'Check-ins mit unserem Care-Team',
    ],
  },
  red: {
    meaning:
      'Deine Einschätzung zeigt schwere Symptome mit erheblicher Beeinträchtigung. Dringende professionelle Hilfe ist erforderlich.',
    nextSteps: [
      'SOFORT: Kontaktiere professionelle Hilfe bei akuter Gefahr (Notruf 144, Telefonseelsorge 142)',
      'Therapeutische Behandlung: Vereinbare zeitnah einen Termin bei Therapeut:in oder Psychiater:in',
      'Unterstützungsnetzwerk: Informiere vertraute Personen über deine Situation',
      'Medizinische Abklärung: Erwäge eine psychiatrische Untersuchung',
    ],
    resources: [
      'Kriseninterventionsdienste (24/7 verfügbar)',
      'Sofortvermittlung zu Therapeut:innen',
      'Psychiatrische Notfallambulanzen',
      'Unser Care-Team für sofortige Unterstützung',
    ],
  },
};

export function AmpelVisualization({
  color,
  phq9Score,
  gad7Score,
  phq9Severity,
  gad7Severity,
  className = '',
}: AmpelVisualizationProps) {
  const config = ampelConfig[color];
  const populationAvg = populationBenchmarks[0];
  const closestBenchmark = findClosestBenchmark(phq9Score, gad7Score);
  const [showDetails, setShowDetails] = useState(false);
  const details = ampelDetailsContent[color];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className={`rounded-3xl border-2 ${config.borderColor} ${config.bgColor} p-4 sm:p-8`}>
        {/* Ampel Grafik */}
        <div className="mx-auto mb-6 flex w-fit flex-col gap-3">
          <div className="rounded-2xl border-4 border-gray-800 bg-gray-900 p-3 shadow-xl sm:p-4">
            {/* Rot */}
            <motion.div
              className={`mb-3 h-12 w-12 rounded-full border-2 border-gray-700 sm:h-16 sm:w-16 ${
                color === 'red' ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]' : 'bg-gray-800'
              }`}
              initial={{ scale: 0.9 }}
              animate={{
                scale: color === 'red' ? [1, 1.05, 1] : 1,
                opacity: color === 'red' ? 1 : 0.3,
              }}
              transition={{
                duration: 1.5,
                repeat: color === 'red' ? Infinity : 0,
                ease: 'easeInOut',
              }}
              aria-label="Rote Ampel"
            />
            {/* Gelb */}
            <motion.div
              className={`mb-3 h-12 w-12 rounded-full border-2 border-gray-700 sm:h-16 sm:w-16 ${
                color === 'yellow'
                  ? 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)]'
                  : 'bg-gray-800'
              }`}
              initial={{ scale: 0.9 }}
              animate={{
                scale: color === 'yellow' ? [1, 1.05, 1] : 1,
                opacity: color === 'yellow' ? 1 : 0.3,
              }}
              transition={{
                duration: 1.5,
                repeat: color === 'yellow' ? Infinity : 0,
                ease: 'easeInOut',
              }}
              aria-label="Gelbe Ampel"
            />
            {/* Grün */}
            <motion.div
              className={`h-12 w-12 rounded-full border-2 border-gray-700 sm:h-16 sm:w-16 ${
                color === 'green'
                  ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]'
                  : 'bg-gray-800'
              }`}
              initial={{ scale: 0.9 }}
              animate={{
                scale: color === 'green' ? [1, 1.05, 1] : 1,
                opacity: color === 'green' ? 1 : 0.3,
              }}
              transition={{
                duration: 1.5,
                repeat: color === 'green' ? Infinity : 0,
                ease: 'easeInOut',
              }}
              aria-label="Grüne Ampel"
            />
          </div>
        </div>

        {/* Status Label */}
        <div className="mb-4 text-center">
          <h3 className={`text-xl font-bold sm:text-2xl ${config.textColor}`}>{config.label}</h3>
          <p className={`mt-2 text-xs sm:text-sm ${config.textColor} opacity-90`}>
            {config.description}
          </p>
        </div>

        {/* Interaktive Details - Ausklappbar */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className={`mx-auto flex items-center gap-2 rounded-full border-2 ${config.borderColor} bg-white px-4 py-2 text-sm font-semibold ${config.textColor} transition hover:opacity-90`}
          >
            <Lightbulb className="h-4 w-4" aria-hidden />
            {showDetails ? 'Details ausblenden' : 'Was bedeutet das für mich?'}
            {showDetails ? (
              <ChevronUp className="h-4 w-4" aria-hidden />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden />
            )}
          </button>

          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 rounded-xl border border-divider bg-white/90 p-5"
            >
              {/* Bedeutung */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-default">
                  Was bedeutet diese Einschätzung?
                </h4>
                <p className="mt-2 text-xs text-muted">{details.meaning}</p>
              </div>

              {/* Nächste Schritte */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-default">Empfohlene nächste Schritte</h4>
                <ul className="mt-2 space-y-2">
                  {details.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-muted">
                      <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verfügbare Ressourcen */}
              <div>
                <h4 className="text-sm font-semibold text-default">Verfügbare Unterstützung</h4>
                <ul className="mt-2 space-y-1">
                  {details.resources.map((resource, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-muted">
                      <span className="text-primary">•</span>
                      <span>{resource}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>

        {/* Scores */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-divider bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              PHQ-9 (Depression)
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-default">{phq9Score}</span>
              <span className="text-sm text-muted">von 27</span>
            </div>
            <p className="mt-1 text-xs capitalize text-muted">{phq9Severity.replace('_', ' ')}</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className={`h-full ${config.lightColor} transition-all duration-700`}
                style={{ width: `${(phq9Score / 27) * 100}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-divider bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              GAD-7 (Angst)
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-default">{gad7Score}</span>
              <span className="text-sm text-muted">von 21</span>
            </div>
            <p className="mt-1 text-xs capitalize text-muted">{gad7Severity.replace('_', ' ')}</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className={`h-full ${config.lightColor} transition-all duration-700`}
                style={{ width: `${(gad7Score / 21) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Vergleich mit wissenschaftlichen Durchschnittswerten */}
        <div className="mt-6 rounded-xl border border-divider bg-white/70 p-4">
          <h4 className="text-sm font-semibold text-default">Vergleich mit Durchschnittswerten</h4>
          <p className="mt-1 text-xs text-muted">
            Deine Werte im Vergleich zur Allgemeinbevölkerung
          </p>

          {/* PHQ-9 Vergleich */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">PHQ-9 Depression</span>
              <span className="font-semibold text-default">{phq9Score} von 27</span>
            </div>
            <div className="mt-2 relative h-6 rounded-full bg-surface-2 overflow-hidden">
              {/* Durchschnitt Marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
                style={{ left: `${(populationAvg.phq9Score / 27) * 100}%` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-gray-600">
                  ⌀ {populationAvg.phq9Score}
                </div>
              </div>
              {/* User Score */}
              <div
                className={`h-full ${config.lightColor} transition-all duration-700`}
                style={{ width: `${(phq9Score / 27) * 100}%` }}
              />
            </div>
          </div>

          {/* GAD-7 Vergleich */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">GAD-7 Angst</span>
              <span className="font-semibold text-default">{gad7Score} von 21</span>
            </div>
            <div className="mt-2 relative h-6 rounded-full bg-surface-2 overflow-hidden">
              {/* Durchschnitt Marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
                style={{ left: `${(populationAvg.gad7Score / 21) * 100}%` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-gray-600">
                  ⌀ {populationAvg.gad7Score}
                </div>
              </div>
              {/* User Score */}
              <div
                className={`h-full ${config.lightColor} transition-all duration-700`}
                style={{ width: `${(gad7Score / 21) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-3 text-[10px] text-muted space-y-1">
            <p>⌀ = Durchschnitt Allgemeinbevölkerung: {populationAvg.description}</p>
            <p>
              Am nächsten liegst du bei: <strong>{closestBenchmark.label}</strong> –{' '}
              {closestBenchmark.description}
            </p>
          </div>
        </div>
      </div>

      {/* Scoring Explainer - Ausklappbar */}
      <ScoringExplainer />
    </div>
  );
}
