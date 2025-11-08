'use client'

import { ArrowRight, Check, Clock, Shield, Award, TrendingUp, Gift, Heart, Lock, FileCheck } from 'lucide-react'
import Link from 'next/link'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'

const triageHighlights = [
  {
    icon: TrendingUp,
    title: 'Klares Ampel-Ergebnis',
    description: 'Grün, Gelb oder Rot – du siehst sofort, wie es um deine mentale Gesundheit steht und welche Schritte sinnvoll sind.',
  },
  {
    icon: Award,
    title: 'Wissenschaftlich fundiert',
    description: 'Basierend auf international anerkannten Screening-Tools (PHQ-9 & GAD-7), die auch Therapeut:innen verwenden.',
  },
  {
    icon: Lock,
    title: 'Deine Daten, deine Kontrolle',
    description: 'Vollständig anonym nutzbar. Optional kannst du deine Ergebnisse speichern und mit Therapeut:innen teilen – DSGVO-konform verschlüsselt.',
  },
]

const quickFeatures = [
  { icon: Clock, label: 'Unter 5 Minuten', description: 'Super schnell & einfach' },
  { icon: Check, label: 'Sofort-Ergebnis', description: 'Direkt nach Abschluss' },
  { icon: Gift, label: '100% kostenlos', description: 'Keine versteckten Kosten' },
  { icon: Shield, label: '100% anonym', description: 'Keine Anmeldung nötig' },
]

export function AssessmentSection() {
  return (
    <section id="assessment" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-teal-50/30 via-cyan-50/20 to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-gradient-to-r from-teal-100 to-cyan-100 px-4 py-2 text-sm font-bold uppercase tracking-wider text-teal-900 shadow-sm">
            <Gift className="h-4 w-4" aria-hidden />
            100% Kostenlos
          </div>
          <h2 className="mt-6 text-balance text-4xl font-bold tracking-tight text-default sm:text-5xl lg:text-6xl">
            In weniger als 5 Minuten zu Klarheit
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted sm:text-xl">
            Erhalte sofort dein persönliches Ampel-Ergebnis – wissenschaftlich fundiert, kostenlos und ohne Anmeldung.
          </p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,450px)] lg:gap-12">
          <Reveal className="space-y-6">
            <div className="rounded-3xl border border-divider bg-white p-6 shadow-lg sm:p-8">
              <h3 className="mb-6 text-xl font-semibold text-default sm:text-2xl">
                So einfach geht's
              </h3>
              <p className="mb-6 text-pretty text-base leading-relaxed text-muted">
                Klick auf "Starten", beantworte ein paar einfache Fragen und erhalte sofort dein Ampel-Ergebnis mit konkreten Empfehlungen. Dauert weniger als 5 Minuten – wissenschaftlich fundiert und vollständig anonym.
              </p>
              <ul className="space-y-4">
                {triageHighlights.map((item) => (
                  <li key={item.title} className="flex items-start gap-4 rounded-2xl border border-divider bg-gradient-to-br from-teal-50/50 to-cyan-50/30 p-4 shadow-sm transition hover:shadow-md sm:p-5">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 text-white shadow-md">
                      <item.icon className="h-6 w-6" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-default">{item.title}</p>
                      <p className="mt-1 text-pretty text-sm leading-relaxed text-muted">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal variant="scale" className="lg:sticky lg:top-24">
            <div className="rounded-3xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-50 p-8 shadow-2xl shadow-teal-900/10">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                    <Heart className="h-3.5 w-3.5" aria-hidden />
                    Jetzt starten
                  </div>
                  <h3 className="text-3xl font-bold text-default">
                    Starte jetzt – dauert weniger als 5 Minuten
                  </h3>
                  <p className="text-base text-muted">
                    Kostenlos, anonym und sofort verfügbar. Keine Anmeldung erforderlich.
                  </p>
                </div>

                <div className="space-y-3">
                  {quickFeatures.map((feature) => (
                    <div key={feature.label} className="flex items-center gap-3 rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 shadow-sm">
                        <feature.icon className="h-5 w-5 text-teal-700" aria-hidden />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-default">{feature.label}</p>
                        <p className="text-xs text-muted">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/triage"
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-teal-900/30 transition-all hover:-translate-y-1 hover:from-teal-500 hover:to-cyan-500 hover:shadow-2xl hover:shadow-teal-900/40"
                >
                  Ersteinschätzung starten
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>

                <div className="rounded-xl bg-teal-100/50 p-3 text-center">
                  <p className="text-xs font-semibold text-teal-900">
                    <Shield className="mb-0.5 inline h-3.5 w-3.5" aria-hidden /> Keine Anmeldung erforderlich • Vollständig anonym
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
