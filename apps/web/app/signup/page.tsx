import type { Metadata } from 'next'
import { HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'

import { ClientRegistrationForm } from './ClientRegistrationForm'

export const metadata: Metadata = {
  title: 'Konto erstellen – Klarthera',
  description:
    'Registriere dich als Kund:in für Klarthera. Behalte deine Kurse, Empfehlungen und Support-Kontakte im Blick.',
}

export default function ClientSignupPage() {
  return (
    <div className="bg-surface">
      <section className="relative overflow-hidden bg-white py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-44 right-[-8rem] h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />
          <div className="absolute bottom-[-10rem] left-[-6rem] h-80 w-80 rounded-full bg-blue-50/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1 text-sm font-semibold text-primary shadow-sm">
                <Sparkles className="h-4 w-4" aria-hidden />
                Dein Klarthera Bereich
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-default md:text-5xl">
                Zugang zu Programmen, Care-Team & Empfehlungen
              </h1>
              <p className="text-lg leading-relaxed text-muted">
                Lege deinen Account an, sichere dir Kursmaterialien, persönliche Empfehlungen aus der Ersteinschätzung und den
                direkten Draht zum Care-Team.
              </p>
              <dl className="grid grid-cols-1 gap-4 rounded-3xl border border-divider bg-surface-1/70 p-6 shadow-sm shadow-primary/10 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 text-primary" aria-hidden />
                  <div>
                    <dt className="text-sm font-semibold text-default">Sicher und DSGVO-konform</dt>
                    <dd className="text-sm text-muted">
                      Deine Angaben bleiben vertraulich. Accounts können jederzeit gelöscht werden.
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <HeartHandshake className="mt-1 h-5 w-5 text-primary" aria-hidden />
                  <div>
                    <dt className="text-sm font-semibold text-default">Care-Team inklusive</dt>
                    <dd className="text-sm text-muted">
                      Du erhältst persönliche Empfehlungen und kannst jederzeit Support anfordern.
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="relative z-10">
              <ClientRegistrationForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
