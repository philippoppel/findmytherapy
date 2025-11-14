import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, ArrowRight, Sparkles, ShieldCheck, Tag } from 'lucide-react'
import { blogPosts } from '@/lib/blogData'
import { NewsletterForm } from '@/app/components/forms/NewsletterForm'

type CategoryPageProps = {
  params: {
    category: string
  }
}

const dateFormatter = new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium' })

const slugifySegment = (value: string) => value.toLowerCase().replace(/\s+/g, '-')
const humanizeSlug = (slug: string) =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

function getUniqueCategories() {
  return Array.from(new Set(blogPosts.map((post) => post.category)))
}

export function generateStaticParams() {
  return getUniqueCategories().map((category) => ({
    category: slugifySegment(category),
  }))
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const categoryName = humanizeSlug(params.category)
  const categoryPosts = blogPosts.filter((post) => slugifySegment(post.category) === params.category)

  if (categoryPosts.length === 0) {
    return {
      title: 'Kategorie nicht gefunden | FindMyTherapy Blog',
    }
  }

  return {
    title: `${categoryName} – Insights | FindMyTherapy Blog`,
    description: `Alle Artikel zum Fokusbereich ${categoryName}. Evidenzbasierte Perspektiven von FindMyTherapy.`,
    openGraph: {
      title: `${categoryName} – Insights`,
      description: `Alle Artikel zum Fokusbereich ${categoryName}`,
      type: 'website',
    },
    alternates: {
      canonical: `https://findmytherapy.net/blog/category/${params.category}`,
    },
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categorySlug = params.category
  const categoryName = humanizeSlug(categorySlug)

  const categoryPosts = blogPosts.filter((post) => slugifySegment(post.category) === categorySlug)
  if (categoryPosts.length === 0) {
    notFound()
  }

  const highlightPosts = categoryPosts.slice(0, 3)
  const remainingPosts = categoryPosts.slice(3)

  const updatedDates = categoryPosts.map((post) => new Date(post.updatedAt ?? post.publishedAt))
  const lastUpdate = updatedDates.sort((a, b) => b.getTime() - a.getTime())[0]

  const relatedTags = Array.from(new Set(categoryPosts.flatMap((post) => post.tags || [])))
  const heroStats = [
    { label: 'Artikel im Fokus', value: String(categoryPosts.length) },
    { label: 'Letzte Aktualisierung', value: dateFormatter.format(lastUpdate) },
    { label: 'Tags in diesem Themenfeld', value: String(relatedTags.length || '—') },
  ]

  return (
    <div className="marketing-theme bg-surface text-default">
      <div className="min-h-screen bg-surface pb-16 pt-10 sm:pb-24 sm:pt-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-14 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-neutral-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="font-semibold text-primary-900">
                Home
              </Link>
            </li>
            <li className="text-neutral-400">/</li>
            <li>
              <Link href="/blog" className="font-semibold text-primary-900">
                Blog
              </Link>
            </li>
            <li className="text-neutral-400">/</li>
            <li className="font-medium text-neutral-700">{categoryName}</li>
          </ol>
        </nav>

        <header className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-primary-950 via-primary-800 to-indigo-900 px-6 py-12 text-white shadow-2xl shadow-primary-950/50 sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-64 w-[90%] rounded-full bg-primary-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 hidden h-40 w-40 rounded-full bg-white/10 blur-2xl sm:block" />
          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold uppercase tracking-widest text-white/80 sm:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5">
                <Sparkles className="h-4 w-4" aria-hidden />
                Fokusbereich
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-1.5">
                <ShieldCheck className="h-4 w-4" aria-hidden />
                Verifiziertes Wissen
              </span>
            </div>
            <div className="space-y-4 text-center sm:text-left">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em]">
                {categoryName}
              </p>
              <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Alle {categoryName}-Artikel auf einen Blick
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-white/90 sm:mx-0">
                Kategoriespezifische Recherchen, Interviews und Produkt-Einblicke. Wir zeigen den aktuellen Stand
                unserer Arbeit und welche Fragen wir gemeinsam mit Expert:innen beantworten.
              </p>
            </div>
            <dl className="grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 text-center shadow-lg shadow-black/10">
                  <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">{stat.label}</dt>
                  <dd className="mt-2 text-3xl font-bold text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <section aria-labelledby="highlighted-articles" className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-700">Highlights</p>
              <h2 id="highlighted-articles" className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                Top-Beiträge dieser Kategorie
              </h2>
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900">
              Frage zu {categoryName}? <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlightPosts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-lg shadow-primary-900/10 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-neutral-500">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-primary-900">
                    <Tag className="h-3.5 w-3.5" aria-hidden />
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" aria-hidden />
                    {dateFormatter.format(new Date(post.publishedAt))}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {post.readingTime}
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-neutral-900">
                    <Link href={`/blog/${post.slug}`} className="transition group-hover:text-primary-700">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-neutral-600">{post.excerpt}</p>
                </div>
                <div className="mt-auto pt-3">
                  <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-primary-900">
                    Weiterlesen →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {remainingPosts.length > 0 && (
          <section aria-labelledby="more-articles" className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-700">Weitere Einblicke</p>
              <h2 id="more-articles" className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                Mehr Lesestoff aus {categoryName}
              </h2>
            </div>
            <div className="space-y-4">
              {remainingPosts.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-3xl border border-neutral-200 bg-white/80 p-5 shadow-sm shadow-primary-900/5 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg"
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                    <span>{dateFormatter.format(new Date(post.publishedAt))}</span>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                    {post.tags?.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full bg-primary-50 px-3 py-1 font-semibold text-primary-900">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">
                        <Link href={`/blog/${post.slug}`} className="transition hover:text-primary-700">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-neutral-600">{post.summary[0]}</p>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900">
                      Mehr erfahren
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="related-tags" className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-700">Verwandte Tags</p>
              <h2 id="related-tags" className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                Weitere Blickwinkel entdecken
              </h2>
            </div>
            <Link href="/blog/tag/pilot" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900">
              Pilotphase begleiten
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {relatedTags.length === 0 && <span className="text-sm text-neutral-500">Noch keine Tags vorhanden.</span>}
            {relatedTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${slugifySegment(tag)}`}
                className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-900 shadow-sm shadow-primary-900/5 transition hover:-translate-y-0.5 hover:border-primary-300"
              >
                #{tag}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="all-categories" className="rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-lg shadow-primary-900/5 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-700">Alle Kategorien</p>
          <h2 id="all-categories" className="mt-2 text-2xl font-semibold text-neutral-900">
            Wechsel den Fokus
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {getUniqueCategories().map((category) => {
              const slug = slugifySegment(category)
              return (
                <Link
                  key={category}
                  href={`/blog/category/${slug}`}
                  className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                    slug === categorySlug
                      ? 'border-primary-300 bg-primary-50 text-primary-900'
                      : 'border-neutral-200 bg-white hover:border-primary-200 hover:text-primary-900'
                  }`}
                >
                  {category}
                </Link>
              )
            })}
          </div>
        </section>

        <section
          aria-labelledby="category-contact"
          className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-primary-900 via-secondary-700 to-secondary-900 px-6 py-10 text-white shadow-2xl shadow-primary-900/50 sm:px-10"
        >
          <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/2 bg-[radial-gradient(circle_at_top,_#ffffff22,_transparent)] opacity-70" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80">Wir hören zu</p>
              <h2 id="category-contact" className="text-3xl font-semibold leading-tight">
                Du möchtest in {categoryName} tiefer eintauchen?
              </h2>
              <p className="text-sm text-white/90">
                Teile deinen Themenwunsch, schick eine Research-Frage oder sichere dir die ersten Updates zur Produkt-Roadmap. Wir antworten persönlich.
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-white/80">
                <span className="rounded-full border border-white/30 px-4 py-1">Antwort in &lt; 24h</span>
                <span className="rounded-full border border-white/30 px-4 py-1">Kein Spam, DSGVO-konform</span>
              </div>
            </div>
            <NewsletterForm variant="topic" className="w-full" />
          </div>
        </section>
        </div>
      </div>
    </div>
  )
}
