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
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <Info className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <h4 className="font-semibold text-default">Wissenschaftliche Grundlagen</h4>
            <p className="text-xs text-muted">Wie Ihre Einschätzung erstellt wird</p>
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
          {/* Einleitung */}
          <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-4">
            <p className="text-sm text-default leading-relaxed">
              Ihre Einschätzung basiert auf zwei international anerkannten, wissenschaftlich validierten Screening-Instrumenten:
              dem <strong>PHQ-9</strong> (Depression) und dem <strong>GAD-7</strong> (Angststörungen). Diese werden weltweit
              in der klinischen Praxis und Forschung eingesetzt.
            </p>
          </div>

          {/* PHQ-9 Schwellenwerte */}
          <div>
            <h5 className="text-sm font-semibold text-default">Depressions-Screening (PHQ-9)</h5>
            <p className="mt-1 text-xs text-muted">
              9 Fragen, jeweils bewertet mit 0-3 Punkten (Gesamtskala: 0-27 Punkte)
            </p>
            <div className="mt-3 space-y-2">
              {Object.values(phq9Thresholds).map((threshold) => (
                <div key={threshold.label} className="flex items-start gap-3">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-400 flex-none" aria-hidden />
                  <div className="flex-1 text-xs">
                    <span className="font-medium text-default">{threshold.label}</span>{' '}
                    <span className="text-muted">({threshold.min}-{threshold.max} Punkte)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GAD-7 Schwellenwerte */}
          <div>
            <h5 className="text-sm font-semibold text-default">Angst-Screening (GAD-7)</h5>
            <p className="mt-1 text-xs text-muted">
              7 Fragen, jeweils bewertet mit 0-3 Punkten (Gesamtskala: 0-21 Punkte)
            </p>
            <div className="mt-3 space-y-2">
              {Object.values(gad7Thresholds).map((threshold) => (
                <div key={threshold.label} className="flex items-start gap-3">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-400 flex-none" aria-hidden />
                  <div className="flex-1 text-xs">
                    <span className="font-medium text-default">{threshold.label}</span>{' '}
                    <span className="text-muted">({threshold.min}-{threshold.max} Punkte)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ampel-Logik */}
          <div className="rounded-xl border border-divider bg-surface-1/90 p-4">
            <h5 className="text-sm font-semibold text-default">Gesamteinschätzung</h5>
            <p className="mt-1 mb-3 text-xs text-muted">
              Die Ampelfarbe ergibt sich aus der Kombination beider Screening-Ergebnisse
            </p>
            <ul className="space-y-3 text-xs text-muted">
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-2 w-2 flex-none rounded-full bg-emerald-500" aria-hidden />
                <span>
                  <strong className="text-emerald-900">Grün – Geringe Belastung:</strong> Die Ergebnisse zeigen minimale Symptome in beiden Bereichen. Präventive Maßnahmen und Selbstfürsorge sind empfehlenswert.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-2 w-2 flex-none rounded-full bg-amber-500" aria-hidden />
                <span>
                  <strong className="text-amber-900">Gelb – Mittlere Belastung:</strong> Es liegen mittelschwere Symptome vor, die den Alltag beeinträchtigen können. Professionelle Unterstützung wird empfohlen.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-0.5 h-2 w-2 flex-none rounded-full bg-red-500" aria-hidden />
                <span>
                  <strong className="text-red-900">Rot – Hohe Belastung:</strong> Die Ergebnisse deuten auf schwere Symptome hin, die eine zeitnahe professionelle Behandlung erfordern.
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
          <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
            <h5 className="text-sm font-semibold text-primary-900 mb-2">Wichtiger Hinweis</h5>
            <p className="text-xs text-primary-900 leading-relaxed">
              Die Fragebögen PHQ-9 und GAD-7 sind international anerkannte, wissenschaftlich validierte Screening-Instrumente
              zur Ersteinschätzung psychischer Belastung. Sie dienen als Orientierungshilfe und ersetzen keine professionelle
              Diagnose. Für eine umfassende Beurteilung und Behandlungsempfehlung ist eine persönliche Einschätzung durch
              qualifizierte Fachpersonen erforderlich.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
