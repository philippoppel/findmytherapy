import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowRight, Hash, Sparkles, ShieldCheck } from 'lucide-react';
import { blogPosts } from '@/lib/blogData';
import { NewsletterForm } from '@/app/components/forms/NewsletterForm';

type TagPageProps = {
  params: {
    tag: string;
  };
};

const dateFormatter = new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium' });

const slugifySegment = (value: string) => value.toLowerCase().replace(/\s+/g, '-');
const humanizeSlug = (slug: string) =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

function getUniqueTags() {
  const tags = new Set<string>();
  blogPosts.forEach((post) => post.tags?.forEach((tag) => tags.add(tag)));
  return Array.from(tags);
}

export function generateStaticParams() {
  return getUniqueTags().map((tag) => ({
    tag: slugifySegment(tag),
  }));
}

export function generateMetadata({ params }: TagPageProps): Metadata {
  const tagName = humanizeSlug(params.tag);
  const tagPosts = blogPosts.filter((post) =>
    post.tags?.some((tag) => slugifySegment(tag) === params.tag),
  );

  if (tagPosts.length === 0) {
    return {
      title: 'Tag nicht gefunden | FindMyTherapy Blog',
    };
  }

  const description = `Alle ${tagPosts.length} Beiträge mit dem Tag ${tagName}. Fachwissen zu mentaler Gesundheit, Produktentwicklung und Netzwerkaufbau.`;

  return {
    title: `${tagName} – Artikel & Deep Dives | FindMyTherapy Blog`,
    description,
    keywords: [
      tagName,
      'Psychotherapie',
      'mentale Gesundheit',
      'FindMyTherapy Blog',
      ...tagPosts.flatMap((p) => p.keywords?.slice(0, 2) || []),
    ]
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 12),
    openGraph: {
      title: `${tagName} – Artikel & Deep Dives | FindMyTherapy Blog`,
      description,
      type: 'website',
      locale: 'de_AT',
      siteName: 'FindMyTherapy',
      url: `https://findmytherapy.net/blog/tag/${params.tag}`,
      images: [
        {
          url: 'https://findmytherapy.net/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${tagName} – FindMyTherapy Blog`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tagName} – Artikel & Deep Dives`,
      description,
      images: ['https://findmytherapy.net/images/og-image.jpg'],
    },
    alternates: {
      canonical: `https://findmytherapy.net/blog/tag/${params.tag}`,
    },
  };
}

export default function TagPage({ params }: TagPageProps) {
  const tagSlug = params.tag;
  const tagName = humanizeSlug(tagSlug);

  const tagPosts = blogPosts.filter((post) =>
    post.tags?.some((tag) => slugifySegment(tag) === tagSlug),
  );

  if (tagPosts.length === 0) {
    notFound();
  }

  const tagCategories = Array.from(new Set(tagPosts.map((post) => post.category)));
  const heroStats = [
    { label: 'Artikel mit diesem Tag', value: String(tagPosts.length) },
    { label: 'Betroffene Kategorien', value: String(tagCategories.length) },
    {
      label: 'Letzte Veröffentlichung',
      value: dateFormatter.format(
        tagPosts
          .map((post) => new Date(post.publishedAt))
          .sort((a, b) => b.getTime() - a.getTime())[0],
      ),
    },
  ];

  // Schema.org structured data for SEO
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${tagName} – Artikel & Deep Dives | FindMyTherapy Blog`,
    description: `Alle Beiträge mit dem Tag ${tagName}`,
    url: `https://findmytherapy.net/blog/tag/${tagSlug}`,
    isPartOf: {
      '@type': 'Blog',
      name: 'FindMyTherapy Blog',
      url: 'https://findmytherapy.net/blog',
    },
    publisher: {
      '@type': 'Organization',
      name: 'FindMyTherapy',
      url: 'https://findmytherapy.net',
    },
    numberOfItems: tagPosts.length,
    hasPart: tagPosts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `https://findmytherapy.net/blog/${post.slug}`,
      datePublished: post.publishedAt,
      description: post.excerpt,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://findmytherapy.net',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://findmytherapy.net/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `#${tagName}`,
        item: `https://findmytherapy.net/blog/tag/${tagSlug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="marketing-theme bg-surface text-default">
        <main className="min-h-screen bg-surface pb-16 pt-10 sm:pb-24 sm:pt-16">
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
                <li className="font-medium text-neutral-700">#{tagName}</li>
              </ol>
            </nav>

            <header className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-primary-950 via-primary-800 to-indigo-900 px-6 py-12 text-white shadow-2xl shadow-primary-950/50 sm:px-12 sm:py-16">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#ffffff11,_transparent)]" />
              <div className="relative z-10 space-y-6">
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold uppercase tracking-widest text-white/80 sm:justify-start">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5">
                    <Sparkles className="h-4 w-4" aria-hidden />
                    Tag
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-1.5">
                    <ShieldCheck className="h-4 w-4" aria-hidden />
                    Kontext
                  </span>
                </div>
                <div className="space-y-4 text-center sm:text-left">
                  <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em]">
                    #{tagName}
                  </p>
                  <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                    Beiträge zu „{tagName}“
                  </h1>
                  <p className="mx-auto max-w-3xl text-lg text-white/90 sm:mx-0">
                    Wir verbinden Learnings aus Produkt, Forschung und therapeutischer Praxis. Alle
                    Artikel, die sich auf diesen Tag beziehen, findest du hier.
                  </p>
                </div>
                <dl className="grid gap-4 sm:grid-cols-3">
                  {heroStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 text-center shadow-lg shadow-black/10"
                    >
                      <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                        {stat.label}
                      </dt>
                      <dd className="mt-2 text-3xl font-bold text-white">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </header>

            <section aria-labelledby="tag-articles" className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-700">
                    Artikel
                  </p>
                  <h2
                    id="tag-articles"
                    className="text-2xl font-semibold text-neutral-900 sm:text-3xl"
                  >
                    Alle Beiträge mit #{tagName}
                  </h2>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900"
                >
                  Thema einsenden
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tagPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="group flex h-full flex-col justify-between rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-lg shadow-primary-900/10 transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-neutral-500">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-primary-900">
                          <Hash className="h-3.5 w-3.5" aria-hidden />
                          {tagName}
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
                      <h3 className="text-xl font-semibold text-neutral-900">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="transition group-hover:text-primary-700"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted">{post.excerpt}</p>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900"
                      >
                        Beitrag lesen
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section
              aria-labelledby="tag-categories"
              className="rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-lg shadow-primary-900/5 sm:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-700">
                Fokus
              </p>
              <h2 id="tag-categories" className="mt-2 text-2xl font-semibold text-neutral-900">
                In diesen Kategorien taucht #{tagName} auf
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {tagCategories.map((category) => (
                  <Link
                    key={category}
                    href={`/blog/category/${slugifySegment(category)}`}
                    className="rounded-full border border-primary-200 bg-white px-5 py-2 text-sm font-semibold text-primary-900 transition hover:-translate-y-0.5 hover:border-primary-300"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </section>

            <section aria-labelledby="all-tags" className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-700">
                    Alle Tags
                  </p>
                  <h2 id="all-tags" className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
                    Wechsle zu einem anderen Kontext
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900"
                >
                  Zurück zur Übersicht
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
              <div className="flex flex-wrap gap-3">
                {getUniqueTags().map((tag) => {
                  const slug = slugifySegment(tag);
                  const count = blogPosts.filter((post) => post.tags?.includes(tag)).length;
                  const isActive = slug === tagSlug;
                  return (
                    <Link
                      key={tag}
                      href={`/blog/tag/${slug}`}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        isActive
                          ? 'border-primary-400 bg-primary-50 text-primary-900'
                          : 'border-neutral-200 bg-white hover:border-primary-200 hover:text-primary-900'
                      }`}
                    >
                      #{tag} ({count})
                    </Link>
                  );
                })}
              </div>
            </section>

            <section
              aria-labelledby="tag-form"
              className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-primary-900 via-secondary-700 to-secondary-900 px-6 py-10 text-white shadow-2xl shadow-primary-900/50 sm:px-10"
            >
              <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/2 bg-[radial-gradient(circle_at_top,_#ffffff22,_transparent)] opacity-70" />
              <div className="relative z-10 grid gap-8 lg:grid-cols-2">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80">
                    Deine Fragen
                  </p>
                  <h2 id="tag-form" className="text-3xl font-semibold leading-tight">
                    Welches Update zu #{tagName} fehlt dir?
                  </h2>
                  <p className="text-sm text-white/90">
                    Ob Interviewpartner:in, Datenpunkt oder Produktfunktion – sag uns, was wir
                    beleuchten sollen. Wir melden uns mit einer persönlichen Antwort.
                  </p>
                </div>
                <NewsletterForm
                  variant="topic"
                  className="w-full"
                  title="Themenwunsch senden"
                  description="Fülle das kurze Formular aus – wir antworten mit einem konkreten Ansatz oder Termin."
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
