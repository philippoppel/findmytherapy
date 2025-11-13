import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import './marketing-theme.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { SessionProvider } from '../components/providers/SessionProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { CookieConsentBanner } from '../components/CookieConsentBanner'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plus-jakarta-sans',
})

const analyticsConsoleLog = process.env.NODE_ENV !== 'production' ? "console.info('[analytics]', event, payload);" : ''

export const metadata: Metadata = {
  metadataBase: new URL('https://findmytherapy.net'),
  title: {
    default: 'FindMyTherapy – Der klare Weg zur richtigen Hilfe.',
    template: '%s | FindMyTherapy',
  },
  description: 'FindMyTherapy verbindet dich mit qualifizierter Unterstützung, digitalen Programmen und einer klaren Orientierung für deine mentale Gesundheit.',
  keywords: [
    'Therapeut finden Österreich',
    'Psychotherapie Wien',
    'mentale Gesundheit',
    'Online Therapie',
    'Ersteinschätzung',
    'PHQ-9',
    'GAD-7',
    'Psychotherapeut Österreich',
    'Therapeutensuche',
  ],
  authors: [{ name: 'FindMyTherapy' }],
  creator: 'FindMyTherapy',
  publisher: 'FindMyTherapy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de-AT" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/videos/hero-therapy.mp4"
          as="video"
          type="video/mp4"
        />
        <link
          rel="preload"
          href="/images/therapists/therapy-1.jpg"
          as="image"
          type="image/jpeg"
        />

        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      </head>
      <body className={`${plusJakartaSans.className} bg-white`} suppressHydrationWarning>
        <ErrorBoundary>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ErrorBoundary>
        <CookieConsentBanner />
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
