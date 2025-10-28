import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-950/5 via-cyan-950/5 to-teal-950/5 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-64 w-64 rounded-full bg-gradient-to-br from-teal-100 via-cyan-100 to-blue-100 opacity-20 blur-3xl" />
          </div>
          <div className="relative">
            <h1 className="text-9xl font-bold tracking-tight text-gray-900 sm:text-[12rem]">
              404
            </h1>
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-9xl font-bold tracking-tight text-transparent opacity-20 blur-sm sm:text-[12rem]">
              404
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Seite nicht gefunden
          </h2>
          <p className="text-lg leading-relaxed text-gray-700">
            Die Seite, die du suchst, existiert nicht oder wurde verschoben.
            Keine Sorge – wir helfen dir zurück auf den richtigen Weg.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            <Home className="h-5 w-5" />
            Zur Startseite
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-teal-600 bg-white px-6 py-3 text-base font-semibold text-teal-700 transition hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            <Search className="h-5 w-5" />
            Blog durchsuchen
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-16 rounded-3xl border border-teal-200/60 bg-gradient-to-br from-teal-50 via-cyan-50/50 to-white p-8 shadow-xl shadow-teal-900/10">
          <h3 className="text-lg font-bold text-gray-900">Beliebte Seiten</h3>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/triage"
              className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-teal-300 hover:shadow-md"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600 transition group-hover:bg-teal-200">
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Ersteinschätzung</p>
                <p className="text-sm text-gray-600">Kostenloser Test starten</p>
              </div>
            </Link>

            <Link
              href="/contact"
              className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-teal-300 hover:shadow-md"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600 transition group-hover:bg-teal-200">
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Kontakt</p>
                <p className="text-sm text-gray-600">Care-Team erreichen</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Support Text */}
        <p className="mt-8 text-sm text-gray-600">
          Brauchst du Hilfe?{' '}
          <Link href="/contact" className="font-semibold text-teal-700 hover:text-teal-600">
            Kontaktiere unser Care-Team
          </Link>
        </p>
      </div>
    </div>
  )
}
