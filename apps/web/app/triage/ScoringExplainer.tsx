'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, Info } from 'lucide-react'
import { phq9Thresholds, gad7Thresholds, scientificSources } from '../../lib/triage/scientific-benchmarks'

type ScoringExplainerProps = {
  className?: string
}

export function ScoringExplainer({ className = '' }: ScoringExplainerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`rounded-2xl border border-divider bg-white/90 ${className}`}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between gap-3 p-5 text-left transition hover:bg-surface-1/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Info className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <h4 className="font-semibold text-default">Wie wird die Ampel berechnet?</h4>
            <p className="text-xs text-muted">Wissenschaftliche Grundlagen der Einschätzung</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 flex-none text-muted" aria-hidden />
        ) : (
          <ChevronDown className="h-5 w-5 flex-none text-muted" aria-hidden />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-6 border-t border-divider p-5">
          {/* PHQ-9 Schwellenwerte */}
          <div>
            <h5 className="text-sm font-semibold text-default">PHQ-9 (Patient Health Questionnaire)</h5>
            <p className="mt-1 text-xs text-muted">
              Der PHQ-9 besteht aus 9 Fragen, die jeweils mit 0-3 Punkten bewertet werden. Die Gesamtpunktzahl liegt zwischen 0-27.
            </p>
            <div className="mt-3 space-y-2">
              {Object.values(phq9Thresholds).map((threshold) => (
                <div key={threshold.label} className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full bg-${threshold.color}-500 flex-none`}
                    aria-hidden
                  />
                  <div className="flex-1 text-xs">
                    <span className="font-medium text-default">{threshold.label}:</span>{' '}
                    <span className="text-muted">{threshold.min}-{threshold.max} Punkte</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GAD-7 Schwellenwerte */}
          <div>
            <h5 className="text-sm font-semibold text-default">GAD-7 (Generalized Anxiety Disorder)</h5>
            <p className="mt-1 text-xs text-muted">
              Der GAD-7 besteht aus 7 Fragen, die jeweils mit 0-3 Punkten bewertet werden. Die Gesamtpunktzahl liegt zwischen 0-21.
            </p>
            <div className="mt-3 space-y-2">
              {Object.values(gad7Thresholds).map((threshold) => (
                <div key={threshold.label} className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full bg-${threshold.color}-500 flex-none`}
                    aria-hidden
                  />
                  <div className="flex-1 text-xs">
                    <span className="font-medium text-default">{threshold.label}:</span>{' '}
                    <span className="text-muted">{threshold.min}-{threshold.max} Punkte</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ampel-Logik */}
          <div className="rounded-xl border border-divider bg-surface-1/90 p-4">
            <h5 className="text-sm font-semibold text-default">Wie wird die Ampelfarbe bestimmt?</h5>
            <ul className="mt-2 space-y-2 text-xs text-muted">
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-2 w-2 flex-none rounded-full bg-red-500" aria-hidden />
                <span>
                  <strong className="text-red-900">Rot (Hohe Belastung):</strong> Schwere Symptome auf PHQ-9 oder GAD-7, oder mittelschwer bis schwere Depression (PHQ-9 ≥15)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-2 w-2 flex-none rounded-full bg-amber-500" aria-hidden />
                <span>
                  <strong className="text-amber-900">Gelb (Mittlere Belastung):</strong> Mittelschwere Symptome auf PHQ-9 oder GAD-7, oder leichte Symptome auf beiden Skalen
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-2 w-2 flex-none rounded-full bg-emerald-500" aria-hidden />
                <span>
                  <strong className="text-emerald-900">Grün (Geringe Belastung):</strong> Minimale Symptome auf beiden Skalen
                </span>
              </li>
            </ul>
          </div>

          {/* Wissenschaftliche Quellen */}
          <div>
            <h5 className="text-sm font-semibold text-default">Wissenschaftliche Quellen</h5>
            <div className="mt-3 space-y-2">
              {scientificSources.slice(0, 2).map((source) => (
                <div key={source.name} className="text-xs">
                  <p className="font-medium text-default">{source.name}</p>
                  <p className="mt-0.5 text-muted">{source.citation}</p>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Zur Studie
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
            <p className="text-xs text-blue-900">
              <strong>Hinweis:</strong> Diese Fragebögen sind validierte Screening-Instrumente und dienen der Ersteinschätzung. Sie ersetzen keine klinische Diagnose durch qualifizierte Fachpersonen.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
