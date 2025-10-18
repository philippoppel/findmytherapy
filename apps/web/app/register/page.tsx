import type { Metadata } from 'next'
import { CalendarCheck, FileText, HeartHandshake, ShieldCheck, Users } from 'lucide-react'
import { RegistrationForm } from './RegistrationForm'

export const metadata: Metadata = {
  title: 'Registrierung – Klarthera',
  description:
    'Registriere dich für den Klarthera-Zugang. Wähle dein Profil aus und wir melden uns mit dem passenden Onboarding.',
}

export default function RegisterPage() {
  return (
    <div className="bg-surface">
      <section className="relative overflow-hidden bg-white py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-[-6rem] h-96 w-96 rounded-full bg-blue-50/35 blur-3xl" />
          <div className="absolute bottom-[-8rem] left-[-4rem] h-80 w-80 rounded-full bg-blue-50/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1 text-sm font-semibold text-primary shadow-sm">
                <Users className="h-4 w-4" aria-hidden />
                Zugang anfragen
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-default md:text-5xl">
                Klarthera Zugang – Pilot anfordern
              </h1>
              <p className="text-lg leading-relaxed text-muted">
                Egal ob Therapeut:in, Unternehmen oder Privatperson: Hinterlasse uns ein paar Eckdaten und wir aktivieren dir
                den passenden Zugang inklusive abgestimmter Storyline. Wir melden uns werktags innerhalb von 24 Stunden.
              </p>
              <dl className="grid grid-cols-1 gap-4 rounded-3xl border border-divider bg-white/70 p-6 shadow-sm shadow-primary/10 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 text-primary" aria-hidden />
                  <div>
                    <dt className="text-sm font-semibold text-default">DSGVO-konform</dt>
                    <dd className="text-sm text-muted">
                      Alle Angaben dienen ausschließlich zur Abstimmung deines Zugangs und werden nicht extern geteilt.
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarCheck className="mt-1 h-5 w-5 text-primary" aria-hidden />
                  <div>
                    <dt className="text-sm font-semibold text-default">Flexible Termine</dt>
                    <dd className="text-sm text-muted">
                      Wir koordinieren optional einen gemeinsamen Walkthrough oder liefern eine aufgezeichnete Tour.
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <HeartHandshake className="mt-1 h-5 w-5 text-primary" aria-hidden />
                  <div>
                    <dt className="text-sm font-semibold text-default">Individuelle Empfehlungen</dt>
                    <dd className="text-sm text-muted">
                      Wir stimmen Inhalte auf deine Zielgruppe, Use-Cases und vorhandene Infrastruktur ab.
                    </dd>
                  </div>
                </div>
              </dl>
              <div className="rounded-3xl border border-primary/30 bg-primary/10 p-5 shadow-sm shadow-primary/10 dark:border-primary/50 dark:bg-primary/20">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <FileText className="mt-1 h-5 w-5 text-primary" aria-hidden />
                    <div>
                      <h2 className="text-sm font-semibold text-default">Compliance-Unterlagen</h2>
                      <p className="text-sm text-muted">
                        Pilot-Therapeut:innen erhalten DSGVO-, Vertrags- und Notfallhinweise als Download für die Freischaltung.
                      </p>
                    </div>
                  </div>
                  <a
                    href="/compliance/klarthera-pilot-compliance-pack.pdf"
                    download
                    className="inline-flex items-center justify-center rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Paket herunterladen
                  </a>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <RegistrationForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
