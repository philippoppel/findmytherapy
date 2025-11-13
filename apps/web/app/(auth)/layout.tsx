import Link from 'next/link'
import { Compass } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-primary-50 to-primary-100">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-transform hover:scale-105"
            aria-label="FindMyTherapy Startseite"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-1000 shadow-lg shadow-primary-500/40">
              <Compass className="h-5 w-5 text-white" aria-hidden />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold leading-tight text-neutral-900">
                FindMyTherapy
              </span>
              <span className="text-[10px] font-medium text-neutral-600">
                Mentale Orientierung
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
          >
            Zur Homepage
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-neutral-200 bg-white/60 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-neutral-600">
          <p>
            © {new Date().getFullYear()} FindMyTherapy. Der klare Weg zur richtigen Hilfe.
          </p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <Link href="/privacy" className="hover:text-neutral-900">
              Datenschutz
            </Link>
            <Link href="/imprint" className="hover:text-neutral-900">
              Impressum
            </Link>
            <Link href="/terms" className="hover:text-neutral-900">
              AGB
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
