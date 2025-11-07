'use client'

import { ArrowRight, Check, Clock, Shield } from 'lucide-react'
import Link from 'next/link'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'

const triageHighlights = [
  {
    title: 'Ampel-Visualisierung',
    description: 'Grün (geringe Belastung): Kurse & Psychoedukation. Gelb (mittlere Belastung): Therapieempfehlung. Rot (hohe Belastung): Prioritäre Soforthilfe mit österreichischen Notfallnummern.',
  },
  {
    title: 'Wissenschaftlich validiert',
    description: 'PHQ-9 (Depression) und GAD-7 (Angst) sind international anerkannte Screening-Tools, ergänzt durch Fragen zu deinen Ressourcen und Präferenzen für personalisierte Empfehlungen.',
  },
  {
    title: 'Verlauf & Privatsphäre',
    description: 'Eingeloggte Nutzer:innen können ihren Fortschritt im Zeitverlauf sehen. Du entscheidest, ob Ergebnisse mit Therapeut:innen geteilt werden – DSGVO-konform verschlüsselt.',
  },
]

const quickFeatures = [
  { icon: Clock, label: 'Nur 5 Minuten', description: '18 validierte Fragen' },
  { icon: Shield, label: '100% anonym', description: 'DSGVO-konform' },
  { icon: Check, label: 'Sofort-Ergebnis', description: 'Mit konkreten Schritten' },
]

export function AssessmentSection() {
  return (
    <section id="assessment" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Kostenlose Ersteinschätzung"
            title="In wenigen Minuten zu deinem Ampel-Ergebnis"
            description="Starte jetzt deine wissenschaftlich fundierte Ersteinschätzung und erhalte sofort Klarheit, welche nächsten Schritte für dich sinnvoll sind."
            align="left"
            className="mb-10"
          />
        </Reveal>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:items-start">
          <Reveal className="space-y-6">
            <p className="text-pretty text-lg leading-relaxed text-muted">
              Beantworte 18 kurze Fragen aus den validierten PHQ-9 und GAD-7 Fragebögen. Du erhältst sofort ein Ampel-Ergebnis mit wissenschaftlich fundierten Empfehlungen. Die Antworten bleiben vertraulich und du entscheidest über die Speicherung.
            </p>
            <ul className="space-y-3 sm:space-y-4">
              {triageHighlights.map((item) => (
                <li key={item.title} className="rounded-2xl border border-divider bg-white px-4 py-3 shadow-sm sm:px-5 sm:py-4">
                  <p className="text-sm font-semibold text-default sm:text-base">{item.title}</p>
                  <p className="mt-1 text-pretty text-sm leading-relaxed text-muted">{item.description}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal variant="scale" className="rounded-3xl border border-divider bg-gradient-to-br from-teal-50 to-cyan-50 p-8 shadow-xl shadow-secondary/15">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-900">
                  Jetzt starten
                </div>
                <h3 className="text-2xl font-semibold text-default">
                  Deine Ersteinschätzung wartet
                </h3>
                <p className="text-sm text-muted">
                  Erhalte in wenigen Minuten dein persönliches Ampel-Ergebnis mit konkreten nächsten Schritten.
                </p>
              </div>

              <div className="space-y-3">
                {quickFeatures.map((feature) => (
                  <div key={feature.label} className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <feature.icon className="h-5 w-5 text-teal-600" aria-hidden />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-default">{feature.label}</p>
                      <p className="text-xs text-muted">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/triage"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:-translate-y-0.5 hover:from-teal-500 hover:to-cyan-500"
              >
                Ersteinschätzung starten
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>

              <p className="text-center text-xs text-muted">
                Keine Anmeldung erforderlich • Vollständig anonym
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
