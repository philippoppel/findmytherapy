'use client'

import { motion } from 'framer-motion'

type AmpelColor = 'green' | 'yellow' | 'red'

type AmpelVisualizationProps = {
  color: AmpelColor
  phq9Score: number
  gad7Score: number
  phq9Severity: string
  gad7Severity: string
  className?: string
}

const ampelConfig: Record<AmpelColor, {
  label: string
  description: string
  bgColor: string
  borderColor: string
  lightColor: string
  textColor: string
}> = {
  green: {
    label: 'Grün – Geringe Belastung',
    description: 'Minimale bis leichte Symptome. Präventive Maßnahmen und Selbsthilfe-Programme werden empfohlen.',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    lightColor: 'bg-emerald-500',
    textColor: 'text-emerald-900',
  },
  yellow: {
    label: 'Gelb – Mittlere Belastung',
    description: 'Mittelschwere Symptome mit spürbarer Beeinträchtigung. Professionelle Unterstützung wird empfohlen.',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    lightColor: 'bg-amber-500',
    textColor: 'text-amber-900',
  },
  red: {
    label: 'Rot – Hohe Belastung',
    description: 'Schwere Symptome mit erheblicher Beeinträchtigung. Dringende professionelle Hilfe erforderlich.',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    lightColor: 'bg-red-500',
    textColor: 'text-red-900',
  },
}

export function AmpelVisualization({
  color,
  phq9Score,
  gad7Score,
  phq9Severity,
  gad7Severity,
  className = '',
}: AmpelVisualizationProps) {
  const config = ampelConfig[color]

  return (
    <div className={`${className}`}>
      <div className={`rounded-3xl border-2 ${config.borderColor} ${config.bgColor} p-8`}>
        {/* Ampel Grafik */}
        <div className="mx-auto mb-6 flex w-fit flex-col gap-3">
          <div className="rounded-2xl border-4 border-gray-800 bg-gray-900 p-4 shadow-xl">
            {/* Rot */}
            <motion.div
              className={`mb-3 h-16 w-16 rounded-full border-2 border-gray-700 ${
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
              className={`mb-3 h-16 w-16 rounded-full border-2 border-gray-700 ${
                color === 'yellow' ? 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)]' : 'bg-gray-800'
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
              className={`h-16 w-16 rounded-full border-2 border-gray-700 ${
                color === 'green' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]' : 'bg-gray-800'
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
          <h3 className={`text-2xl font-bold ${config.textColor}`}>{config.label}</h3>
          <p className={`mt-2 text-sm ${config.textColor} opacity-90`}>{config.description}</p>
        </div>

        {/* Scores */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-divider bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">PHQ-9 (Depression)</p>
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
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">GAD-7 (Angst)</p>
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
      </div>
    </div>
  )
}
