import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarCheck, Clock, Mail, MapPin, Phone, Sparkles, UserRound } from 'lucide-react'

import { Button } from '@mental-health/ui'
import { ContactForm } from './ContactForm'

const careTeam = [
  {
    name: 'Mag. Samuel Rinner',
    role: 'Care-Team Leitung',
    focus: 'Koordiniert Erstgespräche & medizinische Rückfragen',
    availability: 'Erreichbar Mo–Fr, 9–17 Uhr',
  },
  {
    name: 'Clara Winkler, MSc',
    role: 'Psychologin & Matching Specialist',
    focus: 'Stimmt Ersteinschätzung mit passenden Therapeut:innen ab',
    availability: 'Antwortet meist innerhalb von 45 Minuten',
  },
]

export const metadata: Metadata = {
  title: 'Kontakt & Care-Team – FindMyTherapy',
  description:
    'Das FindMyTherapy Care-Team unterstützt bei Fragen zur Ersteinschätzung, Terminfindung und zu digitalen Programmen. Die folgenden Angaben zeigen unsere Kontaktmöglichkeiten.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-surface py-12">
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-end">
          <Link href="/" className="text-sm font-medium text-muted transition hover:text-default">
            Zur Startseite
          </Link>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-divider bg-white p-10 shadow-2xl">
          <div className="relative space-y-6 text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <Sparkles className="h-4 w-4" />
              FindMyTherapy Care-Team
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-default md:text-5xl">
                Wir sind dein direkter Draht – vertraulich & persönlich
              </h1>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted md:mx-0">
                Ob Ersteinschätzung, Terminvereinbarung oder technische Fragen – das Care-Team begleitet dich durch jeden Schritt.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-start">
              <Button asChild size="lg">
                <Link href="#care-form" prefetch={false}>
                  Nachricht schreiben
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="tel:+4319971212">Direkt anrufen</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6 rounded-3xl border border-divider bg-white p-8 shadow-xl">
              <h2 className="text-2xl font-semibold text-default">Kontaktmöglichkeiten</h2>
              <div className="space-y-4 text-sm text-muted">
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 flex-none text-primary" />
                  <div>
                    <p className="font-semibold text-default">Telefon</p>
                    <p>+43 1 997 12 12 — Werktags erreichbar, Rückruf innerhalb eines Tages.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 flex-none text-primary" />
                  <div>
                    <p className="font-semibold text-default">E-Mail</p>
                    <p>care@findmytherapy.health — Antworten in der Regel innerhalb von 3 Stunden.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarCheck className="mt-1 h-5 w-5 flex-none text-primary" />
                  <div>
                    <p className="font-semibold text-default">Terminvereinbarung</p>
                    <p>Unverbindliches Online-Erstgespräch – 20 Minuten, ohne Wartezimmer.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 flex-none text-primary" />
                  <div>
                    <p className="font-semibold text-default">Standort</p>
                    <p>Schottenring 12, 1010 Wien – persönliche Beratung nach Vereinbarung.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-divider bg-surface-1 p-5 text-sm text-muted">
                Hinweis: Im Livebetrieb ist hier unser Echtzeitchat eingebunden – ideal für spontane Rückfragen.
              </div>
            </div>

            <div
              id="care-form"
              className="rounded-3xl border border-divider bg-white p-8 shadow-xl"
            >
              <h2 className="text-2xl font-semibold text-default">Nachricht senden</h2>
              <p className="mt-2 text-sm text-muted">
                Hinterlasse uns ein paar Angaben, wir melden uns in Kürze mit personalisierten Vorschlägen.
              </p>
              <div className="mt-6 rounded-2xl border border-divider bg-surface-1 p-4">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 rounded-3xl border border-divider bg-white p-8 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-default">Dein Care-Team</h2>
                <p className="text-sm text-muted">
                  Ein interdisziplinäres Team begleitet dich von der Ersteinschätzung bis zum Start in die Therapie.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-divider bg-surface-1 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted">
                <Sparkles className="h-4 w-4 text-primary" /> Kuratiertes Pilotteam
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {careTeam.map((member) => (
                <div
                  key={member.name}
                  className="rounded-2xl border border-divider bg-surface-1 p-5 shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UserRound className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-default">{member.name}</p>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted">{member.role}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{member.focus}</p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-divider bg-white px-3 py-1 text-xs text-muted">
                    <Clock className="h-3.5 w-3.5 text-primary" aria-hidden /> {member.availability}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
