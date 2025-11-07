import type { Metadata } from 'next'
import { HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'

import { ClientRegistrationForm } from './ClientRegistrationForm'

export const metadata: Metadata = {
  title: 'Konto erstellen – FindMyTherapy',
  description:
    'Registriere dich als Kund:in für FindMyTherapy. Behalte deine Kurse, Empfehlungen und Support-Kontakte im Blick.',
}

export default function ClientSignupPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 py-8 sm:py-12">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center lg:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-800 shadow-sm">
            <Sparkles className="h-4 w-4" aria-hidden />
            Dein FindMyTherapy Bereich
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Zugang zu Programmen, Care-Team & Empfehlungen
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            Lege deinen Account an, sichere dir Kursmaterialien, persönliche Empfehlungen aus der Ersteinschätzung und den
            direkten Draht zum Care-Team.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Left Column - Form */}
          <div className="order-2 lg:order-1">
            <ClientRegistrationForm />
          </div>

          {/* Right Column - Info */}
          <div className="order-1 space-y-6 lg:order-2">
            {/* Benefits */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">Was dich erwartet</h2>
              <dl>
                <dt className="mt-6 flex items-start gap-3 text-neutral-900 first:mt-0">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <span className="font-medium">Sicher und DSGVO-konform</span>
                </dt>
                <dd className="pl-8 pt-2 text-sm text-neutral-700">
                  Deine Angaben bleiben vertraulich. Accounts können jederzeit gelöscht werden.
                </dd>

                <dt className="mt-6 flex items-start gap-3 text-neutral-900 first:mt-0">
                  <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <span className="font-medium">Care-Team inklusive</span>
                </dt>
                <dd className="pl-8 pt-2 text-sm text-neutral-700">
                  Du erhältst persönliche Empfehlungen und kannst jederzeit Support anfordern.
                </dd>
              </dl>
            </div>

            {/* Quick Info */}
            <div className="rounded-2xl border border-primary/30 bg-primary-50/50 p-6">
              <h3 className="font-semibold text-neutral-900">Kostenlos starten</h3>
              <p className="mt-2 text-sm text-neutral-700">
                Erstelle deinen Account in wenigen Minuten und erhalte sofort Zugang zu allen Funktionen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
