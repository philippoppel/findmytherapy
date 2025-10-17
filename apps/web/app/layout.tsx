import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { SessionProvider } from '../components/providers/SessionProvider'
import { ThemeProvider } from '../components/providers/ThemeProvider'
import { ChatDemo } from '../components/support/ChatDemo'
import { ErrorBoundary } from './components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Klarthera – Der klare Weg zur richtigen Hilfe.',
  description: 'Klarthera verbindet dich mit qualifizierter Unterstützung, digitalen Programmen und einer klaren Orientierung für deine mentale Gesundheit.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de-AT" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider>
            <SessionProvider>
              <div className="min-h-screen flex flex-col bg-surface text-base antialiased">
                <Header />
                <main className="flex-1 bg-surface">
                  {children}
                </main>
                <Footer />
                <ChatDemo />
              </div>
            </SessionProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
