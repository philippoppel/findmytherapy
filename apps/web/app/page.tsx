import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, BookOpen, Compass, ShieldCheck, ClipboardList, Brain, CalendarPlus, Calendar, Clock } from 'lucide-react'
import { blogPosts } from '../lib/blogData'

export const metadata: Metadata = {
  title: 'Klarthera – Mentale Gesundheit mit klarer Richtung | Digitale Ersteinschätzung & Ressourcen',
  description:
    'Klarthera führt dich Schritt für Schritt zur passenden Unterstützung: digitale Ersteinschätzung, kuratierte Warteliste für Therapeut:innen und evidenzbasierte Programme.',
  keywords: [
    'mentale Gesundheit',
    'Therapie finden',
    'psychische Gesundheit Österreich',
    'digitale Ersteinschätzung',
    'Therapeut:in finden',
    'Klarthera Blog',
  ],
  openGraph: {
    title: 'Klarthera – Der klare Weg zur richtigen Hilfe.',
    description:
      'Digitale Ersteinschätzung, persönliche Empfehlungen und Ressourcen für mentale Gesundheit in Österreich.',
    type: 'website',
    locale: 'de_AT',
    url: 'https://klarthera.at/',
  },
  alternates: {
    canonical: 'https://klarthera.at/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Klarthera – Digitale Unterstützung für mentale Gesundheit',
    description:
      'Ersteinschätzung, individuelle Empfehlungen und Wissen rund um mentale Gesundheit auf einer Plattform.',
    creator: '@klarthera',
  },
}

