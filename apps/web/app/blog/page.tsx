import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Calendar, Clock, Tag, Sparkles, ShieldCheck } from 'lucide-react'
import { blogPosts } from '../../lib/blogData'
import { NewsletterForm } from '@/app/components/forms/NewsletterForm'

const pageDescription =
  'Deep Dives zu mentaler Gesundheit, Produkt-Updates und Einblicke in unser Therapeut:innen-Netzwerk – direkt aus dem FindMyTherapy Team.'

export const metadata: Metadata = {
  title: 'Blog & Insights | FindMyTherapy',
  description: pageDescription,
  keywords: [
    'FindMyTherapy Blog',
    'mentale Gesundheit Österreich',
    'digitale Ersteinschätzung',
    'Therapeut:innen Matching',
    'Psychotherapie Informationen',
    'Mental Health Workplace',
  ],
  alternates: {
    canonical: 'https://findmytherapy.net/blog',
    languages: {
      'de-AT': 'https://findmytherapy.net/blog',
      'de-DE': 'https://findmytherapy.net/de/blog',
    },
  },
  openGraph: {
    title: 'FindMyTherapy Blog & Insights',
    description: pageDescription,
    type: 'website',
    url: 'https://findmytherapy.net/blog',
    locale: 'de_AT',
    siteName: 'FindMyTherapy',
    images: [
      {
        url: 'https://findmytherapy.net/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FindMyTherapy Blog – Mentale Gesundheit und Produkt-Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FindMyTherapy Blog & Insights',
    description: pageDescription,
    creator: '@findmytherapy',
    images: ['https://findmytherapy.net/images/og-image.jpg'],
  },
}

const dateFormatter = new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium' })

// Dynamic stats calculation
const totalArticles = blogPosts.length
const uniqueCategories = Array.from(new Set(blogPosts.map((post) => post.category))).length
const avgReadingTime = Math.round(
  blogPosts.reduce((sum, post) => {
    const minutes = parseInt(post.readingTime.replace(/[^\d]/g, ''), 10)
    return sum + minutes
  }, 0) / blogPosts.length
)

const heroStats = [
  { label: 'Expertenwissen-Artikel', value: String(totalArticles) },
  { label: 'Themenbereiche', value: String(uniqueCategories) },
  { label: 'Durchschn. Lesezeit', value: `~${avgReadingTime} Min.` },
]

const blogFaq = [
  {
    question: 'Welche Themen deckt der FindMyTherapy Blog ab?',
    answer:
      'Wir schreiben über digitale Ersteinschätzung, therapeutische Qualitätskriterien, Unternehmensprogramme sowie praktische Tipps für Betroffene und Angehörige.',
  },
  {
    question: 'Wie häufig veröffentlichen wir neue Beiträge?',
    answer:
      'Mehrmals pro Monat – sobald wir neue Interviews, Produktfeatures oder Studien ausgewertet haben.',
  },
  {
    question: 'Kann ich Themenwünsche einsenden?',
    answer:
      'Ja, nutze das Themenwunsch-Formular weiter oben auf dieser Seite oder schreibe direkt an hello@findmytherapy.net. Wir priorisieren Fragen aus der Community.',
  },
]

const topicHighlights = [
  {
    title: 'Digitale Ersteinschätzung',
    description: 'Validierte Fragebögen (PHQ-9, GAD-7) und wie wir Ergebnisse in Empfehlungen übersetzen.',
    tag: 'Screenings',
  },
  {
    title: 'Therapeut:innen-Netzwerk',
    description: 'Transparente Qualitätskriterien, Onboarding-Prozesse und Einblicke in die Beta-Phase.',
    tag: 'Qualität',
  },
  {
    title: 'Mental Health @ Work',
    description: 'Wie Organisationen Benefits implementieren und anonym Feedback erhalten.',
    tag: 'Future of Work',
  },
]

const categories = Array.from(new Set(blogPosts.map((post) => post.category)))
const categoryToSlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-')

const blogStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'FindMyTherapy Blog & Insights',
  description: pageDescription,
  url: 'https://findmytherapy.net/blog',
  inLanguage: 'de-AT',
  publisher: {
    '@type': 'Organization',
    name: 'FindMyTherapy',
    url: 'https://findmytherapy.net',
  },
  blogPost: blogPosts.map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    url: `https://findmytherapy.net/blog/${post.slug}`,
    image: post.featuredImage?.src,
    keywords: post.keywords,
  })),
}

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'FindMyTherapy',
      item: 'https://findmytherapy.net',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog & Insights',
      item: 'https://findmytherapy.net/blog',
    },
  ],
}

