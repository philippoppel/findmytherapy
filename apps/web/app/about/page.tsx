import type { Metadata } from 'next'
import { Award, Compass, HeartHandshake, ShieldCheck, Sparkles, Users2 } from 'lucide-react'

const teamMembers = [
  {
    name: 'MMag. Dr. Gregor Studlar BA',
    role: 'Psychotherapeut – Verhaltenstherapie',
    focus: 'Klinische Erfahrung Neuromed Campus • Schwerpunkt: Angst, Depression, Burnout',
  },
  {
    name: 'BA.pth. Thomas Kaufmann',
    role: 'Psychotherapeut',
    focus: 'Sigmund Freud Universität Wien • Notfallsanitäter-Hintergrund (Krisenkompetenz)',
  },
  {
    name: 'Dipl. Ing. Philipp Oppel',
    role: 'Full Stack Developer',
    focus: 'Technische Leitung & Plattformentwicklung',
  },
]

const values = [
  {
    title: 'Klarheit & Orientierung',
    description: 'Transparente Informationen, klare Sprache und verständliche Entscheidungshilfen auf allen Touchpoints.',
    icon: Compass,
  },
  {
    title: 'Vertrauensvolle Begleitung',
    description: 'Unsere Care-Spezialist:innen begleiten den gesamten Prozess vom Erstkontakt bis zur langfristigen Stabilisierung.',
    icon: HeartHandshake,
  },
  {
    title: 'Exzellenz & Sicherheit',
    description: 'Zertifizierte Therapeut:innen, DSGVO-konforme Infrastruktur und kontinuierliche Qualitätssicherung.',
    icon: ShieldCheck,
  },
]

export const metadata: Metadata = {
  title: 'Über FindMyTherapy – Der klare Weg zur richtigen Hilfe.',
  description:
    'FindMyTherapy verbindet klinisches Know-how mit Technologie, um Menschen verlässlich zur passenden mentalen Unterstützung zu führen.',
}

export default function AboutPage() {
  return (
    <div className="bg-surface">
      <section className="relative overflow-hidden bg-white py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-[-6rem] h-80 w-80 rounded-full bg-primary-100/30 blur-3xl" />
          <div className="absolute bottom-[-10rem] left-[-2rem] h-80 w-80 rounded-full bg-primary-100/50 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center rounded-full bg-primary-600 px-4 py-1 text-sm font-semibold text-white shadow-sm">
            FindMyTherapy Story – Unser Weg
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-default md:text-5xl">
            Warum FindMyTherapy Menschen durch mentale Gesundheit begleitet
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Wir bauen Zugang zu professioneller Unterstützung neu: klar, wertschätzend und in enger Zusammenarbeit mit
            Therapeut:innen, Ärzt:innen und einem engagierten Care-Team.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8 rounded-3xl border border-divider bg-surface-1/85 p-8 shadow-md shadow-primary/10 backdrop-blur">
              <h2 className="text-balance break-words text-3xl font-semibold text-default">Unsere Herangehensweise</h2>
              <p className="text-base leading-relaxed text-muted">
                FindMyTherapy verbindet klinische Exzellenz mit digitalen Tools. Wir entwickeln Care Journeys, die Menschen dort
                abholen, wo sie stehen, und sie mit klaren nächsten Schritten begleiten – von der Ersteinschätzung über die
                Terminvereinbarung bis zu begleitenden Programmen.
              </p>
              <div className="space-y-5">
                {values.map((value) => (
                  <div key={value.title} className="flex gap-4 rounded-2xl border border-divider bg-surface-1/90 p-5">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <value.icon className="h-6 w-6" aria-hidden />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-default">{value.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="flex flex-col justify-between rounded-3xl border border-divider bg-primary-600 px-6 py-8 text-primary-foreground shadow-[0_25px_55px_-35px_rgb(var(--color-primary-950))]">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">FindMyTherapy in Zahlen</h3>
                <ul className="space-y-3 text-sm leading-relaxed">
                  <li className="flex items-start gap-3">
                    <Sparkles className="mt-1 h-5 w-5 flex-none" aria-hidden /> 120+ verifizierte Therapeut:innen in Österreich
                  </li>
                  <li className="flex items-start gap-3">
                    <Users2 className="mt-1 h-5 w-5 flex-none" aria-hidden /> Kombinierte Care-Teams aus Psycholog:innen, Coaches und Peer Support
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="mt-1 h-5 w-5 flex-none" aria-hidden /> Programme entwickelt mit klinischen Partner:innen & Universitäten
                  </li>
                </ul>
              </div>
              <p className="rounded-2xl bg-primary-500/40 p-4 text-sm leading-relaxed">
                Wir teilen diese Kennzahlen, um zu zeigen, wie FindMyTherapy Wirkung sichtbar macht. Für Präsentationen oder Sales kann der Abschnitt jederzeit angepasst werden.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary-50 via-surface-1 to-primary-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl font-semibold text-default">Team FindMyTherapy</h2>
              <p className="text-base text-muted">
                Interdisziplinär aufgestellt – mit klaren Rollen zwischen therapeutischer Expertise, Produktentwicklung und Care-Team.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full border border-divider bg-surface-1/70 px-4 py-2 text-sm text-muted">
              <Sparkles className="mr-2 h-4 w-4 text-primary" /> Kuratierte Beispiele – für Präsentationen anpassbar
            </span>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {teamMembers.map((member) => (
              <div key={member.name} className="rounded-3xl border border-divider bg-surface-1/85 p-6 shadow-sm shadow-primary/10">
                <h3 className="text-lg font-semibold text-default">{member.name}</h3>
                <p className="text-sm font-medium text-primary">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{member.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
