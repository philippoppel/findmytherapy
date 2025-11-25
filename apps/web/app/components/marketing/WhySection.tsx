'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button, cn } from '@mental-health/ui';
import type { whyContent } from '../../marketing-content';
import { Reveal } from './Reveal';

interface WhySectionProps {
  content: typeof whyContent;
}

export function WhySection({ content }: WhySectionProps) {
  return (
    <section id={content.id} aria-labelledby="why-heading" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
          <Reveal
            className="relative order-2 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900/90 via-secondary-800/90 to-primary-900/90 shadow-xl lg:order-1"
            variant="scale"
          >
            <div className="absolute inset-0">
              <Image
                src={content.image.src}
                alt={content.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-70"
                priority={false}
              />
            </div>
            <div className="relative flex h-full flex-col justify-end gap-6 p-10 text-white backdrop-blur-sm">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                Entwickelt mit Expert:innen
              </div>
              <p className="text-lg leading-relaxed text-white/85">
                FindMyTherapy verbindet klinische Erfahrung, Forschung und technologische Umsetzung.
                Gemeinsam mit österreichischen Praxen, Kliniken und Krisendiensten testen wir jede
                Ausbaustufe.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <Avatar initials="SM" />
                  <Avatar initials="JH" />
                  <Avatar initials="PL" />
                </div>
                <p className="text-sm text-white/70">Selin, Jan &amp; Petronel – Founding Team</p>
              </div>
            </div>
          </Reveal>

          <Reveal className="order-1 space-y-6 lg:order-2">
            <span className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Warum FindMyTherapy?
            </span>
            <h2
              id="why-heading"
              className="text-pretty text-3xl font-semibold tracking-tight text-default sm:text-4xl"
            >
              {content.title}
            </h2>
            <p className="text-pretty text-lg leading-relaxed text-muted">{content.description}</p>
            <ul className="space-y-3 sm:space-y-4">
              {content.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-2.5 rounded-2xl border border-divider bg-white px-3 py-2.5 text-sm leading-relaxed text-default shadow-sm sm:gap-3 sm:px-4 sm:py-3 sm:text-base"
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary sm:mt-1 sm:h-6 sm:w-6 sm:text-sm">
                    ✓
                  </span>
                  <span className="text-pretty">{bullet}</span>
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-4 w-fit">
              <Link href={content.cta.href}>{content.cta.label}</Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <span
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 text-sm font-semibold text-white/90 backdrop-blur',
      )}
    >
      {initials}
    </span>
  );
}
