import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'
import { CrisisResources } from '../triage/CrisisResources'
import { ChatWidget } from '../../components/support/ChatWidget'

export const metadata: Metadata = {
  title: 'Kontakt – FindMyTherapy',
  description:
    'Kontaktiere das FindMyTherapy Care-Team per E-Mail oder Chat. Notfallnummern und Sofort-Hilfe verfügbar.',
}


export default function ContactPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-teal-950/5 via-cyan-950/5 to-teal-950/5 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Back Navigation */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Startseite
          </Link>

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Kontakt
            </h1>
            <p className="mt-4 text-lg text-gray-700">
              Wir sind für dich da – per E-Mail, Chat oder in akuten Notfällen
            </p>
          </div>

          {/* Email Contact */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                <Mail className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">E-Mail</h2>
                <p className="mt-2 text-gray-700">
                  Schreib uns eine E-Mail und wir melden uns innerhalb von 24 Stunden bei dir.
                </p>
                <a
                  href="mailto:care@findmytherapy.net"
                  className="mt-4 inline-block text-lg font-semibold text-teal-600 transition hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                >
                  care@findmytherapy.net
                </a>
              </div>
            </div>
          </div>

          {/* Crisis Resources */}
          <div className="mt-12">
            <CrisisResources />
          </div>
        </div>
      </div>
      <ChatWidget />
    </>
  )
}
