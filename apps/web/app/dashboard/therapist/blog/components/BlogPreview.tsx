'use client';

import Image from 'next/image';
import { X, ExternalLink, Tag, BookOpen } from 'lucide-react';

type Section = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

type Source = {
  title: string;
  url?: string;
  description?: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

type BlogPreviewProps = {
  title: string;
  excerpt: string;
  content: { sections: Section[] };
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  category?: string;
  keywords: string[];
  tags: string[];
  summaryPoints: string[];
  sources: Source[];
  faq?: FAQItem[];
  authorName?: string;
  authorImage?: string;
  authorTitle?: string;
  onClose: () => void;
};

const dateFormatter = new Intl.DateTimeFormat('de-AT', { dateStyle: 'long' });

export default function BlogPreview({
  title,
  excerpt,
  content,
  featuredImageUrl,
  featuredImageAlt,
  category,
  keywords,
  tags,
  summaryPoints,
  sources,
  faq,
  authorName = 'Autor:in',
  authorImage,
  authorTitle,
  onClose,
}: BlogPreviewProps) {
  const readingTime = Math.max(
    1,
    Math.ceil(
      content.sections.reduce((acc, section) => {
        const paragraphWords = section.paragraphs.join(' ').split(/\s+/).length;
        const listWords = (section.list || []).join(' ').split(/\s+/).length;
        return acc + paragraphWords + listWords;
      }, 0) / 200
    )
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Vorschau schließen"
      />

      {/* Preview Container */}
      <div className="absolute inset-4 md:inset-8 bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-4 text-sm text-neutral-500 font-mono">
              findmytherapy.net/blog/preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded">
              Vorschau-Modus
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-200 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-screen bg-white">
            <main className="mx-auto max-w-3xl px-4 sm:px-6">
              {/* Article Header */}
              <header className="py-8 sm:py-12 text-center">
                <p className="text-sm text-neutral-500 mb-4">
                  {category && <span>{category}</span>}
                  {category && <span aria-hidden="true"> · </span>}
                  <time>{dateFormatter.format(new Date())}</time>
                  <span aria-hidden="true"> · </span>
                  <span>{readingTime} Min. Lesezeit</span>
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">
                  {title || 'Titel des Beitrags'}
                </h1>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg text-neutral-600 leading-relaxed">
                  {excerpt || 'Kurze Beschreibung des Beitrags...'}
                </p>

                {/* Author */}
                <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3">
                  {authorImage ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-neutral-100">
                      <Image src={authorImage} alt={authorName} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {authorName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium text-neutral-900">{authorName}</p>
                    {authorTitle && <p className="text-sm text-neutral-500">{authorTitle}</p>}
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              {featuredImageUrl && (
                <figure className="mb-8 sm:mb-12 -mx-4 sm:mx-0">
                  <div className="relative aspect-[2/1] overflow-hidden sm:rounded-2xl bg-neutral-100">
                    <Image
                      src={featuredImageUrl}
                      alt={featuredImageAlt || title || 'Titelbild'}
                      fill
                      className="object-cover"
                    />
                  </div>
                </figure>
              )}

              {/* Article Body */}
              <div className="pb-8 sm:pb-16">
                {/* Key Takeaways */}
                {summaryPoints.length > 0 && (
                  <aside className="mb-8 sm:mb-12 p-4 sm:p-6 rounded-xl bg-neutral-50 border border-neutral-100">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-4">
                      Auf einen Blick
                    </h2>
                    <ul className="space-y-2 sm:space-y-3">
                      {summaryPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                          <span className="text-sm sm:text-base text-neutral-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </aside>
                )}

                {/* Content Sections */}
                <div className="prose prose-neutral prose-base sm:prose-lg max-w-none prose-headings:scroll-mt-24 prose-p:text-neutral-700 prose-li:text-neutral-700">
                  {content.sections.length > 0 ? (
                    content.sections.map((section, idx) => (
                      <section key={idx} className="mb-8 sm:mb-12">
                        {section.heading && (
                          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3 sm:mb-4">
                            {section.heading}
                          </h2>
                        )}
                        {section.paragraphs.map((paragraph, pIdx) => (
                          <p key={pIdx} className="leading-relaxed mb-4">
                            {paragraph || <span className="text-neutral-400 italic">Absatz...</span>}
                          </p>
                        ))}
                        {section.list && section.list.length > 0 && (
                          <ul className="my-4 space-y-2">
                            {section.list.map((item, lIdx) => (
                              <li key={lIdx} className="flex items-start gap-3">
                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-400" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </section>
                    ))
                  ) : (
                    <div className="text-center py-12 text-neutral-400">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Noch kein Inhalt. Fügen Sie Sektionen hinzu.</p>
                    </div>
                  )}
                </div>

                {/* FAQ */}
                {faq && faq.length > 0 && (
                  <section className="mt-12 pt-8 border-t border-neutral-100">
                    <h2 className="text-xl font-bold text-neutral-900 mb-6">
                      Häufig gestellte Fragen
                    </h2>
                    <div className="space-y-4">
                      {faq.map((item, idx) => (
                        <div key={idx} className="p-4 bg-neutral-50 rounded-xl">
                          <h3 className="font-semibold text-neutral-900 mb-2">{item.question}</h3>
                          <p className="text-neutral-600 text-sm">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Sources */}
                {sources.length > 0 && (
                  <section className="mt-12 pt-8 border-t border-neutral-100">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quellen</h2>
                    <ol className="space-y-2 text-sm">
                      {sources.map((source, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-neutral-600">
                          <span className="text-neutral-400">[{idx + 1}]</span>
                          <div>
                            <span className="font-medium">{source.title}</span>
                            {source.url && (
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-primary-600 hover:underline inline-flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {source.description && (
                              <span className="text-neutral-500"> - {source.description}</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}

                {/* Tags */}
                {(tags.length > 0 || keywords.length > 0) && (
                  <section className="mt-8 pt-6 border-t border-neutral-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-4 h-4 text-neutral-400" />
                      {[...tags, ...keywords].slice(0, 8).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </main>

            {/* Preview CTA Banner (wie im echten Blog) */}
            <section className="border-t border-neutral-100 py-10 bg-neutral-50">
              <div className="mx-auto max-w-3xl text-center px-4">
                <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                  Bereit für den nächsten Schritt?
                </h2>
                <p className="text-neutral-600 mb-6">
                  Finde professionelle Unterstützung, die zu dir passt.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <span className="px-6 py-3 rounded-lg bg-neutral-900 text-white font-medium">
                    Therapeut:innen durchsuchen
                  </span>
                  <span className="px-6 py-3 rounded-lg border border-neutral-200 text-neutral-700 font-medium">
                    Ersteinschätzung starten
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
