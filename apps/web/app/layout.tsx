import { Inter } from 'next/font/google'
import './globals.css'
import './marketing-theme.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { SessionProvider } from '../components/providers/SessionProvider'
import { ThemeProvider } from '../components/providers/ThemeProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ThemeScript } from './components/ThemeScript'

const inter = Inter({ subsets: ['latin'] })

const analyticsConsoleLog = process.env.NODE_ENV !== 'production' ? "console.info('[analytics]', event, payload);" : ''

export const metadata: Metadata = {
  title: 'FindMyTherapy – Der klare Weg zur richtigen Hilfe.',
  description: 'FindMyTherapy verbindet dich mit qualifizierter Unterstützung, digitalen Programmen und einer klaren Orientierung für deine mentale Gesundheit.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de-AT" suppressHydrationWarning>
      <body className={`${inter.className} bg-white`} suppressHydrationWarning>
        <ErrorBoundary>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ErrorBoundary>
        <Script id="analytics-placeholder" strategy="lazyOnload">
          {`
            window.findMyTherapyAnalytics = window.findMyTherapyAnalytics || {
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
