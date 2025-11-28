import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import './marketing-theme.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { SessionProvider } from '../components/providers/SessionProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CookieConsentBanner } from '../components/CookieConsentBanner';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plus-jakarta-sans',
});

const analyticsConsoleLog =
  process.env.NODE_ENV !== 'production' ? "console.info('[analytics]', event, payload);" : '';

export const metadata: Metadata = {
  metadataBase: new URL('https://findmytherapy.net'),
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon-192.png',
  },
  title: {
    default: 'FindMyTherapy – Die richtige Therapie für dich',
    template: '%s | FindMyTherapy',
  },
  description:
    'FindMyTherapy verbindet dich mit qualifizierter Unterstützung, digitalen Programmen und einer klaren Orientierung für deine mentale Gesundheit.',
  keywords: [
    // Hauptkeywords
    'Therapeut finden Österreich',
    'Psychotherapie Wien',
    'Psychotherapeut Österreich',
    'Therapeutensuche',
    'mentale Gesundheit',
    // Städte Österreich
    'Psychotherapie Graz',
    'Therapeut Linz',
    'Psychotherapie Salzburg',
    'Therapeut Innsbruck',
    'Psychotherapie Klagenfurt',
    'Therapeut St. Pölten',
    'Psychotherapie Villach',
    'Therapeut Wels',
    // Störungsbilder
    'Therapie Depression Österreich',
    'Angststörung Behandlung',
    'Burnout Therapie Wien',
    'Panikattacken Hilfe',
    'Trauma Therapeut Österreich',
    'PTBS Behandlung',
    'Essstörung Therapie',
    'ADHS Therapie Erwachsene',
    // Therapieformen
    'Verhaltenstherapie Österreich',
    'Psychoanalyse Wien',
    'Systemische Therapie',
    'Gesprächstherapie',
    'Tiefenpsychologie',
    // Long-Tail
    'Psychotherapie Kosten Österreich',
    'Psychotherapie Krankenkasse',
    'Online Therapie Österreich',
    'Erstgespräch Psychotherapie',
    'Kassenplatz Psychotherapie',
    'Psychotherapie Wartezeit',
    // Tools
    'PHQ-9',
    'GAD-7',
    'Ersteinschätzung',
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
  openGraph: {
    type: 'website',
    locale: 'de_AT',
    siteName: 'FindMyTherapy',
    title: 'FindMyTherapy – Der klare Weg zur richtigen Hilfe',
    description:
      'Finde qualifizierte Psychotherapeut:innen in Österreich. Digitale Ersteinschätzung, Therapeuten-Matching und Wissen für deine mentale Gesundheit.',
    images: [
      {
        url: 'https://findmytherapy.net/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Therapeut:innen finden in Österreich',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@findmytherapy',
    creator: '@findmytherapy',
    title: 'FindMyTherapy – Der klare Weg zur richtigen Hilfe',
    description:
      'Finde qualifizierte Psychotherapeut:innen in Österreich. Digitale Ersteinschätzung, Therapeuten-Matching und Wissen für deine mentale Gesundheit.',
    images: ['https://findmytherapy.net/images/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-AT" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ffffff" />

        {/* Preload LCP image (video poster) with high priority */}
        <link
          rel="preload"
          href="/images/therapists/therapy-2.jpg"
          as="image"
          type="image/jpeg"
          fetchPriority="high"
        />

        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      </head>
      <body className={`${plusJakartaSans.className} theme-light`} suppressHydrationWarning>
        <ErrorBoundary>
          <SessionProvider>{children}</SessionProvider>
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
  );
}
