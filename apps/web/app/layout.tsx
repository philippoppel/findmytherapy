import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { SessionProvider } from '../components/providers/SessionProvider'
import { ThemeProvider } from '../components/providers/ThemeProvider'
import { ChatWidget } from '../components/support/ChatWidget'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ThemeScript } from './components/ThemeScript'

const inter = Inter({ subsets: ['latin'] })

const analyticsConsoleLog = process.env.NODE_ENV !== 'production' ? "console.info('[analytics]', event, payload);" : ''

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
        <ThemeScript />
        <ErrorBoundary>
          <ThemeProvider>
            <SessionProvider>
              <div className="min-h-screen flex flex-col bg-surface text-base antialiased">
                <Header />
                <main className="flex-1 bg-surface">
                  {children}
                </main>
                <Footer />
                <ChatWidget />
              </div>
            </SessionProvider>
          </ThemeProvider>
        </ErrorBoundary>
        <Script id="analytics-placeholder" strategy="lazyOnload">
          {`
            window.klartheraAnalytics = window.klartheraAnalytics || {
              events: [],
              push(event, payload) {
                this.events.push({ event, payload, timestamp: Date.now() });
                ${analyticsConsoleLog}
              }
            };
          `}
        </Script>
      </body>
    </html>
  )
}