export default function BlogPage() {
  const [featuredPost, ...restPosts] = blogPosts

  const insightsByCategory = categories.map((category) => ({
    category,
    posts: restPosts.filter((post) => post.category === category).slice(0, 3),
  }))

  const essentialArticles = restPosts.slice(0, 6)

  return (
    <div className="marketing-theme bg-surface text-default">
      <div className="min-h-screen bg-surface pb-16 pt-10 sm:pb-24 sm:pt-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 sm:px-6 lg:px-8">
          <header className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 px-6 py-14 text-white shadow-2xl shadow-primary-950/40 sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-56 w-[90%] rounded-full bg-primary-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 top-10 hidden h-40 w-40 rounded-full bg-white/15 blur-2xl sm:block" />

          <div className="relative z-10 flex flex-col gap-8 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold uppercase tracking-widest text-white/80">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2">
                <Sparkles className="h-4 w-4" aria-hidden />
                Insights & Stories
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-2">
                <ShieldCheck className="h-4 w-4" aria-hidden />
                Evidenzbasiert
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Das Magazin für mentale Gesundheit, Produktinnovation & Vertrauen
              </h1>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl">
                Wir dokumentieren jeden Schritt auf dem Weg zu einer modernen Versorgung in Österreich: von
                digitalen Ersteinschätzungen über Matching-Logiken bis zu Erfahrungen aus Pilotunternehmen.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
              <a
                href="#themenwunsch"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3 text-base font-semibold text-primary-900 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:shadow-2xl sm:w-auto"
              >
                Themenwunsch einreichen
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <Link
                href="/how-it-works"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-3 text-base font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:border-white/60 sm:w-auto"
              >
                Unser Ansatz
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            <dl className="mt-6 grid gap-6 text-left sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-white/20 bg-white/10 px-6 py-5 text-center shadow-lg backdrop-blur"
                >
                  <dt className="text-sm font-semibold uppercase tracking-widest text-white/75">{stat.label}</dt>
                  <dd className="mt-2 text-3xl font-bold text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <section aria-labelledby="highlighted-post" className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <h2 id="highlighted-post" className="sr-only">
            Highlight-Beitrag
          </h2>
          <article className="relative overflow-hidden rounded-3xl border border-primary-100/60 bg-white shadow-2xl shadow-primary-900/10 transition hover:-translate-y-1 hover:shadow-primary-900/20">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url(${featuredPost.featuredImage.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              aria-hidden
            />
            <div className="relative z-10 grid gap-6 bg-gradient-to-br from-white via-white/90 to-primary-50 p-8 sm:p-10">
              <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-primary-800">
                  <Tag className="h-4 w-4" aria-hidden />
                  {featuredPost.category}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden />
                  {dateFormatter.format(new Date(featuredPost.publishedAt))}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" aria-hidden />
                  {featuredPost.readingTime}
                </span>
              </div>
              <div className="space-y-4">
                <h3 className="text-pretty text-3xl font-semibold text-neutral-900 sm:text-4xl">
                  <Link href={`/blog/${featuredPost.slug}`} className="transition hover:text-primary-700">
                    {featuredPost.title}
                  </Link>
                </h3>
                <p className="text-base leading-relaxed text-neutral-700">{featuredPost.excerpt}</p>
              </div>
              <div className="flex flex-col gap-5 rounded-2xl border border-primary-100/70 bg-white/80 p-5 text-sm text-neutral-700 md:flex-row md:items-start md:gap-6">
                <div className="flex-1 space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">
                    Was du mitnimmst
                  </div>
                  <ul className="space-y-2">
                    {featuredPost.summary.slice(0, 3).map((item) => (
                      <li key={item} className="flex gap-2 text-sm">
                        <span className="text-primary-600">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-1 flex-col gap-3 rounded-2xl bg-primary-900/5 p-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">Autor:in</span>
                  <div>
                    <p className="text-base font-semibold text-neutral-900">{featuredPost.author}</p>
                    <p className="text-sm text-neutral-600">FindMyTherapy Redaktion</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-primary-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-900/40 transition hover:-translate-y-0.5"
                >
                  Beitrag lesen
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href={`/blog/category/${categoryToSlug(featuredPost.category)}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900"
                >
                  Mehr aus {featuredPost.category}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </article>

          <div className="space-y-6 rounded-3xl border border-primary-100/60 bg-white p-8 shadow-xl shadow-primary-900/5">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">Wofür wir stehen</p>
              <p className="text-lg font-semibold text-neutral-900">
                Journalistisches Storytelling trifft medizinische Prüfung und Produkttransparenz.
              </p>
            </div>
            <div className="grid gap-4">
              {topicHighlights.map((topic) => (
                <div key={topic.title} className="rounded-2xl border border-primary-100/60 bg-primary-50/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">{topic.tag}</p>
                  <h3 className="mt-2 text-lg font-semibold text-neutral-900">{topic.title}</h3>
                  <p className="mt-1 text-sm text-neutral-600">{topic.description}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-dashed border-primary-200/80 bg-primary-50/30 p-5 text-sm text-neutral-700">
              Du möchtest Updates automatisch erhalten? <br />
              <Link href="/contact" className="font-semibold text-primary-900">
                Kontakt aufnehmen →
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="category-navigation" className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-700">Themenbereiche</p>
            <h2 id="category-navigation" className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
              Navigiere durch unsere Fokusfelder
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                href={`/blog/category/${categoryToSlug(category)}`}
                key={category}
                className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-5 py-2 text-sm font-semibold text-primary-900 shadow-sm shadow-primary-900/5 transition hover:-translate-y-0.5 hover:border-primary-300"
              >
                {category}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="latest-articles" className="space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-700">Aktuell</p>
            <h2 id="latest-articles" className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
              Essentielle Artikel für einen schnellen Überblick
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {essentialArticles.map((post) => (
              <article
                key={post.slug}
                className="group flex h-full flex-col justify-between rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-lg shadow-primary-900/10 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-neutral-500">
                    <span className="rounded-full bg-primary-50 px-3 py-1 text-primary-900">{post.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" aria-hidden />
                      {dateFormatter.format(new Date(post.publishedAt))}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {post.readingTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900">
                    <Link href={`/blog/${post.slug}`} className="transition group-hover:text-primary-700">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600">{post.excerpt}</p>
                </div>
                <div className="mt-6 border-t border-neutral-100 pt-4">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900"
                  >
                    Weiterlesen
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="category-deep-dives" className="space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-700">Deep Dives</p>
            <h2 id="category-deep-dives" className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
              Kuration pro Themenwelt
            </h2>
          </div>
          <div className="space-y-6">
            {insightsByCategory.map(({ category, posts }) =>
              posts.length === 0 ? null : (
                <div
                  key={category}
                  className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-lg shadow-primary-900/5 sm:p-8"
                >
                  <div className="flex flex-col gap-3 border-b border-neutral-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">Kategorie</p>
                      <h3 className="text-xl font-semibold text-neutral-900">{category}</h3>
                    </div>
                    <Link
                      href={`/blog/category/${categoryToSlug(category)}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900"
                    >
                      Alle Artikel ansehen
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                  <div className="mt-6 grid gap-6 sm:grid-cols-3">
                    {posts.map((post) => (
                      <article key={post.slug} className="flex flex-col gap-3 rounded-2xl bg-primary-50/70 p-4">
                        <div className="text-xs font-semibold text-primary-700">
                          {dateFormatter.format(new Date(post.publishedAt))} · {post.readingTime}
                        </div>
                        <h4 className="text-lg font-semibold text-neutral-900">
                          <Link href={`/blog/${post.slug}`} className="transition hover:text-primary-700">
                            {post.title}
                          </Link>
                        </h4>
                        <p className="text-sm text-neutral-600">{post.summary[0]}</p>
                        <div className="mt-auto pt-2">
                          <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-primary-900">
                            Mehr erfahren →
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        <section
          id="themenwunsch"
          aria-labelledby="topic-request-cta"
          className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-secondary-900 via-secondary-700 to-primary-700 px-6 py-12 text-white shadow-2xl shadow-secondary-900/40 sm:px-10"
        >
          <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/2 bg-[radial-gradient(circle_at_top,_#ffffff33,_transparent)] opacity-70" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80">Community-Input</p>
              <h2 id="topic-request-cta" className="text-3xl font-semibold leading-tight">
                Deine Fragen – unsere Artikel
              </h2>
              <p className="text-base text-white/90">
                Du vermisst ein Thema oder hast eine konkrete Frage zu mentaler Gesundheit, digitaler Ersteinschätzung
                oder unserem Matching-Algorithmus? Sag uns, was dich interessiert – wir bereiten fundierte Artikel mit
                Expert:innen-Input vor.
              </p>
            </div>
            <NewsletterForm variant="topic" className="w-full lg:w-96" />
          </div>
        </section>

        <section
          aria-labelledby="newsletter-cta"
          className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-primary-900 via-primary-700 to-secondary-700 px-6 py-12 text-white shadow-2xl shadow-primary-900/40 sm:px-10"
        >
          <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/2 bg-[radial-gradient(circle_at_top,_#ffffff33,_transparent)] opacity-70" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80">Newsletter</p>
              <h2 id="newsletter-cta" className="text-3xl font-semibold leading-tight">
                Keine Launches, keine Studien – ohne dich
              </h2>
              <p className="text-base text-white/90">
                Wir senden eine monatliche Kurzzusammenfassung zu neuen Blogbeiträgen, Produkt-Meilensteinen und
                mental-health-relevanten Studien. Transparent, kuratiert und ohne Marketing-Blabla.
              </p>
            </div>
            <NewsletterForm variant="newsletter" className="w-full lg:w-96" />
          </div>
        </section>

        <section aria-labelledby="blog-faq" className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-lg shadow-primary-900/5 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-700">FAQ</p>
          <h2 id="blog-faq" className="mt-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
            Häufige Fragen zum Blog
          </h2>
          <div className="mt-8 space-y-6">
            {blogFaq.map((item) => (
              <div key={item.question} className="rounded-2xl border border-neutral-100 bg-neutral-50/80 p-5">
                <h3 className="text-lg font-semibold text-neutral-900">{item.question}</h3>
                <p className="mt-2 text-sm text-neutral-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="seo-copy" className="space-y-4 text-sm leading-relaxed text-neutral-600">
          <h2 id="seo-copy" className="text-base font-semibold text-neutral-900">
            Warum der FindMyTherapy Blog relevant für SEO & Vertrauen ist
          </h2>
          <p>
            Bei jeder Veröffentlichung prüfen wir Fakten mit unseren Netzwerk-Expert:innen, verlinken auf
            Primärquellen (Studien, Gesetzestexte, Leitlinien) und liefern konkrete Handlungsempfehlungen für
            Hilfesuchende, Angehörige und Unternehmen. Damit senden wir klare Signale an Suchmaschinen:
            E-E-A-T wird ernst genommen. Jede Seite verfügt über strukturierte Daten, präzise Keywords in
            Überschriften und aussagekräftige Meta-Beschreibungen.
          </p>
          <p>
            Unser Ziel: Menschen in Österreich sollen beim Googlen von «digitale Ersteinschätzung», «Therapeut
            finden» oder «Mental Health Benefit» zuerst auf glaubwürdige Ressourcen stoßen – und genau das ist
            dieser Blog.
          </p>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
    </div>
  </div>
  )
}
