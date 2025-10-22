import type { Metadata } from 'next'
import { CalendarCheck, Clock, Mail, MapPin, Phone, Sparkles, UserRound } from 'lucide-react'
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
    <div className="bg-surface">
      <section className="relative overflow-hidden bg-white py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 right-[-6rem] h-80 w-80 rounded-full bg-blue-50/35 blur-3xl" />
          <div className="absolute bottom-[-8rem] left-[-4rem] h-72 w-72 rounded-full bg-blue-50/35 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full bg-secondary-100 px-4 py-1 text-sm font-semibold text-secondary-700 shadow-sm">
            FindMyTherapy Care-Team
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-default md:text-5xl">
            Wir beantworten deine Fragen persönlich und vertraulich
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Ob erste Orientierung, Terminabsprache oder technische Hilfe – das Care-Team ist dein direkter Draht. Die
            Angaben zeigen, wie der Bereich im Livebetrieb aussieht.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#care-form"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Nachricht schreiben
            </a>
            <a
              href="tel:+4319971212"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Direkt anrufen
            </a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6 rounded-3xl border border-divider bg-white/88 p-8 shadow-md shadow-primary/10 backdrop-blur">
              <h2 className="text-2xl font-semibold text-default">Kontaktmöglichkeiten</h2>
              <div className="space-y-4 text-sm text-muted">
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 flex-none text-primary" />
                  <div>
                    <p className="font-medium text-default">Telefon</p>
                    <p>+43 1 997 12 12 — An Werktagen erreichbar, Rückruf innerhalb eines Werktages.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 flex-none text-primary" />
                  <div>
                    <p className="font-medium text-default">E-Mail</p>
                    <p>care@findmytherapy.health — Antworten typischerweise innerhalb von 3 Stunden.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarCheck className="mt-1 h-5 w-5 flex-none text-primary" />
                  <div>
                    <p className="font-medium text-default">Terminvereinbarung</p>
                    <p>Online-Erstgespräch via FindMyTherapy — unverbindlich, 20 Minuten, ohne Wartezimmer.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 flex-none text-primary" />
                  <div>
                    <p className="font-medium text-default">Standort</p>
                    <p>Schottenring 12, 1010 Wien — persönliche Beratung nach Vereinbarung.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-divider bg-primary/10 p-5 text-sm text-primary">
                Unser Chat (rechts unten) zeigt, wie Echtzeit-Unterstützung funktioniert. Im Produkt kann hier direkt ein
                Gespräch mit dem Care-Team gestartet werden.
              </div>
            </div>
            <div id="care-form">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 rounded-3xl border border-divider bg-surface-1/95 p-8 shadow-md shadow-primary/10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-default">Care-Team</h2>
                <p className="text-sm text-muted">Wir stellen vor, wer sich um deine Anliegen kümmert.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-divider bg-white/70 px-3 py-1 text-xs text-muted">
                <Sparkles className="h-4 w-4 text-primary" /> Kuratierte Angaben
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {careTeam.map((member) => (
                <div key={member.name} className="rounded-2xl border border-divider bg-white/92 p-5 shadow-sm shadow-primary/5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UserRound className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-default">{member.name}</p>
                      <p className="text-xs font-medium uppercase tracking-wide text-primary">{member.role}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{member.focus}</p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-divider bg-surface-1 px-3 py-1 text-xs text-muted">
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
