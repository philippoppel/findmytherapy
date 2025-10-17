import type { Metadata } from 'next'
import { CalendarCheck, HeartHandshake, ShieldCheck, Users } from 'lucide-react'
import { RegistrationForm } from './RegistrationForm'

export const metadata: Metadata = {
  title: 'Registrierung – Klarthera',
  description:
    'Registriere dich für den Klarthera-Demo-Zugang. Wähle dein Profil aus und wir melden uns mit dem passenden Onboarding.',
}

export default function RegisterPage() {
  return (
    <div className="bg-surface">
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-surface-1 to-surface-1 py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-[-6rem] h-96 w-96 rounded-full bg-primary-200/35 blur-3xl" />
          <div className="absolute bottom-[-8rem] left-[-4rem] h-80 w-80 rounded-full bg-secondary-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1 text-sm font-semibold text-primary-700 shadow-sm">
                <Users className="h-4 w-4" aria-hidden />
                Demo-Zugänge
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
                Klarthera Demo – Zugang anfordern
              </h1>
              <p className="text-lg leading-relaxed text-muted">
                Egal ob Therapeut:in, Unternehmen oder Privatperson: Hinterlasse uns ein paar Eckdaten und wir aktivieren dir
                den passenden Zugang inklusive Demo-Storyline. Wir melden uns werktags innerhalb von 24 Stunden.
              </p>
              <dl className="grid grid-cols-1 gap-4 rounded-3xl border border-divider bg-white/70 p-6 shadow-sm shadow-primary/10 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 text-primary" aria-hidden />
                  <div>
                    <dt className="text-sm font-semibold text-neutral-900">DSGVO-konform</dt>
                    <dd className="text-sm text-muted">
                      Alle Angaben dienen ausschließlich zur Demo-Abstimmung und werden nicht extern geteilt.
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarCheck className="mt-1 h-5 w-5 text-primary" aria-hidden />
                  <div>
                    <dt className="text-sm font-semibold text-neutral-900">Flexible Termine</dt>
                    <dd className="text-sm text-muted">
                      Wir koordinieren optional einen gemeinsamen Demo-Call oder liefern eine aufgezeichnete Tour.
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <HeartHandshake className="mt-1 h-5 w-5 text-primary" aria-hidden />
                  <div>
                    <dt className="text-sm font-semibold text-neutral-900">Individuelle Empfehlungen</dt>
                    <dd className="text-sm text-muted">
                      Wir stimmen Inhalte auf deine Zielgruppe, Use-Cases und vorhandene Infrastruktur ab.
                    </dd>
                  </div>
                </div>
              </dl>
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
