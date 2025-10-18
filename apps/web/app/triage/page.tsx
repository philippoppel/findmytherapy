import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Brain, CalendarPlus, ClipboardList, Sparkles, Thermometer, Users } from 'lucide-react'
import { TriageFlow } from './TriageFlow'

const triageSteps = [
  {
    title: 'Kurzprofil erstellen',
    description: 'Zwei Minuten für Eckdaten zu deiner Situation, bisherigen Erfahrungen und gewünschten Formaten.',
    detail: 'Wir fragen nur nach den Infos, die für den ersten Abgleich mit passenden Unterstützungsformen nötig sind.',
    icon: Users,
  },
  {
    title: 'Selbsteinschätzung ausfüllen',
    description: 'Evidenzbasierte Screening-Fragen (PHQ-9, GAD-7) liefern sofort Rückmeldung zu Belastungslevel und Prioritäten.',
    detail: 'Die Ergebnisse bleiben vertraulich und werden verschlüsselt gespeichert.',
    icon: ClipboardList,
  },
  {
    title: 'Klarthera Empfohlen',
    description: 'Algorithmus & Expert:innen kombinieren therapeutische Profile, freie Kapazitäten und Kursmodule.',
    detail: 'Du erhältst direkt 3 Vorschläge, die du weiter filtern oder mit unserem Team besprechen kannst.',
    icon: Brain,
  },
  {
    title: 'Nächste Schritte buchen',
    description: 'Termin oder Programm starten, Fragen an das Care-Team schicken oder weitere Optionen vergleichen.',
    detail: 'Alles in deinem Klarthera-Cockpit, inklusive Erinnerungen und Fortschrittsübersicht.',
    icon: CalendarPlus,
  },
]

const sampleQuestions = [
  {
    title: 'Wie oft hast du dich in den letzten zwei Wochen niedergeschlagen oder hoffnungslos gefühlt?',
    type: 'Skala',
    scale: ['Nie', 'An einzelnen Tagen', 'Mehr als die Hälfte der Tage', 'Fast jeden Tag'],
  },
  {
    title: 'Was wünschst du dir von Klarthera?',
    type: 'Mehrfachauswahl',
    options: ['Therapeut:in finden', 'Digitales Programm', 'Kurzfristige Beratung', 'Noch unsicher'],
  },
  {
    title: 'Welche Formate passen gerade zu deinem Alltag?',
    type: 'Mehrfachauswahl',
    options: ['Präsenz', 'Online', 'Hybrid', 'Flexible Zeitslots'],
  },
]

export const metadata: Metadata = {
  title: 'Ersteinschätzung – Klarthera',
  description:
    'Die Klarthera Ersteinschätzung bietet einen klaren Überblick über aktuelle Bedürfnisse und schlägt passende Therapeut:innen sowie Programme vor.',
}

export default function TriagePage() {
  return (
    <div className="bg-surface">
      <section className="relative overflow-hidden bg-white py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-[-5rem] h-80 w-80 rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute bottom-[-8rem] left-[-4rem] h-72 w-72 rounded-full bg-blue-50/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-center">
            <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1 text-sm font-semibold text-primary shadow-sm">
              Ersteinschätzung in 4 Schritten
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-default md:text-5xl">
              Klarthera Ersteinschätzung – dein Weg zur passenden Hilfe
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
              Die Ersteinschätzung kombiniert validierte Screening-Tools mit deinen Präferenzen, damit du sofort spürst, in
              welche Richtung es gehen kann – datenbasiert, verständlich und wertschätzend.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#ablauf"
                className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Ersteinschätzung starten
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Fragen? Unser Care-Team hilft dir.
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="ablauf" className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 space-y-3 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" aria-hidden />
              Ablauf ansehen
            </span>
            <h2 className="text-3xl font-semibold text-default">Beantworte die Fragen und sieh sofort eine Empfehlung</h2>
            <p className="text-base text-muted">
              Diese Simulation zeigt, wie Klarthera Antworten bündelt, das Belastungslevel einschätzt und nächste Schritte vorschlägt. Alle Daten bleiben im Browser – ideal für deine Vorbereitung.
            </p>
          </div>
          <TriageFlow />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-3xl space-y-3">
              <h2 className="text-3xl font-semibold text-default">
                So läuft die Klarthera Ersteinschätzung ab
              </h2>
              <p className="text-base text-muted">
                Die Screens sind so gestaltet, dass du dich sicher fühlst, weißt wo du stehst und sofort Weiteres planen kannst – ohne, dass sensible Informationen verloren gehen.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-divider bg-white/70 px-4 py-2 text-sm text-muted">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Kuratiertes Beispiel. Austausch jederzeit möglich.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {triageSteps.map((step, index) => (
              <article
                key={step.title}
                className="relative flex h-full flex-col rounded-2xl border border-divider bg-white/85 p-6 shadow-sm shadow-primary/5"
              >
                <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20">
                  {index + 1}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <step.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-default">{step.title}</h3>
                    <p className="text-sm text-muted">{step.description}</p>
                  </div>
                </div>
                <p className="mt-4 rounded-xl border border-divider bg-surface-1/90 p-4 text-sm text-muted">
                  {step.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary-50 via-surface-1 to-blue-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-divider bg-white/80 p-8 shadow-md shadow-primary/10 backdrop-blur">
              <h2 className="text-2xl font-semibold text-default">Beispielscreen - Selbsteinschätzung</h2>
              <p className="mt-3 text-base text-muted">
                So könnte eine der Screens innerhalb der Ersteinschätzung aussehen. Die Fragen bleiben jederzeit transparent
                und geben Hinweise, wie du Antworten einschätzen kannst.
              </p>
              <div className="mt-6 space-y-6">
                {sampleQuestions.map((question) => (
                  <div key={question.title} className="rounded-2xl border border-divider bg-surface-1/90 p-5">
                    <div className="flex items-start gap-3">
                      <Thermometer className="mt-1 h-5 w-5 text-primary" aria-hidden />
                      <div>
                        <h3 className="text-base font-semibold text-default">{question.title}</h3>
                        <p className="text-xs font-medium uppercase tracking-wide text-primary">Antworttyp: {question.type}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      {question.scale ? (
                        <div className="flex flex-wrap gap-2">
                          {question.scale.map((item) => (
                            <span
                              key={item}
                              className="inline-flex items-center rounded-full border border-divider bg-white px-3 py-1.5 text-xs font-medium text-muted"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {question.options?.map((option) => (
                            <span
                              key={option}
                              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="flex flex-col justify-between rounded-3xl border border-divider bg-primary-600 px-6 py-8 text-primary-foreground shadow-[0_20px_45px_-30px_rgb(var(--color-primary-950))]">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Was du nach der Ersteinschätzung erhältst</h3>
                <ul className="space-y-3 text-sm leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white" aria-hidden />
                    Übersicht deiner aktuellen Belastungswerte mit Einordnung.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white" aria-hidden />
                    Drei Vorschläge: Therapeut:innen, Kursmodule und optional ein Care-Team Rückruf.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white" aria-hidden />
                    Erste Übungen zum Mitnehmen, damit du sofort starten kannst.
                  </li>
                </ul>
              </div>
              <Link
                href="/register"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary shadow-lg shadow-black/10 transition hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Jetzt Klarthera Zugang erstellen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
