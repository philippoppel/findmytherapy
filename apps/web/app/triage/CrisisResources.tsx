'use client'

import { useState } from 'react'
import { AlertTriangle, Phone, Heart, Wind, Info, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { Button } from '@mental-health/ui'

type CrisisResourcesProps = {
  showCareTeamContact?: boolean
  className?: string
}

const emergencyContacts = [
  {
    name: 'Telefonseelsorge',
    number: '142',
    description: 'Kostenlos, anonym, rund um die Uhr',
    available: '24/7',
    type: 'crisis' as const,
  },
  {
    name: 'Kriseninterventionszentrum Wien',
    number: '01 406 95 95',
    description: 'Professionelle Krisenintervention',
    available: 'Mo-Fr 10-17 Uhr',
    website: 'https://www.kriseninterventionszentrum.at',
    type: 'crisis' as const,
  },
  {
    name: 'Psychiatrische Soforthilfe (Wien)',
    number: '01 313 30',
    description: 'Psychiatrischer Notdienst',
    available: '24/7',
    type: 'emergency' as const,
  },
  {
    name: 'Rat auf Draht (Jugendliche)',
    number: '147',
    description: 'Für Kinder und Jugendliche bis 18 Jahre',
    available: '24/7',
    website: 'https://www.rataufdraht.at',
    type: 'youth' as const,
  },
  {
    name: 'Österreichische Gesellschaft für Suizidprävention',
    number: '',
    description: 'Informationen und Hilfsangebote',
    available: 'Online',
    website: 'https://www.suizidpraevention-austria.at',
    type: 'info' as const,
  },
]

const immediateExercises = [
  {
    title: '5-4-3-2-1 Grounding',
    icon: Wind,
    description: 'Erdungstechnik bei akuter Panik oder Überwältigung',
    steps: [
      'Benenne 5 Dinge, die du sehen kannst',
      'Benenne 4 Dinge, die du berühren kannst',
      'Benenne 3 Dinge, die du hören kannst',
      'Benenne 2 Dinge, die du riechen kannst',
      'Benenne 1 Sache, die du schmecken kannst',
    ],
  },
  {
    title: '4-7-8 Atemtechnik',
    icon: Heart,
    description: 'Beruhigende Atmung bei Anspannung und Angst',
    steps: [
      'Atme 4 Sekunden durch die Nase ein',
      'Halte den Atem 7 Sekunden an',
      'Atme 8 Sekunden durch den Mund aus',
      'Wiederhole 4-5 Zyklen',
    ],
  },
]

export function CrisisResources({ showCareTeamContact = true, className = '' }: CrisisResourcesProps) {
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null)

  return (
    <div className={`rounded-3xl border-2 border-red-300 bg-red-50 p-6 shadow-lg ${className}`}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white">
          <AlertTriangle className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <h3 className="text-xl font-bold text-red-900">Sofortige Unterstützung verfügbar</h3>
          <p className="text-sm text-red-800">Du musst das nicht alleine durchstehen</p>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="mb-6 rounded-xl bg-red-100 p-4">
        <p className="text-sm font-semibold text-red-900">
          Wenn du in akuter Gefahr bist oder an Selbstverletzung denkst, rufe bitte sofort den Notruf (144) oder die
          Telefonseelsorge (142).
        </p>
      </div>

      {/* Care Team Contact */}
      {showCareTeamContact && (
        <div className="mb-6 rounded-xl border-2 border-primary/30 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Phone className="h-5 w-5" aria-hidden />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-default">FindMyTherapy Care-Team</h4>
              <p className="mt-1 text-sm text-muted">
                Wir werden uns innerhalb von 24 Stunden bei dir melden, um die nächsten Schritte zu besprechen.
              </p>
              <Button asChild className="mt-3 w-full" size="sm">
                <a href="/contact">Rückruf anfordern</a>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      <div className="mb-6">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-900">
          Notfallnummern in Österreich
        </h4>
        <div className="space-y-2">
          {emergencyContacts.map((contact) => (
            <div key={contact.name} className="rounded-xl border border-red-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h5 className="font-semibold text-default">{contact.name}</h5>
                  <p className="mt-0.5 text-xs text-muted">{contact.description}</p>
                  <p className="mt-1 text-xs text-muted">Verfügbar: {contact.available}</p>
                </div>
                <div className="text-right">
                  {contact.number && (
                    <a
                      href={`tel:${contact.number.replace(/\s/g, '')}`}
                      className="inline-flex items-center gap-1 rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:bg-red-600"
                    >
                      <Phone className="h-4 w-4" aria-hidden />
                      {contact.number}
                    </a>
                  )}
                  {contact.website && (
                    <a
                      href={contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      Website
                      <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Immediate Exercises */}
      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-900">Sofort-Übungen</h4>
        <div className="space-y-2">
          {immediateExercises.map((exercise, index) => (
            <div key={exercise.title} className="rounded-xl border border-red-200 bg-white p-4">
              <button
                type="button"
                onClick={() => setExpandedExercise(expandedExercise === index ? null : index)}
                className="flex w-full items-start justify-between gap-3 text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <exercise.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <h5 className="font-semibold text-default">{exercise.title}</h5>
                    <p className="mt-0.5 text-sm text-muted">{exercise.description}</p>
                  </div>
                </div>
                {expandedExercise === index ? (
                  <ChevronUp className="h-5 w-5 flex-none text-muted" aria-hidden />
                ) : (
                  <ChevronDown className="h-5 w-5 flex-none text-muted" aria-hidden />
                )}
              </button>
              {expandedExercise === index && (
                <div className="mt-3 rounded-lg bg-surface-1 p-3">
                  <ol className="space-y-2 text-sm text-default">
                    {exercise.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-2">
                        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {stepIndex + 1}
                        </span>
                        <span className="mt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 flex items-start gap-2 rounded-lg bg-red-100 p-3">
        <Info className="h-4 w-4 flex-none text-red-800" aria-hidden />
        <p className="text-xs text-red-800">
          Diese Ressourcen ersetzen keine professionelle Behandlung. Bei akuten Notfällen kontaktiere bitte sofort
          den Notruf 144.
        </p>
      </div>
    </div>
  )
}
