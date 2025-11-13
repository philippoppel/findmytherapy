import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ForgotPasswordForm } from './ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Passwort zurücksetzen – FindMyTherapy',
  description:
    'Setze dein Passwort zurück und erhalte wieder Zugriff auf dein FindMyTherapy-Konto.',
}

export default function ForgotPasswordPage() {
  return (
    <div className="bg-surface">
      <section className="relative overflow-hidden py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-36 right-[-6rem] h-96 w-96 rounded-full bg-primary-50/30 blur-3xl" />
          <div className="absolute bottom-[-8rem] left-[-4rem] h-80 w-80 rounded-full bg-primary-50/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-full border border-divider bg-white/70 px-4 py-2 text-sm font-medium text-muted transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" aria-hidden />
            Zurück zur Anmeldung
          </Link>

          <ForgotPasswordForm />

          <div className="mt-8 rounded-3xl border border-divider bg-white/90 p-6 shadow-lg shadow-primary/10 backdrop-blur">
            <h2 className="text-lg font-semibold tracking-tight text-default">
              Alternative: Kontakt aufnehmen
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Du kannst uns auch direkt kontaktieren, wenn du Probleme hast oder sofort Unterstützung benötigst.
            </p>

            <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4 text-sm text-primary dark:border-primary/50 dark:bg-primary/20">
              <strong>Sofortige Hilfe?</strong> Ruf uns an unter <strong>+43 720 123456</strong> oder sende eine E-Mail an{' '}
              <strong>support@findmytherapy.net</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