export default function HomePage() {
  const blogTeasers = blogPosts.slice(0, 3)
  const blogDateFormatter = new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium' })

  const features = [
    {
      icon: Compass,
      title: 'Individuelle Ersteinschätzung',
      description: 'Beantworte wenige Fragen und verstehe sofort, welche Art von Unterstützung für deine Situation geeignet ist.',
    },
    {
      icon: BookOpen,
      title: 'Begleitende Programme',
      description: 'Digitale Kurse und Übungen unterstützen dich zwischen deinen Terminen – evidenzbasiert und alltagstauglich.',
    },
    {
      icon: ShieldCheck,
      title: 'Schutz deiner Daten',
      description: 'DSGVO-konform, verschlüsselt und transparent – deine Angaben bleiben bei dir und werden nicht ohne Zustimmung geteilt.',
    },
    {
      icon: ClipboardList,
      title: 'Kuratiertes Netzwerk (Early Access)',
      description:
        'Unsere Expert:innen-Warteliste wächst. Wir prüfen jedes Profil sorgfältig und verbinden dich in der Demo mit passenden Formaten.',
    },
  ]

  const triagePreview = [
    {
      title: 'Profil & Bedürfnisse',
      description: 'Kurze Fragen für Kontext, Erfahrungsstand und gewünschte Formate.',
      icon: Compass,
    },
    {
      title: 'Screening & Feedback',
      description: 'Validierte Fragen wie PHQ-9 geben dir sofort Rückmeldung.',
      icon: ClipboardList,
    },
    {
      title: 'Passende Empfehlungen',
      description: 'Therapeut:innen, Programme und Care-Team – abgestimmt auf deine Angaben.',
      icon: Brain,
    },
    {
      title: 'In Kontakt bleiben',
      description: 'Termine buchen, Rückfragen stellen oder weitere Optionen ansehen.',
      icon: CalendarPlus,
    },
  ]

  const faqs = [
    {
      question: 'Was bedeutet Klarthera Demo?',
      answer:
        'Wir zeigen dir den kompletten Ablauf von der Ersteinschätzung bis zur Empfehlung – ideal für Präsentationen und interne Abstimmungen. Aktuell befinden wir uns im Aufbau unseres Expert:innen-Netzwerks.',
    },
    {
      question: 'Wie sieht die Empfehlung ohne gelistete Therapeut:innen aus?',
      answer:
        'Du erhältst Vorschläge für Formate und Spezialisierungen, inklusive digitaler Programme und möglicher nächster Schritte. Sobald verifizierte Therapeut:innen verfügbar sind, ergänzen wir diese automatisch.',
    },
    {
      question: 'Ist Klarthera für Teams oder Unternehmen geeignet?',
      answer:
        'Ja. Wir bereiten eine Team-Variante mit Reporting und anonymisierten Insights vor. Interessierte Unternehmen können sich für Pilotprojekte registrieren.',
    },
    {
      question: 'Wie werden sensible Daten verarbeitet?',
      answer:
        'Alle Eingaben werden verschlüsselt gespeichert, nur mit deiner Zustimmung geteilt und ausschließlich auf Servern innerhalb der EU verarbeitet.',
    },
  ]

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      {/* Hero Section */}
      <section
        id="start"
        className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-surface-1 to-surface-1 py-24"
        aria-labelledby="hero-title"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-10 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-[-4rem] h-80 w-80 rounded-full bg-secondary-200/30 blur-3xl" />
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative text-center space-y-8">
            <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1 text-sm font-semibold text-primary-700 shadow-sm">
              Beta Live • Digitale mentale Gesundheitsplattform
            </span>
            <h1 id="hero-title" className="text-4xl md:text-6xl font-semibold text-neutral-900 tracking-tight">
              Klarthera – <span className="text-primary-700">Der klare Weg zur richtigen Hilfe.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg md:text-xl leading-relaxed text-muted">
              Wir führen dich Schritt für Schritt durch den Prozess: von der ersten Einschätzung über fundierte Empfehlungen bis hin zur langfristigen Begleitung – transparent, menschlich und technisch sicher.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/triage"
                className="btn btn-primary btn-lg shadow-lg shadow-primary/20 focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Ersteinschätzung starten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/therapists"
                className="btn btn-outline btn-lg border border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-800 focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Therapeut:innen & Programme einsehen
              </Link>
              <Link
                href="/blog"
                className="btn btn-link text-base font-semibold text-primary hover:text-primary-800 focus-visible:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Zum Blog
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <p className="mx-auto max-w-xl text-sm text-subtle">
              Hinweis: Unser kuratiertes Therapeut:innen-Netzwerk befindet sich im Aufbau. In der Demo zeigen wir dir, wie Klarthera Empfehlungen und Ressourcen bündelt.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="angebote"
        className="bg-gradient-to-b from-surface-1 via-surface-2/40 to-surface-1 py-20"
        aria-labelledby="features-title"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-4 text-center">
            <h2 id="features-title" className="text-3xl font-semibold text-neutral-900">
              Orientierung, Wissen und Begleitung aus einer Hand
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
              Klarthera vereint persönliche Beratung, digitale Tools und eine wachsende Wissensbasis, damit du schneller verstehst, welche Unterstützung zu dir passt – ganz ohne Umwege.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center space-y-4 rounded-2xl border border-divider bg-surface-1/90 p-6 text-center shadow-md shadow-primary/10 backdrop-blur"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary-700">
                  <feature.icon className="h-6 w-6" aria-hidden />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-lg font-semibold text-neutral-900">{feature.title}</h3>
                  <p className="text-base leading-relaxed text-muted">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Triage Preview */}
      <section className="py-20" aria-labelledby="triage-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 rounded-3xl border border-divider bg-white/85 p-10 shadow-lg shadow-primary/10 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <h2 id="triage-title" className="text-3xl font-semibold text-neutral-900">
                  Demo: Ersteinschätzung mit Klarthera
                </h2>
                <p className="text-base leading-relaxed text-muted">
                  Ein schneller Überblick, wie du in wenigen Schritten zu konkreten Empfehlungen kommst. Vollständig digital, sicher und begleitet.
                </p>
              </div>
              <Link
                href="/triage"
                className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Ablauf ansehen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {triagePreview.map((step) => (
                <div key={step.title} className="flex flex-col gap-4 rounded-2xl border border-divider bg-surface-1/90 p-6 shadow-sm shadow-primary/5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <step.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-neutral-900">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section id="blog" className="bg-surface-1 py-20" aria-labelledby="blog-preview-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <div className="space-y-3">
              <h2 id="blog-preview-title" className="text-3xl font-semibold text-neutral-900">
                Blog & Insights: Hinter den Kulissen von Klarthera
              </h2>
              <p className="text-base leading-relaxed text-muted md:max-w-xl">
                Updates aus Produktentwicklung, mentale Gesundheitsressourcen und Learnings aus dem Aufbau unseres Netzwerks – kompakt für Investor:innen, Partner und Teams.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-800 focus-visible:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Alle Beiträge ansehen
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {blogTeasers.map((post) => (
              <article
                key={post.slug}
                className="flex h-full flex-col justify-between rounded-2xl border border-divider bg-white/85 p-6 shadow-sm shadow-primary/5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-primary/20"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-subtle">
                    <span>{post.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" aria-hidden />
                      {blogDateFormatter.format(new Date(post.publishedAt))}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {post.readingTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900">
                    <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-primary">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">{post.excerpt}</p>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-800 focus-visible:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  >
                    Zum Artikel
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-surface-2/50 py-20" aria-labelledby="faq-title">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center space-y-3">
            <h2 id="faq-title" className="text-3xl font-semibold text-neutral-900">
              Häufige Fragen zur Demo & Plattform
            </h2>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted">
              Alle Antworten für Stakeholder, Investor:innen und Teams, die einen ersten Eindruck unserer Plattform gewinnen möchten.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-2xl border border-divider bg-white/80 p-6 shadow-sm shadow-primary/5 transition hover:border-primary/40"
              >
                <summary className="cursor-pointer text-lg font-semibold text-neutral-900">
                  {faq.question}
                </summary>
                <p className="mt-3 text-base leading-relaxed text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-secondary-50 via-primary-50 to-surface-1 py-20" aria-labelledby="cta-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-primary-600 via-primary-600 to-primary-700 px-8 py-12 text-center text-white shadow-[0_25px_55px_-25px_rgb(var(--color-primary-900))]">
            <h2 id="cta-title" className="text-3xl font-semibold tracking-tight">
              Bereit für den ersten klaren Schritt?
            </h2>
            <p className="mx-auto mt-4 max-w-prose text-lg md:text-xl leading-relaxed text-white">
              Starte mit einer kostenlosen Ersteinschätzung und erhalte Empfehlungen, die zu deiner Situation und deinem Tempo passen.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="btn btn-lg bg-white text-primary-700 hover:bg-primary-50 hover:text-primary-800 focus-visible:ring focus-visible:ring-primary-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Kostenlos starten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </>
  )
}
